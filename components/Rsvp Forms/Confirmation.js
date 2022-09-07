import { useRef, useContext, useEffect } from "react";
import { useFormData } from "/components/providers/FormProvider";
import * as yup from "yup";
import { Form } from "@unform/web";
import { useAppStates } from "/components/providers/AppContext";
import Link from "next/link";
import { GiftIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";

const schema = yup.object().shape({}, []);

export default function Confirmation({ event, formStep }) {
  const { rsvpUrls } = useAppStates();
  const { data } = useFormData();
  // console.log(rsvpUrls);

  useEffect(() => {
    // if (Object.keys(data).length === 0) return;
    // const payload = {
    //   ...data,
    //   eventId: event.id,
    // };
    // postRsvpResponse(payload)
    //   .then((response) => {
    //     // console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  });

  const isToday = (someDate) => {
    if (!someDate) return false;
    return dayjs().isSame(someDate, "day");
  };

  return (
    <>
      <div className={formStep == 4 ? "block h-full" : "block h-full "}>
        <div
          className=" text-center flex flex-col justify-between h-full  md:w-4/12 md:mx-auto items-center"
          autoComplete="off"
        >
          <div className="space-y-6 flex flex-col flex-growx text-primary-dark mb-4">
            <h1 className="text-lg font-bold">Thank you, {data.name}!</h1>

            {!isToday(event.startDate) && (
              <div className="space-y-6">
                <p className="text-sm">
                  We have received your confirmation and can't wait to share &
                  celebrate this special day with you!
                </p>
                <div className="flex flex-col">
                  <span className="text-sm">See you very soon,</span>
                </div>
              </div>
            )}

            {isToday(event.startDate) && (
              <div className="space-y-6">
                <p className="text-sm">
                  Thanks for the wishes! You will always be celebrated 💗💗
                </p>
              </div>
            )}
            <p className="text-primary-dark text-lg md:text-3xl font-rochester mt-2 mb-4">
              {event.title}
            </p>
          </div>

          <div className=" flex flex-col md:w-7/12 items-center mx-auto justify-end">
            <p className="text-[0.6rem] font-bold mb-1 md:mb uppercase">
              Check out our
            </p>
            <div className="md:flex-row">
              <Link href={`/w/${event.slug}/registry`}>
                <a className=" my-2 transition duration-150 ease-in-out focus:outline-none rounded bg-pink-600 text-primary-light border border-pink-600 px-6 py-3 text-sm w-full inline-flex">
                  <GiftIcon
                    className="mr-2 h-4 w-4 text-white"
                    aria-hidden="true"
                  />
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
