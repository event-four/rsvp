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
import DshVendorHome from "/components/vendor/pages/VendorHome";
import DshVendorProfile from "/components/vendor/pages/VendorProfile";
import DshVendorGallery from "/components/vendor/pages/VendorGallery";
import DshVendorServicesForm from "/components/vendor/pages/VendorServicesForm";
import WZRsvpPage from "/components/host/pages/HostRsvpPage";
import WZRegistry from "/components/host/pages/HostRegistry";
import WZOurStory from "/components/host/pages/HostOurStory";
import WZWishes from "/components/host/pages/HostWishes";
import MainToolbar from "../../components/host/MainToolbar";
import PagesMenu from "../../components/host/PagesMenu";
import Section from "../../components/host/Section";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import {
  useUpdateVendorProfile,
  useFetchVendorProfile,
  useUpdateVendorProfilePhoto,
} from "@/services/vendor-service";
const pageList = [
  { name: "Dashboard", href: "home", current: true },
  { name: "Business Profile", href: "business", current: false },
  { name: "Services", href: "services", current: false },
  { name: "Photos & Videos", href: "gallery", current: false },
  { name: "Account", href: "account", current: false },
];

const urls = {
  home: `/host/dashboard`,
  account: `/host/dashboard/account`,
  business: `/host/dashboard/business`,
  services: `/host/dashboard/services`,
  gallery: `/host/dashboard/gallery`,
};

const DZDashboard = ({ owner }) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [pages, setTabs] = useState(pageList);
  const [currentPage, setCurrentPage] = useState(pageList[0]);

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

  const onChangePage = (tab) => {
    router.push("/vendor/dashboard", "/vendor/dashboard?page=" + tab.href, {
      shallow: true,
    });
    setCurrentPage(tab);
  };

  return (
    <Layout>
      {session ? (
        <DZDashboardPage
          currentPage={currentPage}
          onChangePage={onChangePage}
          pages={pages}
        ></DZDashboardPage>
      ) : (
        <div className="flex h-full justify-center items-center">
          Loading data...
        </div>
      )}
    </Layout>
  );
};

const DZDashboardPage = ({ pages, currentPage, onChangePage }) => {
  const user = userService.getUser();
  const v = user.vendor_profile;
  const { data: vendorProfile, loading, error } = useFetchVendorProfile(v.id);

  if (!vendorProfile) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row ">
        <div className="md:flex py-6 md:w-60 h-full sticky top-16 bg-white">
          <PagesMenu
            title=""
            baseUrl="/vendor/dashboard"
            currentPage={currentPage}
            pages={pages}
            onChangePage={onChangePage}
          />
        </div>
        <div className="flex flex-1 flex-col bg-gray-100 h-screen p-4 md:px-6 md:py-6 space-y-6 overflow-auto">
          {currentPage.href === "home" && <DshVendorHome pageTitle="Home" />}
          {currentPage.href === "business" && (
            <DshVendorProfile
              pageTitle="Business Profile"
              vendor={vendorProfile}
            />
          )}
          {currentPage.href === "services" && (
            <DshVendorServicesForm
              pageTitle="Your Services"
              vendor={vendorProfile}
            />
          )}
          {currentPage.href === "gallery" && (
            <DshVendorGallery
              pageTitle="Your Photos & Videos"
              vendor={vendorProfile}
            />
          )}
        </div>
      </div>
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
      // events: null,
      // baseUrl: process.env.EVENT_WEBSITE_BASE_URL,
    },
  };
};
