<template>
  <div id="app">
    <router-view v-if="isRouterActive" />
  </div>
</template>

<script>
import './assets/lib/jquery-3.2.1.min';
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data(){
    return{
      isRouterActive:true
    }
  },

  mounted(){
    window.addEventListener('unload',this.saveState)
  },

  methods:{
    saveState(){
      sessionStorage.setItem('state',JSON.stringify(this.$store.state));
    },
    //重载数据防止页面刷新导致的vuex数据丢失
    reload(){
      this.isRouterActive=false;
      this.$nextTick(function(){
        this.isRouterActive=true;
      })
    }
  }
}
</script>


<style scoped>
*{
  padding: 0;
  margin: 0;
  border: 0;
  font-family:-apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,
  Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
}

a{
  text-decoration: none;
}
ul{
  padding: 0;
}
ul li{
  list-style: none;
}

#app{
  height: 100%;
}

</style>