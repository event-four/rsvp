import { useField } from "@unform/core";
import { useEffect, useRef, useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon, XIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SelectInput({
  name,
  options,
  label,
  selected,
  onChange,
  onClick,
  classes = "",
  index,
  ...props
}) {
  const inputRef = useRef();

  const [activeIndex, setActiveIndex] = useState();

  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: (ref) => {
        // console.log(ref);
        // return ref.value;
        return selected;
      },
    });
  }, [fieldName, registerField]);

  const onChanged = (value) => {
    onChange(value, activeIndex);
  };

  const onClicked = (i) => {
    setActiveIndex(i);
  };

  return (
    <div
      className={`relative rounded focus-within:z-10x focus-within:ring-0x border-gray-300 ${classes}`}
      onClick={() => onClicked(index)}
    >
      <Listbox
        id={fieldName}
        ref={inputRef}
        value={selected}
        onChange={onChanged}
        {...props}
      >
        {({ open }) => (
          <>
            <div className="relative">
              {selected && (
                <Listbox.Label
                  htmlFor={fieldName}
                  className="absolute text-sm font-medium text-gray-700  duration-300 transform -translate-y-2 scale-75 top-[0.85rem] z-10 origin-[0] left-3 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-2"
                >
                  {label}
                </Listbox.Label>
              )}
              <Listbox.Button
                className={`bg-white relative w-full border border-gray-300 rounded pl-3 pr-10 ${
                  selected ? "py-2" : "py-4"
                } ${
                  selected ? "pt-6" : ""
                } text-left cursor-default focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm peer ${
                  props.classes
                } `}
              >
                <span
                  className={`block truncate text-sm ${
                    !selected ? "text-gray-500" : ""
                  }`}
                >
                  {selected ? selected.name : label}
                </span>

                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              {selected && (
                <span
                  className="absolute inset-y-0 right-6 flex items-center pr-2 pointer-events-nonex z-[10]"
                  onClick={(e) => {
                    e.preventDefault();
                    if (props.disabled) return;
                    onChanged(null);
                  }}
                >
                  <XIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              )}
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-[200] mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {options.map((data, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        classNames(
                          active ? "text-white bg-indigo-600" : "text-gray-900",
                          "cursor-default select-none relative py-2 pl-3 pr-9"
                        )
                      }
                      value={data}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate text-sm"
                            )}
                          >
                            {data.name}
                          </span>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      {/* <div>
        <input
          id={fieldName}
          ref={inputRef}
          defaultValue={defaultValue}
          {...props}
          className={`block rounded border border-gray-300 px-3 pb-2 pt-6 w-full text-sm text-gray-900 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600x peer ${props.classes} `}
        />
        <label
          htmlFor={fieldName}
          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-2 scale-75 top-[0.85rem] z-10 origin-[0] left-3 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-1 peer-focus:scale-75 peer-focus:-translate-y-2"
        >
          {label}
        </label>
      </div> */}
      {error && (
        <p className="text-red-600 text-2xs text-centerx mt-2">{error}</p>
      )}
    </div>
  );
}
