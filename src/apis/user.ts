import request from "@/request";

export const registerUser = (data) => {
  return request.post('/user/register',data);
}
export const loginUser = (data) => {
  return request.post('/user/login',data);
}
export const getUserInfo = () => {
  return request.get('/user/get-profile');
}