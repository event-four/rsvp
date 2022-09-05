import { useRef, createRef, useState, useEffect, memo } from "react";
import { eventService, useFetchEventStory } from "/services";
import Section from "../Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import { TextInput } from "@/components/form";
import { Form } from "@unform/web";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "../../SnackBar";
import UrlChooserTextField from "@/components/host/UrlChooserTextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PlacesAutocomplete } from "@/components/form";
import { TextField } from "@mui/material";

const WZEditEvent = ({ event, pageTitle }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const formRef = useRef();
  const snackbar = useSnackbar();
  const [formData, setFormData] = useState({
    startDate: event.startDate,
    city: event.city ?? "",
    slug: event.slug,
    metadata: {},
  });

  useEffect(() => {}, [formData]);

  async function handleSubmit(data) {
    setShowSpinner(true);

    const meta = {
      location: data.location === "" ? null : data.location,
      theme: data.theme === "" ? null : data.theme,
      color: data.color === "" ? null : data.color,
      dressCode: data.dressCode === "" ? null : data.dressCode,
      otherInfo: data.otherInfo === "" ? null : data.otherInfo,
    };

    const fm = {
      startDate: formData.startDate,
      city: formData.city,
      slug: formData.slug,
      metadata: meta,
    };

    setFormData(fm);

    try {
      if (formData.slug === "") {
        snackbar.error("Event url is required.");
        return;
      }
      const result = await updateData(fm);
      snackbar.show("Event updated successfully");
      // Validation passed - do something with data
    } catch (err) {
      console.log(err);
      snackbar.error(err.message, "Oops! an error occurred.");
    }
    setShowSpinner(false);
  }

  const handleChange = (newValue) => {
    setFormData((old) => {
      return { ...old, startDate: new Date(newValue).setHours(0, 0, 0, 0) };
    });
  };

  const handleSlugChange = (newValue) => {
    setFormData((old) => {
      return { ...old, slug: newValue };
    });
  };

  const handleCityOnChange = (value) => {
    setFormData((old) => {
      return { ...old, city: value };
    });
  };

  const updateData = async (data) => {
    data.eventId = event.id;
    // console.log(data);

    return eventService
      .updateEventData(data)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      });
  };

  return (
    <>
      {/* <h1 className="text-lg font-semibold">{pageTitle}Details</h1> */}
      <Section title="Event Details">
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`flex flex-col justify-between w-full space-y-6`}
          autoComplete="off"
        >
          <div>
            <p className="text-sm">Your Event Url</p>
            <UrlChooserTextField
              event={event}
              url={formData.slug}
              onChange={handleSlugChange}
            />
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              label={`Event Date`}
              inputFormat="DD, MMM, YYYY"
              value={formData.startDate}
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
              value={formData.city}
              placeholder=" "
              onChange={handleCityOnChange}
            />
          </div>

          <TextInput
            name="location"
            label="Event Location"
            defaultValue={event.metadata ? event.metadata.location : null}
          />
          <TextInput
            name="theme"
            label="Theme"
            defaultValue={event.metadata ? event.metadata.theme : null}
          />
          <TextInput
            name="color"
            label="Colour(s) of the Day"
            defaultValue={event.metadata ? event.metadata.color : null}
          />
          <TextInput
            name="dressCode"
            label="Dress Code"
            defaultValue={event.metadata ? event.metadata.dressCode : null}
          />
          <TextInput
            name="otherInfo"
            label="Other Information"
            defaultValue={event.metadata ? event.metadata.otherInfo : null}
          />

          <div className="mt-4 flex justify-center">
            <LoadingButton loading={showSpinner} type="submit">
              Save Changes
            </LoadingButton>
          </div>
        </Form>
      </Section>
    </>
  );
};

export default memo(WZEditEvent);
