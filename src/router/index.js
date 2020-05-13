import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: () => import("../views/Login")
  },
  {
    path: "/",
    redirect: "/home",
    component: () => import("../views/Index"),
    children: [
      {
        path: "/home",
        component: () => import("../views/home/Home")
      },
      {
        path: "/user",
        component: () => import("../views/user/User")
      },
      {
        path: "/notice",
        component: () => import("../views/notice/Notice")
      },
      {
        path: "/notice/:id",
        component: () => import("../views/noticedetail/NoticeDetail")
      },
      {
        path: "/visitshop",
        component: () => import("../views/visitshop/VisitShop")
      },
      {
        path: "/visitshop/:id",
        component: () => import("../views/shopInfo/ShopInfo")
      },
      {
        path: "/shopsignin/:id",
        component: () => import("../views/signin/SignIn")
      },
      {
        path: "/order/:id",
        component: () => import("../views/order/OrderInfo")
      },
      {
        path: "/selectgoods/:id",
        component: () => import("../views/goodsSelect/GoodsSelect")
      },
      {
        path: "/cart/:id",
        component: () => import("../views/cart/Cart")
      },
      {
        path: "/cartremark/:id",
        component: () => import("../views/remark/Remark")
      },
      {
        path: "/subcart",
        component: () => import("../views/subcart/SubCart")
      },
      {
        path: "/addshop",
        component: () => import("../views/addshop/AddShop")
      }
    ]
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});
router.beforeEach((to, from, next) => {
  //to             将要访问的路径
  //from           从哪个路径跳转而来
  //next           放行
  //next('/login') 强制跳转
  if (to.path === "/login") {
    next();
  } else {
    const tokenStr = window.sessionStorage.getItem("LoginToken");
    if (tokenStr) {
      next();
    } else {
      next("/login");
    }
  }
});
export default router;
