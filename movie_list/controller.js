'use strict';

(function (angular) {
	/*子模块*/
	angular.module('movie.movie_list', ['ngRoute', 'movie.service.http'])
		/*路由器*/
		.config(['$routeProvider', function ($routeProvider) {
			$routeProvider.when('/:category/:page', {
				templateUrl: 'movie_list/view.html',
				controller: 'MovieListController'
			});
		}])
		/*控制器*/
		.controller('MovieListController', [
			'$scope',
			'$route',
			'$routeParams',
			'httpService',
			function ($scope, $route, $routeParams, httpService) {
				var page = parseInt($routeParams.page); // 从:page拿到的数值
				var count = 10; 	   // 每页的电影条目数
				var start = (page - 1) * count; // 每页开始时的电影条目索引值
				$scope.totalCount = 0; // 总共的电影条目数
				$scope.pageCount = 0;  // 总共的页数
				$scope.loading = true; // 加载动画控制布尔值
				$scope.currentPage = page; // 当前页数
				$scope.title = '拼命加载中';
				/*跨域请求方法*/
				httpService.jsonp(
					'http://api.douban.com/v2/movie/' + $routeParams.category,
					{
						start: start,
						count: count,
						q:$routeParams.q
					},
					function (data) {
						$scope.subjects = data.subjects;
						$scope.title = data.title;
						$scope.total = data.total;
						for (var i = 0; i < $scope.subjects.length; i++) {
							$scope.subjects[i].images.small = $scope.subjects[i].images.small.replace(/http\w{0,1}:\/\//g, 'https://images.weserv.nl/?url='); // 图片加载403处理方法
						}
						$scope.totalCount = data.total; // 总共的电影条目数
						$scope.totalPages = Math.ceil($scope.totalCount / count); // 总共的页数
						$scope.loading = false; // 加载动画控制布尔值
						$scope.$apply();
					});
				/*上一页||下一页方法*/
				$scope.go = function (page) {
					if (page >= 1 && page <= $scope.totalPages)
					$route.updateParams({page:page});
				};
			}]);


	// 由于angular提供的异步请求不支持自定义回调函数名称,随机分配的名称与豆瓣API规则相冲突;
	// 本地数据请求可以用,不支持跨域向豆瓣API发送请求
	/*.controller('InTheatersController', [
	 '$scope',
	 '$http',
	 function ($scope, $http) {
	 $http.get('./data.json').then(function (res) {
	 if (res.status == 200) {
	 $scope.subjects = res.data.subjects;
	 } else {
	 $scope.message = '获取数据错误';
	 }
	 }, function (err) {
	 console.log(err);
	 $scope.message = '获取数据错误';
	 });
	 }]);*/

})(angular);


// 跨域组件试验
(function (window, document) {
	window.$jsonp = function (url, data, callback) {
		// 1. 将data转换为URL字符串的格式({id:123,name:abc} => id=123&name=abc)
		var queryString = url.indexOf('?') == -1 ? '?' : '&'; // 判断URL中是否有?号,(有&符号无所谓)
		for (var key in data) {
			queryString += key + '=' + data[key] + '&'; // 遍历完的格式 queryString=?id=123&name=abc&
		}
		// 2. 处理URL中的回调函数(URL += callback=aldsknhfajkh)
		var cbFnName = 'my_json_cb_' + Math.random().toString().replace('.', '');
		queryString += 'callback=' + cbFnName; // 为了不与其他函数名冲突
		// queryString=?id=123&name=abc&cb=my_json_cb_087102398740
		// 3. 挂载回调函数
		window[cbFnName] = callback; // 将cbFnName挂靠到window上成为全局变量
		// 4. 创建script标签
		var scriptElement = document.createElement('script');
		scriptElement.src = url + queryString;
		// src='api.douban.com/v2/movie/in_theaters?id=123&name=abc&cb=my_json_cb_087102398740
		// 5. 将script标签放入页面
		document.body.appendChild(scriptElement);
	};
})(window, document);
