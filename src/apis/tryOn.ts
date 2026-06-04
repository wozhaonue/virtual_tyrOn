import request from "@/request";

export const getTryOnStatistics = () => {
  return request.get('/tryon/statistics');
}

export const getTryOnHistory = () => {
  return request.get('/tryon/history');
}

export const deleteOneHistory = (id:number) => {
  return request.delete(`/tryon/history/${id}`);
}

export const batchDeleteHistory = (idArr: number[]) => {
  return request.post('/tryon/history/batch-delete',[...idArr]);
}