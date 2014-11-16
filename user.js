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

#include "util.js"

#include "context.js"

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
	var
		videoPlayback = new VideoPlayback(player),
		videoQuality = new VideoQuality(player),
		playerSize = new PlayerSize(player),
		previousVideo = player.getVideoId();

	player.onStateChange = function() {
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

	if (Watch8UI.requirement.test()) {
		playerSize.apply();

		UI.initialize(Watch8UI, [
			new VideoQuality.Button(videoQuality),
			new PlayerSize.Button(playerSize),
			new VideoPlayback.Button(videoPlayback)
		]);
	}
	else if (ChannelUI.requirement.test()) {
		UI.initialize(ChannelUI, [
			new VideoQuality.Button(videoQuality),
			new VideoPlayback.Button(videoPlayback)
		]);
	}
}

function onPlayerReady() {
	try {
		each(DH.query('video, embed'), function(i, node) {
			var player = DH.closest(node, function(node) { return Player.test(DH.unwrap(node)); });

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

onPlayerReady();

// FIXME: The call to an exported function is rejected if a function (or an
// object with methods) is passed as argument.
//
// This restriction can be lifted in FF 33+ by setting the 'allowCallbacks'
// option when exporting the function.

var node = DH.build({
	tag: 'script',
	attributes: {
		'type': 'text/javascript'
	}
});

node.text = 'function onYouTubePlayerReady() { ' + scriptContext.publish('onPlayerReady', intercept(unsafeWindow.onYouTubePlayerReady, asyncProxy(onPlayerReady))) + '(); }';

document.documentElement.appendChild(node);
document.documentElement.removeChild(node);

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
