import React, { useState } from "react";
import ReactDOM from "react-dom";

const DeleteModal = ({ onConfirm }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)} style={{ padding: "0.3rem 0.6rem", borderRadius: "5px", border: "none", background: "#ff4d4d", color: "#fff", cursor: "pointer" }}>Delete</button>;
  }

  return ReactDOM.createPortal(
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{ background: "#fff", padding: "1rem", borderRadius: "8px", textAlign: "center" }}>
        <p>Are you sure you want to delete this patient?</p>
        <button onClick={() => { onConfirm(); setIsOpen(false); }} style={{ marginRight: "0.5rem", padding: "0.5rem 1rem", borderRadius: "5px", border: "none", background: "#ff4d4d", color: "#fff" }}>Yes</button>
        <button onClick={() => setIsOpen(false)} style={{ padding: "0.5rem 1rem", borderRadius: "5px", border: "none", background: "#ccc" }}>No</button>
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;
