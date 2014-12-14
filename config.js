/*
 * Configuration handler singleton.
 */

var Config = (function() {
	// Greasemonkey compatible
	if (typeof GM_getValue == 'function') {
		return {
			get: GM_getValue,
			set: GM_setValue,
			del: GM_deleteValue
		};
	}

	var configStorage = new ScopedStorage(scriptStorage, 'config');

	// HTML5
	return {
		get: function(key) {
			return configStorage.getItem(key);
		},

		set: function(key, value) {
			configStorage.setItem(key, value);
		},

		del: function(key) {
			configStorage.removeItem(key);
		}
	};
})();
