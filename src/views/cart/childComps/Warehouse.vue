<template>
  <div class="warehouse">
    <div class="warehouse-hd">
      <div class="fl">
        <CheckBox class="check-box-wrap" :value="warehouse.checked" @checkedClick="wholeClick" />
        <div>{{warehouse.warehouseName}}</div>
      </div>
      <div class="fr">
        <div class="remark">备注</div>
        <div class="remark-icon" @click="remarkClick(warehouse.warehouseId)">
          <i class="iconfont icon-bianji"></i>
        </div>
      </div>
    </div>
    <div class="warehouse-bd">
      <div class="goods" v-for="goods in warehouse.goods" :key="goods.goodsInfo.id">
        <CheckBox
          class="check-box-wrap"
          :value="goods.checked"
          @checkedClick="goodsCheckedClick(goods.goodsInfo.id)"
        />
        <div class="goods-img">
          <img :src="goods.goodsInfo.img" :alt="goods.goodsInfo.title" />
        </div>
        <div class="goods-info">
          <div class="goods-title">{{goods.goodsInfo.title}}</div>
          <div>选中仓库：{{ warehouse.warehouseName}}</div>
          <div class="goods-total">
            <div class="goods-price">
              <span>价格：</span>
              <span class="price">{{goods.count*goods.goodsInfo.monery}}元</span>
            </div>
            <div class="goods-count">
              <div class="jian" @click="addGoodsCount(-1,goods.goodsInfo.id)">
                <i class="iconfont icon-jian"></i>
              </div>
              <div class="count">
                <input type="number" v-model="goods.count" />
              </div>
              <div class="jia" @click="addGoodsCount(1,goods.goodsInfo.id)">
                <i class="iconfont icon-jia"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckBox from "./CheckBox";

export default {
  name: "Warehouse",
  data() {
    return {};
  },
  computed: {},
  props: {
    warehouse: Object
  },
  methods: {
    addGoodsCount(num, id) {
      //console.log(this.warehouse.warehouseId)
      this.$store.commit("addGoodsCount", {
        goodsId: id,
        count: parseInt(num),
        warehouseId: this.warehouse.warehouseId
      });
    },
    wholeClick() {
      this.$store.commit("changeChecked", {
        warehouseId: this.warehouse.warehouseId
      });
    },
    goodsCheckedClick(id) {
      this.$store.commit("changeGoodsChecked", {
        goodsId: id,
        warehouseId: this.warehouse.warehouseId
      });
    },
    remarkClick(id){
       this.$router.push(`/cartremark/${id}`)
    }
  },
  components: {
    CheckBox
  }
};
</script>

<style lang="scss" scoped>
.warehouse {
  .warehouse-hd {
    padding: px2rem(20) px2rem(20);
    font-size: $text-size-mid;
    background-color: #fafafa;
    border-bottom: px2rem(1) solid #ccc;
    display: flex;
    align-items: center;
    .fl {
      color: #000;
      flex: 1;
      display: flex;
      align-items: center;
      .check-box-wrap {
        margin-right: px2rem(20);
      }
    }
    .fr {
      display: flex;
      align-items: center;
      color: $act-color;
      .remark-icon {
        margin-left: px2rem(10);
        i {
          font-size: px2rem(48);
        }
      }
    }
  }
  .warehouse-bd {
    background-color: #fff;
    .goods {
      display: flex;
      align-items: center;
      padding: px2rem(20) px2rem(20);
      border-bottom: px2rem(1) solid #ccc;
      .check-box-wrap {
        margin-right: px2rem(20);
      }
      .goods-img {
        width: px2rem(124);
        height: px2rem(124);
        border: px2rem(1) solid #ccc;
        margin-right: px2rem(20);
        img {
          width: px2rem(124);
          height: px2rem(124);
        }
      }
      .goods-info {
        flex: 1;
        font-size: $text-size;
        .goods-title {
          color: #000;
          margin-bottom: px2rem(10);
        }
        .goods-total {
          margin-top: px2rem(10);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          .goods-price {
            flex: 1;
            .price {
              color: #ff0000;
              font-size: $text-size-imp;
              margin-left: px2rem(20);
            }
          }
          .goods-count {
            font-size: $text-size-mid;
            color: #000;
            display: flex;
            align-items: center;
            div {
              border: px2rem(1) solid #ccc;
            }
            .jian,
            .jia {
              width: px2rem(54);
              height: px2rem(54);
              line-height: px2rem(54);
              text-align: center;
            }
            .count {
              width: px2rem(100);
              height: px2rem(54);
              margin: 0 px2rem(20);
              text-align: center;
              overflow: hidden;
              input {
                outline: none;
                border: none;
                width: px2rem(70);
                height: px2rem(54);
                font-size: $text-size-mid;
                margin: 0 auto;
              }
            }
          }
        }
      }
    }
  }
}
</style>