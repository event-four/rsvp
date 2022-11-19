import { constants } from "/helpers";
import {
  getCookie,
  getCookies,
  setCookie,
  hasCookie,
  deleteCookie,
} from "cookies-next";
import { fetchWrapper, urls } from "/helpers";
import { useSession } from "next-auth/react";

export const userService = { login, logout, getUser, setUser, getJWT };
export { useUpdateUser };

const useUpdateUser = (payload) => {
  const url = urls.userProfile + "/" + payload.profileId;

  return fetchWrapper.put(url, payload, { swr: false, authorize: true });
};

async function login(token) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  };

  const res = await fetch(urls.login, requestOptions);

  if (!res.ok) {
    const err = res.json();
    throw err.error;
  }

  return res.json();
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  // localStorage.removeItem('user');
  // userSubject.next(null);
  // Router.push('/login');
}

function getUser() {
  const cookie = getCookie(constants.UIF);
  // console.log("cookie", cookie);
  if (!cookie) {
    console.log("CK not found");
    return null;
  }
  const user = JSON.parse(cookie.trim());
  return user;
}

function setUser(user) {
  // console.log("setting user", user);
  const value = JSON.stringify(user);
  const key = constants.UIF;

  setCookie(constants.UIF, value, {
    path: "/",
    sameSite: true,
    // httpOnly: true,
  });
}

function getJWT() {
  // const [cookies, setCookie] = useCookies([constants.UIF]);
  const cookie = getCookie(constants.UIF);
  if (!cookie) return null;
  const { jwt } = JSON.parse(cookie);
  return jwt;
}
