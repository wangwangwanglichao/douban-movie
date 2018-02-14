/**
 * Created by 520 on 2018/2/13.
 */
'use strict';
/*跨域请求*/
(function (angular) {
	angular.module('movie.service.http', [])
		.service('httpService', ['$window','$document', function ($window, $document) {
			this.jsonp = function (url, data, callback) {
				// 1. 将data转换为URL字符串的格式({id:123,name:abc} => id=123&name=abc)
				var queryString = url.indexOf('?') == -1 ? '?': '&'; // 判断URL中是否有?号,(有&符号无所谓)
				for (var key in data) {
					queryString += key + '=' + data[key] + '&'; // 遍历完的格式 queryString=?id=123&name=abc&
				}
				// 2. 处理URL中的回调函数(URL += callback=aldsknhfajkh)
				var cbFnName = 'my_json_cb_' + Math.random().toString().replace('.', '');
				queryString += 'callback=' + cbFnName; // 为了不与其他函数名冲突
				// queryString=?id=123&name=abc&cb=my_json_cb_087102398740
				// 3. 挂载回调函数
				$window[cbFnName] = function (data) {  // 将cbFnName挂靠到window上成为全局变量
					callback(data);	// 执行callback回调函数
					$document[0].body.removeChild(scriptElement); // 执行完callback之后移除标签
				};
				// 4. 创建script标签
				var scriptElement = $document[0].createElement('script');
				scriptElement.src = url + queryString;
				// src='api.douban.com/v2/movie/in_theaters?id=123&name=abc&cb=my_json_cb_087102398740
				// 5. 将script标签放入页面
				$document[0].body.appendChild(scriptElement);
			};
		}]);

})(angular);
