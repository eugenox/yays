/**
 * @class VideoPlayback
 */
function VideoPlayback(player) {
	SilentPlayerOption.call(this, player, 'video_playback');

	switch (this.get()) {
		case 0: // PLAY
			this._applied = true;
			break;

		case 3: // AUTO PAUSE
		case 4: // AUTO STOP
			// Video is visible or opened in the same window.
			if (this._isVisible() || unsafeWindow.history.length > 1) {
				this._applied = true;
			}
			// Video is opened in a background tab.
			else {
				this._handler = pageContext.protect(bind(this._handler, this));

				DH.on(unsafeWindow, 'focus', this._handler);
				DH.on(unsafeWindow, 'blur', this._handler);
			}
			break;
	}
}

VideoPlayback.prototype = extend(SilentPlayerOption, {
	_applied: false,
	_timer: null,

	_handler: function(e) {
		switch (e.type) {
			case 'focus':
				if (this._timer === null) {
					this._timer = setTimeout(bind(function() {
						if (this._applied) {
							this._player.resetState();
							this._player.playVideo();

							Console.debug('Playback autostarted');
						}
						else {
							this._applied = true;

							Console.debug('Playback not affected');

							this.mute(false);
						}

						DH.un(unsafeWindow, 'focus', this._handler);
						DH.un(unsafeWindow, 'blur', this._handler);

						this._timer = null;
					}, this), 500);
				}
				break;

			case 'blur':
				if (this._timer !== null) {
					clearTimeout(this._timer);

					this._timer = null;
				}
				break;
		}
	},

	// @see http://www.w3.org/TR/page-visibility/
	_isVisible: function() {
		var doc = unsafeWindow.document;
		return doc.hidden === false || doc.mozHidden === false || doc.webkitHidden === false;
	},

	apply: function() {
		if (! this._applied) {
			this.mute(true);

			if (this._player.isPlayerState(Player.PLAYING)) {
				this._applied = true;

				this._player.restartPlayback();

				if (this.get() % 2) { // (AUTO) PAUSE
					this._player.pauseVideo();
				}
				else { // (AUTO) STOP
					this._player.stopVideo();
				}

				this.mute(false);
			}
		}
	}
});

/**
 * @class VideoPlayback.Button
 */
VideoPlayback.Button = PlayerOption.Button.extend({
	label: _('Playback'),
	tooltip: _('Set default playback state'),
	states: [_('START'), _('PAUSE'), _('STOP'), _('AUTO PAUSE'), _('AUTO STOP')]
});
