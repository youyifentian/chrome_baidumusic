/**************************************************************
 *@ options.js
 *@作者: 有一份田
 *@日期:2013.08.12
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/
 *@转载重用请保留此信息.
 *@最后修改时间:2013.12.18
 *
 ***************************************************************/
function $O(id) {return document.getElementById(id);}
var info=$O("updateimg");
$O("opttitle").innerText="\u767e\u5ea6\u97f3\u4e50\u52a9\u624b "+RESCONFIG['version'];
info.src="http://app.duoluohua.com/update?action=checkupdate&system=chrome&appname=baidumusic&apppot=contentjs&frompot=options&type=1&version="+RESCONFIG['version']+"&t="+Math.random();
info.onload=function(){
	info.previousSibling.style.display="none";
	info.style.display="inline-block";
}
chrome.extension.sendRequest({"cmd":"options"},function(response){});
