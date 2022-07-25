import useSWR from "swr";
import endpoints from "../consts/urls";

const useGetEventBySlug = (slug) => {
  const endpoint = endpoints.eventBySlug + "/" + slug;
  console.log(endpoint);
  // Fetch data from external API
  const fetcher = (endpoint) => fetch(endpoint).then((res) => res.json());

  const { data, error } = useSWR(endpoint, fetcher);

  return {
    event: data,
    isLoading: !error && !data,
    isError: error,
  };
};

const useGetRsvpGeneralQuestions = (slug) => {
  const endpoint = endpoints.getRsvpQuestions + "?slug=" + slug;
  const fetcher = (endpoint) => fetch(endpoint).then((res) => res.json());

  const { data, error } = useSWR(endpoint, fetcher);

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export { useGetEventBySlug, useGetRsvpGeneralQuestions };
