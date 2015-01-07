var $builtinmodule = function(name)
{
    var mod = {};
    var jsnum = Sk.builtin.asnum$;
    var pyfloat = function(x) {
        return new Sk.builtin.nmber(x, Sk.builtin.nmber.float$);
    };
    var pyint = function(x) {
        return new Sk.builtin.nmber(x, Sk.builtin.nmber.int$);
    };

    mod.vec3 = Sk.misceval.buildClass(mod, function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(
            function(self, x, y, z) {
                self.v = {};
                self.v.x = jsnum(x) || 0;
                self.v.y = jsnum(y) || 0;
                self.v.z = jsnum(z) || 0;
            }
        );

        $loc.set = new Sk.builtin.func(
            function(self, x, y, z) {
                self.v.x = jsnum(x);
                self.v.y = jsnum(y);
                self.v.z = jsnum(z);
                return self;
            }
        );

        $loc.setX = new Sk.builtin.func(
            function(self, x) {
                self.v.x = jsnum(x);
                return self;
            }
        );

        $loc.setY = new Sk.builtin.func(
            function(self, y) {
                self.v.y = jsnum(y);
                return self;
            }
        );

        $loc.setY = new Sk.builtin.func(
            function(self, z) {
                self.v.z = jsnum(z);
                return self;
            }
        );

        $loc.setComponent = new Sk.builtin.func(
            function(self, index, value) {
                switch(jsnum(index)) {
                case 0: self.v.x = jsnum(value); break;
                case 1: self.v.y = jsnum(value); break;
                case 2: self.v.z = jsnum(value); break;
                default: throw new Error('index is out of range: ' + jsnum(index));
                }
            }
        );

        $loc.getComponent = new Sk.builtin.func(
            function(self, index) {
                switch(jsnum(index)) {
                case 0: return pyfloat(self.v.x);
                case 1: return pyfloat(self.v.y);
                case 2: return pyfloat(self.v.z);
                default: throw new Error('index is out of range: ' + jsnum(index));
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
                self.v.x += jsnum(s);
                self.v.y += jsnum(s);
                self.v.z += jsnum(s);
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

        $loc.subVectors = new Sk.builtin.func(
            function(self, a, b) {
                self.v.x = a.v.x - b.v.x;
                self.v.y = a.v.y - b.v.y;
                self.v.z = a.v.z - b.v.z;
                return self;
            }
        );

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
                var s = pyfloat(scalar);
                self.v.x *= s;
                self.v.y *= s;
                self.v.z *= s;
                return self;
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

        $loc.applyEuler = new Sk.builtin.func(
            function(self) {
                throw "vec3.applyEuler not implemented."
            }
        );

        $loc.applyAxisAngle = new Sk.builtin.func(
            function(self) {
                throw "vec3.applyAxisAngle not implemented."
            }
        );

        $loc.applyMatrix3 = new Sk.builtin.func(
            function(self, m) {
                var x = self.v.x;
                var y = self.v.y;
                var z = self.v.z;

                var e = m.v.elements;
                self.v.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
                self.v.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
                self.v.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;
                return self;
            }
        );

        $loc.applyMatrix4 = new Sk.builtin.func(
            function(self, m) {
                var x = self.v.x, y = self.v.y, z = self.v.z;
                var e = m.v.elements;
                self.v.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
                self.v.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
                self.v.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];
                return self;
            }
        );

        $loc.applyProjection = new Sk.builtin.func(
            function(self, m) {
                var x = self.v.x, y = self.v.y, z = self.v.z;
                var e = m.v.elements;
                var d = 1 /(e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide
                self.v.x =(e[0] * x + e[4] * y + e[8]  * z + e[12]) * d;
                self.v.y =(e[1] * x + e[5] * y + e[9]  * z + e[13]) * d;
                self.v.z =(e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
                return self;
            }
        );

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

        $loc.project = new Sk.builtin.func(
            function(self) {
                throw "Not implemented."
            }
        );

        $loc.unproject = new Sk.builtin.func(
            function(self) {
                throw "Not implemented."
            }
        );

        $loc.unproject = new Sk.builtin.func(
            function(self, m) {
                throw "Not implemented."
            }
        );

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
                var scalar = pyfloat(pyscalar);
                if(scalar !== 0) {
                    var invScalar = 1 / scalar;
                    self.v.x *= invScalar;
                    self.v.y *= invScalar;
                    self.v.z *= invScalar;
                } else {
                    self.v.x = 0;
                    self.v.y = 0;
                    self.v.z = 0;
                }
                return self;
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

        $loc.clampScalar = new Sk.builtin.func(
            function (self) {
                throw "Not implemented."
            }
        );

        $loc.floor = new Sk.builtin.func(
            function (self) {
                self.v.x = Math.floor(self.v.x);
                self.v.y = Math.floor(self.v.y);
                self.v.z = Math.floor(self.v.z);
                return self;
            }
        );

        $loc.ceil = new Sk.builtin.func(
            function (self) {
                self.v.x = Math.ceil(self.v.x);
                self.v.y = Math.ceil(self.v.y);
                self.v.z = Math.ceil(self.v.z);
                return self;
            }
        );

        $loc.round = new Sk.builtin.func(
            function (self) {
                self.v.x = Math.round(self.v.x);
                self.v.y = Math.round(self.v.y);
                self.v.z = Math.round(self.v.z);
                return self;
            }
        );

        $loc.roundToZero = new Sk.builtin.func(
            function (self) {
                self.v.x =(self.v.x < 0) ? Math.ceil(self.v.x) : Math.floor(self.v.x);
                self.v.y =(self.v.y < 0) ? Math.ceil(self.v.y) : Math.floor(self.v.y);
                self.v.z =(self.v.z < 0) ? Math.ceil(self.v.z) : Math.floor(self.v.z);
                return self;
            }
        );

        $loc.negate = new Sk.builtin.func(        
            function (self) {
                self.v.x = - self.v.x;
                self.v.y = - self.v.y;
                self.v.z = - self.v.z;
                return self;
            }
        );

        $loc.dot = new Sk.builtin.func(                
            function(self, v) {
                return self.v.x * v.v.x + self.v.y * v.v.y + self.v.z * v.v.z;
            }
        );

        $loc.lengthSq = new Sk.builtin.func(                        
            function (self) {
                return pynum(self.v.x * self.v.x + self.v.y * self.v.y +
                             self.v.z * self.v.z);
            }
        );

        $loc.length = new Sk.builtin.func(                                
            function (self) {
                return pynum(Math.sqrt(self.v.x * self.v.x + self.v.y * self.v.y +
                                       self.v.z * self.v.z));
            }
        );
/*
        lengthManhattan: function () {

                return Math.abs(self.v.x) + Math.abs(self.v.y) + Math.abs(self.v.z);

        },

        normalize: function () {

                return self.v.divideScalar(self.v.length());

        },

        setLength: function(self, l) {

                var oldLength = self.v.length();

                if(oldLength !== 0 && l !== oldLength) {

                        self.v.multiplyScalar(l / oldLength);
                }

                return self;

        },

        lerp: function(self, v, alpha) {

                self.v.x +=(v.x - self.v.x) * alpha;
                self.v.y +=(v.y - self.v.y) * alpha;
                self.v.z +=(v.z - self.v.z) * alpha;

                return self;

        },

        cross: function(self, v, w) {

                if(w !== undefined) {

                        console.warn('THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors(a, b) instead.');
                        return self.v.crossVectors(v, w);

                }

                var x = self.v.x, y = self.v.y, z = self.v.z;

                self.v.x = y * v.z - z * v.y;
                self.v.y = z * v.x - x * v.z;
                self.v.z = x * v.y - y * v.x;

                return self;

        },

        crossVectors: function(self, a, b) {

                var ax = a.x, ay = a.y, az = a.z;
                var bx = b.x, by = b.y, bz = b.z;

                self.v.x = ay * bz - az * by;
                self.v.y = az * bx - ax * bz;
                self.v.z = ax * by - ay * bx;

                return self;

        },

        projectOnVector: function () {

                var v1, dot;

                return function(vector) {

                        if(v1 === undefined) v1 = new THREE.Vector3();

                        v1.copy(vector).normalize();

                        dot = self.v.dot(v1);

                        return self.v.copy(v1).multiplyScalar(dot);

                };

        }(),

        projectOnPlane: function () {

                var v1;

                return function(planeNormal) {

                        if(v1 === undefined) v1 = new THREE.Vector3();

                        v1.copy(self).projectOnVector(planeNormal);

                        return self.v.sub(v1);

                }

        }(),

        reflect: function () {

                // reflect incident vector off plane orthogonal to normal
                // normal is assumed to have unit length

                var v1;

                return function(normal) {

                        if(v1 === undefined) v1 = new THREE.Vector3();

                        return self.v.sub(v1.copy(normal).multiplyScalar(2 * self.v.dot(normal)));

                }

        }(),

        angleTo: function(self, v) {

                var theta = self.v.dot(v) /(self.v.length() * v.length());

                // clamp, to handle numerical problems

                return Math.acos(THREE.Math.clamp(theta, - 1, 1));

        },

        distanceTo: function(self, v) {

                return Math.sqrt(self.v.distanceToSquared(v));

        },

        distanceToSquared: function(self, v) {

                var dx = self.v.x - v.x;
                var dy = self.v.y - v.y;
                var dz = self.v.z - v.z;

                return dx * dx + dy * dy + dz * dz;

        },

        setEulerFromRotationMatrix: function(self, m, order) {

                console.error('THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.');

        },

        setEulerFromQuaternion: function(self, q, order) {

                console.error('THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.');

        },

        getPositionFromMatrix: function(self, m) {

                console.warn('THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().');

                return self.v.setFromMatrixPosition(m);

        },

        getScaleFromMatrix: function(self, m) {

                console.warn('THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().');

                return self.v.setFromMatrixScale(m);
        },

        getColumnFromMatrix: function(self, index, matrix) {

                console.warn('THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().');

                return self.v.setFromMatrixColumn(index, matrix);

        },

        setFromMatrixPosition: function(self, m) {

                self.v.x = m.elements[ 12 ];
                self.v.y = m.elements[ 13 ];
                self.v.z = m.elements[ 14 ];

                return self;

        },

        setFromMatrixScale: function(self, m) {

                var sx = self.v.set(m.elements[ 0 ], m.elements[ 1 ], m.elements[  2 ]).length();
                var sy = self.v.set(m.elements[ 4 ], m.elements[ 5 ], m.elements[  6 ]).length();
                var sz = self.v.set(m.elements[ 8 ], m.elements[ 9 ], m.elements[ 10 ]).length();

                self.v.x = sx;
                self.v.y = sy;
                self.v.z = sz;

                return self;
        },

        setFromMatrixColumn: function(self, index, matrix) {

                var offset = index * 4;

                var me = matrix.elements;

                self.v.x = me[ offset ];
                self.v.y = me[ offset + 1 ];
                self.v.z = me[ offset + 2 ];

                return self;

        },

        equals: function(self, v) {

                return((v.x === self.v.x) &&(v.y === self.v.y) &&(v.z === self.v.z));

        },

        fromArray: function(self, array, offset) {

                if(offset === undefined) offset = 0;

                self.v.x = array[ offset ];
                self.v.y = array[ offset + 1 ];
                self.v.z = array[ offset + 2 ];

                return self;

        },

        toArray: function(self, array, offset) {

                if(array === undefined) array = [];
                if(offset === undefined) offset = 0;

                array[ offset ] = self.v.x;
                array[ offset + 1 ] = self.v.y;
                array[ offset + 2 ] = self.v.z;

                return array;

        },

        clone: function () {

                return new THREE.Vector3(self.v.x, self.v.y, self.v.z);

        }
*/


    }, 'vec3', []);
  return mod;
}
