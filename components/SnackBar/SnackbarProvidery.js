import { createContext, useState, useContext } from "react";

const Context = createContext();
const SnackbarContext = createContext(null);
function DefaultSnackbar({
  message,
  action,
  ButtonProps,
  SnackbarProps,
  customParameters,
}) {
  return (
    <>Shoot</>
    // <Snackbar
    //   {...SnackbarProps}
    //   message={message || ""}
    //   action={
    //     action != null && (
    //       <Button color="secondary" size="small" {...ButtonProps}>
    //         {action}
    //       </Button>
    //     )
    //   }
    // />
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
  const showMessage = (
    message,
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
    });
  };

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

  const { action, message, open, customParameters } = state;
  const {
    ButtonProps = {},
    children,
    SnackbarProps = {},
    SnackbarComponent = DefaultSnackbar,
  } = props;

  return (
    <SnackbarContext.Provider value={{ hello: "hi" }}>
      {children}
    </SnackbarContext.Provider>
  );
};

// export const useAppStates = () => useContext(Context);

export default SnackbarProvider;
