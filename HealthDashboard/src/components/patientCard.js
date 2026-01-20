import React, { useContext } from "react";
import { PatientContext } from "../context/patientContext";
import DeleteModal from "./DeleteModal";

const PatientCard = React.memo(({ patient }) => {
  const { dispatch } = useContext(PatientContext);

  const handleDelete = () => {
    dispatch({ type: "DELETE_PATIENT", payload: patient.id });
  };

  const cardStyle = {
    borderRadius: "8px",
    padding: "0.7rem",
    marginBottom: "0.5rem",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  // eslint-disable-next-line no-unused-vars
  const deleteButtonStyle = {
    padding: "0.3rem 0.6rem",
    border: "none",
    borderRadius: "5px",
    background: "#ff4d4d",
    color: "#fff",
    cursor: "pointer"
  };

  return (
    <>
      <div style={cardStyle}>
        <div>
          <strong>{patient.name}</strong> | Age: {patient.age} | Priority: {patient.priority} | Appointment: {patient.appointment}
        </div>
        <DeleteModal onConfirm={handleDelete} />
      </div>
    </>
  );
});

export default PatientCard;
