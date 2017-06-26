angular.module('invController', [])
	.controller('mainInvController', function($scope, $http, Inventory) {
		$scope.invReady = false;
		Inventory.get().then(function(response) {
			$scope.invReady = true;
			$scope.inventory = response.data;
		});
	});