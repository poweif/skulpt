var $builtinmodule = function(name) {
    var mod = {};

    var findDollar = function(str, from) {
        var i = str.indexOf('$', from);
        if (i < 0)
            return -1;
        if (i > 0 && str[i - 1] == '\\')
            return findDollar(str, i + 1);
        return i;
    };

    var process = function(str) {
        if (!str || str.length == 0) return '';

        var startD = findDollar(str, 0);
        if (startD < 0) return str;
        var endD  = findDollar(str, startD + 1);
        if (endD < 0)
            throw "md parse error: no closing $ (inline math)";
        var sub = str.substring(startD + 1, endD);

        return str.substring(0, startD) +
            katex.renderToString(sub) +
            process(str.substring(endD + 1));
    };

    mod.kd = new Sk.builtin.func(function(str) {
        Sk.createDomDiv().dom.innerHTML = kramed(process(str.v));
    });

    return mod;
};
