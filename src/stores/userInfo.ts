import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserInfo } from "@/apis/user";
import { ElMessage } from "element-plus";

export const useUserInfoStore = defineStore('userInfo',() => {
  interface userInfoInter {
    user_id: string;
    nickname: string;
    phone: string | null;
    register_time: string;
    role: string;
    gender: string | null;
    avatar_url: string | null;
    personal_image_url: string | null;
  }
  const userInfo = ref<userInfoInter | null>();
  async function fetchUserInfo() {
    try{
      const data = await getUserInfo();
      if(data.code === 200){
        userInfo.value = data.data;
      }
    }catch(err){
      ElMessage({
        message: err.message,
        type: 'info',
      })
      userInfo.value = undefined;
    }
  }
  function clearUserInfo(){
    userInfo.value = null;
  }
  return {userInfo, fetchUserInfo, clearUserInfo};
})