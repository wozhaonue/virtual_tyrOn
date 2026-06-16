<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import {
  MagicStick,
  Loading,
  UploadFilled,
  ArrowRight,
  ArrowLeft,
  Sunny,
  Pouring,
  Cloudy,
  Female,
  Male,
  Location,
  Star,
  Ship,
  Close,
  Check
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { combineTryOnWithAI, deleteCloth, getRecGen, getRecPersonal, getWardrobe, getWeather, postClothRec, postClothUpload, singleTryOnWithAI, tryOnWithOnlineAI } from '@/apis/tryOn';
import { getUserInfo } from '@/apis/user';
import recModal from '@/components/recModal.vue';
import axios from 'axios';

interface weatherDataInter {
  city: string | null;
  temp: string | null;
  feels_like: string | null;
  text: string | null;
  humidity: string | null;
  wind_scale: string | null;
}
const weatherData = ref<weatherDataInter>({
  city: '',
  temp: '',
  feels_like: '',
  text: '',
  humidity: '',
  wind_scale: '',
})
const gender = ref<string>('未设置');
interface recommendGenInter {
  top: string  | null;
  bottom: string | null;
  onepiece: string | null;
  description: string | null;
}
interface recommendPerInter {
  rank: number;
  name: string;
  score: number;
  reason: string;
}
const recommendGen = ref<recommendGenInter>({
  top: '',
  bottom: '',
  onepiece: '',
  description: '',
})
const recommendPer = ref<recommendPerInter[]>([]);
const wardrobeData = ref({});
// 获取天气
const fetchWeather = async () => {
  try{
    const res = await getWeather();
    weatherData.value = res;
  }catch(err){
    if (axios.isCancel(err)) {
    console.log('请求已被拦截器取消:', err.message);
    return; // 终止后续操作，不弹错误提示
  }
    console.log(err);
    ElMessage({
      message: err.message || '获取天气失败',
      type: 'error',
    })
  }
}
// 获取推荐
const fetchRecommendation = async (userGender: string) => {
  try{
    const [genRes,PerRes] = await Promise.allSettled([getRecGen(userGender),getRecPersonal(userGender)]);
    if(genRes.status === 'fulfilled' && genRes.value.code === 200){
      recommendGen.value = genRes.value.recommendation;
    }else{
      console.error(genRes.reason || '获取推荐失败');
    }
    if(PerRes.status === 'fulfilled' && PerRes.value.code === 200){
      recommendPer.value = PerRes.value.top3_recommendations;
    }else{
      console.error(PerRes.reason || '获取推荐失败');
    }
    console.log(PerRes);
  }catch(err){
    if (axios.isCancel(err)) {
    console.log('请求已被拦截器取消:', err.message);
    return; // 终止后续操作，不弹错误提示
  }
    console.log(err);
    ElMessage({
      message: err.message || "获取推荐异常",
      type: 'error',
    })
  }
} 
// 获取个人信息 -- 成功调用链路中获取默认推荐和个人推荐
const fetchUserInfo = async () => {
  try{
    const res = await getUserInfo();
    if(res.code === 200){
      const data = res.data;
      gender.value = data.gender;
      fetchRecommendation(gender.value);
    }else{
      ElMessage({
        message: '获取个人信息失败',
        type: 'info',
      })
    }
  }catch(err){
    if (axios.isCancel(err)) {
    console.log('请求已被拦截器取消:', err.message);
    return; // 终止后续操作，不弹错误提示
  }
    console.log(err);
    ElMessage({
        message: '获取个人特征信息失败',
        type: 'error',
      })
  }
}
onMounted(async () => {
  // 通过封装各自的函数实现并发请求
  fetchWeather();
  fetchUserInfo();
  loadWardrobe();
})
const loadWardrobe = async() => {
  try{
    const res = await getWardrobe();
    if(res.code === 200){
      const data = res.data;
      if(Object.values(data).some(a => a.length > 0)){
        // 放置数据
        wardrobeData.value = data;
      }else{
        ElMessage({
          message: '衣橱数据为空',
          type: 'info',
        })
      }
    }else{
      ElMessage({
        message: res.msg || '衣橱数据加载异常',
        type: 'info',
      })
    }
  }catch(err){
    if (axios.isCancel(err)) {
    console.log('请求已被拦截器取消:', err.message);
    return; // 终止后续操作，不弹错误提示
  }
    console.log(err);
    ElMessage({
      message: err.message || '衣橱数据加载异常',
      type: 'error',
    })
  }
}

// 中心试穿镜数据
const isTryingOn = ref(false);
const resultImg_url = ref('');
const startTryOn = async () => {
  const canTryOn = selectedTop.value || selectedBottom.value || selectedOnePiece.value;
  if(!canTryOn){
    ElMessage({
      message: '请选择衣物',
      type: 'info',
    })
    return;
  }
  if(!personPhotoFile.value){
    ElMessage({
      message: '请先上传全身照',
      type: 'info',
    })
    return;
  }
  // 判断mode为什么
  const mode = Boolean(selectedOnePiece.value) ? 'onepiece' : (Boolean(selectedTop.value) && Boolean(selectedBottom.value)) ? 'combination' : Boolean(selectedTop.value) ? 'top' : 'bottom';
  isTryingOn.value = true;
  try{
    const fd = new FormData();
    if(useAIMode.value){
      // 启用云端试穿API
      if(mode==='combination'){
        fd.append('top_id',selectedTop.value.id);
        fd.append('bottom_id',selectedBottom.value.id)
      }else if(mode === 'onepiece'){
        fd.append('onepiece_id',selectedOnePiece.value.id);
      }else{
        const cid = mode === 'top' ? selectedTop.value.id : selectedBottom.value.id;
        fd.append(`${mode}_id`,cid);
      }
      fd.append('mode',mode);
      fd.append('file',personPhotoFile.value);
      const res = await tryOnWithOnlineAI(fd);
      if(res.code === 200){
        ElMessage.success('云端试穿成功');
        resultImg_url.value = res.result_image || res.data.result_image;
      }else{
        ElMessage.info(res.msg || '云端试穿异常');
      }
    }else{
      // 启用本地试穿模型对应的api
      if(mode === 'combination'){
        fd.append('top_id',selectedTop.value.id);
        fd.append('bottom_id',selectedBottom.value.id);
        fd.append('file',personPhotoFile.value);
        const res = await combineTryOnWithAI(fd);
        if(res.code === 200){
        ElMessage.success('组合试穿成功');
        resultImg_url.value = res.result_image || res.data.result_image;
      }else{
        ElMessage.info(res.msg || '组合试穿异常');
      }
      }else{
        console.log(mode);
        const cid = selectedTop.value?.id || selectedBottom.value?.id || selectedOnePiece.value?.id;
        console.log(cid);
        fd.append(`${mode}_id`,cid);
        fd.append('file',personPhotoFile.value);
        const res = await singleTryOnWithAI(mode,fd);
        if(res.code === 200){
        ElMessage.success('单品试穿成功');
        resultImg_url.value = res.result_image || res.data.result_image;
      }else{
        ElMessage.info(res.msg || '单品试穿异常');
      }
      }
    }
  }catch(err){
    if (axios.isCancel(err)) {
    console.log('请求已被拦截器取消:', err.message);
    return; // 终止后续操作，不弹错误提示
  }
    console.log(err);
    ElMessage.error(err.message || '试穿异常');
  }finally{
    isTryingOn.value = false
  }
}

// 左边衣橱数据
const isWardrobeOpen = ref(true);
const categories = ['全部', '上装', '下装', '连体装']
const activeCategory = ref('全部')
const isRecognizing = ref(false)
const isRecommendOpen = ref(true);
// 选择的衣物
const selectedTop = ref<any>(null)
const selectedBottom = ref<any>(null)
const selectedOnePiece = ref<any>(null)

const filteredClothes = computed(() => {
  const data = wardrobeData.value as any;
  if (!data || Object.keys(data).length === 0) return [];
  if (activeCategory.value === '全部') {
    return [
      ...(data['上装'] || []),
      ...(data['下装'] || []),
      ...(data['连体装'] || [])
    ];
  }
  return data[activeCategory.value] || [];
})

const handleSelectCloth = (cloth: any) => {
  const type = cloth.main_type_cn;
  if (type === '上装') {
    selectedOnePiece.value = null;
    selectedTop.value = selectedTop.value?.id === cloth.id ? null : cloth;
  } else if (type === '下装') {
    selectedOnePiece.value = null;
    selectedBottom.value = selectedBottom.value?.id === cloth.id ? null : cloth;
  } else if (type === '连体装') {
    selectedTop.value = null;
    selectedBottom.value = null;
    selectedOnePiece.value = selectedOnePiece.value?.id === cloth.id ? null : cloth;
  }
}

const isSelected = (cloth: any) => {
  return selectedTop.value?.id === cloth.id || 
         selectedBottom.value?.id === cloth.id || 
         selectedOnePiece.value?.id === cloth.id;
}

const handleDeleteCloth = (cloth: any, event: Event) => {
  event.stopPropagation();
  ElMessageBox.confirm('确定要删除这件衣服吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const type = cloth.main_type_cn;
    if ((wardrobeData.value as any)[type]) {
      (wardrobeData.value as any)[type] = (wardrobeData.value as any)[type].filter((item: any) => item.id !== cloth.id);
    }
    if (selectedTop.value?.id === cloth.id) selectedTop.value = null;
    if (selectedBottom.value?.id === cloth.id) selectedBottom.value = null;
    if (selectedOnePiece.value?.id === cloth.id) selectedOnePiece.value = null;
    const res = await deleteCloth(String(cloth.id));
    console.log(cloth.id);
    if(res.code === 200){
      ElMessage.success('删除成功');
    }else{
      ElMessage.info('云端删除失败');
    }
  }).catch((err) => {
    if (axios.isCancel(err)) {
    console.log('请求已被拦截器取消:', err.message);
    return; // 终止后续操作，不弹错误提示
  }
    console.log(err);
    ElMessage.error(err.message || '云端删除失败');
  }).finally(() => {
    loadWardrobe();
  });
}


