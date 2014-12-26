var $builtinmodule = function(name)
{
  var mod = {};

  var mod.retMethods = {};

  var METHOD_RETURN = 2;

  var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z0-9]+)/)[1]
      .toLowerCase();
  }

  var varToPyPrimitive = function(vobj) {
    var type = toType(vobj);
    if (type === "arraybuffer") {

    } else {
      return Sk.ffi.remapToPy(vobj);
    }
  }

  /* Encapsulates a nacl module */
  mod.Module = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(
      function(self, nmf_file_name) {
        var module = document.getElementById(module_name.v);
        var listener = document.getElementById(module_name.v + "_listener");
        self.module = module;
        self.listener = listener;
        self.listener.addEventListener('message', handleMessage, true);

        self.listener.handleMessage = function(message) {
          var type = message['type'];
          if (type === METHOD_RETURN) {
            var retm = mod.retMethods[message['method_name']];
            Sk.misceval.callsim(retm, varToPyPrimitive(
          }
        };
      }
    );

    $loc.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;

    $loc.registerMethod = new Sk.builtin.func(
      function(self, method_name, return_name) {
        Sk.abstr.objectSetItem(
          self['$d'],
          new Sk.builtin.str(method_name),
          new Sk.builtin.func(function() {
            self.module.postMessage(.apply(gl, arguments);
          })
        );
      }
    );

    $loc.callMethod = new Sk.builtin.func(
      function(self, method_id, params, return_id) {
        self.module.callMethod(method_id.v, params.v, return_id.v);
      }
  }, 'Module', []);

  return mod;
};
