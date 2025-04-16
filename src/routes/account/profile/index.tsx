import {
  redirect,
  useLoaderData,
  useFetcher,
  ActionFunctionArgs,
} from "react-router";

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

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();

  try {
    await updateUser({
      name: data.get("name") as string,
      ...(data.get("newPassword")
        ? { password: data.get("newPassword") as string }
        : {}),
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}

export default function Profile() {
  const { user } = useLoaderData() as LoaderData;
  let fetcher = useFetcher();
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
