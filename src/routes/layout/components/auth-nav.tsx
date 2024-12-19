import { Link } from "react-router";
import { Container } from "@/components/ui/container";

export default function AuthNav() {
  return (
    <div className="bg-black text-white text-sm font-medium">
      <Container className=" h-10 flex justify-end items-center">
        <nav aria-label="Autenticación de usuario">
          <ul className="flex gap-4">
            <li>
              <Link to="#" className="hover:underline">
                Iniciar sesión
              </Link>
            </li>
            <li>
              <Link to="#" className="hover:underline">
                Crear una cuenta
              </Link>
            </li>
          </ul>
        </nav>
      </Container>
    </div>
  );
}
