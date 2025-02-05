import { Navigate, Outlet, NavLink } from "react-router";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { useAuth } from "@/contexts/auth.context";

export default function Account() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Section>
      <Container className="max-w-3xl">
        <div className="max-w-3xl mb-10">
          <h1 className="text-4xl font-bold mb-4">Mi cuenta</h1>
          <p className="text-sm text-muted-foreground">
            Actualiza tu perfil y revisa tus historial pedidos.
          </p>
        </div>

        <div className="border-b mb-6">
          <nav className="flex gap-4">
            <NavLink
              to="/account/profile"
              className={({ isActive }) =>
                `pb-2 px-1 ${
                  isActive
                    ? "border-b-2 border-primary font-medium"
                    : "text-muted-foreground"
                }`
              }
            >
              Perfil
            </NavLink>
            <NavLink
              to="/account/orders"
              className={({ isActive }) =>
                `pb-2 px-1 ${
                  isActive
                    ? "border-b-2 border-primary font-medium"
                    : "text-muted-foreground"
                }`
              }
            >
              Historial de Pedidos
            </NavLink>
          </nav>
        </div>

        <Outlet />
      </Container>
    </Section>
  );
}
