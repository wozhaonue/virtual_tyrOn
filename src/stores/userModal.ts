import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userModal', () => {
  const userModal = ref(false);
  function setUserModalVisible(value:boolean) {
    userModal.value = value;
  }

  return { userModal, setUserModalVisible }
})
