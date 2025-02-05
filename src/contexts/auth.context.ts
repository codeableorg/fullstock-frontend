import React, { createContext, useContext } from "react";

import { User } from "@/models/user.model";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  setUser: React.Dispatch<React.SetStateAction<Omit<User, "password"> | null>>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
