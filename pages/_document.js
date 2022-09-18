import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Pacifico&family=Poppins:wght@200;400;600&family=Rochester&display=swap"
          rel="stylesheet"
        />
        <meta property="og:title" content="EventFour" />
        <meta property="og:image" content="https://eventfour.com/favicon.png" />
        <meta property="og:url" content="https://eventfour.com" />
        <meta
          property="og:description"
          content="Embrace a simpler way to plan and attend events with EventFour (4-in-1) connective platform."
        />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
