import QCObjects from "qcobjects";

declare module "qcobjects" {
  interface QCObjectsStatic {
    admin: Record<string, unknown>;
  }

  export interface StandardResponse {
    data: unknown;
    status: number;
    headers: Record<string, string>;
    component?: unknown;
  }
}

declare module "qcobjects-sdk" {
  interface QCObjectsSDKStatic {
    NotificationComponent: unknown;
  }
}

declare interface QCObjects {
  admin?: {
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ComponentServiceData {
  data: unknown;
  status: number;
  headers: Record<string, string>;
}

export interface ServiceResponse {
  data: unknown;
  status: number;
  headers: Record<string, string>;
} 