/**************************************************************
 *@ musicdownload.js
 *@作者: 有一份田
 *@日期:2013.12.17
 *@Email:youyifentian@gmail.com
 *@地址:http://git.oschina.net/youyifentian/
 *@转载重用请保留此信息.
 *@最后修改时间:2013.12.18
 *
 ***************************************************************/



(function(){
    var songInfo={"songids":[],"songbox":[]},domBox=[];
    $('#pageWrapper').bind('DOMNodeInserted',function(e){
        if(e.target.tagName=='DIV'){
            var o=$(this).find('.widget-playlist');
            if(o.length){
                var tmpBox=[];
                $.each(o,function(k,v){
                    if($.inArray(v,domBox)==-1){
                        domBox.push(v);
                        tmpBox.push(v);
                    }
                });
                if(tmpBox.length){
                    var tmpInfo=getSongInfo(tmpBox);
                    setTimeout(function(){querySong(tmpInfo);},0);
                }
            }
        }
    });
    function getSongInfo(arr){
        var idArr=[],boxArr=[];
        for(var i=0;i<arr.length;i++){
            var e=arr[i],o=$(e).find('li.song');
            boxArr=$.merge(boxArr,o);
            for(var j=0;j<o.length;j++){
                var id=$(o[j]).attr('data-id');
                idArr.push(id);
            }
        }
        songInfo['songids']=$.merge(idArr,songInfo['songids']);
        songInfo['songbox']=$.merge(boxArr,songInfo['songbox']);
        return {
            "songids":idArr,
            "songbox":boxArr
        };
    }
    function querySong(opt){
        showDownloadHtml();
        var url='http://y.baidu.com/data/songlink',data='songIds='+encodeURIComponent(opt.songids.join(','));
        httpRequest(url,data,function(o) {
            if(o['errorCode']=='22000'){
                showDownloadHtml(o['songs']);
            }
        });
    }
    function getDownloadUrl(o,id,url){
        var data=o.attr('data-song'),obj=JSON.parse(data),baseurl='http://music.baidu.com/data/music/file?link=';
        if(obj['is_charge']==='0' && obj['artist_info']['fr_type']=='2'){
            url='http://y.baidu.com/data/song/download?songId='+id+'&myfn='+encodeURIComponent(obj['title']+'.mp3');
        }
        return baseurl+encodeURIComponent(url);
    }
    function showDownloadHtml(opt){
        var boxs=songInfo['songbox'],icons=[RESCONFIG['imgres'][4],RESCONFIG['imgres'][1]],
        titles=[RESCONFIG['appname']+' - '+RESCONFIG['author'],'数据正在加载中...'];
        for(var i=0;i<boxs.length;i++){
            var e=boxs[i],o=$(e),id=o.attr('data-id'),url='javascript:;',index=1;
            if(e.finish){continue;}
            var box=e.box || $('<span style="margin:0px 5px;"/>').insertAfter(o.find('span.title'));
            if(opt && opt[id]){
                url=getDownloadUrl(o,id,opt[id]['link']);
                index=0;
                e.finish=true;
            }
            box.html('<a href="'+url+'" title="'+titles[index]+'"><img src="'+icons[index]+'" alt="'+titles[index]+'"></a>');
            e.box=box;
        }
    }
})();

function httpRequest(url,data,success,fail){
    var xhr=new XMLHttpRequest();
    xhr.open("POST",url,true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange=function(){
		if(4==xhr.readyState){
			if(200==xhr.status){
				if(success){success(JSON.parse(xhr.responseText));}
			}else{
				if(fail){fail();}
			}
			
		}
	}
	xhr.send(data);
    return xhr;
}
chrome.extension.sendRequest({"cmd":"analytics"},function(response){});
