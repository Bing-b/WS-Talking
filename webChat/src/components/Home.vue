<template>
   <div class="container">
        <div class="header">
             <div class="logo">
                <img src="../assets/img/LOGO.jpg" alt="">
                <p>ws<span>Talking</span></p>
            </div>

            <div class="header-user">
                <div>
                    <img v-if="!this.$store.state.avater" :src="defaultUser" alt="用户头像" />
                    <img v-else :src="avater" alt="用户头像" />
                     <span v-if="!this.$store.state.nickname">{{this.$store.state.username}}</span>
                    <span v-else>{{this.$store.state.nickname}}</span>
                </div>
            </div>
        </div>

        <div class="main-box">
        <div class="aside">
            <div class="user">
                <div class="user-head"></div>
                <div class="user-avater">
                  <img v-if="!this.$store.state.avater" :src="defaultUser" alt="用户头像" />
                  <img v-else :src="avater" alt="用户头像" />
                </div>
                <div class="user-main">
                    <h3  v-if="!this.$store.state.nickname">{{this.$store.state.username}}</h3>
                    <h3 v-else>{{this.$store.state.nickname}}</h3>
                </div>
            </div>
            <div class="nav-container">
                <el-menu :default-active='activeIndex' :router="true" >
                    <el-menu-item  v-for="(item,i) in navData" :key="i"   :index="item.path">
                        <template slot="title">
                        <i :class="item.icon"></i>
                        <span>{{item.name}}</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item >
                        <template slot="title">
                        <i class="el-icon-circle-close"></i>
                        <span @click="loginOut()">退出</span>
                        </template>
                    </el-menu-item> 

                </el-menu>
            </div>
        </div>
        
        <div class="main">
            <router-view />
        </div>
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
      defaultUser: require("@/assets/img/defaultUser.png"),      //默认用户头像
      avater: sessionStorage.getItem("avater"),                  //用户头像
      activeIndex:'',

      navData: [
        // { 
        //   name: "消息",
        //   path: "/MsgList",
        //   imgUrl: require("@/assets/img/msg.png")
        // },
        {
          name: "会话",
          path: "/Friends",
          icon:'el-icon-chat-line-round'
        },
        {
          name: "账户",
          path: "/Account",
          icon:"el-icon-user"
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
  mounted (){
      this.activeIndex = "/"+this.$route.path.split("/")[1];
    
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
    },
     
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

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100%; 
    height: 100%;
    background-color: #fafafa;
    overflow-y: auto;
    position: relative;
    
}
.header {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: space-between;
    width: 85%;
    padding: 0 80px;
    border-radius: 10px;
    margin: 10px 20px 0 20px;
    height: 80px;
    background-color: #2d2f32;
    box-shadow: 0 2px 26px 0 rgba(133,153,171,0.1);
}
.logo {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.logo img {
    margin-right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.logo p {
    width: 130px;
    font-size: 30px;
    font-weight: 600;
    color: #3796f6;
    border-bottom-style: solid;
    border-bottom-color: #3796f6;
    border-bottom-width: 2px;
}
.logo span {
    color: #f1f7fe;
}

.header-user div {
    display: flex;
    color: #dadedf;
    flex-direction: row;
    margin-left: 50px;
    width: 200px;
    overflow: hidden;
    align-items: center;
    font-size: 14px;
}
.header-user img {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 20px;
}

.main-box {
  flex: 1;
  border-radius: 5px;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  
 
}

.aside {
    display: flex;
    flex: none;
    flex-direction: column;
    width: 200px;
    height: 600px;
    background:#f7fafdde;
    background: #ffffff;
    margin: 30px 30px 20px 60px;
    border: 1px solid #dbe2e8;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(7, 17, 27, .1);
    

}

.user {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 250px;
    border-bottom: 1px solid #cfcfcf;
   
}

.user .user-head {
    width: 100%;
    height: 100px;
    background: #3796f6;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

}
.user .user-avater {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    position: absolute;
    margin-top: 40px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1)
}
.user .user-avater img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1)
}
.user .user-main {
    flex: 1;
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0 0;
}

.main {
    flex: 1;
    min-width: 800px;
    height: 600px;
    margin: 30px 60px 0 0;
    background: #fff;
    border: 1px solid #dbe2e8;
    border-radius: 5px;
    box-shadow: 0 4px 8px 0 rgba(7, 17, 27, .1);
}

</style>