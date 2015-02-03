// For managing programmatically generated dom objects from the python side.  Methods for creation,
// destruction.

Sk.progdoms = [];

(function() {
    var generateRandomId = function(len) {
        // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var nlen = len ? len : 24;
        for( var i=0; i < nlen; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    var create = function(type) {
        var id = type + '_' + generateRandomId();
        var dom = document.createElement(type);
        dom.id = id;
        var ret = {id: id, dom: dom};
        Sk.progdoms.push(ret);
        return ret;
    };

    Sk.createDomCanvas = function(id) {
        return create("canvas");
    };
    goog.exportSymbol("Sk.createDomCanvas", Sk.createDomCanvas);

    Sk.createDomP = function(id) {
        return create("p");
    };
    goog.exportSymbol("Sk.createDomP", Sk.createDomP);
})();

Sk.progdomIds = function() {
    return Sk.progdoms;
};
goog.exportSymbol("Sk.progdomIds", Sk.progdomIds);

Sk.resetProgdoms = function() {
    Sk.progdoms.map(function(dom) {
        if (dom.parentNode) {
            dom.parentNode.removeChild(dom);
        }
    });
    Sk.progdoms = [];
};
