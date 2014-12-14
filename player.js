/**
 * @class Player
 */
function Player(element, index) {
	this._element = element;
	this._index = index;
	this._context = new Context(scriptContext, 'player' + index);

	this._exportApiInterface();

	Console.debug('Player ready');

	this._muted = Number(this.isMuted() && ! Number(Player._storage.getItem('muted')));

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

	_elements: [],

	_storage: new ScopedStorage(scriptStorage, 'player'),

	test: function(element) {
		return typeof element.getApiInterface == 'function';
	},

	create: function(element, index) {
		switch (element.tagName) {
			case 'EMBED':
				return new FlashPlayer(element, index);
			case 'DIV':
				return new HTML5Player(element, index);
		}

		throw 'Unknown player type';
	},

	initialize: function(element) {
		if (this._elements.indexOf(element) > -1) {
			throw 'Player already initialized';
		}

		var index = this._elements.indexOf(null);

		if (index > -1) {
			this._elements[index] = element;
		}
		else {
			index = this._elements.push(element) - 1;
		}

		return this.create(element, index);
	},

	invalidate: function(player) {
		this._elements[player._index] = null;

		player.invalidate();
	}
});

Player.prototype = {
	_element: null,
	_index: null,
	_context: null,
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
		this.addEventListener('onStateChange', this._context.publish('onPlayerStateChange', asyncProxy(bind(this._onStateChange, this))));
	},

	_removeStateChangeListener: function() {
		this.removeEventListener('onStateChange', this._context.publish('onPlayerStateChange', noop));
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

			Player._storage.setItem('muted', '1');

			Console.debug('Player muted');
		}
	},

	unMute: function() {
		if (! --this._muted) {
			this._element.unMute();

			Player._storage.setItem('muted', '0');

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
function FlashPlayer(element, index) {
	Player.call(this, element, index);
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
function HTML5Player(element, index) {
	Player.call(this, element, index);
}

HTML5Player.prototype = extend(Player, {
	restartPlayback: function() {
		Player.prototype.restartPlayback.call(this);

		this.restartPlayback = noop;
	}
});
