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
console.log(process.env.NODE_ENV);
const firebaseConfig =
  process.env.NODE_ENV == "development"
    ? {
        apiKey: "AIzaSyCQDP7RmKv7QVN926tXevm3J2LPCkxBAh0",
        authDomain: "eventfour-1ea7e.firebaseapp.com",
        projectId: "eventfour-1ea7e",
        storageBucket: "eventfour-1ea7e.appspot.com",
        messagingSenderId: "6881914388",
        appId: "1:6881914388:web:50a1cd43d1d8adfc9fc101",
        measurementId: "G-3HCEFX3NQG",
      }
    : {
        apiKey: "AIzaSyCxLWVA1DxY23IOG4ljhAJ6VMqYWH3OIPs",
        authDomain: "eventfour-prod.firebaseapp.com",
        projectId: "eventfour-prod",
        storageBucket: "eventfour-prod.appspot.com",
        messagingSenderId: "961417591581",
        appId: "1:961417591581:web:3d97e3b1f0ce0cb2e17ff4",
        measurementId: "G-H7X66BSRXW",
      };

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
