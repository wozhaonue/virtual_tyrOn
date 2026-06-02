import axios from "axios";

const request = axios.create({
  baseURL: 'http://127.0.0.1:8080/api',
  timeout: 10000,
})

request.interceptors.request.use(
  (config) => {
    return config;
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