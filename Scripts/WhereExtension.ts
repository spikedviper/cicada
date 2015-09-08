interface Array<T>
{
	Select<U>(cvt: (item: T) => U): Array<U>;
	Where(predicate: (item: T) => boolean): Array<T>;
	Last(predicate: (item: T) => boolean): T;
	First(predicate: (item: T) => boolean): T;
	Any(predicate: (item: T) => boolean): boolean;
}

/** return First element in array  */
Array.prototype.First = function <T>(predicate: (item: T) => boolean): T
{
	for (var i = 0; i < this.length; i++)
		if (predicate(this[i]))
			return this[i];
	return null;
}

Array.prototype.Any = function <T>(predicate: (item: T) => boolean): boolean
{
    for (var i = 0; i < this.length; i++)
        if (predicate(this[i]))
            return true;
    return false;
}


/** return last element in array  */
Array.prototype.Last = function <T>(predicate: (item: T) => boolean): T
{
	if (this.length == 0)
		return null;

	if (predicate == null)
		return this[this.length - 1];
	else
	{
		var ret = null;
		for (var i = 0; i < this.length; i++)
			if (predicate(this[i]))
				ret = this[i];

		return ret;
	}
}


/** return a subset of an array matching a predicate */
Array.prototype.Where = function <T>(predicate: (item: T) => boolean): Array<T>
{
	var result = [];
	for (var i = 0; i < this.length; i++)
	{
		var item = this[i];
		if (predicate(item))
			result.push(item);
	}
	return result;
};
/** convert an array to another one */
Array.prototype.Select = function <T, U>(cvt: (item: T) => U): Array<U>
{
	var result = [];
	for (var i = 0; i < this.length; i++)
	{
		var item = this[i];
		var ci = cvt(item);
		result.push(ci);
	}
	return result;
};

interface Number
{
	Between(a: number, b: number): boolean;
}

Number.prototype.Between = function (a, b, inclusive = true)
{
	var min = Math.min.apply(Math, [a, b]),
		max = Math.max.apply(Math, [a, b]);
	return inclusive ? this >= min && this <= max : this > min && this < max;
};