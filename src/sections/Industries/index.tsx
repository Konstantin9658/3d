import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

import I from "./images/1i.svg";
import N from "./images/2n.svg";
import D from "./images/3d.svg";
import U from "./images/4u.svg";
import S from "./images/5s.svg";
import T from "./images/6t.svg";
import R from "./images/7r.svg";
import I2 from "./images/8i.svg";
import E from "./images/9e.svg";
import S2 from "./images/10s.svg";
import classes from "./styles.module.scss";

gsap.registerPlugin(ScrollTrigger);
export const Industries = () => {
  useEffect(() => {
    // Анимация появления букв
    const letters = document.querySelectorAll<HTMLImageElement>(
      `.${classes.word}`
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
          // trigger: "#industries",
          start: "top 0%",
          end: "bottom -180%",
          scrub: 1,
          pin: "#industries-pin",
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
        }
        // "<-0.6"
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
    <section className={classes.industries} id="industries">
      <div id="industries-pin" className={classes.industries__wrapper}>
        <div>
          <img className={classes.word} src={I} alt="" />
          <img className={classes.word} src={N} alt="" />
          <img className={classes.word} src={D} alt="" />
          <img className={classes.word} src={U} alt="" />
          <img className={classes.word} src={S} alt="" />
          <img className={classes.word} src={T} alt="" />
          <img className={classes.word} src={R} alt="" />
          <img className={classes.word} src={I2} alt="" />
          <img className={classes.word} src={E} alt="" />
          <img className={classes.word} src={S2} alt="" />
        </div>
      </div>
    </section>
  );
};
