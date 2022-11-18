const api = process.env.API;

const urls = {
  api: api,
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
  eventStory: api + "/event-stories",
  eventStoryBySlug: api + "/event-stories/by-slug",
  eventWishesBySlug: api + "/event-wishes/by-slug",
  eventRegistryBySlug: api + "/event-registries/by-slug",
  eventRegistry: api + "/event-registries",
  cashGifts: api + "/event-cash-gifts",
  getRsvpResponses: api + "/event-rsvp-question/responses",

  //vendors.
  vendorProfile: api + "/vendor-profiles",
  vendorService: api + "/vendor-services",
  vendorGallery: api + "/vendor-galleries",
};

export { urls };
