/**
 * @class ScopedStorage
 */
function ScopedStorage(scope, namespace) {
	this._scope = scope;
	this._ns = namespace;
}

ScopedStorage.prototype = {
	_scope: null,
	_ns: null,

	getItem: function(key) {
		return this._scope.getItem(this._ns + '.' + key);
	},

	setItem: function(key, value) {
		this._scope.setItem(this._ns + '.' + key, value);
	},

	removeItem: function(key) {
		this._scope.removeItem(this._ns + '.' + key);
	}
};

var scriptStorage = new ScopedStorage(unsafeWindow.localStorage, Meta.ns);
