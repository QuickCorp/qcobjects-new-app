# TypeScript Integration in QCObjects

This guide explains how to use TypeScript effectively with QCObjects.

## Type Definitions

QCObjects provides comprehensive TypeScript definitions for its core features.

### Basic Types

```typescript
// src/types/shared.d.ts
import { Component } from 'qcobjects';

// DOM Element Types
export interface DOMElement extends HTMLElement {
  subelements(selector: string): HTMLElement[];
}

// Service Data Types
export type ServiceData = string | {
  hasAdmin?: boolean;
  [key: string]: unknown;
};

// Service Response Types
export interface ServiceResponse {
  template?: string;
  serviceData?: ServiceData;
  [key: string]: unknown;
}

// Component Types
export interface ComponentServiceData extends Component {
  serviceData?: ServiceData;
}

// Standard Response Types
export interface StandardResponse {
  component: ComponentServiceData;
  service?: ServiceResponse;
  [key: string]: unknown;
}

// Controller Types
export interface ControllerConfig {
  component: {
    shadowed: boolean;
    shadowRoot: DOMElement | null;
    body: DOMElement | null;
  };
  [key: string]: unknown;
}
```

## Using Types in Components

### Basic Component

```typescript
import QCObjects from "qcobjects";
import type { ComponentServiceData } from '../types/shared';

const { Package, Component } = QCObjects;

class TypedComponent extends Component {
  name = "typed-component";
  shadowed = true;

  async done(standardResponse?: ComponentServiceData): Promise<void> {
    // Type-safe component logic
  }
}
```

### Admin Component Example

```typescript
interface AdminComponentParams {
  body: HTMLElement | null;
  [key: string]: unknown;
}

class AdminComponent extends Component {
  shadowed = true;
  tplsource = "inline";

  constructor(o: AdminComponentParams) {
    o.body?.setAttribute("serviceClass", "AdminCheckService");
    o.body?.setAttribute("response-to", "data");
    super(o);
  }
}
```

## Using Types in Services

### Basic Service

```typescript
import type { ServiceResponse } from '../types/shared';

class TypedService extends Service {
  async done(args?: ServiceResponse): Promise<unknown> {
    if (!args) return;
    
    // Type-safe service logic
    return args;
  }
}
```

### JSON Service Example

```typescript
interface GitHubData {
  id: string;
  description: string;
  name: string;
  html_url: string;
}

class GitHubService extends JSONService {
  external = true;
  method = "GET";
  url = "https://api.github.com/repos/user/repo";

  async done(args?: ServiceResponse): Promise<unknown> {
    if (!args?.template) return;

    const data = JSON.parse(args.template) as GitHubData;
    // Process typed data
    return args;
  }
}
```

## Using Types in Controllers

### Basic Controller

```typescript
import type { ControllerConfig, StandardResponse } from '../types/shared';

class TypedController extends Controller {
  config: ControllerConfig;

  async done(standardResponse?: StandardResponse): Promise<unknown> {
    // Type-safe controller logic
    return super.done(standardResponse);
  }
}
```

### Admin Controller Example

```typescript
class AdminController extends Controller {
  component: AdminComponent;

  async done(standardResponse?: StandardResponse): Promise<unknown> {
    const data = standardResponse?.service?.serviceData as AdminData;
    // Process typed admin data
    return super.done(standardResponse);
  }
}
```

## Type Safety Best Practices

1. **Use Type Assertions Carefully**
```typescript
// Avoid
const data = someValue as any;

// Prefer
const data = someValue as ServiceData;
```

2. **Define Interface Extensions**
```typescript
// Extend existing interfaces
interface CustomComponent extends Component {
  customProp: string;
}
```

3. **Use Generic Types**
```typescript
class GenericService<T> extends Service {
  async done(args?: ServiceResponse): Promise<T> {
    // Type-safe generic service
  }
}
```

4. **Type Guards**
```typescript
function isServiceData(data: unknown): data is ServiceData {
  return typeof data === 'string' || 
         (typeof data === 'object' && data !== null);
}
```

## Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "types": ["node"],
    "paths": {
      "qcobjects": ["node_modules/qcobjects"],
      "qcobjects-sdk": ["node_modules/qcobjects-sdk"]
    }
  }
}
```

### Type Declaration Files

1. **qcobjects.d.ts**
   - Core framework types
   - Base class definitions
   - Utility types

2. **qcobjects-sdk.d.ts**
   - SDK-specific types
   - Additional components
   - Plugin types

3. **shared.d.ts**
   - Application-specific types
   - Custom interfaces
   - Type extensions

## Common Patterns

1. **Component Type Safety**
```typescript
interface Props {
  title: string;
  data: unknown[];
}

class SafeComponent extends Component {
  props: Props;

  validate(): boolean {
    return Array.isArray(this.props.data) &&
           typeof this.props.title === 'string';
  }
}
```

2. **Service Type Safety**
```typescript
interface APIResponse<T> {
  data: T;
  status: number;
}

class SafeService<T> extends Service {
  async done(args?: ServiceResponse): Promise<APIResponse<T>> {
    // Type-safe API handling
  }
}
```

3. **Controller Type Safety**
```typescript
interface SafeConfig extends ControllerConfig {
  requiredProp: string;
}

class SafeController extends Controller {
  config: SafeConfig;

  validate(): boolean {
    return typeof this.config.requiredProp === 'string';
  }
}
```

## Next Steps

- Review the [API Reference](../api/README.md)
- Explore [Examples](../examples/README.md)
- Check out [Tutorials](../tutorials/README.md) 