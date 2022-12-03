import GlobalLayout from "@/components/layout/GlobalLayout";
import FormCard from "@/components/FormCard";
import FormProvider from "@/components/providers/HostStartFormProvider";
import { Form } from "@unform/web";
import { TextInput, TextArea, Button } from "@/components/form";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "@/components/SnackBar";
import * as yup from "yup";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { _post } from "@/services/index";
import { urls } from "/helpers";
import { AxiosError } from "axios";
const schema = yup.object().shape(
  {
    fullName: yup.string().required("Full name is required."),
    email: yup.string().required("Email address is required."),
    phone: yup.string().required("Phone number is required."),
    message: yup.string().required("Message is required."),
  },
  []
);

export default function GetHelp() {
  const formRef = useRef();
  const snackbar = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(formData) {
    try {
      setIsLoading(true);

      formRef.current.setErrors({});

      //validate form
      await schema.validate(formData, {
        abortEarly: false,
      });

      //if user exists, then just create a vendor profile without logging in

      await _post(urls.helpDesk, formData);
      setIsSent(true);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
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

      snackbar.error(err.message || "Oops! An error occurred.");
    }
  }

  return (
    <>
      <GlobalLayout staticNavbar={false}>
        <div className="pb-24">
          <section className="container-fluid flex flex-col py-36 items-center">
            <h1 className="text-5xl font-bold">Contact Us</h1>
            <p className="text-center mt-6 md:w-1/2 px-3">
              Drop a line and let us know how we can make <br></br> events
              simpler and easier for you.
            </p>
          </section>
          <section className="container-fluid mx-6 md:mx-24 rounded-3xl bg-white flex flex-col p-6 py-24 md:p-24">
            {isSent ? (
              <div className="flex flex-col space-y-6 items-center text-green-600">
                <CheckCircleOutlineIcon sx={{ fontSize: 80 }} />
                <p className="text-center leading-8 text-gray-700">
                  Your message has been sent. <br></br>We'll get in touch with
                  you within 24 hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex flex-col items-center">
                  <h2 className="text-3xl font-semibold">Get in touch</h2>
                  <p className="text-gray-500 mt-3">
                    Let us know how we can help
                  </p>
                </div>

                <FormCard>
                  <Form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className={`flex flex-col justify-between h-full   md:mx-auto`}
                    autoComplete="off"
                  >
                    <div className="flex flex-col space-y-4 md:space-y-6 items-center">
                      <div className="flex flex-col space-y-4 md:space-y-4 w-full">
                        <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
                          <TextInput
                            label="Full Name"
                            type="text"
                            name="fullName"
                            classes="rounded-r-none "
                            placeholder="What's your full name?"
                            wrapperclasses="flex-1"
                          />

                          <TextInput
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="What's your email address?"
                            wrapperclasses="flex-1"
                          />
                        </div>
                        <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row ">
                          <TextInput
                            label="Phone Number"
                            type="number"
                            name="phone"
                            placeholder="What's your phone number?"
                            wrapperclasses="flex-1"
                          />
                          <TextInput
                            label="Subject"
                            type="text"
                            name="subject"
                            placeholder="Enter a subject"
                            wrapperclasses="flex-1"
                          />
                        </div>
                        <TextArea
                          label="Message *"
                          type="text"
                          name="message"
                          placeholder="How can we help?"
                          rows={5}
                        />
                      </div>

                      <Button
                        classes="w-64"
                        isLoading={isLoading}
                        type="submit"
                      >
                        Send Message
                      </Button>
                    </div>
                  </Form>
                </FormCard>
              </div>
            )}
          </section>
        </div>
      </GlobalLayout>
    </>
  );
}
