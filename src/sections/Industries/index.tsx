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
    const letters = document.querySelectorAll<HTMLImageElement>(
      `.${classes.industries__titleLetter}`
    );
    const shuffledLetters = gsap.utils.shuffle([...letters]);

    const tl = gsap
      .timeline({
        paused: true,
        scrollTrigger: {
          trigger: "#industries",
          // start: "top 0%",
          end: "bottom 20%",
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
          stagger: 0.03,
          ease: "power2.out",
        }
      )
      .fromTo(
        `.${classes.industries__description}`,
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
        "<+=0.5"
      )
      .to(
        shuffledLetters,
        {
          opacity: 0,
          scale: 0.85,
          filter: "blur(5px)",
          stagger: 0.03,
          ease: "power2.out",
        },
        ">"
      )
      .to(
        `.${classes.industries__description}`,
        {
          opacity: 0,
        },
        ">"
      );

    return () => void tl.kill();
  }, []);

  return (
    <section className={classes.industries} id="industries">
      <div id="industries-pin" className={classes.industries__wrapper}>
        <div className={classes.industries__inner}>
          <div className={classes.industries__title}>
            <img className={classes.industries__titleLetter} src={I} alt="" />
            <img className={classes.industries__titleLetter} src={N} alt="" />
            <img className={classes.industries__titleLetter} src={D} alt="" />
            <img className={classes.industries__titleLetter} src={U} alt="" />
            <img className={classes.industries__titleLetter} src={S} alt="" />
            <img className={classes.industries__titleLetter} src={T} alt="" />
            <img className={classes.industries__titleLetter} src={R} alt="" />
            <img className={classes.industries__titleLetter} src={I2} alt="" />
            <img className={classes.industries__titleLetter} src={E} alt="" />
            <img className={classes.industries__titleLetter} src={S2} alt="" />
          </div>
        </div>
        <p className={classes.industries__description}>
          We’ve gained ample experience for a wide range of industries, making
          our soilutions compliant with the specific requirements.
        </p>
      </div>
    </section>
  );
};
