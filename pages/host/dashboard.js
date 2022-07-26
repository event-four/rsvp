import Link from "next/link";
import {
  useFetchEventInfoByOwnerId,
  userService,
  useFetchEvents,
  swrResponse,
} from "/services";
import { constants } from "/helpers/";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
// import ShareIcon from "@mui/icons-material/ShareIcon";
import SettingsIcon from "@mui/icons-material/Settings";
import { useSession } from "next-auth/react";
import { useEffect, useState, Fragment, memo } from "react";
import { useRouter } from "next/router";
import { Urls, fetchWrapper, authHeader } from "/helpers";
import useSWR from "swr";
import { useTheme } from "@mui/material/styles";
import { getCookie } from "cookies-next";

import Layout from "/components/host/Layout";
import BoxWrap from "/components/host/BoxWrap";
import WZHome from "/components/host/pages/HostHome";
import WZRsvpPage from "/components/host/pages/HostRsvpPage";
import WZRegistry from "/components/host/pages/HostRegistry";
import WZOurStory from "/components/host/pages/HostOurStory";
import WZWishes from "/components/host/pages/HostWishes";
import MainToolbar from "../../components/host/MainToolbar";
import PagesMenu from "../../components/host/PagesMenu";
import Section from "../../components/host/Section";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

const pageList = [
  { name: "Home", href: "home", current: true },
  { name: "RSVP", href: "rsvp", current: false },
  { name: "Our Story", href: "our-story", current: false },
  { name: "Registry", href: "registry", current: false },
  { name: "Wishes", href: "wishes", current: false },
  // {
  //   name: "Flights & Hotels",
  //   href: "flights-hotels",
  //   current: false,
  // },
];

const urls = {
  home: `/host/dashboard`,
  rsvp: `/host/dashboard/rsvp`,
  registry: `/host/dashboard/registry`,
  logistics: `/host/dashboard/flights-hotels`,
  story: `/host/dashboard/our-story`,
};

const DZDashboard = ({ owner, events, baseUrl }) => {
  const { data: session, status } = useSession();

  const router = useRouter();
  // console.log(session);

  const [open, setOpen] = useState(false);

  const [pages, setTabs] = useState(pageList);
  const [currentPage, setCurrentPage] = useState(pageList[0]);
  const [event, setEvent] = useState(events ? events[0] : null);

  // const firstEvent = events ? events[0] : null;
  const { data: eventInfo, loading, error } = useFetchEventInfoByOwnerId(owner);

  useEffect(() => {
    if (!owner) {
      if (router.isReady) {
        router.push("/auth/login");
      }
    }
    if (status === "unauthenticated") {
      if (router.isReady) {
        router.push("/auth/login");
      }
    }

    // if (!events || events.length === 0) {
    //   if (router.isReady) {
    //     console.log(router);
    //     router.push("/host");
    //   }
    // }
    if (router.isReady) {
      let { page } = router.query ?? "home";
      const cp = pageList.find((p) => p.href === page);

      if (cp) {
        setCurrentPage(cp);
      } else {
        //redirect to 404
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    console.log(eventInfo);

    if (eventInfo) {
      if (eventInfo.length === 0) {
        if (router.isReady) {
          console.log(router);
          router.push("/host");
        }
      }
      console.log("sett");

      setEvent(eventInfo[0]);
    }
  }, [eventInfo]);
  // return;

  const onChangePage = (tab) => {
    router.push("/host/dashboard", "/host/dashboard?page=" + tab.href, {
      shallow: true,
    });
    setCurrentPage(tab);
  };

  // if (loading || error) {
  //   console.log("ev", eventInfo);
  //   return <div>Loadinga...</div>;
  // }

  return (
    <>
      <Layout>
        {session ? (
          event && (
            <>
              <MainToolbar event={event} baseUrl={baseUrl} />
              <div className="flex flex-col md:flex-row h-screenx">
                <div className="hiddenx md:flex py-6 md:w-60 h-full sticky top-16 bg-white">
                  <PagesMenu
                    baseUrl="/host/dashboard"
                    currentPage={currentPage}
                    pages={pages}
                    onChangePage={onChangePage}
                  />
                </div>
                <div className="flex flex-1 flex-col bg-gray-100 h-fullx h-screen p-4 md:px-6 md:py-6 space-y-6 overflow-auto">
                  {currentPage.href === "home" && (
                    <WZHome event={event} pageTitle="Home" />
                  )}
                  {currentPage.href === "rsvp" && (
                    <WZRsvpPage event={event} pageTitle="RSVP" />
                  )}
                  {currentPage.href === "registry" && (
                    // <p className="text-center">Coming soon</p>
                    <WZRegistry event={event} pageTitle="Your Registry" />
                  )}
                  {currentPage.href === "our-story" && (
                    <WZOurStory event={event} pageTitle="Our Story" />
                  )}
                  {currentPage.href === "flights-hotels" && (
                    <p className="text-center">Coming soon</p>
                  )}
                  {currentPage.href === "wishes" && (
                    <WZWishes slug={event.slug} pageTitle="Wishes" />
                  )}
                </div>
                <div className="hidden md:flex w-1/4 p-6 h-full sticky top-16 bg-white"></div>
              </div>
            </>
          )
        ) : (
          <div className="flex h-full justify-center items-center">
            Loading data...
          </div>
        )}
      </Layout>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden z-70"
          onClose={setOpen}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Panel title
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 relative flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <div className="absolute inset-0 px-4 sm:px-6">
                        <div
                          className="h-full border-2 border-dashed border-gray-200"
                          aria-hidden="true"
                        />
                      </div>
                      {/* /End replace */}
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default memo(DZDashboard);

export const getServerSideProps = async ({ req, res }) => {
  let user = getCookie("E4_UIF", { req, res });

  if (!user) {
    console.log("E4_UIF not found");
    return { props: {} };
  }
  user = JSON.parse(user);

  return {
    props: {
      owner: user.profile.id,
      events: null,
      baseUrl: process.env.EVENT_WEBSITE_BASE_URL,
    },
  };

  const url =
    Urls.event + "?owner=" + user.profile.id + "&publicationState=preview";

  const headers = {
    method: "GET",
    "Content-type": "application/json",
    Authorization: `Bearer ${user.jwt}`,
  };

  const response = await fetch(url, headers);
  if (!response.ok) {
    return { props: {} };
  }

  let data = await response.json();

  return {
    props: {
      events: data.data,
      baseUrl: process.env.EVENT_WEBSITE_BASE_URL,
    },
  };
};
