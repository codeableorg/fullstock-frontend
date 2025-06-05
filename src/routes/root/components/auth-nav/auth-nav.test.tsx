import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, it, expect } from "vitest";

import type { User } from "@/models/user.model";
import AuthNav from "@/routes/root/components/auth-nav";

// Opción con Mock React Router components
// vi.mock("react-router", () => ({
//   Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
//   Link: ({ children, to, ...props }: any) => (
//     <a href={to} {...props}>
//       {children}
//     </a>
//   ),
// }));

const renderWithRouter = (component: React.ReactElement) => {
  const router = createMemoryRouter([
    {
      path: "/",
      element: component,
    },
  ]);
  return render(<RouterProvider router={router} />);
};

describe("AuthNav Component", () => {
  it("renders correctly when user doesn't exist", () => {
    renderWithRouter(<AuthNav />);

    expect(screen.queryByText("Iniciar sesión")).toBeInTheDocument();
    expect(screen.queryByText("Crear una cuenta")).toBeInTheDocument();
  });

  it("renders correctly when user exists with name", () => {
    const user: Omit<User, "password"> = {
      id: 1,
      email: "testino@mail.com",
      name: "Testino",
      isGuest: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    renderWithRouter(<AuthNav user={user} />);

    expect(screen.queryByText(`Bienvenido ${user.name}`)).toBeInTheDocument();
    expect(screen.queryByText("Cerrar sesión")).toBeInTheDocument();
    expect(screen.queryByText("Iniciar sesión")).not.toBeInTheDocument();
    expect(screen.queryByText("Crear una cuenta")).not.toBeInTheDocument();
  });

  it("renders correctly when user exists with email only", () => {
    const user: Omit<User, "password"> = {
      id: 1,
      email: "testino@mail.com",
      name: null,
      isGuest: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    renderWithRouter(<AuthNav user={user} />);

    expect(screen.queryByText(`Bienvenido ${user.email}`)).toBeInTheDocument();
    expect(screen.queryByText("Cerrar sesión")).toBeInTheDocument();
  });
});
