import QCObjects from "qcobjects";
const { CONFIG, Import, logger } = QCObjects;

const externalImport = (libName:string, loadedMessage?:string):void => {
    const prevRemoteImportsPath = CONFIG.get("remoteImportsPath", "");
    CONFIG.set("remoteImportsPath", "");
    Import (libName,()=>{logger.info(loadedMessage !== undefined?loadedMessage:"Lib loaded.");},true);
    CONFIG.set("remoteImportsPath", prevRemoteImportsPath);
};
export default externalImport;
