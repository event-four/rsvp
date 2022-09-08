import { useRouter } from "next/router";
import utils from "../../../consts/utils";
import { useState, useEffect } from "react";
import {
  PersonalInfo,
  OtherInfo,
  Confirmation,
  Wish,
} from "../../../components/Rsvp Forms";
import FormCard from "../../../components/FormCard";
import FormProvider from "/components/providers/FormProvider";
import InnerLayout from "../../../components/guests/InnerLayout";
import { useGetRsvpGeneralQuestions } from "../../../swr/useRsvpRequests";
import { eventService, useFetchEventRegistry } from "/services";

const Registry = () => {
  const [ev, setEv] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      const json = await utils.getFromStorage("event");
      setEv(JSON.parse(json));
    }
    fetchEvent();
  }, []);
  if (!ev) return;

  return (
    <InnerLayout>
      <RegistryPageBody event={ev} />
    </InnerLayout>
  );
};

const RegistryPageBody = ({ event }) => {
  const [cashRegistry, setCashRegistry] = useState();
  const [giftRegistry, setGiftRegistry] = useState();
  const [hasRegistry, setHasRegistry] = useState(false);
  const { data, loading, error } = useFetchEventRegistry(event.slug, false);
  const [activeRegistry, setActiveRegistry] = useState(0);

  useEffect(() => {
    if (data) {
      console.log(data);
      const csh = data.filter((r) => r.type === "cash");
      const gft = data.filter((r) => r.type === "gift");

      setCashRegistry(csh[0]);
      setGiftRegistry(gft);
      setHasRegistry((csh[0] && csh[0].active) || (gft && gft.length > 0));
    }
  }, [data]);

  return (
    <>
      <div className=" text-center flex flex-col items-center w-full h-full my-auto mx-auto justify-center">
        <div className="text-center text-primary-dark pt-4 mb-10">
          <p className="text-center page-title font-pacifico text-2xl md:text-5xl mb-4 text-shadow-md">
            Gift Registry
          </p>
          <p className="text-center font-rochester text-lg md:text-3xl my-6">
            {event.title}
          </p>
          {hasRegistry && (
            <p className="align-middle text-center md:max-w-lg mx-auto text-xs mt-6">
              Your love, laughter and company on our wedding day is the greatest
              gift of all. However, should you wish to celebrate us with a gift,
              we have registered some items and cash fund. Thank you!
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-6">
          {/* <p className="text-default text-sm">
            How would you like to celebrate us?
          </p> */}
          <ul
            role="list"
            class="flex flex-row justify-evenly divide-x divide-default rounded-md border border-default"
          >
            <li
              onClick={() => setActiveRegistry(0)}
              class={`flex items-center justify-between text-sm cursor-pointer px-4 py-3 font-medium  ${
                activeRegistry === 0 ? "bg-default text-white" : "text-default"
              }`}
            >
              Cash Gift
            </li>
            <li
              onClick={() => setActiveRegistry(1)}
              class={`flex items-center justify-between text-sm cursor-pointer px-4 py-3 font-medium ${
                activeRegistry === 1 ? "bg-default text-white" : "text-default"
              }`}
            >
              Buy a Gift
            </li>
          </ul>
        </div>
        <div className="flex flex-grow"></div>
        {!hasRegistry && (
          <>
            <p className="align-middle text-center w-full md:max-w-lg mx-auto">
              Your love, laughter and company on our wedding day is the greatest
              gift of all. However, should you wish to celebrate us with a gift,
              a registry is coming soon!
            </p>

            <div className="flex flex-col mt-7">
              <span className="">Love,</span>
              <span className="text-lg md:text-3xl font-rochester mt-2">
                {event.title}
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Registry;
