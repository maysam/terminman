import React, { useState } from "react";
import Termin from "./Termin";
import TerminTable from "./TerminTable";

function App() {
  
  const [editMode, setEditMode] = useState(false);
  if (editMode) return <TerminTable setEditMode={setEditMode} />;
  return <Termin setEditMode={setEditMode} />;
  
}

export default App;
