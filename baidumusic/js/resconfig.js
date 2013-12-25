var APPCFG={
    "appname":"百度音乐助手",
    "author":"有一份田",
    "version":"1.2.5",
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
    APPCFG['updateurl']='http://app.duoluohua.com/update?action=checkupdate&system=chrome&appname=baidumusic&apppot=chromeextensions&frompot=chromeupdate&type=2&version='+encodeURIComponent(APPCFG['version'])+'&t='+new Date().getTime();
})();
function isUrl(url) {
    return /^(http|https):\/\/([\w-]+(:[\w-]+)?@)?[\w-]+(\.[\w-]+)+(:[\d]+)?([#\/\?][^\s<>;"\']*)?$/.test(url);
}

