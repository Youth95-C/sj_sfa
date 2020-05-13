<template>
  <div class="progress">
    <div class="label">
      {{val}}
      <span v-if="isShowPercent">%</span>
    </div>
    <div class="pie" ref="pie"></div>
    <h3>{{title}}</h3>
  </div>
</template>

<script>
// 引入 ECharts 主模块
import echarts from "echarts";
// 引入柱状图
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

export default {
  name: "Progress",
  props: {
    title: {
      type: String,
      required: true
    },
    val: {
      type: Number,
      required: true
    },
    isShowPercent: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  mounted() {
    this.initCircle();
  },
  watch: {
    val: function() {
      this.initCircle();
    }
  },
  methods: {
    initCircle() {
      let data = [];
      if (this.isShowPercent) {
        data.push({ value: this.val, name: "" });
        data.push({ value: 100 - this.val, name: "" });
      } else {
        data.push({ value: 0, name: "" });
        data.push({ value: 100, name: "" });
      }
      let myChart = echarts.init(this.$refs.pie);
      myChart.setOption({
        color: ["rgb(102,208,113)", "rgb(223,223,223)"],
        series: [
          {
            name: this.title,
            type: "pie",
            radius: ["95%", "100%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
              textStyle: {
                fontSize: "48",
                fontWeight: "bold"
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.progress {
  position: relative;
  text-align: center;
  color: #000;
  .pie {
    width: px2rem(175);
    height: px2rem(175);
    margin: 0 auto;
  }
  .label {
    width: px2rem(175);
    height: px2rem(175);
    line-height: px2rem(175);
    font-size: px2rem(48);
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    top: 0;
    span {
      font-size: $text-size-mid;
    }
  }
  h3 {
    font-size: $text-size;
    text-align: center;
    margin-top: px2rem(20);
  }
}
</style>