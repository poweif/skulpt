var $builtinmodule = function(name) {
    var mod = {};

    var makeFailHTML = function(msg) {
        return '' +
            '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
            '<td align="center">' +
            '<div style="display: table-cell; vertical-align: middle;">' +
            '<div style="">' + msg + '</div>' +
            '</div>' +
            '</td></tr></table>';
    };

    var GET_A_WEBGL_BROWSER = '' +
        'This page requires a browser that supports WebGL.<br/>' +
        '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

    var NEED_HARDWARE = '' +
        "It doesn't appear your computer can support WebGL.<br/>" +
        '<a href="http://get.webgl.org">Click here for more information.</a>';

    var create3DContext = function(canvas) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        var gl = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                gl = canvas.getContext(names[ii]);
            }
            catch(e) {
            }
            if (gl) {
                break;
            }
        }
        if (gl) {
            // Disallow selection by default. This keeps the cursor from changing to an
            // I-beam when the user clicks and drags. It's easier on the eyes.
            function returnFalse() {
                return false;
            }

            canvas.onselectstart = returnFalse;
            canvas.onmousedown = returnFalse;
        }
        return gl;
    };

    var setupWebGL = function(canvasContainerId, opt_canvas) {
        var container = document.getElementById(canvasContainerId);
        var context;
        if (!opt_canvas) {
            opt_canvas = container.getElementsByTagName("canvas")[0];
        }
        if (!opt_canvas) {
            // this browser doesn't support the canvas tag at all. Not even 2d.
            container.innerHTML = makeFailHTML(GET_A_WEBGL_BROWSER);
            return;
        }
        var gl = create3DContext(opt_canvas);
        if (!gl) {
            // TODO(gman): fix to official way to detect that it's the user's machine, not the browser.
            var browserStrings = navigator.userAgent.match(/(\w+\/.*? )/g);
            var browsers = {};
            try {
                for (var b = 0; b < browserStrings.length; ++b) {
                    var parts = browserStrings[b].match(/(\w+)/g);
                    var bb = [];
                    for (var ii = 1; ii < parts.length; ++ii) {
                        bb.push(parseInt(parts[ii]));
                    }
                    browsers[parts[0]] = bb;
                }
            }
            catch (e) {
            }

            if (container) {
                if (browsers.Chrome &&
                    (browsers.Chrome[0] > 7 ||
                     (browsers.Chrome[0] == 7 && browsers.Chrome[1] > 0) ||
                     (browsers.Chrome[0] == 7 && browsers.Chrome[1] == 0 &&
                      browsers.Chrome[2] >= 521))) {
                    container.innerHTML = makeFailHTML(NEED_HARDWARE);
                }
                else {
                    container.innerHTML = makeFailHTML(GET_A_WEBGL_BROWSER);
                }
            }
        }
        return gl;
    };

    mod.contextFromId = new Sk.builtin.func(function(canvasId) {
        var canvas = document.getElementById(canvasId.v);
        if (canvas) {
            return Sk.misceval.callsim(mod.context, canvas);
        }
        return Sk.builtin.none;
    });

    /**
     * The Context encapsulates the underlying WebGL native JavaScript API.
     */
    mod.context = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(
            function(self, canvas) {
                var gl = setupWebGL(null, canvas);
                if (!gl) {
                    throw new Error("Your browser does not appear to support WebGL.");
                }

                self.gl = gl;
                self.canvas = canvas;

                // Copy symbolic constants and functions from native WebGL, encapsulating where necessary.
                for (var k in gl.__proto__) {
                    // To bypass a bug in mozilla's implementation.  We don't need access to canvas from here
                    // anyways.
                    if (k === "canvas" || k === "drawingBufferWidth" || k === "drawingBufferHeight")
                        continue;

                    if (typeof gl.__proto__[k] === 'number') {
                        Sk.abstr.objectSetItem(self['$d'], new Sk.builtin.str(k), gl.__proto__[k]);
                    }
                    else if (typeof gl.__proto__[k] === "function") {
                        switch(k) {
                        case 'bufferData':
                        case 'clearColor':
                        case 'drawArrays':
                        case 'drawElements':
                        case 'getAttribLocation':
                        case 'getUniformLocation':
                        case 'shaderSource':
                        case 'uniformMatrix4fv':
                        case 'uniform4f':
                        case 'vertexAttribPointer':
                        case 'viewport':
                            break;
                        default: {
                            (function(key) {
                                Sk.abstr.objectSetItem(
                                    self['$d'],
                                    new Sk.builtin.str(key),
                                    new Sk.builtin.func(function() {
                                        var f = gl.__proto__[key];
                                        return f.apply(gl, arguments);
                                    })
                                );
                            }(k));
                        }
                        }
                    }
                }

                Sk.abstr.objectSetItem(self['$d'], new Sk.builtin.str("FALSE"), false);
                Sk.abstr.objectSetItem(self['$d'], new Sk.builtin.str("TRUE"), true);

                gl.clearColor(.85, .85, .85, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
        );

        $loc.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;

        $loc.bufferData = new Sk.builtin.func(
            function(self, target, data, usage) {
                self.gl.bufferData(target, data.v, usage);
            }
        );

        $loc.clearColor = new Sk.builtin.func(
            function(self, red, green, blue, alpha) {
                self.gl.clearColor(Sk.builtin.asnum$(red),
                                   Sk.builtin.asnum$(green),
                                   Sk.builtin.asnum$(blue),
                                   Sk.builtin.asnum$(alpha));
            }
        );

        $loc.getAttribLocation = new Sk.builtin.func(
            function(self, program, name) {
                return self.gl.getAttribLocation(program, name.v);
            }
        );

        $loc.getUniformLocation = new Sk.builtin.func(
            function(self, program, name) {
                return self.gl.getUniformLocation(program, name.v);
            }
        );

        $loc.shaderSource = new Sk.builtin.func(
            function(self, shader, src) {
                self.gl.shaderSource(shader, src.v);
            }
        );

        $loc.drawArrays = new Sk.builtin.func(
            function(self, mode, first, count) {
                self.gl.drawArrays(Sk.builtin.asnum$(mode), Sk.builtin.asnum$(first), Sk.builtin.asnum$(count));
            }
        );

        $loc.drawElements = new Sk.builtin.func(
            function(self, mode, count, type, offset) {
                self.gl.drawElements(
                    Sk.builtin.asnum$(mode),
                    Sk.builtin.asnum$(count),
                    type,
                    Sk.builtin.asnum$(offset));
            }
        );

        $loc.vertexAttribPointer = new Sk.builtin.func(
            function(self, index, size, type, normalized, stride, dunno) {
                self.gl.vertexAttribPointer(
                    Sk.builtin.asnum$(index),
                    Sk.builtin.asnum$(size),
                    type,
                    normalized,
                    Sk.builtin.asnum$(stride),
                    Sk.builtin.asnum$(dunno));
            }
        );

        $loc.viewport = new Sk.builtin.func(
            function(self, x, y, width, height) {
                self.gl.viewport(Sk.builtin.asnum$(x), Sk.builtin.asnum$(y), Sk.builtin.asnum$(width), Sk.builtin.asnum$(height));
            }
        );

        $loc.uniformMatrix4fv = new Sk.builtin.func(
            function(self, location, transpose, values) {
                self.gl.uniformMatrix4fv(Sk.builtin.asnum$(location), transpose.v, values.v);
            }
        );

        $loc.uniformVec4 = new Sk.builtin.func(
            function(self, location, v) {
                self.gl.uniform4f(Sk.builtin.asnum$(location), v.v.x, v.v.y, v.v.z, v.v.w);
            }
        );

        $loc.uniformVec3 = new Sk.builtin.func(
            function(self, location, v) {
                self.gl.uniform3f(Sk.builtin.asnum$(location), v.v.x, v.v.y, v.v.z);
            }
        );
    }, 'Context', []);

    mod.glutCreateWindow = new Sk.builtin.func(function() {
        var canvas = Sk.createDomCanvas();
        var context = Sk.misceval.callsim(mod.context, canvas.dom);
        var glut = Sk.misceval.callsim(mod.glut, context);
        return new Sk.builtin.tuple([context, glut]);
    });

    mod.glut = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(
            function(self, glcontext) {
                self.canvas = glcontext.canvas;
                self.left = 0;
                self.top = 0;

                self.runResize = null;
                self.defaultResizeFunc = function() {
                    if (self.runResize) {
                        clearTimeout(self.runResize)
                    }

                    self.runResize = setTimeout(function() {
                        var rect = self.canvas.getBoundingClientRect();
                        self.left = rect.left;
                        self.top = rect.top;
                        self.runResize = null;
                    }, 500);
                };
                self.resizeFunc = self.defaultResizeFunc;

                self.userMotionFunc = null;
                self.userPassiveMotionFunc = null;

                self.defaultMouseMoveFunc = function(ev) {
                    if (ev.buttons !== 0 && self.userMotionFunc) {
                        Sk.misceval.callsim(
                            self.userMotionFunc,
                            self.gl,
                            Sk.builtin.assk$(ev.clientX - self.left, Sk.builtin.nmber.int$),
                            Sk.builtin.assk$(ev.clientY - self.top, Sk.builtin.nmber.int$)
                        );
                    } else if (self.userPassiveMotionFunc) {
                        Sk.misceval.callsim(
                            self.userPassiveMotionFunc,
                            self.gl,
                            Sk.builtin.assk$(ev.clientX - self.left, Sk.builtin.nmber.int$),
                            Sk.builtin.assk$(ev.clientY - self.top, Sk.builtin.nmber.int$)
                        );
                    }
                };

                self.canvas.addEventListener("resize", self.resizeFunc);

                // Caveats to the following lines.
                // Observers are supported only by the newer browsers (2015/01).
                // A style change does not automatically imply a resize.
                var observer = new MutationObserver(function(mutations) {
                    self.resizeFunc();
                });
                observer.observe(
                    self.canvas,
                    {attributes: true, attributeFilter: ['style', 'width', 'height']});

                self.gl = glcontext;
                document.addEventListener('mousemove', function(ev) {
                    lastMouseTarget = ev.target;
                }, false);
            }
        );

        $loc.LEFT_BUTTON = 0;
        $loc.RIGHT_BUTTON = 1;
        $loc.MIDDLE_BUTTON = 2;
        $loc.UP = 3;
        $loc.DOWN = 4;

        $loc.displayFunc = new Sk.builtin.func(
            function(self, func) {
                Sk.misceval.callsim(func, self.gl);
            }
        );

        $loc.mouseFunc = new Sk.builtin.func(
            function(self, func) {
                self.canvas.onmousedown = function(ev) {
                    var button = -1;
                    if (ev.button == 0) button = $loc.LEFT_BUTTON;
                    else if (ev.button == 1) button = $loc.MIDDLE_BUTTON;
                    else if (ev.button == 2) button = $loc.RIGHT_BUTTON;
                    Sk.misceval.callsim(
                        func,
                        self.gl,
                        button,
                        $loc.DOWN,
                        Sk.builtin.assk$(ev.clientX - self.left, Sk.builtin.nmber.int$),
                        Sk.builtin.assk$(ev.clientY - self.top,  Sk.builtin.nmber.int$)
                    );
                };
                self.canvas.onmouseup = function(ev) {
                    var button = -1;
                    if (ev.button == 0) button = $loc.LEFT_BUTTON;
                    else if (ev.button == 1) button = $loc.MIDDLE_BUTTON;
                    else if (ev.button == 2) button = $loc.RIGHT_BUTTON;
                    Sk.misceval.callsim(
                        func,
                        self.gl,
                        button,
                        $loc.UP,
                        Sk.builtin.assk$(ev.clientX - self.left, Sk.builtin.nmber.int$),
                        Sk.builtin.assk$(ev.clientY - self.top, Sk.builtin.nmber.int$)
                    );
                };
            }
        );

        $loc.motionFunc = new Sk.builtin.func(
            function(self, func) {
                self.userMotionFunc = func;
                if (!self.canvas.onmousemove)
                    self.canvas.onmousemove = self.defaultMouseMoveFunc;
            }
        );

        $loc.passiveMotionFunc = new Sk.builtin.func(
            function(self, func) {
                self.userPassiveMotionFunc = func;
                if (!self.canvas.onmousemove)
                    self.canvas.onmousemove = self.defaultMouseMoveFunc;
            }
        );

        $loc.reshapeFunc = new Sk.builtin.func(
            function(self, func) {
                if (func) {
                    self.resizeFunc = function(ev) {
                        var rect = self.canvas.getBoundingClientRect();
                        Sk.misceval.callsim(
                            func,
                            self.gl,
                            Sk.builtin.assk$(rect.width),
                            Sk.builtin.assk$(rect.height)
                        );
                        self.defaultResizeFunc();
                    };
                }
            }
        );
    }, 'glut', []);
    return mod;
};
