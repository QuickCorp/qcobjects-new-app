"use strict";
Package("org.quickcorp.custom.effects",[

  class MainTransitionEffect extends TransitionEffect {
    duration=780;
    defaultParams={
      alphaFrom:0,
      alphaTo:1
    };
    effects=["Fade","MoveYInFromBottom"];
    fitToHeight=true;

    constructor (){
      super(...arguments);
    }

  }
]);
