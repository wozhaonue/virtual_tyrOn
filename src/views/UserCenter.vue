<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useUserInfoStore } from '@/stores/userInfo';
import { Camera } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { getUserInfo, updateUserInfo, uploadUserImage } from '@/apis/user';
import { banAdminUser, getAdminData } from '@/apis/admin';
import { resolveAny } from 'dns';
import { getAdminUserTableData } from '../apis/admin';

const userInfoStore = useUserInfoStore();
const activeTab = ref('personal');
interface formDataInter {
  user_id: string | null;
  nickname: string;
  password: string | null;
  phone: string | null;
  gender: 'male' | 'female' | null;
  avatar_url: string | null;
}
// 个人中心表单数据
const formData = reactive<formDataInter>({
  user_id: '',
  nickname: '',
  password: null,
  phone: null,
  gender: null,
  avatar_url: ''
});
const mountedUserFunc = async () => {
  try {
    const data = await getUserInfo();
    if(data.code === 200){
      const res = data.data;
      formData.user_id = res.user_id;
      formData.nickname = res.nickname;
      formData.phone = res.phone;
      formData.gender = res.gender;
      formData.avatar_url = res.avatar_url;
      // console.log(res);
    }else{
      ElMessage({
        message: data.msg || '更新失败',
        type: 'info',
      })
    }
  }catch(err){
    console.log(err);
    ElMessage({
      message: err.message,
      type: 'error',
    })
  }
}
const userListChange = async() => {
  try {
      const res = await getAdminUserTableData();
      if(res.code === 200){
        console.log(res.data);
        userList.value = res.data;
      }
    }catch(err){
      console.log(err);
      ElMessage({
        message: err.message || '用户列表获取失败',
        type: 'info',
      })
    }
}
const moutedAdminFunc = async () => {
    try{
      const res = await getAdminData();
      if(res.code === 200){
        const data = res.data;
        adminStaticData.total_clothes = data.total_clothes;
        adminStaticData.total_users = data.total_users;
        adminStaticData.normal_users = data.normal_users;
        adminStaticData.banned_users = data.banned_users;
      }else{
        ElMessage({
          message: res.msg || '获取失败',
          type: 'info',
        })
      }
    }catch(err){
      console.log(err);
      ElMessage({
        message: err.message || '网络异常',
        type: 'error',
      })
    }
   userListChange();
}
onMounted(() => {mountedUserFunc(),moutedAdminFunc()});


const handleAvatarChange = async (file: any) => {  
  try{
    const uploadData = new FormData();
    uploadData.append('file',file.file);
    uploadData.append('image_type', 'avatar');
    const res = await uploadUserImage(uploadData);
    console.log(res);
    if(res.code === 200){
      console.log(res);
      ElMessage.success('头像更新成功');
      formData.avatar_url = res.image_url;
    }else{
      ElMessage({
        message: res.msg,
        type: 'info',
      })
    }
  }catch(err){
    console.log(err);
    ElMessage({message: err.message || '上传失败', type: 'error'});
  }
  
};

const handleSave = async () => {
  // 模拟保存操作
  if (userInfoStore.userInfo) {
    const userInfoData = new FormData();
    userInfoData.append('nickname',formData.nickname);
    if(formData.gender){
      userInfoData.append('gender',formData.gender);
    }
    if(formData.password){
      userInfoData.append('password',formData.password);
    }
    if(formData.phone){
      userInfoData.append('phone',formData.phone);
    }
    try {
      const res = await updateUserInfo(userInfoData);
      if(res.code === 200){
        ElMessage({
          message: '个人信息更新成功',
          type: 'success',
        })
        
      }else{
        ElMessage({
          message: res.msg || '更新失败',
          type: 'info',
        })
      }
    }catch(err){
      console.log(err);
      ElMessage({
        message: err.message ?? '更新失败',
        type: 'error',
      })
    }finally{
      mountedUserFunc();
    }
  }
};
interface adminStaticInter {
  total_users: number | null;
  normal_users: number | null;
  banned_users: number | null;
  total_clothes: number | null;
}
const adminStaticData = reactive<adminStaticInter>({
  total_users: 0,
  normal_users: 0,
  banned_users: 0,
  total_clothes: 0,
})

