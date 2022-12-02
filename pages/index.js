import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import LoginButton from "../components/login-btn";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/form";
import { CTA } from "@/components/guests/cta";
import Typical from "react-typical";
import Typed from "typed.js";
import { useEffect, useRef } from "react";
import GlobalNavbar from "@/components/layout/GlobalNavbar";

export default function Home() {
  const { data: session } = useSession();
  // console.log(session);
  const el = useRef(null);
  const el1 = useRef(null);
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "a Wedding?",
        "a Birthday?",
        "an Anniversary?",
        "a Funeral?",
        "any event?",
      ], // Strings to display
      // Speed settings, try diffrent values untill you get good results
      startDelay: 300,
      typeSpeed: 50,
      backSpeed: 50,
      backDelay: 500,
      smartBackspace: true,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
    // const typed1 = new Typed(el1.current, {
    //   strings: ["Hosts.", "Planners.", "Vendors.", "Guests."], // Strings to display

    //   startDelay: 300,
    //   typeSpeed: 100,
    //   backSpeed: 50,
    //   backDelay: 500,
    //   smartBackspace: true,
    //   loop: true,
    //   showCursor: true,
    //   cursorChar: "|",
    // });

    // Destroying
    return () => {
      typed.destroy();
      // typed1.destroy();
    };
  }, []);
  const EVI = ({ icon, text, caption }) => {
    return (
      <div className="flex flex-col justify-center items-center text-center space-y-3  py-12">
        <div className="bg-default rounded-full w-24 h-24">
          <img src={icon} width="130" />
        </div>
        <p className="text-default font-bold text-2xl ">{caption}</p>
        <p className="px-10 sm:px-6">{text}</p>
      </div>
    );
  };

  const DIVI = () => {
    return (
      <div className="h-1 border-b md:hidden border-b-default border-opacity-25"></div>
    );
  };

  const Country = ({ flag, name }) => {
    return (
      <div className="flex flex-col justify-center text-center items-center">
        {/* <img width="40" height="40" src={flag} /> */}
        <p className="font-bold mt-1">{name}</p>
      </div>
    );
  };
  return (
    <>
      <Head>
        <title>EventFour</title>
        <meta name="description" content="Stress-free events" />
        <meta property="og:title" content="EventFour - Stress-free Events" />
        <meta property="og:image" content="/favicon.png"></meta>
      </Head>
      <div className="container-fluid flex flex-col bg-primary">
        <div className=" min-h-full w-full ">
          <div className="f1"></div>
          {/* <div className="bg"></div> */}
          {/* <div className="bg-filter"></div> */}

          <div className="f2"></div>
          <div className="f3"></div>
        </div>
        <div className="container-fluid relative flex flex-col h-full justify-between">
          <div className="flex w-full justify-center items-center mt-4 mb-4 flex-col">
            <img src="/e4.png" height="auto" width="250px" />
            <span className="text-2xs text-gray-500 leading-3 -mt-2">
              Hosts . Planners . Vendors . Guests
            </span>
          </div>
          <GlobalNavbar />
          {/* <p className="text-center text-xl font-light mt-4 md:mx-72 ">
            Embrace a simpler way to plan and attend events with EventFour
            (4-in-1) connective platform.
          </p> */}
          {/* <div className="flex items-center flex-col mt-12">
            <p className="uppercase mb-1x text-xs">
              Join EventFour in <b>Nigeria</b> and <b>Dubai</b> today.
            </p>
          </div> */}
          {/* height: 1.2em; line-height: 1.2em; position: relative; overflow:
          hidden; width: 10em; */}
          <section className="container mx-auto p-6 md:px-24 flex items-center justify-center flex-col py-20 sm:py-36">
            <h1 className="text-3xl px-6 text-center flex flex-col md:flex-row font-bold leading-[36px] space-y-2 sm:space-y-0">
              <div>Stressless Events&nbsp;</div>

              <div class="flex flex-row space-x-2 justify-center">
                <p>for</p>
                <div className="scroller">
                  <span className="text-pink-600">
                    Hosts
                    <br />
                    Planners
                    <br />
                    Vendors
                    <br />
                    Guests
                  </span>
                </div>
              </div>
            </h1>

            <p className="mt-6 text-gray-600">
              Four Stakeholders . One Platform . Zero Stress
            </p>
          </section>
          <section className="container-fluid mx-auto sm:px-24 grid gap-6 grid-cols-1 sm:grid-cols-4 justify-center space-y-12x items-start">
            <EVI
              caption="Hosts"
              text="Connect your planner, guests and
              vendors via eventfour for a seamless experience."
              icon="/host.png"
            />
            <DIVI />
            <EVI
              caption="Planners"
              text="Plan and coordinate all your stakeholders on eventfour for speed
              and accessibility."
              icon="/planner.png"
            />
            <DIVI />
            <EVI
              caption="Vendors"
              text=" Increase your visibility within the event community with
              eventfour."
              icon="/vendors.png"
            />
            <DIVI />
            <EVI
              caption="Guests"
              text="Socialize and celebrate your special ones without stress via
              eventfour."
              icon="/guests.png"
            />
          </section>
          <section className="flex flex-col bg-[#be878852] bg-pink-50x container-fluid h-[500px] py-24 px-6 md:px-24 md:py-32 mt-8 items-center justify-center relative">
            <div className=" w-full h-full bg-[url(/wedg.png)] bg-no-repeat bg-left-top absolute -ml-96 hidden lg:block z-[60]"></div>
            <p className="text-center mb-12 text-xl">Are you a vendor?</p>
            <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-800 md:w-3/5 ">
              Let's find the best clients for your business.
            </h1>
            <a
              href="/vendor/start"
              className="flex w-auto mt-16 align-center min-w-[200px] bg-pink-600 hover:bg-pink-700 px-8 py-4 rounded-lg text-center justify-center text-white hover:text-pink-100 z-[100]"
            >
              Join now
            </a>
          </section>
          <section className="flex flex-col bg-white container-fluid h-[600px] md:h-[500px] py-60 px-6 md:px-24 md:py-32 mt-0 items-center justify-center relative ">
            <div className=" w-full h-[600px] md:h-[500px] bg-[url(/chatbg.jpeg)] bg-no-repeat bg-right-bottom bg-cover md:bg-contain absolute md:block opacity-30 md:opacity-100 z-[60]"></div>
            <div className="z-[100] relative flex flex-col items-center justify-center">
              <p className="text-center mb-12 text-xl">
                Planning <span ref={el} className="text-pink-600"></span>
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-800 md:w-2/3 font-poppins px-6">
                Create your own event website for free!
              </h1>
              <p className="text-gray-500 mt-6 text-center px-6 md:px-0">
                Your website is ready to share in 4 minutes or less.
              </p>
              <a
                href="/host/start"
                className="flex w-auto mt-16 align-center min-w-[200px] bg-pink-600 hover:bg-pink-700 px-8 py-4 rounded-lg text-center justify-center text-white hover:text-pink-100 "
              >
                Get started
              </a>
            </div>
          </section>
          <div className="h-1"></div>
          <div>
            <div className="text-center text-sm mt-16 mb-5 font-poppins px-8 text-gray-800 ">
              <>
                <p>Planning an event?</p>
                <Link href="/host/start" className="underline text-pink-600">
                  Create your own event website for free!
                </Link>
              </>
            </div>
            <p className="text-sm text-center mb-5 text-gray-800">
              &copy; 2022. EventFour Ltd.
            </p>
          </div>
        </div>
      </div>
    </>

    // <div className={styles.container}>
    //   <h1 className="text-3xl font-bold underline text-center">Hello world!</h1>

    //   <LoginButton></LoginButton>
    //   <Head>
    //     <title>EventFour</title>
    //     <meta name="description" content="Generated by create next app" />
    //   </Head>
    //   <br></br>
    //   <Link href="/host/dashboard">Dashboard</Link>
    //   <main className={styles.main}></main>

    //   <footer className={styles.footer}>
    //     <a
    //       href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Powered by{" "}
    //       <span className={styles.logo}>
    //         <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
    //       </span>
    //     </a>
    //   </footer>
    // </div>
  );
}
