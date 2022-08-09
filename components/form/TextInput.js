import { useField } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import Loader, { LOADER_STATE } from "./Loader";

export default function TextInput({
  state = LOADER_STATE.DEFAULT,
  name,
  label,
  isInset = false,
  ...props
}) {
  const inputRef = useRef();

  const { fieldName, defaultValue, registerField, error } = useField(name);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (state === LOADER_STATE.LOADING) {
      setShowLoader(true);
    }
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref) => {
        return ref.value;
      },
    });
  }, [fieldName, registerField, state]);

  if (isInset) {
    return (
      <>
        <input
          id={fieldName}
          ref={inputRef}
          defaultValue={defaultValue}
          {...props}
        />
        <label htmlFor={fieldName}>{label}</label>
        {error && (
          <p className="text-red-600 text-xs text-center mt-2">{error}</p>
        )}
      </>
    );
  }
  return (
    <div
      className={`relative rounded focus-within:z-10 focus-within:ring-0x border-gray-300`}
    >
      <div>
        <input
          id={fieldName}
          ref={inputRef}
          defaultValue={defaultValue}
          {...props}
          className={`block rounded border border-gray-300 px-3 pb-2 pt-6 w-full text-sm text-gray-900 appearance-none focus:outline-none focus:ring-0 focus:border-default peer bg-transparent ${props.classes} `}
        />
        <label
          htmlFor={fieldName}
          className="absolute text-sm text-gray-500  duration-300 transform -translate-y-2 scale-75 top-[0.85rem] z-8 origin-[0] left-3 peer-focus:text-default  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-2"
        >
          {label}
        </label>
        <Loader state={state} />
      </div>

      {error && <p className="text-red-600 text-2xs mt-2">{error}</p>}
    </div>
  );
}
