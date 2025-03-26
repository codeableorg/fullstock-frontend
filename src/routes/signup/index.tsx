import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

import {
  Button,
  Container,
  ContainerLoader,
  InputField,
  Section,
} from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";
import { debounceAsync } from "@/lib/utils";
import { findEmail } from "@/services/user.service";

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

export default function Signup() {
  const navigate = useNavigate();
  const { signup, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);
    try {
      const email = data.email as string;
      const password = data.password as string;

      await signup(email, password);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al crear la cuenta"
      );
    } finally {
      setLoading(false);
    }
  }

  if (user) {
    navigate("/");
    return <ContainerLoader />;
  }

  return (
    <Section>
      <Container className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-center mb-10">Crea una cuenta</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
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
            disabled={!isValid || loading}
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </Button>
          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
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
