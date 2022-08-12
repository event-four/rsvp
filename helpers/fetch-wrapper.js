import getConfig from "next/config";

import { userService } from "services";

const { publicRuntimeConfig } = getConfig();

export const fetchWrapper = {
  get,
  post,
  put,
  delete: _delete,
};

export { authHeader };

function get(url, { authorize = true, swr = false }) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(url, { authorize }),
    },
  };

  return swr
    ? async (url) => {
        const res = await fetch(url, requestOptions);
        if (!res.ok) {
          const error = await res.json();
          throw error.error;
        }
        return res.json();
      }
    : fetch(url, requestOptions).then(handleResponse);
}

async function post(url, body, { authorize = true, swr = false }) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(url, { authorize }),
    },
    // credentials: "include",
    body: JSON.stringify({ data: body }),
  };
  // console.log(requestOptions);
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

async function put(url, body, { authorize = true, swr = false }) {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(url, { authorize }),
    },
    body: JSON.stringify({ data: body }),
  };

  console.log(requestOptions);
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(url),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse(response);
}

// helper functions

function authHeader(url, { authorize }) {
  // return auth header with jwt if user is logged in and request is to the api url
  // const user = userService.userValue;
  const isLoggedIn = true; //user && user.token;
  const token = userService.getJWT();
  // const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
  if (isLoggedIn) {
    return authorize ? { Authorization: `Bearer ${token}` } : "";
  } else {
    return {};
  }
}

function handleResponseSWR(response) {
  return response.json();
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      // if ([401, 403].includes(response.status) && userService.userValue) {
      //     // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      //     userService.logout();
      // }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
