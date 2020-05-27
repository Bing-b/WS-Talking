<template>

    <!-- 我的头像 -->
    <div class="my-avater">
        <header class="flex-head">我的头像</header>
        <div class="head-box">
            <img v-if="!this.$store.state.avater" :src="defaultUser" alt="头像" />
            <img v-else :src="avater" alt="头像" />
            <div class="upload-box">
                <a href="javascript:;">
                    Upload
                    <input ref="upload" type="file" id="saveImage" class="get-file" name="imgFile"  @change="getImg()"/>
               </a>
           </div>
        </div>
        <p class="warn-msg">上传图片格式为 jpg、png、jpeg、gif,大小不超过2M</p>
    </div>

</template>

<script>
import { mapMutation, mapMutations } from "vuex";

export default {
  name: "Avater",
  inject: ["reload"],

  data() {
    return {
      avater: "",
      defaultUser: require("@/assets/img/defaultUser.png")
    };
  },

  mounted() {
    this.init();    // 初始化
  },

  methods: {
    ...mapMutations(["getAvater"]),

    //初始化
    init() {
      var username = parseInt(sessionStorage.getItem("username"));
      this.$axios
        .get("/api/users/getUserMsg", {
          params: {
            username: username
          }
        })
        .then(res => {
          var result = res.data;
          let avaterUrl = result.avater;
          this.avater = avaterUrl;

          this.$store.commit("getAvater", avaterUrl);
        });
    },

    // 获取用户上传图片并上传
    getImg() {
      var _this = this;
          username = parseInt(sessionStorage.getItem("username")),
          formData = new FormData(),
          file = this.$refs.upload.files[0];

      if (!file) {
        this.$message.info("请选择文件");
        return;
      }
      formData.append("imgFile", file);
      formData.append("username", username);

      this.$axios.post("/api/users/uploadImg", formData).then(res => {
        console.log(res.data);
        if (res.status == 200) {
          _this.init();
          this.$message.success("上传成功");
          _this.reload();
        }
        if (res.data == "-2") {
          this.$message.warning("格式错误");
        }
        if (res.data == "-1") {
          this.$message.info("用户不存在");
        }
      });
    }
  }
};
</script>

<style scoped>

.my-avater {
  flex: 1;
}

.head-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 30px;
}

.head-box img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.head-box img:hover {
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, .2);
}

.flex-head {
  display: flex;
  justify-content: flex-start;
  padding: 0 10px;
  margin-bottom: 20px;
  border-left: 2px solid #6691fa;
}

/* 美化上传input */
.upload-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 400px;
  height: 50px;
  width: 100px;
}

.upload-box img {
  position: relative;
  left: 60px;
  width: 40px;
  height: 40px;
}

.upload-box a {
  position: relative;
  display: inline-block;
  border-radius: 4px;
  padding: 5px 15px;
  overflow: hidden;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  background-color: #4876ee;
  text-decoration: none;
  line-height: 20px;
}

.upload-box a:hover {
  background: #4877eed3;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, .2);
}

.upload-box input {
  position: absolute;
  right: 0;
  top: 0;
}

.get-file {
  opacity: 0.4;
}

.warn-msg {
  margin-left: 40px;
  color: #949292;
}
</style>