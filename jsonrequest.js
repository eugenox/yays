/**
 * @class JSONRequest
 * Create XHR or JSONP requests.
 */
var JSONRequest = (function() {
	var Request = null;

	// XHR
	if (typeof GM_xmlhttpRequest == 'function') {
		Request = function(url, parameters, callback) {
			this._callback = callback;

			GM_xmlhttpRequest({
				method: 'GET',
				url: buildURL(url, parameters),
				onload: bind(this._onLoad, this)
			});
		};

		Request.prototype = {
			_onLoad: function(response) {
				this._callback(parseJSON(response.responseText));
			}
		};
	}
	// JSONP
	else {
		var counter = 0;

		Request = function(url, parameters, callback) {
			this._callback = callback;
			this._id = 'jsonp_' + counter++;

			parameters.callback = scriptContext.publish(this._id, bind(this._onLoad, this));

			this._scriptNode = document.body.appendChild(DH.build({
				tag: 'script',
				attributes: {
					'type': 'text/javascript',
					'src': buildURL(url, parameters)
				}
			}));
		};

		Request.prototype = {
			_callback: null,
			_id: null,
			_scriptNode: null,

			_onLoad: function(response) {
				this._callback(response);

				scriptContext.revoke(this._id);

				document.body.removeChild(this._scriptNode);
			}
		};
	}

	return Request;
})();