// 识别出来的照片数据
const recClothData = ref([])
const recImageUrl = ref('');
const showRecModal = ref(false);
const recRealImageUrl = ref('');

// 处理衣物识别函数
const handleImageUpload = async (file: any) => {
  isRecognizing.value = true;
  // 判断用户上传文件是否符合要求
  const isImage = ['image/jpeg','image/png'].includes(file.file.type);
  if(!isImage){
    ElMessage.error('上传文件需为jpg,png图片格式');
    return;
  }
  const isCheckSize = file.file.size / 1024 / 1024 < 10;
  if(!isCheckSize){
    ElMessage.error('上传文件不可超过10MB');
    return;
  }
  const fileData = new FormData();
  fileData.append('file',file.file);
  const reader = new FileReader();
  reader.onload = ev => {
    recImageUrl.value = ev.target?.result;
  }
  reader.readAsDataURL(file.file);
  try{
    const upRes = await postClothUpload(fileData);
    if(upRes.code !== 200){
      ElMessage.info('上传失败');
      isRecognizing.value = false;
      return;
    }
    const lookFileData = new FormData();
    recRealImageUrl.value = upRes.image_path;
    lookFileData.append('image_path',upRes.image_path);
    const lookRes = await postClothRec(lookFileData);
    if(lookRes.code === 200){
      recClothData.value = lookRes.data;
      console.log(recClothData.value);
      if(lookRes.data.length > 0){
        ElMessage({
        message: lookRes.msg || '识别成功',
        type: 'success',
      })
      showRecModal.value = true;
      }else{
        ElMessage.info('该图片无法识别');
      }   
    }else{
      ElMessage({
        message: lookRes.msg || '识别失败',
        type: 'info',
      })
    }
  }catch(err){
    if (axios.isCancel(err)) {
    console.log('请求已被拦截器取消:', err.message);
    return; // 终止后续操作，不弹错误提示
  }
    console.log(err);
    ElMessage({
      message: err.message || '识别失败',
      type: 'error',
    })
  }finally{
    isRecognizing.value = false;
  }
  
}

