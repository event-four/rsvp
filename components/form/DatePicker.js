import { useField } from "@unform/core";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";
import { CalendarIcon, XIcon } from "@heroicons/react/solid";
export default function DatePickerInput({
  name,
  label,
  isInset = true,
  onChanged,
  ...props
}) {
  const inputRef = useRef();

  const { fieldName, defaultValue, registerField, error } = useField(name);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref) => {
        return ref.value;
      },
    });
  }, [fieldName, registerField]);

  const onDateChanged = (date) => {
    console.log(date);
    setStartDate(date);
    onChanged(date);
  };
  return (
    <div
      className={`relative rounded focus-within:z-10 focus-within:ring-0x border-gray-300`}
    >
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
      <div>
        {/* <input
          id={fieldName}
          ref={inputRef}
          defaultValue={defaultValue}
          {...props}
          className={`block rounded border border-gray-300 px-3 pb-2 pt-6 w-full text-sm text-gray-900 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600x peer ${props.classes} `}
        /> */}
        {/* <DatePicker
          // id={fieldName}
          // ref={inputRef}
          selected={startDate}
          onChange={(date) => onDateChanged(date)}
          // defaultValue={startDate}
          //onChange={props.onChanged}
          //value={value}
          clearIcon={
            <XIcon
              className="h-5 w-5 absolute right-4 text-gray-400 hover:text-default"
              aria-hidden="true"
            />
          }
          calendarIcon={
            <CalendarIcon
              className="h-5 w-5 absolute right-0 text-gray-400 hover:text-default"
              aria-hidden="true"
            />
          }
          className={`block text-sm rounded border border-gray-300 px-3 pb-2 pt-6 w-full  text-gray-900 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600x peer ${props.classes} `}
          // {...props}
        /> */}

        <label
          htmlFor={fieldName}
          className="absolute text-sm text-gray-500  duration-300 transform -translate-y-2 scale-75 top-[0.85rem] z-10 origin-[0] left-3 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-2"
        >
          {label}
        </label>
      </div>
      {error && (
        <p className="text-red-600 text-2xs text-centerx mt-2">{error}</p>
      )}
    </div>
  );
}
