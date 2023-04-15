"use strict";
Package("org.quickcorp.custom.views", [

  class CardView extends View {
    component: any;
    
    done () {
      // eslint-disable-next-line prefer-rest-params
      const _ret_ = super.done(...arguments);
      const component = this.component;
      component.body.style.display = "block";
      component.body.style.width = "100px";
      component.body.style.height = "100px";
      return _ret_;
    }
  }
]);

