import { Urls } from "../helpers";
import { _post, _get } from "./index";

export const verifyEventSlug = async ({ slug, eventId }) => {
  const endpoint = Urls.verifyEventSlug;
  const payload = { slug: slug, eventId: eventId };
  //call api
  return _post(endpoint, payload);
};

export const updateEventSlug = async ({ slug, eventId }) => {
  const endpoint = Urls.updateEventData;
  const payload = { slug: slug, eventId: eventId };
  //call api
  return _post(endpoint, payload);
};

export const updateEventData = async (data) => {
  const endpoint = Urls.updateEventData;
  const payload = data;
  // console.log(data);
  //call api
  return _post(endpoint, payload);
};

export const getEventInfo = async (eventId) => {
  const endpoint = `${Urls.event}/${eventId}`;
  //call api
  return _get(endpoint);
};
