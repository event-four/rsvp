import { useRef, useState, Fragment } from "react";
import { TextInput, Button, OutlineButton } from "../../form";
import { useSnackbar } from "../../SnackBar";
import { useFormData } from "@/components/providers/HostStartFormProvider";
import * as yup from "yup";
import { Form } from "@unform/web";
import Link from "next/link";
import {
  signUp,
  setupAccountOnServer,
  setupEventOnServer,
} from "../../../authentication";
import { useSession, signIn } from "next-auth/react";
import { getCookie, setCookie } from "cookies-next";
import { constants } from "/helpers";
import { userService, eventService } from "/services";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function CreateAccount({ goToStep, isVisible, submitForm }) {
  const { data: session, status } = useSession();
  const { setFormValues, formValues } = useFormData();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fbToken, setFbToken] = useState();
  const [fbUser, setFbUser] = useState();
  const [isLogin, setIsLogin] = useState(false);

  const formRef = useRef();
  const loginFormRef = useRef();
  const snackbar = useSnackbar();

  const handleAgreement = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  async function handleSubmit(formData) {
    setIsLoading(true);

    try {
      formRef.current.setErrors({});

      await schema.validate(formData, {
        abortEarly: false,
      });

      // Validation passed - do something with formData
      const fd = formData;
      setFormValues(fd);
      // console.log("formData", formData);
      // console.log("formValues", formValues);

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

      // console.log(fbToken);

      const user = await setupAccountOnServer({
        token: fbToken ?? token,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        source: "RSVP",
      });

      userService.setUser(user);

      snackbar.info("Setting up your event...");
      // console.log(user);

      const event = await setupEventOnServer({
        jwt: user.jwt,
        eventMeta: {
          owner: user.profile.id,
          typeId: formValues.eventType.id,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          partnerFirstName: formValues.partnerFirstName,
          partnerLastName: formValues.partnerLastName,
        },
      });

      eventService.setLocalStorageEvent(event);

      setFormValues({ url: event.slug });
      // console.log(formData.email);
      //sign in user
      await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })
        .then(async (response) => {
          // console.log("signed in", response);

          if (response.ok && session && session.user) {
            // console.log(session.user);
            await userService.setUser(session.user);
          }
        })
        .catch((error) => {
          throw error;
        });

      goToStep();
    } catch (err) {
      setIsLoading(false);
      const errors = {};
      // Validation failed - do show error
      if (err instanceof yup.ValidationError) {
        console.log(err.inner);
        // Validation failed - do show error
        err.inner.forEach((error) => {
          console.log(error);
          errors[error.path] = error.message;
        });
        formRef.current.setErrors(errors);
        return;
      }

      if (err.code === "auth/email-already-in-use") {
        const msg =
          "An account already exists with this email.\nIf you own the account, please login.";
        errors["email"] = msg;
        new yup.ValidationError({ path: "email", errors: errors });
        formRef.current.setErrors(errors);

        snackbar.error(msg);
      } else if (err.code === "auth/weak-password") {
        const msg = "Password should be at least 6 characters.";
        errors["password"] = msg;
        new yup.ValidationError({ path: "email", errors: errors });
        formRef.current.setErrors(errors);

        snackbar.error(msg);
      } else if (err.code === "auth/network-request-failed") {
        snackbar.error("The network request failed.");
      } else {
        snackbar.error(err.message || "Oops! An error occurred.");
        console.log(err);
      }
    }

    setIsLoading(false);
  }

  const doLogin = async () => {
    setIsLoadingLogin(true);
    const { lg_email, lg_password } = loginFormRef.current.getData();

    //sign in user
    await signIn("credentials", {
      redirect: false,
      email: lg_email,
      password: lg_password,
    })
      .then(async (response) => {
        // console.log("response", response);
        if (response.ok) {
          const user = session.user;
          await userService.setUser(user);
          // console.log("user", user);
          // if (user) {
          const event = await setupEventOnServer({
            jwt: user.jwt,
            eventMeta: {
              owner: user.profile.id,
              typeId: formValues.eventType.id,
              firstName: formValues.firstName,
              lastName: formValues.lastName,
              partnerFirstName: formValues.partnerFirstName,
              partnerLastName: formValues.partnerLastName,
            },
          });

          eventService.setLocalStorageEvent(event);

          setFormValues({ url: event.slug });

          goToStep();
          // }
        } else {
          throw response.error;
        }
      })
      .catch((error) => {
        console.log(error);
        const errors = {};
        if (error && error.message) {
          snackbar.error(error.message);
        } else {
          if (error.includes("auth/wrong-password")) {
            const msg = "Your email or password is not correct.";
            errors["lg_password"] = msg;
            new yup.ValidationError({ path: "lg_password", errors: errors });
            loginFormRef.current.setErrors(errors);
            snackbar.error(msg);
          } else {
            // alert(err);
            snackbar.error(error || "Oops! An error occurred.");
          }
        }

        // throw error;
      });

    setIsLoadingLogin(false);
  };

  return (
    <>
      <Form
        ref={loginFormRef}
        onSubmit={doLogin}
        className={`${
          isLogin ? "block" : "hidden"
        }  flex flex-col justify-between h-full md:mx-auto md:max-w-xs `}
        autoComplete="off"
      >
        <div className="flex flex-col space-y-6 md:space-y-6 my-auto">
          <h1 className="font-bold text-default"> Log In</h1>
          <div className="grid relative -space-x-px">
            <TextInput
              label="Email Address"
              type="email"
              name="lg_email"
              classes=""
              defaultValue={formValues.email}
              placeholder=" "
              autoComplete="yes"
            />
          </div>
          <div className="grid relative -space-x-px ">
            <TextInput
              label="Password"
              type="password"
              name="lg_password"
              classes=""
              placeholder=" "
              defaultValue={formValues.password}
            />
          </div>

          <div className="h-16">
            <Button
              classes="h-12"
              type="submit"
              label="Log In"
              isLoading={isLoadingLogin}
            >
              Log In
            </Button>
          </div>

          <div className="h-2 border-b border-gray-200 text-xs text-gray-400 text-center">
            <span className="bg-white px-5">OR</span>
          </div>

          <OutlineButton
            type="button"
            label="Create Account"
            onClick={() => setIsLogin(false)}
          >
            Create Account
          </OutlineButton>
        </div>
      </Form>

      {/* REGISTER================================================================ */}

      <Form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`${
          !isLogin ? "block" : "hidden"
        }  flex flex-col justify-between h-full md:mx-auto md:max-w-xs `}
        autoComplete="off"
      >
        <div className="flex flex-col space-y-6 md:space-y-6 my-auto">
          <h1 className="font-bold text-default"> Create your Account</h1>
          <div className="grid relative -space-x-px">
            <TextInput
              label="Email Address"
              type="email"
              name="email"
              classes=""
              defaultValue={formValues.email}
              placeholder=" "
              autoComplete="yes"
            />
          </div>
          <div className="grid relative -space-x-px ">
            <TextInput
              label="Password"
              type="password"
              name="password"
              classes=""
              placeholder=" "
              defaultValue={formValues.password}
            />
          </div>
          {/* <p className="text-sm md:text-xs">
        Already registered?{" "}
        <Link href="">
          <a>Log in</a>
        </Link>
      </p> */}

          <div className="flex items-start pt-8">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              value={agreedToTerms}
              onClick={handleAgreement}
              className="focus:ring-default h-4 w-4 text-default border-gray-300 rounded mr-2"
            />
            <p className="text-xs inline-block ">
              Creating an account means you're okay with our
              <Link href="">
                <a className=""> Terms of Service</a>
              </Link>
              {", "}
              <Link href="">
                <a className=""> Privacy Policy</a>
              </Link>{" "}
              and our default <Link href="">Notification Settings</Link>.
            </p>
          </div>

          <Button
            type={isLoading ? `submit` : ""}
            label="Create Account"
            disabled={!agreedToTerms}
            isLoading={isLoading}
          >
            Create Account
          </Button>
          <div className="h-2 border-b border-gray-200 text-xs text-gray-400 text-center">
            <span className="bg-white px-5">OR</span>
          </div>

          <OutlineButton
            type="button"
            onClick={() => setIsLogin(true)}
            label="Log In"
          >
            Log In
          </OutlineButton>
        </div>
      </Form>
    </>
  );
}
