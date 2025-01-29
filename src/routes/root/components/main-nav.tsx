import { NavLink } from "react-router";

import { cn } from "@/lib/utils";

interface MainNavProps {
  items: {
    to: string;
    label: string;
  }[];
}

export default function MainNav({ items }: MainNavProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="sm:absolute sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
    >
      <ul className="flex justify-center h-12" role="menubar">
        {items.map((item) => (
          <li key={item.to} className="flex justify-center" role="none">
            <NavLink
              to={item.to}
              role="menuitem"
              className={({ isActive }) =>
                cn(
                  "inline-flex justify-center items-center p-3 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors",
                  isActive && "text-accent-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
