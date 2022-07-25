import { useRef, useContext } from "react";
import { useFormData } from "../../context/rsvp";
import * as yup from "yup";
import { Form } from "@unform/web";
import { useAppStates } from "../../context/AppContext";
import Link from "next/link";

const schema = yup.object().shape({}, []);

export default function Confirmation({ event, formStep }) {
  const { rsvpUrls } = useAppStates();
  const { data } = useFormData();
  //
  return (
    <>
      <div className={formStep == 4 ? "block h-full" : "block h-full "}>
        <div
          className=" text-center flex flex-col justify-between h-full  md:w-4/12 md:mx-auto "
          autoComplete="off"
        >
          <div className="space-y-6 flex flex-col flex-grow">
            <h1 className="text-lg font-bold">Thank you, {data.name}!</h1>
            <p className="text-sm">
              We have received your confirmation and can't wait to share &
              celebrate this special day with you!
            </p>
            <p className="text-sm">
              If you ever change your mind or have any other question, please
              reach out to us or come back to this page.
            </p>
            <div className="flex flex-col">
              <span className="text-sm">See you very soon,</span>
              <span className="text-xl md:text-3xl font-rochester mt-2">
                {event.title}
              </span>
            </div>
          </div>

          <div className=" flex flex-col md:w-7/12 items-center mx-auto justify-end">
            <p className="text-[0.6rem] font-bold mb-4 md:mb uppercase">
              Check out our
            </p>
            <div className="md:flex-row">
              <Link href={`${rsvpUrls.registry}`}>
                <a className="homeBtn">Wish List</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
