import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${uid}`);
      setProfile(res.data);
      setSession(res.data?.session || null);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchProfile(parsedUser.uid).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async () => {
    try {
      // Mocking a Google Sign In for the REST API
      const mockEmail = "founder@ideaspark.com";
      const { data } = await axios.post("http://localhost:5000/api/auth/login", { 
        email: mockEmail, 
        displayName: "Student Founder",
        photoURL: ""
      });
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      await fetchProfile(data.user.uid);
      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Failed to login.");
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setProfile(null);
    setSession(null);
    toast.success("Logged out successfully!");
  };

  const startSession = async () => {
    if (!user) return;
    const now = new Date();
    if (session?.cooldownEnd && new Date(session.cooldownEnd) > now) {
      const remaining = Math.ceil(
        (new Date(session.cooldownEnd).getTime() - now.getTime()) / (1000 * 60)
      );
      toast.error(`Cooldown active. Please wait ${remaining} minutes.`);        
      return;
    }

    try {
      const newSession = {
        lastSessionStart: new Date(),
        isActive: true,
        cooldownEnd: null,
      };
      await axios.patch(`http://localhost:5000/api/users/${user.uid}/session`, {
        session: newSession
      });
      setSession(newSession);
      toast.success("Session started! You have 15 minutes.");
    } catch (e) {
      toast.error("Failed to start session.");
    }
  };

  const endSession = async () => {
    if (!user) return;
    const cooldownEnd = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours cooldown
    
    try {
      const newSession = {
        isActive: false,
        cooldownEnd: cooldownEnd,
      };
      await axios.patch(`http://localhost:5000/api/users/${user.uid}/session`, {
        session: newSession
      });
      setSession(newSession);
      toast.info("Session ended. Cooldown started.");
    } catch (e) {
       toast.error("Failed to end session.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        session,
        login,
        logout,
        startSession,
        endSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
