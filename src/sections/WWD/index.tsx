import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

import Space_S from "./images/space_1.svg?react";
import Space_L from "./images/space_2.svg?react";
import W from "./images/test/1w.svg";
import H from "./images/test/2h.svg";
import A from "./images/test/3a.svg";
import T from "./images/test/4t.svg";
import W2 from "./images/test/5w.svg";
import E from "./images/test/6e.svg";
import D from "./images/test/7d.svg";
import O from "./images/test/8o.svg";
import classes from "./styles.module.scss";

gsap.registerPlugin(ScrollTrigger);

export const WWD = () => {
  useEffect(() => {
    // Анимация появления букв
    const letters = document.querySelectorAll<HTMLDivElement>(
      `.${classes.letter}`
    );
    const shuffledLetters = gsap.utils.shuffle([...letters]);

    gsap.set(shuffledLetters, {
      opacity: 0,
      scale: 0.85,
      filter: "blur(5px)",
    }); // начальное состояние всех букв

    const tl = gsap
      .timeline({
        paused: true,
        scrollTrigger: {
          trigger: "#wwd",
          end: "bottom -450%",
          scrub: 1,
          pin: "#wwd-pin",
          // markers: true,
        },
      })
      .to(
        shuffledLetters,
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          stagger: 0.05,
          // duration: 0.1,
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
    <div id="wwd" className={classes.container}>
      <div id="wwd-pin" className={classes.pin}>
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: 1920,
            maxHeight: 191,
            height: "9.5vw",
            padding: "0 120px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className={classes.letter__wrapper}>
            <img className={classes.letter} src={W} alt="" />
            <img className={classes.letter} src={H} alt="" />
            <img className={classes.letter} src={A} alt="" />
            <img className={classes.letter} src={T} alt="" />
          </div>
          <Space_S style={{ flexShrink: 0 }} />
          <div
            className={classes.letter__wrapper}
            // style={{ justifyContent: "center" }}
          >
            <img className={classes.letter} src={W2} alt="" />
            <img className={classes.letter} src={E} alt="" />
          </div>
          <Space_L style={{ flexShrink: 0 }} />
          <div
            className={classes.letter__wrapper}
            // style={{ justifyContent: "flex-end", flexShrink: 3 }}
          >
            <img className={classes.letter} src={D} alt="" />
            <img className={classes.letter} src={O} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
