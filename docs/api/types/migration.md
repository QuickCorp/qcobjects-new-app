# Migration Guide: JavaScript to TypeScript

> **Note**: This documentation was created with the assistance of AI technology. While we strive for accuracy, some information may not be 100% accurate or may need validation. Please refer to the official QCObjects documentation and TypeScript handbook for the most up-to-date and verified information. If you find any inaccuracies, please report them to the project maintainers.

This guide helps you migrate your QCObjects JavaScript application to TypeScript.

## Step-by-Step Migration

### 1. Project Preparation

#### Install Dependencies
```bash
# Install TypeScript and type definitions
npm install --save-dev typescript @types/qcobjects

# Install development tools
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### Configure TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./build",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
```

### 2. File Migration Strategy

#### Gradual Migration
1. Rename `.js` files to `.ts`
2. Add type declarations
3. Fix type errors
4. Update imports/exports

Example:
```typescript
// Before (component.js)
class MyComponent extends Component {
  constructor() {
    super();
    this.data = {};
  }
}

// After (component.ts)
interface ComponentData {
  title?: string;
  items: string[];
}

class MyComponent extends Component {
  data: ComponentData;

  constructor() {
    super();
    this.data = {
      items: []
    };
  }
}
```

### 3. Common Migration Patterns

#### Component Migration
```typescript
// Before (JavaScript)
class TodoComponent extends Component {
  constructor() {
    super();
    this.items = [];
    this.loading = false;
  }
  
  addItem(item) {
    this.items.push(item);
  }
}

// After (TypeScript)
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: TodoItem[];
  loading: boolean;
}

class TodoComponent extends Component {
  state: TodoState;
  
  constructor() {
    super();
    this.state = {
      items: [],
      loading: false
    };
  }
  
  addItem(item: TodoItem): void {
    this.state.items.push(item);
  }
}
```

#### Service Migration
```typescript
// Before (JavaScript)
class ApiService extends Service {
  async getData() {
    const response = await this.fetch('/api/data');
    return response.json();
  }
  
  async saveData(data) {
    return this.fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

// After (TypeScript)
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiService extends Service {
  async getData<T>(): Promise<ApiResponse<T>> {
    const response = await this.fetch<ApiResponse<T>>('/api/data');
    return response.json();
  }
  
  async saveData<T>(data: T): Promise<ApiResponse<T>> {
    return this.fetch<ApiResponse<T>>('/api/data', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}
```

#### Controller Migration
```typescript
// Before (JavaScript)
class TodoController extends Controller {
  constructor() {
    super();
    this.service = new TodoService();
  }
  
  async done() {
    const items = await this.service.getItems();
    this.component.render(items);
  }
  
  handleItemAdd(item) {
    this.service.addItem(item);
  }
}

// After (TypeScript)
interface TodoControllerConfig extends ControllerConfig {
  autoLoad?: boolean;
  itemLimit?: number;
}

class TodoController extends Controller {
  private service: TodoService;
  config: TodoControllerConfig;
  
  constructor(config: TodoControllerConfig) {
    super(config);
    this.service = new TodoService();
  }
  
  async done(): Promise<void> {
    const items = await this.service.getItems();
    this.component?.render(items);
  }
  
  handleItemAdd(item: TodoItem): Promise<void> {
    return this.service.addItem(item);
  }
}
```

### 4. Type Declaration Files

#### Create Component Types
```typescript
// src/types/components.d.ts
declare namespace QCObjects {
  interface ComponentConfig {
    name: string;
    template?: string;
    templateURI?: string;
    controller?: typeof Controller;
  }
  
  interface ComponentLifecycle {
    componentDidMount?(): Promise<void>;
    componentWillUnmount?(): Promise<void>;
    shouldComponentUpdate?(): boolean;
  }
}
```

#### Create Service Types
```typescript
// src/types/services.d.ts
declare namespace QCObjects {
  interface ServiceConfig {
    name: string;
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
  }
  
  interface ServiceResponse<T = unknown> {
    data: T;
    status: number;
    headers: Record<string, string>;
  }
}
```

### 5. Handling Legacy Code

#### Using Declaration Files
```typescript
// src/types/legacy.d.ts
declare module 'legacy-module' {
  export function oldMethod(): void;
  export const oldConstant: string;
}
```

#### Type Assertions for Legacy Code
```typescript
// When you can't immediately type everything
interface LegacyData {
  [key: string]: unknown;
}

function handleLegacyData(data: LegacyData): void {
  // Type assertion when you know the structure
  const typedData = data as { id: string; value: number };
  processData(typedData);
}
```

### 6. Testing Migration

