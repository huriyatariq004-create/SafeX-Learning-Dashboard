import React from "react";
import { AuthProvider } from "./AuthContext";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
}