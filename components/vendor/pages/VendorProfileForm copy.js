import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "@/components/common/Upload";
import { createRef, useState, useRef, memo } from "react";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Section from "@/components/common/Section";
import IconButton from "@mui/material/IconButton";
import Fab from "@mui/material/Fab";
import { Form } from "@unform/web";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "../../SnackBar";

import * as yup from "yup";
import { userService, dataService } from "/services";
import FormCard from "@/components/FormCard";
import FormProvider from "@/components/providers/HostStartFormProvider";
import {
  TextInput,
  SelectInput,
  // Button,
  OutlineButton,
  TextArea,
} from "@/components/form";

const schema = yup.object().shape(
  {
    service: yup.string().required("Service category is required."),
    businessName: yup.string().required("Business name is required."),
    state: yup.string().required("Business location is required."),
    description: yup.string().required("Business description is required."),
  },
  []
);

const DshVendorProfileForm = ({ pageTitle }) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [coverMedia, setCoverMedia] = useState();
  const uploaderRef = createRef();
  const formRef = useRef();
  const [category, setCategory] = useState();
  const [state, setStateNg] = useState();
  const [country, setCountry] = useState();
  const states = dataService.getStates();
  const serviceTypes = dataService.getServiceCategories();
  const [isLoading, setIsLoading] = useState(false);

  const startUpload = () => {
    uploaderRef.current.value = null;
    uploaderRef.current.click();
  };

  const onUploaded = (res) => {
    // console.log(res);
    setCoverMedia(res);

    eventService.updateEventData({
      eventId: event.id,
      coverMedia: {
        url: res.url,
        secure_url: res.secure_url,
        resource_type: res.resource_type,
        public_id: res.public_id,
        format: res.format,
        bytes: res.bytes,
        asset_id: res.asset_id,
      },
    });
  };

  const onDeleteCoverMedia = async () => {
    const cm = coverMedia;
    setShowSpinner(true);

    const response = await fetch("/api/upload?id=" + cm.public_id, {
      method: "DELETE",
    });
    console.log(response);
    if (response.ok) {
      eventService.updateEventData({
        eventId: event.id,
        coverMedia: null,
      });
      setCoverMedia(null);
    }
    setShowSpinner(false);
  };

  const handleCategoryChange = (e) => {
    // console.log(e);
    setCategory(e);
    // setFormValues({ eventType: e });
  };
  const handleStateChange = (e) => {
    // console.log(e);
    setStateNg(e);
    // setFormValues({ eventType: e });
  };
  const handleCountryChange = (e) => {
    // console.log(e);
    setCountry(e);
    // setFormValues({ eventType: e });
  };

  async function handleSubmit(data) {
    const { accountName, accountNumber, bank, routingCode, otherInfo } = data;
    console.log(data);

    try {
      if (accountName === "" || accountNumber === "" || bank === "") {
        snackbar.error("The fields marked * are required.");
        return;
      }
      setShowSpinner(true);
      let res;

      if (cashRegistry) {
        res = await updateData({ data, active: true });
      } else {
        res = await createData({ data, type: "cash", eventId: event.id });
      }

      const record = res;
      setCashRegistry(record);
      setShowCashRegistryForm(false);
      snackbar.show("Registry details updated successfully.");
      // Validation passed - do something with data
    } catch (err) {
      const errors = {};
      // Validation failed - do show error
      console.log(err);
      snackbar.error(err.message, "Oops! an error occurred.");
    }

    setShowSpinner(false);
  }

  return (
    <>
      <FormProvider>
        <FormCard>
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`flex flex-col justify-between  md:mx-auto`}
            autoComplete="off"
          >
            <div className="flex flex-col space-y-4 md:space-y-6">
              <div className="flex flex-col space-y-4 md:space-y-6">
                <SelectInput
                  options={serviceTypes}
                  selected={category}
                  name="eventType"
                  label="Select Service Category *"
                  onChange={handleCategoryChange}
                />

                <div className="flex flex-col space-y-4 md:space-y-0  md:flex-row md:space-x-4">
                  <div className="w-full">
                    {/* <SelectInput
                    options={country_list}
                    selected={country}
                    name="eventType"
                    label="Country"
                    onChange={handleCountryChange}
                  /> */}
                    <TextInput
                      label="Business Name *"
                      type="text"
                      name="businessName"
                      placeholder=" "
                    />
                  </div>
                  <div className="w-full">
                    <SelectInput
                      options={states}
                      selected={state}
                      name="eventType"
                      label="Location"
                      onChange={handleStateChange}
                    />
                  </div>
                </div>

                <TextArea
                  label="Business Description *"
                  type="text"
                  name="description"
                  placeholder=" "
                  rows={5}
                />
              </div>

              <Button classes="w-full" isLoading={isLoading} type="submit">
                Create Profile
              </Button>
            </div>
          </Form>
        </FormCard>
      </FormProvider>
    </>
  );
};

export default memo(DshVendorProfileForm);
