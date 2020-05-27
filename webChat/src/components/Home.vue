<template>
  <div id="Box">

      <!-- 侧边导航 -->
      <div class="nav-box">
          <div class="logo">
              <img src="../assets/img/LOGO.jpg" alt="logo" />
              <span class="bule-txt">ws</span>Talking
          </div>

      <div class="nav">
          <ul>
              <li v-for="(item,i) in navData"
               :class="{nav_li:active === i}"
               :key="i"
               @click="$router.push({path:item.path}),active = i">
              <img :src="item.imgUrl" />
              {{item.name}}
             </li>
          </ul>
      </div>

      <!-- 退出登录 -->
      <div class="footer">
          <div class="login-out" @click="loginOut()">
              <img :src="out" />
              <span>退出</span>
          </div>
      </div>
    </div>

    <div id="rightBox">

        <!-- 用户头像状态 -->
        <div class="head-box">
            <div class="user-msg">
                <img v-if="!this.$store.state.avater" :src="defaultUser" alt="用户头像" />
                <img v-else :src="avater" alt="用户头像" />

                <div class="user-msgs">
                    <span v-if="!this.$store.state.nickname">{{this.$store.state.username}}</span>
                    <span v-else>{{this.$store.state.nickname}}</span>
                    <span v-if="this.$store.state.usersign">{{this.$store.state.usersign}}</span>
                    <span v-else>签名：简单描述一下自己吧！</span>
                </div>
            </div>
       </div>

      <!-- body放置其他组件区域 -->
      <router-view />

    </div>
  </div>
  
</template>

<script>
import { mapMutation, mapMutations } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      active: 0,
      userName: "",
      defaultUser: require("@/assets/img/defaultUser.png"),      //默认用户头像
      avater: sessionStorage.getItem("avater"),
      out: require("@/assets/img/out.png"),                      //退出登录图标

      navData: [
        { 
          name: "消息",
          path: "/MsgList",
          imgUrl: require("@/assets/img/msg.png") },
        {
          name: "联系人",
          path: "/Friends",
          imgUrl: require("@/assets/img/friends.png")
        },
        {
          name: "账户",
          path: "/Account",
          imgUrl: require("@/assets/img/person.png")
        }
      ]
    };
  },


  // 监听用户头像上传后实时更新
  watch: {
    "$store.state.avater": function() {
      this.avater = this.$store.state.avater;
    }
  },

  // 监听用户关闭窗口
  // mounted() {
  //     window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
  //     window.addEventListener('unload', e => this.unloadHandler(e))
  //   },
  //   destroyed() {
  //     window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
  //     window.removeEventListener('unload', e => this.unloadHandler(e))

  // },

  methods: {
    ...mapMutations(["loginOut"]),
    ...mapMutations(["login"]),

    loginOut() {
      this.$store.commit("loginOut");
      this.$store.commit("login", false);
      this.$router.push("/");
    }

    // beforeunloadHandler(){
    //     this._beforeUnload_time=new Date().getTime();
    //   },
    //   unloadHandler(e){
    //     this._gap_time=new Date().getTime()-this._beforeUnload_time;

    //     //判断是窗口关闭还是刷新
    //     if(this._gap_time<=5){
    //       //如果是登录状态，关闭窗口前，移除用户
    //       if(localStorage.getItem('isLogin')){
    //         this.loginOut();
    //         }
    //       }
    //     }
  }
};
</script>

<style scoped>


#Box {
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
}

.nav-box {
  flex: none;
  width: 200px;
  background-color: #4876ee;
  background-image: url(../assets/img/bg-2.png);
}

/* 右边模块盒子 */
#rightBox {
  display: flex;
  flex: 1;
  flex-direction: column;
  background-color: #6690fa48;
}

.head-box {
  flex: none;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  height: 80px;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, .1);
  overflow: hidden;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  font-size: 25px;
  background: #fff;
  border-bottom: 1px solid #c3cadfdc;
  color: rgb(116, 113, 113);
}

.logo img {
  width: 65px;
  height: 65px;
  border-radius: 50%;
}

.bule-txt {
  color: #007bff;
}

/* 导航部分样式 */
.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  height: 200px;
}

.nav ul {
  padding: 0;
}

.nav li {
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-around;
  height: 50px;
  width: 80%;
  border-radius: 4px;
  color: #fff;
}

.nav_li {
  background: #2359d6;
}

.nav li:hover {
  background-color: #0a0a0a2a;
}

/* 顶部用户信息栏样式 */
.user-msg {
  display: flex;
  justify-content: space-around;
  align-items: center;
  right: 100px;
  width: 400px;
  height: 40px;
  color: #a9a9ac;
  border-left: 2px solid #e6e7e9;
}

.user-msg img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 1px solid rgb(233, 230, 230);
}

.user-msgs {
  display: flex;
  flex-direction: column;
  width: 300px;
  font-size: 15px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-out {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px 20px;
  margin-top: 350px;
  height: 30px;
  width: 70px;
  color: #fff;
  border-radius: 4px;
}

.login-out:hover {
  background-color: #0a0a0a2a;
}
</style>