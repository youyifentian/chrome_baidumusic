var RESCONFIG={
    "appname":"百度音乐助手",
    "author":"有一份田",
    "version":"1.2.5",
    "desc":"突破百度音乐会员限制,突破百度账号限制,网页端直接下载高品质音乐,百度音乐助手带您畅享高品质音乐",
    "updateurl":"http://app.duoluohua.com/update?action=checkupdate&system=chrome&appname=baidumusic&apppot=chromeextensions&frompot=chromeupdate&type=2&version=1.2.5&t="+new Date().getTime(),
    "license":"GPL version 3",
    "encoding":"UTF-8",
    "date":"",
    "modified":"",
    "imgres":[]
};
(function(){
    var imgres=[
        'loading.gif',//0
        'min_loading.gif',//1
        'mouseleft.cur',//2
        'mouseright.cur',//3
        'downloadicon.png'//4
    ],path=chrome.extension.getURL('images/resource/');
    for(var i=0;i<imgres.length;i++){
        RESCONFIG['imgres'].push(path+imgres[i]);
    }
})();

