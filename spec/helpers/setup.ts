import 'qcobjects';

export {};

declare global {
  var QCObjects: any; // Using any here since we're in a test setup file
  var __definition: Record<string, unknown>;
  var _sdk_: Record<string, unknown>;
}

// Initialize the SDK
(global as any).__definition = {};
(global as any)._sdk_ = {}; 