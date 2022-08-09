export { getFromStorage, setToStorage };

function getFromStorage(key) {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
}

function setToStorage(key, value) {
  if (typeof window !== "undefined") {
    return localStorage.setItem(key, value);
  }
  return null;
}
