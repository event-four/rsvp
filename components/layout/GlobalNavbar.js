/* This example requires Tailwind CSS v2.0+ */
import { useRouter } from "next/router";
import { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import BoxWrap from "./BoxWrap";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function GlobalNavbar({ staticNavbar = false }) {
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
    <Disclosure
      as="nav"
      className="bg-white hover:bg-white container-fluid sm:px-24 sticky top-0 z-[500]"
      style={{
        background: staticNavbar
          ? ""
          : `rgba(255, 255, 255, ${backgroundTransparency})`,
        boxShadow: staticNavbar
          ? ""
          : `rgb(0 0 0 / ${boxShadow}) 0px 0px 20px 6px`,
      }}
    >
      {({ open }) => (
        <>
          <BoxWrap>
            <div className="relative flex justify-center items-center h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden ">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <div className="ml-2">
                  <p className="font-extrabold text-2xl text-default">
                    eventfour
                  </p>
                </div>
              </div>
              <div
                className={`hidden sm:block ml-2x min-w-[60px]x`}
                style={{
                  color: `rgba(193, 135, 135, ${backgroundTransparency})`,
                }}
              >
                <p className={`font-extrabold text-2xl`}>eventfour</p>
              </div>
              <div className="hidden flex-grow sm:ml-6x sm:flex sm:space-x-8x justify-center w-auto">
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
                    className="ml-6 text-sm min-w-[60px] text-gray-900"
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
  );
}
