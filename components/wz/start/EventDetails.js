import { useRef, useState, useEffect } from "react";
import {
  TextInput,
  OutlineButton,
  DatePickerInput,
  PlacesAutocomplete,
} from "../../form";
import { useFormData } from "@/components/providers/WZStartFormProvider";
import * as yup from "yup";
import { Form } from "@unform/web";
import { Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useCookies } from "react-cookie";
import { constants, Api } from "/helpers";
import { useSnackbar } from "../../SnackBar";

import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { userService, eventService } from "/services";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
const schema = yup.object().shape({});

export default function EventDetails({ goToStep, isVisible, submitForm }) {
  const { setFormValues, formValues } = useFormData();
  const [city, setCity] = useState();
  const formRef = useRef();
  const [submitData, setSubmitData] = useState(false);
  const [updateLater, setUpdateLater] = useState(false);
  const [cookies, setCookie] = useCookies();
  const snackbar = useSnackbar();
  const [startDate, setStartDate] = useState(new Date());
  const user = userService.getUser();
  const event = eventService.getLocalStorageEvent();

  useEffect(() => {
    if (!formValues) return null;
  });

  async function handleSubmit(data) {
    console.log(startDate);
    try {
      formRef.current.setErrors({});

      await schema.validate(data, {
        abortEarly: false,
      });
      // Validation passed - do something with data

      if (updateLater) {
        submitForm(formValues);
      } else {
        setFormValues(data);
        await updateData();
      }
      // goToStep();
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

  const updateData = async () => {
    setSubmitData(true);
    const eventId = event.id;
    // const startDate = startDate;
    const city = formValues.city;

    Api.updateEventData({ startDate, city, eventId })
      .then((res) => {
        setSubmitData(false);
        //update cookies .
        event.city = city;
        event.startDate = startDate;
        eventService.setLocalStorageEvent(event);
        submitForm(formValues);
      })
      .catch((error) => {
        console.log(error.message);
        setSubmitData(false);
        snackbar.show(error.message, "Oops!");
      });
  };

  if (!formValues) {
    return <div></div>;
  }

  const handleChange = (newValue) => {
    setStartDate(new Date(newValue));
    // console.log(new Date(newValue));
  };

  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit}
      className={`${
        isVisible ? "block" : "hidden"
      }  flex flex-col justify-between h-full md:mx-auto`}
      autoComplete="off"
    >
      <div className="flex flex-col space-y-6 md:space-y-6 my-auto">
        <h1 className="font-bold">Event Information</h1>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            label={`${
              formValues && formValues.eventType && formValues.eventType.name
            } Date`}
            inputFormat="DD, MMM, YYYY"
            value={startDate}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <div className="relative ">
          <PlacesAutocomplete
            label={`City, State`}
            type="text"
            name="city"
            classes=""
            value={formValues.city || city}
            placeholder=" "
          />
        </div>

        <div className="relative flex items-start">
          <p className="text-gray-500 text-sm mt-1">
            If you haven't decided yet, you can skip it and update later.
          </p>
        </div>

        <div className="space-y-2 pt-16 flex flex-col ">
          <LoadingButton loading={submitData} type="submit">
            Save
          </LoadingButton>
          <Button
            variant="text"
            type="submit"
            onClick={() => setUpdateLater(true)}
          >
            Update Later
          </Button>
        </div>
      </div>
    </Form>
  );
}
