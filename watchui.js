/**
 * @class WatchUI
 */
function WatchUI(buttons) {
	UI.call(this, new UI.Content(buttons));
}

WatchUI.prototype = extend(UI, {
	_def: {
		panel: function(content) {
			return {
				attributes: {
					'id': 'action-panel-yays',
					'class': 'action-panel-content hid',
					'data-panel-loaded': 'true'
				},
				style: {
					'display': 'none',
					'color': '#333'
				},
				children: UI.prototype._def.panel(content)
			};
		}
	}
});

/**
 * @class Watch7UI
 */
function Watch7UI(buttons) {
	WatchUI.call(this, buttons);

	DH.append(DH.id('watch7-secondary-actions'), this.button);
	DH.append(DH.id('watch7-action-panels'), this.panel);
}

Watch7UI.requirement = new UI.Requirement(['#watch7-secondary-actions', '#watch7-action-panels']);

Watch7UI.prototype = extend(WatchUI, {
	_def: {
		button: function(click) {
			return {
				tag: 'span',
				children: {
					tag: 'button',
					attributes: {
						'type': 'button',
						'role': 'button',
						'class': 'action-panel-trigger yt-uix-button yt-uix-button-text yt-uix-button-empty yt-uix-tooltip',
						'data-button-toggle': 'true',
						'data-trigger-for': 'action-panel-yays',
						'data-tooltip-text': _('Player settings')
					},
					listeners: {
						'click': click
					},
					children: {
						tag: 'span',
						attributes: {
							'class': 'yt-uix-button-icon-wrapper'
						},
						children: [UI.prototype._def.icon(), {
							tag: 'span',
							attributes: {
								'class': 'yt-uix-button-valign'
							}
						}]
					}
				}
			};
		},

		panel: WatchUI.prototype._def.panel
	}
});

/**
 * @class Watch8UI
 */
function Watch8UI(buttons) {
	WatchUI.call(this, buttons);

	DH.append(DH.id('watch8-secondary-actions'), this.button);
	DH.append(DH.id('watch-action-panels'), this.panel);
}

Watch8UI.requirement = new UI.Requirement(['#page.watch #watch8-secondary-actions', '#page.watch #watch-action-panels']);

Watch8UI.prototype = extend(WatchUI, {
	_def: {
		button: function(click) {
			return {
				tag: 'span',
				children: {
					tag: 'button',
					attributes: {
						'type': 'button',
						'class': 'action-panel-trigger yt-uix-button yt-uix-button-empty yt-uix-button-has-icon yt-uix-button-opacity yt-uix-button-opacity yt-uix-button-size-default yt-uix-tooltip',
						'data-button-toggle': 'true',
						'data-trigger-for': 'action-panel-yays',
						'data-tooltip-text': _('Player settings')
					},
					listeners: {
						'click': click
					},
					children: {
						tag: 'span',
						attributes: {
							'class': 'yt-uix-button-icon-wrapper'
						},
						children: UI.prototype._def.icon({
							attributes: {
								'class': 'yt-uix-button-icon'
							}
						})
					}
				}
			};
		},

		panel: WatchUI.prototype._def.panel
	}
});
