var $builtinmodule = function(name)
{
    var mod = {};
    var lastMouseTarget;

    mod.Init = Sk.misceval.buildClass(mod, function($gbl, $loc) {
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
                        console.log("running resize");
                        var rect = self.canvas.getBoundingClientRect();
                        self.left = rect.left;
                        self.top = rect.top;
                        self.runResize = null;
                    }, 500);
                };
                self.resizeFunc = self.defaultResizeFunc;
                self.resizeFunc();

                self.userMotionFunc = null;
                self.userPassiveMotionFunc = null;

                self.defaultMouseMoveFunc = function(ev) {
                    if (ev.buttons !== 0 && self.userMotionFunc) {
//                        console.log('drag ' + self.left + "  " + self.top + " " + ev.clientX + " " + ev.clientY);
                        console.log('d ' + (ev.clientX - self.left) + "  " + (ev.clientY - self.top));
                        Sk.misceval.callsim(
                            self.userMotionFunc,
                            self.gl,
                            Sk.builtin.assk$(ev.clientX - self.left, Sk.builtin.nmber.int$),
                            Sk.builtin.assk$(ev.clientY - self.top, Sk.builtin.nmber.int$)
                        );
                    } else if (self.userPassiveMotionFunc) {
                        console.log('move');
                        Sk.misceval.callsim(
                            self.userPassiveMotionFunc,
                            self.gl,
                            Sk.builtin.assk$(ev.clientX - self.left, Sk.builtin.nmber.int$),
                            Sk.builtin.assk$(ev.clientY - self.top, Sk.builtin.nmber.int$)
                        );
                    }
                };

                self.canvas.addEventListener("resize", self.resizeFunc);

                self.gl = glcontext;
                document.addEventListener('mousemove', function(ev) {
                    lastMouseTarget = ev.target;
                }, false);
                document.addEventListener('keypress', function(ev) {
                    if (self.canvas.onPrivateKeyPress !== 'undfined' &&
                        lastMouseTarget === self.canvas) {
                        self.canvas.onPrivateKeyPress(ev);
                    }
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

        $loc.keyboardFunc = new Sk.builtin.func(
            function(self, func) {
                self.canvas.onPrivateKeyPress = function(ev) {
                    var ch = ev.keyCode ? ev.keyCode : ev.which;
                    Sk.misceval.callsim(
                        func,
                        self.gl,
                        Sk.builtin.chr(ch),
                        Sk.builtin.assk$(ev.clientX - self.left, Sk.builtin.nmber.int$),
                        Sk.builtin.assk$(ev.clientY - self.top, Sk.builtin.nmber.int$)
                    );
                }
            }
        );

        $loc.reshapeFunc = new Sk.builtin.func(
            function(self, func) {
                window.removeEventListener("resize", self.resizeFunc);
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
                    window.addEventListener("resize", self.resizeFunc);
                }
            }
        );

  }, 'glut', []);

  return mod;
}
