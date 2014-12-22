var apis = require('gapi/apis/index');

function GoogleApis(options) {
	this.options(options);
	this.addAPIs(apis);
	// this.auth = {
		// Compute: require('./auth/computeclient.js'),
		// JWT: require('./auth/jwtclient.js'),
		// OAuth2: require('./auth/oauth2client.js')
	// };
	this.GoogleApis = GoogleApis;

}

GoogleApis.prototype.options = function(opts) {
	this._options = opts || {};
};

GoogleApis.prototype.addAPIs = function(apis) {
  for (var apiName in apis) {
    this[apiName] = _.bind(apis[apiName], this);
  }
};

var google = new GoogleApis();

module.exports = google;
