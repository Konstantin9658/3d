import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

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

gsap.registerPlugin(ScrollTrigger);

export const WWD = () => {
  useEffect(() => {
    // Анимация появления букв
    const letters = document.querySelectorAll<HTMLImageElement>(
      `.${classes.letter}`
    );
    const shuffledLetters = gsap.utils.shuffle([...letters]);

    // gsap.set(shuffledLetters, {
    //   opacity: 0,
    //   scale: 0.85,
    //   filter: "blur(5px)",
    // }); // начальное состояние всех букв

    const tl = gsap
      .timeline({
        paused: true,
        scrollTrigger: {
          trigger: "#wwd",
          end: "bottom -480%",
          scrub: 1,
          pin: "#wwd-pin",
          pinSpacing: true,
          // pinReparent: true,
          // markers: true,
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

    return () => void tl.kill();
  }, []);

  return (
    <section id="wwd" className={classes.wwd}>
      <div id="wwd-pin" className={classes.pin}>
        <div className={classes.title}>
          <div className={classes.letter__wrapper}>
            <img className={classes.letter} src={W} alt="" />
            <img className={classes.letter} src={H} alt="" />
            <img className={classes.letter} src={A} alt="" />
            <img className={classes.letter} src={T} alt="" />
          </div>
          <Space_S className={classes.letter__space} />
          <div className={classes.letter__wrapper}>
            <img className={classes.letter} src={W2} alt="" />
            <img className={classes.letter} src={E} alt="" />
          </div>
          <Space_L className={classes.letter__space} />
          <div className={classes.letter__wrapper}>
            <img className={classes.letter} src={D} alt="" />
            <img className={classes.letter} src={O} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
};
