import { useField } from "@unform/core";
import { useEffect, useRef } from "react";
import Enum from "enum-next";

const LOADER_STATE = new Enum(["DEFAULT", "LOADING", "SUCCESS", "ERROR"], true);

export { LOADER_STATE };

export default function Loader({
  state = LOADER_STATE.DEFAULT,
  color = "default",
}) {
  useEffect(() => {}, [state]);

  const borderColor = `!border-default`;
  const borderTopColor = `!border-t-default`;
  const loaderStyle = `circle-loader border-t-1 left-auto right-3 bottom-0 top-3 ${borderColor}`;
  return (
    <>
      <div
        className={` ${loaderStyle} ${
          state === LOADER_STATE.LOADING
            ? ` !border-gray-300 ${borderTopColor} `
            : "load-complete "
        }  ${state === LOADER_STATE.DEFAULT ? "hidden" : "block"}`}
      >
        {state === LOADER_STATE.SUCCESS && (
          <div className={`checkmark !block draw ${borderColor}`}></div>
        )}
      </div>
    </>
  );
}
