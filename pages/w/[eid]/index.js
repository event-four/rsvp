import { useRouter } from "next/router";
import Footer from "../../../components/guests/footer";
import dayjs from "dayjs";
import { useGetEventBySlug } from "../../../swr/useRsvpRequests";
import utils from "../../../consts/utils";
import { useEffect } from "react";
import { useAppStates } from "/components/providers/AppContext";
import Link from "next/link";
import InnerLayout from "../../../components/guests/InnerLayout";

const EventPage = () => {
  const { setRsvpUrls, setRsvpEid } = useAppStates();
  console.log(useAppStates());
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

  return <InnerLayout>{<EventPageBody />}</InnerLayout>;
};

const EventPageBody = () => {
  const { rsvpEid, rsvpUrls } = useAppStates();

  console.log(rsvpEid);

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
  let date, countdown;

  utils.setToStorage("event", JSON.stringify(ev));

  date = ev.startDate
    ? dayjs(ev.startDate).format("MMMM DD, YYYY")
    : "Date To Be Announced";
  const daysDiff = dayjs(ev.startDate).diff(dayjs(), "day");
  countdown = daysDiff
    ? ` ${daysDiff} ${daysDiff > 1 ? "days" : "day"} to go!`
    : "";

  return (
    <div className=" w-full flex flex-col flex-grow justify-between p-6x">
      <div className="text-center text-primary-dark pt-20 md:pt-0">
        <p className="text-center font-rochester text-4xl md:text-5xl mb-4">
          {ev.title}
        </p>
        <p className="mb-1">
          {date} • {ev.city}
        </p>
        <p>{countdown}</p>
      </div>
      <div className="container hidden md:flex flex-col md:flex-row md:w-7/12 items-center  my-5 mx-auto justify-center">
        <Link href={`${rsvpUrls.story}`}>
          <a className="homeBtn">Our Story</a>
        </Link>
        <Link href={`${rsvpUrls.rsvp}`}>
          <a className="homeBtn">RSVP</a>
        </Link>

        <Link href={`${rsvpUrls.registry}`}>
          <a className="homeBtn">Gift Registry</a>
        </Link>
        {/* <Link href={`${rsvpUrls.logistics}`}>
          <a className="homeBtn">Flights & Hotels</a>
        </Link> */}
      </div>
      <div className="hiddenx md:block mx-auto my-9">
        {ev.coverMedia && ev.coverMedia.resource_type === "image" && (
          <img
            className={`${
              ev.coverMedia.public_id.length === 0
                ? "hidden"
                : "block h-full w-auto mx-auto"
            }`}
            src={`${ev.coverMedia.secure_url}`}
          ></img>
        )}

        {ev.coverMedia && ev.coverMedia.resource_type === "video" && (
          <video
            className={`${
              ev.coverMedia.public_id.length === 0 ? "hidden" : "block"
            } h-full w-auto mx-auto`}
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
        <Link href={`${rsvpUrls.story}`}>
          <a className="homeBtn">Our Story</a>
        </Link>
        <Link href={`${rsvpUrls.rsvp}`}>
          <a className="homeBtn">RSVP</a>
        </Link>

        <Link href={`${rsvpUrls.registry}`}>
          <a className="homeBtn">Gift Registry</a>
        </Link>
        {/* <Link href={`${rsvpUrls.logistics}`}>
          <a className="homeBtn">Flights & Hotels</a>
        </Link> */}
      </div>
    </div>
  );
};

export default EventPage;
