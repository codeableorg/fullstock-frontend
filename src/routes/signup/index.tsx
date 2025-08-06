import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, redirect, useNavigation, useSubmit } from "react-router";
import { z } from "zod";

import { Button, Container, InputField, Section } from "@/components/ui";
import { prisma } from "@/db/prisma";
import { hashPassword } from "@/lib/security";
import { debounceAsync } from "@/lib/utils";
import type { CreateUserDTO } from "@/models/user.model";
import { redirectIfAuthenticated } from "@/services/auth.service";
import { linkCartToUser } from "@/services/cart.service";
import { findEmail } from "@/services/user.client-service";
import { commitSession, getSession } from "@/session.server";

import type { Route } from "./+types";

const debouncedFindEmail = debounceAsync(findEmail, 300);

const SignupSchema = z.object({
  email: z
    .string()
    .email("Correo electrónico inválido")
    .refine(async (email) => {
      if (email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
        return await debouncedFindEmail(email);
      } else {
        return false;
      }
    }, "El correo no esta disponible"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignupForm = z.infer<typeof SignupSchema>;

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const session = await getSession(request.headers.get("Cookie"));
  const sessionCartId = session.get("sessionCartId");

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser && !existingUser.isGuest) {
      return { error: "El correo electrónico ya existe" };
    }

    const hashedPassword = await hashPassword(password);

    const newUser: CreateUserDTO = {
      email,
      password: hashedPassword,
      isGuest: false,
      name: null,
    };

    const user = await prisma.user.upsert({
      where: { email: email },
      update: newUser,
      create: newUser,
    });
    session.set("userId", user.id);

    if (sessionCartId) {
      try {
        const linkedCart = await linkCartToUser(user.id, sessionCartId);

        if (linkedCart) {
          session.unset("sessionCartId");
        }
      } catch (cartError) {
        console.error("Error al gestionar el carrito en signup:", cartError);
      }
    } else {
      console.error("No hay carrito de invitado para vincular en el registro");
    }

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
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

export default function Signup({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const data = actionData;

  const isSubmitting = navigation.state === "submitting";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  async function onSubmit(data: SignupForm) {
    submit(data, { method: "post" });
  }

  return (
    <Section>
      <Container className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-center mb-10">
          Crea una cuenta
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <InputField
            label="Correo electrónico"
            type="email"
            required
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <InputField
            label="Contraseña"
            type="password"
            required
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button
            size="lg"
            className="w-full"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Creando..." : "Crear cuenta"}
          </Button>
          {data?.error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {data.error}
            </p>
          )}
        </form>
        <div className="flex justify-center gap-2 mt-10 text-sm">
          <span className="text-muted-foreground">¿Ya tienes una cuenta?</span>
          <Link to="/login" className="text-accent-foreground hover:underline">
            Inicia sesión
          </Link>
        </div>
      </Container>
    </Section>
  );
}
