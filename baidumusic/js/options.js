/**************************************************************
 *@ options.js
 *@作者: 有一份田
 *@日期:2013.08.12
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/
 *@转载重用请保留此信息.
 *@最后修改时间:2013.12.25
 *
 ***************************************************************/

var info=$O("updateimg");
$O("opttitle").innerText=APPCFG['appname']+" "+APPCFG['version'];
info.src="http://app.duoluohua.com/update?action=checkupdate&system=chrome&appname=baidumusic&apppot=contentjs&frompot=options&type=1&version="+encodeURIComponent(APPCFG['version'])+"&t="+new Date().getTime();
info.onload=function(){
	info.previousSibling.style.display="none";
	info.style.display="inline-block";
}
function $O(id) {return document.getElementById(id);}
chrome.extension.sendRequest({"cmd":"options"},function(response){});
