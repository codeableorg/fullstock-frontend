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

const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setLoading(true);
    setError(null);
    try {
      await login(data.email, data.password);
      navigate("/");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al iniciar sesión"
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
      <Container className={styles.login}>
        <h1 className={styles.login__title}>Inicia sesión en tu cuenta</h1>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.login__form}>
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
          <Button size="lg" className={styles.login__submit} disabled={!isValid || loading}>
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </Button>
          {error && <p className={styles.login__error}>{error}</p>}
        </form>
        <div className={styles.login__footer}>
          <span className={styles.login__footer_text}>
            ¿Aún no tienes cuenta?
          </span>
          <Link to="/signup" className={styles.login__footer_link}>
            Crea una cuenta
          </Link>
        </div>
      </Container>
    </Section>
  );
}