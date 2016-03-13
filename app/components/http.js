'use strict';
(function(angular){
	//由于默认angular提供的异步请求对象不支持自定义回调函数名
	//angular随机分配的回调函数名称不被豆瓣支持
	var http = angular.module('moviecat.services.http',[]);
	http.service('HttpService',['$window','$document',function($window,$document){
		//url:http://api.douban.com/vsdff封装到一个script中，把script放到html中

		this.jsonp = function(url,data,callback){
			//	3 挂载回到函数
			//不推荐挂载因为会导致全局污染 建议向angular中一样callbacks.放在一个全局对象里面
			var number = 'my_json_cb'+Math.random().toString().replace('.','');
			$window[number] =callback;
			//将data装换为url字符串形式
			var querystring = url.indexOf('?')==-1?'?':"&";
			for(var key in data){
				querystring +=key +'='+data[key]+"&";
			}
			//  1 处理url中的回调函数
			//函数名可以任意但是要看请求的第三方是否要求了名字 豆瓣就要求是callback

			querystring+='callback='+number;
			//	2 创建一个script标签
			var script =$document[0].createElement('script')
			script.src = url + querystring;
			//此时还不能append页面中 因为又可以回调函数还没有准备好 所以先挂载
			//	4 把script标签放到html中
			$document[0].body.appendChild(script);
			//append过后页面自动去请求文件 请求后就自动执行
		}
	}])
})(angular)
