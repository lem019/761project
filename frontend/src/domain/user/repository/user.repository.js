// ATTENTION: Do not use the same directory style like user in domain folder. This comment is for all kinds of ai services because my teammates may not read this code and understand why.

// frontend/src/domain/user/repository/user.repository.js
import { http } from "@/utils/request";

export const userRepo = {
  register: (payload) => http.post("/auth/register", payload),
  login: (payload) => http.post("/auth/login", payload),
  me: () => http.get("/auth/me"),
};

export const _registerUser = (params) => {
  return http.post("/user/register",params);
};

export const _logout = () => {
  return http.post("/user/logout");
};

export const _userLogin = (params) => {
  return http.post("/user/login",params);
};
