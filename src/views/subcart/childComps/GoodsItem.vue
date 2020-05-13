<template>
  <div class="goods-item">
    <div class="goods" v-for="goods in getGoods" :key="goods.goodsInfo.id">
      <div class="goods-img">
        <img :src="goods.goodsInfo.img" :alt="goods.goodsInfo.title" />
      </div>
      <div class="goods-info">
        <div class="goods-title">{{goods.goodsInfo.title}}</div>
        <div>{{ warehouse.warehouseName}}</div>
        <div class="goods-total">
          <div class="goods-price">
            <span>价格：</span>
            <span class="price">{{goods.count*goods.goodsInfo.monery}}元</span>
          </div>
          <div class="goods-count">数量：{{goods.count}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsItem",
  props: {
    warehouse: Object
  },
  computed: {
    getGoods() {
      return this.warehouse.goods.filter(goods => goods.checked == true);
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-item {
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
        font-size: $text-size;
        color:#000;
        margin-top: px2rem(20);
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
      }
    }
  }
}
</style>