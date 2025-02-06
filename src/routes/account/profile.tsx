import { useState } from "react";
import { Navigate } from "react-router";

import { Button, InputField } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { updateUser } from "@/services/user.service";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await updateUser({
        id: user!.id,
        name,
        ...(newPassword ? { password: newPassword } : {}),
      });
      setUser(updatedUser);
      setNewPassword("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <form className="max-w-md flex flex-col gap-6" onSubmit={handleSubmit}>
      <InputField
        label="Email"
        name="email"
        type="email"
        value={user.email}
        disabled
      />
      <InputField
        label="Nombre"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        minLength={1}
        disabled={isLoading}
      />
      <InputField
        label="Nueva contraseña"
        name="newPassword"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        minLength={6}
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="xl"
        className="sm:self-start"
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
