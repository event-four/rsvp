import { urls, fetchWrapper } from "/helpers";
import { _post, _get } from "./index";
import useSWR from "swr";
import { swrResponse, userService } from "/services";
import { setToStorage, getFromStorage, constants } from "/helpers";
import {
  getCookie,
  getCookies,
  setCookie,
  hasCookie,
  deleteCookie,
} from "cookies-next";
import { authHeader } from "@/helpers/fetch-wrapper";
export const vendorService = {};

export {
  useFetchVendorProfile,
  useUpdateVendorProfile,
  useUpdateVendorProfilePhoto,
  useUpdateVendorService,
  useGetVendorServices,
  usePostVendorService,
  useUpdateVendorServicePrice,
  useDeleteVendorService,
};

// function setLocalStorageEvent(event) {
//   return setToStorage(constants.EVENT, JSON.stringify(event));
// }

// function getLocalStorageEvent() {
//   const data = getFromStorage(constants.EVENT);
//   return data ? JSON.parse(data) : null;
// }

const useFetchVendorProfile = (id) => {
  const url = urls.vendorProfile + "/" + id;
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: false });

  return swrResponse(useSWR(url, fetcher));
};

const useUpdateVendorProfile = (payload) => {
  const url = urls.vendorProfile + "/" + payload.id;
  return fetchWrapper.put(url, payload, { swr: false, authorize: true });
};

const useUpdateVendorProfilePhoto = async (payload, id) => {
  const url = urls.api + "/upload";
  // const url = urls.vendorProfile + "/8";
  const requestOptions = {
    method: "POST",
    headers: {
      // "Content-Type": "application/json",
      // "Content-Type": "multipart/form-data",
      ...authHeader(url, { authorize: true }),
    },
    body: payload,
    // body: { payload, data: {} },
  };
  // console.log(requestOptions);
  const response = await fetch(url, requestOptions);
  console.log(response);
  // return fetchWrapper.put(url, payload, { swr: false, authorize: true });
};

const useGetVendorServices = (vendorId) => {
  const url = urls.vendorService + `?vendorId=${vendorId}`;
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: true });
  return swrResponse(useSWR(url, fetcher));
};

const usePostVendorService = (payload) => {
  const url = urls.vendorService;
  return fetchWrapper.post(url, payload, { swr: false, authorize: true });
};

const useUpdateVendorService = (payload, serviceId) => {
  const url = urls.vendorService + "/" + serviceId;
  return fetchWrapper.post(url, payload, { swr: false, authorize: true });
};

const useUpdateVendorServicePrice = (payload, serviceId) => {
  const url = urls.vendorService + "/" + serviceId;
  return fetchWrapper.put(url, payload, { swr: false, authorize: true });
};
const useDeleteVendorService = (serviceId) => {
  const url = urls.vendorService + "/" + serviceId;
  return fetchWrapper.delete(url, { swr: false, authorize: true });
};

const useFetchEventInfoByOwnerId = (id) => {
  const url = urls.event + "?owner=" + id + "&publicationState=preview";
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: true });

  return swrResponse(useSWR(url, fetcher));
};

const useFetchRsvpQuestions = (event) => {
  const url = urls.getRsvpQuestions + "?slug=" + event.slug;
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: true });

  return swrResponse(useSWR(url, fetcher));
};

const useFetchEventStory = (slug) => {
  const url = urls.eventStoryBySlug + "/" + slug;
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: false });

  return swrResponse(useSWR(url, fetcher));
};

const useFetchEventWishes = (slug, page) => {
  const url =
    urls.eventWishesBySlug +
    "/" +
    slug +
    `?pagination[page]=${page}&pagination[pageSize]=${1}`;
  return fetchWrapper.get(url, { swr: false, authorize: true });
};

const useFetchEventRegistry = (slug, authorize = true) => {
  const url = urls.eventRegistryBySlug + "/" + slug;
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: authorize });

  return swrResponse(useSWR(url, fetcher));
};

const useFetchRsvpResponses = (eid) => {
  const url = urls.getRsvpResponses + "/" + eid;
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: true });

  return swrResponse(useSWR(url, fetcher));
};

const postRsvpQuestions = (payload) => {
  const url = urls.rsvpQuestions + "/" + payload.id;
  console.log(url);
  // const payload = { question: questionId, response: response };
  return fetchWrapper.put(url, payload, { swr: false, authorize: true });

  // return _post(url, payload);
};

const postRsvpResponse = (payload) => {
  // console.log(payload.answers);
  let answers = Object.values(payload.answers).flat();
  let ans = {};
  answers.forEach((a) => {
    ans[a.id] = a.value;
    // console.log({ ans });
  });
  payload.answers = ans;
  console.log(payload);

  const url = urls.postRsvp;
  console.log(url);
  // const payload = { question: questionId, response: response };
  return fetchWrapper.post(url, payload, { swr: false, authorize: false });
};

const useFetchGuests = (event) => {
  const url = urls.guests + "/event/" + event.id;
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: true });

  return swrResponse(useSWR(url, fetcher));
};
