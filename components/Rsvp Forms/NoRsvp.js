import { useRef, useContext } from "react";
import { useFormData } from "../../context/rsvp";
import { useAppStates } from "../../context/AppContext";
import Link from "next/link";
import { GiftIcon } from "@heroicons/react/solid";
export default function NoRsvp({ event, formStep }) {
  const { rsvpUrls } = useAppStates();
  // const { data } = useFormData();
  ////
  return (
    <>
      <div className={"block h-full"}>
        <div
          className=" text-center flex flex-col justify-between h-full  md:w-4/12 md:mx-auto "
          autoComplete="off"
        >
          <div className="space-y-6 flex flex-col flex-grow text-primary-dark">
            <h1 className="text-lg font-bold">Thank you!</h1>
            <p className="text-sm">
              We have received your confirmation and we understand that you
              won't be able to share & celebrate this special day with us!
            </p>
            <p className="text-sm">
              If you ever change your mind or have any other question, please
              reach out to us or come back to this page.
            </p>
            <div className="flex flex-col">
              <span className="text-sm">Thank you,</span>
              <span className="text-xl md:text-3xl font-rochester mt-2">
                {event.title}
              </span>
            </div>
          </div>

          <div className=" flex flex-col md:w-7/12 items-center mx-auto justify-end">
            <p className="text-[0.6rem] font-bold mb-1 md:mb-0 uppercase">
              Check out our
            </p>
            <div className="md:flex-row">
              <Link href={`${rsvpUrls.registry}`}>
                <a className="homeBtn my-2 transition duration-150 ease-in-out focus:outline-none rounded bg-pink-600 text-primary-light border border-pink-600 px-6 py-3 text-sm w-full inline-flex">
                  <GiftIcon
                    className="-ml-0.5 mr-2 h-4 w-4 text-white"
                    aria-hidden="true"
                  />{" "}
                  Wish List
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
