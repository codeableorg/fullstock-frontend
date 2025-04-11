import { useState } from "react";
import { Navigate, useLoaderData } from "react-router";

import { Button, InputField } from "@/components/ui";
import { updateUser } from "@/services/user.service";
import { LoaderData } from "..";

export default function Profile() {
  const { user } = useLoaderData() as LoaderData;
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
      //setUser(updatedUser);
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
        className="self-stretch"
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
