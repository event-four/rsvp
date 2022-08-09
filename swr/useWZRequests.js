import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { Api, Urls, constants } from "/helpers";
import endpoints from "../consts/urls";
import { Cookies, useCookies } from "react-cookie";
// const cookies = new Cookies();
const fetcher = (url) => fetch(url).then((res) => res.json());

const useFetchEventInfo = (id) => {
  const endpoint = Urls.event + "/" + id;
  const jwt = "cookies[]";
  console.log(jwt);

  // Fetch data from external API
  const { data, error } = useSWR(endpoint, fetcher);

  console.log(data);
  console.log(error);

  return {
    event: data,
    isLoading: !error && !data,
    isError: error,
  };
};

const useSuggestEventSlug = (formData) => {
  const endpoint = endpoints.suggestEventSlug;
  console.log(endpoint);
  // Fetch data from external API
  const fetcher = (endpoint) =>
    fetch(endpoint, {
      body: JSON.stringify({ data: formData }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((res) => res.json());

  const { data, error } = useSWRImmutable(endpoint, fetcher);
  // console.log(data);
  return {
    event: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export { useSuggestEventSlug, useFetchEventInfo };
