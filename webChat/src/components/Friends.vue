<template>
    <div class="friends-box">
    <!-- 联系人列表 -->
    <div class="friends-list">
        <div class="list-nav">
            <ul>
                <li :class="{active:switchType==1, unread: usersUnRead}"  @click="switchType=1">好友</li>
                <li :class="{active:switchType==2, unread: groupsUnRead}" @click="switchType=2">群聊</li>
                 <!-- <li :class="{active:switchType==1}"  @click="switchType=1">好友</li>
                <li :class="{active:switchType==2, unread: groupsUnRead}" @click="switchType=2">群聊</li> -->
            </ul>
        </div>

        <!-- 好友列表 -->
        <div class="list-box">
            <div class="f-lists">
                <div class="f-li" @click="triggerFriends(item)" v-if="switchType==1"
                v-for="(item,index) in currentUserList" :key="index"
                >
                   <div class="section">
                       <img v-if="item.avater" class="user-avater" :src="item.avater" alt />
                       <img v-else class="user-avater" :src="defaultUser" alt />
                       <div class="user-msg">
                           <p>{{item.nickname}}</p>
                           <span>{{item.usersign}}</span>
                           <!-- <span v-else>我就是我是不一样的烟火！</span> -->
                       </div>
                       <span class="unread-tip" v-if="item.unread">{{item.unread}}</span>
                   </div>
              </div>

          <!-- 群列表 -->
          <div class="g-li" @click="triggerGroup(item)" v-if="switchType==2"
            v-for="item in currentGroup"
          >
              <img class="user-avater" :src="groupAvater" @click="showDel=!showDel" alt />
              <span class="g-name">{{item.name}}</span>
              <img v-show="showDel" class="del-group" src="../assets/img/del.png" alt />
              <span v-if="item.unread" class="unread-tip">{{item.unread}}</span>
              <span v-if="!checkUserIsGroup(item)" @click.stop="addGroup(item)" class="addGroupTip">+</span>
          </div>

          </div>
          <div class="addbtn-box">
              <button class="addBtn" @click="showAddFriend=!showAddFriend">添加好友</button>
              <button class="addBtn" @click="showAddGroup=!showAddGroup">添加群聊</button>
          </div>
      </div>
    </div>

    <!-- 聊天窗口组件 -->
    <div class="chat-box">
        <div class="c-head">
            <div class="c-user">
                <img  :src="userp" alt />
                <span>{{title}}</span>
            </div>

            <div class="c-tab">
                <button @click="con()"><img src="../assets/img/chat.png" alt /></button>
                <button><img src="../assets/img/video.png" alt /></button>
                <button><img src="../assets/img/more.png" alt /></button>
            </div>
      </div>

      <!-- 消息框 -->
      <div class="chat-body">
          <div v-for="(item,index) in currentMsg" :key="index">
              <template v-if="item.type===1">
                  <p class="jion-tip">{{item.msg}}</p>
              </template>

              <template v-else>
                  <div class="msg-box" :class="{right_1: item.uid == uid}">
                      <div class="msg-body" :class="{right_2: item.uid == uid}">
                          <img v-if="!avater" :src="defaultUser" alt />
                          <img v-else-if="item.uid==uid" :src="avater" alt />
                          <img v-else :src="item.avater" alt />

                          <div class="users">
                              <span>{{item.nickname}}</span>
                              <p>{{item.date}}</p>
                         </div>
                     </div>
                     <div class="message">{{item.msg}}</div>
                 </div>
             </template>
        </div>
     </div>

      <div class="send-box">
          <input v-model="msg" type="text" placeholder="请输入内容..." />
          <button @click="send()"><img src="../assets/img/send.png" alt /></button>
      </div>
    </div>

      <!-- 创建群聊弹窗 -->
      <div class="black" v-show="showAddGroup">
          <div class="add-box">
              <header>创建群聊</header>
              <input type="text" v-model="groupName"  placeholder="请输入群聊名称..." />
              <div>
                  <button @click="createGroup()">确定</button>
                  <button @click="showAddGroup=!showAddGroup">取消</button>
              </div>
          </div>
      </div>

    <!-- 添加好友弹窗 -->
    <div class="black" v-show="showAddFriend">
        <div class="add-box">
            <header>添加好友</header>
            <input type="text" v-model="fname"  placeholder="请输入好友账号..." />
            <div>
                <button @click="addFriend()">确定</button>
                <button @click="showAddFriend=!showAddFriend">取消</button>
            </div>
        </div>
    </div>
    
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Friends",
  // components:{chats},

  data() {
    return {
      switchType: 1,
      title: "选择人聊天",
      userp: require("@/assets/img/user.jpg"), 
      uid: "",                  // 用户初始化id
      nickname: sessionStorage.getItem("nickname"),
      groupAvater: require("@/assets/img/user.jpg"),
      defaultUser: require("@/assets/img/defaultUser.png"),
      avater: sessionStorage.getItem("avater"),
      ws: "",                     // socket对象
      msg: "",                    // 发送的消息
      msgList: [],                // 存放消息记录
      users: [],
      signal: [],                 //  存放一对一聊天的用户id
      groupName: "",
      groups: [],                // 群组
      groupId: "",
      showAddGroup: false,       //  显示添加群组弹窗
      showAddFriend: false,      //  显示添加好友弹窗
      showDel: false,
      fname: "",
      frends: []
    };
  },


  // 页面挂载
  mounted() {
    var _this = this;
    //let user = localStorage.getItem("ws_user");
    //user = (user && JSON.parse(user)) || {};
    _this.uid = sessionStorage.getItem('uid');
    //_this.nickame = user.nickame;

    if (!_this.uid) {
     _this.connWebSocket();
        
    }
    // 监听回车发送消息
    (document.onkeydown = function(event) {
      var e = event || window.event;
      if (e && e.keyCode == 13) {
        _this.send();
      }
    })
    

    if(_this.ws.readyState != _this.ws.open){
      console.log('连接断开，重连中')
      _this.connWebSocket()
    }


      // 监听页面刷新，退出聊天室
      // (window.onbeforeunload = function(e) {
      //   _this.ws.send(
      //     JSON.stringify({
      //       uid: _this.uid,
      //       type: 22,
      //       nickname: _this.nickname,
      //       signal: [],
      //       avater: _this.avater
      //     })
      //   );
      // });
    // _this.getFriends();
  },

  // 监视
  computed: {
    // 渲染当前对话的msglist
    currentMsg() {
      let _this = this;
      //筛选signal相同的对话进行渲染
      //数组比较前转字符串
      let data = _this.msgList.filter(item => {
        if (item.type === 1) {
          return item;
        } else if (this.groupId) {
          return item.groupId === this.groupId;
        } else if (item.signal.length) {
          return item.signal.sort().join(",") == _this.signal.sort().join(",");
        }
      });

      data.map(item => {
        item.status = 0;
        return item;
      });
      return data;
    },

    // 当前群组列表
    currentGroup() {
      var _this = this;
      _this.groups.map(group => {
        //找出群组对应未读消息
        group.unread = this.msgList.filter(item => {
          return item.groupId === group.id && item.status === 1;
        }).length;
        return group;
      });

      return _this.groups;
    },

    // 群组列表是否有未读消息
    groupsUnRead() {
      return this.msgList.some(item => {
        return item.groupId && item.status === 1;
      });
    },

    //联系人列表是否未读消息
    usersUnRead() {
      return this.msgList.some(item => {
        return item.signal.length && item.status === 1;
      });
    },

    // 当前联系人列表
    currentUserList() {
      let _this = this;
     
      _this.users.map(user => {
        //找出联系人对应未读消息
        user.unread=this.msgList.filter(item=>{
            return item.signal.length && item.uid === user.uid && item.status===1
        }).length
        return user;
      });
      //debugger
      return _this.users.filter(user => {
        return user.uid !=_this.uid;
      });
    }
  },

  methods: {

    // 连接websocket服务
    connWebSocket() {
      var _this = this;
      if (window.WebSocket) {
          _this.createWebsocket();
      } else{
        _this.$message.warning('该浏览器不支持webSocket');
      }
    },

    // 创建websocket连接
    createWebsocket(){
        var _this = this;
        _this.ws = new WebSocket("ws://127.0.0.1:8001");
        let ws = _this.ws;

        ws.onopen = function(e) {
          _this.$message.success("连接服务器成功");
          
          if (!_this.uid) {
            //生成用户id
            //_this.uid = "user" + moment().valueOf();
            _this.uid = "user" + parseInt(sessionStorage.getItem("username"));
            _this.avater = sessionStorage.getItem("avater");
           sessionStorage.setItem('uid',_this.uid);
            // localStorage.setItem(
            //   "ws_user",
            //   JSON.stringify({
            //     uid: _this.uid,
            //     nickname: _this.nickname,
            //     avater: _this.avater
            //   })
            // );
          }
          _this.sendMsg(1);
        };

        ws.onclose = function(e) {
          console.log("服务器已关闭");
        };
        ws.onerror = function(e) {
          console.log("连接错误");
        };

        //接收消息

        ws.onmessage = function(e) {
          let msg = JSON.parse(e.data);
          console.log(msg);
          _this.msgList.push(msg);

          if (msg.users) {
            _this.users = msg.users;
            
          }

          if (msg.groups) {
            _this.groups = msg.groups;
          }
          _this.$nextTick(() => {
            var div = document.getElementsByClassName(".chat-body");
            div.scrollTop = div.scrollHeight;
          });
        };
    },





    // 发送信息按钮
    send() {
      if (!this.msg) {
        return;
      }
      if (!this.signal.length && !this.groupId) {
        alert("请选择发送人或者群");
        return;
      }
      this.sendMsg(2, this.msg);
    },

    // 消息发送操作
    sendMsg(type, msg) {
      this.avater = this.$store.state.avater;
      this.usersign=this.$store.state.usersign;
      let msgObj = {
        uid: this.uid,
        type: type,
        nickname: this.nickname,
        avater: this.avater,
        usersign:this.usersign,
        msg: msg,
        signal: this.signal,
        groupId: this.groupId
      };
      this.ws.send(JSON.stringify(msgObj));
      this.msg = "";
    },

    // 获取未读消息
    getMsgNum(user) {
      if (!user) {
        return this.msgList.filter(item => {
          return item.signal.length && item.status === 1;
        }).length;
      }
      return this.msgList.filter(item => {
        return item.signal.length && item.uid === user.uid && item.status === 1;
      }).length;
    },

    // 添加群
    addGroup(item) {
      this.ws.send(
        JSON.stringify({
          uid: this.uid,
          type: 20,
          nickname: this.nickname,
          groupId: item.id,
          groupName: item.name,
          signal: []
        })
      );
      alert(`'成功加入'+${item.name}+'`);
    },
    // 删除群

    // 判断是否是群成员
    checkUserIsGroup(item) {
      return item.users.some(item => {
        return item.uid === this.uid;
      });
    },
    createGroup() {
      this.ws.send(
        JSON.stringify({
          uid: this.uid,
          type: 10,
          nickname: this.nickname,
          groupName: this.groupName,
          signal: []
        })
      );
      this.showAddGroup = false;
      this.groupName = "";
    },

    // 选择群
    triggerGroup(item) {
      let issome = item.users.some(item => {
        return item.uid === this.uid;
      });
      if (!issome) {
        alert("你还不是本群成员");
        return;
      }
      this.signal = [];
      this.groupId = item.id;
      this.title = item.name;
    },

    delGroup(item) {
      this.ws.send(
        JSON.stringify({
          uid: this.uid,
          type: 22,
          nickname: this.nickname,
          signal: []
        })
      );
    },

    // 选择好友
    triggerFriends(item) {
      if (this.uid === item.uid) {
        return;
      }
      this.groupId = "";
      this.signal = [this.uid, item.uid];
      this.title = item.nickname;
      this.avater=item.avater;
      this.userp=item.avater

    },
    
    // 添加好友
    addFriend() {
      var _this = this;
      var username = parseInt(sessionStorage.getItem("username"));
      var fname = parseInt(this.fname);
      let data = {
        fname: fname,
        uname: username
      };
      _this.$axios.post("/api/users/addFriend", data)
        .then(res => {
          console.log(res.data);

          if (res.data == -1) {
            _this.$message.info("输入账号有误");
          } 
          if (res.data == -2){
            _this.$message.info('好友已经存在');
          }
          else {
            _this.$message.success("添加成功");
            _this.showAddFriend = false;
            //_this.getFriends();

          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    
    // 获取好友列表
    // getFriends() {
    //   var _this = this;
    //   var username = parseInt(sessionStorage.getItem("username"));
    //   this.$axios
    //     .get("/api/users/getFriend", {
    //       params: {
    //         uname: username
    //       }
    //     })
    //     .then(res => {
    //       var result = res.data;
    //       if (res.data == -1) {
    //         this.$message.info("获取好友列表失败");
    //       }
    //       if (res.status == 200) {
    //         //console.log(result);
    //         var frs = result.map(item => {
    //           return item.fname;
    //         });
    //         //console.log(frs);
    //         for (let i = 0; i < frs.length; i++) {
    //           _this.getFMsg(frs[i]);
              
    //         }
    //        // console.log(_this.frends);
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },

    // 获取好友基信息
    // getFMsg(name) {
    //   var _this = this;
    //   this.$axios
    //     .get("/api/users/getUserMsg", {
    //       params: {
    //         username: name
    //       }
    //     })
    //     .then(res => {
    //       var result = res.data;
    //       if (res.data == "-1") {
    //         this.$message.warning("获取信息失败");
    //       }
    //       if (res.status == 200) {
    //         let nickname = result.nickname;
    //         let usersign = result.usersign;
    //         avater = result.avater;
    //         let  uid='user'+name;
    //         var obj = {};
    //         obj.nickname = nickname;
    //         obj.uid=uid;
    //         obj.status="";
    //         console.log(obj);
    //         _this.users.push(obj);
    //         obj.usersign = usersign;
    //         obj.avater = avater;
           
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err);
    //     });
    // },

     
    con() {
      this.connWebSocket();
    }
  }
};
</script>

<style  scoped>
.friends-box {
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin: 0 15px;
}

/* 清除浮动影响 */
.friends-box::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

/* 联系人列表样式 */
.friends-list {
  display: flex;
  flex-direction: column;
  margin: 15px 0;
  justify-content: space-between;
  width: 350px;
}

.list-nav {
  height: 50px;
  width: 100%;
  background: #799bf1;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  color: #fff;
}

.list-nav li {
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  width: 175px;
  height: 50px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.list-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  width: 100%;
  border-top: 1px solid rgb(237, 243, 239);
}

.f-lists {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 500px;
  width: 100%;
  border-radius: 4px;
  background: #f1f7fe;
  overflow-x: hidden;
  overflow-y: auto;
}

.user-avater {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.f-li {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  width: 80%;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.section {
  width: 80%;
  display: flex;
}

.user-msg {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 10px;
  margin-top: 5px;
  color: #383737;
  font-size: 15px;
  font-weight: 550;
}

.user-msg span {
  display: inline-block;
  width: 150px;
  height: 20px;
  margin-bottom: 7px;
  font-size: 12px;
  font-weight: 400;
  color: #aaa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}

.g-li {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  width: 80%;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.g-li:hover {
  background-color: #ebeff49c;
}
.g-name {
  margin-left: 20px;
  font-size: 14px;
  color: #404042;
  font-weight: 600;
  line-height: 1.5;
}

.addBtn {
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #4876ee;
  color: #fff;
}

.active {
  background: #fff;
  color: rgb(116, 113, 113);
}

/* 聊天窗口样式 */
.chat-box {
  display: flex;
  flex-direction: column;
  margin: 15px 0 15px 20px;
  flex: auto;
  align-items: center;
  background: #f1f7fe;
  border-radius: 4px;
}

.c-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 15px;
  width: 92%;
  height: 80px;
  border-radius: 10px;
  background: #fff;
}

.c-user {
  display: flex;
  align-items: center;
  height: 50px;
  width: 200px;
}

.c-user img {
  margin-right: 20px;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  border: 1px solid #ececec;
}

.c-tab {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 150px;
  height: 50px;
}

.c-tab button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #3877f5f1;
  border-radius: 4px;
  color: #fff;
}

.chat-body {
  padding: 0 10px;
  margin-top: 10px;
  width: 93%;
  height: 400px;
  border: 1px solid rgba(213, 218, 215, 0.541);
  border-radius: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
}

/* 滚动条 */
.f-lists::-webkit-scrollbar,
.chat-body::-webkit-scrollbar {
  width: 4px;
  height: 8px;
}

.chat-body::-webkit-scrollbar-thumb,
.f-lists::-webkit-scrollbar-thumb {
  height: 10px;
  outline-offset: -2px;
  outline: 2px solid #fff;
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(238, 238, 238);
}

.chat-body::-webkit-scrollbar-track,
.f-lists::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
  background: #fff;
}

/* 发送消息框样式 */
.send-box {
  display: flex;
  justify-content: space-between;
  height: 60px;
  width: 95%;
  margin-top: 20px;
  background: #fff;
  border-radius: 10px;
}

.send-box input {
  border: 1px solid #ececec;
  padding: 0 10px;
  width: 90%;
}

.send-box button {
  width: 80px;
  background: #3877f5f1;
  color: #fff;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.msg-box {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  width: 50%;
}

.msg-body {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.msg-body img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.right_1 {
  margin-right: 5px;
  margin-left: auto;
  align-items: flex-end;
}

.right_2 {
  flex-direction: row-reverse;
}

.users {
  display: flex;
  flex-direction: column;
  margin: 0 5px;
}

.users span {
  font-size: 15px;
  color: #0c0c0d;
  font-weight: 600;
}

.users p {
  font-size: 11px;
  font-weight: 500;
  color: #aaa;
}

.message {
  padding: 10px;
  width: fit-content;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  border: 1px solid #efefef;
  font-size: 14px;
  color: #666;
  font-weight: 400;
  letter-spacing: 0.3px;
  background-color: #fff;
}

.jion-tip {
  font-family: Montserrat, sans-serif;
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  color: rgb(151, 151, 151);
  text-align: center;
}

.addg {
  height: 40px;
  border: 1px solid seagreen;
}

.addbtn-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
}

/* 弹窗 */
.add-box {
  position: absolute;
  margin-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  width: 300px;
  height: 120px;
  background: #fff;
  border-radius: 4px;
  z-index: 111;
  border: 1px solid #c9c6c6;
}

.add-box header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  color: #8f8f8f;
}

.add-box input {
  padding: 4px 10px;
  height: 30px;
  width: 85%;
  border: 1px solid #dddcdc;
  border-radius: 4px;
}

.add-box button {
  margin-right: 10px;
  padding: 5px 20px;
  background: #799bf1;
  color: #fff;
  border-radius: 4px;
}

.addGroupTip {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  color: #fff;
  background: coral;
}

.black {
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}

/*未读提醒*/
.unread-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 60px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #6080e9;
  color: #fff;
}

.del-group {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-left: 20px;
}
</style>
