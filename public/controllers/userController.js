angular.module('userController', [])
	.controller('mainUserController', function($scope, $http, User) {
		User.get().then(function(response) {
			$scope.user = response.data;
		});
	});