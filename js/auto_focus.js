/**
 * Created by 520 on 2018/2/13.
 */
'use strict';
(function (angular) {
	angular.module('movie.directives.auto_focus', [])
		.directive('autoFocus', ['$location', function ($location) {
			return {
				restrict: 'A',
				link:function ($scope, iElm, iAttrs, controller) {
					$scope.$location = $location;
					$scope.$watch('$location.path()', function (now) {
						var aLink = iElm.children().attr('href');	// #/in_theaters
						var type = aLink.replace(/#(\/.+?)\/\d+/, '$1'); // /in_theaters
						if (now.startsWith(type)) {
							iElm.parent().children().removeClass('active');
							iElm.addClass('active');
						}
					});
				}
			}
		}]);
})(angular);




















