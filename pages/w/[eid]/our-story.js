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
import { useFetchEventStory } from "/services";
import Image from "next/image";

const OurStory = () => {
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
      <OurStoryPageBody event={ev} />
    </InnerLayout>
  );
};

const OurStoryPageBody = ({ event }) => {
  const router = useRouter();
  const { asPath } = useRouter();
  const { data: story, loading, error } = useFetchEventStory(event.slug);
  console.log(error);

  if (loading)
    return (
      <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
        <p className="align-middle w-full"> Loading...</p>
      </div>
    );
  if (error && error.status !== 404)
    return (
      <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
        <p className="align-middle w-full"> Something went wrong!</p>
      </div>
    );
  if (!story)
    return (
      <div className="absolutex text-center flex items-center w-full h-full my-auto mx-auto content-center justify-center">
        <div className="flex flex-col justify center">
          <p className="align-middle w-full">
            Our story is a beautiful one and we are going to update this page
            soon!
          </p>
          <div className="flex flex-col mt-7">
            <span className="">Love,</span>
            <span className="text-lg md:text-3xl font-rochester mt-2">
              {event.title}
            </span>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col flex-grow">
      <div className="text-center text-primary-dark pt-4 mb-10">
        <p className="text-center page-title font-pacifico text-2xl md:text-5xl mb-4 text-shadow-md">
          Our Story
        </p>
        {/* <p className="text-center font-rochester text-2xl md:text-5xl mb-6">
          {event.title}
        </p> */}
        <p className="text-center font-rochester text-2xl md:text-5xl mb-6">
          {story.title}
        </p>

        {story && (
          <div>
            <div className="hiddenx md:block mx-auto my-9 ">
              {story.photo && story.photo.resource_type === "image" && (
                <img
                  className={`${
                    story.photo.public_id.length === 0
                      ? "hidden"
                      : "block h-auto w-auto max-h-96 mx-auto rounded-xl"
                  }`}
                  src={`${story.photo.secure_url}`}
                />
              )}
            </div>

            <div
              className="w-full sm:w-6/12 sm:mx-auto text-center"
              dangerouslySetInnerHTML={{ __html: story.story ?? "" }}
            ></div>
          </div>
        )}

        <div className="text-lg md:text-3xl font-rochester mt-6">
          {event.title}
        </div>
      </div>
    </div>
  );
};

export default OurStory;
