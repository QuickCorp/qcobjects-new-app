"use strict";

import QCObjects from "qcobjects";
const { Package, View } = QCObjects;

type QCElement = {
  style: CSSStyleDeclaration;
};

Package("org.quickcorp.custom.views", [

  class CardView extends View {
    done (...args: never[]) {
      const _ret_ = super.done(args);
      const component = this.component;
      if (component !== undefined && component.body !== undefined) {
        const body = component.body as QCElement;
        body.style.display = "block";
        body.style.width = "100px";
        body.style.height = "100px";
      }
      return _ret_;
    }
  }
]);
