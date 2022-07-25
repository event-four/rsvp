import { useRouter } from "next/router";
import Footer from "../../../components/guests/footer";
import { TextInput } from "../../../components/form";
import endpoints from "../../../consts/urls";
import { useSession } from "next-auth/react";
import utils from "../../../consts/utils";
import { useState, useEffect } from "react";
import { PersonalInfo } from "../../../components/Rsvp Forms";

const Rsvp = () => {
  const { data: session } = useSession();
  const { asPath } = useRouter();
  const eid = asPath.split("/")[2];
  const [ev, setEv] = useState(null);
  const [rsvpSent, setRsvpSentStatus] = useState(false);
  let attending = true;
  let formSubmitted = false;

  useEffect(() => {
    async function fetchEvent() {
      const json = await utils.getFromStorage("event");
      setEv(JSON.parse(json));
    }
    fetchEvent();
  }, []);

  console.log(ev);

  const title = ev ? ev.title : "";

  // Handles the submit event on form submit.
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    // Get data from the form.
    const formData = {
      name: event.target.name.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
      rsvp: attending,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify({ data: formData, eventId: ev.id });

    // API endpoint where we send form data.
    const endpoint = endpoints.sendRsvp;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const { data, error } = await response.json();

    if (error) {
      alert(error.message);
      return;
    }

    if (data) {
      setRsvpSentStatus(true);
    }
    console.log(data);
    // alert(`Is this your full name: ${result.data}`);
  };

  return (
    <div className="container flex flex-col bg-primary">
      <div className=" min-h-screen w-full f1">
        {/* <div className="bg"></div> */}
        {/* <div className="bg-filter"></div> */}
        <div className="f2"></div>
        <div className="f3"></div>
      </div>

      <div className=" absolute w-full flex flex-col h-full justify-between p-6">
        {ev == null ? (
          <div className="relative text-center flex items-center w-full  my-auto mx-auto content-center">
            <p className="align-middle w-full"> Event Not Found</p>
          </div>
        ) : (
          <>
            <div className="text-center text-primary-dark pt-0">
              <p className="text-center page-title font-pacifico text-2xl md:text-5xl mb-4 text-shadow-md">
                RSVP
              </p>
              <p className="text-center font-rochester text-2xl md:text-5xl mb-6">
                {title}
              </p>
            </div>

            {!rsvpSent ? (
              <div className="car">
                {/* <p className="mb-10 text-sm text-gray-700">
                  Please enter your details
                </p> */}
                <form
                  id="login"
                  onSubmit={handleSubmit}
                  className="space-y-6 centered"
                >
                  <div className="relative">
                    <TextInput
                      label="Full Name"
                      type="text"
                      id="name"
                      placeholder=" "
                    />
                  </div>
                  <div className="relative">
                    <TextInput
                      label="Email Address"
                      type="email"
                      id="email"
                      placeholder=" "
                    />
                  </div>
                  <div className="relative">
                    <TextInput
                      label="Phone Number"
                      type="number"
                      id="phone"
                      placeholder=" "
                    />
                  </div>
                  <div className="h-3"></div>
                  <div className="flex flex-col justify-between items-center">
                    <p className="text-sm text-pink-600 font-bold dark:text-gray-100 pb-4">
                      Ready to party with us?
                    </p>

                    <button
                      className=" my-2  transition duration-150 ease-in-out focus:outline-none rounded bg-pink-600 text-primary-light border border-pink-600 px-6 py-3 text-sm w-full"
                      onClick={() => {
                        attending = true;
                      }}
                    >
                      Yes, let's get you married
                    </button>
                    <button
                      className=" my-2  transition duration-150 ease-in-out focus:outline-none rounded text-pink-600 border border-pink-600 px-6 py-3 text-sm w-full"
                      onClick={() => {
                        attending = false;
                      }}
                    >
                      No, and I'll regret it
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div></div>
            )}
          </>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Rsvp;
