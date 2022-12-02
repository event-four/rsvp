import FormCard from "@/components/FormCard";
import FormProvider from "@/components/providers/HostStartFormProvider";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
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
} from "../../components/form";
import * as yup from "yup";
import Link from "next/link";
import { useSnackbar } from "@/components/SnackBar";
import {
  signUp,
  setupAccountOnServer,
  createVendorAccountOnAPI,
} from "../../authentication";
import { userService } from "/services";
import Image from "next/image";

const VendorStartPage = ({ hasDashboard, hasUser }) => {
  const router = useRouter();
  useEffect(() => {});
  return (
    // <Layout>
    <div className="container mx-auto grid md:grid-cols-4 md:gap-4 h-screen">
      <div className="hidden md:hidden col-span-3"></div>

      <div className="p-6 align-middle h-full sm:mx-auto sm:col-span-4">
        <StartPageForm />
      </div>
    </div>
    // </Layout>
  );
};

const schema = yup.object().shape(
  {
    firstName: yup.string().required("First name is required."),
    lastName: yup.string().required("Last name is required."),
    email: yup.string().required("Email address is required."),
    phone: yup.string().required("Phone number is required."),
    password: yup.string().required("Password is required."),
  },
  []
);

const StartPageForm = () => {
  const { data: session, status } = useSession();

  const { isReady, query, asPath } = useRouter();
  const router = useRouter();
  const formRef = useRef();
  const snackbar = useSnackbar();
  const user = userService.getUser();

  // const { setFormValues, formValues } = useFormData();
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [fbToken, setFbToken] = useState();
  const [fbUser, setFbUser] = useState();
  const [isLogin, setIsLogin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState();
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    setLoggedInUser(user);
  }, []);

  async function handleSubmit(formData) {
    try {
      setIsLoadingLogin(true);

      console.log(isLoadingLogin);
      formRef.current.setErrors({});

      //validate form
      if (!user) {
        await schema.validate(formData, {
          abortEarly: false,
        });
      }

      //if user exists, then just create a vendor profile without logging in
      if (session) {
        // console.log(session);
        const user = await createVendorAccountOnAPI({
          email: session.user.email,
          jwt: session.jwt,
        });

        setRedirectToLogin(true);
        // await userService.setUser(user);

        // router.push("/vendor/dashboard?page=profile");
      } else {
        setFbToken("");
        // console.log(formData);
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
                router.push("/vendor/dashboard?page=profile");
              }
            } else {
              throw response.error;
            }
          })
          .catch((error) => {
            console.log(error);
            throw error;
          });
      }

      // userService.setUser(user);
      // setFormValues(data);
      setIsLoadingLogin(false);
    } catch (err) {
      setIsLoadingLogin(false);
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
    <div className="flex h-full">
      {redirectToLogin ? (
        <div className="flex flex-col max-h-screen justify-center items-center border rounded-lg px-12 my-auto mx-auto py-24">
          <div className="mb-6 mx-auto">
            <Image src="/e4.png" height={58} width={200} />
          </div>
          <p className="font-bold text-xl">
            Congratulations {loggedInUser && loggedInUser.profile.firstName}!
          </p>
          <div className="justify-center items-center mb-9 mt-4 text-center">
            Your Vendor Account has been created. <br></br>
          </div>

          <Button
            classes="w-auto"
            type="button"
            onClick={() => signOut({ redirect: true })}
          >
            Login to continue
          </Button>
        </div>
      ) : (
        <FormProvider>
          <FormCard>
            <Form
              ref={formRef}
              onSubmit={handleSubmit}
              className={`flex flex-col justify-between h-full md:w-6/12x  md:mx-auto`}
              autoComplete="off"
            >
              <div className="flex flex-col space-y-4 md:space-y-6 border rounded-lg p-12">
                <div className="mb-6 mx-auto">
                  <Image src="/e4.png" height={58} width={200} />
                </div>
                <h1 className="font-bold text-center">Become a Vendor</h1>

                <div className="flex flex-col space-y-4 md:space-y-4">
                  <div className="flex flex-col space-y-4 md:space-y-0 md:-space-x-px md:flex-row ">
                    <TextInput
                      label="First Name"
                      type="text"
                      name="firstName"
                      classes="rounded-r-none "
                      placeholder=" "
                      defaultValue={
                        loggedInUser && loggedInUser.profile
                          ? loggedInUser.profile.firstName
                          : ""
                      }
                    />
                    <TextInput
                      label="Last Name"
                      type="text"
                      name="lastName"
                      classes="rounded-l-none "
                      placeholder=" "
                      defaultValue={
                        loggedInUser && loggedInUser.profile
                          ? loggedInUser.profile.lastName
                          : ""
                      }
                    />
                  </div>

                  <TextInput
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder=" "
                    defaultValue={loggedInUser ? loggedInUser.email : ""}
                  />

                  {!loggedInUser && (
                    <TextInput
                      label="Phone Number"
                      type="number"
                      name="phone"
                      placeholder=" "
                      defaultValue={
                        loggedInUser && loggedInUser.profile
                          ? loggedInUser.profile.phone
                          : ""
                      }
                    />
                  )}
                  {!loggedInUser && (
                    <TextInput
                      label="Password"
                      type="password"
                      name="password"
                      placeholder=" "
                      isPassword={true}
                    />
                  )}
                </div>

                <Button
                  classes="w-full"
                  isLoading={isLoadingLogin}
                  type="submit"
                >
                  Continue
                </Button>

                {!loggedInUser && (
                  <div className="flex flex-row items-center">
                    <div className="flex flex-grow h-[1px] bg-gray-200"></div>
                    <div className="mx-6 text-sm text-gray-500">OR</div>
                    <div className="flex flex-grow h-[1px] bg-gray-200"></div>
                  </div>
                )}
                {!loggedInUser && (
                  <Link href="/auth/login">
                    <OutlineButton classes="w-full" type="button">
                      Login
                    </OutlineButton>
                  </Link>
                )}
              </div>
            </Form>
          </FormCard>
        </FormProvider>
      )}
    </div>
  );
};
export default VendorStartPage;
export const getServerSideProps = async ({ req, res }) => {
  const hasDashboard = getCookie(constants.LAUNCHED_DSH, { req, res });
  const user = getCookie(constants.UIF, { req, res });
  console.log(user);
  let hasUser;
  if (user) {
    hasUser = JSON.parse(user);
  }
  console.log("hasDashboard", hasDashboard);

  return {
    props: { hasDashboard: hasDashboard ?? false, hasUser: hasUser ?? false },
  };
};
