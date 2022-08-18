import { useState, createContext, useContext, useEffect } from "react";
import { getFromStorage, setToStorage } from "@/helpers/utils";

export const FormContext = createContext();

export default function FormProvider({ children }) {
  const [formValues, setData] = useState({});

  useEffect(() => {
    async function fetchWz() {
      const json = await getFromStorage("wz_");
      if (json) {
        setData(JSON.parse(json));
      }
    }
    fetchWz();
  }, []);

  const setFormValues = (values) => {
    setData((prevValues) => {
      const joined = {
        ...prevValues,
        ...values,
      };

      setToStorage("wz_", JSON.stringify(joined));
      return joined;
    });
  };

  return (
    <FormContext.Provider value={{ formValues, setFormValues }}>
      {children}
    </FormContext.Provider>
  );
}

export const useFormData = () => useContext(FormContext);
