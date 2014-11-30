/*
 * Script context.
 */

var Context = (function() {
	function BasicContext(context, namespace) {
		if (context) {
			this._scope = this._createNamespace(context._scope, namespace);
			this._ns = context._ns + '.' + namespace;
		}
		else {
			this._scope = unsafeWindow;
			this._ns = 'window';
		}
	}

	BasicContext.prototype = {
		_scope: null,
		_ns: null,

		_createNamespace: function(scope, name) {
			return scope[name] = {};
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
		Context = function(context, namespace) {
			BasicContext.call(this, context, namespace);
		};

		Context.prototype = extend(BasicContext, {
			_createNamespace: function(scope, name) {
				return createObjectIn(scope, {defineAs: name});
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
	pageContext = new Context(),
	scriptContext = new Context(pageContext, Meta.ns);
