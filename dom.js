/*
 * DOM Helper singleton.
 */

var DH = {
	ELEMENT_NODE: 1,

	build: function(def) {
		switch (Object.prototype.toString.call(def)) {
			case '[object Object]':
				var node = this.createElement(def.tag || 'div');

				if ('style' in def) {
					this.style(node, def.style);
				}

				if ('attributes' in def) {
					this.attributes(node, def.attributes);
				}

				if ('listeners' in def) {
					this.listeners(node, def.listeners);
				}

				if ('children' in def) {
					this.append(node, def.children);
				}

				return node;

			case '[object String]':
				return this.createTextNode(def);

			default:
				return def;
		}
	},

	id: bind(document.getElementById, document),
	query: bind(document.querySelectorAll, document),
	createElement: bind(document.createElement, document),
	createTextNode: bind(document.createTextNode, document),

	style: function(node, style) {
		each(style, node.style.setProperty, node.style);
	},

	append: function(node, children) {
		each([].concat(children), function(i, child) { node.appendChild(this.build(child)); }, this);
		node.normalize();
	},

	insertAfter: function(node, children) {
		var parent = node.parentNode, sibling = node.nextSibling;
		if (sibling) {
			each([].concat(children), function(i, child) { parent.insertBefore(this.build(child), sibling); }, this);
			parent.normalize();
		}
		else {
			this.append(parent, children);
		}
	},

	prepend: function(node, children) {
		if (node.hasChildNodes()) {
			each([].concat(children), function(i, child) { node.insertBefore(this.build(child), node.firstChild); }, this);
		}
		else {
			this.append(node, children);
		}
	},

	remove: function(node) {
		node.parentNode.removeChild(node);
	},

	attributes: function(node, attributes) {
		each(attributes, node.setAttribute, node);
	},

	hasClass: function(node, cls) {
		return node.hasAttribute('class') && new RegExp('\\b' + cls + '\\b').test(node.getAttribute('class'));
	},

	addClass: function(node, clss) {
		node.setAttribute('class', node.hasAttribute('class') ? unique(node.getAttribute('class').concat(' ', clss).trim().split(/ +/)).join(' ') : clss);
	},

	delClass: function(node, clss) {
		if (node.hasAttribute('class')) {
			node.setAttribute('class', node.getAttribute('class').replace(new RegExp('\\s*\\b(?:' + clss.replace(/ +/g, '|') + ')\\b\\s*', 'g'), ' ').trim());
		}
	},

	listeners: function(node, listeners) {
		each(listeners, function(type, listener) { this.on(node, type, listener); }, this);
	},

	on: function(node, type, listener) {
		node.addEventListener(type, listener, false);
	},

	un: function(node, type, listener) {
		node.removeEventListener(type, listener, false);
	},

	unwrap: function(element) {
		try {
			return XPCNativeWrapper.unwrap(element);
		}
		catch (e) {
			return element;
		}
	},

	walk: function(node, path) {
		var steps = path.split('/'), step = null;

		while (node && (step = steps.shift())) {
			if (step == '..') {
				node = node.parentNode;
				continue;
			}

			var selector = /^(\w*)(?:\[(\d+)\])?$/.exec(step), name = selector[1], index = Number(selector[2]) || 0;

			for (var i = 0, j = 0, nodes = node.childNodes; node = nodes.item(i); ++i) {
				if (node.nodeType == this.ELEMENT_NODE && (! name || node.tagName.toLowerCase() == name) && j++ == index) {
					break;
				}
			}
		}

		return node;
	},

	closest: function(node, predicate) {
		do {
			if (predicate(node)) {
				return node;
			}
		} while ((node = node.parentNode) && node.nodeType == this.ELEMENT_NODE);

		return null;
	},

	ready: function(listener) {
		if (document.readyState == 'loading') {
			DH.on(document, 'readystatechange', function onStateChange() {
				DH.un(document, 'readystatechange', onStateChange);

				listener();
			});
		}
		else {
			listener();
		}
	}
};
