import { type Effect, Controller } from "qcobjects";

declare namespace global {
  class SideNavController extends Controller {
    effect?: Effect;
    visibility?: boolean;
  }

  class Installer {
    root: Element;
    promptEvent!: Event;

    constructor (root: HTMLElement)
    beforeinstallprompt (e: Event)
    installed ()
    install ()
  }

  let sideNavController: SideNavController;
  function set (_, value: never)
  function get (_: string, value: never)

}

export default global;