// 模特照片上传
const personPhotoFile = ref<any>(null);
const personPhotoUrl = ref<string>('');
const handlePersonPhotoChange = (uploadFile: any) => {
  const file = uploadFile.raw;
  if (!file) return;
  const isImage = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'].includes(file.type);
  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG/BMP/WebP 格式的图片!');
    return;
  }
  personPhotoFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    personPhotoUrl.value = e.target?.result as string;
    if(resultImg_url.value){
      ElMessage.info("回看历史试穿请前往历史试穿页");
      resultImg_url.value = '';
    }
    
  };
  reader.readAsDataURL(file);
}

// AI 引擎开关
const useAIMode = ref(true);

</script>

<template>
  <div class="tryOn-home">
    <!-- 导航展示品牌 -->
    <!-- <div class="top-nav glass-nav">
      <span class="font-serif font-bold text-gradient text-2xl">Lumina Try-On</span>
      <div class="nav-divider"></div>
      <span class="font-sans opacity-80 text-sm">AI 虚拟试穿体验</span>
    </div> -->

    <!-- 中心区域试装镜 -->
    <div class="center-area flex flex-col items-center">
      <div class="model-container glass-panel">
        
        <div class="model-images-container flex gap-4 mt-2">
          <!-- 左侧：原图上传 -->
          <div class="model-image-wrapper">
            <el-upload
              class="model-upload"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              accept=".jpg,.jpeg,.png,.bmp,.webp"
              :on-change="handlePersonPhotoChange"
            >
              <div v-if="personPhotoUrl" class="uploaded-model" :style="{ backgroundImage: `url(${personPhotoUrl})`, backgroundSize: 'contain'}"></div>
              <div class="model-placeholder" :class="{ 'hover-overlay': personPhotoUrl }">
                <el-icon v-if="gender === 'female'" class="placeholder-icon"><Female /></el-icon>
                <el-icon v-else-if="gender === 'male'" class="placeholder-icon"><Male /></el-icon>
                <el-icon v-else class="placeholder-icon"><Female /></el-icon>
                <span class="font-sans text-sm font-semibold">{{ personPhotoUrl ? '重新上传全身照' : '上传模特全身照' }}</span>
              </div>
            </el-upload>
          </div>

          <!-- 右侧：试穿结果 -->
          <div class="model-image-wrapper">
            <div v-if="resultImg_url" class="uploaded-model" :style="{ backgroundImage: `url(${resultImg_url})`, backgroundSize: 'contain'}"></div>
            <div v-else class="model-placeholder result-placeholder">
              <el-icon class="placeholder-icon"><MagicStick /></el-icon>
              <span class="font-sans text-sm font-semibold opacity-80">试穿效果展示</span>
            </div>
            
            <div v-if="isTryingOn" class="tryon-overlay">
              <div class="scanning-line"></div>
              <div class="glass-tag loading-tag">
                <el-icon class="is-loading loading-icon"><Loading /></el-icon>
                <span class="font-sans font-semibold tracking-wider text-xs mt-2">AI 生成中...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="width: 70%;" class="tryon-options glass-panel flex items-center justify-between px-6 py-3 max-w-[240px] rounded-full mt-4 mb-2">
        <span class="font-sans font-semibold text-sm text-primary">使用在线 AI 引擎</span>
        <el-switch v-model="useAIMode" active-color="#15803D" />
      </div>

      <button @click="startTryOn" :disabled="isTryingOn" class="btn-accent tryon-btn">
        <el-icon><MagicStick /></el-icon>
        {{ isTryingOn ? useAIMode ? '云端试穿中，约需30秒' : '试穿中' : '一键虚拟试穿'}}
      </button>
    </div>

    <!-- 左部衣橱 -->
    <div class="left-wardrobe" :class="{ 'is-open': isWardrobeOpen }">
      <div class="wardrobe-panel glass-panel">
      <!-- 头部标题展示 -->
        <div class="panel-header flex items-center gap-4">
          <div class="icon-circle primary">
            <el-icon><Star /></el-icon>
          </div>
          <h2 class="font-serif font-bold text-gradient text-2xl">我的衣橱</h2>
        </div>
        
        <div class="categories flex gap-2">
          <button 
            v-for="cat in categories" 
            :key="cat" 
            class="glass-tag category-btn" 
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
        
        <div class="clothes-grid">
          <div 
            v-for="cloth in filteredClothes" 
            :key="cloth.id" 
            class="clothing-item glass-panel"
            :class="{ 'is-selected': isSelected(cloth) }"
            @click="handleSelectCloth(cloth)"
          >
            <div class="delete-btn" @click="handleDeleteCloth(cloth, $event)">
              <el-icon><Close /></el-icon>
            </div>
            <div class="clothing-img-placeholder" :style="cloth.image_url ? { backgroundImage: `url(${cloth.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}">
              <el-icon v-if="!cloth.image_url"><Male /></el-icon>
            </div>
            <p class="font-sans font-semibold text-xs text-center truncate w-full" :title="cloth.clothes_name">{{ cloth.clothes_name }}</p>
          </div>
        </div>
        <!-- 智能识别 -->
        <div class="recognition-area glass-panel">
          <h3 class="font-sans font-semibold text-sm flex items-center gap-2">
            <el-icon><UploadFilled /></el-icon> 智能衣物识别
          </h3>
          <el-upload
            class="upload-demo"
            drag
            action="#"
            :auto-upload="true"
            :http-request="handleImageUpload"
            :show-file-list="false"
          >
            <div class="upload-content flex flex-col items-center">
              <el-icon class="upload-icon" :class="{'is-loading': isRecognizing}">
                <Loading v-if="isRecognizing" />
                <UploadFilled v-else />
              </el-icon>
              <div class="font-sans text-xs opacity-80 mt-2">
                {{ isRecognizing ? '正在识别中...' : '拖拽图片或点击上传' }}
              </div>
            </div>
          </el-upload>
        </div>
        
      </div>
      
      <div class="toggle-btn glass-panel" @click="isWardrobeOpen = !isWardrobeOpen">
        <div class="toggle-indicator"></div>
        <el-icon><ArrowRight v-if="!isWardrobeOpen" /><ArrowLeft v-else /></el-icon>
      </div>
    </div>

    <!-- 右部推荐 -->
    <div class="right-recommendations" :class="{ 'is-open': isRecommendOpen }">
      <div class="hover-trigger glass-panel" @click="isRecommendOpen = !isRecommendOpen">
        <div class="toggle-indicator"></div>
        <el-icon><ArrowLeft v-if="!isRecommendOpen" /><ArrowRight v-else /></el-icon>
      </div>
      <div class="recommendation-panel glass-panel">
        <h2 class="font-serif font-bold text-gradient text-2xl">穿搭指南</h2>
        
        <div class="weather-gender glass-panel flex justify-between items-center">
          <div class="weather flex items-center gap-4">
            <div class="icon-circle orange">
              <el-icon v-if="weatherData.text && weatherData.text.includes('晴')"><Sunny /></el-icon>
              <el-icon v-else-if="weatherData.text && weatherData.text.includes('云')"><Cloudy /></el-icon>
              <el-icon v-else-if="weatherData.text && weatherData.text.includes('雨')"><Pouring /></el-icon>
              <el-icon v-else><Ship/></el-icon>
            </div>
            <div class="weather-info flex flex-col">
              <span class="font-sans font-bold text-lg">{{weatherData.temp}}°C</span>
              <span class="font-sans text-xs opacity-80 font-semibold">{{weatherData.text}} | 体感温度：{{ weatherData.feels_like }}°C</span>
            </div>
          </div>
          <div class="gender">
            <div class="glass-tag tag-accent">
              <div v-if="gender === 'female'"><el-icon><Female /></el-icon>女</div>
              <div v-else-if="gender === 'male'"><el-icon><Male /></el-icon>男</div>
              <div v-else>性别未设置</div>
            </div>
          </div>
        </div>
        
        <div class="general-outfits mt-6">
          <h3 class="font-sans font-semibold text-sm mb-4 flex items-center gap-2">
            <div class="icon-circle secondary small">
              <el-icon><Location /></el-icon>
            </div>
            今日天气推荐
          </h3>
          <div class="outfits-row flex gap-4">
            <div v-if="recommendGen.top"  class="outfit-card glass-panel flex flex-col items-center">
              <span class="font-sans font-semibold text-xs opacity-80 mt-2">{{ recommendGen.top }}</span>
            </div>
            <div v-if="recommendGen.bottom"  class="outfit-card glass-panel flex flex-col items-center">
              <span class="font-sans font-semibold text-xs opacity-80 mt-2">{{ recommendGen.bottom }}</span>
            </div>
            <div v-if="recommendGen.onepiece"  class="outfit-card glass-panel flex flex-col items-center">
              <span class="font-sans font-semibold text-xs opacity-80 mt-2">{{ recommendGen.onepiece }}</span>
            </div>
          </div>
          <div style="font-size: 0.8rem;">{{ recommendGen.description }}</div>

        </div>
        
        <div class="personalized-outfits mt-6">
          <h3 class="font-sans font-semibold text-sm mb-4 flex items-center gap-2">
            <div class="icon-circle accent small">
              <el-icon><Star /></el-icon>
            </div>
            为您精选
          </h3>
          <div class="outfits-list flex flex-col gap-6">
            <div 
              v-for="item in (recommendPer || []).slice().sort((a, b) => a.rank - b.rank).slice(0, 3)" 
              :key="item.rank" 
              class="recommend-card glass-panel"
            >
              <div class="recommend-card-content flex flex-col gap-2">
                <div class="recommend-rank-title font-sans">
                  <span>第{{ item.rank }}名：{{ item.name }}</span>
                  <span class="recommend-score">{{ item.score }}</span>
                </div>
                <span class="recommend-reason font-sans opacity-80">{{ item.reason }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 识别衣物弹窗 -->
    <recModal
      @refresh="loadWardrobe" 
      v-model="showRecModal" 
      :rec-real-image-url="recRealImageUrl"
      :recImageUrl="recImageUrl" 
      :recClothData="recClothData"
    />
  </div>
</template>

<style scoped>
.tryOn-home {
  width: 100%;
  min-height: 90vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Top Nav */
.top-nav {
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 10;
}

.nav-divider {
  width: 1px;
  height: 1rem;
  background-color: rgba(20, 83, 45, 0.2);
}

/* Center Area */
.center-area {
  z-index: 10;
  gap: 0.5rem;
  /* margin-top: 6rem; */
}

.model-container {
  position: relative;
  padding: 0.75rem;
  transition: all 0.7s ease;
}
.model-container:hover {
  box-shadow: 0 25px 50px -12px rgba(21, 128, 61, 0.25);
}

.window-controls {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  display: flex;
  gap: 0.375rem;
  z-index: 20;
}
/* .dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 9999px;
}
.dot.red { background-color: rgba(248, 113, 113, 0.8); }
.dot.yellow { background-color: rgba(250, 204, 21, 0.8); }
.dot.green { background-color: rgba(74, 222, 128, 0.8); } */

.model-image-wrapper {
  width: 220px;
  height: 400px;
  border-radius: 1.5rem;
  overflow: hidden;
  position: relative;
  background-color: rgba(255, 255, 255, 0.4);
}

.model-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(21, 128, 61, 0.4);
  background: linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.2));
  cursor: pointer;
  transition: all 0.3s ease;
}
.model-placeholder:hover {
  background: linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.4));
  color: rgba(21, 128, 61, 0.6);
}
.model-placeholder.hover-overlay {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  color: var(--lumina-primary);
  z-index: 10;
}
:deep(.model-upload .el-upload:hover) .model-placeholder.hover-overlay {
  opacity: 1;
}
.result-placeholder {
  cursor: default;
}
.result-placeholder:hover {
  background: linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.2));
  color: rgba(21, 128, 61, 0.4);
}
.placeholder-icon {
  font-size: 3.75rem;
  margin-bottom: 1rem;
}

