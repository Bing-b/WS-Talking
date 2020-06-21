<template>
    <div class="body">
        <div class="logo"> 
            <img src="../assets/img/LOGO.jpg" alt="logo">
            <div><span>ws</span>Talking</div>
        </div>

        <!-- 登录注册盒子 -->
        <div id="container">

            <div class="avatar"> 
                <img v-if="avater" :src="avater" alt="avater">
                <img v-else src="../assets/img/LOGO.jpg" alt="avater">
            </div>

            <!-- 登录模块 -->
            <div class="login-box" v-show="showLogin">
                <form>
                    <input class="input" type="text" v-model="username" placeholder="请输入登录手机号" autocomplete>
                    <input class="input" type="password"  v-model="password" placeholder="请输入密码" autocomplete>
                    <input class="input btn" type="button" value="登录" @click="login()">
                    <div class="log-tag">
                        <span class="reg" >还没账号？<a class="blue-txt" @click="switchLogin();createCode()">快速注册</a></span>
                        <span class="gray-txt">忘记密码</span>
                    </div>
                </form>
            </div>
            
            
            <!-- 注册模块 -->
            <div class="register-box" v-show="showRegister">
                <form>
                    <input class="input" type="text" v-model="username" placeholder="请输入注册手机号" autocomplete>
                    <input class="input" type="password" v-model="password" placeholder="请输入密码" autocomplete>
                    <div class="code-box">
                        <input class="input inputCode" type="text" v-model="inputCode" placeholder="请输入验证码" style="width: 130px;">
                        <!-- 验证码组件 -->
                        <valid-code ref="vcode" ></valid-code>
                    </div>
                    <input class="input btn" id="regBtn" @click="regBtn()" type="button" value="注册">
                    <div class="reg-tag"><span @click="switchLogin()">已有账号？<a class="blue-txt">立即登录</a></span></div>
                </form>
            </div>
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
            showLogin:true,
            showRegister:false,
            avater:""            // 用户头像
        };   
    },

    mounted(){
            var _this=this;
            this.$refs.vcode.drawCode();
            // 挂载用户头像
            this.localUserMsg();
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


        // 登录注册模块切换
        switchLogin(){
            this.showLogin=!this.showLogin;
            this.showRegister=!this.showRegister;
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
                $(".inputCode").val('');
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
                    this.username = "";
                    this.password = "";
                } else if (res.status==200) {
                    this.$message.success('注册成功');
                    this.username = "";
                    this.password = "";

                    /*注册成功之后再跳回登录页*/
                    setTimeout(
                        function() {
                        this.showRegister = false;
                        this.showLogin = true;
                        this.$router.push("/");
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
                //console.log(res.data);

                if (res.data == -1) {
                this.$message.info('用户名或密码错误');
                } else if (res.data == 0) {
                this.$message.info('用户名或密码错误');
                } else {
                this.$message.success('登录成功');
                //存入登录状态标志
                this.$store.commit('login',true);
                //获取用户信息 
                this.getUserMsg();
                
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

                    localStorage.setItem('avater',avater);

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

        // 获取本地用户头像
        localUserMsg() {
            for (var i = localStorage.length-1;i >= 0; i--){
                if (localStorage.key(i) == "avater") {
                    this.avater=localStorage.getItem(localStorage.key(i));
                }
            }
        }

        }
    
    }

</script>

<style scoped>

.body {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 100vh;
    background: url(../assets/img/bg-2.png)repeat;
    background-color: #f1f1f1; 
}

/* .body::after {
    content: '';
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
} */

.logo {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    left: 100px;
    top: 40px;
    width: 220px;
    font-size: 30px;
    color:rgb(116, 113, 113);
}

.logo img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.logo span {
    color: #007bff;
}

/* 登录注册模块盒子 */
#container {
    position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 380px;
    height: 100%;
    background-color:rgba(255, 255, 255, 0.8); 
}

.avatar {
    display: flex;
    justify-content: center;
    margin-top: 100px;
    width: 120px;
    height: 120px;
    overflow: hidden;
    
}

.avatar img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    /* background:url(../assets/img/LOGO.jpg) center no-repeat; */
    background-size: 150%;
    border: 1px solid rgba(116, 114, 114, 0.267);
}

/* 默认input框样式 */
.input {
    outline: none;
  width: 250px;
  height: 40px;
  background-color:#f1f1f1;
  border-radius: 19px;
  border: 0;
  margin: 5px 0;
  padding: 0 14px; 
  box-shadow: 1px 1px 2px #e9e8e8; 
}

.input:hover {
    box-shadow: 1px 1px 2px #dddddd;
}

/* 默认button样式 */
.btn {
    width: 278px;
    background-color:#2f80ec;
    letter-spacing: 10px;
    color: #fff;
    box-shadow: 2px 2px 3px #a5a4a4;
}

.btn:hover{
    background-color:#2f81ecda;
}

.login-box,
.register-box{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: -150px;
    width: 280px;
}

.log-tag,
.reg-tag{
    display: flex;
    justify-content: space-between;
    width: 250px;
    font-size: 14px;
    color: #999;
    cursor:pointer;
}

.reg-tag{
    justify-content: flex-end;
}

/* 图形验证码画布 */
#canvas {
    display: block;
    background-color: #f1f1f1;
    border-radius:5px;
    cursor: pointer;
}

.code-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 270px;
    height: 30px;
    margin: 5px 0;
    padding: 5px;
    z-index: 1;
}

.blue-txt {
    text-decoration: none;
    color: #007bff;
    font-weight: bold;
}

</style>