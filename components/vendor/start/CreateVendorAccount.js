import { useRef, useState, useEffect } from "react";
import { TextInput, SelectInput, Button, OutlineButton } from "../../form";
import { useFormData } from "@/components/providers/HostStartFormProvider";
import * as yup from "yup";
import { Form } from "@unform/web";
import Link from "next/link";
const schema = yup.object().shape(
  {
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().required("Email address is required"),
    phone: yup.string().required("Phone number is required"),
    password: yup.string().required("Password is required"),
  },
  []
);

export default function CreateVendorAccount({ goToStep, isVisible }) {
  const { setFormValues, formValues } = useFormData();

  const formRef = useRef();

  useEffect(() => {});

  const handleEventTypeChange = (e) => {
    // console.log(e);
    setEventType(e);
    setFormValues({ eventType: e });
  };

  async function handleSubmit(data) {
    try {
      formRef.current.setErrors({});
      data.eventType = eventType;

      //validate form
      if (eventType.name === "Wedding") {
        await schema.validate(data, {
          abortEarly: false,
        });
      } else {
        await schemaOthers.validate(data, {
          abortEarly: false,
        });
      }

      // Validation passed - do something with data
      setFormValues(data);
      goToStep();
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
    <Form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`${
        isVisible ? "block" : "hidden"
      }  flex flex-col justify-between h-full md:w-6/12x  md:mx-auto`}
      autoComplete="off"
    >
      <div className="flex flex-col space-y-8 md:space-y-6 my-auto">
        <h1 className="font-bold">Basic Information</h1>

        <>
          <TextInput
            label="First Name"
            type="text"
            name="partnerFirstName"
            classes="rounded-r-none "
            defaultValue={formValues.partnerFirstName}
            placeholder=" "
          />
          <fieldset>
            <div className="isolate  relative -space-x-px gridx grid-cols-2x flex flex-row">
              <TextInput
                label="First Name"
                type="text"
                name="partnerFirstName"
                classes="rounded-r-none "
                defaultValue={formValues.partnerFirstName}
                placeholder=" "
              />
              <TextInput
                label="Last Name"
                type="text"
                name="partnerLastName"
                classes="rounded-l-none "
                defaultValue={formValues.partnerLastName}
                placeholder=" "
              />
            </div>
          </fieldset>
          <fieldset className="flex">
            <div className="isolate relative -space-x-px gridx grid-cols-2x flex flex-row">
              <TextInput
                label="First Name"
                type="text"
                name="firstName"
                classes="rounded-r-none "
                defaultValue={formValues.firstName}
                placeholder=" "
              />
              <TextInput
                label="Last Name"
                type="text"
                name="lastName"
                classes="rounded-l-none "
                defaultValue={formValues.lastName}
                placeholder=" "
              />
            </div>
          </fieldset>
        </>

        <Button classes="w-full" type="submit">
          Continue
        </Button>
        <div className="flex flex-row items-center">
          <div className="flex flex-grow h-[1px] bg-gray-200"></div>
          <div className="mx-6 text-sm text-gray-500">OR</div>
          <div className="flex flex-grow h-[1px] bg-gray-200"></div>
        </div>
        <Link href="/auth/login">
          <OutlineButton classes="w-full" type="button">
            Login
          </OutlineButton>
        </Link>
      </div>
    </Form>
  );
}
