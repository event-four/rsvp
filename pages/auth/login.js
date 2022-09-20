import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { userService } from "/services";
import Layout from "@/components/host/Layout";
import * as yup from "yup";
import { Form } from "@unform/web";
import { useSnackbar } from "@/components/SnackBar";
import { TextInput, Button, OutlineButton } from "@/components/form";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSession, signIn, getSession } from "next-auth/react";
import Link from "next/link";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const DZLoginPage = ({ hasDashboard, hasUser }) => {
  const formRef = useRef();
  const snackbar = useSnackbar();
  const router = useRouter();
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);
  const { data: session, status } = useSession();

  async function handleSubmit(formData) {
    setIsLoadingLogin(true);

    try {
      formRef.current.setErrors({});

      await schema.validate(formData, {
        abortEarly: false,
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
              router.push("/host/dashboard");
            }
          } else {
            throw response.error;
          }
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });

      setIsLoadingLogin(false);
    } catch (err) {
      setIsLoadingLogin(false);
      const errors = {};
      console.log(err);

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

      if (err) {
        console.log(err);
        if (err.includes("auth/wrong-password")) {
          snackbar.error("Your login information is incorrect.");
        } else if (err.includes("auth/too-many-requests")) {
          snackbar.error(
            "Access to this account has been temporarily disabled due to many failed login attempts. Reset your password or try again later."
          );
        } else if (err.includes("auth/network-request-failed")) {
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
    <Layout>
      <div className="container mx-autox grid md:grid-cols-3x md:gap-4x h-screen">
        <div className="p-6 align-middle h-full md:mx-autox md:col-span-4x">
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`flex flex-col justify-between h-full md:mx-auto md:max-w-xs  `}
            autoComplete="off"
          >
            <div className="flex flex-col space-y-6 md:space-y-6 my-auto">
              <h1 className="font-bold text-default"> Log In</h1>
              <div className="grid relative -space-x-px">
                <TextInput
                  label="Email Address"
                  type="email"
                  name="email"
                  classes=""
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
                  isPassword={true}
                />
              </div>

              <Button
                isLoading={isLoadingLogin}
                // loadingPosition="center"
                type="submit"
              >
                Log In
              </Button>

              <div className="flex text-sm w-full items-center justify-center">
                <Link href="/auth/forgot_password">
                  <a>Forgot Password?</a>
                </Link>
              </div>
              {/* <div className="h-2 border-b border-gray-200 text-xs text-gray-400 text-center">
                <span className="bg-white px-5">OR</span>
              </div>

              <OutlineButton
                type="button"
                label="Create Account"
                onClick={() => setIsLogin(false)}
              >
                Create Account
              </OutlineButton> */}
            </div>
          </Form>
        </div>
      </div>
    </Layout>
  );
};
export default DZLoginPage;
