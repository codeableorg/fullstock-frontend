import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Button,
  Container,
  ContainerLoader,
  InputField,
  Section,
} from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";

import styles from "./styles.module.css";

const SignupSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
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
      await signup(data.email, data.password);
      navigate("/");
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
      <Container className={styles.signup}>
        <h1 className={styles.signup__title}>Crea una cuenta</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.signup__form}>
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
            className={styles.signup__submit}
            disabled={!isValid || loading}
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </Button>
          {error && <p className={styles.signup__error}>{error}</p>}
        </form>
        <div className={styles.signup__footer}>
          <span className={styles.signup__footer_text}>
            ¿Ya tienes una cuenta?
          </span>
          <Link to="/login" className={styles.signup__footer_link}>
            Inicia sesión
          </Link>
        </div>
      </Container>
    </Section>
  );
}
