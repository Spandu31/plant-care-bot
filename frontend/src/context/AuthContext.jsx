import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage on mount
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["x-auth-token"] = token;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await axios.post("http://plant-care-bot.onrender.com/api/auth/login", {
        email,
        password,
      });
      
      const { token, user } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["x-auth-token"] = token;
      setUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
      return false;
    }
  };

  const signup = async (fullName, email, password) => {
     setError(null);
    try {
      const res = await axios.post("http://plant-care-bot.onrender.com/api/auth/signup", {
        fullName,
        email,
        password,
      });
      
      const { token, user } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["x-auth-token"] = token;
      setUser(user);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["x-auth-token"];
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

