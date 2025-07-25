import { Outlet, NavLink } from "react-router";

import { Container, Section } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function Account() {
  return (
    <Section>
      <Container className="width-3xl">
        <div className="width-3xl mb-10">
          <h1 className="text-4xl leading-9 font-bold mb-4">Mi cuenta</h1>
          <p className="text-sm text-muted-foreground">
            Actualiza tu perfil y revisa tus historial pedidos.
          </p>
        </div>

        <div className="border-b border-border mb-6">
          <nav className="flex gap-4">
            <NavLink
              to="/account/profile"
              className={({ isActive }) =>
                cn(
                  "pb-2 pl-1 pr-1 text-muted-foreground",
                  isActive &&
                    "border-b-2 border-primary font-medium text-foreground"
                )
              }
            >
              Perfil
            </NavLink>
            <NavLink
              to="/account/orders"
              className={({ isActive }) =>
                cn(
                  "pb-2 pl-1 pr-1 text-muted-foreground",
                  isActive &&
                    "border-b-2 border-primary font-medium text-foreground"
                )
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
