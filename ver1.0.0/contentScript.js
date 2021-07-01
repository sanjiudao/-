// 获取个人空间的用户id
function getSpaceUid(){
    let url = window.location.href;
    let reg = /https:\/\/space.bilibili.com\/([0-9]*)/;
    console.log('空间uid为'+reg.exec(url)[1]);
    return reg.exec(url)[1];
}

// 显示追番数(异步)
// 参数：用户id
function RRZfs(uid){
    var page = 1;
    var zfsxhttp = [];
    var pageZfs = [];

    function requestzfs(){
        let i = 0;
        while(i < 5){
            // 发送请求
            let url = 
            'https://api.bilibili.com/x/space/bangumi/follow/list?type=1&follow_status=0&pn='
            + page + '&ps=30&vmid=' + uid;
            zfsxhttp[page] = new XMLHttpRequest();
            zfsxhttp[page].open('GET', url, true);
            zfsxhttp[page].send();
            console.log('发送请求，第'+ page + '页');
            // 接收请求
            zfsxhttp[page].onreadystatechange = function(e){
                let reg = 
                /https:\/\/api.bilibili.com\/x\/space\/bangumi\/follow\/list\?type=1&follow_status=0&pn=([0-9]*)/;
                npage = reg.exec(e.currentTarget.responseURL)[1];
                if(zfsxhttp[npage].readyState == 4 && zfsxhttp[npage].status == 200){
                    let jsonData = zfsxhttp[npage].responseText;
                    jsonData = JSON.parse(jsonData);
                    pageZfs[(npage-1)] = jsonData.data.list.length;
                    console.log('接收请求，第'+ npage + '页');
                    receivezfs();
                }
            }
            i++;
            page++;
        }
    }

    requestzfs();
    
    function receivezfs(){
        // 判断接收到的信息数组的长度是否等于发出数量
        if(pageZfs.length == (page-1)){
            for (let i = pageZfs.length - 1; i >= 0; i--) {
                // 循环判断接收数组内是否有空值
                if(pageZfs[i] == null){
                    console.log('结果有空值');
                    return;
                }
            }
            // 判断接收数值内是否有0
            if(!pageZfs.includes(0)){
                console.log('结果没0');
                requestzfs();
                return;
            }
            console.log('结果正常'+sum(pageZfs));
            displayzfs(sum(pageZfs));
            
            return;
        }else{
            console.log('结果长度不符');
            return;
        }
    }

    function displayzfs(zfs){
        zfxs.innerText = zfs;
        let bar = document.getElementsByClassName('section-title');
        for(let i = bar.length; i > 0; i--){
            if(bar[(i-1)].innerText.search('订阅番剧') != -1){
                zfxsmore = bar[(i-1)].getElementsByClassName('more')[0];
                bar[(i-1)].insertBefore(zfxs,zfxsmore);
                break;
            }
        }
    }

}

// 数组求和
function sum(arr) {
    var s = 0;
    for (var i=arr.length-1; i>=0; i--) {
      s += arr[i];
    }
    return s;
}

function storageGet(storageName, fun){
    chrome.storage.local.get([storageName], function(result) {
        if(fun){
            fun(result[storageName]);
            console.log(storageName + '的值为' + result[storageName]);
        }
    });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log(changes);
    // 判断追番数显示功能开关
    switch(changes.Switch0.newValue){
        case 0:
            zfxs.style.display = 'none';
            break;
        case 1:
            // 更改元素值
            zfxs.innerText = RRZfs(getSpaceUid());
            zfxs.style.display = 'inline';
    }
});

// 创建span元素
zfxs = document.createElement("span");
zfxs.className = 'count';

storageGet('Switch0',function(result){
    if(result == 1){
        RRZfs(getSpaceUid());
    }
});