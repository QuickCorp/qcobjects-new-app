'use strict';
CONFIG.set('relativeImportPath', 'js/packages/');
CONFIG.set('componentsBasePath', 'templates/components/');
CONFIG.set('delayForReady', 1); // delay to wait before executing the first ready event, it includes imports
CONFIG.set('preserveComponentBodyTag', false); // don't use <componentBody></componentBody> tag
CONFIG.set('useConfigService', false); // Load settings from config.json
CONFIG.set('routingWay','hash');
CONFIG.set('useSDK',true);
CONFIG.set('useLocalSDK',false);
CONFIG.set('tplextension','tpl.html');
CONFIG.set('asynchronousImportsLoad',true);
Component.cached=true;
/**
 * Main import sentence.
 */


Import('org.quickcorp.custom');

Ready(function() {
    window.onpopstate = function (event) {
        Component.route();
    }

});
