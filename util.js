/*
 * Utility functions.
 */

function each(iterable, callback, scope) {
	if ('length' in iterable) {
		for (var i = 0, len = iterable.length; i < len; ++i) {
			callback.call(scope, i, iterable[i]);
		}
	}
	else {
		for (var key in iterable) {
			if (iterable.hasOwnProperty(key)) {
				callback.call(scope, key, iterable[key]);
			}
		}
	}
}

function map() {
	var
		args = Array.prototype.constructor.apply([], arguments),
		callback = args.shift() || bind(Array.prototype.constructor, []),
		results = [],
		i, len;

	if (args.length > 1) {
		var getter = function(arg) { return arg[i]; };
		len = Math.max.apply(Math, map(function(arg) { return arg.length; }, args));

		for (i = 0; i < len; ++i) {
			results.push(callback.apply(null, map(getter, args)));
		}
	}
	else {
		var arg = args[0];
		len = arg.length;

		for (i = 0; i < len; ++i) {
			results.push(callback(arg[i]));
		}
	}

	return results;
}

function unique(values) {
	values.sort();

	for (var i = 0, j; i < values.length; ) {
		j = i;

		while (values[j] === values[j - 1]) {
			j++;
		}

		if (j - i) {
			values.splice(i, j - i);
		}
		else {
			++i;
		}
	}

	return values;
}

function combine(keys, values) {
	var object = {};

	map(function(key, value) { object[key] = value; }, keys, values);

	return object;
}

function merge(target, source, override) {
	override = override === undefined || override;

	for (var key in source) {
		if (override || ! target.hasOwnProperty(key)) {
			target[key] = source[key];
		}
	}

	return target;
}

function extend(base, proto) {
	function T() {}
	T.prototype = base.prototype;

	return merge(new T(), proto);
}

function noop() {
	return;
}

function bind(func, scope, args) {
	return function() {
		return func.apply(scope, args === undefined ? arguments : args);
	};
}

function intercept(original, extension) {
	original = original || noop;

	return function() {
		extension.apply(this, arguments);

		return original.apply(this, arguments);
	};
}

function asyncCall(func, scope, args) {
	setTimeout(bind(func, scope, args), 0);
}

function asyncProxy(func) {
	return function() {
		asyncCall(func, this, arguments);
	};
}

function buildURL(path, parameters) {
	var query = [];
	each(parameters, function(key, value) { query.push(key.concat('=', encodeURIComponent(value))); });

	return path.concat('?', query.join('&'));
}

function parseJSON(data) {
	if (typeof JSON != 'undefined') {
		return JSON.parse(data);
	}

	return eval('(' + data + ')');
}
