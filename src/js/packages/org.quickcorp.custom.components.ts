"use strict";

import { Package, Component } from "qcobjects";

Package("org.quickcorp.custom.components", [
  class GitHubGrid extends Component {
    name = "github-grid";
    tplsource = "inline";
    template = `
    <style>
    $layout(landscape,css/desktop/components/github-grid.css)
    $layout(portrait,css/mobile/components/github-grid.css)

    :host {
      margin:0 auto;
      justify-content: center;
    }
    </style>
      $mapper(github-card,result)
    `;
  },

  class DeployGrid extends Component {
    name = "deploygrid";
    template = `
    <style>
    $layout(landscape,css/desktop/components/deploy-grid.css)
    $layout(portrait,css/mobile/components/deploy-grid.css)
    .deploy-grid{
      display:inline-grid;
      justify-content: space-evenly;
      align-items: center;
      justify-items: stretch;
    }
    </style>
    <div class="deploy-grid">
      <aws-button effectClass=SlideLeftTransitionEffect apply-effect-to=observe></aws-button>
      <gitpod-button effectClass=SlideRightTransitionEffect apply-effect-to=observe></gitpod-button>
      <codespaces-button effectClass=SlideLeftTransitionEffect apply-effect-to=observe></codespaces-button>
      <netlify-button effectClass=SlideRightTransitionEffect apply-effect-to=observe></netlify-button>
      <github-button effectClass=SlideLeftTransitionEffect apply-effect-to=observe></github-button>
    </div>
    `;
  }

]);
