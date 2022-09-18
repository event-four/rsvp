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
        <meta property="og:title" content="EventFour - Stress-free Events" />
        <meta property="og:image" content="/favicon.png"></meta>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
