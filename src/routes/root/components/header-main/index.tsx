import { Link } from "react-router";

import logo from "@/assets/fullstock-logo.svg";
import { Container, Separator } from "@/components/ui";

import HeaderActions from "../header-actions";
import MainNav from "../main-nav";
import styles from "./styles.module.css";

const navigation = [
  { to: "polos", label: "Polos" },
  { to: "tazas", label: "Tazas" },
  { to: "stickers", label: "Stickers" },
];

export default function HeaderMain() {
  return (
    <Container className={styles["header-main"]}>
      <div className={styles["header-main__top"]}>
        <Link to="/">
          <img src={logo} alt="FullStock inicio" width="128" height="32" />
        </Link>
        <HeaderActions />
      </div>
      <Separator className={styles["header-main__separator"]} />
      <MainNav items={navigation} />
    </Container>
  );
}
