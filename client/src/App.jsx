import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Members from "./pages/Members";
import Debts from "./pages/Debts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Toast from "./components/Toast";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import "./App.css";

function App() {
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type }), 2500);
  };

  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-light-gray">
        {/* Sidebar (hidden on mobile) */}
        <Sidebar />

        <main className="flex-1 p-4 md:p-8">
          <Routes>
            <Route path="/login" element={<Login showToast={showToast} />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard showToast={showToast} />
                </PrivateRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <PrivateRoute>
                  <Clients showToast={showToast} />
                </PrivateRoute>
              }
            />
            <Route
              path="/members"
              element={
                <PrivateRoute>
                  <Members showToast={showToast} />
                </PrivateRoute>
              }
            />
            <Route
              path="/debts"
              element={
                <PrivateRoute>
                  <Debts showToast={showToast} />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports showToast={showToast} />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings showToast={showToast} />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>

        {/* Bottom navigation (mobile only) */}
        <BottomNav />

        {/* Toast */}
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: toast.type })}
        />
      </div>
    </Router>
  );
}

export default App;
