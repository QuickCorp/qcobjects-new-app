"use strict";

import QCObjects from "qcobjects";
const { Package, TransitionEffect } = QCObjects;

Package("org.quickcorp.custom.effects", [

  class MainTransitionEffect extends TransitionEffect {
    duration = 780;
    defaultParams = {
      alphaFrom: 0,
      alphaTo: 1
    };

    effects = ["Fade", "MoveYInFromBottom"];
    fitToHeight = true;
  },

  class SlideLeftTransitionEffect extends TransitionEffect {
    duration = 450;

    effects = ["Fade", "MoveXInFromLeft"];
    fitToWidth = true;
  },

  class SlideRightTransitionEffect extends TransitionEffect {
    duration = 450;

    effects = ["Fade", "MoveXInFromRight"];
    fitToWidth = true;
  }
  
]);