.model-upload {
  width: 100%;
  height: 100%;
}
:deep(.model-upload .el-upload) {
  width: 100%;
  height: 100%;
  display: block;
}

.uploaded-model {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.tryon-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(20, 83, 45, 0.1);
  backdrop-filter: blur(4px);
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
}

.scanning-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--lumina-secondary), transparent);
  box-shadow: 0 0 15px var(--lumina-secondary), 0 0 5px var(--lumina-secondary);
  animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  z-index: 10;
}

@keyframes scan {
  0% { top: 0%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.loading-tag {
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: rgba(34, 197, 94, 0.5);
}
.loading-icon {
  font-size: 2.5rem;
  color: var(--lumina-primary);
}

.tryon-btn {
  padding: 1rem 2.5rem;
  border-radius: 9999px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  letter-spacing: 0.05em;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}
.tryon-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.tryon-btn .el-icon {
  font-size: 1.25rem;
}

/* Left Wardrobe */
.left-wardrobe {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  z-index: 20;
  transform: translateX(calc(-100% + 3rem));
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.left-wardrobe.is-open {
  transform: translateX(0);
}

.wardrobe-panel {
  width: 20rem;
  height: 100%;
  border-radius: 0 2.5rem 2.5rem 0;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-left: none;
  box-shadow: 20px 0 40px rgba(21, 128, 61, 0.1);
}

.icon-circle {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-circle.primary {
  background-color: rgba(21, 128, 61, 0.1);
  color: var(--lumina-primary);
}
.icon-circle.secondary {
  background-color: rgba(34, 197, 94, 0.2);
  color: var(--lumina-primary);
}
.icon-circle.accent {
  background-color: rgba(236, 72, 153, 0.1);
  color: var(--lumina-accent);
}
.icon-circle.orange {
  background-color: #ffedd5;
  color: #f97316;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.5rem;
}
.icon-circle.small {
  width: 1.5rem;
  height: 1.5rem;
}

.categories {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}
.categories::-webkit-scrollbar { display: none; }

.category-btn {
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}
.category-btn:hover {
  background-color: rgba(255, 255, 255, 0.4);
}
.category-btn.active {
  background-color: white;
  border-color: var(--lumina-primary);
  color: var(--lumina-primary);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.clothes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.25rem;
}
/* .clothes-grid::-webkit-scrollbar { display: none; } */

.clothing-item {
  border-radius: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  height: 10rem;
  transition: all 0.3s ease;
  border-color: rgba(255, 255, 255, 0.8);
  position: relative;
}
.clothing-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(21, 128, 61, 0.1);
}
.clothing-item.is-selected {
  border-color: var(--lumina-accent);
  box-shadow: 0 4px 14px 0 rgba(236,72,153,0.39);
}

.delete-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 1.5rem;
  height: 1.5rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 10;
}
.clothing-item:hover .delete-btn {
  opacity: 1;
  transform: scale(1);
}
.delete-btn:hover {
  background-color: #fee2e2;
  transform: scale(1.1) !important;
}

.clothing-img-placeholder {
  width: 100%;
  height: 6rem;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(21, 128, 61, 0.4);
  font-size: 1.5rem;
}

.recognition-area {
  padding: 1rem;
  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.upload-content {
  padding: 0.5rem 0;
}
.upload-icon {
  font-size: 1.875rem;
  color: rgba(21, 128, 61, 0.6);
  margin-bottom: 0.5rem;
}

.recognized-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 0.625rem;
  border-radius: 0.75rem;
  border: 1px solid white;
  margin-top: 0.25rem;
  backdrop-filter: blur(12px);
  animation: fadeIn 0.4s ease-out forwards;
}
.text-primary {
  color: var(--lumina-primary);
}
.small-btn {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.toggle-btn {
  width: 3rem;
  height: 8rem;
  border-radius: 0 1rem 1rem 0;
  margin: auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: none;
  box-shadow: 10px 0 15px rgba(21, 128, 61, 0.05);
}
.toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.6);
  width: 3.5rem;
}
.toggle-indicator {
  width: 0.25rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: rgba(21, 128, 61, 0.3);
  margin: 0 0.25rem;
}
.toggle-btn .el-icon {
  color: var(--lumina-primary);
  font-size: 1.25rem;
}

/* 右侧推荐 */
.right-recommendations {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  z-index: 20;
  transform: translateX(calc(100% - 3rem));
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.right-recommendations.is-open {
  transform: translateX(0);
}

.hover-trigger {
  width: 3rem;
  height: 8rem;
  border-radius: 1rem 0 0 1rem;
  margin: auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-right: none;
  box-shadow: -10px 0 20px rgba(21, 128, 61, 0.05);
}
.right-recommendations:hover .hover-trigger {
  background-color: rgba(255, 255, 255, 0.6);
  width: 3.5rem;
}
.hover-trigger .arrow-left { display: block; }
.hover-trigger .arrow-right { display: none; }
.right-recommendations:hover .hover-trigger .arrow-left { display: none; }
.right-recommendations:hover .hover-trigger .arrow-right { display: block; }

.hover-trigger .el-icon {
  color: var(--lumina-primary);
  font-size: 1.25rem;
}

.recommendation-panel {
  width: 20rem;
  height: 100%;
  border-radius: 2.5rem 0 0 2.5rem;
  padding: 2rem 1.5rem;
  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  border-right: none;
  box-shadow: -20px 0 40px rgba(21, 128, 61, 0.08);
  overflow-y: auto;
}
.recommendation-panel::-webkit-scrollbar { display: none; }

.weather-gender {
  border-radius: 1rem;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.8);
}
.weather-info {
  line-height: 1.2;
}

.tag-accent {
  color: var(--lumina-accent);
  border-color: rgba(236, 72, 153, 0.2);
  background-color: rgba(255, 255, 255, 0.8);
}

.outfits-row {
  overflow-x: auto;
  padding-bottom: 0.75rem;
}
.outfits-row::-webkit-scrollbar { display: none; }

.outfit-card {
  min-width: 7.5rem;
  height: auto;
  border-radius: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  background-color: rgba(255, 255, 255, 0.5);
  border-color: white;
}
.outfit-card:hover {
  transform: scale(1.05);
}
.outfit-card.large {
  min-width: unset;
  height: auto;
}
.outfit-card.large:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(21, 128, 61, 0.1);
}

