/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict";

import global, { Package, Controller, logger, _DOMCreateElement, 
                type Effect, New, ClassFactory, type QCObjectsElement, 
                type QCObjectsShadowedElement, type Component, type ControllerParams } from "qcobjects";
import { Fade } from "qcobjects-sdk";

Package("org.quickcorp.custom.controllers", [
  class MainController extends Controller {
    static loaded: boolean;
    constructor(controller:ControllerParams) {
      logger.debug("Initializing MainController...");
      super(controller);
    }

    done(...args: never[]) {
      const _ret_ = super.done(args);
      if (!MainController.loaded) {
        const s = _DOMCreateElement("style");
        s.innerHTML = `
        @import url(css/body-layout.css);
        `;
        document.body.append(s);
        logger.debug("MainController loaded");
        MainController.loaded = true;
      }
      return _ret_;
    }
  },

  class SideNavController extends Controller {
    effect: Effect | null;
    visibility!: boolean;
    componentRoot!: any;
    component: Component;

    constructor(controller:ControllerParams) {
      logger.debug("Initializing SideNavController...");
      super(controller);
      this.component = controller.component;
      if (this.component.shadowed) {
        this.componentRoot = this.component.shadowRoot;
      } else {
        this.componentRoot = this.component.body;
      }
      (global as any).sideNavController = this;
      this.effect = new Fade({
        duration: 300
      });
    }

    done(...args: any[]) {
      const _ret_ = super.done(args);
      this.close();
      return _ret_;
    }

    open() {
      if (this.componentRoot !== null) {
        if (this.effect != null) {
          this.effect.apply(this.componentRoot, 0, 1);
        }
        this.componentRoot?.classList.add("open");
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!this.componentRoot?.parentElement) {
          if (this.componentRoot.parentElement !== null) {
            (this.componentRoot.parentElement as QCObjectsElement).subelements(".navbtn")[0].style.display = "none";
            (this.componentRoot.parentElement as QCObjectsElement).subelements(".closebtn")[0].style.display = "block";
          }
        }
      }
      this.visibility = true;
      return this.visibility;
    }

    close() {
      if (typeof this.componentRoot !== "undefined" && this.componentRoot !== null) {
        if (this.effect != null) {
          this.effect.apply(this.componentRoot, 1, 0);
        }
        this.componentRoot?.classList.remove("open");
        // eslint-disable-next-line no-extra-boolean-cast
        if (!!this.componentRoot?.parentElement) {
          (this.componentRoot.parentElement as QCObjectsElement).subelements(".navbtn")[0].style.display = "block";
          (this.componentRoot.parentElement as QCObjectsElement).subelements(".closebtn")[0].style.display = "none";
        }
      }
      this.visibility = false;
      return this.visibility;
    }

    toggle() {
      if (this.visibility) {
        this.close();
      } else {
        this.open();
      }
    }
  },

  class HeaderController extends Controller {
    installer: any;
    component!: Component;

    constructor(controller: ControllerParams) {
      super(controller);
      logger.debug("Header controller initialized");
    }

    loadInstallerButton() {
      const componentRoot = (this.component.shadowed != null) 
                            ? (this.component.shadowRoot as QCObjectsShadowedElement) 
                            : (this.component.body as QCObjectsElement);
      componentRoot.subelements("#installerbutton").map(
        (element) => {
          this.installer = New(ClassFactory("Installer"), element);
          return element;
        }
      );
    }

    done(...args: never[]) {
      const _ret_ = super.done(args);
      this.loadInstallerButton();
      return _ret_;
    }
  }
]);
