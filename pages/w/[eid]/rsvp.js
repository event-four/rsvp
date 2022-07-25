import { useRouter } from "next/router";
import Footer from "../../../components/guests/footer";
import endpoints from "../../../consts/urls";
import { useSession } from "next-auth/react";
import utils from "../../../consts/utils";
import { useState, useEffect } from "react";
import {
  PersonalInfo,
  OtherInfo,
  Confirmation,
  Wish,
} from "../../../components/Rsvp Forms";
import FormCard from "../../../components/FormCard";
import FormProvider from "../../../context/rsvp";
import useSWR from "swr";
import InnerLayout from "../../../components/guests/InnerLayout";
import { useGetRsvpGeneralQuestions } from "../../../swr/useRsvpRequests";
import NoRsvp from "../../../components/Rsvp Forms/NoRsvp";

const Rsvp = () => {
  const [ev, setEv] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      const json = await utils.getFromStorage("event");
      setEv(JSON.parse(json));
    }
    fetchEvent();
  }, []);
  if (!ev) return;
  // Handles the submit event on form submit.
  //   const handleSubmit = async (event) => {
  //     // Stop the form from submitting and refreshing the page.
  //     event.preventDefault();
  //     // Get data from the form.
  //     const formData = {
  //       name: event.target.name.value,
  //       email: event.target.email.value,
  //       phone: event.target.phone.value,
  //       rsvp: attending,
  //     };

  //     // Send the data to the server in JSON format.
  //     const JSONdata = JSON.stringify({ data: formData, eventId: ev.id });

  //     // API endpoint where we send form data.
  //     const endpoint = endpoints.sendRsvp;

  //     // Form the request for sending data to the server.
  //     const options = {
  //       // The method is POST because we are sending data.
  //       method: "POST",
  //       // Tell the server we're sending JSON.
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // Body of the request is the JSON data we created above.
  //       body: JSONdata,
  //     };

  //     // Send the form data to our forms API on Vercel and get a response.
  //     const response = await fetch(endpoint, options);

  //     // Get the response data from server as JSON.
  //     // If server returns the name submitted, that means the form works.
  //     const { data, error } = await response.json();

  //     if (error) {
  //       alert(error.message);
  //       return;
  //     }

  //     if (data) {
  //       setRsvpSentStatus(true);
  //     }
  //     // alert(`Is this your full name: ${result.data}`);
  //   };

  return (
    <InnerLayout>
      <RsvpPageBody event={ev} />
    </InnerLayout>
  );
};

const RsvpPageBody = ({ event }) => {
  const router = useRouter();
  const { asPath } = useRouter();
  const [attending, setAttending] = useState(true);
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

  const noRsvp = (rsvp) => {
    setAttending(rsvp);
  };

  const rsvp = data.data;

  const title = event.title;

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
      {!attending && <NoRsvp event={event} />}
      {attending && (
        <FormProvider className="">
          <FormCard currentStep={formStep}>
            {formStep >= 1 && (
              <PersonalInfo
                event={event}
                formStep={formStep}
                noRsvp={noRsvp}
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
              <Wish
                event={event}
                formStep={formStep}
                step={() => goToStep(4)}
              />
            )}
            {formStep > 3 && <Confirmation event={event} />}
          </FormCard>
        </FormProvider>
      )}
    </div>
  );
};

export default Rsvp;
