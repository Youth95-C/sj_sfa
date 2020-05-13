import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
    loginUser: sessionStorage.getItem("loginUser")
      ? JSON.parse(sessionStorage.getItem("loginUser"))
      : null,
    shopsList: [],
    //店铺下单
    goodsList: [],
    //当前下订单的店铺
    curOrderShop: {},
    //仓库地址
    warehouse: [],
    //购物车商品
    cart: [],
    checkedAll: true
  },
  getters: {
    getLoginUser(state) {
      return state.loginUser;
    },
    getRemarkByWarehouseId(state) {
      return id => {
        let warehouseId = id;
        let newShop = state.cart.find(
          shop => shop.shopId == state.curOrderShop.id
        );
        let warehouse = newShop.warehouse.find(
          warehouse => warehouse.warehouseId == warehouseId
        );
        return warehouse.remark;
      };
    },
    getCartWarehouse(state) {
      let curCartShop = state.cart.find(
        shop => shop.shopId == state.curOrderShop.id
      );
      return curCartShop.warehouse.filter(
        warehouse => warehouse.checked == true
      );
    },
    getTotalPrice(state) {
      let total = 0;
      let curCartShop = state.cart.find(
        shop => shop.shopId == state.curOrderShop.id
      );
      let curCartWarehouse = curCartShop.warehouse.filter(
        warehouse => warehouse.checked == true
      );
      curCartWarehouse.forEach(warehouse => {
        let curCartGoods = warehouse.goods.filter(
          goods => goods.checked == true
        );
        curCartGoods.forEach(goods => {
          total += goods.count * goods.goodsInfo.monery;
        });
      });
      return total;
    }
  },
  mutations: {
    //注销
    clearAll(state) {
      state = {};
    },
    //清理已经提交的订单的购物车数据
    subOrderClear(state) {
      //获得购物车中当前店铺的index
      let cartShopIndex = state.cart.findIndex(
        shop => shop.shopId == state.curOrderShop.id
      );
      let newShop = { ...state.cart[cartShopIndex] };
      //过滤掉全部checked状态为true的仓库
      newShop.warehouse = newShop.warehouse.filter(
        warehouse => warehouse.checked == false
      );
      //
      newShop.warehouse.forEach(warehouse => {
        warehouse.goods = warehouse.goods.filter(
          goods => goods.checked == false
        );
      });
      state.cart.splice(cartShopIndex, 1, newShop);
    },
    //添加备注
    addRemarkToWarehouse(state, payload) {
      let cartShopIndex = state.cart.findIndex(
        shop => shop.shopId == state.curOrderShop.id
      );
      let newShop = { ...state.cart[cartShopIndex] };
      let warehouse = newShop.warehouse.find(
        warehouse => warehouse.warehouseId == payload.id
      );
      warehouse.remark = payload.remark;
      state.cart.splice(cartShopIndex, 1, newShop);
    },
    //修改购物车全选状态
    changeTotalChecked(state) {
      state.checkedAll = !state.checkedAll;
      let cartShopIndex = state.cart.findIndex(
        shop => shop.shopId == state.curOrderShop.id
      );
      let newShop = { ...state.cart[cartShopIndex] };
      newShop.warehouse.forEach(warehouse => {
        warehouse.checked = state.checkedAll;
        warehouse.goods.forEach(goods => {
          goods.checked = state.checkedAll;
        });
      });
      state.cart.splice(cartShopIndex, 1, newShop);
    },
    //修改仓库的选中状态，包含的商品的选中全部依据它的选中状态变化而变化
    changeGoodsChecked(state, payload) {
      let cartShopIndex = state.cart.findIndex(
        shop => shop.shopId == state.curOrderShop.id
      );
      let newShop = { ...state.cart[cartShopIndex] };
      let newWarehouse = newShop.warehouse.find(
        warehouse => warehouse.warehouseId == payload.warehouseId
      );
      let newGoods = newWarehouse.goods.find(
        goods => goods.goodsInfo.id == payload.goodsId
      );
      newGoods.checked = !newGoods.checked;
      let newGoodsIndex = newWarehouse.goods.findIndex(
        goods => goods.checked !== newGoods.checked
      );
      if (newGoodsIndex == -1) {
        newWarehouse.checked = newGoods.checked;
      }
      let newWarehouseIndex = newShop.warehouse.findIndex(
        warehouse => warehouse.checked !== newGoods.checked
      );
      if (newWarehouseIndex == -1) {
        state.checkedAll = newGoods.checked;
      }
      state.cart.splice(cartShopIndex, 1, newShop);
    },
    ////修改商品的选中状态，如果商品状态全部选中则所在仓库也会是选中状态，反之同理
    changeChecked(state, payload) {
      let cartShopIndex = state.cart.findIndex(
        shop => shop.shopId == state.curOrderShop.id
      );
      let newShop = { ...state.cart[cartShopIndex] };
      let newWarehouse = newShop.warehouse.find(
        warehouse => warehouse.warehouseId == payload.warehouseId
      );
      newWarehouse.checked = !newWarehouse.checked;
      newWarehouse.goods.forEach(goods => {
        goods.checked = newWarehouse.checked;
      });
      let checked = newShop.warehouse.findIndex(
        warehouse => warehouse.checked !== newWarehouse.checked
      );
      if (checked == -1) {
        state.checkedAll = newWarehouse.checked;
      }
      state.cart.splice(cartShopIndex, 1, newShop);
    },

    //改变商品数量
    addGoodsCount(state, payload) {
      //拿到当前要修改的店铺信息
      let cartShopIndex = state.cart.findIndex(
        shop => shop.shopId == state.curOrderShop.id
      );
      let newShop = { ...state.cart[cartShopIndex] };
      let newWarehouse = newShop.warehouse.find(
        warehouse => warehouse.warehouseId == payload.warehouseId
      );
      let newGoods = newWarehouse.goods.find(
        goods => goods.goodsInfo.id == payload.goodsId
      );
      newGoods.count += payload.count;
      if (newGoods.count <= 0) {
        newGoods.count = 1;
      } else if (newGoods.count > newGoods.goodsInfo.number) {
        newGoods.count = newGoods.shopInfo.number;
      }
      state.cart.splice(cartShopIndex, 1, newShop);
    },
    //加入整体到购物车
    addToCart(state, payload) {
      console.log(payload);
      state.cart.push({
        shopId: payload.shopId,
        shopName: state.curOrderShop.name,
        warehouse: [
          {
            remark: "",
            warehouseId: payload.warehouseId,
            warehouseName: payload.warehouseName,
            checked: true,
            goods: [
              {
                goodsInfo: payload.goods,
                count: payload.count,
                checked: true
              }
            ]
          }
        ]
      });
    },
    //添加仓库(包含商品)到购物车
    addWarehouse(state, data) {
      data.curShop.warehouse.push({
        remark: "",
        warehouseId: data.payload.warehouseId,
        warehouseName: data.payload.warehouseName,
        checked: true,
        goods: [
          {
            goodsInfo: data.payload.goods,
            count: data.payload.count,
            checked: true
          }
        ]
      });
    },
    //添加商品到购物车
    addGoods(state, red) {
      red.curWarehouse.goods.push({
        goodsInfo: red.payload.goods,
        count: red.payload.count,
        checked: true
      });
    },
    //
    //购物车商品数量+1
    addCounter(state, cub) {
      cub.curGoods.count += cub.payload.count;
    },
    //仓库地址
    initWarehouse(state, payload) {
      state.warehouse = payload;
    },
    //当前下订单的店铺
    initCurOrderShop(state, payload) {
      state.curOrderShop = payload;
    },
    //当前下订单的店铺商品
    initGoods(state, payload) {
      state.goodsList = payload;
    },
    appendGoods(state, payload) {
      state.goodsList.push(...payload);
    },
    initUser(state, payload) {
      state.loginUser = payload;
    },

    //得到商铺数据(VisitShop)
    initShops(state, payload) {
      state.shopsList = payload;
    },
    appendShops(state, payload) {
      state.shopsList.push(...payload);
    }
  },
  actions: {
    addCart(context, payload) {
      return new Promise((resolve, reject) => {
        //判断当前店铺是否已经在购物车中
        let shopIndex = context.state.cart.findIndex(
          item => item.shopId == payload.shopId
        );
        if (shopIndex < 0) {
          //
          // context.state.cartList.push(payload);
          context.commit("addToCart", payload);
          resolve("添加购物车成功");
          console.log("商铺不存在，添加商铺");
        } else {
          //当前商铺已经存在，添加仓库和商品
          //得到当前店铺
          let curShop = context.state.cart[shopIndex];
          //判断当前要添加的商品所在的仓库是否已经在cart中
          let warehouseIndex = curShop.warehouse.findIndex(
            item => item.warehouseId == payload.warehouseId
          );

          if (warehouseIndex < 0) {
            //当前商铺中没有当前仓库
            let data = {
              curShop: curShop,
              payload: payload
            };
            context.commit("addWarehouse", data);
            console.log("商铺已存在，添加仓库和商品");
            resolve("添加购物车成功");
          } else {
            //当前商铺中有当前仓库
            let curWarehouse = curShop.warehouse[warehouseIndex];
            //判断当前仓库中有没有当前商品
            let goodsIndex = curWarehouse.goods.findIndex(
              item => item.goodsInfo.id == payload.goods.id
            );
            if (goodsIndex < 0) {
              //当前仓库中没有当前商品
              let red = {
                curWarehouse,
                payload
              };
              context.commit("addGoods", red);
              console.log("商铺已存在，仓库已存在，添加商品");
              resolve("添加购物车成功");
            } else {
              //当前仓库已经存在此商品
              let curGoods = curWarehouse.goods[goodsIndex];
              let cub = {
                curGoods,
                payload
              };
              context.commit("addCounter", cub);
              console.log("商铺已存在，仓库已存在，商品已存在，商品数量加");
              resolve("当前的商品数量+1");
            }
          }
        }
      });
    }
  },
  modules: {}
});
