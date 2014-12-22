var google = require('gapi/googleapis');
function doClick(e) {
	var urlshortener = google.urlshortener('v1');

	var printResult = function(err, result) {
		if (err) {
			console.log('Error occurred: ', err);
		} else {
			console.log('Result: ', result);
		}
	};

	urlshortener.url.get({
		shortUrl : 'http://goo.gl/DdUKX'
	}, printResult);
	urlshortener.url.insert({
		resource : {
			longUrl : 'http://somelongurl.com'
		}
	}, printResult);
}

$.index.open();
