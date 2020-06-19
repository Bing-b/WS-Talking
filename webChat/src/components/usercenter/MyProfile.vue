<template>
    
    <!-- 个人中心 -->
    <div class="user-center-box">
        <div class="box_1">
           <!-- 头像 -->
           <div class="avater-box">
               <img v-if="!this.$store.state.avater" :src="defaultUser" alt="用户头像"/>
               <img v-else :src="avater"  alt="用户头像" />
           </div>
           <div class="u-msg">
               <!-- 昵称 -->
               <h3 v-if="this.$store.state.nickname">{{nickname}}</h3>
               <h3 v-else>昵称：</h3>
               <!-- 签名 -->
               <span v-if="this.$store.state.usersign">签名：{{this.$store.state.usersign}}</span>
               <span v-else>签名：....</span>
          </div>

          <div>
            <button class="app-btn" @click="changeMsgBtn()">修改资料</button>
          </div>
      </div>

    <div class="box_2">
        <h4>简介：</h4>
        <p v-if="this.$store.state.introduction">{{this.$store.state.introduction}}</p>
        <p v-else>简单介绍一下自己吧！</p>
    </div>

  </div>
  
</template>

<script> 
export default {
  name: "MyProfile",
  data() {
    return {
      nickname: sessionStorage.getItem("nickname"),
      avater: sessionStorage.getItem("avater"),
      defaultUser: require("@/assets/img/defaultUser.png")
    };
  },

  methods: {
    changeMsgBtn() {
      const vm = this;
      vm.$router.push({ name: "EditInfo" });
    }
  }
};
</script>
<style scoped>
.user-center-box {
  padding: 0 40px;
  border-radius: 4px;
  width: 100%;
}

.box_1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 170px;
  background: #ffffff;
  border-bottom: 1px solid #d3d0d0;
}
.box_1 > div{
  display: flex;
  margin-right: 10px;
}

.avater-box img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.avater-box img:hover{
   box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.2);
}

.u-msg {
  display: flex;
  padding: 0 40px;
  flex: none;
  flex-direction: column;
  color: #4D555D !important;
  border-left: 2px solid #ececec;
}

.app-btn {
  flex: none;
  padding: 3px 10px;
  border: 1px solid #dad8d8;
  border-radius: 4px;
  color: #4D555D !important;
  background-color: #fff;
}
.app-btn:hover {
  border: 1px solid #6691fa;
  color: #6691fa;
  border-radius: 4px;
}

.box_2 {
  margin-top: 20px;
  height: 120px;
}

.box_2 p {
  margin: 10px 0;
  text-indent: 50px;
  color: #7c7a7a;
}
</style>