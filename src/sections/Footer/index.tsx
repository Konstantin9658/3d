import { useState } from "react";

import { Button } from "@/components/Button";

import classes from "./styles.module.scss";

export const Footer = () => {
  const [isAgree, setAgree] = useState<boolean>(false);

  return (
    <footer className={classes.footer}>
      <div className={classes.footer__wrapper}>
        <div className={classes.footer__inner}>
          <div className={classes.footer__info}>
            <h2 className={classes.footer__title}>
              <span>N</span>eed <span>h</span>elp?
            </h2>
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
          <Button className={classes.footer__formRequest} text="Send request" variant="primary" />
        </form>
      </div>
    </footer>
  );
};
