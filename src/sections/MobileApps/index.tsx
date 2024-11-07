import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

import one from "./images/11.svg";
import five from "./images/25.svg";
import zero from "./images/30.svg";
import zero_2 from "./images/40.svg";
import classes from "./styles.module.scss";

gsap.registerPlugin(ScrollTrigger);

export const MobileApps = () => {
  useEffect(() => {
    const letters = document.querySelectorAll<HTMLImageElement>(
      `.${classes.mobileApps__countItem}`
    );

    const shuffledLetters = gsap.utils.shuffle([...letters]);

    const tl = gsap
      .timeline({
        paused: true,
        scrollTrigger: {
          trigger: "#mobileapps",
          end: "bottom 100%",
          scrub: 1,
          pin: "#mobileapps-pin",
          fastScrollEnd: 1000,
          preventOverlaps: true,
          // markers: true,
        },
      })
      .fromTo(
        `.${classes.mobileApps__title}`,
        {
          opacity: 0,
          scale: 0.85,
          immediateRender: false,
          filter: "blur(5px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          // stagger: 0.01,
          ease: "power2.out",
        }
      )
      .fromTo(
        shuffledLetters,
        {
          opacity: 0,
          scale: 0.85,
          immediateRender: false,
          filter: "blur(5px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          stagger: 0.03,
          ease: "power2.out",
        },
        ">"
      )
      .fromTo(
        `.${classes.mobileApps__description}`,
        {
          opacity: 0,
          scale: 0.85,
          immediateRender: false,
          filter: "blur(5px)",
        },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          ease: "power2.out",
        },
        ">-=0.5"
      )
      .to(
        `.${classes.mobileApps__title}`,
        {
          opacity: 0,
          scale: 0.85,
          filter: "blur(5px)",
          ease: "power2.out",
        },
        ">"
      )
      .to(
        `.${classes.mobileApps__description}`,
        {
          opacity: 0,
          scale: 0.85,
          filter: "blur(5px)",
          ease: "power2.out",
        },
        ">-=0.5"
      )
      .to(
        shuffledLetters,
        {
          opacity: 0,
          scale: 0.85,
          filter: "blur(5px)",
          ease: "power2.out",
          stagger: 0.05,
        },
        ">"
      );

    return () => void tl.kill();
  }, []);

  return (
    <section className={classes.mobileApps} id="mobileapps">
      <div className={classes.mobileApps__wrapper} id="mobileapps-pin">
        <h2 className={classes.mobileApps__title}>More than</h2>
        <div className={classes.mobileApps__count}>
          <img className={classes.mobileApps__countItem} src={one} alt="" />
          <img className={classes.mobileApps__countItem} src={five} alt="" />
          <img className={classes.mobileApps__countItem} src={zero} alt="" />
          <img className={classes.mobileApps__countItem} src={zero_2} alt="" />
        </div>
        <p className={classes.mobileApps__description}>
          Mobile apps & Web services
        </p>
      </div>
    </section>
  );
};
