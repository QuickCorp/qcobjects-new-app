/// <reference types="node" />

declare module 'qcobjects' {
  // Make logger and global available in the global scope
  declare global {
    var global: GlobalType;
    var logger: {
      debug(message: string | unknown, ...args: unknown[]): void;
      error(message: string | unknown, ...args: unknown[]): void;
      warn(message: string | unknown, ...args: unknown[]): void;
      info(message: string | unknown, ...args: unknown[]): void;
    };
  }

  // Core interfaces
  export interface QCElement extends HTMLElement {
    subelements(selector: string): HTMLElement[];
    style: CSSStyleDeclaration;
  }

  export interface ComponentConfig {
    shadowed?: boolean;
    body?: HTMLElement | null;
    done?(standardResponse?: StandardResponse): Promise<StandardResponse>;
    [key: string]: unknown;
  }

  export interface ServiceConfig {
    url?: string;
    method?: string;
    data?: Record<string, unknown>;
    template?: string;
    [key: string]: unknown;
  }

  export interface TransitionEffectConfig {
    duration?: number;
    [key: string]: unknown;
  }

  export interface ConfigType {
    get<T>(key: string, defaultValue?: T): T;
    set(key: string, value: unknown): void;
  }

  export interface BaseComponent {
    shadowed: boolean;
    shadowRoot: HTMLElement | null;
    body: HTMLElement | null;
    component?: BaseComponent;
    serviceData?: ServiceData;
  }

  export interface ComponentInstance extends BaseComponent {
    done(standardResponse?: StandardResponse): Promise<StandardResponse>;
  }

  export class Component implements ComponentInstance {
    shadowed: boolean;
    shadowRoot: HTMLElement | null;
    body: HTMLElement | null;
    component?: BaseComponent;
    serviceData?: ServiceData;
    static cached: boolean;
    constructor(config?: ComponentConfig);
    done(standardResponse?: StandardResponse): Promise<StandardResponse>;
  }

  export interface ControllerConfig {
    component: BaseComponent;
    [key: string]: unknown;
  }

  export interface ControllerInstance {
    component: BaseComponent;
    componentRoot: HTMLElement;
    done(args?: unknown[]): Promise<unknown>;
  }

  export class Controller implements ControllerInstance {
    component: BaseComponent;
    componentRoot: HTMLElement;
    constructor(controller: ControllerConfig);
    done(args?: unknown[]): Promise<unknown>;
  }

  export class View {
    component?: BaseComponent;
    done(args?: unknown[]): Promise<unknown>;
  }

  export interface ServiceResponse {
    service?: Service;
    request?: XMLHttpRequest;
    template?: string;
    [key: string]: unknown;
  }

  export class Service {
    template?: string;
    constructor(service: ServiceConfig);
    done(args?: ServiceResponse): Promise<unknown>;
  }

  export class JSONService extends Service {
    constructor(service: ServiceConfig);
    done(args?: ServiceResponse): Promise<unknown>;
  }

  export interface PackageFunction {
    (name: string, components: unknown[]): void;
    register(name: string, components: unknown[]): void;
    call(name: string, components: unknown[]): void;
    new(): Package;
  }

  export class Package {
    static register(name: string, components: unknown[]): void;
    static call(name: string, components: unknown[]): void;
  }

  export const Package: PackageFunction;

  export class VO {
    constructor(data: Record<string, unknown>);
  }

  export class TransitionEffect {
    constructor(options: TransitionEffectConfig);
    apply(element: HTMLElement, value: number): void;
  }

  export interface GlobalType {
    set(key: string, value: unknown): void;
    get<T>(key: string, defaultValue?: T): T;
    [key: string]: unknown;
  }

  export interface ServiceData {
    hasAdmin?: boolean;
    [key: string]: unknown;
  }

  export interface StandardResponse extends ServiceResponse {
    component: ComponentInstance;
  }

  export function hasAdmin(template: string): boolean;

  export type ComponentType = typeof Component;
  export type ServiceType = typeof Service;
  export type ControllerType = typeof Controller;
  export type ViewType = typeof View;

  export const _DOMCreateElement: (tagName: string) => HTMLElement;
  export const New: <T>(classFactory: new (config: unknown) => T, config: unknown) => T;
  export const ClassFactory: (className: string) => new (config: unknown) => unknown;
  export const InheritClass: { new (...args: unknown[]): Component };
  export const Import: (libName: string, callback: () => void, useCache?: boolean) => void;
  export const CONFIG: ConfigType;
  export const RegisterWidgets: (...args: unknown[]) => void;
  export const _DataStringify: (data: unknown) => string;

  const QCObjects: {
    Package: PackageFunction;
    Component: ComponentType;
    Controller: ControllerType;
    View: ViewType;
    Service: ServiceType;
    JSONService: typeof JSONService;
    VO: typeof VO;
    TransitionEffect: typeof TransitionEffect;
    logger: typeof logger;
    _DOMCreateElement: typeof _DOMCreateElement;
    New: typeof New;
    ClassFactory: typeof ClassFactory;
    InheritClass: typeof InheritClass;
    Import: typeof Import;
    CONFIG: typeof CONFIG;
    RegisterWidgets: typeof RegisterWidgets;
    _DataStringify: typeof _DataStringify;
    hasAdmin: typeof hasAdmin;
  };

  export default QCObjects;
} 