import axios from "axios";
//登录完成后的所有请求必须在请求的headers中添加token
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    config.headers.Authorization = `Bearer+${sessionStorage.getItem(
      "LoginToken"
    )}`;
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
export default {
  getUserProgress() {
    return axios.get("/api/getUserProgress");
  },
  getNotices(date, limit, isloadelater) {
    return axios.get("/api/message", {
      params: {
        date,
        limit,
        isloadelater
      }
    });
  },
  getShops(data) {
    return axios.get("/api/auth/shop?_limit=10&_order=asc&_sort=distance",{
      params:{
        Lng:data.lng,
        Lat:data.lat,
        name_like:data.val,
        _page:data.page
      }
    });
  },
  getShopInfo(id){
    return axios.get("/api/auth/shopSales/"+id)
  },
  getLoadImg(formData){
    return axios({
      url:'/api/upload',
      method:'post',
      headers:{
        'Content-Type':"multipart/form-data"
      },
      data:formData
    })
  },
  submitSign(data){
    return axios.post("/api/auth/signIn",{
      params:data
    })
  },
  loadGoods(data){
    return axios.get('/api/auth/goods',{
      params:data
    })
  },
  loadWareHouse(){
    return axios.get('/api/auth/warehouse')
  }
};
