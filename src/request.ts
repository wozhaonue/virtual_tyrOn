import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "./stores/userModal";
const request = axios.create({
  baseURL: '/api',
  timeout: 100000,
})

let isReloginShowing = false;
// 静态声明一个不用token的api请求方法对应的路径数组
const whitePathArr = ['/user/login','/user/register'];  
request.interceptors.request.use(
  (config) => {
    const PATH = config.url;
    console.log(PATH);
    if(whitePathArr.includes(PATH)){
      console.log('在白名单里');
      return config;
    }else{
      console.log('该请求不在白名单里');
      
      if(localStorage.getItem('auth_token') && localStorage.getItem('user_id')){
      const AUTH_TOKEN = localStorage.getItem('auth_token');
      config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
      return config;
    }else{
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
      if(!isReloginShowing){
        isReloginShowing = true;
        ElMessage({
        message: '请先登录后再进行操作',
        type: 'info',
      })
      }
      useUserStore().setUserModalVisible(true);
      return Promise.reject(new axios.CanceledError('未登录或登录失效')); 
    }
    }
  },
  (error) => {
    console.log(error);
    return error;
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);
    return error;
  }
)

export default request;