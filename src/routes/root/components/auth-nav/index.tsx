import { Form, Link } from "react-router";

import { Button, Container } from "@/components/ui";
import { type User } from "@/models/user.model";

export default function AuthNav({ user }: { user?: Omit<User, "password"> }) {
  return (
    <div className="bg-black text-white text-sm font-medium">
      <Container className="h-10 flex justify-end items-center">
        <nav aria-label="Autenticación de usuario">
          <ul className="flex items-center gap-4">
            {user ? (
              <>
                <li>Bienvenido {user.name || user.email}</li>
                <li>
                  <Form method="post" action="/logout">
                    <Button variant="ghost" className="text-white">
                      Cerrar sesión
                    </Button>
                  </Form>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:underline hover:decoration-white hover:underline-offset-2"
                  >
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:underline hover:decoration-white hover:underline-offset-2"
                  >
                    Crear una cuenta
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
