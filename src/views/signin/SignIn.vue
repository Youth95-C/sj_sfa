<template>
  <div id="signin">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">商铺签到</h5>
      <div slot="right" @click="submitSign" v-if="this.imgs.length>0">
        <i class="iconfont icon-gou"></i>
      </div>
    </NavBar>
    <input type="file" @change="uploadImg" accept="image/*" class="input-file" ref="file" />
    <div class="img-box-wrap">
      <div class="one" @click="takePhoto">
        <img src="../../assets/img/camera.png" alt />
        <div>拍摄照片</div>
      </div>
      <div class="img-box" v-for="item in imgs" :key="item.url" @click="item.checked=!item.checked">
        <div class="check-hover" v-if="item.checked">
          <i class="iconfont icon-gou"></i>
        </div>
        <img :src="item.url" alt />
      </div>
      <div class="last" @click="deleteClick">
        <img src="../../assets/img/minus.png" alt />
        <div>删除照片</div>
      </div>
    </div>
    <div class="history-remark-wrap">
      <div class="history-remark">
        <span>备注：</span>
      </div>
      <textarea placeholder="点击填写备注~" class="history-txt-remark pdl28"></textarea>
    </div>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import service from "../../network/request";
import CanvasResize from "canvas-resize";
import Utility from "../../common/Utility";
import { Toast } from "mint-ui";
export default {
  name: "SignIn",
  data() {
    return {
      imgs: [],
      isShow: false
    };
  },
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    },
    takePhoto() {
      this.$refs.file.click();
    },
    uploadImg(e) {
      console.log(e);
      // console.log(this.$refs.file.files);
      let formData = new FormData();
      //当前上传的图片
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
    deleteClick() {
      this.imgs = this.imgs.filter(item => item.checked === false);
    },
    submitSign() {
      service
        .submitSign({
          id: Date.now(),
          shopId: this.$route.params.id,
          subOn: new Date().toLocaleDateString(),
          imgs: this.imgs.map(item => item.url)
        })
        .then(() => {
          Toast({
            message: "签到成功",
            position: "middle",
            duration: 2000
          });
          this.$router.go(-1);
        })
        .catch(() => {
          Toast({
            message: "签到失败",
            position: "middle",
            duration: 2000
          });
        });
    }
  },
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
#signin {
  height: 100%;
  background-color: #fff;
  .nav-bar {
    background-color: $act-color;
    i {
      font-size: $text-size-imp;
      color: #fff;
    }
    h5 {
      color: #fff;
    }
  }
  .input-file {
    height: 0;
    width: 0;
    position: absolute;
    visibility: hidden;
  }
  .img-box-wrap::after {
    content: "";
    display: block;
    clear: both;
    height: 0;
    visibility: hidden;
  }
  .img-box-wrap {
    padding: px2rem(28) px2rem(28);
    background-color: #fff;
    border-bottom: px2rem(1) solid #ccc;
    .one,
    .last {
      float: left;
      width: px2rem(220);
      height: px2rem(220);
      border: px2rem(1) solid #ccc;
      margin: 0 px2rem(10) px2rem(28) 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img {
        width: px2rem(60);
        margin-bottom: px2rem(10);
      }
      div {
        font-size: $text-size-mid;
      }
    }

    .img-box {
      width: px2rem(220);
      height: px2rem(220);
      border: px2rem(1) solid #ccc;
      margin: 0 px2rem(10) px2rem(28) 0;
      float: left;
      position: relative;
      .check-hover {
        width: px2rem(40);
        height: px2rem(40);
        line-height: px2rem(40);
        text-align: center;
        border-radius: 50%;
        background-color: red;
        position: absolute;
        top: px2rem(-20);
        right: 0;
        i {
          font-size: $text-size-imp;
          color: #fff;
        }
      }
      img {
        height: px2rem(220);
        width: px2rem(220);
      }
    }
    .img-box:nth-child(3n) {
      margin-right: 0;
    }
  }
  .history-remark-wrap {
    .history-remark {
      padding: px2rem(20) px2rem(20);
      font-size: $text-size;
      background-color: #fafafa;
    }
    .history-txt-remark {
      width: 100%;
      height: px2rem(200);
      line-height: $text-size;
      font-size: $text-size;
      background-color: #fff;
      border: none;
      padding: px2rem(20) px2rem(20);
      border-top: px2rem(1) solid #ccc;
      border-bottom: px2rem(1) solid #ccc;
    }
  }
}
</style>