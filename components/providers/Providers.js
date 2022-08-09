import React, { useContext, useState, createContext } from "react";
import SnackbarProvider from "@/components/SnackBar/SnackbarProvider";
import AppProvider from "./AppContext";

export const GlobalContext = createContext();
export const useGlobalState = () => useContext(GlobalContext);

const Providers = ({ children }) => {
  const [position, setPosition] = useState({
    variant: "bottom_middle",
  });

  return (
    <GlobalContext.Provider
      value={{
        position: position,
        setPosition: setPosition,
      }}
    >
      <AppProvider>
        <SnackbarProvider SnackbarProps={{ autoHideDuration: 4000 }}>
          {children}
        </SnackbarProvider>
      </AppProvider>
    </GlobalContext.Provider>
  );
};

export default Providers;
