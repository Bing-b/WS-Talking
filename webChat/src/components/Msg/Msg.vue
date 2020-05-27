<template>
  <transition name="fade">
    <div class="message" :class="type" v-show="show">
      <span :class="type"></span>
      <span class="text">{{text}}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: "message",
  props: {
    type: {
      type: String,
      default: "info",
      validator: val => ["info", "success", "warning", "error"].includes(val)
      //['info', 'success', 'warning', 'error'] 表示type只接收这四个字符串作为参数传入message组件
    },
    text: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.message {
  display: flex;
  justify-content: center;
  position: fixed;
  top: 40px;
  left: 50%;
  min-width: 200px;
  transform: translateX(-50%);
  padding: 10px 20px;
  font-size: 14px;
  line-height: 1.4;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: 0 4px 8px 0 rgba(7, 17, 27, 0.2);
}

.warning {
  color: #f0be57;
  background: #fdf6ec;
}
.info {
  color: #909399;
  background: #edf2fc;
}
.success {
  color: #8ac46e;
  background: #f0f9eb;
}
.error {
  color: #f56c6c;
  background: #fef0f0;
}

/* 警示图标 */
span[class="info"] {
  width: 20px;
  height: 20px;
  background: url(./../../../static/icon/warning.png);
}
span[class="success"] {
  width: 20px;
  height: 20px;
  background: url(./../../../static/icon/success.png);
}
span[class="warning"] {
  width: 20px;
  height: 20px;
  background: url(./../../../static/icon/warning.png);
}
span[class="error"] {
  width: 20px;
  height: 20px;
  background: url(./../../../static/icon/error.png);
}
</style>
