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

/**
 * Decode JWT token and return payload
 * @param {string} token - JWT token
 * @returns {object} - Decoded token payload
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const getArrayLevel = (num) => {
    const arr = [];
    for (let i = 1; i <= num; i++) {
      arr.push({ value: `Level ${i}`, label: `Level ${i}` });
    }
    return arr;
  };