import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Button, Container, InputField, Section } from "@/components/ui";
import { useAuth } from "@/contexts/auth.context";

import styles from "./styles.module.css";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      await signup(email, password);
      navigate("/");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al crear la cuenta"
      );
    } finally {
      setLoading(false);
    }
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
          />
          <InputField
            label="Contraseña"
            name="password"
            type="password"
            required
            autoComplete="current-password"
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
