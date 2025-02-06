import { Link } from "react-router";

import logo from "@/assets/fullstock-logo.svg";
import { Container, Separator } from "@/components/ui";

import HeaderActions from "./header-actions";
import MainNav from "./main-nav";

const navigation = [
  { to: "polos", label: "Polos" },
  { to: "tazas", label: "Tazas" },
  { to: "stickers", label: "Stickers" },
];

export default function HeaderMain() {
  return (
    <Container className="sm:relative">
      <div className="flex justify-between items-center h-12">
        <Link to="/">
          <img src={logo} alt="FullStock inicio" width="128" height="32" />
        </Link>
        <HeaderActions />
      </div>
      <Separator className="sm:hidden" />
      <MainNav items={navigation} />
    </Container>
  );
}
