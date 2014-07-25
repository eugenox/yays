/*
 * Script context.
 */

var Context = (function() {
	function BasicContext(namespace) {
		if (namespace) {
			this._scope = this._createNamespace(namespace);
			this._ns = namespace;
		}
		else {
			this._scope = unsafeWindow;
			this._ns = 'window';
		}
	}

	BasicContext.prototype = {
		_scope: null,
		_ns: null,

		_createNamespace: function(namespace) {
			return unsafeWindow[namespace] = {};
		},

		protect: function(entity) {
			return entity;
		},

		publish: function(name, entity) {
			this._scope[name] = this.protect(entity);

			return this._ns + '.' + name;
		},

		revoke: function(name) {
			delete this._scope[name];
		}
	};

	var Context;

	if (typeof exportFunction == 'function') {
		Context = function(namespace) {
			BasicContext.call(this, namespace);
		};

		Context.prototype = extend(BasicContext, {
			_createNamespace: function(namespace) {
				return createObjectIn(unsafeWindow, {defineAs: namespace});
			},

			protect: function(entity) {
				switch (typeof entity) {
					case 'function':
						return exportFunction(entity, this._scope);

					case 'object':
						return cloneInto(entity, this._scope);
				}
			}
		});
	}
	else {
		Context = BasicContext;
	}

	return Context;
})();

var
	scriptContext = new Context(Meta.ns),
	pageContext = new Context();
