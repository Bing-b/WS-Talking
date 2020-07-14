<template>
    <div class="friends-container">
        <!-- 联系人列表 -->
        <div class="friends-list">
            <div class="add-container">
                <el-dropdown trigger="click"  @command="addEvent">
                    <span class="el-dropdown-link add-link"><i class="el-icon-plus"></i></span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="addf">添加好友</el-dropdown-item>
                        <el-dropdown-item command="addg">添加群聊</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <!-- 好友列表 -->
            <el-tabs value="friends"  type="border-card">
                <el-tab-pane label="好友" name="friends" >
                    <span slot="label"><i class="el-icon-user"></i> 好友</span>
                    <div class="list-box">
                        <div class="f-li" @click="triggerFriends(item)" v-for="(item,index) in currentUserList" :key="index">
                            <div class="section">
                               <img v-if="item.avater" class="user-avater" :src="item.avater" alt />
                               <img v-else class="user-avater" :src="defaultUser" alt />
                               <div class="user-msg">
                                   <p>{{item.nickname}}</p>
                                   <span>签名：{{item.usersign}}</span>
                               </div>
                               <span class="unread-tip" v-if="item.unread">{{item.unread}}</span>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <!-- 群聊列表 -->
                <el-tab-pane label="群聊" name="groups" >
                    <span slot="label"><i class="el-icon-chat-dot-square"></i> 群聊</span>
                    <div class="list-box">
                        <div class="g-li" @click="triggerGroup(item)" v-for="(item,index) in currentGroup" :key="index" >
                            <img class="user-avater" :src="groupAvater"  alt />
                            <span class="g-name">{{item.name}}</span>
                            <span class="showDel" @click="delGroup(item)"><i class="el-icon-delete"></i> </span>
                            <span v-if="item.unread" class="unread-tip">{{item.unread}}</span>
                            <span v-if="!checkUserIsGroup(item)" @click.stop="addGroup(item)" class="addGroupTip">+</span>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 聊天窗口组件 -->
        <div class="chat-box">
            <div class="c-head">
                <div class="c-user">
                    <img  :src="userp" alt />
                    <span>{{title}}</span>
                </div>

                <div class="c-tab">
                    <button @click="con()"><i class="el-icon-microphone"></i></button>
                    <button><i class="el-icon-video-camera"></i></button>
                    <button><i class="el-icon-more"></i></button>
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
           <button @click="send()"><i class="el-icon-s-promotion"></i></button>
        </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Friends",

  data() {
    return {
      title: "选择人聊天",
      userp: require("@/assets/img/user.png"), 
      uid: "",                  // 用户初始化id
      nickname: sessionStorage.getItem("nickname"),
      groupAvater: require("@/assets/img/defaultGroup.png"),
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

    // 添加好友触发按钮
    addEvent(command) {
      if (command == 'addf') {
        this.showAddFriends()
      }
      if (command == "addg") {
        this.showAddGroup()
      }
    },
    // 显示弹窗
    showAddFriends() {
        this.$prompt('请输入好友账号', '添加好友', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/^1(3|4|5|6|7|8|9)\d{9}$/,
          inputErrorMessage: '请输入正确的账户'
        }).then(({ value }) => {
          this.addFriend(value);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },

      showAddGroup() {
        this.$prompt('请输入群聊名称', '添加群聊', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/^[^\s]*$/,
          inputErrorMessage: '输入信息不可包含空格'
        }).then(({ value }) => {
          this.createGroup(value);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
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
      this.$notify({
          title: '成功',
          message: `成功加入群：${item.name}`,
          type: 'success'
        });
 
    },
  
    // 判断是否是群成员
    checkUserIsGroup(item) {
      return item.users.some(item => {
        return item.uid === this.uid;
      });
    },

    createGroup(gname) {
      this.ws.send(
        JSON.stringify({
          uid: this.uid,
          type: 10,
          nickname: this.nickname,
          groupName: gname,
          signal: []
        })
      );
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
      this.userp =this.groupAvater
    },

  // 删除群
    delGroup(item) {
      // this.ws.send(
      //   JSON.stringify({
      //     uid: this.uid,
      //     type: 22,
      //     nickname: this.nickname,
      //     signal: []
      //   })
      // );
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
    addFriend(f) {
      var _this = this;
      var username = parseInt(sessionStorage.getItem("username"));
      var fname = parseInt(f);
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
.friends-container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin: 0 15px;
}

/* 清除浮动影响 */
.friends-container::after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

/* 联系人列表样式 */
.friends-list {
  position: relative;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  margin: 15px 0;
  justify-content: space-between;
  width: 350px;
}

.friends-list >>> .el-tabs--border-card {
  border-radius: 5px;

}

.friends-list >>> .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
  border-top-left-radius: 5px;
}

.friends-list >>> .el-tabs--border-card>.el-tabs__header {
  background: #f4f4f4;
  border-radius: 5px;
}

.list-box {
  display: flex;
  align-items: center;
  height: 500px;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

.user-avater {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
/* 联系人、群item样式 */
.f-li,
.g-li {
  display: flex;
  align-items: center;
  margin: 2px 0;
  padding: 10px 20px;
  width: 90%;
  cursor: pointer;
  background: #f1f7fe;
  border: 1px solid #dbe2e8;
  border-radius: 5px;
}

.g-li {
  position: relative;
}

.f-li:hover,
.g-li:hover {
  border-color: #c2ced8;;
}

.section {
  width: 80%;
  display: flex;
  align-items: center;
}

/* 添加好友、群 */
.add-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.add-link {
  font-size: 17px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.user-msg {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin:6px 0 0 10px;
  color: #383737;
  font-size: 15px;
  font-weight: 550;
}

.user-msg span{
  display: inline-block;
  width: 150px;
  height: 20px;
  margin-bottom: 7px;
  font-size: 13px;
  font-weight: 400;
  color: #aaa;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}
/* 删除群图标 */
.showDel {
  position: absolute;
  display: none;
  color: #3796f6;
  right: 15px;
}

.g-li:hover .showDel {
  display: block;
  z-index: 1;
}

.g-name {
  margin-left: 20px;
  font-size: 14px;
  color: #404042;
  font-weight: 600;
  line-height: 1.5;
}

/* 聊天窗口样式 */
.chat-box {
  display: flex;
  flex-direction: column;
  margin: 15px 0 15px 20px;
  padding: 0 5px;
  flex: auto;
  align-items: center;
  background:#f4f4f4;
  border-radius: 5px;
  border: 1px solid #dbe2e8;
  box-shadow: 0 1px 2px rgba(46,61,73,.08);
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
  border: 1px solid #dbe2e8;
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
  font-size: 20px;
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
  height: 360px;
  border: 1px solid #dbe2e8;
  border-radius: 4px;
  overflow-x: hidden;
  overflow-y: auto;
  background: #fff;
}

/* 滚动条 */
.list-box::-webkit-scrollbar,
.chat-body::-webkit-scrollbar {
  width: 4px;
  height: 8px;
}

.chat-body::-webkit-scrollbar-thumb,
.list-box::-webkit-scrollbar-thumb {
  height: 10px;
  outline-offset: -2px;
  outline: 2px solid #fff;
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(238, 238, 238);
}

.chat-body::-webkit-scrollbar-track,
.list-box::-webkit-scrollbar-track {
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
  margin:20px 0 ;
  background: #fff;
  border-radius: 10px;
}

.send-box input {
  border: 1px solid #dbe2e8;
  padding: 0 10px;
  width: 90%;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.send-box button {
  width: 80px;
  background-color: #3796f6;
  color: #fff;
  font-size: 30px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.send-box button:hover {
  color: #3796f6;
  background: linear-gradient(45deg, rgba(55,150,246,0.5) 0%, rgba(55,150,246,0.05) 100%);
}
/* 消息列表盒子 */
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

.right_1 .message {
  background: #3796f6;
  color:#fff;
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
/* 消息文本盒子 */
.message {
  padding: 10px 15px;
  width: fit-content;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(133,153,171,0.2);
  font-size: 14px;
  color: #364e65;
  font-weight: 400;
  letter-spacing: 0.3px;
  background-color: rgba(55,150,246,0.1);;
}

.jion-tip {
  font-family: Montserrat, sans-serif;
  width: 100%;
  font-size: 13px;
  font-weight: 500;
  color: rgb(151, 151, 151);
  text-align: center;
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

/*未读提醒*/
.unread-tip {
  text-align: center;
  line-height: 18px;
  margin-left: 20px;
  flex: none;
  width: 18px;
  height: 18px;
  font-size: 13px;
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
