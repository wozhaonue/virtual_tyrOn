import request from "@/request";

// 获取试穿静态数据
export const getTryOnStatistics = () => {
  return request.get('/tryon/statistics');
}

// 获取试穿历史列表数据
export const getTryOnHistory = () => {
  return request.get('/tryon/history');
}

// 删除试穿历史
export const deleteOneHistory = (id:number) => {
  return request.delete(`/tryon/history/${id}`);
}

// 批量删除试穿历史
export const batchDeleteHistory = (idArr: number[]) => {
  return request.post('/tryon/history/batch-delete',[...idArr]);
}

// 获取天气数据
export const getWeather = () => {
  return request.get('/weather');
}

// 获取大众穿搭推荐
export const getRecGen = (gender:string) => {
  const filterGenderStr = gender === 'female' ? '女' : '男';
  return request.post('/recommend/general',{gender: filterGenderStr});
}

// 获取个性化穿搭推荐
export const getRecPersonal = (gender:string) => {
  const filterGenderStr = gender === 'female' ? '女' : '男';
  return request.post('/recommend/general',{
    gender: filterGenderStr,
    use_mock: true,
  });
}

// 上传衣物图照片
export const postClothUpload = (data) => {
  return request.post('/clothing/upload',data);
}

// 获取识别衣物数据
export const postClothRec = (data) => {
  return request.post('/clothing/recognize',data);
}

// 保存批量识别的衣物
export const saveBatchClothing = (data) => {
  return request.post('/clothing/save-batch',data);
}

// 获取衣橱数据
export const getWardrobe = () => {
  return request.get('/tryon/wardrobe');
}

// 删除选中衣物
export const deleteCloth = (id:string) => {
  return request.delete(`/tryon/clothes/${id}`);
}

// 在线AI试穿衣物
export const tryOnWithOnlineAI = (data) => {
  return request.post('/tryon/ai-generate',data);
}

// 本地AI试穿单件衣物
export const singleTryOnWithAI = (type:string,data) => {
  return request.post(`/tryon/generate-${type}`,data);
}

// 本地AI试穿组合衣物
export const combineTryOnWithAI = (data) => {
  return request.post(`/tryon/generate-combination`,data);
}
