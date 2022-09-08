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
export const eventService = {
  verifyEventSlug,
  updateEventSlug,
  updateEventData,
  updateEventStory,
  getEventInfo,
  getLocalStorageEvent,
  setLocalStorageEvent,
  setLaunchedDashboard,
  postRegistryData,
  updateRegistryData,
};

export {
  useFetchEvents,
  useFetchEventInfo,
  useFetchEventInfoByOwnerId,
  useFetchRsvpQuestions,
  postRsvpQuestions,
  postRsvpResponse,
  useFetchGuests,
  useFetchEventStory,
  useFetchEventWishes,
  useFetchRsvpResponses,
  useFetchEventRegistry,
};

function setLocalStorageEvent(event) {
  return setToStorage(constants.EVENT, JSON.stringify(event));
}

function getLocalStorageEvent() {
  const data = getFromStorage(constants.EVENT);
  return data ? JSON.parse(data) : null;
}

function setLaunchedDashboard(email) {
  const key = constants.LAUNCHED_DSH;
  setCookie(key, email, {
    path: "/",
    sameSite: true,
    // httpOnly: true,
  });
}
async function verifyEventSlug({ slug, eventId }) {
  const endpoint = urls.verifyEventSlug;
  const payload = { slug: slug.trim(), eventId: eventId };
  //call api
  return _post(endpoint, payload);
}

async function updateEventSlug({ slug, eventId }) {
  const endpoint = urls.updateEventData;
  const payload = { slug: slug.trim(), eventId: eventId };
  //call api
  return _post(endpoint, payload);
}

async function updateEventData(data) {
  const endpoint = urls.updateEventData;
  const payload = data;
  //call api
  return _post(endpoint, payload);
}

async function updateEventStory(data) {
  const endpoint = urls.eventStory;
  const payload = data;

  //call api
  return fetchWrapper.post(endpoint, payload, { swr: false, authorize: true });
}

async function getEventInfo(eventId) {
  const endpoint = `${urls.event}/${eventId}`;
  //call api
  return _get(endpoint);
}
async function postRegistryData(payload) {
  const url = urls.eventRegistry;
  console.log(url);
  return fetchWrapper.post(url, payload, { swr: false, authorize: true });
}

async function updateRegistryData(payload, id) {
  const url = urls.eventRegistry + "/" + id;
  console.log(url);
  return fetchWrapper.put(url, payload, { swr: false, authorize: true });
}

async function postCashGift(payload, id) {
  const url = urls.eventRegistry + "/" + id;
  console.log(url);
  return fetchWrapper.put(url, payload, { swr: false, authorize: true });
}

const useFetchEvents = (user) => {
  // const user = userService.getUser();
  const url =
    urls.event + "?owner=" + user.profile.id + "&publicationState=preview";
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: true });
  return swrResponse(useSWR(url, fetcher));
};

const useFetchEventInfo = (id) => {
  const url = urls.event + "/" + id;
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: true });

  return swrResponse(useSWR(url, fetcher));
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
    `?pagination[page]=${page}&pagination[pageSize]=1`;
  const fetcher = fetchWrapper.get(url, { swr: true, authorize: true });

  return swrResponse(useSWR(url, fetcher));
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
