<template>
  <div class="contBox">
    <div class="msgList"></div>
    <!-- 功能开发中 -->
  </div>
</template>

<script>
export default {
  name: "MsgList",
}
</script>
<style  scoped>
.contBox {
  display: flex;
  flex: 1;
  justify-content: space-between;
}

.msgList {
  width: 350px;
  height: 500px;
  background: #fff;
  margin: 15px;
}
</style>