import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigation, useSubmit } from "react-router";
import { z } from "zod";

import { Button, Container, InputField, Section } from "@/components/ui";
import { API_URL } from "@/config";
import { commitSession, getSession } from "@/session.server";

import type { Route } from "./+types";

function redirectIfAuthenticated() {
  const random = Math.random();
  const user = random > 0.5 ? null : { id: 1, name: "John Doe" };

  if (user) {
    console.log("Usurio autenticado", user);
    throw redirect("/");
  }
  return null;
}

const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function action({ request }: Route.ActionArgs) {
  console.log("login action");
  const session = await getSession();

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  console.log({ email, password });

  try {
    const response = await fetch(API_URL + "/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const { token } = await response.json();
    session.set("token", token);

    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido" };
  }
}

export async function loader() {
  // redirige si el usuario existe
  redirectIfAuthenticated();

  // quiero hacer mas cosas si el usuario no existe
  console.log("No hay usuario autenticado");
}

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const data = actionData;

  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(data: LoginForm) {
    submit(data, { method: "post" });
  }

  return (
    <Section>
      <Container className="max-w-sm">
        <h1 className="text-2xl leading-7 font-bold text-center mb-10">
          Inicia sesión en tu cuenta
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <InputField
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <InputField
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button
            size="lg"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
          </Button>
          {data?.error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {data.error}
            </p>
          )}
        </form>
        <div className="flex justify-center gap-2 mt-10 text-sm leading-6">
          <span className="text-muted-foreground">¿Aún no tienes cuenta?</span>
          <Link to="/signup" className="text-accent-foreground hover:underline">
            Crea una cuenta
          </Link>
        </div>
      </Container>
    </Section>
  );
}
