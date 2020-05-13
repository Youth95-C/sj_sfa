<template>
  <div id="login">
    <h1>欢迎登录保洁SFA系统</h1>
    <div class="top-hat"></div>
    <!--登录信息-->
    <div class="login-box">
      <!--logo-->
      <div class="logo-box">
        <img src="../assets/logo.jpg" alt />
      </div>
      <!--公司编码-->
      <div class="input-wrap">
        <div class="input-group" :class="{active:actIndex===1,acterror:errors.has('cpo')}">
          <label for="cm-code">公司编码：</label>
          <input
            @focus="actIndex=1"
            type="number"
            id="cm-code"
            v-model="cmCode"
            data-vv-name="cpo"
            v-validate="'required|min:4|max:6'"
          />
        </div>
        <div class="error">{{errors.first('cpo')}}</div>
      </div>

      <!--员工编号-->
      <div class="input-wrap">
        <div class="input-group" :class="{active:actIndex===2,acterror:errors.has('pno')}">
          <label for="PNO">员工编号：</label>
          <input
            @focus="actIndex=2"
            type="number"
            id="PNO"
            v-model="PNO"
            data-vv-name="pno"
            v-validate="'required|min:4|max:12'"
          />
        </div>
        <div class="error">{{errors.first('pno')}}</div>
      </div>
      <!--登录密码-->
      <div class="input-wrap">
        <div class="input-group" :class="{active:actIndex===3,acterror:errors.has('pwd')}">
          <label for="password">登录密码：</label>
          <input
            @focus="actIndex=3"
            type="password"
            id="password"
            v-model="password"
            data-vv-name="pwd"
            v-validate="'required|min:4|max:12'"
          />
        </div>
        <div class="error">{{errors.first('pwd')}}</div>
      </div>
      <!--单选项-->
      <div class="ckbox-wrap">
        <div @click="remembSet" :class="{active:rememb}">
          <i class="iconfont icon-check-square" v-if="rememb"></i>
          <i class="iconfont icon-border" v-else></i>
          <span>保存密码</span>
        </div>
        <div @click="autoLoginSet" :class="{active:autoLogin}">
          <i class="iconfont icon-check-square" v-if="autoLogin"></i>
          <i class="iconfont icon-border" v-else></i>
          <span>自动登录</span>
        </div>
      </div>
    </div>
    <!--登录按钮-->
    <button class="login-btn" @click="loginBtnClick">登录</button>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import {mapMutations} from "vuex"
