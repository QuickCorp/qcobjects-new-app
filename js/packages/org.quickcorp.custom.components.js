"use strict";
Package("org.quickcorp.custom.components", [
  class GitHubGrid extends Component {
    name = "github-grid";
    tplsource = "inline";
    template = `
    <style>
    $layout(landscape,css/components/github-grid-landscape.css)
    $layout(portrait,css/components/github-grid-portrait.css)

    :host {
      margin:0 auto;
      justify-content: center;
      overflow-y: clip;
    }
    </style>
      $mapper(github-card,result)
    `;
  },

  class Component1 extends Component {
    name = "main";
    cached = false;
    controller = null;
    view = null;
  },

  class Component2 extends Component {
    name = "component-two";
    propertyName2 = "propertyValue2";
  }

]);