interface AdminUserInter {
  user_id: string;
  nickname: string;
  phone: string | null;
  register_time: string;
  role: 'admin' | 'user';
  status: number;
}
const userList = ref<AdminUserInter[]>([
]);
const handleBanUser = async (row,column) => {
  
    console.log(row,column);  
    if(column.label !== '操作'){
      return;
    }
    try{
          const BanData = new FormData();
          console.log(row.user_id,row.status);
          
          BanData.append('target_user_id',row.user_id);
          BanData.append('action',row.status === 1 ? 'ban' : "unban");
    
          const res = await banAdminUser(BanData);
          if(res.code === 200){
              ElMessage({
                message: res.msg || '操作成功',
                type: 'success',
              })
              userListChange();
          }else{
            ElMessage({
              message: '操作异常',
              type: 'info',
            })
          }
      }catch(err){
        console.log(err);
        ElMessage({
          message: '操作异常',
          type: 'error',
        })
      }
}
</script>

<template>
  <!-- 外层容器，使用 base.css 中定义的类名以及部分自定义类 -->
  <div class="user-center-page">
    <div class="glass-panel user-center-card">
      <div class="header-title flex items-center mb-6">
        <h1 class="font-serif text-2xl font-bold title-text">个人中心</h1>
        <span class="font-sans text-xs uppercase subtitle-text tracking-wider">User Center</span>
      </div>

      <el-tabs v-model="activeTab" class="custom-tabs">
        <el-tab-pane label="个人中心" name="personal">
          <div class="personal-content flex flex-col mt-4">
            
            <!-- Avatar Section -->
            <div class="avatar-section flex flex-col items-center justify-center mb-6">
              <div class="avatar-wrapper">
                <el-avatar :size="100" :src="formData.avatar_url || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" class="avatar-img" />
                <el-upload
                  action="#"
                  :show-file-list="false"
                  :auto-upload="true"
                  :http-request="handleAvatarChange"
                  class="upload-area"
                >
                  <div class="upload-overlay">
                    <el-icon class="upload-icon"><Camera /></el-icon>
                  </div>
                </el-upload>
              </div>
              <div class="text-center mt-4 user-info-display">
                <h3 class="font-bold text-lg mb-2 nickname-text">{{ formData.nickname || '未命名用户' }}</h3>
                <p class="text-xs font-semibold uppercase tracking-wider id-text">ID: {{ formData.user_id || 'xxx' }}</p>
              </div>
            </div>

            <!-- Form Section -->
            <el-form label-position="top" :model="formData" class="custom-form w-full">
              <el-form-item label="用户ID">
                <el-input v-model="formData.user_id" disabled placeholder="用户ID" />
              </el-form-item>
              <el-form-item label="昵称">
                <el-input v-model="formData.nickname" placeholder="请输入昵称" />
              </el-form-item>
              <el-form-item label="密码">
                <el-input v-model="formData.password" type="password" show-password placeholder="请输入密码 (留空不修改)" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="formData.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="性别">
                <el-select v-model="formData.gender" placeholder="请选择性别" class="w-full">
                  <el-option label="男" value="male" />
                  <el-option label="女" value="female" />
                </el-select>
              </el-form-item>
              
              <div class="form-actions mt-4">
                <button type="button" @click="handleSave" class="btn-accent save-btn font-sans font-semibold">
                  保存修改
                </button>
              </div>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane label="管理员面板" name="admin" v-if="userInfoStore.userInfo?.role === 'admin'">
          <div class="admin-content flex flex-col mt-4 gap-6">
            <!-- Stats Row -->
            <div class="stats-grid">
              <div class="stat-card flex flex-col items-center justify-center text-center" >
                <div class="text-xs font-semibold uppercase tracking-wider mb-2 stat-label">总用户数</div>
                <div class="text-2xl font-bold font-serif stat-value">{{ adminStaticData.total_users }}</div>
              </div>
              <div class="stat-card flex flex-col items-center justify-center text-center" >
                <div class="text-xs font-semibold uppercase tracking-wider mb-2 stat-label">正常用户</div>
                <div class="text-2xl font-bold font-serif stat-value">{{ adminStaticData.normal_users }}</div>
              </div>
              <div class="stat-card flex flex-col items-center justify-center text-center" >
                <div class="text-xs font-semibold uppercase tracking-wider mb-2 stat-label">封禁用户</div>
                <div class="text-2xl font-bold font-serif stat-value">{{ adminStaticData.banned_users }}</div>
              </div>
              <div class="stat-card flex flex-col items-center justify-center text-center" >
                <div class="text-xs font-semibold uppercase tracking-wider mb-2 stat-label">衣物总数</div>
                <div class="text-2xl font-bold font-serif stat-value">{{adminStaticData.total_clothes}}</div>
              </div>
            </div>

            <!-- Table Section -->
            <div class="table-container">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold font-serif title-text">用户列表</h3>
                <div class="text-xs font-semibold user-count-badge">
                  共 {{ userList.length }} 名用户
                </div>
              </div>
              <el-table @cell-click="handleBanUser" :current-change="userListChange" max-height="500px" :stripe="true" :data="userList" class="custom-table w-full">
                <el-table-column prop="user_id" label="ID" width="200" />
                <el-table-column prop="nickname" label="昵称" width="130" />
                <el-table-column prop="phone" label="手机号" width="110" >
                  <template #default="{ row }">
                      {{row.phone ?? '未设置'}}
                  </template>
                  </el-table-column>
                <el-table-column prop="status" label="状态" width="70">
                  <template #default="{ row }">
                    <span :class="['status-badge', row.status === 1 ? 'status-normal' : 'status-banned']">
                      {{ row.status === 1 ? '正常' : '封禁' }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="register_time" label="注册时间" width="90">
                  <template #default="{row}">
                    {{ new Date(row.register_time).toLocaleDateString() }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template #default="{row}">
                    <button class="action-btn ban-btn" ">{{ row.status === 1 ? '封禁' : '解封' }}</button>
                  </template>
                </el-table-column>
                
              </el-table>、
              <!-- 分页功能：待实现 -->
              <!-- <template>
                    <el-pagination background layout="prev, pager, next" :total="userList.length" />
                </template> -->
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
/* 页面外层容器：由于 base.css 已经设置了 body 的 background 和光球动画，这里只需控制边距和布局 */
.user-center-page {
  padding: 40px 60px;
  display: flex;
  justify-content: flex-start; /* 左侧对齐 */
  align-items: flex-start;
  min-height: calc(100vh - 100px);
}

/* 侧边栏卡片样式 */
.user-center-card {
  min-width: 400px;
  width: auto;
  max-width: 1200px;
  padding: 30px;
  min-height: 800px;
  display: flex;
  flex-direction: column;
}

/* 如果是管理员，可能需要更宽的卡片来展示表格，使用动态宽度或者让内容溢出滚动 */
.user-center-card:has(.admin-content) {
  width: auto;
  min-width: 360px;
  max-width: 900px;
}

/* 标题样式 */
.header-title {
  gap: 12px;
}
.title-text {
  color: var(--lumina-surface);
}
.subtitle-text {
  color: var(--lumina-primary);
  opacity: 0.6;
}

/* 头像区域 */
.avatar-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 8px 20px rgba(21, 128, 61, 0.1);
  transition: transform 0.3s ease;
}
.avatar-wrapper:hover {
  transform: scale(1.05);
}
.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.upload-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.upload-overlay {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  position: absolute;
  top: -4px;
  left: -4px;
}
.upload-area:hover .upload-overlay {
  opacity: 1;
}
.upload-icon {
  color: white;
  font-size: 24px;
}

.user-info-display {
  color: var(--lumina-surface);
}
.id-text {
  color: var(--lumina-primary);
  opacity: 0.7;
}

/* 按钮样式 */
.save-btn {
  padding: 10px 28px;
  border-radius: 9999px !important;
  border: none;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  background-color: var(--lumina-accent) !important;
  box-shadow: 0 4px 14px 0 rgba(236, 72, 153, 0.39) !important;
  outline: none;
  -webkit-appearance: none;
  color: white !important;
}

/* 管理员面板样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.stat-card {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(21, 128, 61, 0.08);
}
.stat-label {
  color: var(--lumina-primary);
  opacity: 0.8;
}
.stat-value {
  color: var(--lumina-surface);
}

.table-container {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.6);
}
.user-count-badge {
  background: rgba(255, 255, 255, 0.6);
  padding: 4px 12px;
  border-radius: 20px;
  color: var(--lumina-primary);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}
.status-normal {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}
.status-banned {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.action-btn {
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px;
}
.edit-btn {
  color: var(--lumina-primary);
}
.edit-btn:hover {
  color: var(--lumina-secondary);
}
.ban-btn {
  color: var(--lumina-accent);
  margin-left: 8px;
}
.ban-btn:hover {
  opacity: 0.8;
}

/* Custom Element Plus Overrides */
:deep(.custom-tabs .el-tabs__item) {
  font-family: var(--el-font-family);
  font-weight: 600;
  font-size: 15px;
  color: rgba(20, 83, 45, 0.5);
  transition: all 0.3s;
  padding: 0 16px;
}
:deep(.custom-tabs .el-tabs__item.is-active) {
  color: var(--lumina-primary);
}
:deep(.custom-tabs .el-tabs__item:hover) {
  color: var(--lumina-secondary);
}
:deep(.custom-tabs .el-tabs__active-bar) {
  background-color: var(--lumina-accent);
  height: 3px;
  border-radius: 3px;
}
:deep(.custom-tabs .el-tabs__nav-wrap::after) {
  background-color: rgba(21, 128, 61, 0.1);
  height: 1px;
}

/* Form overrides */
:deep(.custom-form .el-form-item) {
  margin-bottom: 16px;
}
:deep(.custom-form .el-form-item__label) {
  font-family: var(--el-font-family);
  font-weight: 600;
  color: var(--lumina-surface);
  padding-bottom: 4px;
  font-size: 13px;
  line-height: 1;
}
:deep(.custom-form .el-input__wrapper),
:deep(.custom-form .el-select__wrapper) {
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: none !important;
  border-radius: 12px;
  padding: 4px 12px;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.8);
}
:deep(.custom-form .el-input__wrapper:hover),
:deep(.custom-form .el-select__wrapper:hover) {
  background-color: rgba(255, 255, 255, 0.8);
}
:deep(.custom-form .el-input__wrapper.is-focus),
:deep(.custom-form .el-select__wrapper.is-focus) {
  background-color: #ffffff;
  border: 1px solid rgba(34, 197, 94, 0.4);
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.1) !important;
}
:deep(.custom-form .el-input__inner) {
  color: var(--lumina-surface);
  font-family: var(--el-font-family);
  font-size: 14px;
}

