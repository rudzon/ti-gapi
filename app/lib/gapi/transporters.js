function DefaultTransporter() {
}

/**
 * Default user agent.
 */
DefaultTransporter.prototype.USER_AGENT = 'google-api-titanium-client/' + 0.1;
//+ pkg.version;

/**
 * Configures request options before making a request.
 * @param {object} opts Options to configure.
 * @return {object} Configured options.
 */
DefaultTransporter.prototype.configure = function(opts) {
	// set transporter user agent
	opts.headers = opts.headers || {};
	// opts.headers['User-Agent'] = opts.headers['User-Agent'] ?
	// opts.headers['User-Agent'] + ' ' + this.USER_AGENT : this.USER_AGENT;
	return opts;
};

DefaultTransporter.prototype.request = function(opts, opt_callback) {
	Ti.API.info('opts:', opts);
	Ti.API.info('opt_callback:', _.isFunction(opt_callback));
	opts = this.configure(opts);
	var xhr = Ti.Network.HTTPClient({
		
	});
	return xhr; //request(opts, this.wrapCallback_(opt_callback));
};

/**
 * Wraps the response callback.
 * @param {Function=} opt_callback Optional callback.
 * @return {Function} Wrapped callback function.
 * @private
 */
// DefaultTransporter.prototype.wrapCallback_ = function(opt_callback) {
	// return function(err, res, body) {
		// if (err || !body) {
			// return opt_callback && opt_callback(err, body, res);
		// }
		// // Only and only application/json responses should
		// // be decoded back to JSON, but there are cases API back-ends
		// // responds without proper content-type.
		// try {
			// body = JSON.parse(body);
		// } catch (err) {/* no op */
		// }
// 
		// if (body && body.error) {
			// // handle single request errors
			// err = body.error;
			// body = null;
		// }
// 
		// // there is no err and is a body and no body.error
		// // but server still returns error code
		// if (res.statusCode >= 500) {
			// err = {
				// code : res.statusCode,
				// message : body
			// };
			// body = null;
		// }
// 
		// if (opt_callback) {
			// opt_callback(err, body, res);
		// }
	// };
// };

module.exports = DefaultTransporter; 