
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./reset.css";
import "./index.css";
import AppRoutes from "@/routes/AppRoutes";


createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      {/* <App /> */}
      <AppRoutes />
    </BrowserRouter>
);
