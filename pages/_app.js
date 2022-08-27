import "../styles/globals.css";

import "../styles/loaders.css";
import "../styles/Calendar.css";
import "../styles/DatePicker.css";

import { SessionProvider } from "next-auth/react";
import GooglePlacesScript from "../components/GooglePlacesScript";
import Head from "next/head";
import Providers from "@/components/providers/Providers";
import { initializeApp } from "firebase/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import { CookiesProvider } from "react-cookie";
import { userService } from "/services";
import { AppProps } from "next/app";

// import { Typography } from "@material-ui/core";
let firebaseConfig;
if (process.env.NODE_ENV === "production") {
  firebaseConfig = {
    apiKey: "AIzaSyCxLWVA1DxY23IOG4ljhAJ6VMqYWH3OIPs",
    authDomain: "eventfour-prod.firebaseapp.com",
    projectId: "eventfour-prod",
    storageBucket: "eventfour-prod.appspot.com",
    messagingSenderId: "961417591581",
    appId: "1:961417591581:web:3d97e3b1f0ce0cb2e17ff4",
    measurementId: "G-H7X66BSRXW",
  };
} else if (process.env.NODE_ENV === "staging") {
  firebaseConfig = {
    apiKey: "AIzaSyA5Q_2CrZOKqdyxSU2ZH9ch5Pw8jgW4EEE",
    authDomain: "eventfour-stg.firebaseapp.com",
    projectId: "eventfour-stg",
    storageBucket: "eventfour-stg.appspot.com",
    messagingSenderId: "540929213655",
    appId: "1:540929213655:web:4ef19496c9eacdedf05c92",
    measurementId: "G-HVKWG07Q48",
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyCQDP7RmKv7QVN926tXevm3J2LPCkxBAh0",
    authDomain: "eventfour-1ea7e.firebaseapp.com",
    projectId: "eventfour-1ea7e",
    storageBucket: "eventfour-1ea7e.appspot.com",
    messagingSenderId: "6881914388",
    appId: "1:6881914388:web:50a1cd43d1d8adfc9fc101",
    measurementId: "G-3HCEFX3NQG",
  };
}

const firebaseApp = initializeApp(firebaseConfig);
const theme = createTheme({
  typography: {
    fontFamily: ["Poppins"].join(","),
  },
  palette: {
    primary: {
      main: "#d71f69", // "#be8688", // "#d71f69",
    },
    secondary: {
      main: "#ffc5a8",
    },
  },
  components: {
    // Name of the component
    MuiButton: {
      defaultProps: {
        sx: {
          textTransform: "none",
          fontWeight: "500",
          whiteSpace: "nowrap",
          // p: 4,
          px: 3,
          height: "45px",
        },
        size: "small",
        variant: "contained",
        disableElevation: true,
        // fullWidth: true,
      },
    },
    MuiLoadingButton: {
      defaultProps: {
        variant: "contained",
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  // console.log(session);
  // if (session) {
  //   userService.setUser(session.user);
  //   console.log("session", session);
  // } else {
  //   console.log("session", "none");
  // }

  return (
    <div className="flexx h-full w-full">
      <ThemeProvider theme={theme}>
        <CookiesProvider>
          <SessionProvider session={pageProps.session}>
            <Providers>
              <Head>
                <title>EventFour</title>
                <meta
                  name="viewport"
                  content="width=device-width,initial-scale=1.0, minimum-scale=1.0, user-scalable=no"
                />
              </Head>
              <GooglePlacesScript />
              <Component {...pageProps} />
            </Providers>
          </SessionProvider>
        </CookiesProvider>
      </ThemeProvider>
    </div>
  );
}

export default MyApp;
