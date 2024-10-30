import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
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

  const lenis = useLenis();

  useGSAP(
    () => {
      gsap
        .timeline({
          paused: true,
          repeatRefresh: false,
          scrollTrigger: {
            start: "top 133px",
            end: "+=90%",
            scrub: 1,
            pin: "#welcome-pin",
            // markers: true,
          },
        })
        .fromTo(
          `.${classes.welcome__inner}`,
          {
            opacity: 1,
            immediateRender: false,
            repeat: 0,
            transform: "translateY(0%)",
            ease: "power2.out",
          },
          {
            transform: "translateY(-100%)",
            opacity: 0,
          }
        )
        .to(`.${classes.welcome__achives}`, {
          opacity: 0,
        });
    },
    { scope: welcomeRef }
  );
  return (
    <section className={classes.welcome} id="welcome" ref={welcomeRef}>
      <div className={classes.welcome__wrapper} id="welcome-pin">
        <div className={classes.welcome__inner}>
          <div className={classes.welcome__badge}>Worldwide reach</div>
          <Title className={classes.wrapper__title} />
          <p className={classes.welcome__description}>
            Proven by startups with core technologies by Mercury and sold to
            Fortune 500 companies.
          </p>
        </div>
        <div className={classes.welcome__bottom}>
          <div
            className={clsx(
              classes.welcome__scroll,
              lenis?.animatedScroll !== 0 && classes.welcome__scroll_hide
            )}
          >
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
