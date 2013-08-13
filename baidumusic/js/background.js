/**************************************************************
 *@ background.js
 *@作者: 有一份田
 *@日期:2013.08.12
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/
 *@转载重用请保留此信息.
 *
 *@最后修改时间:2013.08.14
 *
 ***************************************************************/
chrome.runtime.onInstalled.addListener(function(ExtensionInfo) {
	googleAnalytics();
	localStorage["version"]="1.0.1";
});
function onRequest(request, sender, sendResponse){
	var cmd=request.cmd;
	googleAnalytics();
	if("analytics"==cmd){
		_gaq.push(['_trackEvent','querysongs',String(new Date().getTime())]);
	}else if("options"==cmd){
		_gaq.push(['_trackEvent','options',String(new Date().getTime())]);
	}
}
//注册后台监听函数
chrome.extension.onRequest.addListener(onRequest);
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-43134902-1']);
_gaq.push(['_trackPageview']);
function googleAnalytics(){
	var ga = document.createElement('script');ga.type = 'text/javascript';
	ga.async = true;ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s)
}

