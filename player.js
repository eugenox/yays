/**
 * @class Player
 */
function Player(element) {
	this._element = element;

	this._exportApiInterface();

	Console.debug('Player ready');

	this._muted = Number(this.isMuted());

	this._addStateChangeListener();
}

#define RESTART_THRESHOLD 60

merge(Player, {
	UNSTARTED: -1,
	ENDED: 0,
	PLAYING: 1,
	PAUSED: 2,
	BUFFERING: 3,
	CUED: 5,

	instance: null,

	test: function(element) {
		return typeof element.getApiInterface == 'function';
	},

	visible: function(element) {
		return ! DH.closest(element, function(node) {
			return node.offsetWidth == 0 || node.offsetHeight == 0 || node.offsetTop <= -node.offsetHeight || node.offsetLeft <= -node.offsetWidth;
		});
	},

	create: function(element) {
		switch (element.tagName) {
			case 'EMBED':
				return new FlashPlayer(element);
			case 'DIV':
				return new HTML5Player(element);
		}

		throw 'Unknown player type';
	},

	initialize: function(element) {
		if (this.instance) {
			if (this.instance._element === element) {
				throw 'Player already initialized';
			}

			this.instance.invalidate();
		}

		return this.instance = this.create(element);
	}
});

Player.prototype = {
	_element: null,
	_muted: 0,

	_exportApiInterface: function() {
		each(this._element.getApiInterface(), function(i, method) {
			if (! (method in this)) {
				this[method] = bind(this._element[method], this._element);
			}
		}, this);
	},

	_unexportApiInterface: function() {
		each(this._element.getApiInterface(), function(i, method) {
			if (this.hasOwnProperty(method)) {
				delete this[method];
			}
		}, this);
	},

	_onStateChange: function(state) {
		Console.debug('State changed to', ['unstarted', 'ended', 'playing', 'paused', 'buffering', undefined, 'cued'][state + 1]);

		this.onStateChange(state);
	},

	_addStateChangeListener: function() {
		this.addEventListener('onStateChange', scriptContext.publish('onPlayerStateChange', asyncProxy(bind(this._onStateChange, this))));
	},

	_removeStateChangeListener: function() {
		this.removeEventListener('onStateChange', scriptContext.publish('onPlayerStateChange', noop));
	},

	invalidate: function() {
		this._removeStateChangeListener();
		this._unexportApiInterface();

		delete this.onStateChange;
		delete this._element;

		Console.debug('Player invalidated');

		this.invalidate = noop;
	},

	onStateChange: noop,

	isPlayerState: function() {
		return Array.prototype.indexOf.call(arguments, this.getPlayerState()) > -1;
	},

	getVideoId: function() {
		try {
			return this.getVideoData().video_id;
		}
		catch (e) {
			return (this.getVideoUrl().match(/\bv=([\w-]+)/) || [, undefined])[1];
		}
	},

	restartPlayback: function() {
		if (this.getCurrentTime() > RESTART_THRESHOLD) {
			Console.debug('Restart threshold exceeded');

			return;
		}

		var
			code = (location.hash + location.search).match(/\bt=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?/) || new Array(4),
			seconds = (Number(code[1]) || 0) * 3600 + (Number(code[2]) || 0) * 60 + (Number(code[3]) || 0);

		this.seekTo(seconds, true);
	},

	resetState: function() {
		this.seekTo(this.getCurrentTime(), true);
	},

	mute: function() {
		if (! this._muted++) {
			this._element.mute();

			Console.debug('Player muted');
		}
	},

	unMute: function() {
		if (! --this._muted) {
			this._element.unMute();

			Console.debug('Player unmuted');
		}
	},

	playVideo: function() {
		this._element.playVideo();

		Console.debug('Playback started');
	},

	pauseVideo: function() {
		this._element.pauseVideo();

		Console.debug('Playback paused');
	},

	stopVideo: function() {
		this._element.stopVideo();

		Console.debug('Playback stopped');
	},

	setPlaybackQuality: function(quality) {
		this._element.setPlaybackQuality(quality);

		Console.debug('Quality changed to', quality);
	}
};

/**
 * @class FlashPlayer
 */
function FlashPlayer(element) {
	Player.call(this, element);
}

FlashPlayer.prototype = extend(Player, {
	_exportApiInterface: function() {
		try {
			Player.prototype._exportApiInterface.call(this);
		}
		catch (e) {
			throw 'Player has not loaded yet';
		}
	},

	_unexportApiInterface: function() {
		try {
			Player.prototype._unexportApiInterface.call(this);
		}
		catch (e) {
			Console.debug('Player has unloaded');
		}
	},

	_removeStateChangeListener: function() {
		try {
			Player.prototype._removeStateChangeListener.call(this);
		}
		catch (e) {
			Console.debug('Player has unloaded');
		}
	}
});

/**
 * @class HTML5Player
 */
function HTML5Player(element) {
	Player.call(this, element);
}

HTML5Player.prototype = extend(Player, {
	restartPlayback: function() {
		Player.prototype.restartPlayback.call(this);

		this.restartPlayback = noop;
	}
});
