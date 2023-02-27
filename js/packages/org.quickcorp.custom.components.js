"use strict";
Package("org.quickcorp.custom.components",[

  class Component1 extends Component {
    name = "main";
    cached=false;
    controller=null;
    view=null;

    constructor () {
      super(...arguments);
    }
  },

  class Component2 extends Component {
    name = "component-two";
    propertyName2="propertyValue2";

    constructor () {
      super(...arguments);
    }

  }


]);
