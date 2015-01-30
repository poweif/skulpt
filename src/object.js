/**
 * @constructor
 */
Sk.builtin.object = function () {
    if (!(this instanceof Sk.builtin.object)) {
        return new Sk.builtin.object();
    }
    this["$d"] = new Sk.builtin.dict([]);
    return this;
};

Sk.builtin.object.prototype.realGenericGetAttr = function (name, obj, tp) {
    var res;
    var f;
    var descr;
    var tp;
    goog.asserts.assert(typeof name === "string");
    goog.asserts.assert(tp !== undefined, "object has no type!");

    descr = Sk.builtin.type.typeLookup(tp, name);
    // otherwise, look in the type for a descr
    if (descr !== undefined && descr !== null && descr.ob$type !== undefined) {
        f = descr.ob$type.tp$descr_get;
    }

    // todo; assert? force?
    if (obj["$d"]) {
        if (obj["$d"].mp$lookup) {
            res = obj["$d"].mp$lookup(new Sk.builtin.str(name));
        }
        else if (obj["$d"].mp$subscript) {
            try {
                res = obj["$d"].mp$subscript(new Sk.builtin.str(name));
            } catch (x) {
                res = undefined;
            }
        }
        else if (typeof obj["$d"] === "object") {
            // todo; definitely the wrong place for this.
            // other custom tp$getattr won't work on object
            // -- bnm -- implemented custom __getattr__ in abstract.js
            res = obj["$d"][name];
        }
        if (res !== undefined) {
            return res;
        }
    }

    if (f) {
        // non-data descriptor
        return f.call(descr, obj, tp);
    }

    if (descr !== undefined) {
        return descr;
    }

    return undefined;
};

goog.exportSymbol("Sk.builtin.object.prototype.realGenericGetAttr", Sk.builtin.object.prototype.realGenericGetAttr);

/**
 * @return {undefined}
 */
Sk.builtin.object.prototype.GenericGetAttr = function (name) {
    return Sk.builtin.object.prototype.realGenericGetAttr(name, this, this.ob$type);
};

goog.exportSymbol("Sk.builtin.object.prototype.GenericGetAttr", Sk.builtin.object.prototype.GenericGetAttr);

Sk.builtin.object.prototype.GenericSetAttr = function (name, value) {
    goog.asserts.assert(typeof name === "string");
    // todo; lots o' stuff
    if (this["$d"].mp$ass_subscript) {
        this["$d"].mp$ass_subscript(new Sk.builtin.str(name), value);
    }
    else if (typeof this["$d"] === "object") {
        this["$d"][name] = value;
    }
};
goog.exportSymbol("Sk.builtin.object.prototype.GenericSetAttr", Sk.builtin.object.prototype.GenericSetAttr);

Sk.builtin.object.prototype.HashNotImplemented = function () {
    throw new Sk.builtin.TypeError("unhashable type: '" + Sk.abstr.typeName(this) + "'");
};

Sk.builtin.object.prototype.tp$getattr = Sk.builtin.object.prototype.GenericGetAttr;
Sk.builtin.object.prototype.tp$setattr = Sk.builtin.object.prototype.GenericSetAttr;
Sk.builtin.object.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("object", Sk.builtin.object);

/**
 * @constructor
 */
Sk.builtin.none = function () {
};
Sk.builtin.none.prototype.ob$type = Sk.builtin.type.makeIntoTypeObj("NoneType", Sk.builtin.none);
Sk.builtin.none.prototype.tp$name = "NoneType";
Sk.builtin.none.none$ = Object.create(Sk.builtin.none.prototype, {v: {value: null, enumerable: true}});

goog.exportSymbol("Sk.builtin.none", Sk.builtin.none);
