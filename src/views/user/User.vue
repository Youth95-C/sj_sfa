<template>
  <div id="user">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">个人信息</h5>
    </NavBar>
    <div class="right">修改密码</div>
    <div class="img-wrap">
      <input type="file" @change="uploadImg" accept="image/*" class="input-file" ref="file" />
      <div class="img-box" @click="selectFile">
        <img :src="loginUser.avatar" alt />
      </div>
    </div>
    <div class="staff">
      <span>员工姓名</span>
      <span class="staff-name">{{loginUser.name}}</span>
    </div>
    <div class="phone">
      <span>手机号码</span>
      <span class="phone-number">{{loginUser.phone}}</span>
    </div>
    <div class="department">
      <span>部门</span>
      <span class="department-name">{{loginUser.department}}</span>
    </div>
    <div class="last-login">上次登录时间：{{loginUser.lastLogin}}</div>
    <div class="nav-bottom">
      <div class="relogin" @click="relogin">重新登录</div>
      <div class="logout" @click="logout">注销</div>
    </div>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import service from "../../network/request";
import CanvasResize from "canvas-resize";
import { mapState } from "vuex";
export default {
  name: "User",
  computed: {
    ...mapState(["loginUser"])
  },
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    },
    selectFile() {
      this.$refs.file.click();
    },
    uploadImg(e) {
      console.log(e);
      // console.log(this.$refs.file.files);
      let formData = new FormData();
      //拿到当前上传的图片
      let file = this.$refs.file.files[0];
      //对当前上传的图片file进行压缩后，回调函数callback返回一个base64的字符串
      canvasResize(file, {
        crop: false, // 是否裁剪
        quality: 0.7, // 压缩质量  0 - 1
        rotate: 0, // 旋转角度
        callback: baseStr => {
          //返回的base64字符串
          let fileBlob = Utility.convertBase64UrlToBlob(baseStr, {
            type: file.type
          });
          formData.append("imgF", fileBlob);
          service.getLoadImg(formData).then(res => {
            console.log(res.data);
            this.imgs.push({
              checked: false,
              url: `${process.env.VUE_APP_BASEURL}${res.data.img}`
            });
          });
        }
      });
    },
    logout() {
      //清理sessionStorage、localStorage和vuex
      sessionStorage.clear();
      localStorage.clear();
      this.$store.commit("clearAll");
    },
    relogin() {
      //密码空着要填
      let loginUser = { ...this.loginUser };
      sessionStorage.clear();
      localStorage.clear();
      this.$store.commit("clearAll");
      this.$router.push(`/login?CNO=${loginUser.CNO}&PNO=${loginUser.PNO}`);
    }
  },
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
#user {
  height: 100%;
  padding-top:px2rem(88);
  background-color: #fff;
  .nav-bar {
    width:100%;
    position:fixed;
    top:0;
    background-color: $act-color;
    i {
      font-size: $text-size-imp;
      color: #fff;
    }
    h5 {
      color: #fff;
    }
  }
  .right {
    font-size: $text-size-imp;
    color: #fff;
    position: absolute;
    right: px2rem(20);
    top:px2rem(20);
  }
  .img-wrap {
    width: 100%;
    padding: px2rem(56) 0;
    border-bottom: px2rem(1) solid #ccc;
    .input-file {
      height: 0;
      width: 0;
      position: absolute;
      visibility: hidden;
    }
    .img-box {
      width: px2rem(220);
      height: px2rem(220);
      margin: 0 auto;
      border: px2rem(1) solid #ccc;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: px2rem(220);
        height: px2rem(220);
      }
    }
  }
  .staff {
    width: 100%;
    height: px2rem(110);
    line-height: px2rem(110);
    padding: 0 px2rem(20);
    border-bottom: px2rem(1) solid #ccc;
    font-size: $text-size-mid;
    color: #757575;
    display: flex;
    justify-content: space-between;
    .staff-name {
      color: #000;
    }
  }
  .phone {
    width: 100%;
    height: px2rem(110);
    line-height: px2rem(110);
    padding: 0 px2rem(20);
    border-bottom: px2rem(1) solid #ccc;
    font-size: $text-size-mid;
    color: #757575;
    display: flex;
    justify-content: space-between;
    .phone-name {
      color: #000;
    }
  }
  .department {
    width: 100%;
    height: px2rem(110);
    line-height: px2rem(110);
    padding: 0 px2rem(20);
    border-bottom: px2rem(1) solid #ccc;
    font-size: $text-size-mid;
    color: #757575;
    display: flex;
    justify-content: space-between;
    .department-name {
      color: #000;
    }
  }
  .last-login {
    padding: px2rem(20) px2rem(20);
    background-color: #fafafa;
    border-bottom: px2rem(1) solid #ccc;
    color: #000;
    font-size: $text-size;
  }
  .nav-bottom {
    width: 100%;
    height: px2rem(110);
    line-height: px2rem(110);
    text-align: center;
    display: flex;
    align-items: center;
    border-top: px2rem(1) solid #ccc;
    color: $act-color;
    font-size: $text-size-imp;
    position: fixed;
    bottom: 0;
    .logout {
      width: 50%;
      height: 100%;
      color: #ff5335;
      border-left: px2rem(1) solid #ccc;
    }
    .relogin {
      width: 50%;
      height: 100%;
    }
  }
}
</style>