#### Update Test Files
```typescript
// Before (JavaScript)
describe('TodoComponent', () => {
  it('should render items', () => {
    const component = new TodoComponent();
    component.items = ['item1', 'item2'];
    expect(component.render()).toBeTruthy();
  });
});

// After (TypeScript)
describe('TodoComponent', () => {
  it('should render items', () => {
    const component = new TodoComponent();
    const items: TodoItem[] = [
      { id: '1', text: 'item1', completed: false },
      { id: '2', text: 'item2', completed: true }
    ];
    component.state.items = items;
    expect(component.render()).toBeTruthy();
  });
});
```

### 7. Common Migration Issues

#### Type Inference Issues
```typescript
// Problem
const items = []; // Type: any[]

// Solution
const items: TodoItem[] = [];
// or
const items = [] as TodoItem[];
```

#### Async/Promise Types
```typescript
// Problem
async function getData() {
  return { data: 'value' }; // Return type is inferred as Promise<{ data: string }>
}

// Solution
interface DataResponse {
  data: string;
}

async function getData(): Promise<DataResponse> {
  return { data: 'value' };
}
```

#### Event Handling
```typescript
// Problem
element.addEventListener('click', (e) => {
  const target = e.target; // Type is EventTarget | null
  target.value; // Error: Property 'value' does not exist on type 'EventTarget'
});

// Solution
element.addEventListener('click', (e) => {
  const target = e.target as HTMLInputElement;
  console.log(target.value);
});
```

### 8. Best Practices During Migration

1. **Incremental Migration**
   - Migrate one module at a time
   - Start with leaf components
   - Keep the application running during migration

2. **Type Safety Levels**
   ```typescript
   // Level 1: Basic Types
   function process(value: string): number {
     return parseInt(value);
   }

   // Level 2: Interfaces and Type Guards
   interface ProcessConfig {
     value: string;
     radix?: number;
   }

   function process(config: ProcessConfig): number {
     return parseInt(config.value, config.radix);
   }

   // Level 3: Generics and Advanced Types
   function process<T extends string | number>(
     value: T,
     transformer: (val: T) => number
   ): number {
     return transformer(value);
   }
   ```

3. **Documentation**
   ```typescript
   /**
    * Represents a todo item in the application
    * @interface TodoItem
    * @property {string} id - Unique identifier
    * @property {string} text - Todo item text
    * @property {boolean} completed - Completion status
    */
   interface TodoItem {
     id: string;
     text: string;
     completed: boolean;
   }
   ```

### 9. Tools and Resources

1. **Migration Tools**
   - TypeScript Migration Analyzer
   - ESLint with TypeScript rules
   - Type definition generators

2. **VS Code Settings**
   ```json
   {
     "typescript.suggest.completeFunctionCalls": true,
     "typescript.updateImportsOnFileMove.enabled": "always",
     "typescript.preferences.importModuleSpecifier": "relative"
   }
   ```

3. **Useful Commands**
   ```bash
   # Check types without compilation
   npx tsc --noEmit

   # Generate declaration files
   npx tsc --declaration

   # Find files needing migration
   find src -name "*.js" -not -path "*/node_modules/*"
   ```

### 10. QCObjects-Specific Patterns

#### Package Definition Migration
```typescript
// Before (JavaScript)
Package('org.quickcorp.main', [
  Class('MainComponent', Component),
  Class('MainController', Controller),
  Class('APIService', Service)
]);

// After (TypeScript)
interface PackageConfig {
  name: string;
  classes: Array<typeof Component | typeof Controller | typeof Service>;
}

Package('org.quickcorp.main', {
  classes: [
    Class<typeof Component>('MainComponent', Component),
    Class<typeof Controller>('MainController', Controller),
    Class<typeof Service>('APIService', Service)
  ]
} as PackageConfig);
```

#### Effect Migration
```typescript
// Before (JavaScript)
class FadeEffect extends Effect {
  apply(element) {
    element.style.opacity = this.opacity;
  }
}

// After (TypeScript)
interface EffectConfig {
  duration?: number;
  timing?: string;
  delay?: number;
}

class FadeEffect extends Effect {
  private opacity: number;
  config: EffectConfig;

  constructor(config: EffectConfig) {
    super(config);
    this.opacity = 1;
  }

  apply(element: HTMLElement): void {
    element.style.opacity = this.opacity.toString();
  }
}
```

#### Template Migration
```typescript
// Before (JavaScript)
class MainTemplate extends Template {
  tplsource = "inline";
  source = "<div>{{name}}</div>";
}

// After (TypeScript)
interface TemplateData {
  name: string;
  [key: string]: unknown;
}

class MainTemplate extends Template {
  tplsource: "file" | "inline" = "inline";
  source: string = "<div>{{name}}</div>";
  data: TemplateData;

  constructor(data: TemplateData) {
    super();
    this.data = data;
  }
}
```

### 11. QCObjects Feature Migration

#### SDK Integration
```typescript
// Before (JavaScript)
const sdk = new SDK();
sdk.config = {
  api_url: "https://api.example.com"
};

// After (TypeScript)
interface SDKConfig {
  api_url: string;
  version?: string;
  credentials?: {
    apiKey: string;
    secret?: string;
  };
}

class SDK {
  config: SDKConfig;

  constructor(config: SDKConfig) {
    this.config = config;
  }
}

const sdk = new SDK({
  api_url: "https://api.example.com",
  version: "2.0"
});
```

