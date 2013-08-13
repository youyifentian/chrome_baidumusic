/**************************************************************
 *@ options.js
 *@作者: 有一份田
 *@日期:2013.08.12
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/
 *@转载重用请保留此信息.
 *
 *@最后修改时间:2013.08.14
 *
 ***************************************************************/
var info=document.getElementById("updateimg"),version=localStorage["version"];
info.src="http://duoluohua.com/myapp/update?system=chrome&appname=baidumusic&apppot=contentjs&frompot=options&type=1&version="+version+"&t="+Math.random();
info.onload=function(){
	info.previousSibling.style.display="none";
	info.style.display="inline-block";
}
chrome.extension.sendRequest({"cmd":"options"},function(response){});
