// 声明所需变量
var SwitchState = new Array();
var Switch_oblong = new Array();
var Switch_round = new Array();

Switch_oblong[0] = document.getElementsByClassName('Switch_oblong0')[0];
Switch_round[0] = document.getElementsByClassName('Switch_round0')[0];

// 获取按钮初0始状态
storageGet('Switch0',getSwitch0State);
function getSwitch0State(State){
    if(State == undefined){
        storageSet('Switch0',0);
        SwitchState[0] = 0;
        console.log('初始值未定义');
    }else if(State == 1){
        Switch_round[0].style.left = '20px';
        Switch_oblong[0].style.backgroundColor = 'green';
        SwitchState[0] = 1;
        console.log('初始值为1');
    }else if(State == 0){
        SwitchState[0] = 0;
        console.log('初始值为0');
    }
}

// 实现按钮切换动画
Switch_oblong[0].onclick = function Switch0ChangeState(){
    if(SwitchState[0] == 0){
        // 开启
        SwitchState[0] = 1;
        Switch_oblong[0].style.animationName = 'SwitchOnOblong';
        Switch_round[0].style.animationName = 'SwitchOnRound';
        // 储存按钮状态
        storageSet('Switch0',1);
        console.log('功能开启');
    }else{
        // 关闭
        SwitchState[0] = 0;
        Switch_oblong[0].style.animationName = 'SwitchOffOblong';
        Switch_round[0].style.animationName = 'SwitchOffRound';
        // 储存按钮状态
        storageSet('Switch0',0);
        console.log('功能关闭');
    }
}

function storageGet(storageName, fun){
    chrome.storage.local.get([storageName], function(result) {
        if(fun){
            fun(result[storageName]);
            console.log(storageName+'的值为'+result[storageName]);
        }
    });
}

function storageSet(storageName, value){
    let json = {};
    json[storageName] = value;
    chrome.storage.local.set(json, function() {
        console.log('将'+storageName+'设置为'+value);
    });
}

// 作用：
// 1.实现按钮切换动画
// 2.获取按钮初始状态
// 3.储存按钮状态
// 4.修改或设置按钮状态