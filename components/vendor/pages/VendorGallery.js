import PermMediaIcon from "@mui/icons-material/PermMedia";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload } from "@/components/common/Upload";
import { createRef, useState, useRef, memo, useEffect } from "react";
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
import {
  useUpdateVendorProfile,
  useFetchVendorProfile,
  useUpdateVendorProfilePhoto,
} from "@/services/vendor-service";
import FormCard from "@/components/FormCard";
import FormProvider from "@/components/providers/HostStartFormProvider";
import {
  TextInput,
  SelectInput,
  // Button,
  OutlineButton,
  TextArea,
  ToggleSwitch,
} from "@/components/form";

const schema = yup.object().shape(
  {
    service: yup.string().required("Service category is required."),
    businessName: yup.string().required("Business name is required."),
    state: yup.string().required("Business location is required."),
    whyUnique: yup.string().required("Business value proposal is required."),
  },
  []
);

const DshVendorGallery = ({ pageTitle }) => {
  const user = userService.getUser();
  const vendor = user.vendor_profile;
  const states = dataService.getStates();
  const countries = dataService.getCountries();
  const snackbar = useSnackbar();
  const [showSpinner, setShowSpinner] = useState(false);
  const [coverMedia, setCoverMedia] = useState();
  const formRef = useRef();
  const [state, setStateNg] = useState();
  const [country, setCountry] = useState({ name: "Nigeria", code: "NG" });
  const [canWorkOutside, setCanWorkOutside] = useState();
  const [vendorProfile, setVendorProfile] = useState();
  const logoUploaderRef = createRef();
  const [logo, setLogo] = useState();
  const [logoBlob, setLogoBlob] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useFetchVendorProfile(vendor.id);

  useEffect(() => {
    if (data) {
      setVendorProfile(data);
      setCanWorkOutside(data.canWorkOutside);
      //get state
      const state = data.state
        ? states.find((state) => state.name === data.state)
        : null;
      setStateNg(state);
      //get logo.
      if (data.avatar) {
        setLogo(data.avatar);
      }
    }
  }, [data]);

  const handleStateChange = (e) => {
    setStateNg(e);
  };
  const handleCountryChange = (e) => {
    setCountry(e);
  };
  const onCanWorkOutsideChange = (checked, e) => {
    setCanWorkOutside(checked);
  };

  async function handleSubmit(data) {
    const { businessName, whyUnique } = data;

    try {
      setIsLoading(true);

      if (businessName === "" || !state || whyUnique === "") {
        snackbar.error("The fields marked * are required.");
        return;
      }
      // Validation passed - do something with data
      const payload = {
        id: vendor.id,
        businessName,
        whyUnique,
        state: state.name,
        country: country.name,
        canWorkOutside,
      };

      await useUpdateVendorProfile(payload);
      snackbar.show("Business profile updated successfully.");
      setIsLoading(false);
    } catch (err) {
      const errors = {};
      // Validation failed - do show error
      console.log(err);
      snackbar.error(err.message, "Oops! an error occurred.");
    }

    setIsLoading(false);
  }

  const startUpload = () => {
    logoUploaderRef.current.value = null;
    logoUploaderRef.current.click();
  };

  const onReady = async ({ blobImg, base64 }) => {
    // console.log(res);
    if (!blobImg) return;
    const formData = new FormData();

    formData.append("files", blobImg, "bz_logo_" + vendorProfile.id);
    formData.append("refId", vendorProfile.id);
    formData.append("ref", "api::vendor-profile.vendor-profile");
    formData.append("field", "avatar");
    formData.append("id", vendorProfile.id);

    await useUpdateVendorProfilePhoto(formData, vendorProfile.id);
    setLogoBlob(base64);
  };

  const onDeleteLogo = async () => {
    const cm = logo;
    setShowSpinner(true);

    const response = await fetch("/api/upload?id=" + cm.public_id, {
      method: "DELETE",
    });

    if (response.ok) {
      await useUpdateVendorProfile({
        id: event.id,
        coverMedia: null,
      });
      setLogo(null);
    }
    setShowSpinner(false);
  };

  const spinner = () => {
    return (
      <div className="flex mx-auto justify-center items-center py-16 left-0 right-0 top-0 bottom-0 transition ease-in-out duration-150 cursor-not-allowed flex-col h-full bg-white bg-opacity-80">
        <svg
          className="animate-spin h-8 w-8  text-gray-700"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-10"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-100"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-xs text-gray-500 mt-4">Please wait...</p>
      </div>
    );
  };

  if (!vendorProfile) {
    return <div>Loading...</div>;
  }

  return (
    <Section title={pageTitle}>
      <FormProvider>
        <FormCard classes="pt-0">
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`flex flex-col justify-between  md:mx-auto`}
            autoComplete="off"
          >
            <section className="overflow-hidden text-gray-700 ">
              <div className="container px-5 py-2 mx-auto">
                <div className="flex flex-wrap -m-1 md:-m-2">
                  <div className="flex flex-wrap w-1/3">
                    <div className="w-full p-1 md:p-2">
                      <img
                        alt="gallery"
                        className="block object-cover object-center w-full h-full rounded-lg"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap w-1/3">
                    <div className="w-full p-1 md:p-2">
                      <img
                        alt="gallery"
                        className="block object-cover object-center w-full h-full rounded-lg"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(74).webp"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap w-1/3">
                    <div className="w-full p-1 md:p-2">
                      <img
                        alt="gallery"
                        className="block object-cover object-center w-full h-full rounded-lg"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(75).webp"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap w-1/3">
                    <div className="w-full p-1 md:p-2">
                      <img
                        alt="gallery"
                        className="block object-cover object-center w-full h-full rounded-lg"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap w-1/3">
                    <div className="w-full p-1 md:p-2">
                      <img
                        alt="gallery"
                        className="block object-cover object-center w-full h-full rounded-lg"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(76).webp"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap w-1/3">
                    <div className="w-full p-1 md:p-2">
                      <img
                        alt="gallery"
                        className="block object-cover object-center w-full h-full rounded-lg"
                        src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(72).webp"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className="flex flex-col space-y-4 md:space-y-6">
              <div
                className={`relative block w-full  text-center  items-center overflow-clip`}
              >
                <Upload
                  id={logoUploaderRef}
                  setShowSpinner={setShowSpinner}
                  saveAs={"event.slug"}
                  typeVideo={true}
                  lockAspectRatio={1 / 1}
                  onReady={onReady}
                />
                {showSpinner && { spinner }}

                <div className="flex flex-col justify-center items-center">
                  <button onClick={startUpload} type="button" className="">
                    {!showSpinner &&
                      (!logo ? (
                        <div className="flex rounded-full h-24 w-24 bg-gray-300 items-center justify-center text-white text-4xl">
                          {vendorProfile.businessName &&
                            vendorProfile.businessName.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div className="flex flex-col h-24 w-24 items-center justify-center">
                          <img
                            className={` h-24 w-24 rounded-full`}
                            src={`${logoBlob ?? logo.thumbnail}`}
                          ></img>
                        </div>
                      ))}
                  </button>
                  <div className="text-xs text-gray-500 mt-4">
                    <p>Your Business Logo</p>
                  </div>
                  <div>
                    <div className="flex flex-row space-x-4 mt-4">
                      {logo ? (
                        <Button
                          onClick={onDeleteLogo}
                          variant="outlined"
                          size="small"
                        >
                          Delete
                        </Button>
                      ) : (
                        <Button
                          onClick={startUpload}
                          variant="contained"
                          size="small"
                        >
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </FormCard>
      </FormProvider>
    </Section>
  );
};

export default memo(DshVendorGallery);
