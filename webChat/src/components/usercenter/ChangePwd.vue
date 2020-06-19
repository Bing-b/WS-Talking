<template>
    
    <!-- 修改密码 -->
    <div class="change-box">
        <header class="flex-head">修改密码</header>
        <div class="change-body">
            <div>
                <span>输入新密码：</span>
                <input v-model="pdw1" type="password" class="pwd1" placeholder="6-8位数字和字母组合" />
            </div>
        <div>
            <span>确认新密码：</span>
            <input v-model="pdw2" type="password" class="pwd2" placeholder="确认密码" />
        </div>

        <button @click="saveBtn">保存</button>
       </div>
   </div>
   
</template>

<script>
export default {
  name: "ChangePwd",
  data() {
    return {
      pdw1: "",      // 新密码
      pdw2: ""      // 确认新密码
    };
  },

  methods: {

    // 修改密码验证
    checkPwd() {
      if (this.pdw1) {
        if (this.pdw2) {
          if (this.pdw1 == this.pdw2) {
            return true;
          } else {
            this.$message.warning("2次密码不相同");
          }
        } else {
          this.$message.warning("请输入确认密码");
        }
      } else {
        this.$message.warning("请输入更改密码");
      }
    },

    // 密码修改
    updatePassword() {
      var username = parseInt(sessionStorage.getItem("username"));

      let data = {
        username: username,
        newPassword: this.pdw1
      };

      this.$axios.post("/api/users/updatePwd", data)
        .then(res => {
          console.log(res.data);
          this.$message.success("密码修改成功");
        })
        .catch(err => {
          console.log(err);
        });
    },


    saveBtn() {
      var _this = this;
      if (_this.checkPwd()) {
        _this.updatePassword();
      } else {
        return;
      }
    }
  }
};
</script>

<style scoped>
.change-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.change-box header {
  align-self: flex-start;
}

.change-body {
  display: flex;
  flex-direction: column;
  margin: 0 20px;
  width: 340px;
  height: 160px;
}

.change-body div {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.change-body span {
  flex: none;
}

.change-body input {
  outline: none;
  padding: 10px 12px;
  width: 220px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #292525;
  transition: all, 0.2s;
}

.change-body input:focus {
  background-color: #fff;
  border: 1px solid #dcdfe6;
}

.change-body button {
  outline: none;
  height: 35px;
  border-radius: 4px;
  border: none;
  letter-spacing: 4px;
  color: #fff;
  background: #4876ee;
}

.flex-head {
  display: flex;
  justify-content: flex-start;
  padding: 0 10px;
  margin-bottom: 20px;
  border-left: 2px solid #6691fa;
}
</style>