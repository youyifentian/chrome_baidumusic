/**************************************************************
 *@ musicdownload.js
 *@作者: 有一份田
 *@日期:2013.08.12
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/
 *@转载重用请保留此信息.
 *
 *@最后修改时间:2013.08.13
 *
 ***************************************************************/

querySong(getSongInfo());
function getSongInfo(id,title,artist){
	var path=window.location.pathname,arr=path.split("/");
	var id=arr[2] || id,p=arr[3];
	return {
		"id":"song"==arr[1].toLowerCase() ? id : "",
		"type": p && "download"==p.toLowerCase(),
		"title":title || "",
		"artist":artist || ""
	};
}
function setDownLink(node,opt){
	var filesInfo=getDownInfo(opt),
	    html=makeHtml(filesInfo.files);
	node.innerHTML=html;
}
function querySong(opt){
	if(!opt.id) return;
	var node=document.createElement("div");
	node.innerHTML=makeHtml([],'<font color="#A1CBE4"><strong>数据赶来中...</strong></font>');
	node.style.display="block";
	var o=null,obj=null;
	if(opt.type){
		o=document.forms["form"];
		if(!o)return;
		obj=o.firstChild.nextSibling;
		obj.appendChild(node);
	}else{
		o=document.getElementsByClassName("info-holder clearfix");
		if(!o)return;
		obj=o[0];
		obj.insertBefore(node,obj.firstChild);
	}
	var id=opt.id,title=opt.title,artist=opt.artist,
	    url="http://qianqianmini.baidu.com/app/link/getLinks.php?linkType=1&isLogin=1&clientVer=7.0.4&isCloud=0&hasMV=1&songId="+id+"&songTitle="+title+"&songArtist="+artist,
	    xhr=new XMLHttpRequest();
	xhr.open("GET",url,true);
	xhr.onreadystatechange=function(){
		if(4==xhr.readyState){
			setDownLink(node,JSON.parse(xhr.responseText));
		}
	}
	xhr.send();
}
function getDownInfo(opt){
	var o=opt[0],id=o.songID,artist=o.artist,title=o.title,fileslist=o.fileslist,files=[];
	for(var i=0;i<fileslist.length;i++){
		files.push(getFilesInfo(fileslist[i]));
	}
	return {
		"id":id,
		"title":title,
		"artist":artist,
		"files":files
	}
}
function getFilesInfo(file){
	var url=file.songLink,
	    format=file.format.toLowerCase(),
	    size=file.size,rate=file.rate,
	    ratetitle="",index=0;
	if(rate>320 && format!="mp3"){
		ratetitle="无 损";
	}else if(rate>256 && rate<=320){
		ratetitle="超 高";
		index=1;
	}else if(rate>128 && rate<=256){
		ratetitle="高 质";
		index=2;
	}else if(rate>64 && rate<=128){
		ratetitle="标 准";
		index=3;
	}else if(rate<=64){
		ratetitle="低 质";
		index=4;
	}
	size=Math.round(size/1048576*10)/10+"M";
	return {
		"index":index,
		"format":format,
		"rate":rate,
		"ratetitle":ratetitle,
		"size":size,
		"url":url
	};
}
function makeHtml(files,text){
	var html="";
	html+='<div style="border:2px solid #A1CBE4;width:560px;padding-left:20px;margin:5px 0px 10px 0px;line-height:25px;">';
	html+='<div>';
	html+=text || '<div style="float:right;margin:-4px 5px;"><a href="http://duoluohua.com/myapp/chrome/baidumusic/?fromid=baidu_music_extension" target="_blank" style="color:#AA9999;font-size:10px;">反馈/更新</a></div>';
	for(var i=0;i<files.length;i++){
		var file=files[i];
		var url="http://music.baidu.com/data/music/file?link="+file.url;
		html+='<span style="display:inline-block;margin-left:5px;min-width:190px;"><a href="'+url+'">'+file.ratetitle+'</a><span><strong>&nbsp;&nbsp;&nbsp;'+file.size+'</strong></span><span style="color:#999999;">&nbsp;&nbsp;&nbsp;'+file.format+'&nbsp;&nbsp;'+file.rate+'kbps</span></span>';
		if(i==1 || i==3)html+='</div><div>';
	}
	html+='</div></div>';
	return html;
}
chrome.extension.sendRequest({"cmd":"analytics"},function(response){});
