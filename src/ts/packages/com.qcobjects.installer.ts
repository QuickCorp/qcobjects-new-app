/* eslint-disable @typescript-eslint/no-explicit-any */
"use strict";
import {Package, logger, global} from "qcobjects";
import { NotificationComponent } from "qcobjects-sdk";

Package("com.qcobjects.installer", [
  class Installer {
    root: Element;
    promptEvent!: any;

    constructor(root:any) {

      this.root = root;
      window.addEventListener("beforeinstallprompt", this.beforeinstallprompt.bind(this), false);
      window.addEventListener("appinstalled", this.installed.bind(this), false);

      root.addEventListener("click", this.install.bind(this));
      root.addEventListener("touchend", this.install.bind(this));

      window.matchMedia("(display-mode: standalone)").addEventListener("change", (evt) => {
        let displayMode = "browser";
        if (evt.matches) {
          displayMode = "standalone";
        }
        NotificationComponent.success(`TWA in ${displayMode} Mode`);
      });
      global.set("installer", this);
    }

    beforeinstallprompt(e:Event) {
      logger.debug("registering installer event");
      e.preventDefault();
      this.promptEvent = e;
      this.root.classList.add("available");
      return false;
    }

    installed() {
      logger.debug("app is already installed");
      this.promptEvent = null;
      //         This fires after onbeforinstallprompt OR after manual add to homescreen.
      this.root.classList.remove("available");
    }

    install() {
      const root = this.root;
      logger.debug("installer actioned");
      let promptEvent = this.promptEvent;
      if (promptEvent) {
        logger.debug("prompt event");

        promptEvent.prompt();
        promptEvent.userChoice
          .then(function (choiceResult: { outcome: string; }) {
            if (choiceResult.outcome === "accepted") {
              // The user actioned the prompt (good or bad).
              // good is handled in
              root.classList.remove("available");
            } else {
              logger.debug("User has chosen not to install the PWA");
            }
            promptEvent = null;
          })
          .catch(function (installError: { toString: () => any; }) {
            // Boo. update the UI.
            promptEvent = null;
            root.classList.remove("available");
            logger.warn(`Error during install:  ${installError.toString()}`);
          });
      } else {
        logger.debug("not asking for install");
      }
    }
  }
]);

