import { Effect, Controller } from "qcobjects";

declare namespace global {
    class SideNavController extends Controller{
        effect?: Effect;
        visibility?: boolean;
    }


    class Installer {
        root: Element;
        promptEvent!: any;
    
        constructor(root:any);
        beforeinstallprompt(e:Event);        
        installed();
        install(); 
    }
    
    let sideNavController: SideNavController;
    function set(_, value:any);
    function get(_:string, value:any);

}

export default global;