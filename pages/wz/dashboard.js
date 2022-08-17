import Link from "next/link";
import {
  useFetchEventInfo,
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
import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/router";
import { Urls, fetchWrapper, authHeader } from "/helpers";
import useSWR from "swr";
import { useTheme } from "@mui/material/styles";
import { getCookie } from "cookies-next";

import Layout from "/components/wz/Layout";
import BoxWrap from "/components/wz/BoxWrap";
import WZHome from "/components/wz/pages/WZHome";
import WZRsvpPage from "/components/wz/pages/WZRsvpPage";
import WZRegistry from "/components/wz/pages/WZRegistry";
import WZOurStory from "/components/wz/pages/WZOurStory";
import MainToolbar from "../../components/wz/MainToolbar";
import PagesMenu from "../../components/wz/PagesMenu";
import Section from "../../components/wz/Section";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";

const pageList = [
  { name: "Home", href: "home", current: true },
  { name: "RSVP", href: "rsvp", current: false },
  { name: "Registry", href: "registry", current: false },
  { name: "Our Story", href: "our-story", current: false },
  {
    name: "Flights & Hotels",
    href: "flights-hotels",
    current: false,
  },
];

const urls = {
  home: `/wz/dashboard`,
  rsvp: `/wz/dashboard/rsvp`,
  registry: `/wz/dashboard/registry`,
  logistics: `/wz/dashboard/flights-hotels`,
  story: `/wz/dashboard/our-story`,
};

export default function DZDashboard({ events, baseUrl }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [pages, setTabs] = useState(pageList);
  const [currentPage, setCurrentPage] = useState(pageList[0]);

  const event = events[0];

  useEffect(() => {
    if (router.isReady) {
      let { page } = router.query ?? "home";
      // if (!query) return;
      ///
      const cp = pageList.find((p) => p.href === page);

      if (cp) {
        setCurrentPage(cp);
      } else {
        //redirect to 404
      }
    }
  }, [router.isReady]);

  const onChangePage = (tab) => {
    router.push("/wz/dashboard", "/wz/dashboard?page=" + tab.href, {
      shallow: true,
    });
    setCurrentPage(tab);
  };

  return (
    <>
      <Layout>
        {session ? (
          <>
            <MainToolbar event={event} baseUrl={baseUrl} />
            <div className="flex flex-col md:flex-row h-screenx">
              <div className="hiddenx md:flex py-6 md:w-60 h-full sticky top-16 bg-white">
                <PagesMenu
                  baseUrl="/wz/dashboard"
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
                  <WZRsvpPage event={event} pageTitle="Rsvp" />
                )}
                {currentPage.href === "registry" && (
                  <p className="text-center">Coming soon</p>
                  // <WZRegistry event={event} pageTitle="Gift Registry" />
                )}
                {currentPage.href === "our-story" && (
                  <WZOurStory event={event} pageTitle="Our Story" />
                )}
                {currentPage.href === "flights-hotels" && (
                  <p className="text-center">Coming soon</p>
                )}
              </div>
              <div className="hidden md:flex w-1/4 p-6 h-full sticky top-16 bg-white"></div>
            </div>
          </>
        ) : (
          <div>Loading...</div>
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
}

export const getServerSideProps = async ({ req, res }) => {
  // const fetcher = async (url, headers) => await fetch(url, {'method': 'GET', headers}).then(res => res.json())

  // const product_url = 'http://127.0.0.1:8000/api/product/'
  // const headers = {
  //         'Content-type': 'application/json',
  //         'Authorization': `Token 9824eda0dd38b631b4aedf192899651cba91be53`
  //       }
  // const { data, error } = useSWR([product_url, headers], fetcher)
  // console.log(data.results[1].name)
  // const c = getCookie('E4_UIF', { req, res });
  let user = getCookie("E4_UIF", { req, res });

  // console.log("user", user);
  user = JSON.parse(user);
  // console.log("user", user.profile);
  // return;
  const url =
    Urls.event + "?owner=" + user.profile.id + "&publicationState=preview";

  const headers = {
    method: "GET",
    "Content-type": "application/json",
    Authorization: `Bearer ${user.jwt}`,
  };

  const response = await fetch(url, headers);
  // console.log(response.ok);
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
