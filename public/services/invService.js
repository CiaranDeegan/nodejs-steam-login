angular.module('invService', [])
	.factory('Inventory', function($http) {
		return {
			get : function() {
				return $http.get('/api/inventory/');
			}
		}
	});