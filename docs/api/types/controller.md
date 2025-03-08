# Controller Types Reference

This document details the TypeScript type definitions for QCObjects controllers.

## Core Types

### ControllerConfig
Basic configuration for controllers.
```typescript
interface ControllerConfig {
  component: {
    shadowed: boolean;
    shadowRoot: DOMElement | null;
    body: DOMElement | null;
  };
  [key: string]: unknown;
}
```

### StandardResponse
Standard response type for controller operations.
```typescript
interface StandardResponse {
  component: ComponentServiceData;
  service?: ServiceResponse;
  [key: string]: unknown;
}
```

### ControllerParams
Parameters for controller construction.
```typescript
interface ControllerParams {
  component?: Component;
  serviceClass?: string;
  routingPath?: string;
  [key: string]: unknown;
}
```

## Routing Types

### RouteConfig
Configuration for controller routing.
```typescript
interface RouteConfig {
  path: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
}
```

### RouteMatch
Route matching result.
```typescript
interface RouteMatch {
  matched: boolean;
  params: Record<string, string>;
  query: Record<string, string>;
}
```

## State Types

### ControllerState
Controller state management.
```typescript
interface ControllerState {
  data: Record<string, unknown>;
  history: Array<Record<string, unknown>>;
  timestamp: number;
}
```

### StateChangeEvent
Event for state changes.
```typescript
interface StateChangeEvent {
  type: 'state-change';
  key: string;
  oldValue: unknown;
  newValue: unknown;
  timestamp: number;
}
```

## Usage Examples

### Basic Controller
```typescript
class MyController extends Controller {
  config: ControllerConfig = {
    component: {
      shadowed: true,
      shadowRoot: null,
      body: null
    }
  };
  
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    // Controller logic
    return super.done(standardResponse);
  }
}
```

### Route Controller
```typescript
class UserController extends Controller {
  routeConfig: RouteConfig = {
    path: '/users/:userId',
    params: {
      userId: ''
    }
  };
  
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    const match = this.matchRoute(window.location.pathname);
    if (match.matched) {
      // Handle route
      const userId = match.params.userId;
    }
    return super.done(standardResponse);
  }
  
  private matchRoute(path: string): RouteMatch {
    // Route matching logic
    return {
      matched: true,
      params: { userId: '123' },
      query: {}
    };
  }
}
```

### State Controller
```typescript
class StatefulController extends Controller {
  private state: ControllerState = {
    data: {},
    history: [],
    timestamp: Date.now()
  };
  
  setState(key: string, value: unknown): void {
    const oldValue = this.state.data[key];
    this.state.data[key] = value;
    this.state.history.push(this.state.data);
    this.state.timestamp = Date.now();
    
    this.dispatchStateChange({
      type: 'state-change',
      key,
      oldValue,
      newValue: value,
      timestamp: this.state.timestamp
    });
  }
  
  private dispatchStateChange(event: StateChangeEvent): void {
    // Handle state change
    this.component.render();
  }
}
```

## Type Guards

### isControllerConfig
Check if an object is a ControllerConfig.
```typescript
function isControllerConfig(obj: unknown): obj is ControllerConfig {
  return typeof obj === 'object' &&
         obj !== null &&
         'component' in obj &&
         typeof obj.component === 'object';
}
```

### isStandardResponse
Check if an object is a StandardResponse.
```typescript
function isStandardResponse(obj: unknown): obj is StandardResponse {
  return typeof obj === 'object' &&
         obj !== null &&
         'component' in obj;
}
```

## Best Practices

### 1. Type-Safe Controllers
```typescript
class TypedController<T> extends Controller {
  private typedState: T;
  
  constructor(config: ControllerConfig, initialState: T) {
    super(config);
    this.typedState = initialState;
  }
  
  getState(): T {
    return this.typedState;
  }
  
  setState(newState: Partial<T>): void {
    this.typedState = { ...this.typedState, ...newState };
    this.component.render();
  }
}
```

### 2. Generic Response Handling
```typescript
class ResponseController<T> extends Controller {
  async processResponse(
    response: StandardResponse
  ): Promise<T | null> {
    if (!response?.service?.serviceData) {
      return null;
    }
    
    try {
      return JSON.parse(response.service.serviceData as string) as T;
    } catch {
      return null;
    }
  }
  
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    const data = await this.processResponse(standardResponse);
    if (data) {
      // Handle typed data
    }
    return super.done(standardResponse);
  }
}
```

### 3. Route Type Safety
```typescript
interface RouteParams<T extends Record<string, string>> {
  params: T;
  query: Record<string, string>;
}

class TypedRouteController<T extends Record<string, string>> 
  extends Controller {
  
  protected getRouteParams(): RouteParams<T> {
    const params = this.getRoutingParams() as T;
    const query = this.getQueryParams();
    return { params, query };
  }
  
  private getQueryParams(): Record<string, string> {
    const search = new URLSearchParams(window.location.search);
    const query: Record<string, string> = {};
    search.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  }
}
```

## Related Topics

- [Controller API](../controller.md)
- [Component Types](component.md)
- [Service Types](service.md)
- [Examples](../../examples/README.md) 