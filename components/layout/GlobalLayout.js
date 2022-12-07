import GlobalNavbar from "./GlobalNavbar";
import Link from "next/link";
import { memo } from "react";
import { Modal } from "@/components/common/Modal";
import { useEffect, useRef, useState } from "react";

const GlobalLayout = ({
  showLogo = false,
  children,
  staticNavbar,
  openSearchDialog,
  closeSearchDialog,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const toggleDialog = () => setDialogOpen((bool) => !bool);

  const closeDialog = () => {
    setDialogOpen(false);
    closeSearchDialog();
  };

  useEffect(() => {
    setDialogOpen(openSearchDialog);
  }, [openSearchDialog]);

  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === "Escape") {
        closeSearchDialog();
      }
      if (event.metaKey && event.code === "KeyK") {
        setDialogOpen(true);
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return (
    <div className="container-fluid flex flex-col bg-primary relative">
      <Modal
        open={dialogOpen}
        onRequestClose={closeDialog}
        closeOnOutsideClick={true}
        searchText={searchText}
      ></Modal>

      <div className="min-h-full w-full">
        <div className="f1"></div>
        <div className="f2 opacity-25 sm:opacity-100"></div>
        <div className="f3"></div>
      </div>
      <div className="container-fluid relative flex flex-col">
        {showLogo && (
          <div className="hidden sm:flex w-full justify-center items-center mt-4 mb-4 flex-col">
            <img src="/e4.png" height="auto" width="250px" />
            <span className="text-2xs text-gray-500 leading-3 -mt-2">
              Hosts . Planners . Vendors . Guests
            </span>
          </div>
        )}

        <GlobalNavbar
          staticNavbar={staticNavbar}
          openSearchDialog={() => setDialogOpen(true)}
        />

        <div className="relative z-[10]">{children}</div>
      </div>
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
  );
};

export default memo(GlobalLayout);
