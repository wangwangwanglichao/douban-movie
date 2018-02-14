'use strict';
(function (angular) {
	/*detail-module*/
	angular.module('movie.movie_detail', ['ngRoute', 'movie.service.http'])
		/*router*/
		.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/detail/:id', {
				templateUrl: 'movie_detail/view.html',
				controller: 'MovieDetailController'
			});
		}])
		/*controller*/
		.controller('MovieDetailController', [
			'$scope',
			'$route',
			'$routeParams',
			'httpService',
			'AppConfig',
			function ($scope, $route, $routeParams, httpService, AppConfig) {
				$scope.movie = {}; // 初始化电影数据
				$scope.loading = true;
				var id = $routeParams.id;
				var apiAddress = AppConfig.detailApiAddress + id;
				httpService.jsonp(apiAddress, {}, function (data) {
					$scope.movie = data; // 实例化电影数据
					$scope.movie.images.large = $scope.movie.images.large.replace(/http\w{0,1}:\/\//g, 'https://images.weserv.nl/?url='); // 图片加载403处理方法
					$scope.loading = false;
					$scope.$apply();
				});
			}
		]);
})(angular);
