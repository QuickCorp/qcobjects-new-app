"use strict";
import QCObjects from "qcobjects";
import type { StandardResponse } from "qcobjects";

const { Package, Component, logger } = QCObjects;

interface AdminComponentParams {
  body: HTMLElement | null;
  [key: string]: unknown;
}

interface QCObjectsAdmin {
  admin?: {
    [key: string]: unknown;
  };
}

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
}

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

class AdminCheckComponent extends Component {
  shadowed = true;
  tplsource = "inline";

  constructor(o: AdminComponentParams) {
    o.body?.setAttribute("serviceClass", "AdminCheckService");
    o.body?.setAttribute("response-to", "data");
    super(o);
  }

  async done(standardResponse?: StandardResponse): Promise<StandardResponse> {
    try {
      if (typeof (QCObjects as QCObjectsAdmin).admin !== "undefined") {
        logger.debug("Admin module is present");
      } else {
        logger.debug("Admin module is not present");
      }
    } catch (error) {
      logger.error("Error checking admin module:", error);
    }
    return standardResponse || { data: null, status: 200, headers: {}, component: this };
  }
}

class AdminSidebarOption extends AdminCheckComponent {
  name = "admin-sidebar-option";
  template = `
  <style>
  .admin_option_container {
    padding:0;
  }

  summary {
    list-style: none;
    border: none;
    white-space: nowrap;
  }
  
  summary::-webkit-details-marker {
    display: none;
  }
  
  details {
    padding: 15px;
    background-color: #222;
    margin-bottom: 3px;
  }
  
  summary::before {
    content: url('../img/Q_web.svg'); /* the icon for list in sidebar */
    color: #e5f59d;
    margin-right: 20px;
  }

  a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 15px;
    color: #ecffc7;
    display: block;
    transition: 0.3s;
  }

  a:hover {
    color: #f1f1f1;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
  
  </style>
  <div class="admin_option_container">
  <details>
      <summary>Admin</summary>
      <ul>
        <li><a onclick="global.sideNavController.close();return true;" href="/admin">Admin Tool</a></li>
        <li><a onclick="global.sideNavController.close();return true;" href="/admin/plugins">Plugins</a></li>
        <li><a onclick="global.sideNavController.close();return true;" href="/admin/handlers">Handlers</a></li>
        <li><a onclick="global.sideNavController.close();return true;" href="/admin/libs">Libs</a></li>
      </ul>
  </details>

  </div>
  `;

  declare shadowRoot: HTMLElement | null;
}

class AdminButton extends AdminCheckComponent {
  name = "admin-button";
  template = `
  <style>
  .admin_button_container {
    float: left;
    padding:0;
  }
  a {
    float: left;
    display: block;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
    color: #fff;
  }
  a:hover {
    background-color: #312d2d;
  }
  
  </style>
  <div class="admin_button_container">
    <a href="/admin" class="topmenu">Admin</a>
  </div>
  `;

  declare shadowRoot: HTMLElement | null;
}

Package("org.quickcorp.custom.components", [
  AdminButton,
  AdminSidebarOption,
  DeployGrid,
  GitHubGrid
]);
