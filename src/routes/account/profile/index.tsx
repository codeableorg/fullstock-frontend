import { useFetcher } from "react-router";

import { Button, InputField } from "@/components/ui";
import { updateUser } from "@/services/user.service";

import { requireUser } from "@/services/auth.server";
import type { Route } from "./+types";

export async function loader( { request }: Route.LoaderArgs) {
  const user = await requireUser(request);

  return { user };
}

export async function action({ request }: Route.ActionArgs) {
  const data = await request.formData();

  try {
    await updateUser({
      name: data.get("name") as string,
      ...(data.get("newPassword")
        ? { password: data.get("newPassword") as string }
        : {}),
    }, request);

    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetcher.submit(event.target as HTMLFormElement, { method: "post" });

    (
      (event.target as HTMLFormElement).elements.namedItem(
        "newPassword"
      ) as HTMLInputElement
    ).value = "";
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
        defaultValue={user?.name || ""}
        minLength={1}
        disabled={isSubmitting}
      />
      <InputField
        label="Nueva contraseña"
        name="newPassword"
        type="password"
        minLength={6}
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        size="xl"
        className="self-stretch"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
