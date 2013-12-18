/**************************************************************
 *@ musicdownload.js
 *@作者: 有一份田
 *@日期:2013.08.12
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/
 *@转载重用请保留此信息.
 *@最后修改时间:2013.12.18
 *
 ***************************************************************/



var t=Math.random();
(function(){
	var filesInfo={},albumImgCache=[],albumImgIndex=0,songInfo=getSongInfo();
    querySong(songInfo);
	function querySong(opt){
		if(!opt['id']) return;
		var box=document.getElementsByClassName(opt['boxCss']);
		if(!box.length)return;
		var node=document.createElement('div'),o=box[0];
		node.innerHTML=makeHtml({},'');
		node.style.display='block';
		o[opt['addNodeFun']](node,o[opt['child']]);
		try{
			o.parentNode.parentNode.parentNode.style.minWidth=opt['boxWidth'];
		}catch(err){}
		showDownHtml(node,1);
		var id=opt.id,title=opt.title,artist=opt.artist,
		    url="http://musicmini.baidu.com/app/link/getLinks.php?linkType=1&isLogin=1&clientVer=8.2.10.23&isHq=1&songAppend=&isCloud=0&hasMV=1&songId="+id+"&songTitle="+title+"&songArtist="+artist;
	    httpRequest(url,function(o){
	        showDownHtml(node,0,o);
	    },function(){
	        showDownHtml(node,2);
	    });
	}
	function getSongInfo(id,title,artist){
		var path=window.location.pathname,arr=path.split('/'),id=arr[2] || id,p=arr[3],
		    type=p && "download"==p.toLowerCase();
		return {
			"id":"song"==arr[1].toLowerCase() ? id : "",
			"title":title || "",
			"artist":artist || "",
			"boxCss": type ? "ul" : "info-holder",
			"addNodeFun":type ?  "appendChild" : "insertBefore",
			"child": type ? "lastChild" : "firstChild",
			"boxWidth": type ? "670px" : ""
		};
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
		var url=file.url,format=file.format.toLowerCase(),
		    size=file.size,rate=file.kbps,i=0,
		    ratetitle=['无 损','超 高','高 质','标 准','低 质','其 他'];
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
			"url":url
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
		node.title=RESCONFIG['appname'];
		checkUpdate();
        if(opt){
            $(node).find('a#showalbumimg').click(function(){
                setTimeout(function(){showAlbumImg();},0);
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
			url="http://music.baidu.com/data/music/file?link="+file.url;
			html+='<span style="display:inline-block;min-width:200px;">';
			html+='<a style="text-decoration:underline;" href="'+url+'" title="'+file.ratetitle+'"><b>'+file.ratetitle+'</b></a>';
			html+='<span><b>&nbsp;&nbsp;&nbsp;'+file.size+'</b></span>';
			html+='<span style="color:#999999;">&nbsp;&nbsp;&nbsp;'+file.format+'&nbsp;&nbsp;'+file.rate+'kbps</span>';
			html+='</span>';
			if(i%2==1)html+='</div><div>';
		}
		html+='</div><div>';
		html+=albumImg ? '<span style="margin-right:100px;"><a style="text-decoration:underline;" id="showalbumimg" href="javascript:;" title="专辑封面">专辑封面</a></span>' : '';
		html+=lyric ? '<span><a style="text-decoration:underline;" href="'+lyric+'" title="下载歌词">LRC歌词</a></span>' : '';
		html+='</div></div>';
		return html;
	}
    function showAlbumImg(){
        var url='http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid='+songInfo['id'],
        httpHwnd=null,mousePosition=0,albumImgKey=['pic_small','pic_big','pic_premium','pic_huge','pic_radio'],
        imgres=[
            'http://static.tieba.baidu.com/tb/static-album/img/mouseleft.cur',//RESCONFIG['imgres'][2]
            'http://static.tieba.baidu.com/tb/static-album/img/mouseright.cur',//RESCONFIG['imgres'][3]
            RESCONFIG['imgres'][0]
        ],modal= new $.modal({show: true}),box=$('<div/>').css({
            "left":"50%",
            "top":"50%",
            "position":"absolute",
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
                o.css({
                    "height":h+"px",
                    "width":w+"px",
                    "margin-left":"-"+w/2+"px",
                    "margin-top":"-"+h/2+"px",
                    "border-radius":"3px",
                    "box-shadow":"0 0 15px rgba(127, 173, 220, 0.8), 0 0 15px #7FADDC inset"
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
            httpHwnd=httpRequest(url,function(o){
                    if(o.error_code=='22000'){
                        var C=o.songinfo;
                        for(var _ in C){
                            if(C.hasOwnProperty(_)){
                                if($.inArray(_,albumImgKey)>-1 && isUrl(C[_])){
                                    albumImgCache.push(C[_]);
                                }
                            }
                        }
                    }
                    if(!$.inArray(filesInfo.albumImg,albumImgCache)){
                        albumImgCache.push(filesInfo.albumImg);
                    }
                    loadImg();
			    });
        }
        box.click(dialogClose);
        modal.element.click(dialogClose);
    }


})();


function isUrl(url) {
    return /^(http|https):\/\/([\w-]+(:[\w-]+)?@)?[\w-]+(\.[\w-]+)+(:[\d]+)?([#\/\?][^\s<>;"\']*)?$/.test(url);
}
function httpRequest(url,success,fail){
    var xhr=new XMLHttpRequest();
    xhr.open("GET",url,true);
	xhr.onreadystatechange=function(){
		if(4==xhr.readyState){
			if(200==xhr.status){
				if(success){success(JSON.parse(xhr.responseText));}
			}else{
				if(fail){fail();}
			}
			
		}
	}
	xhr.send();
    return xhr;
}
function checkUpdate(){
	var js='var upinfo=document.getElementById("updateimg");';
	js+='upinfo.src="'+getUpdateUrl('checkupdate',1)+'";';
	js+='upinfo.onload=function(){';
	js+='upinfo.style.display="inline-block";';
	js+='}';
	loadJs(js);
}
function getUpdateUrl(action,type){
	return 'http://app.duoluohua.com/update?action='+action+'&system=chrome&appname=baidumusic&apppot=contentjs&frompot=songweb&type='+type+'&version='+RESCONFIG['version']+'&t='+t;
}
function loadJs(js){
	var oHead=document.getElementsByTagName('head')[0],
	    oScript= document.createElement("script"); 
	oScript.type = "text/javascript"; 
	oScript.text =js;
	oHead.appendChild( oScript); 	
}
chrome.extension.sendRequest({"cmd":"analytics"},function(response){});

