import React, { useState, useContext } from "react";
import { PatientContext } from "../context/patientContext";

const PatientForm = () => {
  const { dispatch } = useContext(PatientContext);
  const [form, setForm] = useState({ name: "", age: "", symptoms: "", appointment: "", priority: "Normal" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    dispatch({ type: "ADD_PATIENT", payload: { ...form, id: Date.now() } });
    setForm({ name: "", age: "", symptoms: "", appointment: "", priority: "Normal" });
  };

  const formStyle = { margin: "1rem 0", display: "flex", flexDirection: "column", gap: "0.5rem" };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" required />
      <input name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="Symptoms" required />
      <input name="appointment" type="datetime-local" value={form.appointment} onChange={handleChange} required />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option>Normal</option>
        <option>High</option>
      </select>
      <button type="submit">Add Patient</button>
    </form>
  );
};

export default PatientForm;
