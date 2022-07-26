import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TextInput } from "../form";
import { useFormData } from "/components/providers/FormProvider";
import * as yup from "yup";
import { Form } from "@unform/web";
import { useAppStates } from "/components/providers/AppContext";
import dayjs from "dayjs";

const schema = yup.object().shape(
  {
    name: yup.string().required("Full name is required"),
    email: yup
      .string()
      .email()
      .when("phone", {
        is: (phone) => !phone || phone.length === 0,
        then: yup.string().email().required("Email is required"),
        otherwise: yup.string(),
      }),
    phone: yup.string().when("email", {
      is: (email) => !email || email.length === 0,
      then: yup.string(),
      otherwise: yup.string(),
    }),
  },
  [["email", "phone"]]
);

export default function PersonalInfo({ event, formStep, noRsvp, step }) {
  const { setFormValues, data } = useFormData();
  const { rsvpUrls } = useAppStates();
  const [attending, setAttending] = useState(true);
  const [mainQuestion, setMainQuestion] = useState("");

  const router = useRouter();
  const formRef = useRef();
  // const mainQuestion = useRef("");
  const yesBtnLabel = useRef("");

  useEffect(() => {
    // console.log("event", event);
    // if (event) {
    if (event.type.name === "Wedding") {
      setMainQuestion("Ready to party with us?");
      // mainQuestion.current = "Ready to party with us?";
      yesBtnLabel.current = "Yes, let's get you married";
    } else {
      setMainQuestion("Ready to join us?");
      // mainQuestion.current = "Ready to join us?";
      yesBtnLabel.current = "Yes, I can't wait";
    }
    // }
  }, []);

  async function handleSubmit(data) {
    try {
      formRef.current.setErrors({});

      await schema.validate(data, {
        abortEarly: false,
      });

      data.rsvp = attending;
      data.answers = [];
      // Validation passed - do something with data
      console.log(data);
      setFormValues(data);

      if (!attending) {
        return noRsvp(data);
      } else {
        step();
      }
    } catch (err) {
      const errors = {};
      // Validation failed - do show error
      if (err instanceof yup.ValidationError) {
        console.log(err.inner);
        // Validation failed - do show error
        err.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        formRef.current.setErrors(errors);
      }
      console.log(err);
    }
  }
  const isToday = (someDate) => {
    if (!someDate) return false;
    return dayjs().isSame(someDate, "day");
  };

  return (
    <>
      <div className={formStep == 1 ? "block h-full" : "hidden"}>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className=" centered flex flex-col justify-betweenx h-full md:w-5/12 md:mx-auto"
          autoComplete="off"
        >
          <div className="flex flex-col space-y-8 md:space-y-6 my-auto">
            {isToday(event.startDate) && (
              <p className="text-center mb-6 text-default">
                We would love to know whose wish it is!
              </p>
            )}
            <div className="relative">
              <TextInput
                label="Full Name"
                type="text"
                name="name"
                placeholder=" "
                defaultValue={data.name}
                isInset={true}
              />
            </div>
            <div className="relative">
              <TextInput
                label="Email Address"
                type="email"
                name="email"
                placeholder=" "
                autoComplete="on"
                defaultValue={data.email}
                isInset={true}
              />
            </div>
            <div className="relative">
              <TextInput
                label="Phone Number"
                type="number"
                name="phone"
                placeholder=" "
                autoComplete="on"
                defaultValue={data.phone}
                isInset={true}
              />
            </div>
          </div>

          {/* <div className="h-3"></div> */}
          {!isToday(event.startDate) && (
            <div className=" justify-between items-centerx mt-4">
              <p className="text-sm text-center text-pink-600 font-bold pb-4">
                {mainQuestion}
              </p>

              <div className="flex flex-col-reverse md:flex-row md:space-x-4 justify-between ">
                <button
                  type="submit"
                  className=" my-2 transition duration-150 ease-in-out focus:outline-none rounded text-pink-600 border border-pink-600 px-6 py-3 text-sm w-full"
                  onClick={() => {
                    setAttending(false);
                  }}
                >
                  No, and I'll regret it
                </button>
                <button
                  className=" my-2 transition duration-150 ease-in-out focus:outline-none rounded bg-pink-600 text-primary-light border border-pink-600 px-6 py-3 text-sm w-full"
                  onClick={() => {
                    setAttending(true);
                  }}
                  type="submit"
                >
                  {yesBtnLabel.current}
                </button>
              </div>
            </div>
          )}
          {isToday(event.startDate) && (
            <div className=" justify-between items-centerx mt-1">
              <div className="flex flex-col-reverse md:flex-row md:space-x-4 justify-between ">
                <button
                  className=" my-2 transition duration-150 ease-in-out focus:outline-none rounded bg-pink-600 text-primary-light border border-pink-600 px-6 py-3 text-sm w-full"
                  onClick={() => {
                    setAttending(true);
                  }}
                  type="submit"
                >
                  Congratulations!
                </button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </>
  );
}
