/**
 * @class PlayerSize
 */
function PlayerSize(player) {
	PlayerOption.call(this, player, 'player_size');
}

#define CONTENT_WIDTH        1066
#define CONTROL_HEIGHT         30
#define PLAYER_WIDTH_SMALL    640
#define PLAYER_HEIGHT_SMALL   360
#define PLAYER_WIDTH_MEDIUM   854
#define PLAYER_HEIGHT_MEDIUM  480
#define PLAYER_WIDTH_LARGE   1280
#define PLAYER_HEIGHT_LARGE   720

#define SMALL(small, medium, large) small
#define MEDIUM(small, medium, large) medium
#define LARGE(small, medium, large) large

#define PLAYER_WIDTH(size)                                                           \
  size(PLAYER_WIDTH_SMALL, PLAYER_WIDTH_MEDIUM, PLAYER_WIDTH_LARGE)

#define PLAYER_HEIGHT(size)                                                          \
  size(PLAYER_HEIGHT_SMALL, PLAYER_HEIGHT_MEDIUM, PLAYER_HEIGHT_LARGE)

#define PLAYER_RATIO(size)                                                           \
  (PLAYER_WIDTH(size) / PLAYER_HEIGHT(size))

#define SCALE(target, size)                                                          \
  (target / PLAYER_WIDTH(size))

#define TRANSLATE(target, size, dimension)                                           \
  ((SCALE(target, size) - 1) / 2 * dimension(size))

#define TRANSFORM(target, size)                                                      \
  (                  SCALE(target, size),                                      0,    \
                                       0,                    SCALE(target, size),    \
   TRANSLATE(target, size, PLAYER_WIDTH), TRANSLATE(target, size, PLAYER_HEIGHT))

#define HTML5_CSS_SELECTOR(level, size)                                              \
  CONCATENATE(                                                                       \
    '.watch-', level, ' .html5-video-content[style*="', PLAYER_WIDTH(size), '"], ',  \
    '.watch-', level, ' .html5-video-content[style*="', PLAYER_HEIGHT(size), '"], ', \
    '.watch-', level, ' .html5-main-video[style*="', PLAYER_WIDTH(size), '"], ',     \
    '.watch-', level, ' .html5-main-video[style*="', PLAYER_HEIGHT(size), '"]'       \
  )

#define HTML5_CSS_TRANSFORM(target, size)                                            \
  CONCATENATE(                                                                       \
    'transform: matrix', EVALUATE(TRANSFORM(target, size)), ' !important; ',         \
    '-o-transform: matrix', EVALUATE(TRANSFORM(target, size)), ' !important; ',      \
    '-moz-transform: matrix', EVALUATE(TRANSFORM(target, size)), ' !important; ',    \
    '-webkit-transform: matrix', EVALUATE(TRANSFORM(target, size)), ' !important;'   \
  )

PlayerSize.prototype = extend(PlayerOption, {
	apply: function() {
		var mode = this.get(), rules = [];

		switch (mode) {
			case 2: // FIT
				rules.push(
					'.watch-medium .player-width {',
						CONCATENATE('width: ', CONTENT_WIDTH, 'px !important;'),
					'}',
					'.watch-medium .player-height {',
						CONCATENATE('height: ', EVALUATE(CONTENT_WIDTH / PLAYER_RATIO(MEDIUM) + CONTROL_HEIGHT), 'px !important;'),
					'}'
				);

				rules.push(
					'.watch-stage-mode #player .player-width {',
						CONCATENATE('left: ', - CONTENT_WIDTH / 2.0, 'px !important;'),
					'}'
				);

				rules.push(
					HTML5_CSS_SELECTOR('medium', SMALL), '{',
						HTML5_CSS_TRANSFORM(CONTENT_WIDTH, SMALL),
					'}'
				);

				rules.push(
					HTML5_CSS_SELECTOR('medium', MEDIUM), '{',
						HTML5_CSS_TRANSFORM(CONTENT_WIDTH, MEDIUM),
					'}'
				);

				break;

			case 1: // WIDE
				rules.push(
					HTML5_CSS_SELECTOR('medium', SMALL), '{',
						HTML5_CSS_TRANSFORM(PLAYER_WIDTH_MEDIUM, SMALL),
					'}'
				);

				break;

			default:
				return;
		}

		rules.push(
			HTML5_CSS_SELECTOR('large', MEDIUM), '{',
				HTML5_CSS_TRANSFORM(PLAYER_WIDTH_LARGE, MEDIUM),
			'}'
		);

		rules.push(
			'.watch-medium .html5-main-video,',
			'.watch-large .html5-main-video {',
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
