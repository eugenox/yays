#if RELEASE

#include "jsonrequest.js"

/*
 * Update checker.
 */

(function() {
	if (new Date().valueOf() - Number(Config.get('update_checked_at')) < EVALUATE(24 * 3600 * 1000)) { // 1 day
		return;
	}

	var popup = null;

	new JSONRequest(Meta.site + '/changelog', {version: Meta.version}, function(changelog) {
		Config.set('update_checked_at', new Date().valueOf().toFixed());

		if (changelog && changelog.length) {
			popup = renderPopup(changelog);
		}
	});

	function renderPopup(changelog) {
		return document.body.appendChild(DH.build({
			style: {
				'position': 'fixed',
				'bottom': '0',
				'width': '100%',
				'z-index': '1000',
				'background-color': '#f1f1f1',
				'border-top': '1px solid #cccccc'
			},
			children: {
				style: {
					'margin': '15px'
				},
				children: [{
					tag: 'strong',
					children: ['There is an update available for ', Meta.title, '.']
				}, {
					tag: 'p',
					style: {
						'margin': '10px 0'
					},
					children: [
						'You are using version ', {
							tag: 'strong',
							children: Meta.version
						}, ', released on ', {
							tag: 'em',
							children: Meta.releasedate
						}, '. Please consider updating to the latest version.'
					]
				}, {
					style: {
						'margin': '10px 0',
						'max-height': '150px',
						'overflow-y': 'auto'
					},
					children: {
						tag: 'a',
						children: 'Show changes',
						listeners: {
							click: function(e) {
								e.preventDefault();

								DH.insertAfter(e.target, map(function(entry) {
									return {
										style: {
											'margin-bottom': '5px'
										},
										children: [{
											tag: 'strong',
											children: entry.version
										}, ' ', {
											tag: 'em',
											children: ['(', entry.date, ')']
										}, {
											style: {
												'padding': '0 0 2px 10px',
												'white-space': 'pre'
											},
											children: [].concat(entry.note).join('\n')
										}]
									};
								}, [].concat(changelog)));

								DH.remove(e.target);
							}
						}
					}
				}, {
					children: map(function(text, handler) {
						return DH.build({
							tag: 'button',
							attributes: {
								'type': 'button',
								'class': 'yt-uix-button yt-uix-button-default'
							},
							style: {
								'margin-right': '10px',
								'padding': '5px 15px'
							},
							children: text,
							listeners: {
								'click': handler
							}
						});
					}, ['Update', 'Dismiss'], [openDownloadSite, removePopup])
				}]
			}
		}));
	}

	function removePopup() {
		document.body.removeChild(popup);
	}

	function openDownloadSite() {
		removePopup();
		unsafeWindow.open(buildURL(Meta.site + '/download', {version: Meta.version}));
	}
})();

#endif
