import { useRef, useState, useEffect } from "react";
import { TextInput, SelectInput, Button } from "../../form";
import { useFormData } from "@/components/providers/HostStartFormProvider";
import * as yup from "yup";
import { Form } from "@unform/web";

const schema = yup.object().shape(
  {
    eventType: yup.object().required("Event type is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    partnerFirstName: yup.string().required("First name is required"),
    partnerLastName: yup.string().required("Last name is required"),
  },
  []
);
const eventTypes = [
  { id: 7, name: "Wedding" },
  // { id: 2, name: "Birthday" },
  // { id: 3, name: "Corporate" },
  // { id: 4, name: "Funeral" },
  // { id: 5, name: "Bridal Shower" },
];
export default function PersonalInfo({ goToStep, isVisible }) {
  const { setFormValues, formValues } = useFormData();
  const [eventType, setEventType] = useState(eventTypes[0]);

  const formRef = useRef();

  useEffect(() => {
    if (formValues.eventType) {
      setEventType(formValues.eventType);
    }
  });

  const handleEventTypeChange = (e) => {
    setEventType(e);
    setFormValues({ eventType: e });
  };

  async function handleSubmit(data) {
    try {
      formRef.current.setErrors({});
      data.eventType = eventType;
      await schema.validate(data, {
        abortEarly: false,
      });
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

        <SelectInput
          options={eventTypes}
          selected={eventType}
          name="eventType"
          label="Event Type"
          onChange={handleEventTypeChange}
        />
        <fieldset>
          <legend className="font-semibold text-sm mb-1">Your Name</legend>
          <div className="isolate  relative -space-x-px grid grid-cols-2">
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
        <fieldset>
          <legend className="font-semibold text-sm mb-1">
            Your Partner's Name
          </legend>
          <div className="isolate  relative -space-x-px grid grid-cols-2">
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
        <Button classes="w-full" type="submit">
          Continue
        </Button>
      </div>
    </Form>
  );
}
