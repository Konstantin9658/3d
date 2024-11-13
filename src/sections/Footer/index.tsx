import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

import { Button } from "@/components/Button";

import classes from "./styles.module.scss";

gsap.registerPlugin(ScrollTrigger);

const TITLE_1 = ["N", "e", "e", "d", " "];
const TITLE_2 = ["h", "e", "l", "p", "?"];

export const Footer = () => {
  const [isAgree, setAgree] = useState<boolean>(false);

  useEffect(() => {
    const letters = document.querySelectorAll<HTMLSpanElement>(
      `.${classes.footer__titleLetter}`
    );
    const shuffledLetters = gsap.utils.shuffle([...letters]);

    const tl = gsap
      .timeline({
        paused: true,
        repeat: 0,
        scrollTrigger: {
          trigger: "#footer",
          // start: "top 0%",
          end: "bottom 10%",
          fastScrollEnd: 1000,
          scrub: 1,
          pin: "#footer-pin",
          // markers: true,
        },
      })
      .fromTo(
        shuffledLetters,
        {
          opacity: 0,
          scale: 0.85,
          filter: "blur(5px)",
          immediateRender: false,
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
        `.${classes.footer__description}`,
        {
          opacity: 0,
          immediateRender: false,
        },
        {
          opacity: 1,
        },
        "<+=0.5"
      )
      .fromTo(
        `.${classes.footer__contacts}`,
        {
          immediateRender: false,
          opacity: 0,
        },
        {
          opacity: 1,
        },
        ">-=0.5"
      )
      .fromTo(
        `.${classes.footer__form}`,
        {
          immediateRender: false,
          opacity: 0,
        },
        {
          opacity: 1,
        },
        ">-=0.5"
      )
      .to(
        `.${classes.footer__description}`,
        {
          opacity: 0,
        },
        ">"
      )
      .to(
        `.${classes.footer__contacts}`,
        {
          opacity: 0,
        },
        ">"
      )
      .to(
        `.${classes.footer__form}`,
        {
          opacity: 0,
        },
        ">"
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
      );

    return () => void tl.kill();
  }, []);

  return (
    <footer className={classes.footer} id="footer">
      <div className={classes.footer__wrapper} id="footer-pin">
        <div className={classes.footer__inner}>
          <div className={classes.footer__info}>
            <div className={classes.footer__titleWrapper}>
              <h2 className={classes.footer__title}>
                {TITLE_1.map((letter, i) => (
                  <span
                    className={clsx(
                      classes.footer__titleLetter,
                      i === 0 && classes.footer__titleLetter_first
                    )}
                    key={`title-1-letter-${i}`}
                  >
                    {letter}
                  </span>
                ))}
                {TITLE_2.map((letter, i) => (
                  <span
                    className={clsx(
                      classes.footer__titleLetter,
                      i === 0 && classes.footer__titleLetter_first
                    )}
                    key={`title-2-letter-${i}`}
                  >
                    {letter}
                  </span>
                ))}
              </h2>
            </div>
            <p className={classes.footer__description}>
              Feel free to contact us and we'll respond as soon as possible.
            </p>
          </div>
          <div className={classes.footer__contacts}>
            <a
              className={classes.footer__email}
              href="mailto:sales@mercurydevelopment.com"
            >
              sales@mercurydevelopment.com
            </a>
            <a className={classes.footer__tel} href="tel:+13057672434">
              +1 305 767 2434
            </a>
          </div>
        </div>
        <form action="POST" className={classes.footer__form}>
          <ul className={classes.footer__formFields}>
            <li className={classes.footer__formField}>
              <input
                className={classes.footer__formInput}
                type="text"
                id="name-field"
              />
              <label className={classes.footer__formLabel} htmlFor="name-field">
                Name
              </label>
            </li>
            <li className={classes.footer__formField}>
              <input
                className={classes.footer__formInput}
                type="text"
                id="email-field"
              />
              <label
                className={classes.footer__formLabel}
                htmlFor="email-field"
              >
                Email or phone
              </label>
            </li>
            <li className={classes.footer__formField}>
              <input
                className={classes.footer__formInput}
                type="text"
                id="textarea-field"
              />
              <label
                className={classes.footer__formLabel}
                htmlFor="textarea-field"
              >
                Tell us about your project
              </label>
            </li>
          </ul>
          <div className={classes.footer__formPrivacy}>
            <input
              checked={isAgree}
              readOnly
              type="checkbox"
              id="checkbox-field"
              className={classes.footer__formCheckbox}
            />
            <label
              className={classes.footer__formPrivacyLabel}
              htmlFor="checkbox-field"
              onClick={() => setAgree(!isAgree)}
            >
              I agree to personal data processing and the privacy policy.
            </label>
            <div
              className={classes.footer__formSwitcher}
              onClick={() => setAgree(!isAgree)}
            />
          </div>
          <Button
            className={classes.footer__formRequest}
            text="Send request"
            variant="primary"
          />
        </form>
      </div>
    </footer>
  );
};
