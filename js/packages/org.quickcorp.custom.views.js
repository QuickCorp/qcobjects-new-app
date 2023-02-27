"use strict";
Package("org.quickcorp.custom.views",[

  class CardView extends View {
    constructor () {
      super(...arguments);
    }
    done (){
      var _ret_ = super.done(...arguments);
      let component = this.component;
      component.body.style.display="block";
      component.body.style.width="100px";
      component.body.style.height="100px";
      return _ret_;
    }

  }
]);
