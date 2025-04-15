import { useState } from "react";
import { redirect, useLoaderData } from "react-router";

import { Button, InputField } from "@/components/ui";
import { updateUser } from "@/services/user.service";
import { User } from "@/models/user.model";
import { removeToken } from "@/lib/utils";
import { getCurrentUser } from "@/services/auth.service";

type LoaderData = { user?: Omit<User, "password"> };

export async function loader(): Promise<LoaderData> {
  try {
    const user = await getCurrentUser();
    if (!user) throw redirect("/login");
    return { user };
  } catch {
    removeToken();
    return {};
  }
}

export default function Profile() {
  const { user } = useLoaderData() as LoaderData;
  const [name, setName] = useState(user?.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUser({
        name,
        ...(newPassword ? { password: newPassword } : {}),
      });
      setNewPassword("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="max-w-md flex flex-col gap-6" onSubmit={handleSubmit}>
      <InputField
        label="Correo electrónico"
        name="email"
        type="email"
        value={user!.email}
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
