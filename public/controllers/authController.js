angular.module('authController', [])
	.controller('loginStatusController', function($scope, $http) {
		$scope.loggedIn = false;
		$scope.username = "";
		$scope.isLoggedIn = function() {
			$http.get('/api/auth/loginstatus').then(successCallback, errorCallback);
			function successCallback(response) {
				$scope.loggedIn = response.data;
				$scope.username = response.data.username;
			}
			function errorCallback(error) {
				console.error(error);
			}
		};
	});