var DefaultTransporter = require('gapi/transporters');

function logError(err) {
	if (err) {
		Ti.API.error(err);
	}
}

function createCallback(callback) {
	return typeof callback === 'function' ? callback : logError;
}

function getMissingParams(params, required) {
	var missing = [];
	required.forEach(function(param) {
		if (!params[param]) {
			missing.push(param);
		}
	});
	return missing.length > 0 ? missing : null;
}

function parsePath(path, params) {

  if (! path) {
    return path;
  }

  // escape path params
  var escapedParams = {};

  Object.keys(params).forEach(function(value) {
    escapedParams[value] = encodeURIComponent(params[value]);
  });

  // process the url template and return parsed url
  return parseString(path, escapedParams);
}


// NON-PORTED           yet..
function createAPIRequest(parameters, callback) {
	var req,
	    body,
	    missingParams;
	var params = parameters.params;
	var options = _.extend({}, parameters.options);

	// If the params are not present, and callback was passed instead,
	// use params as the callback and create empty params.
	if ( typeof params === 'function') {
		callback = params;
		params = {};
	}

	// Create a new params object so it can no longer be modified from outside code
	// Also support global and per-client params, but allow them to be overriden per-request
	params = _.extend({}, // New base object
	parameters.context.google._options.params, // Global params
	parameters.context._options.params, // Per-client params
	params // API call params
	);

	// Normalize callback
	callback = createCallback(callback);

	// Check for missing required parameters in the API request
	missingParams = getMissingParams(params, parameters.requiredParams);
	if (missingParams) {
		// Some params are missing - stop further operations and inform the developer which required
		// params are not included in the request
		callback(new Error('Missing required parameters: ' + missingParams.join(', ')));

		return null;
	}

	var media = params.media || {};
	var resource = params.resource;
	var authClient = params.auth || parameters.context._options.auth || parameters.context.google._options.auth;

	var defaultMime = typeof media.body === 'string' ? 'text/plain' : 'application/octet-stream';
	delete params.media;
	delete params.resource;
	delete params.auth;

	// Parse urls and urlescape path params
	options.url = parsePath(options.url, params);
	parameters.mediaUrl = parsePath(parameters.mediaUrl, params);

	// delete path parameters from the params object so they do not end up in query
	parameters.pathParams.forEach(function(param) {
		delete params[param];
	});

	// if authClient is actually a string, use it as an API KEY
	if ( typeof authClient === 'string') {
		params.key = params.key || authClient;
		authClient = null;
	}

	if (parameters.mediaUrl && media.body) {
		Ti.API.error('Media is not supported yet..');
		// options.url = parameters.mediaUrl;
		// if (resource) {
			// // Create a boundary identifier and multipart read stream
			// body = new Multipart();
// 
			// // Use multipart upload
			// params.uploadType = 'multipart';
// 
			// options.headers = {
				// 'Content-Type' : 'multipart/related; boundary="' + body.boundary + '"'
			// };
// 
			// // Add parts to multipart request
			// body.addPart({
				// headers : {
					// 'Content-Type' : 'application/json'
				// },
				// body : JSON.stringify(resource)
			// });
// 
			// body.addPart({
				// headers : {
					// 'Content-Type' : media.mimeType || resource && resource.mimeType || defaultMime
				// },
				// body : media.body // can be a readable stream or raw string!
			// });
		// } else {
			// params.uploadType = 'media';
			// options.headers = {
				// 'Content-Type' : media.mimeType || defaultMime
			// };
// 
			// if (isReadableStream(media.body)) {
				// body = media.body;
			// } else {
				// options.body = media.body;
			// }
		// }
	} 
	// else {
		options.json = resource || ((options.method === 'GET' || options.method === 'DELETE') ? true : {}
		);
	// }

	options.qs = params;
	options.useQuerystring = true;

	options = _.extend({}, parameters.context.google._options, parameters.context._options, options);
	delete options.auth;
	// is overridden by our auth code
	delete options.params;
	// We handle params ourselves and Request does not recognise 'params'

	// create request (using authClient or otherwise and return request obj)
	if (authClient) {
		req = authClient.request(options, callback);
	} else {
		req = new DefaultTransporter().request(options, callback);
	}

	// if (body) {
		// body.pipe(req);
	// }
	return req;
}


var nargs = /\{([0-9a-zA-Z]+)\}/g;
var slice = Array.prototype.slice;

function parseString(string) {
    var args;

    if (arguments.length === 2 && typeof arguments[1] === "object") {
        args = arguments[1];
    } else {
        args = slice.call(arguments, 1);
    }

    if (!args || !args.hasOwnProperty) {
        args = {};
    }

    return string.replace(nargs, function replaceArg(match, i, index) {
        var result;

        if (string[index - 1] === "{" &&
            string[index + match.length] === "}") {
            return i;
        } else {
            result = args.hasOwnProperty(i) ? args[i] : null;
            if (result === null || result === undefined) {
                return "";
            }

            return result;
        }
    });
}


module.exports = createAPIRequest; 