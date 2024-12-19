import { Link } from "react-router";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import MainNav from "./main-nav";
import HeaderActions from "./header-actions";
import logo from "@/assets/fullstock-logo.svg";

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
          <img src={logo} alt="FullStock inicio" />
        </Link>
        <HeaderActions />
      </div>
      <Separator className="sm:hidden" />
      <MainNav items={navigation} />
    </Container>
  );
}
