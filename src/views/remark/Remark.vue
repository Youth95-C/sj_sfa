<template>
  <div id="remark">
    <NavBar class="nav-bar">
      <div slot="left" @click="backBtnClick">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <h5 slot="center">{{getShopName}}</h5>
    </NavBar>
    <textarea placeholder="请填写备注信息~" class="remark-txt" v-model="remark" @input="changeRemark"></textarea>
    <span class="word-num">{{`字数(${getRemarkLen}/20)`}}</span>
    <div class="confirm" @click="confirmClick">确定</div>
  </div>
</template>

<script>
import NavBar from "../../components/common/navbar/NavBar";
import { mapState } from "vuex";
import { Toast } from "mint-ui";
export default {
  name: "Remark",
  created() {
    // let warehouseId = this.$route.params.id;
    // let curOrderShop = this.$store.state.curOrderShop;
    // let shopIndex = this.$store.state.cart.find(
    //   shop => shop.shopId == this.$store.curOrderShop.shopId
    // );
    // let newShop={...this.$store.state.cart[shopIndex]}
    // let warehouse=newShop.warehouse(warehouse=>warehouse.warehouseId==warehouseId)
    // this.remark=warehouse.remark
    this.remark = this.$store.getters.getRemarkByWarehouseId(
      this.$route.params.id
    );
  },
  data() {
    return {
      remark: ""
    };
  },

  computed: {
    ...mapState(["curOrderShop"]),
    getShopName() {
      return this.curOrderShop.name;
    },
    getRemarkLen() {
      return this.remark.length;
    }
  },
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    },
    changeRemark(e) {
      let txt = e.target.value;
      if (txt.length > 20) {
        this.remark = txt.slice(0, 20);
      }
    },
    confirmClick() {
      this.$store.commit("addRemarkToWarehouse", {
        id: this.$route.params.id,
        remark: this.remark
      });
      Toast({
        message: "备注更新成功",
        position: "bottom",
        duration: 5000
      });
     this.$router.go(-1);
    }
  },
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
#remark {
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
  .remark-txt {
    height: px2rem(380);
    width: 100%;
    font-size: $text-size-mid;
    line-height: 1.5;
    padding: px2rem(20) px2rem(20);
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom: px2rem(1) solid #ccc;
    outline: none;
    position: relative;
  }
  .word-num {
    position: absolute;
    right: px2rem(20);
    top: px2rem(480);
    font-size: $text-size;
  }
  .confirm {
    height: px2rem(110);
    width: 100%;
    line-height: px2rem(110);
    color: $act-color;
    font-size: $text-size-imp;
    position: fixed;
    bottom: 0;
    text-align: center;
    border-top: px2rem(1) solid #ccc;
  }
}
</style>