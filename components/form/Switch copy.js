import { useField } from "@unform/core";
import { useEffect, useRef } from "react";

export default function Switch({
  name,
  label,
  labelOn = "Yes",
  labelOff = "No",
  checked = null,
  onChange,
  ...rest
}) {
  const inputRef = useRef();

  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = "";
      },
    });
  }, [fieldName, registerField]);

  return (
    <>
      <div class="flex flex-row w-fit min-w-fit rounded-lg border border-primary-dark bg-primary-light overflow-clip">
        <div className="bool-switch">
          <input
            type="radio"
            id={`${fieldName}-on`}
            ref={inputRef}
            name={name}
            checked={checked}
            {...rest}
            className="hiddenx peer"
            value="false"
            onChange={onChange}
          />
          <label
            htmlFor={`${fieldName}-on`}
            class=""
            // onClick={onChange}
            name={name}
          >
            {labelOn}
          </label>
        </div>

        <div className="bool-switch">
          <input
            type="radio"
            id={`${fieldName}-off`}
            name={name}
            ref={inputRef}
            checked={!checked}
            {...rest}
            className="hiddenx peer"
            value="true"
            onChange={onChange}
          />

          <label
            htmlFor={`${fieldName}-off`}
            class=""
            // onClick={onChange}
            name={name}
          >
            {labelOff}
          </label>
        </div>
      </div>
      {error && (
        <p className="text-red-600 text-xs text-center mt-2">{error}</p>
      )}
    </>
  );
}
