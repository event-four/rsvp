export * from "./event-service";
export * from "./user-service";
import axios from "axios";

export const swrResponse = (response) => {
  const { data, error } = response;
  return {
    data: data ? data.data : data,
    meta: data && data.meta ? data.meta : {},
    loading: !error && !data,
    error: error,
  };
};

export const _post = async (endpoint, payload) => {
  console.log(payload);
  return axios
    .post(endpoint, { data: payload })
    .then(function (response) {
      return response.data.data;
    })
    .catch(function (error) {
      console.log(error);
      throw new Error(error.response.data.error.message);
    });
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
