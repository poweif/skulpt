var $builtinmodule = function(name)
{
  var mod = {};
  var lastMouseTarget;

  mod.Init = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self, glcontext) {
        self.canvas = glcontext.canvas;
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

    $loc.LEFT_BUTTON = Sk.builtin.assk$(0, Sk.builtin.nmber.int$);
    $loc.RIGHT_BUTTON = Sk.builtin.assk$(1, Sk.builtin.nmber.int$);
    $loc.MIDDLE_BUTTON = Sk.builtin.assk$(2, Sk.builtin.nmber.int$);
    $loc.UP = Sk.builtin.assk$(3, Sk.builtin.nmber.int$);
    $loc.DOWN = Sk.builtin.assk$(4, Sk.builtin.nmber.int$);

    $loc.displayFunc = new Sk.builtin.func(function(self, func) {
      Sk.misceval.callsim(func, self.gl);
    });


    $loc.mouseFunc = new Sk.builtin.func(function(self, func) {
      self.canvas.onmousedown = function(ev) {
        var rect = self.canvas.getBoundingClientRect();
        var button = -1;
        if (ev.button == 0) button = self.LEFT_BUTTON;
        else if (ev.button == 1) button = self.MIDDLE_BUTTON;
        else if (ev.button == 2) button = self.RIGHT_BUTTON;
        Sk.misceval.callsim(func,
			    self.gl,
			    button,
                            self.DOWN,
                            Sk.builtin.assk$(ev.clientX - rect.left,
					     Sk.builtin.nmber.int$),
                            Sk.builtin.assk$(ev.clientY - rect.top,
					     Sk.builtin.nmber.int$));
      };
      self.canvas.onmouseup = function(ev) {
        var rect = self.canvas.getBoundingClientRect();
        var button = -1;
        if (ev.button == 0) button = self.LEFT_BUTTON;
        else if (ev.button == 1) button = self.MIDDLE_BUTTON;
        else if (ev.button == 2) button = self.RIGHT_BUTTON;
        Sk.misceval.callsim(func,
			    self.gl,
			    button,
                            self.UP,
                            Sk.builtin.assk$(ev.clientX - rect.left,
					     Sk.builtin.nmber.int$),
                            Sk.builtin.assk$(ev.clientY - rect.top,
					     Sk.builtin.nmber.int$));
      };
    });

    /*
     * glut's mouse motion model is different from that of JS and WebGL. We just
     * assume that motion callback is called for all mouse movement (pressed or
     * unpressed)
     */
    $loc.motionFunc = new Sk.builtin.func(function(self, func) {
      self.canvas.onmousemove = function(ev) {
        var rect = self.canvas.getBoundingClientRect();
        Sk.misceval.callsim(func,
			    self.gl,
                            Sk.builtin.assk$(ev.clientX - rect.left,
					     Sk.builtin.nmber.int$),
                            Sk.builtin.assk$(ev.clientY - rect.top,
					     Sk.builtin.nmber.int$));
      };
    });

    $loc.keyboardFunc = new Sk.builtin.func(function(self, func) {
      self.canvas.onPrivateKeyPress = function(ev) {
        var rect = self.canvas.getBoundingClientRect();
        var ch = ev.keyCode ? ev.keyCode : ev.which;
        Sk.misceval.callsim(func,
			    self.gl,
			    Sk.builtin.chr(ch),
                            Sk.builtin.assk$(ev.clientX - rect.left,
					     Sk.builtin.nmber.int$),
                            Sk.builtin.assk$(ev.clientY - rect.top,
					     Sk.builtin.nmber.int$));
      }
    });
  }, 'glut', []);

  return mod;
}