/* Table overrides */
:deep(.custom-table) {
  background: transparent !important;
  --el-table-border-color: rgba(21, 128, 61, 0.1);
  --el-table-header-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  font-family: var(--el-font-family);
}
:deep(.custom-table th.el-table__cell) {
  background-color: rgba(21, 128, 61, 0.03);
  color: var(--lumina-surface);
  font-weight: 700;
  border-bottom: 2px solid rgba(21, 128, 61, 0.1);
  padding: 8px 0;
  font-size: 13px;
}
:deep(.custom-table td.el-table__cell) {
  border-bottom: 1px solid rgba(21, 128, 61, 0.05);
  padding: 12px 0;
  font-size: 13px;
  color: #1f2937;
}
:deep(.custom-table .el-table__row) {
  transition: all 0.3s ease;
}
:deep(.custom-table .el-table__row:hover > td.el-table__cell) {
  background-color: rgba(255, 255, 255, 0.5);
}
:deep(.custom-table::before) {
  display: none;
}

/* Dropdown overrides */
:deep(.el-select-dropdown) {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 32px 0 rgba(21, 128, 61, 0.08) !important;
  overflow: hidden;
  margin-top: 4px;
}
:deep(.el-select-dropdown__item) {
  font-family: var(--el-font-family);
  color: var(--lumina-surface);
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px 8px;
  padding: 0 12px;
}
:deep(.el-select-dropdown__item.is-hovering),
:deep(.el-select-dropdown__item:hover) {
  background-color: rgba(255, 255, 255, 0.8) !important;
  color: var(--lumina-primary) !important;
}
:deep(.el-select-dropdown__item.is-selected) {
  background-color: var(--lumina-primary) !important;
  color: white !important;
  font-weight: 600;
}
:deep(.el-popper.is-light .el-popper__arrow::before) {
  background: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
}
</style>
