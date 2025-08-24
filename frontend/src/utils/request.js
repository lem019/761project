// src/utils/request.js
import axios from "axios";
import errorCode from "./errorCode";
import { message as antdMessage, Modal } from "antd";
import { removeStorage,getStorage } from "./helper";

// Create instance and configure base URL
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=utf-8"
  }
});

// Request interceptor
service.interceptors.request.use(
  (config) => {
    // Standardize headers object
    config.headers = config.headers || {};

    // Add Token
    const token = getStorage("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (res) => {
    const code = res?.data?.code ?? 200;
    const msg = res?.data?.message ?? errorCode["default"];
    if (code === 401) {
      Modal.error({
        title: "login expired",
        content: "login expired, please login again",
        onOk: () => {
          removeStorage("token");
          window.location.href = "/login";
        }
      });
      return Promise.reject(new Error("login expired, please login again"));
    } else if (code === 500) {
      antdMessage.error(new Error(msg));
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      antdMessage.error(msg);
      return Promise.reject(new Error(msg));
    } else {
      return Promise.resolve(res.data);
    }
  },
  (error) => {
    const errorResponse = error.response || {};
    const statusCode = errorResponse.status;
    if (statusCode === 401) {
      Modal.error({
        title: "login expired",
        content: "login expired, please login again",
        onOk: () => {
          removeStorage("token");
          window.location.href = "/login";
        }
      });
      return Promise.reject(new Error("login expired, please login again"));
    }
    console.log('statusCode:',statusCode)
    const errorMessage = errorResponse.data?.message ?? error?.message ?? errorCode["default"];
    antdMessage.error(errorMessage);
    return Promise.reject(errorMessage);
  }
);

export const http = {
  get(url, params, config) {
    return service.get(url, { ...config, params });
  },

  post(url, data, config) {
    return service.post(url, data, config);
  },

  put(url, data, config) {
    return service.put(url, data, config);
  },

  delete(url, params, config) {
    return service.delete(url, { ...config, params });
  }
};

export default service;
