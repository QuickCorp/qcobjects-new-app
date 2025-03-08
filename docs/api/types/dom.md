# DOM Types Reference

This document details the TypeScript type definitions for QCObjects DOM manipulation and elements.

## Core Types

### QCElement
Extended DOM element interface.
```typescript
interface QCElement extends HTMLElement {
  component?: Component;
  shadowRoot: ShadowRoot | null;
  template?: string;
  templateURI?: string;
  tplsource?: string;
  [key: string]: unknown;
}
```

### ShadowConfig
Configuration for Shadow DOM.
```typescript
interface ShadowConfig {
  mode: 'open' | 'closed';
  delegatesFocus?: boolean;
  slotAssignment?: 'manual' | 'named';
}
```

### ElementConfig
Configuration for element creation.
```typescript
interface ElementConfig {
  tag: string;
  attributes?: Record<string, string>;
  properties?: Record<string, unknown>;
  children?: Array<QCElement | string>;
  shadowConfig?: ShadowConfig;
}
```

## Event Types

### QCEventMap
Extended DOM event map.
```typescript
interface QCEventMap extends HTMLElementEventMap {
  'component-load': CustomEvent<Component>;
  'template-load': CustomEvent<string>;
  'shadow-attach': CustomEvent<ShadowRoot>;
}
```

### QCEventListener
Event listener type with optional options.
```typescript
type QCEventListener<K extends keyof QCEventMap> = (
  event: QCEventMap[K],
  options?: AddEventListenerOptions
) => void;
```

## Template Types

### TemplateConfig
Configuration for template processing.
```typescript
interface TemplateConfig {
  source: string;
  type?: 'text/html' | 'text/template';
  cached?: boolean;
  preprocessor?: (source: string) => string;
}
```

### TemplateProcessor
Template processing utilities.
```typescript
interface TemplateProcessor {
  process(template: string, data?: Record<string, unknown>): string;
  cache: Map<string, string>;
  helpers: Record<string, (data: unknown) => string>;
}
```

## Usage Examples

### Basic Element Creation
```typescript
function createElement(config: ElementConfig): QCElement {
  const element = document.createElement(config.tag) as QCElement;
  
  if (config.attributes) {
    Object.entries(config.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  if (config.properties) {
    Object.assign(element, config.properties);
  }
  
  if (config.children) {
    config.children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }
  
  return element;
}
```

### Shadow DOM Usage
```typescript
function attachShadow(element: QCElement, config: ShadowConfig): ShadowRoot {
  const shadow = element.attachShadow(config);
  
  element.dispatchEvent(new CustomEvent('shadow-attach', {
    detail: shadow,
    bubbles: true,
    composed: true
  }));
  
  return shadow;
}
```

### Template Processing
```typescript
class ComponentTemplate implements TemplateProcessor {
  cache = new Map<string, string>();
  
  helpers = {
    uppercase: (text: unknown) => String(text).toUpperCase(),
    lowercase: (text: unknown) => String(text).toLowerCase()
  };
  
  process(template: string, data?: Record<string, unknown>): string {
    if (this.cache.has(template)) {
      return this.cache.get(template)!;
    }
    
    let processed = template;
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processed = processed.replace(regex, String(value));
      });
    }
    
    this.cache.set(template, processed);
    return processed;
  }
}
```

## Type Guards

### isQCElement
Check if an element is a QCElement.
```typescript
function isQCElement(element: Element): element is QCElement {
  return element instanceof HTMLElement &&
         ('component' in element || 'template' in element);
}
```

### isShadowRoot
Check if an object is a ShadowRoot.
```typescript
function isShadowRoot(obj: unknown): obj is ShadowRoot {
  return obj instanceof ShadowRoot;
}
```

## Best Practices

### 1. Type-Safe Event Handling
```typescript
class TypedElement extends HTMLElement implements QCElement {
  addEventListener<K extends keyof QCEventMap>(
    type: K,
    listener: QCEventListener<K>,
    options?: AddEventListenerOptions
  ): void {
    super.addEventListener(type, listener as EventListener, options);
  }
  
  removeEventListener<K extends keyof QCEventMap>(
    type: K,
    listener: QCEventListener<K>,
    options?: EventListenerOptions
  ): void {
    super.removeEventListener(type, listener as EventListener, options);
  }
}
```

### 2. Shadow DOM Management
```typescript
class ShadowElement extends HTMLElement implements QCElement {
  private _shadowConfig: ShadowConfig = {
    mode: 'open',
    delegatesFocus: true
  };
  
  constructor() {
    super();
    this.attachShadow(this._shadowConfig);
  }
  
  protected updateTemplate(template: string): void {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = template;
      this.dispatchEvent(new CustomEvent('template-load', {
        detail: template
      }));
    }
  }
}
```

### 3. Template Safety
```typescript
class SafeTemplate implements TemplateProcessor {
  private sanitize(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
  
  process(template: string, data?: Record<string, unknown>): string {
    // Sanitize both template and data values
    const safeTemplate = this.sanitize(template);
    const safeData = data ? Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        typeof value === 'string' ? this.sanitize(value) : value
      ])
    ) : undefined;
    
    return new ComponentTemplate().process(safeTemplate, safeData);
  }
}
```

## Related Topics

- [Component Types](component.md)
- [Controller Types](controller.md)
- [Service Types](service.md)
- [Examples](../../examples/README.md) 