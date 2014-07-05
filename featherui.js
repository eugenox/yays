/**
 * @class FeatherUI
 */
function FeatherUI(buttons) {
	UI.call(this, new FeatherUI.Content(buttons));

	var toolbar = DH.walk(DH.id('movie_player'), '../../div[2]');

	DH.append(toolbar, this.button);
	DH.insertAfter(toolbar, this.panel);
}

FeatherUI.prototype = extend(UI, {
	_def: {
		button: function(click) {
			return {
				tag: 'button',
				attributes: {
					'class': 'b'
				},
				style: {
					'margin-left': '10px'
				},
				listeners: {
					'click': click
				},
				children: merge({
					style: {
						'vertical-align': 'sub',
						'opacity': '0.82'
					}
				}, UI.prototype._def.icon)
			};
		},

		panel: function(content) {
			return {
				attributes: {
					'class': 'hid'
				},
				style: {
					'padding': '10px',
					'margin-top': '0.5em'
				},
				children: UI.prototype._def.panel(content)
			};
		}
	},

	toggle: function() {
		UI.prototype.toggle.call(this);

		(DH.hasClass(this.panel, 'hid') ? DH.delClass : DH.addClass).call(DH, this.panel, 'hid');
	}
});

/**
 * @class FeatherUI.Content
 */
FeatherUI.Content = function(buttons) {
	UI.Content.call(this, buttons);
};

FeatherUI.Content.prototype = extend(UI.Content, {
	render: function() {
		var nodes = UI.Content.prototype.render.call(this);

		return map(function(node) {
			DH.attributes(node, {
				'class': 'b'
			});

			DH.style(DH.walk(node, 'span[0]'), {
				'font-size': '11px'
			});

			DH.style(DH.walk(node, 'span[1]'), {
				'font-weight': 'bold'
			});

			return node;
		}, nodes);
	}
});
