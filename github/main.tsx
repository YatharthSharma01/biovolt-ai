import React from "react";
import { createRoot } from "react-dom/client";
import { BioVoltExperience } from "../app/BioVoltExperience";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BioVoltExperience />
  </React.StrictMode>,
);
