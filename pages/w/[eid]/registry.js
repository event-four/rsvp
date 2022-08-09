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
  return (
    <>
      <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
        <p className="align-middle w-full"> Coming soon...</p>
      </div>
    </>
  );
  const router = useRouter();
  const { asPath } = useRouter();
  const { data, isLoading, isError } = useGetRsvpGeneralQuestions(event.slug);

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
  if (!data)
    return (
      <div className="absolute text-center flex items-center w-full h-full my-auto mx-auto content-center">
        <p className="align-middle w-full"> Rsvp Not Found</p>
      </div>
    );

  const formStep = router.query.step ?? 1;

  const goToStep = (step) => {
    const path = `${asPath}`.split("?")[0];
    router.push(path + `/?step=${step}`);
  };

  const rsvp = data.data;

  const title = event.title;
  let attending = true;

  return (
    <div className="flex flex-col flex-grow">
      <div className="text-center text-primary-dark pt-4 mb-10">
        <p className="text-center page-title font-pacifico text-2xl md:text-5xl mb-4 text-shadow-md">
          RSVP
        </p>
        <p className="text-center font-rochester text-2xl md:text-5xl mb-6">
          {title}
        </p>
      </div>
      <FormProvider className="">
        <FormCard currentStep={formStep}>
          {formStep >= 1 && (
            <PersonalInfo
              event={event}
              formStep={formStep}
              step={() => goToStep(2)}
            />
          )}
          {formStep >= 2 && (
            <OtherInfo
              questions={rsvp.questions}
              formStep={formStep}
              step={() => goToStep(3)}
            />
          )}
          {formStep >= 3 && (
            <Wish event={event} formStep={formStep} step={() => goToStep(4)} />
          )}
          {formStep > 3 && <Confirmation event={event} />}
        </FormCard>
      </FormProvider>
    </div>
  );
};

export default Registry;
