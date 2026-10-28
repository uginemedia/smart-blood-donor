import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [loadingUser, setLoadingUser] = useState(true);

  // Keep React state and localStorage synchronized.
  const updateUser = useCallback((updatedData) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const newUser = {
        ...currentUser,
        ...updatedData,
      };

      localStorage.setItem("user", JSON.stringify(newUser));

      return newUser;
    });
  }, []);

  // Fetch the latest user data from MongoDB through the backend.
  const refreshUser = useCallback(async () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!storedUser?._id) {
      setUser(null);
      setLoadingUser(false);
      return null;
    }

    try {
      setLoadingUser(true);

      // Change this URL if your backend uses a different profile route.
      const response = await api.get(`/auth/profile/${storedUser._id}`);

      if (response.data.success && response.data.user) {
        const latestUser = response.data.user;

        setUser(latestUser);
        localStorage.setItem("user", JSON.stringify(latestUser));

        return latestUser;
      }

      return null;
    } catch (error) {
      console.error(
        "Failed to refresh user data:",
        error.response?.data?.message || error.message,
      );

      return null;
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Refresh user information when the application first loads.
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        refreshUser,
        loadingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
