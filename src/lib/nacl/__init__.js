var $builtinmodule = function(name)
{
  var mod = {};
  var next_method_id_ = 1;
  var method_name_to_id_ = {};

  var handleMessage = function(message) {
    if (message['header'] === 'registerMethodRet') {
      
    }
  };

  /* Encapsulates a nacl module */
  mod.Module = Sk.misceval.buildClass(mod, function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(
      function(self, module_name) {
        var module = document.getElementById(module_name.v);
        var listener = document.getElementById(module_name.v + "_listener");
        module.callMethod = function(method_id, params, return_id) {
          module.postMessage(
            {"mid": method_id, "params": data, "return": return_id}
          );
        };

        listener.addEventListener('message', handleMessage, true);

        self.module = module;
        self.listener = listener;
      }
    );

    $loc.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;

    $loc.registerMethod = new Sk.builtin.func(
      function(self, method_name) {
        self.js_module.postMessage(method_name.v);
      }
    );
      
    $loc.callMethod = new Sk.builtin.func(
      function(self, method_id, params, return_id) {
        self.module.callMethod(method_id.v, params.v, return_id.v);
      }
  }, 'Module', []);

  return mod;
};
