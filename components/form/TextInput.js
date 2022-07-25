import { useField } from "@unform/core";
import { useEffect, useRef } from "react";

export default function TextInput({ name, label, ...props }) {
  const inputRef = useRef();

  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref) => {
        return ref.value;
      },
    });
  }, [fieldName, registerField]);

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
