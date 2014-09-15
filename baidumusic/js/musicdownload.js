/**************************************************************
 *@ musicdownload.js
 *@作者: 有一份田
 *@日期:2013.08.12
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/
 *@转载重用请保留此信息.
 *@最后修改时间:2014.09.15
 *
 ***************************************************************/



var t=new Date().getTime();
(function(){
    var filesInfo={},albumImgCache=[],albumImgIndex=0,songInfo=getSongInfo();
    querySong(songInfo);
    function querySong(opt){
    	if(!opt['id']) return;
        var boxsets=opt['boxsets'],boxset={},box=[];
        for(var i=0,len=boxsets.length;i<len;i++){
            boxset=boxsets[i];
            box=$(boxset['css']);
            if(box.length){break;}
        }
        if(!box.length)return;
        var node=document.createElement('div'),o=box[0];
        node.style.display='block';
        o[boxset['fun']](node,o[boxset['child']]);
        try{
            o.parentNode.parentNode.parentNode.style.minWidth=boxset['width'];
        }catch(err){}
        showDownHtml(node,1);
        var data=getQueryData(opt);
        httpRequest({
            "method":"POST",
            "url":data.url,
            "data":data.data,
            "headers":{
                "Content-Type": "application/x-www-form-urlencoded",
                "Host":"musicmini.baidu.com",
                "Referer":"http://musicmini.baidu.com/",
                "X-Requested-With":"XMLHttpRequest"
            },
            "onload":function(o) {
            	showDownHtml(node,0,o);
            },
            onerror: function(response) {
            	showDownHtml(node,2);
            }
        });
    }
    function getSongInfo(id,title,artist){
        var path=window.location.pathname,arr=path.split('/'),id=arr[2] || id;
        return {
            "id":"song"==arr[1].toLowerCase() ? id : "",
            "title":title || "",
            "artist":artist || "",
            "boxsets":[
                {"css":".info-holder","fun":"insertBefore","child":"firstChild","width":""},
                {"css":".ul,.price,.info-wrap ul","fun":"appendChild","child":"lastChild","width":"670px"}
            ]
        };
    }
    function getQueryData(opt,rate){
        var dataBase = {
            "songId": opt.id || opt.song_id,
            "songArtist": opt.artist || opt.song_artist,
            "songTitle": opt.title || opt.song_title,
            "songAppend": '',
            "linkType": rate===undefined ? 1 : 2,
            "isLogin": 1,
            "clientVer": '',
            "isHq": 1,
            "isCloud": 0,
            "hasMV": 1,
            "noFlac": 0,
            "rate": rate===undefined ? 0 : rate
        };
        var data = "param=" + encodeURIComponent((new BaseEncode()).encode(JSON.stringify(dataBase)));
        return {"url":"http://musicmini.baidu.com/app/link/getLinks.php","data":data};
    }
    function setSongsInfo(opt){
        var o=opt[0],id=o.song_id,lyric=o.lyric_url,albumImg=o.album_image_url,
        artist=o.song_artist,title=o.title,fileslist=o.file_list,files=[];
        for(var i=0;i<fileslist.length;i++){
            files.push(formatSongInfo(fileslist[i],lyric));
        }
        return {
            "id":id,
            "title":title,
            "artist":artist,
            "albumImg":albumImg,
            "lyric":lyric,
            "files":files
        };
    }
    function formatSongInfo(file){
        var url=file.url,format=file.format.toLowerCase(),size=file.size,
        rate=file.kbps,i=0,ratetitle=['无 损','超 高','高 质','标 准','低 质','其 他'];
        if(rate>320 && format!="mp3"){
            i=0;
        }else if(rate>256 && rate<=320){
            i=1;
        }else if(rate>128 && rate<=256){
            i=2;
        }else if(rate>64 && rate<=128){
            i=3;
        }else if(rate<=64){
            i=4;
        }else{
            i=5;
        }
        size=Math.round(size/1048576*10)/10+'M';
        return {
            "index":i,
            "format":format,
            "rate":rate,
            "ratetitle":ratetitle[i],
            "size":size,
            "url":isUrl(url) ? "http://music.baidu.com/data/music/file?link="+url : 'javascript:;'
        };
    }
    function showDownHtml(node,index,opt){
        filesInfo=opt ? setSongsInfo(opt) : {};
        var msg=[
            '',
            '数据赶来中',
            '请求出错,请重试或检查是否为最新版本',
            '请求超时,请刷新页面重试',
            '您的油猴子扩展暂时不支持该脚本,请更新扩展或脚本到最新版本'
        ],text=msg[index],html=makeHtml(filesInfo,text,index-1);
        node.innerHTML=html;
        node.title=APPCFG['appname'];
        checkUpdate();
        if(opt){
            $(node).find('a#showalbumimg').click(function(){
                setTimeout(function(){showAlbumImg();},0);
            });
            $(node).find('a.filelists').click(function(){
                var _self=this;
                setTimeout(function(){downloadDialog(_self,filesInfo,node,1);},0);
            }).each(function(){
                var _self=this;
                setTimeout(function(){downloadDialog(_self,filesInfo,node,0);},0);
            });
        }
    }
    function makeHtml(filesInfo,text,type){
        var files=filesInfo.files || [],html='',file='',url='',albumImg=filesInfo.albumImg,lyric=filesInfo.lyric;
        html+='<div style="border:2px solid #A1CBE4;width:560px;padding-left:25px;margin:5px 0px 10px 0px;line-height:25px;">';
        html+='<div>';
        html+='<a href="'+getUpdateUrl('getnewversion',1)+'" style="float:right;" target="_blank">';
        html+='<img id="updateimg" title="有一份田" style="border:none;display:none;"/></a>';
        html+=text ? '<font color="'+(type ? '#FF0000' : '#A1CBE4')+'"><b>'+text+'...</b></font>' : '';
        for(var i=0;i<files.length;i++){
            file=files[i];
            url=file.url;
            html+='<span style="display:inline-block;min-width:200px;">';
            html+='<a style="text-decoration:underline;" class="filelists" filerate="'+file.rate+'" href="'+url+'" title="'+file.ratetitle+'"><b>'+file.ratetitle+'</b></a>';
            html+='<span><b>&nbsp;&nbsp;&nbsp;'+file.size+'</b></span>';
            html+='<span style="color:#999999;">&nbsp;&nbsp;&nbsp;'+file.format+'&nbsp;&nbsp;'+file.rate+'kbps</span>';
            html+='</span>';
            if(i%2==1){html+='</div><div>';}
        }
        html+='</div><div>';
        html+=albumImg ? '<span style="margin-right:100px;"><a style="text-decoration:underline;" id="showalbumimg" href="javascript:;" title="专辑封面">专辑封面</a></span>' : '';
        html+='<span><a style="text-decoration:underline;display:'+(isUrl(lyric) ? '' : 'none')+';" href="'+lyric+'" title="下载歌词" id="showlyric">LRC歌词</a></span>';
        html+='</div></div>';
        return html;
    }
    function downloadDialog(o,opt,node,type){
        if(isUrl(o.href))return;
        if(type){
            var box=o.box || $('<div/>');
            clearTimeout(o.hwnd);
            box.css({
                "color":"red",
                "fontSize":"20pt",
                "left":"50%",
                "position":"fixed",
                "top":"250px",
                "z-index":$.getzIndex()
            }).html('<b>数据获取中...</b>').appendTo("body");
            o.hwnd=setTimeout(function(){box.remove();},500);
        }
        var data=getQueryData(opt,$(o).attr('filerate'));
        httpRequest({
            "method":"POST",
            "url":data.url,
            "data":data.data,
            "headers":{
                "Content-Type": "application/x-www-form-urlencoded",
                "Host":"musicmini.baidu.com",
                "Referer":"http://musicmini.baidu.com/",
                "X-Requested-With":"XMLHttpRequest"
            },            
            "onload":function(obj) {
                var fileinfo=setSongsInfo(obj),url=fileinfo.files[0].url;
                var lyricbox=$(node).find('a#showlyric').css({"display":"none"}),lyric=lyricbox.attr('href');
                if(type){unsafeWindow.location=url;}
                lyric = isUrl(lyric) ? lyric : (fileinfo.lyric || 'javascript:;');
                if(isUrl(lyric)){lyricbox.css({"display":""}).attr('href',lyric);}
                o.href=url;
            }
        });
    }
    function showAlbumImg(){
        var url='http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid='+songInfo['id'],
        httpHwnd=null,mousePosition=0,albumImgKey=['pic_small','pic_big','pic_radio','pic_premium','pic_huge'],
        imgres=[
            APPCFG['imgres']['mouseleft'],//'http://static.tieba.baidu.com/tb/static-album/img/mouseleft.cur',
            APPCFG['imgres']['mouseright'],//'http://static.tieba.baidu.com/tb/static-album/img/mouseright.cur',
            APPCFG['imgres']['loadingimg_1']//'http://tieba.baidu.com/tb/img/loading.gif'
        ],modal= new $.modal({show: true}),box=$('<div/>').css({
            "left":"50%",
            "top":"50%",
            "position":"fixed",
            "min-height":"240px",
            "min-width":"240px",
            "z-index":$.getzIndex()
        }).appendTo("body"),
        dialogClose=function(){
            if(httpHwnd){httpHwnd.abort();}
            modal.remove();
            box.remove();
        },
        loadingImg=$('<img src="'+imgres[2]+'"/>').css({
            "height":"32px",
            "width":"32px",
            "margin-left":"-16px",
            "margin-top":"-16px"
        }).appendTo(box),
        loadImg=function(){
            var img = new Image();
            img.src = albumImgCache[albumImgIndex];
            img.onload=function(){
                var h=img.height,w=img.width,o=$(img);
                loadingImg.remove();
                o.attr('title',w+'x'+h).css({
                    "height":h+"px",
                    "width":w+"px",
                    "margin-left":"-"+w/2+"px",
                    "margin-top":"-"+h/2+"px",
                    "border-radius":"3px",
                    "box-shadow":"0 0 10px rgba(127, 173, 220, 0.8), 0 0 10px #7FADDC inset"
                }).mousemove(function(e){
                    var i = o.offset();
                    mousePosition=(e.pageX - i.left < w / 2) ? 0 : 1;
                    o.css({"cursor":'url("'+imgres[mousePosition]+'"), pointer'});
                }).mouseout(function(){
                    o.css({"cursor":"pointer"});
                }).click(function(event){
                    changeAlbumImg(o);
                    event.stopPropagation();
                }).appendTo(box);
            }
        },
        changeAlbumImg=function(o){
            var len=albumImgCache.length,_=albumImgIndex;
            albumImgIndex +=mousePosition ? 1 : -1;
            albumImgIndex = albumImgIndex >=len ? len-1 : (albumImgIndex <=0 ? 0 : albumImgIndex);
            if(_!=albumImgIndex){
                o.remove();
                loadingImg.appendTo(box);
                loadImg();
            }
        };
        if(albumImgCache.length){
            loadImg();
        }else{
            httpHwnd=httpRequest({
                "method":"GET",
                "url":url,
                "onload":function(o){
                    if(o.error_code=='22000'){
                        var C=o.songinfo;
                        for(var i=0;i<albumImgKey.length;i++){
                            var _=albumImgKey[i];
                            if(isUrl(C[_])){
                                 albumImgCache.push(C[_]);
                            }
                        }
                    }
                    if($.inArray(filesInfo.albumImg,albumImgCache)==-1){
                        albumImgCache.push(filesInfo.albumImg);
                    }
                    loadImg();
                }
            });
        }
        box.click(dialogClose);
        modal.element.click(dialogClose);
    }


})();

