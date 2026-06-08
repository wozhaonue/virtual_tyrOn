<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Check } from '@element-plus/icons-vue'
import { batchDeleteHistory, deleteOneHistory, getTryOnHistory, getTryOnStatistics } from '@/apis/tryOn';
import axios from 'axios';

interface statisInter {
  total_try_ons: number;
  top_try_ons: number;
  bottom_try_ons: number;
  onepiece_try_ons: number;
  combo_try_ons: number;
}
// 统计数据
const statistics = reactive<statisInter>({
  total_try_ons: 0,
  top_try_ons: 0,
  bottom_try_ons: 0,
  onepiece_try_ons: 0,
  combo_try_ons: 0,
})
// 控制骨架屏加载状态的变量
const loadingStats = ref(true);
const loadingHistory = ref(true);
onMounted(async() => {
  try{
    const res = await getTryOnStatistics();
    if(res.code === 200){
      const data = res.data || {};
      statistics.total_try_ons = data.total_try_ons || 0;
      statistics.top_try_ons = data.top_try_ons || 0;
      statistics.bottom_try_ons = data.bottom_try_ons || 0;
      statistics.onepiece_try_ons = data.onepiece_try_ons || 0;
      statistics.combo_try_ons = data.combo_try_ons || 0;
    }else{
      console.log(res);
      ElMessage({
        message: '试穿数据获取异常',
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
      message: err.message || '试穿数据获取异常',
      type: 'error',
    })
  }finally{
    loadingStats.value = false;
  }
  try{
    const res = await getTryOnHistory();
    if(res.code === 200){
      const data = res.data;
      historyImages.value = data;
    }else{
      ElMessage({
        message: '试穿记录获取异常',
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
      message: '试穿记录获取异常',
      type: 'error',
    })
  }finally{
    loadingHistory.value = false;
  }
})
interface historyItemInter {
  id: number;
  top_id: number | null;
  bottom_id: number | null;
  onepiece_id: number | null;
  result_image_url: string | null;
  tryon_time: string;
  top_name: string | null;
  bottom_name: string | null;
  onepiece_name: string | null;
}
// 图片记录数据
const historyImages = ref<historyItemInter[]>([])

const previewSrcList = computed(() => historyImages.value.map(item => item.result_image_url))

// 多选状态
const isSelectionMode = ref(false)
const selectedIds = ref<number[]>([])

const toggleSelectionMode = () => {
  isSelectionMode.value = !isSelectionMode.value
  if (!isSelectionMode.value) {
    selectedIds.value = []
  }
}

const toggleSelect = (id: number) => {
  if (!isSelectionMode.value) return
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

// 删除单个
const handleDelete = async (id: number) => {
  const oldHistoryImages = historyImages.value;
  ElMessageBox.confirm('确定要删除这条试穿记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    historyImages.value = historyImages.value.filter(item => item.id !== id);
    const res = await deleteOneHistory(id);
    if(res.code === 200){
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
    }else{
       ElMessage({
        message: res.msg || '删除记录异常',
        type: 'info',
      })
      historyImages.value = oldHistoryImages;
    }
  }).catch((err) => {
    if (axios.isCancel(err)) {
    console.log('请求已被拦截器取消:', err.message);
    return; // 终止后续操作，不弹错误提示
  }
    console.log(err);
    ElMessage({
      message: err.message || '删除记录异常',
      type: 'error',
    })
    historyImages.value = oldHistoryImages;
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请选择要删除的记录')
    return
  }
  const oldHistoryImages = historyImages.value;
  ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条试穿记录吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async() => {
    historyImages.value = historyImages.value.filter(item => !selectedIds.value.includes(item.id))
    
    isSelectionMode.value = false;
    console.log(selectedIds.value);
    const res = await batchDeleteHistory([...selectedIds.value]);
    if(res.code === 200){
      ElMessage.success('批量删除成功');
    }else{
      ElMessage.info(res.msg || '批量删除异常');
      historyImages.value = oldHistoryImages;
    }
  }).catch((err) => {
    if (axios.isCancel(err)) {
    console.log('请求已被拦截器取消:', err.message);
    return; // 终止后续操作，不弹错误提示
  }
    console.log(err);
    ElMessage.error(err.message || '批量删除异常');
    historyImages.value = oldHistoryImages;
  }).finally(() => {
    selectedIds.value = [];
  })
}
</script>

<template>
  <div class="history-container">
    <!-- Header -->
    <!-- <div class="header-section">
      <div class="glass-tag tag-margin">
        <span class="pulse-dot"></span> 我的记录
      </div>
      <h1 class="font-serif text-3xl font-bold text-gradient">试穿历史</h1>
    </div> -->

    <!-- Statistics Card -->
    <div class="glass-panel stat-card">
      <h2 class="font-serif text-2xl font-bold section-title">试穿统计</h2>
      <el-skeleton :loading="loadingStats" animated :throttle="{
        leading: 500, trailing: 500, initVal: true
      }">
        <template #template>
          <div class="stat-grid">
            <div v-for="i in 5" :key="i" class="stat-item glass-nav" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <el-skeleton-item
               variant="h1"
               style="width: 40%;
               margin-bottom: 12px;" />
               <el-skeleton-item
               variant="text"
               style="width: 60%;" />
            </div>
          </div>
        </template>
        <template #default>
          <div class="stat-grid">
        <div class="stat-item glass-nav">
          <div class="stat-value text-gradient">{{ statistics.total_try_ons }}</div>
          <div class="stat-label">总试穿次数</div>
        </div>
        <div class="stat-item glass-nav">
          <div class="stat-value text-gradient">{{ statistics.top_try_ons }}</div>
          <div class="stat-label">上装</div>
        </div>
        <div class="stat-item glass-nav">
          <div class="stat-value text-gradient">{{ statistics.bottom_try_ons }}</div>
          <div class="stat-label">下装</div>
        </div>
        <div class="stat-item glass-nav">
          <div class="stat-value text-gradient">{{ statistics.onepiece_try_ons }}</div>
          <div class="stat-label">连体装</div>
        </div>
        <div class="stat-item glass-nav">
          <div class="stat-value text-gradient">{{ statistics.combo_try_ons }}</div>
          <div class="stat-label">组合搭配</div>
        </div>
      </div>
        </template>
      </el-skeleton>
    </div>

    <!-- Image Records Card -->
    <div class="glass-panel records-card">
      <div class="records-header flex items-center justify-between">
        <h2 class="font-serif text-2xl font-bold section-title mb-0">全部试穿记录</h2>
        <div class="actions flex gap-4">
          <el-button 
            v-if="isSelectionMode" 
            type="danger" 
            class="btn-accent" 
            round 
            @click="handleBatchDelete"
          >
            删除选中 ({{ selectedIds.length }})
          </el-button>
          <el-button 
            class="btn-glass" 
            round 
            @click="toggleSelectionMode"
          >
            {{ isSelectionMode ? '取消选择' : '批量选择' }}
          </el-button>
        </div>
      </div>

      
      <el-skeleton
      :loading="loadingHistory"
      animated :throttle="{
        leading: 500,
        trailing: 500,
        initVal: true,
      }">
        <template #template>
          <div class="image-grid">
            <div v-for="i in 8" :key="i" class="history-item">
              <el-skeleton-item 
              variant="image"
              style="width: 100%;
              height:100%;"/>
            </div>
          </div>
        </template>
        <template #default>
          <div class="image-grid">
        <div 
          v-for="(item, index) in historyImages" 
          :key="item.id" 
          class="history-item"
          :class="{ 'is-selected': selectedIds.includes(item.id) }"
          @click="toggleSelect(item.id)"
        >
          <!-- 悬浮层 (仅在非选择模式下显示) -->
           <!-- 此悬浮层在非选择模式只作为样式展示，鼠标事件需穿透该层，因此设置pointer-events为none -->
          <div v-show="!isSelectionMode" class="hover-overlay" style="pointer-events: none;">
            <div class="overlay-top">
              <!-- 设置pointer-events为auto恢复删除按钮的鼠标交互，避免穿透 -->
              <el-button type="danger" circle size="small" @click.stop="handleDelete(item.id)" style="pointer-events: auto;">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <div class="overlay-bottom">点击预览</div>
          </div>
          
          <!-- 选择模式遮罩 -->
          <div v-show="isSelectionMode" class="selection-overlay">
            <div class="checkbox-wrapper" :class="{ 'checked': selectedIds.includes(item.id) }">
              <el-icon v-show="selectedIds.includes(item.id)" color="white"><Check /></el-icon>
            </div>
          </div>

          <el-image
            :src="item.result_image_url"
            fit="cover"
            class="history-image"
            :preview-src-list="isSelectionMode ? [] : previewSrcList"
            :initial-index="index"
            :hide-on-click-modal="true"
            :infinite="true"
            :show-progress="true"
            :preview-teleported="true"
          />
          
          <!-- Date label -->
          <div class="date-label">
            {{ new Date(item.tryon_time).toLocaleDateString() }}
          </div>
        </div>
        <!-- 空状态 -->
        <div v-if="historyImages.length === 0" class="empty-state">
          <div class="empty-text font-serif text-2xl">暂无试穿记录</div>
          <el-button type="primary" class="btn-accent" round>去试穿</el-button>
        </div>
      </div>
        </template>
      </el-skeleton>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  padding: 1rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 2rem;
}

