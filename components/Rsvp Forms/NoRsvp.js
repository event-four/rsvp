import { useRef, useContext } from "react";
import { useAppStates } from "/components/providers/AppContext";
import Link from "next/link";
import { GiftIcon } from "@heroicons/react/solid";
import { useFormData } from "/components/providers/FormProvider";

export default function NoRsvp({ event, formStep }) {
  const { rsvpUrls } = useAppStates();
  // const { data } = useFormData();
  const { data } = useFormData();

  useEffect(() => {
    if (Object.keys(data).length === 0) return;

    const payload = {
      ...data,
      eventId: event.id,
      rsvp: true,
    };

    postRsvpResponse(payload)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return (
    <>
      <div className={"block h-full"}>
        <div
          className=" text-center flex flex-col justify-between h-full  md:w-4/12 md:mx-auto "
          autoComplete="off"
        >
          <div className="space-y-6 flex flex-col flex-grow text-primary-dark mb-10">
            <h1 className="text-lg font-bold">Thank you!</h1>
            <p className="text-sm">
              We hoped you could share this special day with us, and know it is
              the same for you. Thanks for the wishes and see you soon.
            </p>

            <div className="flex flex-col">
              <span className="text-sm">Thank you,</span>
              <span className="text-lg md:text-3xl font-rochester mt-2">
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
                <a className="my-2 transition duration-150 ease-in-out focus:outline-none rounded bg-pink-600 text-primary-light border border-pink-600 px-6 py-3 text-sm  inline-flex text-center">
                  <GiftIcon
                    className=" mr-2 h-4 w-4 text-white"
                    aria-hidden="true"
                  />
                  Gift Registry
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
