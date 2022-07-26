import { useRef, useState, useEffect } from "react";
import { ToggleSwitch } from "../form";
import { useFormData } from "/components/providers/FormProvider";
import * as yup from "yup";
import { Form } from "@unform/web";

const schema = yup.object().shape({});

export default function OtherInfo({ event, formStep, step, rsvp }) {
  const { setFormValues, data } = useFormData();
  const formRef = useRef();
  const [values, setValues] = useState([]);

  const questions = rsvp.questions ?? [];

  useEffect(() => {
    async function buildValues(data) {
      const answers = data.answers || [];
      let v = [];

      questions.map((q) => {
        const ans = answers.find((a) => a.id == q.id);
        const qan = ans ? ans.value : true;
        v.push({ id: q.id, value: qan });
      });

      setValues([...v]);
    }

    buildValues(data);
  }, []);

  // if (!values || values.length == 0) return <div />;

  async function handleSubmit(fdata) {
    try {
      formRef.current.setErrors({});

      await schema.validate(fdata, {
        abortEarly: false,
      });

      setFormValues({ answers: values, questionId: rsvp.id });

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

  const handleInputChange = (checked, e) => {
    const id = e.id;
    const opt = values.find((e) => e.id == id);
    const index = values.indexOf(opt);
    opt.value = checked;
    values[index] = opt;
    setValues([...values]);
  };

  return (
    <>
      <div className={formStep == 2 ? "block h-full" : "hidden"}>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className=" flex flex-col justify-between h-full  md:w-3/12 md:mx-auto"
          autoComplete="off"
        >
          {/* <p>Fantastic!</p> */}

          <div className="space-y-6">
            <h1 className="text-lg text-primary-dark font-semibold ">
              Fantastic!
            </h1>
            <p className="text-sm text-primary-dark">
              We can't wait to have you with us, we just need a few more details
              from you.
            </p>
            {questions.length < 1 && (
              <div className="mt-4">
                <p className="text-sm text-primary-dark">
                  We'll update this page soon!
                </p>
              </div>
            )}
            {values &&
              values.length > 0 &&
              questions.length > 0 &&
              questions.map((q) => {
                return (
                  <div
                    key={`${q.id}-wrapper`}
                    className="flex items-center justify-between space-x-2"
                  >
                    <span className="flex-grow flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {q.question}
                      </span>
                      <span className="text-xs text-primary-dark pt-1">
                        {q.description}
                      </span>
                    </span>
                    <div className="min-w-[100px] flex justify-end items-start">
                      <ToggleSwitch
                        id={`${q.id}`}
                        checked={values[questions.indexOf(q)].value}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="flex flex-col justify-between items-center mt-2">
            <button
              className=" my-2  transition duration-150 ease-in-out focus:outline-none rounded bg-pink-600 text-primary-light border border-pink-600 px-6 py-3 text-sm w-full"
              type="submit"
            >
              Next
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
