import React, { useReducer, useState, useMemo, useCallback, createContext, useContext } from "react";
import ReactDOM from "react-dom";

// ======================== Context + Reducer ========================
const PatientContext = createContext();

const initialState = { patients: [], filter: "All", searchQuery: "" };

const patientReducer = (state, action) => {
  switch (action.type) {
    case "ADD_PATIENT":
      return { ...state, patients: [...state.patients, action.payload] };
    case "UPDATE_PATIENT":
      return {
        ...state,
        patients: state.patients.map(p => (p.id === action.payload.id ? action.payload : p))
      };
    case "DELETE_PATIENT":
      return { ...state, patients: state.patients.filter(p => p.id !== action.payload) };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

// ======================== Custom Hooks ========================
const useTheme = () => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = useCallback(() => setDarkMode(prev => !prev), []);
  return { darkMode, toggleTheme };
};

const useDebounce = (value, delay = 500) => {
  const [debounced, setDebounced] = useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

// ======================== Error Boundary ========================
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error(error, errorInfo); }
  render() { return this.state.hasError ? <h2 style={{color:"red"}}>Something went wrong.</h2> : this.props.children; }
}

// ======================== Components ========================

// ---- Header ----
const Header = ({ darkMode, toggleTheme }) => {
  const headerStyle = {
    padding: "1rem 2rem",
    background: darkMode ? "#162447" : "#336699",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  };
  const buttonStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    background: darkMode ? "#1f4068" : "#ffcc00",
    color: darkMode ? "#fff" : "#000",
    fontWeight: "bold"
  };
  return (
    <header style={headerStyle}>
      <h1>Healthcare Dashboard</h1>
      <button style={buttonStyle} onClick={toggleTheme}>{darkMode ? "Light Mode" : "Dark Mode"}</button>
    </header>
  );
};

// ---- Patient Form ----
const PatientForm = () => {
  const { dispatch } = useContext(PatientContext);
  const [form, setForm] = useState({ name: "", age: "", symptoms: "", appointment: "", priority: "Normal" });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    dispatch({ type: "ADD_PATIENT", payload: { ...form, id: Date.now() } });
    setForm({ name: "", age: "", symptoms: "", appointment: "", priority: "Normal" });
  };
  const formStyle = { margin:"1rem 0", display:"flex", flexDirection:"column", gap:"0.7rem", padding:"1rem", borderRadius:"8px", background:"#fff", boxShadow:"0 4px 12px rgba(0,0,0,0.05)" };
  const inputStyle = { padding:"0.5rem", borderRadius:"5px", border:"1px solid #ccc", fontSize:"1rem" };
  const buttonStyle = { padding:"0.6rem", borderRadius:"5px", border:"none", background:"#336699", color:"#fff", fontWeight:"bold", cursor:"pointer" };
  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <input style={inputStyle} name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <input style={inputStyle} name="age" type="number" value={form.age} onChange={handleChange} placeholder="Age" required />
      <input style={inputStyle} name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="Symptoms" required />
      <input style={inputStyle} name="appointment" type="datetime-local" value={form.appointment} onChange={handleChange} required />
      <select style={inputStyle} name="priority" value={form.priority} onChange={handleChange}>
        <option>Normal</option><option>High</option>
      </select>
      <button style={buttonStyle} type="submit">Add Patient</button>
    </form>
  );
};

// ---- Delete Modal via Portal ----
const DeleteModal = ({ onConfirm }) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!isOpen) return <button onClick={() => setIsOpen(true)} style={{ padding:"0.3rem 0.6rem", borderRadius:"5px", border:"none", background:"#ff4d4d", color:"#fff", cursor:"pointer" }}>Delete</button>;
  return ReactDOM.createPortal(
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:1000 }}>
      <div style={{ background:"#fff", padding:"1rem", borderRadius:"8px", textAlign:"center" }}>
        <p>Are you sure you want to delete this patient?</p>
        <button onClick={() => { onConfirm(); setIsOpen(false); }} style={{ marginRight:"0.5rem", padding:"0.5rem 1rem", borderRadius:"5px", border:"none", background:"#ff4d4d", color:"#fff" }}>Yes</button>
        <button onClick={() => setIsOpen(false)} style={{ padding:"0.5rem 1rem", borderRadius:"5px", border:"none", background:"#ccc" }}>No</button>
      </div>
    </div>,
    document.body
  );
};

