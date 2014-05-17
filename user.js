#include "meta.js"

#include "license.js"

function YAYS(unsafeWindow) {

'use strict';

/*
 * Meta.
 */

var Meta = {
	title:       STRINGIZE(SCRIPT_NAME),
	version:     STRINGIZE(SCRIPT_VERSION),
	releasedate: STRINGIZE(SCRIPT_RELEASE_DATE),
	site:        STRINGIZE(SCRIPT_SITE),
	ns:          STRINGIZE(SCRIPT_NS)
};

/*
 * Script context.
 */

var Context = unsafeWindow[Meta.ns] = {
	ns: Meta.ns
};

#include "util.js"

#include "console.js"

#include "dom.js"

#include "i18n.js"

#include "config.js"

#include "update.js"

#include "migrations.js"

#include "player.js"

#include "button.js"

#include "playeroption.js"

#include "ui.js"

/*
 * Ready callbacks.
 */

function onReady(player) {
	var videoPlayback = new VideoPlayback(player), videoQuality = new VideoQuality(player), previousVideo = player.getVideoId();

	player.onStateChange = function(state) {
		try {
			var currentVideo = player.getVideoId();

			if (currentVideo == previousVideo) {
				videoQuality.apply();
				videoPlayback.apply();
			}
			else {
				videoQuality.cease();
				videoPlayback.cease();

				throw null;
			}
		}
		catch (e) {
			player.invalidate();

			asyncCall(onPlayerReady);
		}
	};

	videoQuality.apply();
	videoPlayback.apply();

	DH.ready(function() {
		var page = DH.id('page');

		if (page) {
			if (DH.hasClass(page, 'watch')) {
				var playerSize = new PlayerSize(player);

				playerSize.apply();

				UI.initialize(WatchUI, [
					new VideoQuality.Button(videoQuality),
					new PlayerSize.Button(playerSize),
					new VideoPlayback.Button(videoPlayback)
				]);
			}
			else if (DH.hasClass(page, 'channel')) {
				UI.initialize(ChannelUI, [
					new VideoQuality.Button(videoQuality),
					new VideoPlayback.Button(videoPlayback)
				]);
			}
		}
		else {
			UI.initialize(FeatherUI, [
				new VideoQuality.Button(videoQuality),
				new VideoPlayback.Button(videoPlayback)
			]);
		}
	});
}

function onPlayerReady() {
	try {
		each(DH.query('video, embed'), function(i, node) {
			var player = DH.closest(node, bind(Player.test, Player));

			if (player) {
				player = Player.initialize(DH.unwrap(player));

				if (player.isVideoLoaded()) {
					onReady(player);

					throw 'Initialization finished';
				}
				else {
					player.invalidate();
				}
			}
		});

		throw 'Player not found';
	}
	catch (e) {
		Console.debug(e);
	}
}

unsafeWindow.onYouTubePlayerReady = intercept(unsafeWindow.onYouTubePlayerReady, asyncProxy(onPlayerReady));

onPlayerReady();

} // YAYS

if (window.top === window.self) {
	if (this.unsafeWindow) { // Greasemonkey.
		YAYS(unsafeWindow);
	}
	else {
		var node = document.createElement('script');
		node.setAttribute('type', 'text/javascript');
		node.text = '(' + YAYS.toString() + ')(window);';

		document.documentElement.appendChild(node);
		document.documentElement.removeChild(node);
	}
}
