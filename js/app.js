'use strict';
/*主模块*/
angular.module('movie', [
		'ngRoute',
		'movie.movie_detail',
		'movie.movie_list',
		'movie.directives.auto_focus'
	])
	/*常量*/
	.constant('AppConfig', {
		pageSize: 10,
		listApiAddress: 'http://api.douban.com/v2/movie/',
		detailApiAddress: 'http://api.douban.com/v2/movie/subject/'
	})
	/*路由器*/
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/in_theaters/1'});
	}])
	/*search bar控制器*/
	.controller('SearchController', ['$scope','$route', function ($scope, $route) {
		$scope.input = '';
		$scope.search = function () {
			$route.updateParams({
				category:'search',
				q:$scope.input
			});
		};
	}]);

