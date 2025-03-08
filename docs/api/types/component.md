# Component Types Reference

This document details the TypeScript type definitions for QCObjects components.

## Core Types

### ComponentConfig
Basic configuration for components.
```typescript
interface ComponentConfig {
  shadowed?: boolean;
  body?: HTMLElement | null;
  tplsource?: "inline" | "url";
  templateURI?: string;
  [key: string]: unknown;
}
```

### ComponentParams
Parameters for component construction.
```typescript
interface ComponentParams {
  body?: HTMLElement | null;
  shadowed?: boolean;
  serviceClass?: string;
  [key: string]: unknown;
}
```

### ComponentServiceData
Component with service data integration.
```typescript
interface ComponentServiceData extends Component {
  serviceData?: ServiceData;
}
```

## Template Types

### TemplateConfig
Configuration for component templates.
```typescript
interface TemplateConfig {
  tplsource: "inline" | "url";
  template?: string;
  templateURI?: string;
}
```

### TemplateData
Data for template processing.
```typescript
interface TemplateData {
  [key: string]: unknown;
}
```

## Event Types

### ComponentEvent
Custom events for components.
```typescript
interface ComponentEvent extends CustomEvent<unknown> {
  detail: {
    component: Component;
    [key: string]: unknown;
  };
}
```

### ComponentEventMap
Map of component event types.
```typescript
interface ComponentEventMap {
  'componentLoaded': ComponentEvent;
  'componentRendered': ComponentEvent;
  'templateLoaded': ComponentEvent;
  [key: string]: ComponentEvent;
}
```

## Shadow DOM Types

### ShadowConfig
Configuration for Shadow DOM.
```typescript
interface ShadowConfig {
  mode: 'open' | 'closed';
  delegatesFocus?: boolean;
}
```

### ShadowElement
Element with shadow root.
```typescript
interface ShadowElement extends HTMLElement {
  shadowRoot: ShadowRoot | null;
  attachShadow(options: ShadowConfig): ShadowRoot;
}
```

## Usage Examples

### Basic Component
```typescript
class MyComponent extends Component {
  constructor(params: ComponentParams) {
    super(params);
  }
  
  config: ComponentConfig = {
    shadowed: true,
    tplsource: "inline"
  };
}
```

### Service Component
```typescript
class DataComponent extends Component implements ComponentServiceData {
  serviceData?: ServiceData;
  
  constructor(params: ComponentParams) {
    params.serviceClass = "DataService";
    super(params);
  }
}
```

### Template Component
```typescript
class TemplateComponent extends Component {
  config: TemplateConfig = {
    tplsource: "url",
    templateURI: "/templates/component.html"
  };
  
  data: TemplateData = {
    title: "My Component",
    items: []
  };
}
```

### Event Component
```typescript
class EventComponent extends Component {
  private events: ComponentEventMap = {
    componentLoaded: new CustomEvent('componentLoaded', {
      detail: { component: this }
    }),
    componentRendered: new CustomEvent('componentRendered', {
      detail: { component: this }
    })
  };
  
  dispatchComponentEvent(eventName: keyof ComponentEventMap): void {
    this.dispatchEvent(this.events[eventName]);
  }
}
```

## Type Guards

### isComponent
Check if an object is a Component.
```typescript
function isComponent(obj: unknown): obj is Component {
  return obj instanceof Component;
}
```

### hasServiceData
Check if a component has service data.
```typescript
function hasServiceData(
  component: Component
): component is ComponentServiceData {
  return 'serviceData' in component;
}
```

## Best Practices

### 1. Type Safety
```typescript
// Use strict typing for component properties
class TypedComponent extends Component {
  private data: Record<string, unknown> = {};
  
  setData<T>(key: string, value: T): void {
    this.data[key] = value;
  }
  
  getData<T>(key: string): T | undefined {
    return this.data[key] as T;
  }
}
```

### 2. Generic Components
```typescript
// Create reusable generic components
class ListComponent<T> extends Component {
  items: T[] = [];
  
  addItem(item: T): void {
    this.items.push(item);
    this.render();
  }
}
```

### 3. Type Extensions
```typescript
// Extend component types for specific needs
interface AdminComponentConfig extends ComponentConfig {
  adminRole: string;
  permissions: string[];
}

class AdminComponent extends Component {
  config: AdminComponentConfig;
  
  constructor(config: AdminComponentConfig) {
    super(config);
  }
}
```

## Related Topics

- [Component API](../component.md)
- [Service Types](service.md)
- [Controller Types](controller.md)
- [Examples](../../examples/README.md) 