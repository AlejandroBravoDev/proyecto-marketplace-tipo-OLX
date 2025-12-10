import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./App.jsx";
import "./utils/axiosConfig.jsx";
createRoot(document.getElementById("root")).render(<App />);
