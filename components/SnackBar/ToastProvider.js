/* Author: Dalibor Kundrat  https://github.com/damikun */

import React, { useCallback, useContext, useState, createContext } from "react";
import ToastContainer from "./ToastContainer";
// import { Truncate } from "./ToastMessage";

/////////////////////////////////////
/// Types
/////////////////////////////////////

// export type ToastProviderProps = {
//   children: React.ReactNode;
// } & ToastContainerProps;

// type TostMessageType = "Info" | "Success" | "Warning" | "Error";

// export type Toast = {
//   id: string;
//   lifetime: number;
//   message: string | React.ReactNode;
//   type?: TostMessageType;
//   truncate?: Truncate;
//   icon?: any;
//   header?: string;
// };

// export type ToastContextType = {
//   data: Array<Toast>;
//   pushError(message: string, lifetime?: number, truncate?: Truncate): void;
//   pushWarning(message: string, lifetime?: number, truncate?: Truncate): void;
//   pushSuccess(message: string, lifetime?: number, truncate?: Truncate): void;
//   pushInfo(message: string, lifetime?: number, truncate?: Truncate): void;
//   push(
//     message: string,
//     type: TostMessageType,
//     lifetime?: number,
//     truncate?: Truncate
//   ): void;
//   pushCustom(
//     message: string | React.ReactNode,
//     lifetime: number,
//     truncate?: Truncate,
//     // icon?: IconProp | React.ReactNode
//   ): void;
//   remove(id: string): void;
// };

/////////////////////////////////////
/// Global and Helpers
/////////////////////////////////////

export const ToastContext = createContext();
// (React.createContext < ToastContextType) | (undefined > undefined);

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const useToast = () => useContext(ToastContext);

const DEFAULT_INTERVAL = 2500;

/////////////////////////////////////
/// Implementation
/////////////////////////////////////

export default function ToastProvider({ children, variant }) {
  const [data, setData] = useState([]);

  const Push = useCallback(
    (message, type, lifetime, truncate) => {
      if (message) {
        const new_item = {
          id: uuidv4(),
          message: message,
          type: type,
          lifetime: lifetime ? lifetime : DEFAULT_INTERVAL,
          truncate: truncate,
        };
        setData((prevState) => [...prevState, new_item]);
      }
    },
    [setData, data]
  );

  const PushCustom = useCallback(
    (message, lifetime, truncate, icon) => {
      if (message) {
        const new_item = {
          id: uuidv4(),
          message: message,
          lifetime: lifetime ? lifetime : DEFAULT_INTERVAL,
          truncate: truncate,
          icon: icon,
          type: undefined,
        };

        setData((prevState) => [...prevState, new_item]);
      }
    },
    [setData, data]
  );

  const PushError = useCallback(
    (message, lifetime, truncate) => Push(message, "Error", lifetime, truncate),
    [Push]
  );
  const PushWarning = useCallback(
    (message, lifetime, truncate) =>
      Push(message, "Warning", lifetime, truncate),
    [Push]
  );
  const PushSuccess = useCallback(
    (message, lifetime, truncate) =>
      Push(message, "Success", lifetime, truncate),
    [Push]
  );
  const PushInfo = useCallback(
    (message, lifetime, truncate) => Push(message, "Info", lifetime, truncate),
    [Push]
  );

  const ToastContexted = useCallback(() => {
    return {
      data: data,
      pushError: PushError,
      pushWarning: PushWarning,
      pushSuccess: PushSuccess,
      pushInfo: PushInfo,
      push: Push,
      pushCustom: PushCustom,

      async remove(id) {
        setData((prevState) => prevState.filter((e) => e.id != id));
      },
    };
  }, [
    data,
    setData,
    PushError,
    PushWarning,
    PushSuccess,
    PushInfo,
    Push,
    PushCustom,
  ]);

  return (
    <ToastContext.Provider value={ToastContexted()}>
      <ToastContainer variant={variant} />
      {children}
    </ToastContext.Provider>
  );
}
