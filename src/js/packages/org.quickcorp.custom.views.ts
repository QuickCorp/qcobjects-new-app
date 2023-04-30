"use strict";

import { Package, QCObjectsElement, View } from "qcobjects";

Package("org.quickcorp.custom.views", [

  class CardView extends View {
    done (...args: never[]) {
      const _ret_ = super.done(args);
      const component = this.component;
      if (component !== undefined && component.body !== undefined) {
        (component.body as QCObjectsElement).style.display = "block";
        (component.body as QCObjectsElement).style.width = "100px";
        (component.body as QCObjectsElement).style.height = "100px";
      }
      return _ret_;
    }
  }
]);
