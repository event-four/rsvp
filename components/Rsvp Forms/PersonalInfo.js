import { useRef } from "react";
import { useRouter } from "next/router";
import { TextInput } from "../form";
import { useFormData } from "../../context/rsvp";
import * as yup from "yup";
import { Form } from "@unform/web";
import { useAppStates } from "../../context/AppContext";

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

  const router = useRouter();
  const formRef = useRef();
  let attending = true;

  async function handleSubmit(data) {
    try {
      formRef.current.setErrors({});

      await schema.validate(data, {
        abortEarly: false,
      });
      // Validation passed - do something with data
      setFormValues(data);

      if (!attending) {
        return noRsvp();
      }
      step();
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

  return (
    <>
      <div className={formStep == 1 ? "block h-full" : "hidden"}>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className=" centered flex flex-col justify-between h-full md:w-4/12 md:mx-auto"
          autoComplete="off"
        >
          <div className="flex flex-col space-y-8 md:space-y-6">
            <div className="relative">
              <TextInput
                label="Full Name"
                type="text"
                name="name"
                placeholder=" "
                defaultValue={data.name}
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
              />
            </div>
          </div>

          {/* <div className="h-3"></div> */}
          <div className=" justify-between items-center">
            <p className="text-sm text-center  text-pink-600 font-bold  pb-4">
              Ready to party with us?
            </p>

            <div className="flex flex-col md:flex-row md:space-x-4 justify-between">
              <button
                type="submit"
                className=" my-2  transition duration-150 ease-in-out focus:outline-none rounded text-pink-600 border border-pink-600 px-6 py-3 text-sm w-full"
                onClick={() => {
                  attending = false;
                }}
              >
                No, and I'll regret it
              </button>
              <button
                className=" my-2  transition duration-150 ease-in-out focus:outline-none rounded bg-pink-600 text-primary-light border border-pink-600 px-6 py-3 text-sm w-full"
                onClick={() => {
                  attending = true;
                }}
                type="submit"
              >
                Yes, let's get you married
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
