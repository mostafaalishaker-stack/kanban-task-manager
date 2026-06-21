import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Login } from "./components/Login";
import { Board } from "./components/Board";
import "./index.css";

function App() {
  const { user } = useAuth();
  return user ? <Board /> : <Login />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
