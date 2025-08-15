import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Debug React imports
console.log("Main: React modules loaded");

createRoot(document.getElementById("root")!).render(<App />);
