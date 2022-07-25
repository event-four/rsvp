export default {
  getFromStorage: async (key) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  },
  setToStorage: async (key, value) => {
    if (typeof window !== "undefined") {
      return localStorage.setItem(key, value);
    }
    return null;
  },
};
