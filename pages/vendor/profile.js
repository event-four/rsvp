import FormCard from "@/components/FormCard";
import FormProvider from "@/components/providers/HostStartFormProvider";
import { useSession, signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/host/Layout";
import { getCookie } from "cookies-next";
import { constants } from "/helpers";
import { Form } from "@unform/web";
import {
  TextInput,
  SelectInput,
  Button,
  OutlineButton,
  TextArea,
} from "../../components/form";
import * as yup from "yup";
import Link from "next/link";
import { useSnackbar } from "@/components/SnackBar";
import { signUp, setupAccountOnServer } from "../../authentication";
import { userService, dataService } from "/services";

const VendorProfileFormPage = ({}) => {
  const router = useRouter();
  useEffect(() => {});
  return (
    // <Layout>
    <div className="container mx-auto gridx md:grid-cols-4x md:gap-4x h-screen">
      <div className="hidden md:hidden col-span-3"></div>

      <div className="p-3 align-middle h-full">
        <StartPageForm />
      </div>
    </div>
    // </Layout>
  );
};

const schema = yup.object().shape(
  {
    service: yup.string().required("Service category is required."),
    businessName: yup.string().required("Business name is required."),
    state: yup.string().required("Business location is required."),
    description: yup.string().required("Business description is required."),
  },
  []
);

const StartPageForm = () => {
  const { isReady, query, asPath } = useRouter();
  const router = useRouter();
  const formRef = useRef();
  const snackbar = useSnackbar();

  // const { setFormValues, formValues } = useFormData();
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [category, setCategory] = useState();
  const [state, setStateNg] = useState();
  const [country, setCountry] = useState();
  const states = dataService.getStates();
  const serviceTypes = dataService.getServiceCategories();

  useEffect(() => {
    // if (!isReady) return;
  });
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

  async function handleSubmit(formData) {
    try {
      setIsLoadingLogin(true);

      formRef.current.setErrors({});

      if (!state || !category) {
        setIsLoadingLogin(false);
        snackbar.error("All fields are required.");
        return;
      }

      //validate form
      await schema.validate(formData, {
        abortEarly: false,
      });

      setFbToken("");
      console.log(formData);
      // Validation passed - do something with data
      //start sign up
      let token;
      if (!fbToken || fbUser.email !== formData.email) {
        snackbar.info("Creating your account...");
        let res = await signUp({
          email: formData.email,
          password: formData.password,
        });
        token = res.token;
        setFbToken(res.token);
        setFbUser(res.user);
      }

      //setup on server
      snackbar.info("Setting up your account...");
      const user = await setupAccountOnServer({
        token: fbToken ?? token,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleType: "vendor",
        source: "WEB",
      });

      //sign in user
      await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })
        .then(async (response) => {
          console.log(response);
          if (response.ok) {
            const session = await getSession();
            if (session) {
              console.log(session);
              await userService.setUser(session.user);
              router.push("/vendor/dashboard");
            }
          } else {
            throw response.error;
          }
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });

      // userService.setUser(user);
      // setFormValues(data);
      setIsLoadingLogin(false);
    } catch (err) {
      setIsLoadingLogin(false);
      const errors = {};
      // Validation failed - do show error
      if (err instanceof yup.ValidationError) {
        // console.log(err.inner);
        // Validation failed - do show error
        err.inner.forEach((error) => {
          console.log(error.path);
          errors[error.path] = error.message;
        });
        formRef.current.setErrors(errors);
      }

      if (err) {
        console.log(err);
        if (err.toString().includes("auth/email-already-in-use")) {
          snackbar.error("This email is already registered. Please login.");
        } else if (err.toString().includes("auth/wrong-password")) {
          snackbar.error("Your login information is incorrect.");
        } else if (err.toString().includes("auth/too-many-requests")) {
          snackbar.error(
            "Access to this account has been temporarily disabled due to many failed login attempts. Reset your password or try again later."
          );
        } else if (err.toString().includes("auth/network-request-failed")) {
          snackbar.error("The network request failed.");
        }
        return;
      } else {
        snackbar.error(err.message || "Oops! An error occurred.");
        console.log(err);
      }
    }
  }

  return (
    <FormProvider>
      <FormCard>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`flex flex-col justify-between h-full md:w-5/12  md:mx-auto`}
          autoComplete="off"
        >
          <div className="flex flex-col space-y-4 md:space-y-6 border rounded-lg p-6 md:p-12">
            <h1 className="font-bold">Create your Vendor Profile</h1>

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

            <Button classes="w-full" isLoading={isLoadingLogin} type="submit">
              Create Profile
            </Button>
          </div>
        </Form>
      </FormCard>
    </FormProvider>
  );
};
export default VendorProfileFormPage;

export const getServerSideProps = async ({ req, res }) => {
  // const hasDashboard = getCookie(constants.LAUNCHED_DSH, { req, res });
  // const user = getCookie(constants.UIF, { req, res });
  // console.log(user);
  // let hasUser;
  // if (user) {
  //   hasUser = JSON.parse(user);
  // }
  // console.log("hasDashboard", hasDashboard);

  return { props: {} };
};
