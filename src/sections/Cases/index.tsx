import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

import C from "./images/1c.svg";
import A from "./images/2a.svg";
import S from "./images/3s.svg";
import E from "./images/4e.svg";
import S2 from "./images/5s.svg";
import classes from "./styles.module.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Cases = () => {
  const container = useRef<HTMLElement | null>(null);

  // useGSAP(
  //   () => {
  //     const letters = document.querySelectorAll<HTMLImageElement>(
  //       `.${classes.cases__titleLetter}`
  //     );
  //     const shuffledLetters = gsap.utils.shuffle([...letters]);

  //     gsap
  //       .timeline({
  //         paused: true,
  //         scrollTrigger: {
  //           trigger: container.current,
  //           end: "bottom 200%",
  //           pinSpacing: true,
  //           scrub: 1,
  //           pin: "#cases-pin",
  //           // markers: true,
  //           fastScrollEnd: 1000,
  //           preventOverlaps: true,
  //         },
  //       })
  //       .fromTo(
  //         shuffledLetters,
  //         {
  //           immediateRender: false,
  //           opacity: 0,
  //           scale: 0.85,
  //           filter: "blur(5px)",
  //         },
  //         {
  //           opacity: 1,
  //           scale: 1,
  //           filter: "blur(0px)",
  //           stagger: 0.03,
  //           ease: "power2.out",
  //         }
  //       )
  //       .fromTo(
  //         `.${classes.cases__description}`,
  //         {
  //           immediateRender: false,
  //           opacity: 0,
  //         },
  //         {
  //           opacity: 1,
  //         },
  //         "<"
  //       )
  //       .fromTo(
  //         `.${classes.cases__bottom}`,
  //         {
  //           immediateRender: false,
  //           opacity: 0,
  //         },
  //         {
  //           opacity: 1,
  //         },
  //         "<"
  //       )
  //       .to(
  //         shuffledLetters,
  //         {
  //           opacity: 0,
  //           scale: 0.85,
  //           filter: "blur(5px)",
  //           stagger: 0.05,
  //           duration: 0.5,
  //           ease: "power2.out",
  //         },
  //         ">"
  //       )
  //       .to(
  //         `.${classes.cases__description}`,
  //         {
  //           opacity: 0,
  //         },
  //         "<"
  //       )
  //       .to(
  //         `.${classes.cases__bottom}`,
  //         {
  //           opacity: 0,
  //         },
  //         "<"
  //       );
  //   },
  //   { scope: container }
  // );

  return (
    <section className={classes.cases} ref={container} id="cases">
      <div className={classes.cases__wrapper} id="cases-pin">
        <div className={classes.cases__inner}>
          <div className={classes.cases__title}>
            <img className={classes.cases__titleLetter} src={C} alt="" />
            <img className={classes.cases__titleLetter} src={A} alt="" />
            <img className={classes.cases__titleLetter} src={S} alt="" />
            <img className={classes.cases__titleLetter} src={E} alt="" />
            <img className={classes.cases__titleLetter} src={S2} alt="" />
          </div>
          <p className={classes.cases__description}>
            Over 20 years of work, we have made projects in almost every segment
            of the business.
          </p>
        </div>
        <div className={classes.cases__bottom}>
          <div className={classes.cases__count}>
            {/* <CountBg /> */}
            <div className={classes.cases__countWrapper}>
              <p>600+</p>
            </div>
          </div>
          <div className={classes.cases__box}>
            <p>Successful{`\n`}cases</p>
          </div>
        </div>
      </div>
    </section>
  );
};
