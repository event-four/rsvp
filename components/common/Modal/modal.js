import React from "react";

import { useDialogPolyfill } from "./useDialogPolyfill";
import SearchIcon from "@mui/icons-material/Search";
import { grey, pink } from "@mui/material/colors";

export function Modal({ closeOnOutsideClick, onRequestClose, open, searchText, ...props }) {
  const dialogRef = React.useRef(null);
  const lastActiveElement = React.useRef(null);
  const firstRender = React.useRef(true);

  useDialogPolyfill(dialogRef);

  React.useEffect(() => {
    // prevents calling imperative methods on mount since the polyfill will throw an error since we are not using the `open` attribute
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      const dialogNode = dialogRef.current;
      if (open) {
        lastActiveElement.current = document.activeElement;
        dialogNode.showModal();
      } else {
        dialogNode.close();
        // lastActiveElement.current.focus();
      }
    }
  }, [open]);

  React.useEffect(() => {
    const dialogNode = dialogRef.current;
    const handleCancel = (event) => {
      event.preventDefault();
      onRequestClose();
    };
    dialogNode.addEventListener("cancel", handleCancel);
    return () => {
      dialogNode.removeEventListener("cancel", handleCancel);
    };
  }, [onRequestClose]);

  function handleOutsideClick(event) {
    onRequestClose();
    // const dialogNode = dialogRef.current;
    // if (closeOnOutsideClick && event.target === dialogNode) {
    //   onRequestClose();
    // }
  }

  React.useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === "Escape") {
        onRequestClose();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return (
    <dialog ref={dialogRef} style={{ padding: 0 }} onClick={handleOutsideClick}>
      <div className="DocSearch-Container">
        <div className="bg-default DocSearch-Modal ">
          <header className="flex flex-row px-3 py-3 border-b">
            <SearchIcon sx={{ fontSize: 36, color: grey[300] }} />
            <input
              // ref={searchRef}
              defaultValue={searchText}
              autoFocus
              className="inp w-full placeholder:text-gray-300 ml-2 sm:text-lg without-ring focus:ring-0 focus:ring-offset-0 outline-none "
              placeholder="Type here..."
            />
            <div className="text-sm p-2 bg-slate-100 text-slate-400 rounded-lg text-center">
              ESC
            </div>
          </header>
          <div className="text-xs px-3 py-3 text-gray-500">
            Type an event code, celebrant's name, vendor, or service.
          </div>
          {/* <div {...props} /> */}
        </div>
      </div>
    </dialog>
  );
}
