/* eslint-disable no-unreachable */
"use strict";
import global, { InheritClass, Package, logger } from "qcobjects";
import { NotificationComponent } from "qcobjects-sdk";

Package("com.qcobjects.installer", [
  class Installer extends InheritClass {
    root: Element;
    promptEvent!: HTMLElement;

    /**
     * Creates an instance of Installer.
     * @date 18/04/2023 - 22:27:17
     *
     * @constructor
     * @param {HTMLElement} root
     */
    constructor (root: HTMLElement) {
      super();

      this.root = root;
      window.addEventListener("beforeinstallprompt", () => this.beforeinstallprompt.bind(this), false);
      window.addEventListener("appinstalled", () => this.installed.bind(this), false);

      root.addEventListener("click", () => this.install.bind(this));
      root.addEventListener("touchend", () => this.install.bind(this));

      window.matchMedia("(display-mode: standalone)").addEventListener("change", (evt) => {
        let displayMode = "browser";
        if (evt.matches) {
          displayMode = "standalone";
        }
        NotificationComponent.success(`TWA in ${displayMode} Mode`);
      });
      global.set("installer", this);
    }

    /**
     * It is executed before the install prompt event
     * @date 18/04/2023 - 22:27:30
     *
     * @param {Event} e
     * @returns {boolean}
     */
    beforeinstallprompt (e: Event) {
      logger.debug("registering installer event");
      e.preventDefault();
      global.set("promptEvent", e);
      this.root.classList.add("available");
      return false;
    }

    /**
     * it works after the install event
     * @date 18/04/2023 - 22:28:36
     */
    installed () {
      logger.debug("app is already installed");
      global.set("promptEvent", null);
      //         This fires after onbeforinstallprompt OR after manual add to homescreen.
      this.root.classList.remove("available");
    }

    /**
     * it executes the install after the button click
     * @date 18/04/2023 - 22:29:11
     */
    install () {
      const root = this.root;
      logger.debug("installer actioned");
      let promptEvent = global.get("promptEvent", null);
      if (promptEvent) {
        logger.debug("prompt event");

        promptEvent.prompt();
        promptEvent.userChoice
          .then(function (choiceResult: { outcome: string }) {
            if (choiceResult.outcome === "accepted") {
              // The user actioned the prompt (good or bad).
              // good is handled in
              root.classList.remove("available");
            } else {
              logger.debug("User has chosen not to install the PWA");
            }
            promptEvent = null;
          })
          .catch(function (installError: { toString: () => string }) {
            // Boo. update the UI.
            promptEvent = null;
            root.classList.remove("available");
            logger.warn(`Error during install:  ${installError.toString()}`);
          });
      } else {
        logger.debug("It is not possible to get the prompt event for install ");
      }
    }
  }
]);
