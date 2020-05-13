<template>
  <div id="notice">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui1"></i>
      </div>
      <h5 slot="center">公司通告</h5>
    </NavBar>
    <div class="notice-list">
      <Loadmore
        ref="loadmore"
        :top-method="loadTop"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        :auto-fill="false"
      >
        <ul>
          <li
            class="noticeInfo"
            v-for="(item,index) in noticeList"
            :key="index"
            @click="$router.push(`/notice/${item.id}`)"
          >
            <div class="point-wrap">
              <div class="point" :class="{readed:item.isRead}"></div>
            </div>
            <div class="notice-main">
              <p>{{item.title}}</p>
              <span>{{item.SubDate | dateFormat}}</span>
            </div>
            <i class="iconfont icon-gengduo"></i>
          </li>
        </ul>
      </Loadmore>
    </div>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import service from "../../network/request";
import { Loadmore } from "mint-ui";
export default {
  name: "Notice",
  data() {
    return {
      noticeList: [],
      //是否全部加载完成
      allLoaded: false,
      //加载数据的开始日期
      startDate: null,
      //加载数据的结束日期
      endDate: null
    };
  },
  created() {
    this.startDate = Date.now();
    console.log(Date.now());
    service.getNotices(Date.now(), 10, true).then(res => {
      console.log(res.data);
      this.noticeList.push(...res.data.data.messages);
      this.endDate = this.noticeList[this.noticeList.length - 1].SubDate;
    });
  },
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    },
    loadTop() {
      //加载更多数据
      //不需要加载对于date的之前的数据，相反是加载之后的
      service.getNotices(this.startDate, 10, false).then(res => {
        this.noticeList.unshift(...res.data.data.messages);
        this.startDate = this.noticeList[0].SubDate;
        this.endDate = this.noticeList[this.noticeList.length - 1].SubDate;
      });
      //加载完成后，必须重新计算列表的高度
      this.$refs.loadmore.onTopLoaded();
    },
    loadBottom() {
      service.getNotices(this.endDate, 10, true).then(res => {
        //判断有没有数据了
        if (res.data.messages.length == 0) {
          this.allLoaded = true;
          return;
        }
        this.noticeList.push(...res.data.data.messages);
        this.startDate = this.noticeList[0].SubDate;
        this.endDate = this.noticeList[this.noticeList.length - 1].SubDate;
      });
      //加载更多数据
      this.allLoaded = true; // 若数据已全部获取完毕
      //加载完成后，必须重新计算列表的高度
      this.$refs.loadmore.onBottomLoaded();
    }
  },
  filters: {
    dateFormat(val) {
      let date = new Date(val);
      return `${date.getFullYear()}年 ${date.getMonth() +
        1}月 ${date.getDate()}日`;
    }
  },
  components: {
    NavBar,

    Loadmore
  }
};
</script>

<style lang="scss" scoped>
#notice {
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
  .notice-list {
    .noticeInfo {
      padding: px2rem(32) px2rem(20);
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      .point-wrap {
        width: 10%;
        height: px2rem(70);
        .point {
          width: px2rem(15);
          height: px2rem(15);
          border-radius: 50%;
          background-color: red;
          margin: 0 auto;
        }
        .readed{
            background-color:#ccc;
        }
      }
      .notice-main {
        flex: 1;
        p {
          font-size: $text-size-mid;
          color: #000;
          margin-right: px2rem(30);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        span {
          font-size: px2rem(22);
        }
      }
      i {
        font-size: $text-size-mid;
      }
    }
  }
}
</style>