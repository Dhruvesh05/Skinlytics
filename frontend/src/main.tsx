
  import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App.tsx";
import { AuthProvider } from "./app/context/AuthContext.tsx";
import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  