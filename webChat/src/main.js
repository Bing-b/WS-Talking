import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/index'
import ElementUI from 'element-ui'
import md5 from 'js-md5'
import 'element-ui/lib/theme-chalk/index.css'


Vue.config.productionTip = false
//挂载到原型，方便调用$this.axios
Vue.prototype.$axios = axios;
Vue.prototype.$md5 = md5;
Vue.use(ElementUI)
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
