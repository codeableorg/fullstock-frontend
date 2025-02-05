import { Link, useNavigate } from "react-router";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth.context";

export default function AuthNav() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function onLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="bg-black text-white text-sm font-medium">
      <Container className=" h-10 flex justify-end items-center">
        <nav aria-label="Autenticación de usuario">
          <ul className="flex items-center gap-4">
            {user ? (
              <>
                <li>Bienvenido {user.name || user.email}</li>
                <li>
                  <Button
                    variant="ghost"
                    className="text-white"
                    onClick={onLogout}
                  >
                    Cerrar sesión
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:underline decoration-white underline-offset-2"
                  >
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className="hover:underline decoration-white underline-offset-2"
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
