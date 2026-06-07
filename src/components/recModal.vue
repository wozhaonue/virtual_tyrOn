<script setup lang="ts">
import { saveBatchClothing } from '@/apis/tryOn'
import { ElMessage } from 'element-plus'
import { ref, toRaw, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  recImageUrl: {
    type: String,
    required: true
  },
  recRealImageUrl: {
    type: String,
    required: true
  },
  recClothData: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
  emit('update:modelValue', false)
}

const formDataList = ref<any[]>([])
watch(() => props.recClothData, (newVal) => {
  if (newVal) {
    formDataList.value = JSON.parse(JSON.stringify(newVal))
  } else {
    formDataList.value = []
  }
}, { immediate: true, deep: true })

// 转换函数
const changeMainType = (mainType: string) => {
  if(mainType === '上衣'){
    return 'top';
  }else if(mainType === '下装'){
    return 'bottom';
  }else if(mainType === '连体装'){
    return 'onepiece';
  }else{
    return 'top';
  }
}

const handleConfirm = async () => {
  let filterFormDataList: { clothes_name: string; main_type: string; color: string; style: string; base_type: string }[] = [];
  formDataList.value.forEach((item,index) => {
    let oneItem = {
      clothes_name: '',
      main_type: '',
      color: '',
      style: '',
      base_type: '',
    };
    oneItem.clothes_name = item.类别中文 ?? '';
    oneItem.main_type = changeMainType(item.衣物大类);
    oneItem.color = item.颜色 ?? '';
    oneItem.style = item.风格 ?? '';
    oneItem.base_type = item.类别中文 ?? '';
    filterFormDataList.push(oneItem);
  })
  const fd = new FormData();
  fd.append('image_path',props.recRealImageUrl);
  fd.append('items_json',JSON.stringify(filterFormDataList));
  try{
    const res = await saveBatchClothing(fd);
    if(res.code === 200){
      ElMessage({
        message: res.msg || '上传衣物成功',
        type: 'success',
      })
      // emit加载衣物
      
    }
  }catch(err){
    console.log(err);
    ElMessage({
      message: err.message || '上传衣物失败',
      type: 'error',
    })
  }finally{
    close();
  }
  // emit('confirm', formDataList.value)
}
</script>

<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="glass-panel rec-modal-container">
      <div class="modal-header">
        <h2 class="font-serif font-bold text-gradient text-2xl">确认衣物信息</h2>
        <button class="close-btn" @click="close">&times;</button>
      </div>
      
      <div class="modal-content flex gap-6">
        <!-- Left: 上传图片展示区域 -->
        <div class="image-section">
          <img v-if="recImageUrl" :src="recImageUrl" alt="识别衣物" class="rec-image rounded-3xl" />
          <div v-else class="placeholder font-sans opacity-80 text-sm">无图片</div>
        </div>
        
        <!-- Right: 表单区域 -->
        <div class="form-section flex flex-col gap-4">
          <div v-for="(item, index) in formDataList" :key="index" class="form-card glass-panel">
            <h3 class="font-sans font-semibold text-sm mb-4">衣物 {{ index + 1 }}</h3>
            
            <div class="form-item mb-4">
              <label class="font-sans text-xs font-semibold opacity-80 mb-2 block uppercase tracking-wider">衣物名称</label>
              <el-input disabled v-model="item.类别中文" placeholder="请输入衣物名称" class="custom-input"></el-input>
            </div>
            
            <div class="form-item mb-4">
              <label class="font-sans text-xs font-semibold opacity-80 mb-2 block uppercase tracking-wider">衣物大类</label>
              <el-select v-model="item.衣物大类" placeholder="请选择类别" class="custom-select w-full">
                <el-option label="上衣" value="上衣"></el-option>
                <el-option label="下装" value="下装"></el-option>
                <el-option label="连体装" value="连体装"></el-option>
              </el-select>
            </div>
            
            <div class="form-item mb-4">
              <label class="font-sans text-xs font-semibold opacity-80 mb-2 block uppercase tracking-wider">颜色</label>
              <el-input v-model="item.颜色" placeholder="请输入颜色" class="custom-input"></el-input>
            </div>
            
            <div class="form-item mb-4">
              <label class="font-sans text-xs font-semibold opacity-80 mb-2 block uppercase tracking-wider">风格</label>
              <el-input v-model="item.风格" placeholder="请输入风格" class="custom-input"></el-input>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer flex justify-center mt-8">
        <button class="btn-accent confirm-btn" @click="handleConfirm">确认上传</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(20, 83, 45, 0.2);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.rec-modal-container {
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.6); /* Slightly more opaque for readability */
  animation: slideUp 0.4s ease-out forwards;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2.5rem;
  line-height: 1;
  color: var(--lumina-surface);
  opacity: 0.5;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0 0.5rem;
}

.close-btn:hover {
  opacity: 1;
  transform: rotate(90deg);
}

.modal-content {
  flex: 1;
  overflow: hidden;
}

.image-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 2.5rem;
  padding: 1rem;
  overflow: hidden;
}

.rec-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  box-shadow: 0 10px 25px -5px rgba(21, 128, 61, 0.1);
}

.form-section {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Custom scrollbar for form area */
.form-section::-webkit-scrollbar {
  width: 6px;
}
.form-section::-webkit-scrollbar-track {
  background: transparent;
}
.form-section::-webkit-scrollbar-thumb {
  background: rgba(21, 128, 61, 0.2);
  border-radius: 9999px;
}

.form-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.confirm-btn {
  padding: 1rem 3rem;
  border-radius: 9999px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  letter-spacing: 0.05em;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Element Plus Input/Select overrides for Glassmorphism */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: rgba(255, 255, 255, 0.6) !important;
  border-radius: 9999px !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  padding: 0.25rem 1rem !important;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select__wrapper.is-focus) {
  border-color: var(--lumina-primary) !important;
  background-color: rgba(255, 255, 255, 0.8) !important;
}

:deep(.el-input__inner) {
  color: var(--lumina-surface) !important;
  font-family: 'Montserrat', sans-serif;
}
</style>
