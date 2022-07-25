const api = process.env.API;

export default {
  eventBySlug: api + "/events/by-slug",
  getRsvpQuestions: api + "/event-rsvp-questions",
  sendRsvp: api + "/event-guests/send-rsvp",
};
