import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigation, useSubmit } from "react-router";
import { z } from "zod";

import { Button, Container, InputField, Section } from "@/components/ui";
import { login, redirectIfAuthenticated } from "@/services/auth.server";
import {
  getRemoteCart,
  linkCartToUser,
  mergeGuestCartWithUserCart,
} from "@/services/cart.service";
import { commitSession, getSession } from "@/session.server";

import type { Route } from "./+types";

const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const cartSessionId = session.get("cartSessionId");

  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const { token } = await login(request, email, password);
    session.set("token", token);

    // Crear una solicitud autenticada con el token
    const cookie = await commitSession(session);
    const authenticatedRequest = new Request(request.url, {
      headers: {
        Cookie: cookie,
      },
      method: "GET",
    });

    if (cartSessionId) {
      try {
        // Verificar si el usuario ya tiene un carrito usando getRemoteCart sin cartSessionId
        const existingUserCart = await getRemoteCart(authenticatedRequest);

        if (existingUserCart) {
          const mergedCart = await mergeGuestCartWithUserCart(
            authenticatedRequest,
            cartSessionId
          );

          if (mergedCart) {
            session.unset("cartSessionId");
          }
        } else {
          // Si el usuario no tiene carrito, vinculamos el carrito de invitado
          const linkedCart = await linkCartToUser(
            authenticatedRequest,
            cartSessionId
          );

          if (linkedCart) {
            session.unset("cartSessionId");
          }
        }
      } catch (cartError) {
        console.error("Error al gestionar el carrito:", cartError);
      }
    }

    return redirect("/", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    console.error("Error en el proceso de login:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido" };
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  await redirectIfAuthenticated(request);
  return null;
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
      email: "mike@gmail.com",
      password: "Mike123",
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