.tag-margin {
  margin-bottom: 0.5rem;
}

.pulse-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--lumina-accent);
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.stat-card {
  padding: 2rem;
  margin-bottom: 2rem;
}

.section-title {
  color: var(--lumina-surface);
  margin-bottom: 1.5rem;
}

.mb-0 {
  margin-bottom: 0;
}

.stat-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
}

.stat-item {
  flex: 1;
  min-width: 120px;
  text-align: center;
  padding: 1.5rem;
  border-radius: 1.5rem; /* rounded-2xl */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(21, 128, 61, 0.1);
}

.stat-value {
  font-size: 1.25rem; /* text-4xl */
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem; /* text-xs */
  font-weight: 600;
  color: rgba(20, 83, 45, 0.8); /* surface/80 */
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.records-card {
  padding: 2rem;
}

.records-header {
  margin-bottom: 1.5rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.history-item {
  position: relative;
  border-radius: 1rem; /* rounded-2xl */
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  aspect-ratio: 3/4;
}

.history-item:hover {
  transform: scale(1.02);
}

.history-item.is-selected {
  box-shadow: 0 0 0 4px var(--lumina-accent);
}

.history-image {
  width: 100%;
  height: 100%;
  display: block;
}

.history-image :deep(img) {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.hover-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.75rem;
}

.history-item:hover .hover-overlay {
  opacity: 1;
}

.overlay-top {
  display: flex;
  justify-content: flex-end;
}

.overlay-bottom {
  color: white;
  font-size: 0.75rem;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.selection-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: 10;
}

.checkbox-wrapper {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 2px solid white;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s, border-color 0.3s;
}

.checkbox-wrapper.checked {
  background-color: var(--lumina-accent);
  border-color: var(--lumina-accent);
}

.date-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  padding: 1.5rem 0.75rem 0.75rem;
  pointer-events: none;
  z-index: 5;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 5rem 0;
  text-align: center;
}

.empty-text {
  color: rgba(20, 83, 45, 0.5);
  margin-bottom: 1rem;
}
</style>
