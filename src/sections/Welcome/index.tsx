import classes from "./styles.module.scss";
import Title from "./images/development_the_future.svg?react";
import AppStore from "./images/p44_app_store.svg?react";
import GlobalLeaders from "./images/p44_global_leaders.svg?react";
import CssDesign from "./images/p44_css_design.svg?react";
import AndroidDev from "./images/p44_top_android_development.svg?react";
import Decor from "./images/decor.svg?react";

export const Welcome = () => {
  return (
    <section className={classes.welcome}>
      <div className={classes.welcome__wrapper}>
        <div className={classes.welcome__inner}>
          <div className={classes.welcome__badge}>Worldwide reach</div>
          <Title className={classes.wrapper__title} />
          <p className={classes.welcome__description}>
            Proven by startups with core technologies by Mercury and sold to
            Fortune 500 companies.
          </p>
        </div>
        <div className={classes.welcome__bottom}>
          <div className={classes.welcome__scroll}>
            <Decor />
            <p>Scroll down</p>
          </div>
          <ul className={classes.welcome__achives}>
            <li className={classes.welcome__achivesItem}>
              <AppStore />
              <p>2 APPLICATIONS IN&nbsp;APP STORE’S TRENDS&nbsp;OF THE YEAR</p>
            </li>
            <li className={classes.welcome__achivesItem}>
              <GlobalLeaders />
              <p>GLOBAL LEADERS, TOP&nbsp;B2B COMPANIES, TOP DEVELOPERS</p>
            </li>
            <li className={classes.welcome__achivesItem}>
              <CssDesign />
              <p>UX,UI,INNOVATION, SPECIAL KUDOS CSS DESIGN AWARDS</p>
            </li>
            <li className={classes.welcome__achivesItem}>
              <AndroidDev />
              <p>TOP ANDROID APP DEVELOPMENT COMPANY</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
