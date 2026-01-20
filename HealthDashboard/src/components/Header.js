import React from "react";

const Header = ({ darkMode, toggleTheme }) => {
  const headerStyle = {
    padding: "1rem",
    background: darkMode ? "#222" : "#f4f4f4",
    color: darkMode ? "#fff" : "#000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  return (
    <header style={headerStyle}>
      <h1>Healthcare Dashboard</h1>
      <button onClick={toggleTheme}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
};

export default Header;
