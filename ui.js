/**
 * @class UI
 * Abstract UI class.
 */
function UI(content) {
	this.content = content;
	this.button = DH.build(this._def.button(bind(this.toggle, this)));
	this.panel = DH.build(this._def.panel(content));
}

merge(UI, {
	instance: null,

	initialize: function(type, content) {
		if (this.instance) {
			this.instance.destroy();
		}

		return this.instance = new type(content);
	}
});

UI.prototype = {
	_def: {
		icon: function(def) {
			def = merge({tag: 'img', attributes: {}}, def);

			def.attributes.src = 'data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAs0lEQVQoz4VRuRGDQAxcQDNLeKEz\
l2BCl+CQkIyjA3dCCYQugxJowWQ4AocEnnPAWTxjhlUirUar0y2wAGs6Otb4DyZ0PpKZjQAmcpVO\
MjwQezaTlzzlJvGnA8BGJ7fRABHvsNjDSd4hLloOKMZgDFBgUO48v91RlWg9U6/K1UU6EuIAIYD8\
Jzyv8EkOgKUe1U8NWvbKlYJW1QwqVpsN7eFHTR6kNCvhnpaG6dKTXbNwZPcX5uNiEvATXN0AAAAA\
SUVORK5CYII=';

			return def;
		},

		button: function(click) {
			return {
				listeners: {
					'click': click
				}
			};
		},

		panel: function(content) {
			return [{
				style: {
					'margin-bottom': '10px'
				},
				children: [{
					tag: 'strong',
					children: _('Player settings')
				}, {
					tag: 'a',
					attributes: {
						'href': Meta.site,
						'target': '_blank'
					},
					style: {
						'margin-left': '4px',
						'vertical-align': 'super',
						'font-size': '10px'
					},
					children: _('Help')
				}]
			}, {
				style: {
					'text-align': 'center'
				},
				children: content.render()
#if ! RELEASE
			}, {
				style: {
					'margin-top': '10px',
					'padding': '5px',
					'max-height': '200px',
					'overflow-y': 'auto',
					'color': '#777777',
					'font-size': '10px',
					'border': '1px solid #e2e2e2'
				},
				children: Console.display
#endif
			}];
		}
	},

	content: null,
	button: null,
	panel: null,

	destroy: function() {
		DH.remove(this.button);
		DH.remove(this.panel);
	},

	toggle: function() {
		this.content.refresh();
	}
};

/**
 * @class UI.Content
 */
UI.Content = function(buttons) {
	this._buttons = buttons;
};

UI.Content.prototype = {
	_buttons: null,

	render: function() {
		return map(function(button) { return button.render(); }, this._buttons);
	},

	refresh: function() {
		each(this._buttons, function(i, button) { button.refresh(); });
	}
};

/**
 * @class UI.Requirement
 */
UI.Requirement = function(queries) {
	this._queries = [].concat(queries);
};

UI.Requirement.prototype = {
	_queries: null,

	test: function() {
		return DH.query(this._queries.join(', ')).length >= this._queries.length;
	}
};

#include "watchui.js"

#include "channelui.js"
