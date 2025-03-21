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
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof SignupForm, string[]>>
  >({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      const parsedData = SignupSchema.safeParse(data);

      if (!parsedData.success) {
        setFormErrors(parsedData.error.flatten().fieldErrors);
        return;
      }
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
      <Container className={styles.signup}>
        <h1 className={styles.signup__title}>Crea una cuenta</h1>
        <form onSubmit={handleSubmit} className={styles.signup__form}>
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
          <Button
            size="lg"
            className={styles.signup__submit}
            disabled={loading}
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
