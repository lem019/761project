// frontend/src/domain/user/repository/user.repository.js
import { http } from "@/utils/request";

export const userRepo = {
  register: (payload) => http.post("/auth/register", payload),
  login: (payload) => http.post("/auth/login", payload),
  me: () => http.get("/auth/me"),
};

export const _registerUser = (params) => {
  return http.post("/api/user/register",params);
};

export const _logout = () => {
  return http.post("/api/user/logout");
};

export const _userLogin = (params) => {
  return http.post("/api/user/login",params);
};
