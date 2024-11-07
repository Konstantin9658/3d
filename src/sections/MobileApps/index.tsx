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
    // const letters = document.querySelectorAll<HTMLImageElement>(
    //   `.${classes.mobileApps__countItem}`
    // );
    // console.log(letters);
    // const shuffledLetters = gsap.utils.shuffle([...letters]);

    const tl = gsap
      .timeline({
        paused: true,
        scrollTrigger: {
          trigger: "#mobileapps",
          // start: "top 0%",
          end: "bottom 60%",
          scrub: 1,
          pin: "#mobileapps-pin",
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
          stagger: 0.1,
          ease: "power2.out",
        }
      )
      .fromTo(
        `.${classes.mobileApps__count}`,
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
          stagger: 0.1,
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
          stagger: 0.1,
          ease: "power2.out",
        }
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
