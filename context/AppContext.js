import { createContext, useState, useContext } from "react";

const Context = createContext();

const Provider = ({ children }) => {
  const [rsvpUrls, setRsvpUrls] = useState({});
  const [rsvpEid, setRsvpEid] = useState("");

  const exposed = { rsvpUrls, setRsvpUrls, rsvpEid, setRsvpEid };
  return <Context.Provider value={exposed}>{children}</Context.Provider>;
};

export const useAppStates = () => useContext(Context);

export default Provider;
