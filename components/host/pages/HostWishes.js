import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "../Upload";
import {
  createRef,
  useRef,
  useEffect,
  useCallback,
  useState,
  memo,
} from "react";
import { eventService, useFetchEventWishes } from "/services";
import { urls, fetchWrapper } from "/helpers";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import EditIcon from "@mui/icons-material/Edit";
import Section from "../Section";
import IconButton from "@mui/material/IconButton";

const dayjs = require("dayjs");

const WZWishes = ({ event, pageTitle, pss }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  // const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [finished, setFinished] = useState(false);
  const pageCount = useRef(0);
  const total = useRef(0);
  const page = useRef(1);
  // const finished = useRef(false);

  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    // console.log(page.current);
    const url =
      urls.eventWishesBySlug +
      "/" +
      event.slug +
      `?pagination[page]=${page.current}`;

    // console.log(url);
    const fetcher = await fetchWrapper.get(url, {
      swr: false,
      authorize: true,
    });

    setLoadingMore(false);

    if (fetcher) {
      const { data, meta } = fetcher;
      // setPage(meta.page + 1);
      console.log("meta.page", data);

      if (data && data.length > 0) {
        // let w = [...wishes, ...data];

        setWishes((old) => [...old, ...data]);
        // finished.current = false;
        // console.log("added...");
      } else {
        // finished.current = true;
        // setFinished(true);
        // console.log("empty...");
      }

      page.current = meta.page + 1;
      pageCount.current = meta.pageCount;
      total.current = meta.total;

      if (meta.page >= meta.pageCount) {
        setFinished(true);
      }
    }

    setLoadingMore(false);
  });

  useEffect(() => {
    loadMore();
  }, []);

  // if (loading) {
  //   return <>Loading...</>;
  // }
  // if (error) {
  //   return <>Error occurred...</>;
  // }

  return (
    <>
      <h1 className="text-lg font-semibold">
        {pageTitle} {`(${total.current})`}
      </h1>
      <Section title="">
        <div className="flex flex-col space-y-2 my-12 justify-center items-center">
          {wishes && wishes.length === 0 && (
            <div className="text-sm text-center flex flex-col">
              <div className="text-md font-semibold">No wishes yet!</div>
              <div className="text-gray-500 text-sm mt-2">
                Remember to share your website with your guests.
              </div>
            </div>
          )}
          {wishes &&
            wishes.length > 0 &&
            wishes.map((wish, index) => (
              <div
                key={index}
                className="w-full md:w-[500px]  mx-auto rounded-lg bg-white shadow-lg px-5 pt-5 pb-10 text-gray-800"
              >
                <div className="w-full mb-10 ">
                  <div className="text-4xl text-default text-left leading-tight h-3">
                    “
                  </div>
                  <p className="text-sm text-gray-600 text-center px-5">
                    {wish.wish}
                  </p>
                  <div className="text-4xl text-default text-right leading-tight h-3 -mt-3">
                    ”
                  </div>
                </div>
                <div className="w-full">
                  <p className="text-md text-default font-bold text-center">
                    {wish.guest && wish.guest.name}
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    {dayjs(wish.date).format("MMMM DD, YYYY")}
                  </p>
                </div>
              </div>
            ))}
        </div>
        {!finished && (
          <div className="flex justify-center mt-6 ">
            <LoadingButton
              loading={loadingMore}
              variant="outlined"
              onClick={loadMore}
            >
              See more
            </LoadingButton>
          </div>
        )}
      </Section>
    </>
  );
};

export default memo(WZWishes);
