<template>
  <!-- 账户 -->
  <div id="account">
      <div class="left-nav">
          <header>账户设置</header>
              <el-menu :default-active='activeIndex' :router="true" >
                  <el-menu-item  v-for="(item,i) in navData" :key="i"   :index="item.path">
                      <template slot="title">
                          <i :class="item.icon"></i>
                          <span>{{item.name}}</span>
                      </template>
                  </el-menu-item>
              </el-menu>
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
      activeIndex:'',
      navData: [
        {
          name: "个人中心",
          path: "/MyProfile",
          icon:'el-icon-house'
        },
        {
          name: "我的信息",
          path: "/EditInfo",
          icon:"el-icon-postcard"
        },
        {
          name: "我的头像",
          path: "/Avater",
          icon:'el-icon-picture-outline-round'
        },
        {
          name: "修改密码",
          path: "/ChangePwd",
          icon:'el-icon-lock'
        }
      ]
    };
  },

  mounted () {
     this.activeIndex = "/"+this.$route.path.split("/")[1];
  }


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
  height: 260px;
  background: #fff;
  border-radius: 5px;
  border: 1px solid rgba(133,153,171,0.2);
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, .1);
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

.el-menu {
  background: #ffffff;
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