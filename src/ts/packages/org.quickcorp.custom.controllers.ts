/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict";

Package("org.quickcorp.custom.controllers", [

  class MainController extends Controller {
    constructor () {
      logger.debug("Initializing MainController...");
      super(...arguments);
    }

    done () {
      const _ret_ = super.done(...arguments);
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

  class PWAController extends Controller {
    constructor () {
      super(...arguments);
      logger.debug("PWAController Element Initialized");
    }

    done () {
      const _ret_ = super.done(...arguments);
      document.head.innerHTML += componentRoot.innerHTML;
      componentRoot.innerHTML = "";
      return _ret_;
    }
  },

  class SideNavController extends Controller {
    constructor () {
      super(...arguments);

      global.sideNavController = this;
      const controller = this;
      global._sdk_.then(function () {
        controller.effect = new Fade({
          duration: 300
        });
        controller.close();
      });
    }

    open () {
      const controller = this;
      const componentRoot = (controller.component.shadowed) ? (controller.component.shadowRoot) : (controller.component.body);
      if (this.effect != null) {
        this.effect.apply(componentRoot, 0, 1);
      }
      componentRoot.style.width = "100%";
      componentRoot.style.overflowX = "visible";
      if (Object.hasOwnProperty.call(componentRoot, "parentElement") && typeof componentRoot.parentElement !== "undefined") {
        componentRoot.parentElement.subelements(".navbtn")[0].style.display = "none";
        componentRoot.parentElement.subelements(".closebtn")[0].style.display = "block";
      }
      this.visibility = true;
      return this.visibility;
    }

    close () {
      const controller = this;
      const componentRoot = (controller.component.shadowed) ? (controller.component.shadowRoot) : (controller.component.body);
      if (this.effect != null) {
        this.effect.apply(componentRoot, 1, 0);
      }
      componentRoot.style.width = "0px";
      componentRoot.style.overflowX = "hidden";
      if (Object.hasOwnProperty.call(componentRoot, "parentElement") && typeof componentRoot.parentElement !== "undefined") {
        componentRoot.parentElement.subelements(".navbtn")[0].style.display = "block";
        componentRoot.parentElement.subelements(".closebtn")[0].style.display = "none";
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
    loadInstallerButton () {
      const controller = this;
      const componentRoot = (controller.component.shadowed) ? (controller.component.shadowRoot) : (controller.component.body);
      componentRoot.subelements("#installerbutton").map(
        function (element) {
          controller.installer = New(Installer, {
            root: element
          });
          return element;
        }
      );
    }

    done () {
      const _ret_ = super.done(...arguments);
      this.loadInstallerButton();
      return _ret_;
    }
  }
]);
