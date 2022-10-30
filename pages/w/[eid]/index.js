import { useRouter } from "next/router";
import Footer from "../../../components/guests/footer";
import dayjs from "dayjs";
import { useGetEventBySlug } from "../../../swr/useRsvpRequests";
import utils from "../../../consts/utils";
import { useEffect } from "react";
import { useAppStates } from "/components/providers/AppContext";
import Link from "next/link";
import InnerLayout from "../../../components/guests/InnerLayout";
import LocationOnIcon from "@mui/icons-material/LocationOn";
// const dayjs = require("dayjs");
import { useFetchEventStory } from "/services";

const EventPage = () => {
  const { setRsvpUrls, setRsvpEid } = useAppStates();

  const router = useRouter();
  let eid;
  useEffect(() => {
    // console.log(router.query);

    if (router.isReady) {
      let { eid } = router.query;
      // console.log(eid);
      if (!eid) return null;
      ///
      const urls = {
        home: `/w/${eid}`,
        rsvp: `/w/${eid}/rsvp`,
        registry: `/w/${eid}/registry`,
        date: `/w/${eid}/date-location`,
        logistics: `/w/${eid}/flights-hotels`,
        story: `/w/${eid}/our-story`,
      };

      setRsvpUrls(urls);
      setRsvpEid(eid);
      // console.log("sett");
    }
  }, [router.isReady]);

  return <InnerLayout>{<EventPageLoader />}</InnerLayout>;
};

const EventPageLoader = () => {
  const { rsvpEid, rsvpUrls } = useAppStates();

  const { event, isLoading, isError } = useGetEventBySlug(rsvpEid);

  ///
  if (isError) {
    console.log(isError);
  }
  if (isLoading)
    return (
      <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
        <p className="align-middle w-full"> Loading...</p>
      </div>
    );
  if (isError)
    return (
      <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
        <p className="align-middle w-full"> Something went wrong!</p>
      </div>
    );
  if (!event.data)
    return (
      <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
        <p className="align-middle w-full"> Event Not Found</p>
      </div>
    );

  //  All is loaded!
  const ev = event.data;

  return <EventPageBody event={ev} />;
};

