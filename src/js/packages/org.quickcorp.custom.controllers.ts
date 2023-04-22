/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict";

import global, { Package, Controller, logger, _DOMCreateElement, type Effect, New, ClassFactory, type QCObjectsElement, type QCObjectsShadowedElement, type Component } from "qcobjects";

Package("org.quickcorp.custom.controllers", [
  class MainController extends Controller {
    static loaded: boolean;
    constructor ({ component }: { component: Component }) {
      logger.debug("Initializing MainController...");
      super({ component });
    }

    done (...args: never[]) {
      const _ret_ = super.done(args);
      if (!MainController.loaded) {
        const s = _DOMCreateElement("style");
        s.innerHTML = "body, html {margin:0;padding:0;width:100%;height:100%;top:0;bottom:0;left:0;right:0}";
        document.body.append(s);
        logger.debug("MainController loaded");
        MainController.loaded = true;
      }
      return _ret_;
    }
  },

  class SideNavController extends Controller {
    effect!: Effect;
    visibility!: boolean;
    constructor ({ component }: { component: Component }) {
      logger.debug("Initializing SideNavController...");
      super({ component });
      (global as any).sideNavController = this;
    }

    done (...args: any[]) {
      super.done(args);
      this.effect = New(ClassFactory("Fade"), {
        duration: 300
      });
      this.close();
    }

    open () {
      const componentRoot = (this.component.shadowed != null) ? (this.component.shadowRoot) : (this.component.body);
      if (this.effect != null) {
        this.effect.apply(componentRoot, 0, 1);
      }
      if (componentRoot !== undefined) {
        componentRoot.style.width = "100%";
        componentRoot.style.overflowX = "visible";
        if (Object.hasOwnProperty.call(componentRoot, "parentElement") && typeof componentRoot.parentElement !== "undefined") {
          const parentElement = componentRoot.parentElement as QCObjectsElement;
          if (parentElement !== null) {
            parentElement.subelements(".navbtn")[0].style.display = "none";
            parentElement.subelements(".closebtn")[0].style.display = "block";
          }
        }
      }
      this.visibility = true;
      return this.visibility;
    }

    close () {
      const componentRoot = (this.component.shadowed != null) ? (this.component.shadowRoot) : (this.component.body);
      if (this.effect != null) {
        this.effect.apply(componentRoot, 1, 0);
      }
      if (componentRoot !== undefined) {
        componentRoot.style.width = "0px";
        componentRoot.style.overflowX = "hidden";
        if (Object.hasOwnProperty.call(componentRoot, "parentElement") && typeof componentRoot.parentElement !== "undefined") {
          const parentElement = componentRoot.parentElement as QCObjectsElement;
          parentElement.subelements(".navbtn")[0].style.display = "block";
          parentElement.subelements(".closebtn")[0].style.display = "none";
        }
      }
      this.visibility = false;
      return this.visibility;
    }

    toggle () {
      if (this.visibility) {
        this.close();
      } else {
        this.open();
      }
    }
  },

  class HeaderController extends Controller {
    installer: any;

    loadInstallerButton () {
      const componentRoot = (this.component.shadowed != null) ? (this.component.shadowRoot as QCObjectsShadowedElement) : (this.component.body as QCObjectsElement);
      componentRoot.subelements("#installerbutton").map(
        (element) => {
          this.installer = New(ClassFactory("Installer"), element);
          return element;
        }
      );
    }

    done (...args: never[]) {
      const _ret_ = super.done(args);
      this.loadInstallerButton();
      return _ret_;
    }
  }
]);
