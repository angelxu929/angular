(function(angular){
   'use strict';

//创建正在热映模块
var module=angular.module('moviecat.movice_list', ['ngRoute','moviecat.services.http'])

//配置模块的路由
module.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/:category/:page', {
    templateUrl: 'movice_list/view.html',
    controller: 'Movice_listController'
  });
}])

module.controller('Movice_listController', [
	'$scope',
	'$route',
	'$routeParams',
	'HttpService',
	 function($scope,$route,$routeParams,HttpService) {
		 var page = parseInt($routeParams.page);
		 var count = 10;
		 var start = (page-1) *count;
    //控制器 分为俩步  1 设计暴露的数据 2设计暴露行为
         $scope.subjects =[]
         $scope.message ="";
         $scope.title ="";
		 $scope.totalCount = 0;
		 $scope.totalPages = 0;
		 $scope.currentPages = page;
		 //加载时出现遮罩层
		 $scope.loading = true;
		 HttpService.jsonp('http://api.douban.com/v2/movie/'+$routeParams.category,
			 {start:start,count:count},
			 function(data){
			 $scope.title = data.title;
			 $scope.subjects = data.subjects;
			 $scope.totalCount = data.total;
			 $scope.totalPages=Math.ceil($scope.totalCount / count);
			 //加载完后遮罩层消失
			 $scope.loading = false;
			 //$apply的作用就是所有表达式全部重新同步
			 $scope.$apply();
		 });
		 //暴露分页行为
		 $scope.go = function(page){
			 //传过来第几页就到第几页
			 if(page>=1 && page<=$scope.totalPages)
			 $route.updateParams({page:page})
		 };
}
]);

})(angular)
//var doubanapiAddress="http://api.douban.com/v2/movie/in_theaters";
// //在angular中使用JSONP的方式做跨域请求，
// //必须给房钱地址加一个参数callback=JSONP_CALLBACK
// //参数名不一定 但是值一定是JSONP_CALLBACK，但是请求时会被替换成随机参数值
//$http.jsonp(doubanapiAddress+'?callback=JSONP_CALLBACK').then(function(res){
// //此处代码是在异步请求完成过后才执行（需要一段时间）
// // console.log(res);
// if(res.status==200){
// 	$scope.subjects=res.data.subjects;
// }else{
// 	$scope.message="获取数据错误，错误信息"+res.statusText
// }
//},function(err){
//  $scope.message="获取数据错误，错误信息"+err.statusText;
//  console.log("444");
//});