.outfit-img-placeholder {
  width: 100%;
  height: 6rem;
  background-color: rgba(21, 128, 61, 0.05);
  border-radius: 0.75rem;
}
.outfit-card.large .outfit-img-placeholder {
  height: auto;
}

.outfits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding-bottom: 1rem;
}

/* Upload styles override */
:deep(.el-upload-dragger) {
  background-color: rgba(255, 255, 255, 0.4) !important;
  border: 1px dashed rgba(21, 128, 61, 0.3) !important;
  border-radius: 1rem !important;
  transition: all 0.3s ease;
}
:deep(.el-upload-dragger:hover) {
  background-color: rgba(255, 255, 255, 0.6) !important;
  border-color: var(--lumina-secondary) !important;
}
.personalized-outfits {
  width: 100%;
}

.recommend-card {
  position: relative;
  padding: 1rem;
  border-radius: 1rem;
  overflow: hidden;
  text-align: left;
  transition: all 0.3s ease;
}

.recommend-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(21, 128, 61, 0.1);
}

.recommend-rank-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--lumina-surface);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recommend-score {
  font-size: 1rem;
  color: var(--lumina-accent);
  font-weight: 600;
  margin-left: 1rem;
}

.recommend-reason {
  font-size: 0.875rem;
  color: var(--lumina-surface);
}

</style>