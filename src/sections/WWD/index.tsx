import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import W from "./images/1w.svg";
import H from "./images/2h.svg";
import A from "./images/3a.svg";
import T from "./images/4t.svg";
import W2 from "./images/5w.svg";
import E from "./images/6e.svg";
import D from "./images/7d.svg";
import O from "./images/8o.svg";
import Space_S from "./images/space_1.svg?react";
import Space_L from "./images/space_2.svg?react";
import classes from "./styles.module.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const WWD = () => {
  const container = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const letters = document.querySelectorAll<HTMLImageElement>(
        `.${classes.wwd__titleLetter}`
      );
      const shuffledLetters = gsap.utils.shuffle([...letters]);

      gsap
        .timeline({
          paused: true,
          scrollTrigger: {
            trigger: container.current,
            end: "bottom 35%",
            scrub: 1,
            fastScrollEnd: 1000,
            pin: "#wwd-pin",
          },
        })
        .fromTo(
          shuffledLetters,
          {
            opacity: 0,
            scale: 0.85,
            filter: "blur(5px)",
          },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            stagger: 0.05,
            ease: "power2.out",
          },
          "<-0.6"
        )
        .to(
          shuffledLetters,
          {
            opacity: 0,
            scale: 0.85,
            filter: "blur(5px)",
            stagger: 0.03,
            duration: 0.1,
            ease: "power2.out",
          },
          ">"
        );
    },
    { scope: container }
  );

  return (
    <section id="wwd" className={classes.wwd} ref={container}>
      <div id="wwd-pin" className={classes.wwd__pin}>
        <div className={classes.wwd__title}>
          <div className={classes.wwd__letterWrapper}>
            <img className={classes.wwd__titleLetter} src={W} alt="" />
            <img className={classes.wwd__titleLetter} src={H} alt="" />
            <img className={classes.wwd__titleLetter} src={A} alt="" />
            <img className={classes.wwd__titleLetter} src={T} alt="" />
          </div>
          <Space_S
            className={clsx(
              classes.wwd__letterSpace,
              classes.wwd__letterSpace_s
            )}
          />
          <div className={classes.wwd__letterWrapper}>
            <img className={classes.wwd__titleLetter} src={W2} alt="" />
            <img className={classes.wwd__titleLetter} src={E} alt="" />
          </div>
          <Space_L
            className={clsx(
              classes.wwd__letterSpace,
              classes.wwd__letterSpace_l
            )}
          />
          <div className={classes.wwd__letterWrapper}>
            <img className={classes.wwd__titleLetter} src={D} alt="" />
            <img className={classes.wwd__titleLetter} src={O} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};