const EventPageBody = ({ event }) => {
  const { rsvpEid, rsvpUrls } = useAppStates();

  // const { event, isLoading, isError } = useGetEventBySlug(rsvpEid);
  const { data: story, loading, error } = useFetchEventStory(event.slug);

  ///
  // if (isError) {
  //   console.log(isError);
  // }
  // if (isLoading)
  //   return (
  //     <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
  //       <p className="align-middle w-full"> Loading...</p>
  //     </div>
  //   );
  // if (isError)
  //   return (
  //     <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
  //       <p className="align-middle w-full"> Something went wrong!</p>
  //     </div>
  //   );
  // if (!event.data)
  //   return (
  //     <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
  //       <p className="align-middle w-full"> Event Not Found</p>
  //     </div>
  //   );

  //  All is loaded!
  const ev = event;
  let date, countdown;
  //
  utils.setToStorage("event", JSON.stringify(ev));

  date = ev.startDate
    ? dayjs(ev.startDate).format("MMMM DD, YYYY")
    : "Date To Be Announced";
  const daysDiff = dayjs(ev.startDate).diff(dayjs(), "day");
  countdown = daysDiff
    ? ` ${daysDiff} ${daysDiff > 1 ? "days" : "day"} to go!`
    : "";

  const isToday = (someDate) => {
    if (!someDate) return false;
    return dayjs().isSame(someDate, "day");
  };

  return (
    <div className=" w-full flex flex-col flex-grow justify-between p-6x">
      <div className="text-center text-primary-dark pt-20 md:pt-0">
        <p className="text-center font-rochester text-4xl md:text-5xl mb-4">
          {ev.title}
        </p>
        <p className="mb-1">{date}</p>
        <p className="mb-1">
          <LocationOnIcon />{" "}
          {ev.metadata && ev.metadata.location && (
            <span> {ev.metadata.location}, </span>
          )}
          {ev.city}
        </p>

        <p>{countdown}</p>
      </div>
      <div className="container hidden md:flex flex-col md:flex-row md:w-7/12 items-center  my-5 mx-auto justify-center">
        {story && (
          <Link href={`${rsvpUrls.story}`}>
            <a className="homeBtn">Our Story</a>
          </Link>
        )}
        {!isToday(ev.startDate) && (
          <Link href={`${rsvpUrls.rsvp}`}>
            <a className="homeBtn">RSVP</a>
          </Link>
        )}
        {isToday(ev.startDate) && ev.type.name === "Wedding" && (
          <Link href={`${rsvpUrls.rsvp}`}>
            <a className="homeBtn">Drop a Wish</a>
          </Link>
        )}

        <Link href={`${rsvpUrls.registry}`}>
          <a className="homeBtn">Gift Registry</a>
        </Link>
        {/* <Link href={`${rsvpUrls.logistics}`}>
          <a className="homeBtn">Flights & Hotels</a>
        </Link> */}
      </div>
      <div className="hiddenx flex md:block my-9 justify-center items-center">
        {ev.coverMedia && ev.coverMedia.resource_type === "image" && (
          <img
            className={`${
              ev.coverMedia.public_id.length === 0
                ? "hidden"
                : "block h-auto w-auto max-h-96 mx-auto rounded-xl"
            }`}
            src={`${ev.coverMedia.secure_url}`}
          ></img>
        )}

        {ev.coverMedia && ev.coverMedia.resource_type === "video" && (
          <video
            className={`${
              ev.coverMedia.public_id.length === 0 ? "hidden" : "block"
            } h-auto w-full`}
            autoPlay
            controls
            muted
            src={`${ev.coverMedia.secure_url}`}
          ></video>
        )}
        {/* <img
          className="h-auto max-h-10 w-full flex rounded-fullx ring-2 ring-white"
          src="/bg.jpeg"
          alt=""
        /> */}
      </div>

      <div className="container md:hidden flex flex-col md:flex-row md:w-7/12 items-center mb-5 mx-auto justify-center">
        {story && (
          <Link href={`${rsvpUrls.story}`}>
            <a className="homeBtn">Our Story</a>
          </Link>
        )}

        {!isToday(ev.startDate) && (
          <Link href={`${rsvpUrls.rsvp}`}>
            <a className="homeBtn">RSVP</a>
          </Link>
        )}
        {isToday(ev.startDate) && ev.type.name === "Wedding" && (
          <Link href={`${rsvpUrls.rsvp}`}>
            <a className="homeBtn">Drop a Wish</a>
          </Link>
        )}
        <Link href={`${rsvpUrls.registry}`}>
          <a className="homeBtn">Gift Registry</a>
        </Link>
        {/* <Link href={`${rsvpUrls.logistics}`}>
          <a className="homeBtn">Flights & Hotels</a>
        </Link> */}
      </div>

      <div className="container flex flex-col justify-center  mb-5 text-primary-dark items-center mx-auto rounded-lg text-center">
        <dl>
          {ev.metadata && ev.metadata.theme && (
            <div className=" px-4 py-3 flex flex-col">
              <dt className="text-sm  font-pacifico">Theme</dt>
              <dd className="mt-1">{ev.metadata.theme}</dd>
            </div>
          )}
          {ev.metadata && ev.metadata.color && (
            <div className=" px-4 py-3 flex flex-col">
              <dt className="text-sm font-pacifico">Colour of the Day</dt>
              <dd className="mt-1">{ev.metadata.color}</dd>
            </div>
          )}
          {ev.metadata && ev.metadata.dressCode && (
            <div className=" px-4 py-3 flex flex-col">
              <dt className="text-sm font-medium font-pacifico">Dress Code</dt>
              <dd className="mt-1 ">{ev.metadata.dressCode}</dd>
            </div>
          )}
          {ev.metadata && ev.metadata.otherInfo && (
            <div className=" px-4 py-3 flex flex-col">
              <dt className="text-sm font-medium font-pacifico">
                Other Information
              </dt>
              <dd className="mt-1 ">{ev.metadata.otherInfo}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default EventPage;
