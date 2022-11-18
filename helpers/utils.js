export { getFromStorage, setToStorage, toMoneyFormat };

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

function toMoneyFormat(number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(number);
}
