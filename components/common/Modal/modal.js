import React from "react";

import { useDialogPolyfill } from "./useDialogPolyfill";
import { useEffect, useRef } from "react";
import Autocomplete from "./Autocomplete";

export function Modal({
  closeOnOutsideClick,
  onRequestClose,
  open,
  searchText,
  ...props
}) {
  const dialogRef = useRef(null);
  const lastActiveElement = useRef(null);
  const firstRender = useRef(true);

  useDialogPolyfill(dialogRef);

  useEffect(() => {
    // prevents calling imperative methods on mount since the polyfill will throw an error since we are not using the `open` attribute
    if (firstRender.current) {
      firstRender.current = false;
    } else {
      const dialogNode = dialogRef.current;

      if (open) {
        lastActiveElement.current = document.activeElement;
        if (dialogNode.open) return;
        dialogNode.showModal();
      } else {
        dialogNode.close();
        // lastActiveElement.current.focus();
      }
    }
  }, [open]);

  useEffect(() => {
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

  function handleOutsideClick(e) {
    if (e.target !== e.currentTarget) return;
    onRequestClose();
    // const dialogNode = dialogRef.current;
    // if (closeOnOutsideClick && e.target === dialogNode) {
    //   onRequestClose();
    // }
  }

  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === "Escape") {
        onRequestClose();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, []);

  return (
    <dialog ref={dialogRef} style={{ padding: 0 }}>
      <div
        className={`DocSearch-Container ${open ? "block" : "hidden"} `}
        onClick={handleOutsideClick}
      >
        <div className="bg-default DocSearch-Modal ">
          <Autocomplete
            suggestions={[
              "Alligator",
              "Bask",
              "Crocodilian",
              "Death Roll",
              "Eggs",
              "Jaws",
              "Reptile",
              "Solitary",
              "Tail",
              "Wetlands",
            ]}
          />
        </div>
      </div>
    </dialog>
  );
}
