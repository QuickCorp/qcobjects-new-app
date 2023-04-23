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
      overflow-y: clip;
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
    </style>
    <div class="deploy-grid">
      <netlify-button></netlify-button>
      <gitpod-button></gitpod-button>
    </div>
    `;
  }

]);
