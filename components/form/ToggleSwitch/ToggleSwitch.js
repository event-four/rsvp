import React from "react";
import PropTypes from "prop-types";
import styles from "./ToggleSwitch.module.scss";

/*
Toggle Switch Component
Note: id, checked and onChange are required for ToggleSwitch component to function.
The props name, small, disabled and optionLabels are optional.
Usage: <ToggleSwitch id={id} checked={value} onChange={checked => setValue(checked)}} />
*/

const ToggleSwitch = ({
  id,
  name,
  checked,
  onChange,
  optionLabels,
  small,
  disabled,
}) => {
  function handleKeyPress(e) {
    if (e.keyCode !== 32) return;

    e.preventDefault();
    onChange(!checked, e);
  }

  return (
    <div
      className={
        `${styles["toggle-switch"]}` +
        (small ? `${styles["small-switch"]}` : "")
      }
    >
      <input
        type="checkbox"
        name={name}
        className={styles["toggle-switch-checkbox"]}
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked, e.target)}
        disabled={disabled}
      />
      {id ? (
        <label
          className={styles["toggle-switch-label"]}
          htmlFor={id}
          tabIndex={disabled ? -1 : 1}
          onKeyDown={(e) => {
            handleKeyPress(e);
          }}
        >
          <span
            className={
              disabled
                ? `${styles["toggle-switch-inner"]} ${styles[" toggle-switch-disabled"]}`
                : `${styles["toggle-switch-inner"]}`
            }
            data-yes={optionLabels[0]}
            data-no={optionLabels[1]}
            tabIndex={-1}
          />
          <span
            className={
              disabled
                ? `${styles["toggle-switch-switch"]} ${styles[" toggle-switch-disabled"]}`
                : `${styles["toggle-switch-switch"]}`
            }
            tabIndex={-1}
          />
        </label>
      ) : null}
    </div>
  );
};

// Set optionLabels for rendering.
ToggleSwitch.defaultProps = {
  optionLabels: ["Yes", "No"],
};

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string,
  optionLabels: PropTypes.array,
  small: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ToggleSwitch;
