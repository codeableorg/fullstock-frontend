import { Outlet } from "react-router";
import AuthNav from "./components/auth-nav";
import HeaderMain from "./components/header-main";

export default function Layout() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-background">
      <header className="sticky top-0 bg-background">
        <AuthNav />
        <HeaderMain />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  );
}