#### Routing System
```typescript
// Before (JavaScript)
Component.routing = {
  "main": {
    component: "MainComponent",
    route: "/"
  }
};

// After (TypeScript)
interface RouteDefinition {
  component: string;
  route: string;
  controller?: string;
  template?: string;
  params?: Record<string, unknown>;
}

interface RoutingConfig {
  [key: string]: RouteDefinition;
}

Component.routing = {
  "main": {
    component: "MainComponent",
    route: "/",
    controller: "MainController"
  }
} as RoutingConfig;
```

#### Service Workers
```typescript
// Before (JavaScript)
// sw.js
serviceWorker.register({
  routes: ["/*"],
  cache: true
});

// After (TypeScript)
// sw.ts
interface ServiceWorkerConfig {
  routes: string[];
  cache?: boolean;
  strategy?: 'network-first' | 'cache-first';
  version?: string;
}

serviceWorker.register({
  routes: ["/*"],
  cache: true,
  strategy: 'network-first',
  version: '1.0.0'
} as ServiceWorkerConfig);
```

### 12. QCObjects-Specific Troubleshooting

#### 1. Component Lifecycle Types
```typescript
// Problem: Lifecycle methods not properly typed
class MyComponent extends Component {
  done() { // Missing return type
    this.render();
  }
}

// Solution
class MyComponent extends Component {
  async done(): Promise<void> {
    await this.render();
  }

  // Other lifecycle methods
  async loaded(): Promise<void> {
    // Component loaded
  }

  async rendered(): Promise<void> {
    // After render
  }
}
```

#### 2. Service Response Handling
```typescript
// Problem: Untyped service responses
class DataService extends Service {
  async getData() {
    return await this.fetch(); // Untyped response
  }
}

// Solution
interface DataResponse<T> {
  data: T;
  status: 'success' | 'error';
  timestamp: number;
}

class DataService extends Service {
  async getData<T>(): Promise<DataResponse<T>> {
    const response = await this.fetch<DataResponse<T>>();
    if (!response.ok) {
      throw new Error('Service request failed');
    }
    return response.json();
  }
}
```

#### 3. Template Binding
```typescript
// Problem: Template data binding type issues
class UserTemplate extends Template {
  source = "<div>{{user.name}} - {{user.email}}</div>";
  // Missing type definition for template data
}

// Solution
interface UserTemplateData {
  user: {
    name: string;
    email: string;
    role?: string;
  };
}

class UserTemplate extends Template {
  source = "<div>{{user.name}} - {{user.email}}</div>";
  data: UserTemplateData;

  constructor(data: UserTemplateData) {
    super();
    this.data = data;
  }
}
```

### 13. Common QCObjects Type Errors

#### 1. Component Configuration
```typescript
// Error: Property 'name' is missing
const config = {
  template: "<div></div>"
} as ComponentConfig; // Missing required 'name'

// Solution
const config: ComponentConfig = {
  name: "my-component",
  template: "<div></div>"
};
```

#### 2. Service URL Types
```typescript
// Error: URL must be string or URL object
class MyService extends Service {
  config = {
    url: 123 // Type error
  };
}

// Solution
class MyService extends Service {
  config: ServiceConfig = {
    url: "https://api.example.com",
    method: "GET"
  };
}
```

#### 3. Controller-Component Communication
```typescript
// Error: Accessing undefined component
class MyController extends Controller {
  done() {
    this.component.someMethod(); // Potential runtime error
  }
}

// Solution
class MyController extends Controller {
  done(): void {
    if (!this.component) {
      throw new Error("Component not initialized");
    }
    
    // Type guard
    if (this.component instanceof MyComponent) {
      this.component.someMethod();
    }
  }
}
```

### 14. Migration Checklist

1. **Initial Setup**
   - [ ] Install TypeScript and dependencies
   - [ ] Configure tsconfig.json
   - [ ] Setup ESLint with TypeScript rules

2. **Core Types**
   - [ ] Migrate Component types
   - [ ] Migrate Service types
   - [ ] Migrate Controller types
   - [ ] Create shared interfaces

3. **Features**
   - [ ] Update Package definitions
   - [ ] Migrate Templates
   - [ ] Update Effects
   - [ ] Configure Routing

4. **Testing**
   - [ ] Update test configuration
   - [ ] Add type definitions for tests
   - [ ] Migrate test utilities

5. **Build Process**
   - [ ] Update build scripts
   - [ ] Configure TypeScript compilation
   - [ ] Setup source maps
   - [ ] Update service worker

## Related Resources

- [TypeScript Migration Checker](https://www.typescriptlang.org/play)
- [QCObjects TypeScript Guide](../README.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) 