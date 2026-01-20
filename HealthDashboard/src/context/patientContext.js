import { createContext, useReducer } from "react";
import { patientReducer, initialState } from "../reducer/patientReducer";

export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [state, dispatch] = useReducer(patientReducer, initialState);

  return (
    <PatientContext.Provider value={{ state, dispatch }}>
      {children}
    </PatientContext.Provider>
  );
};
