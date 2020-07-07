<template>
    <div class="body">
        <div class="header"> 
            <img src="../assets/img/LOGO.jpg" alt="logo">
            <span>ws</span>Talking
        </div>
        
        <div class="container">
            <div class="card"></div>
            <div class="card">
                <div  v-show="showLog">
                   <h1 class="title">登录</h1>
                   <!-- 登录表单 -->
                   <form>
                       <div class="input-container">
                           <input type="text" v-model="username" id="uname" autocomplete="off" required>
                           <label for="uname">用户名</label>
                           <div class="bar"></div>
                       </div>
                       <div class="input-container">
                          <input type="password" v-model="password" id="pwd" autocomplete="off" required>
                          <label for="pwd">密码</label>
                          <div class="bar"></div>
                      </div>
                      <div class="button-container">
                          <button type="button" @click="login()">
                          <span>登录</span>
                          </button>
                      </div>
                      <!-- <div class="footer"><a href="#">忘记密码？</a></div> -->
                   </form>
               </div>
           </div>

           <div class="card alt">
               <div class="toggle" @click="showLogin()"></div>
               <div  v-show="showReg">
                   <h1 class="title">
                       注册<div class="close" @click="showRegister()"></div>
                   </h1>
                    <!-- 注册表单 -->
                   <form>
                       <div class="input-container">
                           <input type="text" v-model="username" id="username" autocomplete="off" required>
                           <label for="username">用户名</label>
                           <div class="bar"></div>
                       </div>
                       <div class="input-container">
                           <input type="password" v-model="password" id="pwd" autocomplete="off" required>
                           <label for="pwd">密码</label>
                           <div class="bar"></div>
                       </div>
                       <div class="input-container">
                           <input type="text" v-model="inputCode" id="codeNum" autocomplete="off" required>
                           <div class="code-box">
                                <!-- 验证码组件 -->
                               <valid-code ref="vcode" ></valid-code>
                           </div>
                           <label for="codeNum">安全验证</label>
                           <div class="bar"></div>
                       </div>
                       <div class="button-container">
                           <button type="button" @click="regBtn()">
                           <span>注册</span>
                           </button>
                       </div>
                  </form>
              </div>
          </div>
      </div>
      <div class="footer">
          © 2018-2020 wsTalking粤ICP备09128966号-4CC BY-NC 4.0
      </div>
  </div>
</template>

<script>
import {mapMutation, mapMutations} from 'vuex';
import ValidCode from '@/components/ValidCode';

export default {
    name:"Login",
    components:{ValidCode},

    data(){
        return{
            username:"",              // 用户账号
            password:"",             // 用户密码
            inputCode:"",           // 验证码
            showLog:true,
            showReg:false
        };   
    },

    mounted(){
            var _this=this;
            this.$refs.vcode.drawCode();
            // 监听回车 确认登录
            document.onkeydown = function (event) {
            var e = event || window.event;
            if (e && e.keyCode == 13) { 
            _this.login();
        }
        }
    },

    methods:{
        ...mapMutations(['login']),
        ...mapMutations(['getUser']),
        ...mapMutations(['getNickName']),
        ...mapMutations(['getUserSign']),
        ...mapMutations(['getIntroduction']),
        ...mapMutations(['getAvater']),

           
        showLogin() {
            $(".container").stop().addClass("active");
            this.showLog=false;
            this.showReg=true;
            this.createCode();
        },

        showRegister() {
            $(".container").stop().removeClass("active");
            this.showLog=true;
            this.showReg=false;
        },

        // 创建验证码
        createCode() {
            this.$refs.vcode.drawCode();
        },

        // 注册表单验证
        checkReg() {
            var codeVal=this.inputCode.toLowerCase(),
                num=this.$refs.vcode.showCode.join("");

            if (this.username == "") {
                this.$message.info('手机号不能为空');
                return false;
            }
            if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.username))) {
                this.$message.info('手机号格式不正确');
                return false;
            }
            if (this.password == "") {
                this.$message.info('密码不能为空');
                return false;
            }
            if (this.password.length<6 || this.password.length>8) {
                this.$message.info('密码在6-10位');
                return false;
            }
            if (!(/^(?=.*[a-zA-Z])(?=.*[1-9])(?=.*[\W]).{6,}$/).test(this.password)) {
                this.$message.info('密码必须包含字母、数字、特殊符号');
                return false;
            }
            if (codeVal == "") {
                this.$message.info('请输入验证码');
                return false;
            }
            if (codeVal != num) {
                this.$message.info('验证码错误！请重新输入！');
                this.inputCode = "";
                this.$refs.vcode.drawCode();
                return false;
            }
            return true;
        },

        // 注册按钮
        regBtn() {
            this.checkReg();
            if (this.checkReg()) {
                this.reg();
            } else {
                console.log('err');
            }
        },
        // 用户注册
        reg(){
            let data = {
                username: this.username,
                password: this.password
            };

            this.$axios.post("/api/users/addUser",data)
            .then(res=>{
                console.log(res.data);

                if (res.data == -1) {
                    this.$message.info('该账户已存在');
                    this.$refs.vcode.drawCode();
                    this.inputCode = "";
                    this.username = "";
                    this.password = "";
                } else if (res.status==200) {
                    this.$message.success('注册成功');
                    this.inputCode = "";
                    this.username = "";
                    this.password = "";
                    
                    var _this =this
                    /*注册成功之后再跳回登录页*/
                    setTimeout(
                        function() {
                        _this.showRegister();
                       // this.$router.push("/");
                        }.bind(this),
                        1000
                    );
                }
            })
            .catch( err => {
                console.log(err);
            })
        },

        // 用户登录
        login() {
            let data = {
                username: this.username,
                password: this.password
            };

            this.$axios.post("/api/users/selectUser",data)
            .then( res => {
                console.log(res.data);

                if (res.data == -1) {
                  this.$message.error({message:'用户名或密码错误'})
               // this.$message.info('用户名或密码错误');
                } else if (res.data == 0) {
                this.$message.info('用户名或密码错误');
                } else {
                this.$message.success('登录成功');
                //存入登录状态标志
                this.$store.commit('login',true);
                //获取用户信息 
                this.getUserMsg();
                this.$router.push("/home");
                setTimeout(
                    function() {
                    this.$router.push("/home");
                    }.bind(this),
                    1000);
                }
            })
            .catch( err => {
                console.log(err);
            })
        },


        // 获取用户基本信息
        getUserMsg() {
            var _this = this;
            
            this.$axios.get("/api/users/getUserMsg",{
                params:{
                    username: this.username,
                }
            })
            .then( res => {
                var result = res.data;

                if (res.data == '-1') {
                    this.$message.warning('获取信息失败');
                }
                if (res.status == 200) {
                    let username = result.username;
                    let usersign = result.usersign;
                    let nickname = result.nickname;
                    let introduction = result.introduction;
                    let avater = result.avater;
                    // 将用户头像存入本地
                    localStorage.setItem('avater',avater);
                    // 保存用户信息到vuex
                    this.$store.commit('getUser',username);
                    this.$store.commit('getNickName',nickname);
                    this.$store.commit('getUserSign',usersign);
                    this.$store.commit('getIntroduction',introduction);
                    this.$store.commit('getAvater',avater);
                }
    
            })
            .catch( err => {
                console.log(err);
            })
        },

        }
    
    }

