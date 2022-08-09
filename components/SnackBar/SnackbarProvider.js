import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";
const SnackbarContext = createContext(null);
import { Snackbar, Button, Alert, AlertTitle } from "@mui/material";

function DefaultSnackbar({
  message,
  title,
  action,
  severity,
  ButtonProps,
  SnackbarProps,
  customParameters,
}) {
  return (
    <Snackbar
      // {...SnackbarProps}
      anchorOrigin={SnackbarProps.anchorOrigin}
      open={SnackbarProps.open}
      autoHideDuration={SnackbarProps.autoHideDuration}
      onClose={SnackbarProps.onClose}
      message={message || ""}
      // action={
      //   action != null && (
      //     <Button color="secondary" size="small" {...ButtonProps}>
      //       {action}
      //     </Button>
      //   )
      // }
    >
      <Alert
        onClose={SnackbarProps.handleClose}
        severity={severity}
        sx={{ width: "100%" }}
        action={
          action != null && (
            <Button color="secondary" size="small" {...ButtonProps}>
              {action}
            </Button>
          )
        }
      >
        {title && (
          <AlertTitle>
            <span className="font-bold">{title}</span>
          </AlertTitle>
        )}

        {message || ""}
      </Alert>
    </Snackbar>
  );
}

const SnackbarProvider = ({ ...props }) => {
  const [state, setState] = useState({
    message: null,
    open: false,
  });

  /**
   * Display a message with this snackbar.
   * @param {string} message message to display
   * @param {string} [action] label for the action button
   * @param {function} [handleAction] click handler for the action button
   * @param {any} [customParameters] custom parameters that will be passed to the snackbar renderer
   * @param {function} [handleHideWithoutAction] handler function that is called when the snackbar hides and the action button was not clicked
   * @public
   */
  const show = (
    message,
    title,
    action,
    handleAction,
    customParameters,
    handleHideWithoutAction
  ) => {
    setState({
      open: true,
      message,
      action,
      handleAction,
      customParameters,
      handleHideWithoutAction,
      title: title,
    });
  };

  /**
   *
   * @param {String} message - Message to display
   * @param {String} title - Title to display
   * @param {String} action - Label of action button
   * @param {Function} handleAction - Callback for the action button
   */
  function info(message, title, action, handleAction) {
    setState({
      open: true,
      message,
      action,
      handleAction,
      title,
      severity: "info",
    });
  }

  /**
   *
   * @param {String} message - Message to display
   * @param {String} title - Title to display
   * @param {String} action - Label of action button
   * @param {Function} handleAction - Callback for the action button
   */
  function error(message, title, action, handleAction) {
    setState({
      open: true,
      message,
      action,
      handleAction,
      title,
      severity: "error",
    });
  }

  const handleActionClick = () => {
    setState({
      open: false,
      handleAction: null,
      handleHideWithoutAction: null,
    });
    state.handleAction();
  };

  const handleHideWithoutAction = () => {
    const handleHideWithoutAction = state.handleHideWithoutAction;
    setState({
      open: false,
      handleAction: null,
      handleHideWithoutAction: null,
    });
    if (handleHideWithoutAction) {
      handleHideWithoutAction();
    }
  };

  const { action, message, open, customParameters, title, severity } = state;

  const {
    ButtonProps = {},
    children,
    SnackbarProps = {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "center",
      },
    },
    SnackbarComponent = DefaultSnackbar,
  } = props;

  let contextValue = {
    show: show,
    info: info,
    error: error,
  };

  return (
    <>
      <SnackbarContext.Provider value={contextValue}>
        {children}
      </SnackbarContext.Provider>
      <SnackbarComponent
        message={message}
        title={title}
        action={action}
        severity={severity}
        ButtonProps={{ ...ButtonProps, onClick: handleActionClick }}
        SnackbarProps={{
          ...SnackbarProps,
          open,
          onClose: handleHideWithoutAction,
          autoHideDuration:
            customParameters && "autoHideDuration" in customParameters
              ? customParameters.autoHideDuration
              : SnackbarProps.autoHideDuration,
        }}
        customParameters={customParameters}
      />
    </>
  );
};

export default SnackbarProvider;

export function useSnackbar() {
  return useContext(SnackbarContext);
}
SnackbarProvider.propTypes = {
  /**
   * Props to pass through to the action button.
   */
  ButtonProps: PropTypes.object,
  /**
   * The children that are wrapped by this provider.
   */
  children: PropTypes.node,
  /**
   * Custom snackbar component.
   * Props: open, message, action, ButtonProps, SnackbarProps
   */
  SnackbarComponent: PropTypes.elementType,
  /**
   * Props to pass through to the snackbar.
   */
  SnackbarProps: PropTypes.object,
};
