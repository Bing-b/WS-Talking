<template>
  <div class="contBox">
    <div class="msgList"></div>

    <!-- 待功能更新 -->


  
  </div>
</template>

<script>
export default {
  name: "MsgList",
}
</script>
<style  scoped>
* {
  padding: 0;
  margin: 0;
}

input,
button {
  outline: none;
  border: 0;
}

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