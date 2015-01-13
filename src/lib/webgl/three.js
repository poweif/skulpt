var $builtinmodule = function(name)
{
    var mod = {};

    var NOT_IMPLEMENTED = function(funcName) {
        return new Sk.builtin.func(
            function(self) {
                throw funcName + " not implemented."
            }
        );
    };
    var _jsnum = Sk.builtin.asnum$;

    var _pyfloat = function(x) {
        return new Sk.builtin.nmber(x, Sk.builtin.nmber.float$);
    };
    var _pyint = function(x) {
        return new Sk.builtin.nmber(x, Sk.builtin.nmber.int$);
    };

    var _math_clamp = function(x, a, b) {
        return (x < a) ? a : ((x > b) ? b : x);
    };

    var _math_deg_to_rad = (function() {
        var degreeToRadiansFactor = Math.PI / 180;
        return function (degrees) {
            return degrees * degreeToRadiansFactor;
        };
    })();

    var _v3_length = function(self) {
        return Math.sqrt(self.v.x * self.v.x + self.v.y * self.v.y +
                         self.v.z * self.v.z);
    };

    var _v3_multiply_scalar = function(self, s) {
        self.v.x *= s;
        self.v.y *= s;
        self.v.z *= s;
        return self;
    };

    var _v3_divide_scalar = function(self, s) {
        if(s !== 0) {
            var invs = 1 / s;
            self.v.x *= invs;
            self.v.y *= invs;
            self.v.z *= invs;
        } else {
            self.v.x = 0;
            self.v.y = 0;
            self.v.z = 0;
        }
        return self;
    };

    var _v3_sub_vectors = function(self, a, b) {
        self.v.x = a.v.x - b.v.x;
        self.v.y = a.v.y - b.v.y;
        self.v.z = a.v.z - b.v.z;
        return self;
    };

    var _v3_set = function(self, x, y, z) {
        self.v.x = x;
        self.v.y = y;
        self.v.z = z;
        return self;
    }

    var _v3_dot = function(self, v) {
        return self.v.x * v.v.x + self.v.y * v.v.y + self.v.z * v.v.z;
    };

    var _v3_distance_to_squared = function(self, v) {
        var dx = self.v.x - v.x;
        var dy = self.v.y - v.y;
        var dz = self.v.z - v.z;
        return dx * dx + dy * dy + dz * dz;
    };

    var _v3_normalize = function(self) {
        return _v3_divide_scalar(self, _v3_length(self));
    };

    var _v3_cross_vectors = function(self, a, b) {
        var ax = a.v.x, ay = a.v.y, az = a.v.z;
        var bx = b.v.x, by = b.v.y, bz = b.v.z;
        self.v.x = ay * bz - az * by;
        self.v.y = az * bx - ax * bz;
        self.v.z = ax * by - ay * bx;
        return self;
    };

    var _v3_apply_projection = function(self, m) {
        var x = self.v.x, y = self.v.y, z = self.v.z;
        var e = m.v;
        var d = 1 /(e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide
        self.v.x =(e[0] * x + e[4] * y + e[8]  * z + e[12]) * d;
        self.v.y =(e[1] * x + e[5] * y + e[9]  * z + e[13]) * d;
        self.v.z =(e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
        return self;
    };

    var _v3_apply_matrix4 = function(self, m) {
        var x = self.v.x, y = self.v.y, z = self.v.z;
        var e = m.v;
        self.v.x = e[0] * x + e[4] * y + e[8]  * z + e[12];
        self.v.y = e[1] * x + e[5] * y + e[9]  * z + e[13];
        self.v.z = e[2] * x + e[6] * y + e[10] * z + e[14];
        return self;
    };

    var _v3_transform_direction = function(self, m) {
        var x = self.v.x, y = self.v.y, z = self.v.z;
        var e = m.v;

        self.v.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z;
        self.v.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z;
        self.v.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;
        return _v3_normalize(self);
    };

    var _v3_new = function() {
        return {v: {x: 0, y: 0, z: 0}};
    };

    // From the original webgl.Float32Array David Holmes.
    mod.arrayf = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self, data) {
            if (typeof data === "number") {
                self.v = new Float32Array(data);
            }
            else {
                self.v = new Float32Array(Sk.ffi.remapToJs(data));
            }
        });

        $loc.__repr__ = new Sk.builtin.func(function(self) {
            var copy = [];
            for (var i = 0; i < self.v.length; ++i) {
                copy.push(self.v[i]);
            }
            return new Sk.builtin.str("[" + copy.join(', ') + "]");
        });
    }, 'arrayf', []);

    // From the original webgl.Float32Array David Holmes.
    mod.arrayi = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self, data) {
            if (typeof data === "number") {
                self.v = new Uint16Array(data);
            }
            else {
                self.v = new Uint16Array(Sk.ffi.remapToJs(data));
            }
        });

        $loc.__repr__ = new Sk.builtin.func(function(self) {
            var copy = [];
            for (var i = 0; i < self.v.length; ++i) {
                copy.push(self.v[i]);
            }
            return new Sk.builtin.str("[" + copy.join(', ') + "]");
        });
    }, 'arrayi', []);


    mod.vec3 = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(
            function(self, x, y, z) {
                // we can't afford parameter length checks, too expensive.
                // Sk.builtin.pyCheckArgs("vec3()", arguments, 3, 3, true);
                self.v = {};
                self.v.x = _jsnum(x) || 0;
                self.v.y = _jsnum(y) || 0;
                self.v.z = _jsnum(z) || 0;
            }
        );

        $loc.__repr__ = new Sk.builtin.func(function(self) {
            return new Sk.builtin.str("(" + self.v.x + ", " + self.v.y + ", " + self.v.z + ")");
        });

        $loc.set = new Sk.builtin.func(
            function(self, x, y, z) {
                // we can't afford parameter length checks, too expensive.
                // Sk.builtin.pyCheckArgs("vec3.set", arguments, 3, 3, true);
                return _v3_set(self, _jsnum(x), _jsnum(y), _jsnum(z));
            }
        );

        $loc.setX = new Sk.builtin.func(
            function(self, x) {
                self.v.x = _jsnum(x);
                return self;
            }
        );

        $loc.setY = new Sk.builtin.func(
            function(self, y) {
                self.v.y = _jsnum(y);
                return self;
            }
        );

        $loc.setY = new Sk.builtin.func(
            function(self, z) {
                self.v.z = _jsnum(z);
                return self;
            }
        );

        $loc.x = new Sk.builtin.func(
            function(self) {
                return _pyfloat(self.v.x);
            }
        );

        $loc.y = new Sk.builtin.func(
            function(self) {
                return _pyfloat(self.v.y);
            }
        );

        $loc.z = new Sk.builtin.func(
            function(self) {
                return _pyfloat(self.v.z);
            }
        );

        $loc.setComponent = new Sk.builtin.func(
            function(self, index, value) {
                switch(_jsnum(index)) {
                case 0: self.v.x = _jsnum(value); break;
                case 1: self.v.y = _jsnum(value); break;
                case 2: self.v.z = _jsnum(value); break;
                default: throw new Error('index is out of range: ' + _jsnum(index));
                }
            }
        );

        $loc.getComponent = new Sk.builtin.func(
            function(self, index) {
                switch(_jsnum(index)) {
                case 0: return _pyfloat(self.v.x);
                case 1: return _pyfloat(self.v.y);
                case 2: return _pyfloat(self.v.z);
                default: throw new Error('index is out of range: ' + _jsnum(index));
                }
            }
        );

        $loc.copy = new Sk.builtin.func(
            function(self, v) {
                self.v.x = v.v.x;
                self.v.y = v.v.y;
                self.v.z = v.v.z;
                return self;
            }
        );

        $loc.add = new Sk.builtin.func(
            function(self, v) {
                self.v.x += v.v.x;
                self.v.y += v.v.y;
                self.v.z += v.v.z;
                return self;
            }
        );

        $loc.addScalar = new Sk.builtin.func(
            function(self, s) {
                self.v.x += _jsnum(s);
                self.v.y += _jsnum(s);
                self.v.z += _jsnum(s);
                return self;
            }
        );

        $loc.addVectors = new Sk.builtin.func(
            function(self, a, b) {
                self.v.x = a.v.x + b.v.x;
                self.v.y = a.v.y + b.v.y;
                self.v.z = a.v.z + b.v.z;
                return self;
            }
        );

        $loc.sub = new Sk.builtin.func(
            function(self, v) {
                self.v.x -= v.v.x;
                self.v.y -= v.v.y;
                self.v.z -= v.v.z;
                return self;
            }
        );

        $loc.subVectors = new Sk.builtin.func(_v3_sub_vectors);

        $loc.multiply = new Sk.builtin.func(
            function(self, v) {
                self.v.x *= v.v.x;
                self.v.y *= v.v.y;
                self.v.z *= v.v.z;
                return self;
            }
        );

        $loc.multiplyScalar = new Sk.builtin.func(
            function(self, scalar) {
                return _v3_multiply_scalar(self, _pyfloat(scalar));
            }
        );

        $loc.multiplyVectors = new Sk.builtin.func(
            function(self, a, b) {
                self.v.x = a.v.x * b.v.x;
                self.v.y = a.v.y * b.v.y;
                self.v.z = a.v.z * b.v.z;
                return self;
            }
        );

        $loc.applyEuler = NOT_IMPLEMENTED("vec3.applyEuler");
        $loc.applyAxisAngle = NOT_IMPLEMENTED("vec3.applyAxisAngle");

        $loc.applyMatrix3 = new Sk.builtin.func(
            function(self, m) {
                var x = self.v.x;
                var y = self.v.y;
                var z = self.v.z;

                var e = m.v;
                self.v.x = e[0] * x + e[3] * y + e[6] * z;
                self.v.y = e[1] * x + e[4] * y + e[7] * z;
                self.v.z = e[2] * x + e[5] * y + e[8] * z;
                return self;
            }
        );

        $loc.applyMatrix4 = new Sk.builtin.func(_v3_apply_matrix4);

        $loc.applyProjection = new Sk.builtin.func(_v3_apply_projection);

        $loc.applyQuaternion = new Sk.builtin.func(
            function(self, q) {
                var x = self.v.x;
                var y = self.v.y;
                var z = self.v.z;

                var qx = q.v.x;
                var qy = q.v.y;
                var qz = q.v.z;
                var qw = q.v.w;

                // calculate quat * vector
                var ix =  qw * x + qy * z - qz * y;
                var iy =  qw * y + qz * x - qx * z;
                var iz =  qw * z + qx * y - qy * x;
                var iw = - qx * x - qy * y - qz * z;

                // calculate result * inverse quat
                self.v.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
                self.v.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
                self.v.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;
                return self;
            }
        );

        $loc.project = NOT_IMPLEMENTED("vec3.project");
        $loc.unproject = NOT_IMPLEMENTED("vec3.unproject");

        $loc.transformDirection = new Sk.builtin.func(_v3_transform_direction);

        $loc.divide = new Sk.builtin.func(
            function(self, v) {
                self.v.x /= v.v.x;
                self.v.y /= v.v.y;
                self.v.z /= v.v.z;
                return self;
            }
        );

        $loc.divideScalar = new Sk.builtin.func(
            function(self, pyscalar) {
                return _v3_divide_scalar(self, _pyfloat(pyscalar));
            }
        );

        $loc.min = new Sk.builtin.func(
            function(self, v) {
                if(self.v.x > v.v.x) {
                    self.v.x = v.v.x;
                }

                if(self.v.y > v.v.y) {
                    self.v.y = v.v.y;
                }

                if(self.v.z > v.z) {
                    self.v.z = v.z;
                }
                return self;
            }
        );

        $loc.max = new Sk.builtin.func(
            function(self, v) {
                if(self.v.x < v.x) {
                    self.v.x = v.x;
                }

                if(self.v.y < v.y) {
                    self.v.y = v.y;
                }

                if(self.v.z < v.z) {
                    self.v.z = v.z;
                }
                return self;
            }
        );

        $loc.clamp = new Sk.builtin.func(
            function(self, min, max) {
                // This function assumes min < max, if this assumption
                // isn't true it will not operate correctly
                if(self.v.x < min.v.x) {
                    self.v.x = min.v.x;
                } else if(self.v.x > max.v.x) {
                    self.v.x = max.v.x;
                }

                if(self.v.y < min.v.y) {
                    self.v.y = min.v.y;
                } else if(self.v.y > max.v.y) {
                    self.v.y = max.v.y;
                }

                if(self.v.z < min.v.z) {
                    self.v.z = min.z;
                } else if(self.v.z > max.v.z) {
                    self.v.z = max.z;
                }

                return self;
            }
        );

        $loc.clampScalar = NOT_IMPLEMENTED("vec3.clampScalar");

        $loc.floor = new Sk.builtin.func(
            function(self) {
                self.v.x = Math.floor(self.v.x);
                self.v.y = Math.floor(self.v.y);
                self.v.z = Math.floor(self.v.z);
                return self;
            }
        );

        $loc.ceil = new Sk.builtin.func(
            function(self) {
                self.v.x = Math.ceil(self.v.x);
                self.v.y = Math.ceil(self.v.y);
                self.v.z = Math.ceil(self.v.z);
                return self;
            }
        );

        $loc.round = new Sk.builtin.func(
            function(self) {
                self.v.x = Math.round(self.v.x);
                self.v.y = Math.round(self.v.y);
                self.v.z = Math.round(self.v.z);
                return self;
            }
        );

        $loc.roundToZero = new Sk.builtin.func(
            function(self) {
                self.v.x =(self.v.x < 0) ? Math.ceil(self.v.x) : Math.floor(self.v.x);
                self.v.y =(self.v.y < 0) ? Math.ceil(self.v.y) : Math.floor(self.v.y);
                self.v.z =(self.v.z < 0) ? Math.ceil(self.v.z) : Math.floor(self.v.z);
                return self;
            }
        );

        $loc.negate = new Sk.builtin.func(
            function(self) {
                self.v.x = - self.v.x;
                self.v.y = - self.v.y;
                self.v.z = - self.v.z;
                return self;
            }
        );

        $loc.dot = new Sk.builtin.func(
            function(self, v) {
                return _pyfloat(_v3_dot(self, v));
            }
        );

        $loc.lengthSq = new Sk.builtin.func(
            function(self) {
                return _pyfloat(self.v.x * self.v.x + self.v.y * self.v.y +
                                self.v.z * self.v.z);
            }
        );

        $loc.length = new Sk.builtin.func(
            function(self) {
                return _pyfloat(_v3_length(self));
            }
        );

        $loc.lengthManhattan = new Sk.builtin.func(
            function(self) {
                return _pyfloat(Math.abs(self.v.x) + Math.abs(self.v.y) + Math.abs(self.v.z));
            }
        );


        $loc.normalize = new Sk.builtin.func(_v3_normalize);

        $loc.setLength = new Sk.builtin.func(
            function(self, pyl) {
                var oldLength = _v3_length(self);
                var l = _jsnum(pyl);
                if(oldLength !== 0 && l !== oldLength) {
                    return _v3_multiply_scalar(s, l / oldLength);
                }
                return self;
            }
        );

        $loc.setLength = new Sk.builtin.func(
            function(self, v, pyalpha) {
                var alpha = _jsnum(pyalpha);
                self.v.x +=(v.v.x - self.v.x) * alpha;
                self.v.y +=(v.v.y - self.v.y) * alpha;
                self.v.z +=(v.v.z - self.v.z) * alpha;
                return self;
            }
        );

        $loc.cross = new Sk.builtin.func(
            function(self, v) {
                var x = self.v.x, y = self.v.y, z = self.v.z;
                self.v.x = y * v.v.z - z * v.v.y;
                self.v.y = z * v.v.x - x * v.v.z;
                self.v.z = x * v.v.y - y * v.v.x;
                return self;
            }
        );

        $loc.crossVectors = new Sk.builtin.func(_v3_cross_vectors);

        $loc.projectOnVector = NOT_IMPLEMENTED("vec3.projectOnVector");
        $loc.projectOnPlane = NOT_IMPLEMENTED("vec3.projectOnPlane");
        $loc.reflect = NOT_IMPLEMENTED("vec3.reflect");

        $loc.angleTo = new Sk.builtin.func(
            function(self, v) {
                var theta = _v3_dot(self, v) / (_v3_length(self) * _v3_length(v));

                // clamp, to handle numerical problems
                return _pyfloat(Math.acos(_math_clamp(theta, - 1, 1)));
            }
        );

        $loc.distanceTo = new Sk.builtin.func(
            function(self, v) {
                return _pyfloat(Math.sqrt(_v3_distance_to_squared(self, v)));
            }
        );

        $loc.distanceToSquared = new Sk.builtin.func(
            function(self, v) {
                return _pyfloat(_v3_distance_to_squared(self, v));
            }
        );

        $loc.setEulerFromRotationMatrix = NOT_IMPLEMENTED("vec3.setEulerFromRotationMatrix");
        $loc.setEulerFromQuaternion = NOT_IMPLEMENTED("vec3.setEulerFromQuaternion");
        $loc.getPositionFromMatrix = NOT_IMPLEMENTED("vec3.getPositionFromMatrix");
        $loc.getScaleFromMatrix = NOT_IMPLEMENTED("vec3.getScaleFromMatrix");
        $loc.getColumnFromMatrix = NOT_IMPLEMENTED("vec3.getColumnFromMatrix");

        $loc.setFromMatrixPosition = new Sk.builtin.func(
            function(self, m) {
                self.v.x = m.v[12];
                self.v.y = m.v[13];
                self.v.z = m.v[14];
                return self;
            }
        );

        $loc.setFromMatrixScale = (function() {
            var s = _v3_new();
            return new Sk.builtin.func(
                function(self, m) {
                    var sx = _v3_length(
                        _v3_set(s, m.v[0], m.v[1], m.v[2]));
                    var sy = _v3_length(
                        _v3_set(s, m.v[4], m.v[5], m.v[6]));
                    var sz = _v3_length(
                        _v3_set(s, m.v[8], m.v[9], m.v[10]));
                    self.v.x = sx;
                    self.v.y = sy;
                    self.v.z = sz;
                    return self;
                }
            );
        })();


        $loc.setFromMatrixColumn = new Sk.builtin.func(
            function(self, ind, mat) {
                var of = _jsnum(ind) * 4;
                var me = matrix.v;
                self.v.x = me[of];
                self.v.y = me[of + 1];
                self.v.z = me[of + 2];
                return self;
            }
        );

        $loc.equals = new Sk.builtin.func(
            function(self, v) {
                if (v.v.x === self.v.x && v.v.y === self.v.y && v.v.z === self.v.z)
                    return Sk.builtin.bool.true$;
                return Sk.builtin.bool.false$;
            }
        );

        $loc.fromArray = new Sk.builtin.func(
            function(self, py_array, py_offset) {
                var off = _jsnum(py_offset);
                var array = py_array.v;
                self.v.x = array[off];
                self.v.y = array[off + 1];
                self.v.z = array[off + 2];
                return self;
            }
        );

        $loc.toArray = new Sk.builtin.func(
            function(self, py_array, py_offset) {
                var off = _jsnum(py_offset);
                var array = py_array.v;
                self.v.x = array[off];
                self.v.y = array[off + 1];
                self.v.z = array[off + 2];
                return self;
            }
        );

        $loc.clone = new Sk.builtin.func(
            function(self) {
                return Sk.misceval.callsim(
                    mod.vec3, _pyfloat(self.v.x), _pyfloat(self.v.y), _pyfloat(self.v.z));
            }
        );
    }, 'vec3', []);

    var _mat4_set = function(self, n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41,
                             n42, n43, n44) {
        var te = self.v;
        te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14; te[1] = n21; te[5] = n22; te[9] = n23;
        te[13] = n24; te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34; te[3] = n41;
        te[7] = n42; te[11] = n43; te[15] = n44;
        return self;
    };

    var _mat4_multiply_matrices = function(self, a, b) {
        var ae = a.v;
        var be = b.v;
        var te = self.v;

        var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
        var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
        var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
        var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

        var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
        var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
        var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
        var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return self;
    };

    var _mat4_identity = function(self) {
        return _mat4_set(
            self,
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    };

    var _mat4_multiply_scalar = function(self, s) {
        var te = self.v;
        te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
        te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
        te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
        te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;
        return self;
    };

    var _mat4_make_rotation_from_quaternion = function(self, q) {
        var te = self.v;

        var x = q.v.x, y = q.v.y, z = q.v.z, w = q.v.w;
        var x2 = x + x, y2 = y + y, z2 = z + z;
        var xx = x * x2, xy = x * y2, xz = x * z2;
        var yy = y * y2, yz = y * z2, zz = z * z2;
        var wx = w * x2, wy = w * y2, wz = w * z2;

        te[0] = 1 - (yy + zz);
        te[4] = xy - wz;
        te[8] = xz + wy;

        te[1] = xy + wz;
        te[5] = 1 - (xx + zz);
        te[9] = yz - wx;

        te[2] = xz - wy;
        te[6] = yz + wx;
        te[10] = 1 - (xx + yy);

        // last column
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;

        // bottom row
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;

        return self;
    };

    var _mat4_scale = function(self, v) {
        var te = self.v;
        var x = v.v.x, y = v.v.y, z = v.v.z;
        te[0] *= x; te[4] *= y; te[8] *= z;
        te[1] *= x; te[5] *= y; te[9] *= z;
        te[2] *= x; te[6] *= y; te[10] *= z;
        te[3] *= x; te[7] *= y; te[11] *= z;
        return self;
    };

    var _mat4_set_position = function(self, v) {
        var te = self.v;
        te[12] = v.v.x;
        te[13] = v.v.y;
        te[14] = v.v.z;
        return self;
    };

    var _mat4_determinant = function(self) {
        var te = self.v;

        var n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
        var n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
        var n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
        var n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];

        //(based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm)
        return (
            n41 * (
                    + n14 * n23 * n32
                    - n13 * n24 * n32
                    - n14 * n22 * n33
                    + n12 * n24 * n33
                    + n13 * n22 * n34
                    - n12 * n23 * n34) +
            n42 * (
                    + n11 * n23 * n34
                    - n11 * n24 * n33
                    + n14 * n21 * n33
                    - n13 * n21 * n34
                    + n13 * n24 * n31
                    - n14 * n23 * n31) +
            n43 * (
                    + n11 * n24 * n32
                    - n11 * n22 * n34
                    - n14 * n21 * n32
                    + n12 * n21 * n34
                    + n14 * n22 * n31
                    - n12 * n24 * n31) +
            n44 * (
                    - n13 * n22 * n31
                    - n11 * n23 * n32
                    + n11 * n22 * n33
                    + n13 * n21 * n32
                    - n12 * n21 * n33
                    + n12 * n23 * n31)
        );
    };


    var _quat_set_from_rotation_matrix = function(self, matrix) {
        console.log("_quat_set_from_rotation_matrix not implemented (TODO)");
    };

    var _mat4_make_frustum = function(self, left, right, bottom, top, near, far) {
        var te = self.v;
        var x = 2 * near / (right - left);
        var y = 2 * near / (top - bottom);

        var a = (right + left) / (right - left);
        var b = (top + bottom) / (top - bottom);
        var c = - (far + near) / (far - near);
        var d = - 2 * far * near / (far - near);

        te[0] = x;	te[4] = 0;	te[8] = a;	te[12] = 0;
        te[1] = 0;	te[5] = y;	te[9] = b;	te[13] = 0;
        te[2] = 0;	te[6] = 0;	te[10] = c;	te[14] = d;
        te[3] = 0;	te[7] = 0;	te[11] = - 1;	te[15] = 0;

        return self;
    };

    var _mat4_inverse = function(self, m) {
        // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        var te = self.v;
        var me = m.v;

        var n11 = me[0], n12 = me[4], n13 = me[8], n14 = me[12];
        var n21 = me[1], n22 = me[5], n23 = me[9], n24 = me[13];
        var n31 = me[2], n32 = me[6], n33 = me[10], n34 = me[14];
        var n41 = me[3], n42 = me[7], n43 = me[11], n44 = me[15];

        te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 -
            n23 * n32 * n44 + n22 * n33 * n44;

        te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 +
            n13 * n32 * n44 - n12 * n33 * n44;

        te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 -
            n13 * n22 * n44 + n12 * n23 * n44;

        te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 +
            n13 * n22 * n34 - n12 * n23 * n34;

        te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 +
            n23 * n31 * n44 - n21 * n33 * n44;

        te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 -
            n13 * n31 * n44 + n11 * n33 * n44;

        te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 +
            n13 * n21 * n44 - n11 * n23 * n44;

        te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 -
            n13 * n21 * n34 + n11 * n23 * n34;

        te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 -
            n22 * n31 * n44 + n21 * n32 * n44;

        te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 +
            n12 * n31 * n44 - n11 * n32 * n44;

        te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 -
            n12 * n21 * n44 + n11 * n22 * n44;

        te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 +
            n12 * n21 * n34 - n11 * n22 * n34;
        te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 +
            n22 * n31 * n43 - n21 * n32 * n43;
        te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 -
            n12 * n31 * n43 + n11 * n32 * n43;
        te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 +
            n12 * n21 * n43 - n11 * n22 * n43;
        te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 -
            n12 * n21 * n33 + n11 * n22 * n33;

        var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];

        if (det == 0) {
            var msg = "mat4.getInverse: can't invert matrix, determinant is 0";
            console.warn(msg);
            return _mat4_identity(self);
        }

        return _mat4_multiply_scalar(self, 1 / det);
    }

    var _mat4_new = function() {
        return {
            v: new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ])
        };
    };

    mod.mat4 = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(
            function(self) {
                self.v = new Float32Array([
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1
               ]);
            }
        );

        $loc.__repr__ = new Sk.builtin.func(function(self) {
            var allStr = [];
            for (var r = 0; r < 4; r++) {
                var rowStr = function() {return [];}();
                for (var c = 0; c < 4; c++) {
                    var ind = c * 4 + r;
                    rowStr.push("" + self.v[ind]);
                }
                allStr.push(rowStr.join(" "));
            }
            return new Sk.builtin.str("[\n" + allStr.join("\n") + "\n]");
        });

        $loc.set = new Sk.builtin.func(
            function(self, n11, n12, n13, n14, n21, n22, n23, n24,
                     n31, n32, n33, n34, n41, n42, n43, n44) {
                return _mat4_set(
                    self,
                    _jsnum(n11), _jsnum(n12), _jsnum(n13), _jsnum(n14),
                    _jsnum(n21), _jsnum(n22), _jsnum(n23), _jsnum(n24),
                    _jsnum(n31), _jsnum(n32), _jsnum(n33), _jsnum(n34),
                    _jsnum(n41), _jsnum(n42), _jsnum(n43), _jsnum(n44));
            }
        );

        $loc.identity = new Sk.builtin.func(_mat4_identity);

        $loc.copy = new Sk.builtin.func(
            function(self, m) {
                self.v.set(m.v);
                return self;
            }
        );

        $loc.extractPosition = NOT_IMPLEMENTED("mat4.extractPosition");

        $loc.copyPosition = new Sk.builtin.func(
            function(self, m) {
                var te = self.v;
                var me = m.v;
                te[12] = me[12];
                te[13] = me[13];
                te[14] = me[14];
                return self;
            }
        );

        $loc.extractRotation = (function() {
            var v1 = _v3_new();
            return new Sk.builtin.func(
                function(self, m) {
                    var te = self.v;
                    var me = m.v;

                    var scaleX = 1 / _v3_length(_v3_set(v1, me[0], me[1], me[2]));
                    var scaleY = 1 / _v3_length(_v3_set(v1, me[4], me[5], me[6]));
                    var scaleZ = 1 / _v3_length(_v3_set(v1, me[8], me[9], me[10]));

                    te[0] = me[0] * scaleX;
                    te[1] = me[1] * scaleX;
                    te[2] = me[2] * scaleX;

                    te[4] = me[4] * scaleY;
                    te[5] = me[5] * scaleY;
                    te[6] = me[6] * scaleY;

                    te[8] = me[8] * scaleZ;
                    te[9] = me[9] * scaleZ;
                    te[10] = me[10] * scaleZ;

                    return self;
                }
            );
        })();

        $loc.makeRotationFromEuler = new Sk.builtin.func(
            function(self, euler) {
                var te = self.v;

                var x = euler.v.x, y = euler.v.y, z = euler.v.z;
                var a = Math.cos(x), b = Math.sin(x);
                var c = Math.cos(y), d = Math.sin(y);
                var e = Math.cos(z), f = Math.sin(z);

                if (euler.v.order === 'XYZ') {
                    var ae = a * e, af = a * f, be = b * e, bf = b * f;
                    te[0] = c * e;
                    te[4] = - c * f;
                    te[8] = d;
                    te[1] = af + be * d;
                    te[5] = ae - bf * d;
                    te[9] = - b * c;
                    te[2] = bf - ae * d;
                    te[6] = be + af * d;
                    te[10] = a * c;

                } else if (euler.v.order === 'YXZ') {
                    var ce = c * e, cf = c * f, de = d * e, df = d * f;
                    te[0] = ce + df * b;
                    te[4] = de * b - cf;
                    te[8] = a * d;
                    te[1] = a * f;
                    te[5] = a * e;
                    te[9] = - b;
                    te[2] = cf * b - de;
                    te[6] = df + ce * b;
                    te[10] = a * c;

                } else if (euler.v.order === 'ZXY') {
                    var ce = c * e, cf = c * f, de = d * e, df = d * f;

                    te[0] = ce - df * b;
                    te[4] = - a * f;
                    te[8] = de + cf * b;

                    te[1] = cf + de * b;
                    te[5] = a * e;
                    te[9] = df - ce * b;

                    te[2] = - a * d;
                    te[6] = b;
                    te[10] = a * c;
                } else if (euler.v.order === 'ZYX') {
                    var ae = a * e, af = a * f, be = b * e, bf = b * f;

                    te[0] = c * e;
                    te[4] = be * d - af;
                    te[8] = ae * d + bf;

                    te[1] = c * f;
                    te[5] = bf * d + ae;
                    te[9] = af * d - be;

                    te[2] = - d;
                    te[6] = b * c;
                    te[10] = a * c;
                } else if (euler.v.order === 'YZX') {
                    var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

                    te[0] = c * e;
                    te[4] = bd - ac * f;
                    te[8] = bc * f + ad;

                    te[1] = f;
                    te[5] = a * e;
                    te[9] = - b * e;

                    te[2] = - d * e;
                    te[6] = ad * f + bc;
                    te[10] = ac - bd * f;

                } else if (euler.v.order === 'XZY') {
                    var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

                    te[0] = c * e;
                    te[4] = - f;
                    te[8] = d * e;

                    te[1] = ac * f + bd;
                    te[5] = a * e;
                    te[9] = ad * f - bc;

                    te[2] = bc * f - ad;
                    te[6] = b * e;
                    te[10] = bd * f + ac;
                }

                // last column
                te[3] = 0;
                te[7] = 0;
                te[11] = 0;

                // bottom row
                te[12] = 0;
                te[13] = 0;
                te[14] = 0;
                te[15] = 1;

                return self;
            }
        );

        $loc.setRotationFromQuaternion = NOT_IMPLEMENTED("mat4.setRotationFromQuaternion");

        $loc.makeRotationFromQuaternion = new Sk.builtin.func(_mat4_make_rotation_from_quaternion);

        $loc.lookAt = (function() {
            var x = _v3_new();
            var y = _v3_new();
            var z = _v3_new();
            return new Sk.builtin.func(
                function(self, eye, target, up) {
                    var te = self.v;
                    z = _v3_normalize(_v3_sub_vectors(z, eye, target));
                    if (_v3_length(z) === 0)
                        z.v.z = 1;
                    x = _v3_normalize(_v3_cross_vectors(x, up, z));
                    if (_v3_length(x) === 0) {
                        z.v.x += 0.0001;
                        x = _v3_normalize(_v3_cross_vectors(x, up, z));
                    }
                    y = _v3_cross_vectors(y, z, x);
                    te[0] = x.v.x; te[4] = y.v.x; te[8] = z.v.x;
                    te[1] = x.v.y; te[5] = y.v.y; te[9] = z.v.y;
                    te[2] = x.v.z; te[6] = y.v.z; te[10] = z.v.z;
                    return self;
                }
            );
        })();

        $loc.multiply = new Sk.builtin.func(
            function(self, m) {
                return _mat4_multiply_matrices(self, self, m);
            }
        );

        $loc.multiplyMatrices = new Sk.builtin.func(
            function(self, a, b) {
                return _mat4_multiply_matrices(self, a, b);
            }
        );

        $loc.multiplyToArray = new Sk.builtin.func(
            function(self, a, b, py_r) {
                _mat4_multiply_matrices(self, a, b);
                var te = self.v;
                var r = py_r.v;

                r[0] = te[0]; r[1] = te[1]; r[2] = te[2]; r[3] = te[3];
                r[4] = te[4]; r[5] = te[5]; r[6] = te[6]; r[7] = te[7];
                r[8]  = te[8]; r[9]  = te[9]; r[10] = te[10]; r[11] = te[11];
                r[12] = te[12]; r[13] = te[13]; r[14] = te[14]; r[15] = te[15];

                return self;
            }
        );

        $loc.multiplyScalar = new Sk.builtin.func(
            function(self, py_s) {
                return _mat4_multiply_scalar(self, _jsnum(py_s));
            }
        );

        $loc.multiplyVector3 = new Sk.builtin.func(
            function(self, vector) {
                return _v3_apply_projection(vector, self);
            }
        );

        $loc.multiplyVector4 = NOT_IMPLEMENTED("mat4.multiplyVector4");
        $loc.multiplyVector3Array = NOT_IMPLEMENTED("mat4.multiplyVector3Array");

        $loc.applyToVector3Array = (function() {
            var v1 = _v3_new();
            return new Sk.builtin.func(
                function(py_array, py_offset, py_length) {
                    var offset = _jsnum(py_offset);
                    var length = array.v.length;
                    var array = py_array.v;

                    for (var i = 0, j = offset, il; i < length; i += 3, j += 3) {
                        v1.x = array[j];
                        v1.y = array[j + 1];
                        v1.z = array[j + 2];

                        _v3_apply_matrix4(v1, self);

                        array[j]     = v1.v.x;
                        array[j + 1] = v1.v.y;
                        array[j + 2] = v1.v.z;
                    }
                    return py_array;
                }
            );
        })();

        $loc.rotateAxis = new Sk.builtin.func(
            function(self, v) {
                _v3_transform_direction(v, self);
            }
        );

        $loc.crossVector = new Sk.builtin.func(
            function(self, v) {
                _v3_apply_matrix4(v, self);
            }
        );

        $loc.determinant = new Sk.builtin.func(_mat4_determinant);

        $loc.transpose = new Sk.builtin.func(
            function(self) {
                var te = self.v;
                var tmp;

                tmp = te[1]; te[1] = te[4]; te[4] = tmp;
                tmp = te[2]; te[2] = te[8]; te[8] = tmp;
                tmp = te[6]; te[6] = te[9]; te[9] = tmp;

                tmp = te[3]; te[3] = te[12]; te[12] = tmp;
                tmp = te[7]; te[7] = te[13]; te[13] = tmp;
                tmp = te[11]; te[11] = te[14]; te[14] = tmp;

                return self;
            }
        );

        $loc.inverse = new Sk.builtin.func(
            function(self) {
                return _mat4_inverse(self, self);
            }
        );

        $loc.flattenToArrayOffset = new Sk.builtin.func(
            function(self, py_array, py_offset) {
                var te = self.v;
                var array = py_array.v;
                var offset = _jsnum(py_offset);

                array[offset    ] = te[0];
                array[offset + 1] = te[1];
                array[offset + 2] = te[2];
                array[offset + 3] = te[3];

                array[offset + 4] = te[4];
                array[offset + 5] = te[5];
                array[offset + 6] = te[6];
                array[offset + 7] = te[7];

                array[offset + 8]  = te[8];
                array[offset + 9]  = te[9];
                array[offset + 10] = te[10];
                array[offset + 11] = te[11];

                array[offset + 12] = te[12];
                array[offset + 13] = te[13];
                array[offset + 14] = te[14];
                array[offset + 15] = te[15];

                return array;
            }
        );

        $loc.getPosition = (function() {
            var v1 = _v3_new();
            return new Sk.builtin.func(
                function(self) {
                    var te = self.v;
                    return _v3_set(v1, te[12], te[13], te[14]);
                }
            );
        })();

        $loc.setPosition = new Sk.builtin.func(_mat4_set_position);
        $loc.getInverse = new Sk.builtin.func(_mat4_inverse);


        $loc.translate = NOT_IMPLEMENTED("mat4.translate");
        $loc.rotateX = NOT_IMPLEMENTED("mat4.rotateX");
        $loc.rotateY = NOT_IMPLEMENTED("mat4.rotateY");
        $loc.rotateZ = NOT_IMPLEMENTED("mat4.rotateZ");
        $loc.rotateByAxis = NOT_IMPLEMENTED("mat4.rotateByAxis");

        $loc.scale = new Sk.builtin.func(_mat4_scale);

        $loc.getMaxScaleOnAxis = new Sk.builtin.func(
            function(self) {
                var te = self.v;

                var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
                var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
                var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];

                return _pyfloat(Math.sqrt(Math.max(scaleXSq, Math.max(scaleYSq, scaleZSq))));
            }
        );

        $loc.makeTranslation = new Sk.builtin.func(
            function(self, x, y, z) {
                return _mat4_set(
                    self,
                    1, 0, 0, _jsnum(x),
                    0, 1, 0, _jsnum(y),
                    0, 0, 1, _jsnum(z),
                    0, 0, 0, _jsnum(1)
                );
            }
        );

        $loc.makeRotationX = new Sk.builtin.func(
            function(self, py_theta) {
                var theta = _jsnum(py_theta);
                var c = Math.cos(theta), s = Math.sin(theta);
                return _mat4_set(
                    self,
                    1, 0,  0, 0,
                    0, c, - s, 0,
                    0, s,  c, 0,
                    0, 0,  0, 1
                );
            }
        );

        $loc.makeRotationY = new Sk.builtin.func(
            function(self, py_theta) {
                var theta = _jsnum(py_theta);
                var c = Math.cos(theta), s = Math.sin(theta);
                return _mat4_set(
                    self,
                    c, 0, s, 0,
                    0, 1, 0, 0,
                  - s, 0, c, 0,
                    0, 0, 0, 1
                );
            }
        );

        $loc.makeRotationZ = new Sk.builtin.func(
            function(self, py_theta) {
                var theta = _jsnum(py_theta);
                var c = Math.cos(theta), s = Math.sin(theta);
                return _mat4_set(
                    self,
                    c, - s, 0, 0,
                    s,  c, 0, 0,
                    0,  0, 1, 0,
                    0,  0, 0, 1
                );
            }
        );

        $loc.makeRotationAxis = new Sk.builtin.func(
            function(self, axis, py_angle) {
                // Based on http://www.gamedev.net/reference/articles/article1199.asp
                var angle = _jsnum(py_angle);
                var c = Math.cos(angle);
                var s = Math.sin(angle);
                var t = 1 - c;
                var x = axis.v.x, y = axis.v.y, z = axis.v.z;
                var tx = t * x, ty = t * y;

                return _mat4_set(
                    self,
                    tx * x + c, tx * y - s * z, tx * z + s * y, 0,
                    tx * y + s * z, ty * y + c, ty * z - s * x, 0,
                    tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
                    0, 0, 0, 1
                );
            }
        );

        $loc.makeScale = new Sk.builtin.func(
            function(self, x, y, z) {
                return _mat4_set(
                    self,
                    x, 0, 0, 0,
                    0, y, 0, 0,
                    0, 0, z, 0,
                    0, 0, 0, 1
                );
            }
        );

        $loc.compose = new Sk.builtin.func(
            function(self, position, quaternion, py_scale) {
                var scale = _jsnum(py_scale);
                _mat4_make_rotation_from_quaternion(self, quaternion);
                _mat4_scale(self, scale);
                _mat4_set_position(self, position);
                return self;
            }
        );


        $loc.decompose = (function() {
            var vector = _v3_new();
            var matrix = _mat4_new();
            return new Sk.builtin.func(
                function(position, quaternion, scale) {
                    var te = self.v;

                    var sx = _v3_length(_v3_set(vector, te[0], te[1], te[2]));
                    var sy = _v3_length(_v3_set(vector, te[4], te[5], te[6]));
                    var sz = _v3_length(_v3_set(vector, te[8], te[9], te[10]));

                    // if determine is negative, we need to invert one scale
                    var det = _mat4_determinant(self);
                    if (det < 0) {
                        sx = - sx;
                    }

                    position.v.x = te[12];
                    position.v.y = te[13];
                    position.v.z = te[14];

                    // scale the rotation part

                    matrix.v.set(self.v); // at self.v point matrix is incomplete so we can't use .copy()

                    var invSX = 1 / sx;
                    var invSY = 1 / sy;
                    var invSZ = 1 / sz;

                    matrix.v[0] *= invSX;
                    matrix.v[1] *= invSX;
                    matrix.v[2] *= invSX;

                    matrix.v[4] *= invSY;
                    matrix.v[5] *= invSY;
                    matrix.v[6] *= invSY;

                    matrix.v[8] *= invSZ;
                    matrix.v[9] *= invSZ;
                    matrix.v[10] *= invSZ;

                    _quat_set_from_rotation_matrix(self, matrix);

                    scale.v.x = sx;
                    scale.v.y = sy;
                    scale.v.z = sz;

                    return self;
                }
            );
        })();

        $loc.makeFrustum = new Sk.builtin.func(
            function(self, py_left, py_right, py_bottom, py_top, py_near, py_far) {
                var left = _jsnum(py_left);
                var right = _jsnum(py_right);
                var bottom = _jsnum(py_bottom);
                var top = _jsnum(py_top);
                var near = _jsnum(py_near);
                var far = _jsnum(py_far);
                return _mat4_make_frustum(self, left, right, bottom, top, near, far);
            }
        );

        $loc.makePerspective = new Sk.builtin.func(
            function(self, py_fov, py_aspect, py_near, py_far) {
                var fov = _jsnum(py_fov);
                var aspect = _jsnum(py_aspect);
                var near = _jsnum(py_near);
                var far = _jsnum(py_far);

                var ymax = near * Math.tan(_math_deg_to_rad(fov * 0.5));
                var ymin = - ymax;
                var xmin = ymin * aspect;
                var xmax = ymax * aspect;

                return _mat4_make_frustum(self, xmin, xmax, ymin, ymax, near, far);
            }
        );

        $loc.makeOrthographic = new Sk.builtin.func(
            function(self, py_left, py_right, py_top, py_bottom, py_near, py_far) {
                var left = _jsnum(py_left);
                var right = _jsnum(py_right);
                var top = _jsnum(py_top);
                var bottom = _jsnum(py_bottom);
                var near = _jsnum(py_near);
                var far = _jsnum(py_far);

                var te = self.v;
                var w = right - left;
                var h = top - bottom;
                var p = far - near;

                var x = (right + left) / w;
                var y = (top + bottom) / h;
                var z = (far + near) / p;

                te[0] = 2 / w;	te[4] = 0;	te[8] = 0;	te[12] = - x;
                te[1] = 0;	te[5] = 2 / h;	te[9] = 0;	te[13] = - y;
                te[2] = 0;	te[6] = 0;	te[10] = - 2 / p;	te[14] = - z;
                te[3] = 0;	te[7] = 0;	te[11] = 0;	te[15] = 1;

                return self;
            }
        );

        $loc.fromArray = new Sk.builtin.func(
            function(self, array) {
                self.v.set(array.v);
                return self;
            }
        );

        $loc.toArray = new Sk.builtin.func(
            function(self) {

//                var te = self.v;
//                return [
//                    te[0], te[1], te[2], te[3],
//                        te[4], te[5], te[6], te[7],
//                        te[8], te[9], te[10], te[11],
//                        te[12], te[13], te[14], te[15]
//               ];
            }
        );

        $loc.clone = new Sk.builtin.func(
            function(self) {
                var ret = Sk.misceval.callsim(mod.mat4);
                ret.v.set(self.v);
                return ret;
            }
        );
    }, 'mat4', []);

    return mod;
}
