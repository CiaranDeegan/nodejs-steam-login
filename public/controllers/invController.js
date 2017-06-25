angular.module('invController', [])
	.controller('mainInvController', function($scope, $http, Inventory) {
		Inventory.get().then(function(response) {
			$scope.inventory = response.data;
		});
	});