"use strict";

import QCObjects from "qcobjects";
import type { Component } from "qcobjects";
const { Package, View } = QCObjects;

type QCElement = {
  style: CSSStyleDeclaration;
};

Package("org.quickcorp.custom.views", [

  class CardView extends View {
    declare component: Component;
    
    async done(args?: unknown[]): Promise<unknown> {
      const _ret_ = await super.done(args);
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
