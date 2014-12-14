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

	// HTML5
	return {
		get: function(key) {
			return scriptStorage.getItem(key);
		},

		set: function(key, value) {
			scriptStorage.setItem(key, value);
		},

		del: function(key) {
			scriptStorage.removeItem(key);
		}
	};
})();
