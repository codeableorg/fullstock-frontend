import { useEffect, useState } from "react";

import { ContainerLoader } from "@/components/ui";
import { AuthContext } from "@/contexts/auth.context";
import { User } from "@/models/user.model";
import * as authService from "@/services/auth.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    setUser(response.user);
  };

  const signup = async (email: string, password: string) => {
    const response = await authService.signup(email, password);
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return <ContainerLoader className="min-h-screen" />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
