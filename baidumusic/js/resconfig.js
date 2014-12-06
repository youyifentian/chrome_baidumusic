var APPCFG={
    "appname":"百度音乐助手",
    "author":"有一份田",
    "name":"baidumusic",
    "system":"chrome",
    "version":"1.3.2",
    "desc":"突破百度音乐会员限制,突破百度账号限制,网页端直接下载高品质音乐,百度音乐助手带您畅享高品质音乐",
    "updateurl":"",
    "license":"GPL version 3",
    "encoding":"UTF-8",
    "date":"",
    "modified":"",
    "imgres":{
        "loadingimg_1":"loading.gif",
        "loadingimg_2":"min_loading.gif",
        "mouseleft":"http://static.tieba.baidu.com/tb/static-album/img/mouseleft.cur",
        "mouseright":"http://static.tieba.baidu.com/tb/static-album/img/mouseright.cur",
        "downimg":"downloadicon.png"
    }
};
(function(){
    var O=APPCFG['imgres'],path=chrome.extension.getURL('images/resource/');
    for(var _ in O){
        if(O.hasOwnProperty(_)){
            var S = O[_];
            APPCFG['imgres'][_]=isUrl(S) ? S : path+S;
        }
    }
    APPCFG['updateurl']='http://app.duoluohua.com/update?action=checkupdate&system='+APPCFG['system']+'&appname='+APPCFG['name']+'&apppot='+APPCFG['system']+'extensions&frompot='+APPCFG['system']+'update&type=2&version='+encodeURIComponent(APPCFG['version'])+'&t='+new Date().getTime();
})();
function isUrl(url) {
    return /^(http|https):\/\/([\w-]+(:[\w-]+)?@)?[\w-]+(\.[\w-]+)+(:[\d]+)?([#\/\?][^\s<>;"\']*)?$/.test(url);
}
function httpRequest(o){
    var url=o.url,data=o.data,method=o.method || 'GET',headers=o.headers,
    success=o.onload,error=o.onerror,xhr=new XMLHttpRequest();
    xhr.open(method,url,true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    for(var i in headers){
        if(headers.hasOwnProperty(i)){
            try{xhr.setRequestHeader(i,headers[i]);}catch(e){}
        }
    }
	xhr.onreadystatechange=function(){
        if(4==xhr.readyState){
            if(200==xhr.status){
            	if(success){success(JSON.parse(xhr.responseText));}
            }else{
            	if(fail){fail();}
            }
        }
    }
    if(data || method=='POST'){
        xhr.send(data);
    }else{
        xhr.send();
    }
    return xhr;
}

