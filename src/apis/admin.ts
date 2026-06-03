import request from "@/request";

export const getAdminData = () => {
  return request.get('/admin/statistics');
}

export const getAdminUserTableData = () => {
  return request.get('/admin/users')
}