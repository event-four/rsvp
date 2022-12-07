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
import { useEffect, useRef, useState } from "react";
import GlobalLayout from "@/components/layout/GlobalLayout";
import GlobalNavbar from "@/components/layout/GlobalNavbar";
import SearchIcon from "@mui/icons-material/Search";
import { grey } from "@mui/material/colors";
import { Modal } from "@/components/common/Modal";
import { getMetaKey } from "@/helpers/utils";

export default function Home() {
  const { data: session } = useSession();
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [osName, setOsName] = useState();

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
    // Destroying
    return () => {
      typed.destroy();
      // typed1.destroy();
    };
    setOsName(osName);
  }, []);

  const focusSearch = (e) => {
    // e.preventDefault();
    setShowSearchDialog(true);
    // window.scrollTo({ top: 250, behavior: "smooth" });
  };

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
    <GlobalLayout
      showLogo={true}
      openSearchDialog={openSearchDialog}
      closeSearchDialog={() => setOpenSearchDialog(false)}
    >
      <Head>
        <title>EventFour</title>
        <meta name="description" content="Stress-free events" />
        <meta property="og:title" content="EventFour - Stress-free Events" />
        <meta property="og:image" content="/favicon.png"></meta>
      </Head>
      <div className="container-fluid flex flex-col bg-primary">
        <div className="container-fluid relative flex flex-col h-full justify-between">
          <section className="container mx-auto p-6 md:px-24 flex items-center justify-center flex-col py-20 sm:py-32">
            <h1 className="text-3xl px-6 text-center flex flex-col md:flex-row font-bold leading-[36px] space-y-2 sm:space-y-0">
              <div>Stressless Events&nbsp;</div>

              <div className="flex flex-row space-x-2 justify-center">
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
          <section className="flex flex-col justify-center items-center mb-20 w-full px-8 sm:mx-auto sm:w-3/5 md:w-1/2 ">
            <div
              className="flex flex-row rounded-full bg-white w-full px-6 py-2 items-center shadow-sm"
              onClick={() => setOpenSearchDialog(true)}
            >
              <SearchIcon sx={{ fontSize: 36, color: grey[300] }} />
              <div className="text-gray-300 flex flex-grow">
                What are you looking for?
              </div>
              <kbd class="text-sm text-slate-300 bg-slate-100 p-1 rounded-lg px-2 flex flex-row items-center space-x-1">
                {getMetaKey(osName)}
                <span>K</span>
              </kbd>
            </div>
            <p className="text-2xs sm:text-xs mt-2 text-default">
              Type an event code, celebrant's name, vendor, or service.
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
        </div>
      </div>
    </GlobalLayout>
  );
}
