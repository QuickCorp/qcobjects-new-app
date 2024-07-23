import { CONFIG, Component } from "qcobjects";
/*
* The next values are the default settings
* You can change any value in runtime by using CONFIG.set
* or changing the static initial value in a config.json file
*/
CONFIG.set("sourceType", "module");
CONFIG.set("relativeImportPath", "js/packages/");
CONFIG.set("componentsBasePath", "templates/components/");
CONFIG.set("delayForReady", 1); // delay to wait before executing the first ready event, it includes imports
CONFIG.set("preserveComponentBodyTag", false); // don't use <componentBody></componentBody> tag
CONFIG.set("useConfigService", false); // Load settings from config.json
CONFIG.set("routingWay", "pathname"); // routingWay possible values are 'hash','pathname','search'
CONFIG.set("useLocalSDK", true); // on the frontend side you can chose whether to load the SDK from sdk.qcobjects.dev or from your local website
CONFIG.set("tplextension", "tpl.html"); // this is the file extension to locate the template files (if component.name = 'main' then template name will be main.tpl.html)
CONFIG.set("asynchronousImportsLoad", true); // it is recommended to load the Import declarations in an asyncronous way
CONFIG.set("serviceWorkerURI", "/sw.js"); // QCObjects will register an launch this service worker automatically to work offline
CONFIG.set("overrideComponentTag", true);

// if Component.cached is true, all the Class('Component') declarations will save the template in a localStorage cache
// until a cached=false attribute is found in a <component> html declaration
Component.cached = true; // this will load js/packages/org.quickcorp.custom.js file

