const api = process.env.API;

const urls = {
  login: api + "/auth/login",
  event: api + "/events",
  guests: api + "/event-guests",
  myEvent: api + "/my-events",
  eventBySlug: api + "/events/by-slug",
  getRsvpQuestions: api + "/event-rsvp-questions",
  rsvpQuestions: api + "/event-rsvp-questions",
  sendRsvp: api + "/event-guests/send-rsvp",
  postRsvp: api + "/event-rsvp/send-rsvp",

  //Custom Websites
  suggestEventSlug: api + "/events/suggest-slug",
  verifyEventSlug: api + "/events/verify-slug",
  updateEventData: api + "/events/update-event",
};

export { urls };