const validate = {
  custom: {
    cpo: {
      required: () => "公司编码不得为空", //写法1
      min: () => "公司编码不得小于4个字符", //写法2
      max: () => "公司编码不得大于6个字符"
    },
    pno: {
      required: () => "员工编号不得为空", //写法1
      min: () => "公司编码不得小于4个字符", //写法2
      max: () => "公司编码不得大于12个字符"
    },
    pwd: {
      required: () => "密码不得为空", //写法1
      min: () => "密码不得小于4个字符", //写法2
      max: () => "密码不得大于12个字符"
    }
  }
};
export default {
  name: "Login",
  data() {
    return {
      actIndex: 1,
      cmCode: "",
      PNO: "",
      password: "",
      rememb: false,
      autoLogin: false
    };
  },
  mounted() {
    this.$validator.localize("zh_CN", validate);
    //JSON.parse() 方法用于将一个 JSON 字符串转换为对象
    let data = JSON.parse(localStorage.getItem("login-data"));
    if (data) {
      this.cmCode = data.cmCode;
      this.PNO = data.PNO;
      this.password = data.password;
      this.autoLogin = data.autoLogin;
      this.rememb = data.rememb;
      if (this.autoLogin) {
        this.loginBtnClick(); //自动登录
      }else{
        this.PNO=this.$route.query.PNO
        this.cmCode=this.$route.query.CNO
      }
    }
  },
  methods: {
    ...mapMutations( ["initUser"] ),
    remembSet() {
      this.rememb = !this.rememb;
      this.autoLogin = false;
    },
    autoLoginSet() {
      //设置当前的autoLogin为true
      this.autoLogin = !this.autoLogin;
      //设置rememb的值也是为true
      this.rememb = true;
    },
    loginBtnClick() {
      this.$validator.validate().then(valid => {
        if (true === valid) {
          // 添加请求拦截器
          this.$axios.interceptors.request.use(
            function(config) {
              // 在发送请求之前做些什么
              Indicator.open();
              return config;
            },
            function(error) {
              // 对请求错误做些什么
              return Promise.reject(error);
            }
          );
          this.$axios
            .post("http://localhost:8889/api/userlogin", {
              CNO: this.cmCode,
              PNO: this.PNO,
              Passwd: this.password
            })
            .then(res => {
              setTimeout(() => {
                Indicator.close();
              }, 500);
              console.log(res.data);
              if (res.data.code == 1) {
                //登录成功
                this.$router.push("/home");
                //记住用户密码，localStorage里长期保存，页面载成功后把数据给到就可实现记住密码或者自动登录
                localStorage.setItem(
                  "login-data",
                  JSON.stringify({
                    rememb: this.rememb,
                    aytologin: this.autoLogin,
                    PNO: this.rememb ? this.PNO : "",
                    cmCode: this.rememb ? this.cmCode : "",
                    password: this.rememb ? this.password : ""
                  })
                );
                //把当前登录的用户信息放到sesstionStoreage里
                sessionStorage.setItem("loginUser",JSON.stringify(res.data.user))
                sessionStorage.setItem("LoginToken",res.data.token)
                //把当前的登录的用户信息放在vuex中，但是页面一刷新数据就没有了
                // this.$store.commit("initUser",res.data.user)
                this.initUser(res.data.user)
              } else {
                //登录失败
                Toast({
                  message: "编码或者密码不正确",
                  duration: 5000
                });
              }
            })
            .catch(() => {
              setTimeout(() => {
                Indicator.close();
              }, 1000);
              console.log("登录失败");
              Toast({
                message: "登录异常",
                duration: 5000
              });
            });
        } else {
          console.log(this.$validator.errors.all());
          return;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#login {
  background-color: #2ade69;
  height: 100%;
  h1 {
    height: px2rem(148);
    line-height: px2rem(148);
    font-size: px2rem(36);
    text-align: center;
    color: #fff;
  }
  .top-hat {
    width: px2rem(537);
    height: px2rem(18);
    background-color: #eee;
    margin: 0 auto;
    border-radius: px2rem(18) px2rem(18) 0 0;
  }
  .login-box {
    width: px2rem(600);
    padding-bottom: px2rem(40);
    margin: 0 auto;
    background-color: #fff;
    border-radius: px2rem(20);
    display: flex;
    flex-direction: column;
    align-items: center;
    .logo-box {
      height: px2rem(350);
      text-align: center;
      padding: px2rem(80) 0;
      img {
        width: px2rem(190);
        height: px2rem(190);
      }
    }
    .input-wrap {
      margin-bottom: px2rem(20);
      .input-group {
        width: px2rem(510);
        border: 2px solid #e2e2e2;
        border-radius: px2rem(20);
        font-size: $text-size-mid;
        line-height: px2rem(90);
        color: $text-color;
        padding: 0 px2rem(20);

        input {
          border: none;
          outline: none;
          font-size: $text-size-mid;
          line-height: px2rem(90);
          width: px2rem(300);
        }
      }
      .input-group.active {
        color: $act-color;
        border: 2px solid $act-color;
      }
      .input-group.acterror {
        border: 2px solid red;
        color: red;
      }
      .error {
        font-size: px2rem(24);
        color: red;
      }
    }

    .ckbox-wrap {
      width: 75%;
      display: flex;
      div {
        flex: 1;
        text-align: center;
        font-size: $text-size-mid;
        color: $text-color;
        i {
          position: relative;
          top: px2rem(5);
          font-size: $text-size-imp;
          margin-right: px2rem(10);
        }
      }
      div.active {
        color: $act-color;
      }
    }
  }
  .login-btn {
    width: px2rem(600);
    height: px2rem(100);
    background-color: #fff;
    border: none;
    font-size: $text-size-imp;
    letter-spacing: px2rem(10);
    color: $act-color;
    border-radius: px2rem(20);
    display: block;
    margin: px2rem(20) auto 0;
  }
}
</style>