var Twitter = require('twitter');
var _ = require('underscore');

var client = new Twitter({
  consumer_key: 'B5tGPxf01MFSVdojZOCpvedJ7',
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token_key: '',
  access_token_secret: ''
});

// The more sane way
if (process.argv.length < 3) {
	console.log("Please pass a screen_name argument!");
	process.exit(1);
}

var params = {screen_name: process.argv[2], count: 1000};

var callbackFunction = function(error, tweets) {
  if (!error) {
    console.log(_.map(tweets, 'text'));
  } else {
  	console.log(error);
  }
};

client.get('statuses/user_timeline', params, callbackFunction);
