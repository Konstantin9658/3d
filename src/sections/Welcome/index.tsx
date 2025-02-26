import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import Decor from "./images/decor.svg?react";
import Title from "./images/development_the_future.svg?react";
import AppStore from "./images/p44_app_store.svg?react";
import CssDesign from "./images/p44_css_design.svg?react";
import GlobalLeaders from "./images/p44_global_leaders.svg?react";
import AndroidDev from "./images/p44_top_android_development.svg?react";
import classes from "./styles.module.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Welcome = () => {
  const welcomeRef = useRef<HTMLElement | null>(null);

  // useGSAP(
  //   () => {
  //     console.log("asd");
  //     gsap
  //       .timeline({
  //         scrollTrigger: {
  //           trigger: welcomeRef.current,
  //           end: "+=100%",
  //           scrub: 0.5,
  //           pin: "#welcome-pin",
  //           fastScrollEnd: 100,
  //           scroller: scroll.fixed.parentElement,
  //           // markers: true,
  //         },
  //       })
  //       .from(`.${classes.welcome__inner}`, {
  //         immediateRender: false,
  //         opacity: 1,
  //         // transform: "translateY(0%)",
  //         ease: "power2.out",
  //       })
  //       .to(`.${classes.welcome__inner}`, {
  //         opacity: 0,
  //         // transform: "translateY(-100%)",
  //       })
  //       // .fromTo(
  //       //   `.${classes.welcome__inner}`,
  //       //   {
  //       //     opacity: 1,
  //       //     immediateRender: true,
  //       //     // transform: "translateY(0%)",
  //       //     ease: "power2.out",
  //       //   },
  //       //   {
  //       //     // transform: "translateY(-100%)",
  //       //     opacity: 0,
  //       //   }
  //       // )
  //       .to(
  //         `.${classes.welcome__bottom}`,
  //         {
  //           opacity: 0,
  //         },
  //         ">-0.5"
  //       );
  //   },
  //   { scope: welcomeRef, dependencies: [] }
  // );
  return (
    <section className={classes.welcome} id="welcome" ref={welcomeRef}>
      <div className={classes.welcome__wrapper} id="welcome-pin">
        <div className={classes.welcome__inner}>
          <div className={classes.welcome__badge}>Worldwide reach</div>
          <div className={classes.welcome__title}>
            <Title />
          </div>
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
