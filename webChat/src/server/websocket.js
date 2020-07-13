
var ws = require('nodejs-websocket')
var moment = require('moment');            // 引入事件模块


let users = [];

//一对一聊天存放对应连接
let conns = {};

// 存放群组
let groups = [];

// 广播信息
function boardcast(obj) {
    // signal参数用于判断群聊和单聊
    if (obj.signal && obj.signal.length) {
        obj.signal.forEach(item => {
            conns[item].sendText(JSON.stringify(obj));
        })
        return;
    }
    // 有groupId代表是群消息
    if (obj.groupId) {
        // 找到对应群
        group = groups.filter(item => {
            return item.id === obj.groupId;
        })[0];
        // 遍历发送群消息
        group.users.forEach(item => {
            conns[item.uid].sendText(JSON.stringify(obj));
        })
        return;
    }

    console.log(obj);
    
    wsServer.connections.forEach((connWs) => {
        connWs.sendText(JSON.stringify(obj));
    })
}

// 消息事件戳
function getDate() {
    return moment().format('hh:mm:ss a')
}




// 创建websocket服务
var wsServer = ws.createServer(function (connWs) {

    connWs.on('text', function (obj) {
        obj = JSON.parse(obj);
        // 将uid对应的连接connWs存到一个对象里
        conns['' + obj.uid + ''] = connWs;

        console.log(obj);

        switch (obj.type) {
            // 创建连接
            case 1:
                let isuser = users.some(item => {
                    return item.uid === obj.uid;
                })
                if (!isuser) {

                 users=[...new Set(users)];


                    users.push({
                        nickname: obj.nickname,
                        uid: obj.uid,
                        status: 1,
                        avater:obj.avater,
                        usersign:obj.usersign
                    });
                } else {
                    users.map((item, index) => {
                        if (item.uid === obj.uid) {
                            item.status = 1;
                        }
                        return item;
                    })
                }
                boardcast({
                    type: 1,
                    date: getDate(),
                    msg: obj.nickname + '加入聊天室',
                    avater: obj.avater,
                    users: users,
                    groups: groups,
                    uid: obj.uid,
                    nickname: obj.nickname,
                    signal: obj.signal
                });
                break;
            // 注销退出群聊用户
            case 22:
                users.map((item, index) => {
                    if (item.uid === obj.uid) {
                        item.status = 0;
                    }
                    return item;
                })
                boardcast({
                    type: 1,
                    date: getDate(),
                    msg: obj.nickname + '退出了聊天室',
                    // users: users,
                    groups: groups,
                    uid: obj.uid,
                    nickname: obj.nickname,
                    bridge: []
                });
                break;
            // 创建群
            case 10: 
                groups.push({
                    id: moment().valueOf(),
                    name: obj.groupName,
                    users: [{
                        uid: obj.uid,
                        nickname: obj.nickname
                    }]
                })
                boardcast({
                    type: 1,
                    date: getDate(),
                    msg: obj.nickname + '创建了群' + obj.groupName,
                    users: users,
                    groups: groups,
                    uid: obj.uid,
                    nickname: obj.nickname,
                    signal: obj.signal
                });
                break;
            // 加入群聊
            case 20:
                let group = groups.filter(item => {
                    return item.id === obj.groupId
                })[0]
                group.users.push({
                    uid: obj.uid,
                    nickname: obj.nickname
                })
                boardcast({
                    type: 1,
                    date: getDate(),
                    msg: obj.nickname + '加入了群' + obj.groupName,
                    users: users,
                    groups: groups,
                    uid: obj.uid,
                    nickname: obj.nickname,
                    signal: obj.signal
                });
                break;
            // 发送消息
            default:
                boardcast({
                    type: 2,
                    date: getDate(),
                    msg: obj.msg,
                    uid: obj.uid,
                    nickname: obj.nickname,
                    avater: obj.avater,
                    signal: obj.signal,
                    groupId: obj.groupId,
                    status: 1
                });
                break;

        }

    });
    connWs.on("close", function (code, reason) {
        console.log("关闭连接")
    });
    connWs.on("error", function (code, reason) {
        console.log("异常关闭")
    });

})

wsServer.listen('8001', function () {
    console.log('建立完毕...');
})