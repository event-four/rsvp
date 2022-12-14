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
// import PhoneInput from "react-phone-input-2";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

// import {
//   default as parsePhoneNumber,
//   isValidPhoneNumber,
//   isPossiblePhoneNumber,
//   getCountryCallingCode,
//   getCountries,
//   isSupportedCountry,
// } from "libphonenumber-js/core";
// import "react-phone-input-2/lib/style.css";
import "react-phone-input-2/lib/bootstrap.css";
import * as yup from "yup";
import "yup-phone";
import { useUpdateUser } from "@/services/user-service";
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

import { useFetchUserProfile } from "@/services/user-service";

const schema = yup.object().shape(
  {
    firstName: yup.string().required("First name is required."),
    lastName: yup.string().required("Last name is required."),
    email: yup.string().required("Email is required."),
    // phone: yup.string().required("Phone number is required."),
    // whatsapp: yup.string().when("whatsapp", {
    //   is: (value) => value?.length > 0,
    //   then: yup.string().phone(),
    //   otherwise: yup.string(),
    // }),
  },
  []
);

const DshVendorAccountForm = ({ pageTitle, vendorProfile, user }) => {
  // const user = userService.getUser();
  // const vendor = user.vendor_profile;
  const snackbar = useSnackbar();
  const [showSpinner, setShowSpinner] = useState(false);
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState();
  const [whatsapp, setWhatsapp] = useState();
  const [phoneError, setPhoneError] = useState(null);
  const [whatsappError, setWhatsappError] = useState(null);

  const {
    data: userProfile,
    loading,
    error,
  } = useFetchUserProfile(user.profile.id);

  useEffect(() => {
    if (userProfile) {
      var phone = userProfile.phone;
      var whatsapp = userProfile.whatsapp;

      if (isValidPhoneNumber(phone)) {
        setPhone(phone);
      }
      if (isValidPhoneNumber(whatsapp)) {
        setWhatsapp(whatsapp);
      }
    }
  }, [userProfile]);

  async function handleSubmit(data) {
    try {
      setIsLoading(true);
      formRef.current.setErrors({});
      setPhoneError(null);

      if (!phone || !isValidPhoneNumber(phone)) {
        setPhoneError("Enter a valid phone number.");
        setIsLoading(false);
        return;
      }

      if (whatsapp && !isValidPhoneNumber(whatsapp)) {
        setWhatsappError("Enter a valid phone number.");
        setIsLoading(false);
        return;
      }

      await schema.validate(data, {
        abortEarly: false,
      });

      // Validation passed - do something with data
      const payload = {
        profileId: user.profile.id,
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: phone,
        whatsapp: data.whatsapp,
      };

      await useUpdateUser(payload);
      snackbar.show("Your account updated successfully.");
      setIsLoading(false);
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
      } else {
        // Validation failed - do show error
        console.log(err);
        snackbar.error(err.message, "Oops! an error occurred.");
      }
    }

    setIsLoading(false);
  }

  if (!vendorProfile) {
    return <div>Loading...</div>;
  }

  return (
    <Section title={pageTitle}>
      <FormProvider>
        <FormCard>
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`flex flex-col justify-between  md:mx-auto max-w-lg`}
            autoComplete="off"
          >
            <div className="flex flex-col space-y-4 md:space-y-6">
              <p className="text-gray-500 text-sm">Personal Information</p>
              <div className="flex flex-col space-y-4 md:space-y-0  md:flex-row md:space-x-4">
                <div className="w-full">
                  <TextInput
                    label="First Name *"
                    type="text"
                    name="firstName"
                    defaultValue={userProfile && userProfile.firstName}
                    placeholder=" "
                  />
                </div>
                <div className="w-full">
                  <TextInput
                    label="Last Name *"
                    type="text"
                    name="lastName"
                    defaultValue={userProfile && userProfile.lastName}
                    placeholder=" "
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:space-y-0  md:flex-row md:space-x-4">
                <div className="w-full">
                  <TextInput
                    label="Email Address *"
                    type="text"
                    name="email"
                    defaultValue={user.email}
                    placeholder=" "
                    disabled
                  />
                </div>
                <div className="w-full">
                  <div
                    className={`border border-gray-300 px-3 py-3 rounded ${
                      phone ? "pb-1 pt-2" : ""
                    }`}
                  >
                    {phone && (
                      <p className="PhoneInput-label">Phone Number *</p>
                    )}
                    <PhoneInput
                      placeholder="Phone Number"
                      value={phone}
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="NG"
                      preferredCountries={["ng", "ae"]}
                      onChange={setPhone}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-red-600 text-2xs mt-2">{phoneError}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-4 md:space-y-0  md:flex-row md:space-x-4">
                <div className="w-full">
                  <div
                    className={`border border-gray-300 px-3 py-3 rounded focus-within:border-default ${
                      whatsapp ? "pb-1 pt-2" : ""
                    }`}
                  >
                    {whatsapp && (
                      <p className="PhoneInput-label">WhatsApp Number</p>
                    )}
                    <PhoneInput
                      placeholder="Whatsapp Number"
                      value={whatsapp}
                      countryCallingCodeEditable={false}
                      withCountryCallingCode={false}
                      // defaultCountry="NG"
                      preferredCountries={["ng", "ae"]}
                      onChange={setWhatsapp}
                    />
                  </div>
                  {whatsappError && (
                    <p className="text-red-600 text-2xs mt-2">
                      {whatsappError}
                    </p>
                  )}
                </div>
                <div className="w-full"></div>
              </div>

              <div className="flex flex-col md:flex-row space-y-6  md:space-y-0 md:space-x-6 justify-between pt-6">
                <LoadingButton
                  variant="contained"
                  loading={isLoading}
                  type="submit"
                >
                  Save Personal Information
                </LoadingButton>
              </div>
            </div>
          </Form>
          <div className="border-t my-6 border-gray-100"></div>
        </FormCard>
      </FormProvider>
    </Section>
  );
};

export default memo(DshVendorAccountForm);
