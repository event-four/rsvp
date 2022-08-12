import { useRef, useState, useEffect } from "react";
import { TextInput, Button as Btn, LOADER_STATE } from "../../form";
import { useFormData } from "@/components/providers/WZStartFormProvider";
import * as yup from "yup";
import { Form } from "@unform/web";
import { Api, debounce, constants } from "/helpers";
import { getCookie, setCookie } from "cookies-next";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "../../SnackBar";
import { userService, eventService } from "/services";

const schema = yup.object().shape({
  url: yup
    .string()
    .required("Url is required")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field "),
});

export default function ChooseUrl({ goToStep, isVisible }) {
  const { setFormValues, formValues } = useFormData();
  const [url, setUrl] = useState("");
  const [submitData, setSubmitData] = useState(false);
  const [searchable, setSearchable] = useState(true);
  const [urlConfirmationState, setUrlConfirmationState] = useState();
  const formRef = useRef();
  const snackbar = useSnackbar();
  const user = userService.getUser();
  const event = eventService.getLocalStorageEvent();

  useEffect(() => {
    if (!formValues) return null;
    setUrl(formValues.url);
  });

  const handleSearchable = (e) => {
    setSearchable(e.target.checked);
  };

  const canSetUrl =
    urlConfirmationState !== LOADER_STATE.LOADING &&
    urlConfirmationState !== LOADER_STATE.ERROR;

  async function handleSubmit(data) {
    const slug = event.slug;

    try {
      formRef.current.setErrors({});

      await schema.validate(data, {
        abortEarly: false,
      });

      // Validation passed - do something with data
      // got to next page is user url didnt change
      if (data.url === slug) {
        goToStep();
      } else {
        setFormValues({ data });
        await updateUrl(data.url);
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

  const updateUrl = async (slug) => {
    setSubmitData(true);
    const eventId = event.id;
    eventService
      .updateEventSlug({ slug, eventId })
      .then((res) => {
        setUrl(url);
        setSubmitData(false);
        //update user .
        event.slug = slug;
        eventService.setLocalStorageEvent(event);
        goToStep();
      })
      .catch((error) => {
        console.log(error.message);
        setSubmitData(false);
        snackbar.show(error.message, "Oops!");
      });
  };

  const onChange = async (e) => {
    // Update the keyword of the input element
    let slug = e.target.value;
    slug = slug.replace(/\s/g, "");
    e.target.value = slug;

    // console.log(user);
    const eventId = event.id;

    setUrlConfirmationState(LOADER_STATE.LOADING);

    eventService
      .verifyEventSlug({ slug, eventId })
      .then((res) => {
        console.log(res);
        setUrlConfirmationState(LOADER_STATE.SUCCESS);
      })
      .catch((error) => {
        console.log(error.message);
        setUrlConfirmationState(LOADER_STATE.DEFAULT);
      });
  };

  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`${
        isVisible ? "block" : "hidden"
      }  flex flex-col justify-between h-full md:mx-auto sm: max-w-xs`}
      autoComplete="off"
    >
      <div className="flex flex-col space-y-8 md:space-y-6 my-auto">
        <h1 className="font-bold text-default">
          Your{" "}
          <span className="lowercase">
            {formValues && formValues.event && formValues.eventType.name}
          </span>{" "}
          website is almost ready to go!.
        </h1>
        <p className="text-sm text-gray-500">
          Here's your customized URL. You can change it to whatever you like.
        </p>

        <fieldset>
          {/* <legend className="font-semibold text-sm mb-1">Your URL</legend> */}
          <div className="relative ">
            <TextInput
              label="w.eventfour.com/"
              type="text"
              name="url"
              classes=""
              onChange={debounce((v) => {
                onChange(v);
              }, 500)}
              defaultValue={url}
              placeholder=""
              state={urlConfirmationState}
            />
          </div>
        </fieldset>
        {/* <p className="text-xs text-gray-500">
          Don't forget to share it with friends and family.
        </p> */}
        <div className="relative flex items-start hiddenx">
          <div className="flex items-center h-5">
            <input
              aria-describedby="searchable-description"
              name="searchable"
              id="searchable"
              type="checkbox"
              checked={searchable}
              onChange={handleSearchable}
              className="focus:ring-default h-4 w-4 text-default border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm ">
            <label htmlFor="searchable" className="font-medium">
              I want my guests to find my website in search engines.
            </label>
            <p
              id="searchable-description"
              className="text-gray-500 text-xs mt-1"
            >
              It makes it easier for guests to RSVP, find day of event details
              and browse your registry.
            </p>
          </div>
        </div>
        <LoadingButton
          loading={submitData}
          loadingPosition="center"
          disabled={!canSetUrl}
          type="submit"
        >
          Set my URL
        </LoadingButton>
      </div>
    </Form>
  );
}
