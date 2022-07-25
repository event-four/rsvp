import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import AppProvider from "../context/AppContext";
import { useState } from "react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <AppProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </AppProvider>
  );
}

export default MyApp;
