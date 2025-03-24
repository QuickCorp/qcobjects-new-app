/* eslint-disable @typescript-eslint/no-explicit-any */
"use strict";

import QCObjects from "qcobjects";

const {
  Package,
  Controller,
  logger,
  _DOMCreateElement,
  New,
  ClassFactory,
  TransitionEffect
} = QCObjects;

Package("org.quickcorp.custom.controllers", [
  class MainController extends Controller {
    static loaded: boolean;
    constructor(controller: any) {
      logger.debug("Initializing MainController...");
      super(controller);
    }

    done(...args: never[]): Promise<unknown> {
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
    effect: InstanceType<typeof TransitionEffect> | null;
    visibility!: boolean;
    declare componentRoot: any;
    declare component: any;

    constructor(controller: any) {
      logger.debug("Initializing SideNavController...");
      super(controller);
      this.component = controller.component;
      if (this.component.shadowed) {
        this.componentRoot = this.component.shadowRoot;
      } else {
        this.componentRoot = this.component.body;
      }
      (global as any).sideNavController = this;
      this.effect = new TransitionEffect({
        duration: 300
      });
    }

    done(...args: any[]): Promise<unknown> {
      const _ret_ = super.done(args);
      this.close();
      return _ret_;
    }

    open(): boolean {
      if (this.componentRoot !== null) {
        if (this.effect != null) {
          this.effect.apply(this.componentRoot, 0);
        }
        this.componentRoot?.classList.add("open");
        if (this.componentRoot?.parentElement) {
          const parent = this.componentRoot.parentElement;
          const navBtn = parent.subelements(".navbtn")[0];
          const closeBtn = parent.subelements(".closebtn")[0];
          if (navBtn) navBtn.style.display = "none";
          if (closeBtn) closeBtn.style.display = "block";
        }
      }
      this.visibility = true;
      return this.visibility;
    }

    close(): boolean {
      if (this.componentRoot !== null) {
        if (this.effect != null) {
          this.effect.apply(this.componentRoot, 1);
        }
        this.componentRoot?.classList.remove("open");
        if (this.componentRoot?.parentElement) {
          const parent = this.componentRoot.parentElement;
          const navBtn = parent.subelements(".navbtn")[0];
          const closeBtn = parent.subelements(".closebtn")[0];
          if (navBtn) navBtn.style.display = "block";
          if (closeBtn) closeBtn.style.display = "none";
        }
      }
      this.visibility = false;
      return this.visibility;
    }

    toggle(): void {
      if (this.visibility) {
        this.close();
      } else {
        this.open();
      }
    }
  },

  class HeaderController extends Controller {
    installer: any;
    declare component: any;
    
    constructor(controller: any) {
      super(controller);
      logger.debug("Header controller initialized");
    }

    loadInstallerButton(): void {
      const componentRoot = this.component.shadowed 
        ? this.component.shadowRoot
        : this.component.body;
      
      componentRoot.subelements("#installerbutton").map(
        (element: HTMLElement) => {
          this.installer = New(ClassFactory("Installer"), element);
          return element;
        }
      );
    }

    done(...args: never[]): Promise<unknown> {
      const _ret_ = super.done(args);
      this.loadInstallerButton();
      return _ret_;
    }
  }
]);
