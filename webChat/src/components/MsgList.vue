<template>
  <div class="contBox">
    <div class="msgList"></div>
    <!-- <chats></chats> -->
  </div>
</template>

<script>
export default {
  name: "MsgList",

};
</script>
<style  scoped>
* {
  padding: 0;
  margin: 0;
}
.contBox {
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 20px 20px 20px 30px;
  background-color: #ecedf0;
}
.msgList {
  width: 350px;
  background: #fff;
}
</style>