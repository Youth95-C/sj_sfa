import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import "./assets/hotcss/hotcss";
import "./assets/iconfont/iconfont.css";

import VeeValidate, { Validator } from "vee-validate";
import zh from "vee-validate/dist/locale/zh_CN";
Validator.addLocale(zh);
Vue.use(VeeValidate, {
  locale: "zh_CN"
});

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
