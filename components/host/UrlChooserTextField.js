import { memo, useState } from "react";
import { TextInput, Button as Btn, LOADER_STATE } from "@/components/form";
import { debounce } from "/helpers";
import { userService, eventService } from "/services";
import { useSnackbar } from "@/components/SnackBar";

const UrlChooserTextField = ({ event, url, onChange }) => {
  const [urlConfirmationState, setUrlConfirmationState] = useState();

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

  const onChanged = async (e) => {
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
        onChange(slug);
      })
      .catch((error) => {
        console.log(error.message);
        setUrlConfirmationState(LOADER_STATE.DEFAULT);
      });
  };

  return (
    <>
      <fieldset>
        {/* <legend className="font-semibold text-sm mb-1">Your URL</legend> */}
        <div className="relative ">
          <TextInput
            label="eventfour.com/w/"
            type="text"
            name="url"
            classes=""
            onChange={debounce((v) => {
              onChanged(v);
            }, 500)}
            defaultValue={url}
            placeholder=""
            state={urlConfirmationState}
          />
        </div>
      </fieldset>
    </>
  );
};

export default memo(UrlChooserTextField);
