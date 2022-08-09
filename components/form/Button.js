import React from "react";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
/*
Toggle Switch Component
Note: id, checked and onChange are required for ToggleSwitch component to function.
The props name, small, disabled and optionLabels are optional.
Usage: <ToggleSwitch id={id} checked={value} onChange={checked => setValue(checked)}} />
*/

const primaryColor = "pink-600";
const primaryOutlineColor = "pink-600";
const hoverBgColor = "hover:bg-pink-700";
const hoverOutlineColor =
  "hover:bg-pink-50 hover:border-pink-700 hover:text-pink-700";

const style = `font-semibold border border-${primaryColor} transition duration-150 ease-in-out rounded focus:outline-none px-6 py-3 text-sm w-full text-center relative disabled:bg-gray-500 disabled:border-transparent`;

const Button = ({ isLoading, children, ...props }) => {
  /* Capture the dimensions of the button before the loading happens
  so it doesn’t change size when showing the loader */
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [showLoader, setShowLoader] = useState(false);

  const ref = useRef(null);

  useEffect(
    () => {
      if (isLoading) {
        setShowLoader(true);
      }

      // Show loader a bits longer to avoid loading flash
      if (!isLoading && showLoader) {
        const timeout = setTimeout(() => {
          setShowLoader(false);
        }, 400);

        // Don’t forget to clear the timeout
        return () => {
          clearTimeout(timeout);
        };
      }

      if (ref.current && ref.current.getBoundingClientRect().width) {
        setWidth(ref.current.getBoundingClientRect().width);
      }
      if (ref.current && ref.current.getBoundingClientRect().height) {
        setHeight(ref.current.getBoundingClientRect().height);
      }
    },
    // children are a dep so dimensions are updated if initial contents change
    [children, isLoading, showLoader]
  );

  return (
    <button
      ref={ref}
      className={`${props.classes} bg-${primaryColor} ${hoverBgColor} text-primary-light  hover:text-primary-light ${style} `}
      style={
        width && height
          ? {
              width: `${width}px`,
              height: `${height}px`,
            }
          : {}
      }
      {...props}
    >
      {isLoading ? (
        <div className="loader loader-centered border-4 border-solid border-pink-700 border-t-4 border-t-pink-100"></div>
      ) : (
        props.label || children
      )}
    </button>
  );
};

const OutlineButton = ({ children, ...props }) => {
  return (
    <Button
      className={`${style} focus:outline-none  bg-transparent text-${primaryColor} ${hoverOutlineColor} border ${
        props.plain
          ? "border-transparent hover:border-transparent"
          : `border-${primaryColor} ${hoverOutlineColor}`
      } px-6 py-3 text-sm`}
      {...props}
    >
      {children}
    </Button>
  );
};

// Set optionLabels for rendering.
Button.defaultProps = {};
OutlineButton.defaultProps = Button.defaultProps;
Button.propTypes = {
  id: PropTypes.string,
  onClick: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};
OutlineButton.propTypes = Button.propTypes;

export { Button, OutlineButton };
