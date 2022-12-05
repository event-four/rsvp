/* This example requires Tailwind CSS v2.0+ */
import { useRouter } from "next/router";
import { Fragment, useState, useEffect, useRef, memo } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import BoxWrap from "./BoxWrap";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import { grey, pink } from "@mui/material/colors";
import { ref } from "yup";
import { Modal } from "@/components/common/Modal";
import {getMetaKey} from '@/helpers/utils'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


const GlobalNavbar = ({
  staticNavbar = false,
  openSearchDialog,
  onDialogClose,
}) => {


  const { data: session, status } = useSession();
  const [clientWindowHeight, setClientWindowHeight] = useState("");
  const [backgroundTransparency, setBackgroundTransparency] = useState(0);
  const [padding, setPadding] = useState(30);
  const [boxShadow, setBoxShadow] = useState(0);
  const [activeRoute, setActiveRoute] = useState("/");
  const router = useRouter();

  const handleScroll = () => {
    setClientWindowHeight(window.scrollY);
  };

  const isHome = activeRoute == "/" 

  useEffect(() => {
    if (router.isReady) {
      let eid = router.route;
      setActiveRoute(eid);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (!staticNavbar) {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  });

  useEffect(() => {
    let backgroundTransparencyVar = clientWindowHeight / 250;

    if (backgroundTransparencyVar < 1) {
      let paddingVar = 30 - backgroundTransparencyVar * 20;
      let boxShadowVar = backgroundTransparencyVar * 0.1;
      setBackgroundTransparency(backgroundTransparencyVar);
      setPadding(paddingVar);
      setBoxShadow(boxShadowVar);
    }
  }, [clientWindowHeight]);


  return (
    <>
      <Disclosure
        as="nav"
        className="bg-white hover:bg-white container-fluid sm:px-24 sticky top-0 z-[500]"
        style={{
          background: staticNavbar
            ? ""
            : `rgba(255, 255, 255, ${backgroundTransparency})`,
          boxShadow: staticNavbar
            ? ""
            : `rgb(0 0 0 / ${isHome ? boxShadow: '0.1'}) 0px 0px 20px 6px`,
        }}
      >
        {({ open }) => (
          <>
            <BoxWrap>
              <div className="relative flex justify-center items-center h-16">
                <div className="absolutex inset-y-0 left-0 flex items-center sm:hidden flex-grow flex-1 ">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                  <div className="ml-2 flex flex-grow">
                    <p className="font-extrabold text-2xl text-default">
                      eventfour
                    </p>
                  </div>
                 <div className="text-default font-bold" onClick={openSearchDialog}>
                  <SearchIcon sx={{ fontSize: 24 }} />
                  </div> 
                  <a
                      className="mx-4 text-sm min-w-[60px] text-gray-900 bg-white sm:bg-transparent rounded-full bg-opacity-90 px-3 py-2 shadow-lg"
                      href="/auth/login"
                    >
                      Login
                    </a>
                </div>
                <div
                  className={`hidden ml-2x min-w-[300px] sm:flex flex-row items-center`}
                  style={{
                    color: `rgba(193, 135, 135, ${isHome ?backgroundTransparency:'1'})`,
                  }}
                >
                  <p className={`font-extrabold text-2xl`}>eventfour</p>
                 
                </div>
                <div className="hidden flex-grow sm:flex items-center justify-center w-auto min-w-[500px]">
                  {/* Current: "border-pink-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <a
                    href="/"
                    className={`inline-flex items-center px-4 pt-1 text-sm  ${
                      activeRoute == "/"
                        ? "text-pink-600 font-semibold"
                        : "text-gray-600 font-normal"
                    }`}
                  >
                    Home
                  </a>

                  <a
                    href="/get-help"
                    className={` hover:text-gray-700 inline-flex items-center px-4 pt-1 text-sm  ${
                      activeRoute == "/get-help"
                        ? "text-pink-600 font-semibold"
                        : "text-gray-600 font-normal"
                    }`}
                  >
                    Get Help
                  </a>
                </div>
                 <div className={`flex flex-row space-x-2 bg-white text-sm justify-center items-center rounded-full border p-2 pr-4 border-default text-default cursor-pointer ${isHome ? backgroundTransparency > 0.9 ? 'opacity-100':'opacity-0':'opacity-100'} transition duration-300 ease-in-out`}
                  onClick={openSearchDialog} 
                >
                  <SearchIcon sx={{ fontSize: 24 }} /> 
                  <p className="pr-4">Quick search</p>
                  <kbd class="font-sans font-semibold text-slate-400 flex flex-row items-center space-x-1">
                    {getMetaKey()}<span>K</span></kbd>
                </div> 
                <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-2 sm:static sm:inset-auto sm:ml-4 sm:pr-0">
                  {/* Profile dropdown */}
                  {session ? (
                    <Menu as="div" className="ml-3 relative hiddenx">
                      <div>
                        <Menu.Button className=" rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-default items-center ml-4 shadow-lg sm:shadow-none border-4 border-white sm:border-none bg-white p-1">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full "
                            src={session.user.profile.avatar.thumbnail}
                            alt=""
                          />
                          <div className="ml-2 pr-4 hidden sm:block text-sm text-gray-600">
                            {session.user.profile.firstName}{" "}
                            {session.user.profile.lastName}
                          </div>
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-60">
                          {session.user.vendor_profile && (
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="/vendor/dashboard"
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  My Vendor Profile
                                </a>
                              )}
                            </Menu.Item>
                          )}
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="/host/dashboard"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                My Event Website
                              </a>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="#"
                                onClick={() => signOut({ redirect: true })}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700"
                                )}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <a
                      className="hidden md:flex ml-6 text-sm min-w-[60px] text-default bg-white sm:bg-transparent rounded-full bg-opacity-90 px-3 py-2 shadow-lgx border border-default"
                      href="/auth/login"
                    >
                      Login
                    </a>
                  )}
                </div>
              </div>
            </BoxWrap>

            <Disclosure.Panel className="sm:hidden">
              <div className="flex flex-col bg-white divide-y mx-6 rounded-xl shadow-lg p-4">
                <a
                  href="/"
                  className={` py-3   ${
                    activeRoute == "/"
                      ? "text-default "
                      : "text-gray-600 font-normal"
                  }`}
                >
                  Home
                </a>
                <a
                  href="/get-help"
                  className={` py-3   ${
                    activeRoute == "/get-help"
                      ? "text-default "
                      : "text-gray-600 font-normal"
                  }`}
                >
                  Get Help
                </a>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default memo(GlobalNavbar);
