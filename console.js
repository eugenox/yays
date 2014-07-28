/*
 * Console singleton.
 */

var Console = {
#if RELEASE
	debug: function() {
		unsafeWindow.console.debug('[' + Meta.ns + ']' + Array.prototype.join.call(arguments, ' '));
	}
#else
	display: document.createElement('pre'),

	debug: function() {
		var message = Array.prototype.join.call(arguments, ' ');

		this.display.appendChild(document.createTextNode(message + '\n'));
		unsafeWindow.console.debug('[' + Meta.ns + ']' + message);
	}
#endif
};
