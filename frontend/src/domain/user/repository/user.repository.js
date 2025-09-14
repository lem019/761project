import { http } from "@/utils/request";// User related API calls


export const _registerUser = (params) => {
  return http.post("/api/user/register",params);
};

export const _logout = () => {
  return http.post("/api/user/logout");
};

export const _userLogin = (params) => {
  return http.post("/api/user/login",params);
};