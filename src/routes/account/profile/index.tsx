import { useState } from "react";
import { Navigate } from "react-router";

import { Button, InputField } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { updateUser } from "@/services/user.service";

import styles from "./styles.module.css";

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
    <form className={styles.profile} onSubmit={handleSubmit}>
      <InputField
        label="Correo electrónico"
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
        className={styles.profile__submit}
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
