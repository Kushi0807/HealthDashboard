import React, { useContext, useMemo } from "react";
import { PatientContext } from "../context/patientContext";

const Stats = () => {
  const { state } = useContext(PatientContext);
  const { patients } = state;

  const stats = useMemo(() => ({
    total: patients.length,
    highPriority: patients.filter(p => p.priority === "High").length
  }), [patients]);

  const style = { marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" };

  return (
    <div style={style}>
      <p>Total Patients: {stats.total}</p>
      <p>High Priority Patients: {stats.highPriority}</p>
    </div>
  );
};

export default Stats;
