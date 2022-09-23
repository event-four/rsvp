import { Dialog, Transition } from "@headlessui/react";
import { createRef, useState, useRef, Fragment, useEffect, memo } from "react";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";

const ZPortal = ({ open, title = "", onClose, positiveOnClick, ...props }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10x">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-hidden bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6 flex flex-row justify-between items-center">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {title}
                      </Dialog.Title>

                      <IconButton onClick={onClose}>
                        <ClearIcon className="h-6 w-6" aria-hidden="true" />
                      </IconButton>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6 overflow-y-scroll pb-6">
                      {props.children}
                    </div>

                    <div className="flex flex-row justify-between w-full px-4 sm:px-6 border border-t border-b-0 pt-6 space-x-4">
                      {onClose && (
                        <Button
                          sx={{ width: "100%", height: "40px" }}
                          variant="outlined"
                          onClick={onClose}
                        >
                          Cancel
                        </Button>
                      )}

                      {props.positiveOnClick ||
                        (props.positiveLabel && (
                          <Button
                            sx={{ width: "100%", height: "40px" }}
                            onClick={positiveOnClick}
                          >
                            {props.positiveLabel ?? "Save"}
                          </Button>
                        ))}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ZPortal;
