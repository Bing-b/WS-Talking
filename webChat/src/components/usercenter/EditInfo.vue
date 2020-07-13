<template>
  <!-- 我的信息 -->
  <div class="my-msg">
      <header class="ws-head">我的信息</header>

      <div>
          <span>昵称：</span>
          <input v-model="nickname" type="text" class="nickNameTxt" placeholder="编辑昵称..." />
      </div>

      <div>
          <span>账号：</span>{{username}}
      </div>

      <div>
          <span>我的签名：</span>
          <input v-model="usersign" class="sign-txt" placeholder="编辑签名..." />
      </div>

      <div style="margin-top:40px">
          <span>简介：</span>
          <textarea class="introduction" v-model="introduction" placeholder="简单描述一下自己吧..."></textarea>
      </div>

      <div class="btn-box">
          <button class="saveBtn ws-btn" @click="saveMsg()">保存</button>
      </div>
  </div>
  
</template>

<script>
import { mapMutation, mapMutations } from "vuex";
export default {
  name: "EditInfo",
  data() {
    return {
      username: sessionStorage.getItem("username"),
      nickname: "",                   // 用户昵称
      usersign: "",                  // 用户签名
      introduction: "",             // 用户简介
    };
  },

  methods: {
    ...mapMutations(["getNickName"]),
    ...mapMutations(["getUserSign"]),
    ...mapMutations(["getIntroduction"]),

    saveMsg() {
      var _this = this,
         username = parseInt(sessionStorage.getItem("username"));
      let data = {
        nickname: this.nickname,
        usersign: this.usersign,
        username: username,
        introduction: this.introduction
      };

      if (this.nickname) {
        if (this.usersign) {
          this.$axios.post("/api/users/editUserMsg", data)
            .then(res => {
              if (res.data == "ok") {
                this.$message.success("保存成功");
                this.$store.commit("getNickName", data.nickname);
                this.$store.commit("getUserSign", data.usersign);
                this.$store.commit("getIntroduction", data.introduction);
                // 保存成功，清空用户输入
                this.nickname = "";
                this.usersign = "";
                this.introduction = "";
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    }
  }
};
</script>
<style scoped>
.my-msg {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 20px 0 0;
  height: 380px;
  overflow: hidden;
}

.my-msg div {
  display: flex;
  align-items: center;
  height: 50px;
  margin-top: 10px;
  margin-left: 25px;
}

.my-msg span {
  flex: none;
}

.btn-box {
  display: flex;
  justify-content: flex-end;
}

/* 保存按钮 */
.saveBtn {
  align-self: flex-end;
  margin-top: 40px;
}



/* 编辑框样式 */
.introduction,
.nickNameTxt,
.sign-txt {
  flex: 1;
  min-width: 400px;
  padding: 15px 15px;
  font-size: 14px;
  outline: none;
  background-color: #f5f5f5;
  color: #292525;
  border: 1px solid transparent;
  transition: all, 0.2s;
  border-radius: 4px;
}

.introduction:focus,
.nickNameTxt:focus,
.sign-txt:focus {
  background-color: #fff;
  border: 1px solid #dcdfe6;
}
</style>