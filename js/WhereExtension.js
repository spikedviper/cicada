Array.prototype.Contains = function (item) {
    for (var i = 0; i < this.length; i++)
        if (this[i] == item)
            return true;
    return false;
};
/** return First element in array  */
Array.prototype.First = function (predicate) {
    for (var i = 0; i < this.length; i++)
        if (predicate(this[i]))
            return this[i];
    return null;
};
Array.prototype.Any = function (predicate) {
    for (var i = 0; i < this.length; i++)
        if (predicate(this[i]))
            return true;
    return false;
};
/** return last element in array  */
Array.prototype.Last = function (predicate) {
    if (this.length == 0)
        return null;
    if (predicate == null)
        return this[this.length - 1];
    else {
        var ret = null;
        for (var i = 0; i < this.length; i++)
            if (predicate(this[i]))
                ret = this[i];
        return ret;
    }
};
/** return a subset of an array matching a predicate */
Array.prototype.Where = function (predicate) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (predicate(item))
            result.push(item);
    }
    return result;
};
/** convert an array to another one */
Array.prototype.Select = function (cvt) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        var ci = cvt(item);
        result.push(ci);
    }
    return result;
};
Number.prototype.Between = function (a, b, inclusive) {
    if (inclusive === void 0) { inclusive = true; }
    var min = Math.min.apply(Math, [a, b]), max = Math.max.apply(Math, [a, b]);
    return inclusive ? this >= min && this <= max : this > min && this < max;
};
