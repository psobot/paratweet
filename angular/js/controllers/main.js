angular.module('tweetController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope', 'Tweets', function($scope, Tweets) {
		$scope.tweet = "Loading...";

		$scope.loadTweet = function() {
			Tweets.get()
				.success(function(data) {
					$scope.tweet = data;
				});
		};
		$scope.loadTweet();
	}]);
