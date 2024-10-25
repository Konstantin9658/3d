import Logo from "@/assets/images/logo.svg?react";
import classes from "./styles.module.scss";
import { Button } from "../Button";

export const Header = () => {
  return (
    <header className={classes.header}>
      <div className={classes.header__wrapper}>
        <Logo />
        <nav className={classes.header__nav}>
          <ul className={classes.header__navList}>
            <li className={classes.header__navListItem}>what we do</li>
            <li className={classes.header__navListItem}>portfolio</li>
            <li className={classes.header__navListItem}>company</li>
            <li className={classes.header__navListItem}>blog</li>
            <li className={classes.header__navListItem}>contacts</li>
          </ul>
        </nav>
        <Button
          text="Request estimate"
          variant="primary"
          className={classes.header__button}
        />
      </div>
    </header>
  );
};
