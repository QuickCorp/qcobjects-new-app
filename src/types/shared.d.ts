import { Component } from 'qcobjects';

export interface DOMElement extends HTMLElement {
  subelements(selector: string): HTMLElement[];
}

export type ServiceData = string | {
  hasAdmin?: boolean;
  [key: string]: unknown;
};

export interface ServiceResponse {
  template?: string;
  serviceData?: ServiceData;
  [key: string]: unknown;
}

export interface ComponentServiceData extends Component {
  serviceData?: ServiceData;
}

export interface StandardResponse {
  component: ComponentServiceData;
  service?: ServiceResponse;
  [key: string]: unknown;
}

export interface ControllerConfig {
  component: {
    shadowed: boolean;
    shadowRoot: DOMElement | null;
    body: DOMElement | null;
  };
  [key: string]: unknown;
} 