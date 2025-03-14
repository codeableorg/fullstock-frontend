import { useState } from "react";
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
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof LoginForm, string[]>>
  >({});
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      const parsedData = LoginSchema.safeParse(data);

      if (!parsedData.success) {
        setFormErrors(parsedData.error.flatten().fieldErrors);
        return;
      }

      const email = data.email as string;
      const password = data.password as string;

      await login(email, password);
      // navigate("/");
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
        <form onSubmit={handleSubmit} className={styles.login__form}>
          <InputField
            label="Correo electrónico"
            name="email"
            type="email"
            required
            autoComplete="email"
            errors={formErrors.email}
          />
          <InputField
            label="Contraseña"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            errors={formErrors.password}
          />
          <Button size="lg" className={styles.login__submit} disabled={loading}>
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