</script>

<style scoped>
@import "../assets/css/font-awesome/css/font-awesome.min.css";

.body {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url(../assets/img/bg-2.png)repeat;
    background-color: #f1f1f1;
    position: relative;
    overflow-y: auto;
    background-attachment: fixed;
}

.header {
  margin-top: 20px;
  width: 300px;
  height: 60px;
  display: flex;
  font-size: 40px;
  font-weight: 600;
  text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.336);
  justify-content: center;
}

.header img {
  width: 60px;
  height: 60px;
  margin-right: 30px;
  border-radius: 50%;
}

.header span {
  color: #2f80ec;
}

.code-box {
  width: 100px;
  height: 40px;
  cursor: pointer;
  right: 0;
  top: 10px;
  z-index: 1;
  position: absolute;

}

.footer {
  margin-top:auto;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
}

/* 表单主体 */
.container {
  position: relative;
  max-width: 440px;
  width: 440px;
  margin-top: 50px;
}


.container.active .card:first-child {
  background: #f2f2f2;
  margin: 0 15px;
}

.container.active .card:nth-child(2) {
  background: #fafafa;
  margin: 0 10px;
}

.container.active .card.alt {
  top: 20px;
  right: 0;
  width: 100%;
  min-width: 100%;
  height: auto;
  border-radius: 5px;
  padding: 40px 0 30px;
  overflow: hidden;
}

.container.active .card.alt .toggle {
  position: absolute;
  top:200px;
  right: 170px;
  box-shadow: none;
  -webkit-transform: scale(8);
  transform: scale(8);
  -webkit-transition: -webkit-transform .3s ease;
  transition: -webkit-transform .3s ease;
  transition: transform .3s ease;
  transition: transform .3s ease, -webkit-transform .3s ease;
}

.container.active .card.alt .toggle:before {
  content: '';
}

.container.active .card.alt .title,
.container.active .card.alt .input-container,
.container.active .card.alt .button-container {
  left: 0;
  opacity: 1;
  visibility: visible;
  -webkit-transition: .3s ease;
  transition: .3s ease;
}

/* 表单 */
.card {
  position: relative;
  background: #ffffff;
  border-radius: 5px;
  padding: 50px 0 40px 0;
  box-sizing: border-box;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  -webkit-transition: .3s ease;
  transition: .3s ease;
}

.card:first-child {
  background: #fafafa;
  height: 10px;
  border-radius: 5px 5px 0 0;
  margin: 0 10px;
  padding: 0;
}

