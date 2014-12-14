#if RELEASE

/*
 * Migrations.
 */

#define MIGRATION(_version) version: STRINGIZE(_version), apply: function()

(function(currentVersion) {
	var previousVersion = Config.get('version') || scriptStorage.getItem('version') || '1.0';

	if (previousVersion == currentVersion) {
		return;
	}

	previousVersion = map(Number, previousVersion.split('.'));

	each([
		{
			// Added "144p" to the quality levels.
			MIGRATION(1.7) {
				var videoQuality = Number(Config.get('video_quality'));
				if (videoQuality > 0 && videoQuality < 7) {
					Config.set('video_quality', ++videoQuality);
				}
			}
		},
		{
			// Autoplay reworked.
			MIGRATION(1.8) {
				switch (Number(Config.get('auto_play'))) {
					case 1: // OFF > PAUSE
						Config.set('video_playback', 1);
						break;

					case 2: // AUTO > AUTO PAUSE
						Config.set('video_playback', 3);
						break;
				}

				Config.del('auto_play');
			}
		},
		{
			// Added "1440p" to the quality levels.
			MIGRATION(1.10) {
				var videoQuality = Number(Config.get('video_quality'));
				if (videoQuality > 6) {
					Config.set('video_quality', ++videoQuality);
				}
			}
		},
		{
			// Introduced the ScopedStorage class.
			MIGRATION(1.14) {
				// Using a unique ScopedStorage for config outside of GM.
				each(['video_playback', 'video_quality', 'player_size', 'version'], function(i, key) {
					var value = scriptStorage.getItem(key);

					if (value) {
						Config.set(key, value);

						scriptStorage.removeItem(key);
					}
				});

				// Removed from the config.
				Config.del('update_checked_at');
			}
		}
	], function(i, migration) {
		var migrationVersion = map(Number, migration.version.split('.'));

		for (var j = 0, parts = Math.max(previousVersion.length, migrationVersion.length); j < parts; ++j) {
			if ((previousVersion[j] || 0) < (migrationVersion[j] || 0)) {
				Console.debug('Applying migration', migration.version);

				migration.apply();

				break;
			}
		}
	});

	Config.set('version', currentVersion);
})(Meta.version);

#endif
