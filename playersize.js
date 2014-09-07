/**
 * @class PlayerSize
 */
function PlayerSize(player) {
	PlayerOption.call(this, player, 'player_size');
}

#define CONTENT_WIDTH       1040
#define CONTROL_HEIGHT        30
#define PLAYER_WIDTH_SMALL   640
#define PLAYER_HEIGHT_SMALL  360
#define PLAYER_WIDTH_MEDIUM  854
#define PLAYER_HEIGHT_MEDIUM 480

#define SMALL(small, medium) small
#define MEDIUM(small, medium) medium

#define PLAYER_WIDTH(size) size(PLAYER_WIDTH_SMALL, PLAYER_WIDTH_MEDIUM)
#define PLAYER_HEIGHT(size) size(PLAYER_HEIGHT_SMALL, PLAYER_HEIGHT_MEDIUM)
#define PLAYER_RATIO(size) (PLAYER_WIDTH(size) / PLAYER_HEIGHT(size))

#define SCALE(target, size) (target / PLAYER_WIDTH(size))
#define TRANSLATE(target, size, dimension) ((SCALE(target, size) - 1) / 2 * dimension(size))
#define TRANSFORM(target, size) (SCALE(target, size), 0, 0, SCALE(target, size), TRANSLATE(target, size, PLAYER_WIDTH), TRANSLATE(target, size, PLAYER_HEIGHT))

PlayerSize.prototype = extend(PlayerOption, {
	apply: function() {
		var mode = this.get(), rules = [];

		switch (mode) {
			case 2: // FIT
				rules.push(
					'.watch-medium,',
					'.watch-medium .player-width {',
						CONCATENATE('width: ', CONTENT_WIDTH, 'px !important;'),
					'}',
					'.watch-medium .player-height,',
					'.watch-medium #theater-background {',
						CONCATENATE('height: ', EVALUATE(CONTENT_WIDTH / PLAYER_RATIO(MEDIUM) + CONTROL_HEIGHT), 'px !important;'),
					'}',
					CONCATENATE('.watch-medium .html5-video-content[style*="', PLAYER_WIDTH_SMALL, '"],'),
					CONCATENATE('.watch-medium .html5-main-video[style*="', PLAYER_WIDTH_SMALL, '"] {'),
						CONCATENATE('transform: matrix', EVALUATE(TRANSFORM(CONTENT_WIDTH, SMALL)), ' !important;'),
						CONCATENATE('-o-transform: matrix', EVALUATE(TRANSFORM(CONTENT_WIDTH, SMALL)), ' !important;'),
						CONCATENATE('-moz-transform: matrix', EVALUATE(TRANSFORM(CONTENT_WIDTH, SMALL)), ' !important;'),
						CONCATENATE('-webkit-transform: matrix', EVALUATE(TRANSFORM(CONTENT_WIDTH, SMALL)), ' !important;'),
					'}',
					CONCATENATE('.watch-medium .html5-video-content[style*="', PLAYER_WIDTH_MEDIUM, '"],'),
					CONCATENATE('.watch-medium .html5-main-video[style*="', PLAYER_WIDTH_MEDIUM, '"] {'),
						CONCATENATE('transform: matrix', EVALUATE(TRANSFORM(CONTENT_WIDTH, MEDIUM)), ' !important;'),
						CONCATENATE('-o-transform: matrix', EVALUATE(TRANSFORM(CONTENT_WIDTH, MEDIUM)), ' !important;'),
						CONCATENATE('-moz-transform: matrix', EVALUATE(TRANSFORM(CONTENT_WIDTH, MEDIUM)), ' !important;'),
						CONCATENATE('-webkit-transform: matrix', EVALUATE(TRANSFORM(CONTENT_WIDTH, MEDIUM)), ' !important;'),
					'}'
				);

				break;

			case 1: // WIDE
				rules.push(
					CONCATENATE('.watch-medium .html5-video-content[style*="', PLAYER_WIDTH_SMALL, '"],'),
					CONCATENATE('.watch-medium .html5-main-video[style*="', PLAYER_WIDTH_SMALL, '"] {'),
						CONCATENATE('transform: matrix', EVALUATE(TRANSFORM(PLAYER_WIDTH_MEDIUM, SMALL)), ' !important;'),
						CONCATENATE('-o-transform: matrix', EVALUATE(TRANSFORM(PLAYER_WIDTH_MEDIUM, SMALL)), ' !important;'),
						CONCATENATE('-moz-transform: matrix', EVALUATE(TRANSFORM(PLAYER_WIDTH_MEDIUM, SMALL)), ' !important;'),
						CONCATENATE('-webkit-transform: matrix', EVALUATE(TRANSFORM(PLAYER_WIDTH_MEDIUM, SMALL)), ' !important;'),
					'}'
				);

				break;

			default:
				return;
		}

		rules.push(
			'.watch-medium .html5-main-video {',
				'z-index: -1;',
			'}'
		);

		DH.id('yays-player-size') || DH.append(document.body, {
			tag: 'style',
			attributes: {
				'id': 'yays-player-size',
				'type': 'text/css'
			},
			children: rules
		});

		var container = DH.id('watch7-container'), player = DH.id('player'), page = DH.id('page');

		DH.addClass(container, 'watch-wide');
		DH.delClass(player, 'watch-small');
		DH.addClass(player, 'watch-medium');
		DH.delClass(page, 'watch-non-stage-mode');
		DH.addClass(page, 'watch-stage-mode');

		Console.debug('Size set to', ['wide', 'fit'][mode - 1]);
	}
});

/**
 * @class PlayerSize.Button
 */
PlayerSize.Button = PlayerOption.Button.extend({
	label: _('Size'),
	tooltip: _('Set default player size'),
	states: [_('AUTO'), _('WIDE'), _('FIT')]
});
