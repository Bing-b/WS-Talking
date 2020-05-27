import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/index'
//引入消息弹出框组件
import Msg from './components/Msg/index'

Vue.config.productionTip = false
//挂载到原型，方便调用$this.axios
Vue.prototype.$axios = axios;
Vue.use(Msg);
Vue.config.productionTip = false;



new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',

})


/**
 * 全局路由守卫
 */
router.beforeEach((to, from, next) => {
  let loginStatus = JSON.parse(sessionStorage.getItem('isLogin'));
  // 未登录状态
  if (to.meta.requireAuth) {
    if (loginStatus) {
      next();
    } else {
      next({
        path: '/'
      })
    }
  } else {
    next();
  }
  //已登录状态
  if (to.fullPath == '/') {
    if (loginStatus) {
      next({
        path: from.fullPath
      });
    } else {
      next();
    }
  }
});
