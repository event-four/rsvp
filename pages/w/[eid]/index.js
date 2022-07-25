import { useRouter } from "next/router";
import Footer from "../../../components/guests/footer";
import dayjs from "dayjs";
import { useGetEventBySlug } from "../../../swr/useRsvpRequests";
import utils from "../../../consts/utils";
import { useEffect } from "react";
import { useAppStates } from "../../../context/AppContext";
import Link from "next/link";
import InnerLayout from "../../../components/guests/InnerLayout";

const EventPage = () => {
  const { setRsvpUrls, setRsvpEid } = useAppStates();
  const { query, isReady, asPath } = useRouter();
  let eid;
  useEffect(() => {
    console.log(query);

    if (!isReady) return;
    eid = query.eid;
    console.log(eid);
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
  }, []);

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

  date = ev.date
    ? dayjs(ev.date).format("MMMM DD, YYYY")
    : "Date To Be Announced";
  const daysDiff = dayjs(ev.date).diff(dayjs(), "day");
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
        <Link href={`${rsvpUrls.logistics}`}>
          <a className="homeBtn">Flights & Hotels</a>
        </Link>
      </div>
      <div className="hidden md:block mx-auto my-9">
        <img
          className="h-80 w-80 flex rounded-full ring-2 ring-white"
          src="/bg.jpeg"
          alt=""
        />
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
        <Link href={`${rsvpUrls.logistics}`}>
          <a className="homeBtn">Flights & Hotels</a>
        </Link>
      </div>
    </div>
  );
};

export default EventPage;
