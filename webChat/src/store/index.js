import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({

    state: sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')) : {

        username: window.sessionStorage.getItem('username'),
        nickname: window.sessionStorage.getItem('nickname'),
        usersign: window.sessionStorage.getItem('usersign'),
        introduction: window.sessionStorage.getItem('introduction'),
        ws_user: window.localStorage.getItem('ws_user'),

        isLogin: ''
    },

    mutations: {

        login: (state, n) => {
            let isLogin = JSON.parse(n);
            sessionStorage.setItem('isLogin', JSON.stringify(isLogin));
            state.isLogin = isLogin;
        },

        //获取用户账号
        getUser: (state, data) => {
            state.username = data;
            window.sessionStorage.setItem('username', data);
        },
        //获取用户昵称
        getNickName: (state, data) => {
            state.nickname = data;
            window.sessionStorage.setItem('nickname', data);
        },
        //获取用户签名
        getUserSign: (state, data) => {
            state.usersign = data;
            window.sessionStorage.setItem('usersign', data);
        },
        //获取用户简介
        getIntroduction: (state, data) => {
            state.introduction = data;
            window.sessionStorage.setItem('getIntroduction', data);
        },
        //获取用户头像
        getAvater: (state, data) => {
            state.avater = data;
            window.sessionStorage.setItem('avater', data);
        },
        //退出登录，注销用户
        loginOut: (state) => {
            state.ws_user = null;
            window.localStorage.removeItem('ws_user');
        }
    }

});

export default store;