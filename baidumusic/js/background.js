/**************************************************************
 *@ background.js
 *@作者: 有一份田
 *@日期:2013.08.12
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/
 *@转载重用请保留此信息.
 *
 *@最后修改时间:2013.12.25
 *
 ***************************************************************/

chrome.runtime.onInstalled.addListener(function(ExtensionInfo) {
    _gaq.push(['_trackEvent','install',String(new Date().getTime())]);
    localStorage["version"]=APPCFG['version'];
});
function onRequest(request, sender, sendResponse){
    var cmd=request.cmd;
    if("analytics"==cmd){
        _gaq.push(['_trackEvent','querysongs',String(APPCFG['version'])]);
    }else if("options"==cmd){
        _gaq.push(['_trackEvent','options',String(APPCFG['version'])]);
    }
}
//注册后台监听函数
chrome.extension.onRequest.addListener(onRequest);
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-43134902-1']);
function googleAnalytics(){
    var ga = document.createElement('script');ga.type = 'text/javascript';
    ga.async = true;ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
}
googleAnalytics();
