var Twitter = require('twitter');
var Promise = require('promise');
var _ = require('underscore');
var markov = require('markov');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost');
var Tweet = mongoose.model('Tweet', {
    text: String,
    userId: String,
});

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
var chain = null;

var callbackFunction = function(error, tweets) {
  if (!error) {
    Promise.all(_.map(tweets, function(tweet) {
      return Tweet.create({
        text: tweet.text,
        userId: tweet.user.id_str
      });
    })).then(function(results) {
      console.log(JSON.stringify(results));
    });
  } else {
    console.log(error);
  }
};


client.get('statuses/user_timeline', params, callbackFunction);

var express = require('express');
var app = express();

app.use(express.static(__dirname + '/angular'));


app.get('/api/faketweets', function (req, res) {
  console.log(new Date + " Fetching tweets from mongodb...");
  Tweet.find().then(function(tweets) {
    console.log(new Date + " Got " + tweets.length + " tweets back from mongodb...");
    chain = markov();
    var textOfTweets = _.map(tweets, 'text');
    for (var i in textOfTweets) {
      var tweet = textOfTweets[i];
      chain.seed(tweet);
    }

    var key = chain.pick();
    var output = chain.forward(key, 100);
    var madeUpTweet = [key].concat(output).join(" ");
    res.send(madeUpTweet);
    console.log(new Date + " Returned: " + madeUpTweet);
  }).catch(function(err) {
    console.log(err);
    res.status(500).send('Something broke!');
  });
});

app.get('*', function(req, res) {
  // load the single view file (angular will handle the page changes on the front-end)
  res.sendfile('./angular/index.html');
});

app.listen(3000);
