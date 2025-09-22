export const saveStorage = (key, value) => {
  if (typeof value === "string" && value.length > 0) {
    localStorage.setItem(key, value);
  }
};

export const getStorage = (key) => {
  return localStorage.getItem(key);
};

export const removeStorage = (key) => {
  localStorage.removeItem(key);
};

export const saveSessionStorage = (key, value) => {
  if (typeof value === "string" && value.length > 0) {
    sessionStorage.setItem(key, value);
  }
};


export const getSessionStorage = (key) => {
  return sessionStorage.getItem(key);
};

export const removeSessionStorage = (key) => {
  sessionStorage.removeItem(key);
};

// JWT 解码函数已移除，现在使用 Firebase ID Token

export const getArrayLevel = (num) => {
    const arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push({ value: `Level ${i}`, label: `Level ${i}` });
    }
    return arr;
  };