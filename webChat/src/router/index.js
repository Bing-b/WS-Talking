import Vue from 'vue'
import Router from 'vue-router'
// 主路由
import Login from '@/components/Login'
import Home from '@/components/Home'
import Account from '@/components/Account'
import MsgList from '@/components/MsgList'
import Friends from '@/components/Friends'

// 账户路由
import MyProfile from '@/components/usercenter/MyProfile'
import EditInfo from '@/components/usercenter/EditInfo'
import Avater from '@/components/usercenter/Avater'
import ChangePwd from '@/components/usercenter/ChangePwd'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: {requireAuth:true},
      redirect: '/MsgList',
      children: [
        {
          path: '/MsgList',
          name: 'MsgList',
          component: MsgList,
          meta: {requireAuth:true},
        },
        {
          path: '/Friends',
          name: 'Friends',
          component: Friends,
          meta: {requireAuth:true},
        },
        {
          path: '/Account',
          name: 'Account',
          component: Account,
          meta: {requireAuth:true},
          redirect: '/MyProfile',
          children: [
            {
              path: '/MyProfile',
              name: 'MyProfile',
              component: MyProfile,
              meta: {requireAuth:true},
            },
            {
              path: '/EditInfo',
              name: 'EditInfo',
              component: EditInfo,
              meta: {requireAuth:true},
            },
            {
              path: '/Avater',
              name: 'Avater',
              component: Avater,
              meta: {requireAuth:true},
            },
            {
              path: '/ChangePwd',
              name: 'ChangePwd',
              component: ChangePwd,
              meta: {requireAuth:true},
            }


          ]
        },

      ]
    },


  ]
});






/**
*	源码 install 安装依赖时，Router（路由版本不一致）
*	也可以修改 package.json 里面的 Router 版本
*/
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}



export default router;