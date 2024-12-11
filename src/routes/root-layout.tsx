import { Link, NavLink, Outlet } from "react-router";

const navigation = [
  { to: "polos", label: "Polos" },
  { to: "tazas", label: "Tazas" },
  { to: "stickers", label: "Stickers" },
];

export default function RootLayout() {
  return (
    <>
      <header>
        <Link to="/">FullStock</Link>
        <nav>
          <ul>
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </>
  );
}
