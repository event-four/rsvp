import { useRef } from "react";
import { TextArea } from "../form";
import { useFormData } from "../../context/rsvp";
import * as yup from "yup";
import { Form } from "@unform/web";

const schema = yup.object().shape({});

export default function Confirmation({ event, formStep, step }) {
  const { setFormValues, data } = useFormData();
  const formRef = useRef();

  async function handleSubmit(data) {
    try {
      formRef.current.setErrors({});

      await schema.validate(data, {
        abortEarly: false,
      });
      // Validation passed - do something with data

      setFormValues(data);
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
    }
  }

  return (
    <>
      <div className={formStep == 3 ? "block" : "hidden"}>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6  md:w-3/12 md:mx-auto"
          autoComplete="off"
        >
          <h1 className="text-lg ">Just one more thing...</h1>
          <p className="text-sm">
            Please drop a wish or a prayer for us, or just say anything. We'd
            really appreciate it!
          </p>

          <div className="relative">
            <TextArea
              label=""
              name="wish"
              rows="5"
              defaultValue={data.wish || ""}
            />
          </div>

          <div className="flex flex-col justify-between items-center">
            <button
              className=" my-2  transition duration-150 ease-in-out focus:outline-none rounded bg-pink-600 text-primary-light border border-pink-600 px-6 py-3 text-sm w-full"
              type="submit"
            >
              Done
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
