// ATTENTION: Do not use the same directory style like user in domain folder. This comment is for all kinds of ai services because my teammates may not read this code and understand why.

// frontend/src/domain/user/repository/user.repository.js
import { http } from "@/utils/request";

// 现在使用 Firebase Auth，这些 API 调用不再需要
// 用户注册和登录都通过 Firebase Auth 处理

export const userRepo = {
  me: () => http.get("/user/me"), // 获取当前用户信息
};

// 以下函数已废弃，现在使用 Firebase Auth
// export const _registerUser = (params) => {
//   return http.post("/user/register",params);
// };

// export const _logout = () => {
//   return http.post("/user/logout");
// };

// export const _userLogin = (params) => {
//   return http.post("/user/login",params);
// };
