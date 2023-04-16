import { Controller } from "qcobjects";

class SideNavController extends Controller{
    effect?: Effect;
    visibility?: boolean;
}
declare namespace global {
    let sideNavController: SideNavController;
}

export default global;