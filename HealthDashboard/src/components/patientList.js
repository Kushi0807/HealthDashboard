import React, { useContext, useMemo } from "react";
import { PatientContext } from "../context/patientContext";
import PatientCard from "./PatientCard";

const PatientList = () => {
  const { state } = useContext(PatientContext);
  const { patients, filter, searchQuery } = state;

  const filteredPatients = useMemo(() => {
    return patients
      .filter(p => filter === "All" || p.priority === filter)
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [patients, filter, searchQuery]);

  return (
    <>
      {filteredPatients.map(p => (
        <PatientCard key={p.id} patient={p} />
      ))}
    </>
  );
};

export default PatientList;