.card .title {
  position: relative;
  z-index: 1;
  border-left: 5px solid #2f80ec;
  margin: 0 0 35px;
  padding: 10px 0 10px 50px;
  color: #2f80ec;
  font-size: 32px;
  font-weight: 600;
}

.input-container {
  position: relative;
  margin: 0 60px 35px;
}

.input-container input {
  outline: none;
  z-index: 1;
  position: relative;
  background: none;
  width: 100%;
  height: 60px;
  border: 0;
  color: #212121;
  font-size: 24px;
  font-weight: 400;
}

.input-container input:focus ~ label {
  color: #9d9d9d;
  -webkit-transform: translate(-12%, -50%) scale(0.75);
          transform: translate(-12%, -50%) scale(0.75);
}

.input-container input:focus ~ .bar:before, 
.input-container input:focus ~ .bar:after {
  width: 50%;
}

.input-container input:valid ~ label {
  color: #9d9d9d;
  -webkit-transform: translate(-12%, -50%) scale(0.75);
          transform: translate(-12%, -50%) scale(0.75);
}

.input-container label {
  position: absolute;
  top: 0;
  left: 0;
  color: #757575;
  font-size: 24px;
  font-weight: 300;
  line-height: 60px;
  -webkit-transition: 0.2s ease;
  transition: 0.2s ease;
}

.input-container .bar {
  position: absolute;
  left: 0;
  bottom: 0;
  background: #757575;
  width: 100%;
  height: 1px;
}

.input-container .bar:before,
.input-container .bar:after {
  content: '';
  position: absolute;
  background: #2f80ec;
  width: 0;
  height: 2px;
  -webkit-transition: .2s ease;
  transition: .2s ease;
}

.input-container .bar:before {
  left: 50%;
}

.input-container .bar:after {
  right: 50%;
}

.button-container {
  margin: 0 60px;
  text-align: center;
}

.button-container button {
  outline: 0;
  cursor: pointer;
  position: relative;
  display: inline-block;
  background: 0;
  width: 240px;
  border: 2px solid #e3e3e3;
  padding: 20px 0;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  text-transform: uppercase;
  overflow: hidden;
  -webkit-transition: .3s ease;
  transition: .3s ease;
}

.button-container button span {
  position: relative;
  z-index: 1;
  color: #ddd;
  -webkit-transition: .3s ease;
  transition: .3s ease;
}

.button-container button:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  background: #2f80ec;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  margin: -15px 0 0 -15px;
  opacity: 0;
  -webkit-transition: .3s ease;
  transition: .3s ease;
}

.button-container button:hover, 
.button-container button:active, 
.button-container button:focus {
  border-color: #2f80ec;
}

.button-container button:hover span, 
.button-container button:active span, 
.button-container button:focus span {
  color: #2f80ec;
}

.button-container button:active span, 
.button-container button:focus span {
  color: #ffffff;
}

.button-container button:active:before, 
.button-container button:focus:before {
  opacity: 1;
  -webkit-transform: scale(10);
  transform: scale(10);
}

.card.alt {
  position: absolute;
  top: 40px;
  right: -70px;
  z-index: 10;
  width: 140px;
  height: 140px;
  background: none;
  border-radius: 100%;
  box-shadow: none;
  padding: 0;
  -webkit-transition: .3s ease;
  transition: .3s ease;
}

.card.alt .toggle {
  position: relative;
  background: #2f80ec;
  width: 100px;
  height: 100px;
  border-radius: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  color: #ffffff;
  font-size: 50px;
  line-height: 100px;
  text-align: center;
  cursor: pointer;
}

.card.alt .toggle:before {
  content: '\f067';
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-transform: translate(0, 0);
          transform: translate(0, 0);
}

.card.alt .title,
.card.alt .input-container,
.card.alt .button-container {
  left: 100px;
  opacity: 0;
  visibility: hidden;
}

.card.alt .title {
  position: relative;
  border-color: #ffffff;
  color: #ffffff;
}

.card.alt .title .close {
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 60px;
  display: inline;
  color: #ffffff;
  font-size: 58px;
  font-weight: 400;
}

.card.alt .title .close:before {
  content: '\00d7';
}

.card.alt .input-container input {
  color: #ffffff;
}

.card.alt .input-container input:focus ~ label {
  color: #ffffff;
}

.card.alt .input-container input:focus ~ .bar:before, 
.card.alt .input-container input:focus ~ .bar:after {
  background: #ffffff;
}

.card.alt .input-container input:valid ~ label {
  color: #ffffff;
}

.card.alt .input-container label {
  color: rgba(255, 255, 255, 0.8);
}

.card.alt .input-container .bar {
  background: rgba(255, 255, 255, 0.8);
}

.card.alt .button-container button {
  width: 100%;
  background: #ffffff;
  border-color: #ffffff;
}

.card.alt .button-container button span {
  color: #2f80ec;
}

.card.alt .button-container button:hover {
  background: rgba(255, 255, 255, 0.9);
}

.card.alt .button-container button:active:before, 
.card.alt .button-container button:focus:before {
  display: none;
}

</style>