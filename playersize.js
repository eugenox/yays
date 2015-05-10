/**
 * @class PlayerSize
 */
function PlayerSize(player) {
	PlayerOption.call(this, player, 'player_size');
}

#define CONTROL_HEIGHT 30

#define WIDTH(width, height) width
#define HEIGHT(width, height) height

#define SMALL(small, medium, large) small
#define MEDIUM(small, medium, large) medium
#define LARGE(small, medium, large) large

#define RESOLUTION(dimension, size)                                                  \
  dimension(size( 854, 1280, 1920), size( 480,  720, 1080))

#define PLAYER(dimension, size)                                                      \
  dimension(size( 640,  854, 1280), size( 360,  480,  720))

#define SCALE(size, target)                                                          \
  (target / PLAYER(WIDTH, size))

#define TRANSLATE(size, target, dimension)                                           \
  ((SCALE(size, target) - 1) / 2 * PLAYER(dimension, size))

#define TRANSFORM(size, target)                                                      \
  (           SCALE(size, target),                               0,                  \
                                0,             SCALE(size, target),                  \
   TRANSLATE(size, target, WIDTH), TRANSLATE(size, target, HEIGHT))

#define HTML5_CSS_SELECTOR(size)                                                     \
  CONCATENATE(                                                                       \
    '.watch-stage-mode .html5-video-content[style*="', PLAYER(WIDTH, size), '"], ',  \
    '.watch-stage-mode .html5-video-content[style*="', PLAYER(HEIGHT, size), '"], ', \
    '.watch-stage-mode .html5-main-video[style*="', PLAYER(WIDTH, size), '"], ',     \
    '.watch-stage-mode .html5-main-video[style*="', PLAYER(HEIGHT, size), '"]'       \
  )

#define HTML5_CSS_TRANSFORM(size, target)                                            \
  CONCATENATE(                                                                       \
    'transform: matrix', EVALUATE(TRANSFORM(size, target)), ' !important; ',         \
    '-o-transform: matrix', EVALUATE(TRANSFORM(size, target)), ' !important; ',      \
    '-moz-transform: matrix', EVALUATE(TRANSFORM(size, target)), ' !important; ',    \
    '-webkit-transform: matrix', EVALUATE(TRANSFORM(size, target)), ' !important;'   \
  )

PlayerSize.prototype = extend(PlayerOption, {
	apply: function() {
		var mode = this.get(), rules = [];

		switch (mode) {
			case 4: // 1080p
				rules.push(
					'.watch-stage-mode .player-width {',
						CONCATENATE('left: ', - RESOLUTION(WIDTH, LARGE) / 2.0, 'px !important;'),
						CONCATENATE('width: ', RESOLUTION(WIDTH, LARGE), 'px !important;'),
					'}',

					'.watch-stage-mode .player-height {',
						CONCATENATE('height: ', EVALUATE(RESOLUTION(HEIGHT, LARGE) + CONTROL_HEIGHT), 'px !important;'),
					'}',

					HTML5_CSS_SELECTOR(SMALL), '{',
						HTML5_CSS_TRANSFORM(SMALL, RESOLUTION(WIDTH, LARGE)),
					'}',

					HTML5_CSS_SELECTOR(MEDIUM), '{',
						HTML5_CSS_TRANSFORM(MEDIUM, RESOLUTION(WIDTH, LARGE)),
					'}',

					HTML5_CSS_SELECTOR(LARGE), '{',
						HTML5_CSS_TRANSFORM(LARGE, RESOLUTION(WIDTH, LARGE)),
					'}'
				);

				break;

			case 3: // 720p
				rules.push(
					'.watch-stage-mode .player-width {',
						CONCATENATE('left: ', - RESOLUTION(WIDTH, MEDIUM) / 2.0, 'px !important;'),
						CONCATENATE('width: ', RESOLUTION(WIDTH, MEDIUM), 'px !important;'),
					'}',

					'.watch-stage-mode .player-height {',
						CONCATENATE('height: ', EVALUATE(RESOLUTION(HEIGHT, MEDIUM) + CONTROL_HEIGHT), 'px !important;'),
					'}',

					HTML5_CSS_SELECTOR(SMALL), '{',
						HTML5_CSS_TRANSFORM(SMALL, RESOLUTION(WIDTH, MEDIUM)),
					'}',

					HTML5_CSS_SELECTOR(MEDIUM), '{',
						HTML5_CSS_TRANSFORM(MEDIUM, RESOLUTION(WIDTH, MEDIUM)),
					'}'
				);

				break;

			case 2: // 480p
				rules.push(
					'.watch-stage-mode .player-width {',
						CONCATENATE('left: ', - RESOLUTION(WIDTH, SMALL) / 2.0, 'px !important;'),
						CONCATENATE('width: ', RESOLUTION(WIDTH, SMALL), 'px !important;'),
					'}',

					'.watch-stage-mode .player-height {',
						CONCATENATE('height: ', EVALUATE(RESOLUTION(HEIGHT, SMALL) + CONTROL_HEIGHT), 'px !important;'),
					'}',

					HTML5_CSS_SELECTOR(SMALL), '{',
						HTML5_CSS_TRANSFORM(SMALL, RESOLUTION(WIDTH, SMALL)),
					'}',

					HTML5_CSS_SELECTOR(LARGE), '{',
						HTML5_CSS_TRANSFORM(LARGE, RESOLUTION(WIDTH, SMALL)),
					'}'
				);

				break;

			case 1: // WIDE
				break;

			default:
				return;
		}

		if (rules.length) {
			rules.push(
				'.watch-stage-mode .html5-main-video {',
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
		}

		var page = DH.id('page');

		DH.delClass(page, 'watch-non-stage-mode');
		DH.addClass(page, 'watch-stage-mode watch-wide');

		this._player.setStageMode(true);

		Console.debug('Size set to', ['wide', '480p', '720p', '1080p'][mode - 1]);
	}
});

/**
 * @class PlayerSize.Button
 */
PlayerSize.Button = PlayerOption.Button.extend({
	label: _('Size'),
	tooltip: _('Set default player size'),
	states: [_('AUTO'), _('WIDE'), '480p', '720p', '1080p']
});
