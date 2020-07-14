<template>
    <!-- 我的头像 -->
    <div class="my-avater">
        <header class="ws-head">我的头像</header>
        <div class="container">
            <div class="avater">
                <img v-if="!this.$store.state.avater" :src="defaultUser" alt="头像" />
                <img v-else :src="avater" alt="头像" />
                <p class="notice">上传图片格式为 jpg、png、jpeg、gif,大小不超过2M</p>
            </div>
            <div class="avatar-uploader">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <input ref="upload" type="file" id="saveImage" class="get-file" name="imgFile"  @change="getImg()"/>
            </div>
        </div>
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
      imageUrl:'',
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
      var _this = this,
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
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.avater {
  display: flex;
  align-items: center;
}

.container {
  display: flex;
  justify-content: space-between;
  width: 90%;
  align-items: center;
  margin: 20px 25px ;
 
}

.container img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.avatar-uploader {
  position: relative;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 108px;
  height: 108px;
  border:2px dashed #8c939d;
  border-radius: 5px;
  line-height: 108px;
  text-align: center;
}

.avatar-uploader-icon:hover {
  border-color:  #3796f6;
}

/* input file 美化*/
.get-file {
  position: absolute;
  left: 4px;
  top: 4px;
  width: 100px;
  height: 100px;
  opacity: 0;
  cursor:pointer;
}

.notice {
  flex: none;
  width: 200px;
  height: 40px;
  font-size: 14px;
  margin-left: 40px;
  color: #949292;
}

</style>