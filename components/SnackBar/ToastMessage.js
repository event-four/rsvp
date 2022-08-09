/* Author: Dalibor Kundrat  https://github.com/damikun */

import React, { useEffect } from "react";
// import { Toast } from "./ToastProvider";
import {
  CheckIcon,
  SelectorIcon,
  XIcon,
  ExclamationIcon,
  InformationCircleIcon,
} from "@heroicons/react/solid";

const VARIANTS = {
  Info: {
    base: "bg-white border-blue-500",
    iconstyle: "text-blue-500 ",
    icon: <InformationCircleIcon />,
    name: "Info",
  },

  Error: {
    base: "bg-red-700 border-red-500 ",
    iconstyle: "text-red-500 ",
    icon: <ExclamationIcon />,
    name: "Error",
  },

  Warning: {
    base: "bg-white border-yellow-500",
    iconstyle: "text-yellow-500 ",
    icon: <ExclamationIcon />,
    name: "Warning",
  },

  Success: {
    base: "bg-white border-green-500",
    iconstyle: "text-green-500 ",
    icon: <CheckIcon />,
    name: "Success",
  },
};

// export type Truncate =
//   | "truncate-1-lines"
//   | "truncate-2-lines"
//   | "truncate-3-lines";

// export type ToastMessage = {
//   id: string;
//   lifetime?: number;
//   variant?: keyof typeof VARIANTS | undefined;
//   onRemove?: (id: string) => void;
//   truncate?: Truncate;
// } & Toast;

export default function ToastMessage({
  id,
  header,
  message,
  lifetime,
  onRemove,
  truncate = "truncate-1-lines",
  icon,
  type,
}) {
  const variant = type
    ? VARIANTS[type]
    : {
        base: "bg-white border-gray-600 ",
        iconstyle: "",
        // icon: CheckIcon,
        name: header,
      };

  useEffect(() => {
    if (lifetime && onRemove) {
      setTimeout(() => {
        onRemove(id);
      }, lifetime);
    }
  }, [lifetime]);
  console.log(variant);
  return (
    <div
      className={`flex w-full visible flex-row shadow-lg 
        "border-l-4 rounded-md duration-100 cursor-pointer 
        "transform transition-all hover:scale-102 ${variant.base} ${
        type && "max-h-40"
      }`}
    >
      <div className="flex flex-row p-2 flex-no-wrap w-full">
        {variant.icon && (
          <div
            className={
              "flex items-center h-12 w-12 mx-auto text-xl select-none"
            }
          >
            <div className={`text-white mx-auto ${variant.iconstyle}`}>
              {variant.icon}
            </div>
          </div>
        )}

        <div className="flex flex-col flex-no-wrap px-1 w-full">
          <div className="flex my-auto font-bold select-none text-white">
            {variant.name}
          </div>
          <p
            className={`-mt-0.5 my-auto break-all flex 
              text-gray-100 text-sm ${typeof message === "string" && truncate}`}
          >
            {message}
          </p>
        </div>
        <div
          onClick={() => onRemove && onRemove(id)}
          className={
            "w-10 h-12 mr-2 items-center mx-auto text-center leading-none text-lg"
          }
        >
          <div
            className={
              "mx-auto my-auto h-full text-center text-white cursor-pointer hover:scale-105 transform "
            }
            // icon={XIcon}
          >
            <XIcon className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}
