import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { signup, error } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (value) => {
    if (value.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(value)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*]/.test(value))
      return "Password must contain at least one special character (!@#$%^&*).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    setPasswordError("");
    const success = await signup(fullName, email, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Sign Up</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {passwordError && (
                <div className="alert alert-warning">{passwordError}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className={`form-control ${passwordError ? "is-invalid" : ""}`}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError(validatePassword(e.target.value));
                    }}
                    required
                  />
                  {passwordError && (
                    <div className="invalid-feedback">{passwordError}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-success w-100">
                  Sign Up
                </button>
              </form>

              <div className="mt-3 text-center">
                <p>
                  Already have an account?{" "}
                  <Link to="/">Login</Link> {/* 👈 fixed path */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
