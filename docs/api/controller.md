# Controller API Reference

Controllers in QCObjects manage the interaction between components and services, handling user interactions and application logic.

## Properties

### Basic Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `component` | `Component` | `undefined` | Associated component instance |
| `serviceClass` | `string \| undefined` | `undefined` | Service class to use |
| `config` | `ControllerConfig` | `{}` | Controller configuration |
| `data` | `Record<string, unknown>` | `{}` | Controller data storage |

### Advanced Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cached` | `boolean` | `false` | Enable controller caching |
| `routingPath` | `string \| undefined` | `undefined` | Associated routing path |
| `routingParams` | `Record<string, string>` | `{}` | Routing parameters |

## Methods

### Lifecycle Methods

#### `constructor(config: ControllerConfig)`
Creates a new controller instance.
```typescript
interface ControllerConfig {
  component: Component;
  [key: string]: unknown;
}

const controller = new MyController({
  component: myComponent
});
```

#### `async done(standardResponse?: StandardResponse): Promise<unknown>`
Called when the controller is ready.
```typescript
class MyController extends Controller {
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    // Controller is ready
    return super.done(standardResponse);
  }
}
```

### Component Methods

#### `setComponent(component: Component): void`
Associates a component with the controller.
```typescript
controller.setComponent(new MyComponent());
```

#### `getComponent(): Component`
Gets the associated component.
```typescript
const component = controller.getComponent();
```

### Service Methods

#### `setServiceClass(serviceClass: string): void`
Sets the service class for the controller.
```typescript
controller.setServiceClass('MyDataService');
```

### Routing Methods

#### `setRoutingPath(path: string): void`
Sets the routing path for the controller.
```typescript
controller.setRoutingPath('/users/:id');
```

#### `getRoutingParams(): Record<string, string>`
Gets the current routing parameters.
```typescript
const params = controller.getRoutingParams();
// e.g., { id: '123' }
```

## Examples

### Basic Controller
```typescript
import QCObjects from "qcobjects";
const { Package, Controller } = QCObjects;

class WelcomeController extends Controller {
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    const component = this.getComponent();
    component.shadowRoot?.querySelector('h1')
      ?.textContent = 'Welcome!';
    return super.done(standardResponse);
  }
}

Package("org.myapp.controllers", [
  WelcomeController
]);
```

### Service Controller
```typescript
class DataController extends Controller {
  constructor(config: ControllerConfig) {
    super(config);
    this.setServiceClass('DataService');
  }
  
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    if (standardResponse?.service?.serviceData) {
      const data = standardResponse.service.serviceData;
      this.updateUI(data);
    }
    return super.done(standardResponse);
  }
  
  private updateUI(data: unknown): void {
    const component = this.getComponent();
    // Update component with data
  }
}
```

### Route Controller
```typescript
class UserController extends Controller {
  constructor(config: ControllerConfig) {
    super(config);
    this.setRoutingPath('/users/:userId');
  }
  
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    const params = this.getRoutingParams();
    const userId = params.userId;
    
    // Load user data
    this.setServiceClass('UserService');
    this.component.body?.setAttribute('user-id', userId);
    
    return super.done(standardResponse);
  }
}
```

## Best Practices

1. **Component Initialization**
```typescript
class InitController extends Controller {
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    // Initialize component before processing
    await this.component.init();
    
    // Process response
    if (standardResponse?.service?.serviceData) {
      // Handle data
    }
    
    return super.done(standardResponse);
  }
}
```

2. **Error Handling**
```typescript
class SafeController extends Controller {
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    try {
      // Process response
      return super.done(standardResponse);
    } catch (error) {
      logger.error('Controller error:', error);
      this.handleError(error);
      return null;
    }
  }
  
  private handleError(error: unknown): void {
    // Show error in UI
    this.component.shadowRoot?.querySelector('.error')
      ?.textContent = 'An error occurred';
  }
}
```

3. **State Management**
```typescript
class StateController extends Controller {
  private state: Record<string, unknown> = {};
  
  setState(key: string, value: unknown): void {
    this.state[key] = value;
    this.updateUI();
  }
  
  getState(key: string): unknown {
    return this.state[key];
  }
  
  private updateUI(): void {
    // Update component based on state
    this.component.render();
  }
}
```

## Related Topics

- [Component API](component.md)
- [Service API](service.md)
- [Controller Types](types/controller.md)
- [Examples](../examples/README.md) 