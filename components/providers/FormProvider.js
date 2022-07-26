import { useState, createContext, useContext, useEffect } from "react";
import { getFromStorage, setToStorage } from "/helpers";

export const FormContext = createContext();

export default function FormProvider({ children }) {
  const [data, setData] = useState({});

  useEffect(() => {
    async function fetchRsvp() {
      const json = await getFromStorage("rsvp");
      if (json) {
        setData(JSON.parse(json));
      }
    }
    fetchRsvp();
  }, []);

  const setFormValues = (values) => {
    setData((prevValues) => {
      const joined = {
        ...prevValues,
        ...values,
      };
      // console.log(joined);
      setToStorage("rsvp", JSON.stringify(joined));
      return joined;
    });
  };

  return (
    <FormContext.Provider value={{ data, setFormValues }}>
      {children}
    </FormContext.Provider>
  );
}

export const useFormData = () => useContext(FormContext);