function BaseEncode(){_keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",this.encode=function(a){var c,d,e,f,g,h,i,b="",j=0;for(a=_utf8_encode(a);j<a.length;)c=a.charCodeAt(j++),d=a.charCodeAt(j++),e=a.charCodeAt(j++),f=c>>2,g=(3&c)<<4|d>>4,h=(15&d)<<2|e>>6,i=63&e,isNaN(d)?h=i=64:isNaN(e)&&(i=64),b=b+_keyStr.charAt(f)+_keyStr.charAt(g)+_keyStr.charAt(h)+_keyStr.charAt(i);return b},_utf8_encode=function(a){var b,c,d;for(a=a.replace(/\r\n/g,"\n"),b="",c=0;c<a.length;c++)d=a.charCodeAt(c),128>d?b+=String.fromCharCode(d):d>127&&2048>d?(b+=String.fromCharCode(192|d>>6),b+=String.fromCharCode(128|63&d)):(b+=String.fromCharCode(224|d>>12),b+=String.fromCharCode(128|63&d>>6),b+=String.fromCharCode(128|63&d));return b}}
function checkUpdate(){
    var js='var upinfo=document.getElementById("updateimg");';
    js+='upinfo.src="'+getUpdateUrl('checkupdate',1)+'";';
    js+='upinfo.onload=function(){';
    js+='upinfo.style.display="inline-block";';
    js+='};';
    js+='$(upinfo).parent("a").tooltip({str: \''+APPCFG['appname']+APPCFG['version']+' - <a href="http://www.duoluohua.com/download/"target="_blank">'+APPCFG['author']+'</a>\'}).tooltip("show");';
    loadJs(js);
}
function getUpdateUrl(action,type){
    return 'http://app.duoluohua.com/update?action='+action+'&system='+APPCFG['system']+'&appname='+APPCFG['name']+'&apppot=contentjs&frompot=songweb&type='+type+'&version='+encodeURIComponent(APPCFG['version'])+'&t='+t;
}
function loadJs(js){
    var oHead=document.getElementsByTagName('head')[0],
    oScript= document.createElement("script"); 
    oScript.type = "text/javascript"; 
    oScript.text =js;
    oHead.appendChild( oScript); 	
}
chrome.extension.sendRequest({"cmd":"analytics"},function(response){});