// ---- Patient Card (React.memo) ----
const PatientCard = React.memo(({ patient }) => {
  const { dispatch } = useContext(PatientContext);
  const handleDelete = () => dispatch({ type: "DELETE_PATIENT", payload: patient.id });
  const cardStyle = { borderRadius:"8px", padding:"0.7rem", marginBottom:"0.5rem", background:"#fff", boxShadow:"0 2px 8px rgba(0,0,0,0.1)", display:"flex", justifyContent:"space-between", alignItems:"center" };
  return (
    <>
      <div style={cardStyle}>
        <div><strong>{patient.name}</strong> | Age: {patient.age} | Priority: {patient.priority} | Appointment: {patient.appointment}</div>
        <DeleteModal onConfirm={handleDelete} />
      </div>
    </>
  );
});

// ---- Patient List ----
const PatientList = () => {
  const { state } = useContext(PatientContext);
  const { patients, filter, searchQuery } = state;
  const filteredPatients = useMemo(() => {
    return patients
      .filter(p => filter === "All" || p.priority === filter)
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [patients, filter, searchQuery]);
  return <>{filteredPatients.map(p => <PatientCard key={p.id} patient={p} />)}</>;
};

// ---- Stats ----
const Stats = () => {
  const { state } = useContext(PatientContext);
  const stats = useMemo(() => ({
    total: state.patients.length,
    highPriority: state.patients.filter(p => p.priority === "High").length
  }), [state.patients]);
  const statsStyle = { display:"flex", gap:"1rem", marginTop:"1rem" };
  const cardStyle = { flex:1, padding:"1rem", borderRadius:"8px", background:"#fff", boxShadow:"0 4px 12px rgba(0,0,0,0.05)", textAlign:"center" };
  return (
    <div style={statsStyle}>
      <div style={cardStyle}><p>Total Patients</p><h2>{stats.total}</h2></div>
      <div style={cardStyle}><p>High Priority</p><h2>{stats.highPriority}</h2></div>
    </div>
  );
};

// ---- Search Filter ----
const SearchFilter = () => {
  const { dispatch } = useContext(PatientContext);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  React.useEffect(() => { dispatch({ type:"SET_SEARCH", payload: debouncedSearch }); }, [debouncedSearch, dispatch]);
  const filterStyle = { margin:"1rem 0", display:"flex", gap:"0.5rem" };
  const inputStyle = { padding:"0.5rem", borderRadius:"5px", border:"1px solid #ccc", flex:1 };
  const selectStyle = { padding:"0.5rem", borderRadius:"5px", border:"1px solid #ccc" };
  return (
    <div style={filterStyle}>
      <input style={inputStyle} placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
      <select style={selectStyle} onChange={e => dispatch({ type:"SET_FILTER", payload:e.target.value })}>
        <option>All</option><option>Normal</option><option>High</option>
      </select>
    </div>
  );
};

// ======================== Main App ========================
export default function App() {
  const { darkMode, toggleTheme } = useTheme();
  const appStyle = { fontFamily:"Arial, sans-serif", padding:"1rem", background: darkMode ? "#1a1a2e" : "#f0f4f8", color: darkMode ? "#f0f4f8" : "#1a1a2e", minHeight:"100vh" };
  const [state, dispatch] = useReducer(patientReducer, initialState);

  return (
    <PatientContext.Provider value={{ state, dispatch }}>
      <div style={appStyle}>
        <Header darkMode={darkMode} toggleTheme={toggleTheme} />
        <PatientForm />
        <SearchFilter />
        <ErrorBoundary>
          <PatientList />
        </ErrorBoundary>
        <Stats />
      </div>
    </PatientContext.Provider>
  );
}
