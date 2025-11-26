import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;   // redirect to login
  }
  return children;
};

function MainApp() {
  const { logout, user } = useAuth();

  return (
    <div className="app-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-gradient">
  <div className="container">
    <span className="navbar-brand">🌱 Plant Care Manager</span>

    <div className="d-flex align-items-center">
      {user && (
        <span className="navbar-email me-3">
          Hello, {user.fullName}
        </span>
      )}

      <button
        onClick={logout}
        className="btn btn-outline-light btn-sm logout-btn"
      >
        Logout
      </button>
    </div>
  </div>
</nav>


      <main className="container my-5">
        
        <Dashboard />
      </main>

      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* ROOT = LOGIN */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROTECTED DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            }
          />

          {/* ANY WRONG URL → LOGIN */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
