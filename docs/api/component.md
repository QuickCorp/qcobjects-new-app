# Component API Reference

The Component class is a fundamental building block in QCObjects applications. It provides the foundation for creating reusable UI elements.

## Properties

### Basic Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `""` | Component name for registration |
| `shadowed` | `boolean` | `false` | Whether to use Shadow DOM |
| `tplsource` | `"inline" \| "url"` | `"inline"` | Template source type |
| `template` | `string` | `""` | Component template content |
| `body` | `HTMLElement \| null` | `null` | Component's body element |
| `shadowRoot` | `ShadowRoot \| null` | `null` | Component's shadow root |

### Advanced Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `serviceClass` | `string \| undefined` | `undefined` | Associated service class name |
| `cached` | `boolean` | `false` | Whether to cache the component |
| `data` | `Record<string, unknown>` | `{}` | Component data storage |
| `templateURI` | `string \| undefined` | `undefined` | Template URL when tplsource is "url" |

## Methods

### Lifecycle Methods

#### `constructor(params: ComponentParams)`
Creates a new component instance.
```typescript
interface ComponentParams {
  body?: HTMLElement | null;
  shadowed?: boolean;
  [key: string]: unknown;
}

const component = new MyComponent({
  body: document.createElement('div'),
  shadowed: true
});
```

#### `async done(standardResponse?: StandardResponse): Promise<unknown>`
Called when the component is ready.
```typescript
class MyComponent extends Component {
  async done(standardResponse?: StandardResponse): Promise<unknown> {
    // Component is ready
    return super.done(standardResponse);
  }
}
```

#### `async init(): Promise<void>`
Initialize the component.
```typescript
class MyComponent extends Component {
  async init(): Promise<void> {
    // Initialize component
    await super.init();
  }
}
```

### Template Methods

#### `setTemplate(template: string): void`
Sets the component template.
```typescript
component.setTemplate(`
  <div class="my-component">
    <h1>Hello World</h1>
  </div>
`);
```

#### `async render(): Promise<void>`
Renders the component template.
```typescript
await component.render();
```

### DOM Methods

#### `subelements(selector: string): HTMLElement[]`
Query selector for child elements.
```typescript
const buttons = component.subelements('button');
buttons.forEach(button => {
  button.addEventListener('click', handleClick);
});
```

#### `attachShadow(): ShadowRoot`
Creates and attaches a shadow root.
```typescript
const shadow = component.attachShadow();
```

## Events

### Standard Events

| Event | Description |
|-------|-------------|
| `componentLoaded` | Fired when component is fully loaded |
| `componentRendered` | Fired after component is rendered |
| `templateLoaded` | Fired when template is loaded |

### Usage
```typescript
component.addEventListener('componentLoaded', (event) => {
  console.log('Component loaded:', event.detail);
});
```

## Examples

### Basic Component
```typescript
import QCObjects from "qcobjects";
const { Package, Component } = QCObjects;

class WelcomeComponent extends Component {
  name = "welcome-component";
  shadowed = true;
  template = `
    <style>
      :host {
        display: block;
        padding: 20px;
      }
      h1 { color: #333; }
    </style>
    <div>
      <h1>Welcome to QCObjects</h1>
      <p>This is a basic component example.</p>
    </div>
  `;
}

Package("org.myapp.components", [
  WelcomeComponent
]);
```

### Dynamic Template Component
```typescript
class DynamicComponent extends Component {
  name = "dynamic-component";
  tplsource = "url";
  templateURI = "/templates/dynamic.html";
  
  async done(): Promise<void> {
    const data = await fetchData();
    this.shadowRoot?.querySelector('.content')
      ?.textContent = data.message;
  }
}
```

### Service-Connected Component
```typescript
class DataComponent extends Component {
  name = "data-component";
  shadowed = true;
  
  constructor(o: ComponentParams) {
    o.serviceClass = "DataService";
    super(o);
  }
  
  template = `
    <div class="data-container">
      <loading-indicator></loading-indicator>
      <div class="data-content"></div>
    </div>
  `;
  
  async done(response?: StandardResponse): Promise<void> {
    if (response?.service?.serviceData) {
      const content = this.shadowRoot?.querySelector('.data-content');
      if (content) {
        content.innerHTML = response.service.serviceData;
      }
    }
  }
}
```

## Best Practices

1. **Shadow DOM Usage**
   ```typescript
   class IsolatedComponent extends Component {
     shadowed = true;  // Enable Shadow DOM
     template = `
       <style>
         /* Styles are isolated */
         :host { display: block; }
       </style>
       <div>Isolated content</div>
     `;
   }
   ```

2. **Template Organization**
   ```typescript
   class OrganizedComponent extends Component {
     tplsource = "url";  // Load template from file
     templateURI = "/templates/organized.html";
   }
   ```

3. **Event Handling**
   ```typescript
   class InteractiveComponent extends Component {
     async done(): Promise<void> {
       this.shadowRoot?.querySelector('button')
         ?.addEventListener('click', this.handleClick.bind(this));
     }
     
     handleClick(event: Event): void {
       // Handle click event
     }
   }
   ```

4. **Service Integration**
   ```typescript
   class ServiceComponent extends Component {
     constructor(o: ComponentParams) {
       o.serviceClass = "DataService";
       o.body?.setAttribute("service-data", "initial");
       super(o);
     }
   }
   ```

## Related Topics

- [Controller API](controller.md)
- [Service API](service.md)
- [Component Types](types/component.md)
- [Examples](../examples/README.md) 