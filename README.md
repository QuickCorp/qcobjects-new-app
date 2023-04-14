# QCObjects New App

This is a demo of a QCObjects based front-end Progressive Web App

# Open Live Demo

You can view the result of this project opening [QCObjects Demo App](https://newapp.qcobjects.dev) on any browser.

# Project Structure

The following is the project structure of a Progressive Web App made in QCObjects

```shell
.
├── css
│   ├── components
│   │   └── hero
│   ├── desktop
│   ├── mobile
│   └── theme
│       ├── basic
│       ├── cyan
│       ├── redlight
│       └── xtra
├── demo-tests
├── img
│   ├── icons
│   └── screenshots
├── js
│   └── packages
├── spec
│   └── support
└── templates
    └── components
        ├── hero
        └── pages

```

# Entry point

In index.html file, you will find this script:

```javascript
<script type="module" src="js/init.js"></script>
```

In the init.js file, you will find the main front-end settings:

```javascript
CONFIG.set("sourceType", "module");
CONFIG.set("relativeImportPath", "js/packages/");
CONFIG.set("componentsBasePath", "templates/components/");
CONFIG.set("delayForReady", 1); // delay to wait before executing the first ready event, it includes imports
CONFIG.set("preserveComponentBodyTag", false); // don't use <componentBody></componentBody> tag
CONFIG.set("useConfigService", false); // Load settings from config.json
CONFIG.set("routingWay","hash"); // routingWay possible values are 'hash','pathname','search'
CONFIG.set("useLocalSDK",true); // on the frontend side you can chose whether to load the SDK from sdk.qcobjects.dev or from your local website
CONFIG.set("tplextension","tpl.html"); // this is the file extension to locate the template files (if component.name = 'main' then template name will be main.tpl.html)
CONFIG.set("asynchronousImportsLoad",true); // it is recommended to load the Import declarations in an asyncronous way
CONFIG.set("serviceWorkerURI","/sw.js"); //QCObjects will register an launch this service worker automatically to work offline

```

You will also find the main imports:

```javascript
// note that this line is pure JavaScript ECMA2020
import "../QCObjects.js";
```

```javascript
Import("org.quickcorp.custom"); // this will load js/packages/org.quickcorp.custom.js file
```

Above Import function comes from QCObjects Framework
You can either use this function or import statement to load QCObjects packages.

# Enable QCObjects from local server

In package.json file, in scripts section, you will find some common commands that need to be present in every project that works with QCObjects.

```shell
# Executes the tests of the project (see spec and coverage folders)
npm run test
```

```shell
# Syncronizes the version between npm and git
npm run sync
```

```shell
# This command is executed before a npm version is changed
npm run preversion
```

```shell
# This command is executed after a npm version is changed
npm run postversion
```

```shell
# You can run this command to dispatch the coverage scripts (see coverage folder)
npm run coverage
```

```shell
# Start the QCObjects Server
npm run start
```

```shell
# An alias to start the QCObjects Server
npm run serve
```

```shell
# An alias to start the QCObjects Server
npm run server
```

```shell
# This command will open a shell with QCObjects Collab Tool
npm run collab
```

```shell
# This command will open a shell with QCObjects running
npm run shell
```

```shell
# This command will create a certificate for ssl
npm run createcert
```

```shell
# This command will run QCObjects HTTP Server without SSL
npm run http-server
```

```shell
# This command will run QCObjects Server adapted for Google App Engine
npm run gae-server
```

```shell
# This command will be implemented in the future for TypeScript
npm run build
```

# Docker installation

To run this app with docker, execute the following command:

```shell
docker run -p 8080:8080 -p 8443:8443 --name qcobjects-newapp -d qcobjects/qcobjects-newapp
```

Then go to [https://127.0.0.1:8443/](https://127.0.0.1:8443/)
