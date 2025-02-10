import { NavLink } from "react-router";

import { cn } from "@/lib/utils";

import styles from "./styles.module.css";

interface MainNavProps {
  items: {
    to: string;
    label: string;
  }[];
}

export default function MainNav({ items }: MainNavProps) {
  return (
    <nav aria-label="Navegación principal" className={styles["main-nav"]}>
      <ul className={styles["main-nav__list"]} role="menubar">
        {items.map((item) => (
          <li key={item.to} className={styles["main-nav__item"]} role="none">
            <NavLink
              to={item.to}
              role="menuitem"
              className={({ isActive }) =>
                cn(
                  styles["main-nav__link"],
                  isActive && styles["main-nav__link--active"]
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
