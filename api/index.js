export * from "./api_events";
import axios from "axios";

export const JsonHeader = {
  "Content-Type": "application/json",
};
export const debounce = (func, wait) => {
  let timerId;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export const CheckResponse = (response) => {
  console.log(response);
  if (response.ok) return response.json();
  return response.json().then((response) => {
    // console.log(response);
    throw new Error(response.error);
  });

  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  }
  if (response.status >= 400 && response.status <= 499) {
    response.text().then((m) => {});
    console.log(response.text());
  } else {
    throw Error(response.statusText);
  }
};

export const _post = async (endpoint, payload) => {
  return axios
    .post(endpoint, { data: payload })
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error) {
      throw new Error(error.response.data.error.message);
    });
  return fetch(endpoint, {
    method: "POST",
    headers: JsonHeader,
    body: JSON.stringify({ data: payload }),
  })
    .then((response) => {
      if (response.ok) return response.json();
      return response.json().then((response) => {
        throw new Error(response.error);
      });
    })
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((error) => Promise.reject(error.message));
};

export const _get = async ({ endpoint, params }) => {
  return axios
    .get(endpoint, { params: { ...params } })
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error) {
      console.log(error);
      throw new Error(error.response.data.error.message);
    });
};
