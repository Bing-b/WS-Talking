<template>
  <!-- 账户 -->
  <div id="account">
      <div class="left-nav">
          <header>个人中心</header>
          <ul>
              <li v-for="(item,i) in navData"
                 :class="{nav_li: active === i}"
                 :key="i"
                 @click="$router.push({path:item.path}),active = i"
              >
              <img :src="item.imgUrl" />
              <span>{{item.name}}</span>
              </li>
          </ul>    
       </div>

       <!-- 侧边导航切换盒子 -->
       <div class="r-box">
          <router-view></router-view>
       </div>
  </div>
</template>

<script>
export default {
  name: "Account",
  data() {
    return {
      active: 0,
      navData: [
        {
          name: "首页",
          path: "/MyProfile",
          imgUrl: require("@/assets/img/home.png")
        },
        {
          name: "我的信息",
          path: "/EditInfo",
          imgUrl: require("@/assets/img/myMsg.png")
        },
        {
          name: "我的头像",
          path: "/Avater",
          imgUrl: require("@/assets/img/myPng.png")
        },
        {
          name: "修改密码",
          path: "/ChangePwd",
          imgUrl: require("@/assets/img/pwd.png")
        }
      ]
    };
  },

};
</script>


<style scoped>
#account {
  display: flex;
  padding: 20px;
}

/* 左边导航样式 */
.left-nav {
  width: 200px;
  height: 250px;
  background: #fff;
  border-radius: 4px;
}

ul{
  padding: 0;
}

header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 30px;
  font-weight: bold;
  background-color: #fff;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  border-bottom: 1px solid #ececec;
}

.left-nav li {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px 40px;
  height: 40px;
}

.left-nav li:first-child {
  letter-spacing: 14px;
}

.nav_li {
  background-color: #6691fa;
  box-shadow: 2px 2px 3px rgb(184, 183, 183);
  color: #fff;
  border-radius: 2px;
}

/* 右边切换组件 */
.r-box {
  display: flex;
  flex: 1;
  margin-left: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.1);
  border-radius: 2px;
}

</style>