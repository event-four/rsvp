const api = process.env.API;
const Urls = {
  event: api + "/events",
  eventBySlug: api + "/events/by-slug",
  getRsvpQuestions: api + "/event-rsvp-questions",
  sendRsvp: api + "/event-guests/send-rsvp",

  //Custom Websites
  suggestEventSlug: api + "/events/suggest-slug",
  verifyEventSlug: api + "/events/verify-slug",
  updateEventData: api + "/events/update-event",
};

export { Urls };
