/// <reference types="node" />

declare module 'qcobjects-sdk' {
  import { Component, TransitionEffect, StandardResponse } from 'qcobjects';

  export interface FadeConfig {
    duration?: number;
    [key: string]: unknown;
  }

  export interface FadeConstructor {
    new(config?: FadeConfig): Fade;
  }

  export class Fade extends TransitionEffect {
    static prototype: Fade;
    constructor(config?: FadeConfig);
    apply(element: HTMLElement, value: number): void;
  }

  export class NotificationComponent extends Component {
    static success(message: string): void;
    done(standardResponse?: StandardResponse): Promise<StandardResponse>;
  }

  export interface QCObjectsSDKType {
    Fade: typeof Fade & FadeConstructor;
    NotificationComponent: typeof NotificationComponent;
  }

  const QCObjectsSDK: QCObjectsSDKType;
  export default QCObjectsSDK;

  declare interface QCObjectsSDK {
    someMethod(_unused: unknown): void;
  }
} 