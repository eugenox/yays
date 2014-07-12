/**
 * @class ChannelUI
 */
function ChannelUI(buttons) {
	UI.call(this, new UI.Content(buttons));

	DH.append(DH.id('channel-navigation-menu'), {
		tag: 'li',
		children: [this.button, this.panel]
	});
}

ChannelUI.requirement = new UI.Requirement('#page.channel #channel-navigation-menu');

ChannelUI.prototype = extend(UI, {
	_def: {
		button: function(click) {
			return {
				tag: 'button',
				attributes: {
					'type': 'button',
					'role': 'button',
					'class': 'yt-uix-button yt-uix-button-empty yt-uix-button-epic-nav-item yt-uix-tooltip flip',
					'data-button-menu-id': 'yays-panel-dropdown',
					'data-tooltip-text': _('Player settings')
				},
				style: {
					'position': 'absolute',
					'right': '20px',
					'width': '30px'
				},
				listeners: {
					'click': click
				},
				children: {
					tag: 'span',
					attributes: {
						'class': 'yt-uix-button-icon-wrapper'
					},
					style: {
						'opacity': '0.75'
					},
					children: UI.prototype._def.icon()
				}
			};
		},

		panel: function(content) {
			return {
				attributes: {
					'id': 'yays-panel-dropdown',
					'class': 'epic-nav-item-dropdown hid'
				},
				style: {
					'padding': '5px 10px 10px',
					'width': '450px'
				},
				children: UI.prototype._def.panel(content)
			};
		}
	}
});
