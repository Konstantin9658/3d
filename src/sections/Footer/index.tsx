import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/Button";

import classes from "./styles.module.scss";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TITLE_1 = ["N", "e", "e", "d", " "];
const TITLE_2 = ["h", "e", "l", "p", "?"];

interface IFormData {
  name: string;
  email: string;
  about?: string;
  privacy: boolean;
}

export const Footer = () => {
  const { control, setValue } = useForm<IFormData>({
    defaultValues: { name: "", email: "", about: "", privacy: false },
  });

  const container = useRef<HTMLElement | null>(null);

  // const { name, email, privacy } = watch();

  useGSAP(
    () => {
      gsap
        .timeline({
          paused: true,
          repeat: 0,
          scrollTrigger: {
            trigger: container.current,
            // start: "top 0%",
            end: "bottom 10%",
            fastScrollEnd: 1000,
            scrub: 1,
            pin: "#footer-pin",
            // markers: true,
          },
        })
        // .fromTo(
        //   shuffledLetters,
        //   {
        //     opacity: 0,
        //     scale: 0.85,
        //     filter: "blur(5px)",
        //     immediateRender: false,
        //   },
        //   {
        //     opacity: 1,
        //     scale: 1,
        //     filter: "blur(0px)",
        //     stagger: 0.03,
        //     ease: "power2.out",
        //   }
        // )
        .fromTo(
          `.${classes.footer__wrapper}`,
          {
            opacity: 0,
            immediateRender: false,
          },
          {
            opacity: 1,
          }
          // "<+=0.5"
        )
        // .fromTo(
        //   `.${classes.footer__contacts}`,
        //   {
        //     immediateRender: false,
        //     opacity: 0,
        //   },
        //   {
        //     opacity: 1,
        //   },
        //   ">-=0.5"
        // )
        // .fromTo(
        //   `.${classes.footer__form}`,
        //   {
        //     immediateRender: false,
        //     opacity: 0,
        //   },
        //   {
        //     opacity: 1,
        //   },
        //   ">-=0.5"
        // )
        // .to(
        //   `.${classes.footer__description}`,
        //   {
        //     opacity: 0,
        //   },
        //   ">"
        // )
        // .to(
        //   `.${classes.footer__contacts}`,
        //   {
        //     opacity: 0,
        //   },
        //   ">"
        // )
        .to(
          `.${classes.footer__wrapper}`,
          {
            opacity: 0,
          },
          ">"
        );
      // .to(
      //   shuffledLetters,
      //   {
      //     opacity: 0,
      //     scale: 0.85,
      //     filter: "blur(5px)",
      //     stagger: 0.03,
      //     ease: "power2.out",
      //   },
      //   ">"
      // );
    },
    { scope: container }
  );

  return (
    <footer className={classes.footer} ref={container} id="footer">
      <div className={classes.footer__wrapper} id="footer-pin">
        <div className={classes.footer__overlay} />
        <div className={classes.footer__content}>
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
                Feel free to contact us and we'll{`\n`}respond as soon as
                possible.
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
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <>
                      <input
                        value={field.value}
                        onChange={field.onChange}
                        className={clsx(
                          classes.footer__formInput,
                          !!field.value && classes.footer__formInput_filled
                        )}
                        type="text"
                        id="name-field"
                      />
                      <label
                        className={classes.footer__formLabel}
                        htmlFor="name-field"
                      >
                        Name
                      </label>
                    </>
                  )}
                />
              </li>
              <li className={classes.footer__formField}>
                <Controller
                  control={control}
                  rules={{ required: "Required" }}
                  name="email"
                  render={({ field }) => (
                    <>
                      <input
                        className={clsx(
                          classes.footer__formInput,
                          !!field.value && classes.footer__formInput_filled
                        )}
                        value={field.value}
                        onChange={field.onChange}
                        type="text"
                        id="email-field"
                      />
                      <label
                        className={classes.footer__formLabel}
                        htmlFor="email-field"
                      >
                        Email or phone
                      </label>
                    </>
                  )}
                />
              </li>
              <li className={classes.footer__formField}>
                <Controller
                  control={control}
                  name="about"
                  render={({ field }) => (
                    <>
                      <input
                        value={field.value}
                        className={clsx(
                          classes.footer__formInput,
                          !!field.value && classes.footer__formInput_filled
                        )}
                        type="text"
                        id="textarea-field"
                        onChange={field.onChange}
                      />
                      <label
                        className={classes.footer__formLabel}
                        htmlFor="textarea-field"
                      >
                        Tell us about your project
                      </label>
                    </>
                  )}
                />
              </li>
            </ul>
            <div className={classes.footer__formPrivacy}>
              <Controller
                control={control}
                name="privacy"
                rules={{ required: true }}
                render={({ field }) => {
                  console.log(field.value);
                  return (
                    <>
                      <input
                        checked={field.value}
                        readOnly
                        type="checkbox"
                        id="checkbox-field"
                        className={clsx(
                          classes.footer__formCheckbox,
                          field.value && classes.footer__formCheckbox_checked
                        )}
                      />
                      <label
                        className={classes.footer__formPrivacyLabel}
                        htmlFor="checkbox-field"
                        onClick={() => setValue("privacy", !field.value)}
                      >
                        I agree to personal data processing and the privacy
                        policy.
                      </label>
                      <div
                        className={classes.footer__formSwitcher}
                        onClick={() => setValue("privacy", !field.value)}
                      />
                    </>
                  );
                }}
              />
            </div>
            <Button
              className={classes.footer__formRequest}
              text="Send request"
              variant="primary"
            />
          </form>
        </div>
      </div>
    </footer>
  );
};
