/**
 * @class VideoQuality
 */
function VideoQuality(player) {
	SilentPlayerOption.call(this, player, 'video_quality');

	this._applied = ! this.get();
}

VideoQuality.prototype = extend(SilentPlayerOption, {
	_applied: false,

	apply: function() {
		if (! this._applied) {
			this.mute(true);

			if (this._player.isPlayerState(Player.PLAYING, Player.PAUSED)) {
				this._applied = true;

				var quality = ['tiny', 'small', 'medium', 'large', 'hd720', 'hd1080', 'hd1440', 'highres'][this.get() - 1];

				if (quality != this._player.getPlaybackQuality()) {
					this._player.restartPlayback();
					this._player.setPlaybackQuality(quality);
				}

				asyncCall(this.apply, this);
			}
		} else if (this._player.isPlayerState(Player.PLAYING, Player.CUED)) {
			this.mute(false);
		}
	}
});

/**
 * @class VideoQuality.Button
 */
VideoQuality.Button = PlayerOption.Button.extend({
	label: _('Quality'),
	tooltip: _('Set default video quality'),
	states: [_('AUTO'), '144p', '240p', '360p', '480p', '720p', '1080p', '1440p', _('ORIGINAL')]
});
