// src/App.js
import React from "react";
import AddHandleForm from "./features/handles/AddHandleForm";
import HandleList from "./features/handles/HandleList";

function App() {
  return (
    <div style={{ maxWidth: 700, margin: "24px auto", padding: 16 }}>
      <h1>My Social Handles</h1>
      <AddHandleForm />
      <HandleList />
    </div>
  );
}

export default App;
