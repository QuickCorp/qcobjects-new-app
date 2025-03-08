# Package API Reference

The Package system in QCObjects provides a way to organize and manage code modules, dependencies, and namespaces.

## Package Function

### Basic Usage

```typescript
import QCObjects from "qcobjects";
const { Package } = QCObjects;

Package("org.myapp.components", [
  ComponentClass1,
  ComponentClass2
]);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | `string` | Package namespace |
| `classes` | `Array<Class>` | Array of classes to include |

## Features

### Namespacing

Packages provide a hierarchical namespace structure:
```typescript
// Main components
Package("org.myapp.components", [
  MainComponent,
  HeaderComponent
]);

// Admin components
Package("org.myapp.admin.components", [
  AdminDashboard,
  AdminPanel
]);
```

### Dependency Management

Packages can manage dependencies between modules:
```typescript
// Base package
Package("org.myapp.core", [
  BaseComponent,
  BaseService
]);

// Dependent package
Package("org.myapp.features", [
  FeatureComponent, // Uses BaseComponent
  FeatureService   // Uses BaseService
]);
```

### Code Organization

Organize related functionality:
```typescript
// Components package
Package("org.myapp.components", [
  NavComponent,
  FooterComponent
]);

// Services package
Package("org.myapp.services", [
  DataService,
  AuthService
]);

// Controllers package
Package("org.myapp.controllers", [
  NavController,
  DataController
]);
```

## Best Practices

### 1. Namespace Structure

Follow a consistent naming convention:
```typescript
// Company/Organization
Package("com.company.module", [...]);

// Open source project
Package("org.project.feature", [...]);

// Personal project
Package("dev.name.app", [...]);
```

### 2. Module Organization

Group related functionality:
```typescript
// Feature-based organization
Package("org.myapp.auth", [
  AuthComponent,
  AuthService,
  AuthController
]);

// Type-based organization
Package("org.myapp.components", [
  AuthComponent,
  UserComponent,
  AdminComponent
]);
```

### 3. Dependency Order

Order packages by dependency:
```typescript
// Core package (no dependencies)
Package("org.myapp.core", [
  CoreComponent
]);

// Feature package (depends on core)
Package("org.myapp.features", [
  FeatureComponent
]);

// App package (depends on features)
Package("org.myapp.app", [
  AppComponent
]);
```

## Examples

### Basic Package
```typescript
Package("org.myapp.components", [
  class MyComponent extends Component {
    name = "my-component";
    template = `<div>Hello World</div>`;
  }
]);
```

### Feature Package
```typescript
Package("org.myapp.auth", [
  // Components
  class LoginComponent extends Component {
    name = "login-form";
    template = `...`;
  },
  
  // Services
  class AuthService extends Service {
    async done(args?: ServiceResponse): Promise<unknown> {
      // Auth logic
      return args;
    }
  },
  
  // Controllers
  class AuthController extends Controller {
    async done(standardResponse?: StandardResponse): Promise<unknown> {
      // Auth control logic
      return super.done(standardResponse);
    }
  }
]);
```

### Module Package
```typescript
Package("org.myapp.admin", [
  // Admin dashboard
  class AdminDashboard extends Component {
    name = "admin-dashboard";
    template = `...`;
  },
  
  // Admin service
  class AdminService extends Service {
    async done(args?: ServiceResponse): Promise<unknown> {
      // Admin data logic
      return args;
    }
  }
]);
```

## Advanced Usage

### Dynamic Loading
```typescript
// Load package dynamically
async function loadAdminModule(): Promise<void> {
  await import('./admin/package');
  // Admin package is now available
}
```

### Package Configuration
```typescript
Package("org.myapp.config", [
  {
    name: "appConfig",
    value: {
      apiUrl: "https://api.example.com",
      theme: "light"
    }
  }
]);
```

### Package Extensions
```typescript
// Base package
Package("org.myapp.base", [
  class BaseComponent extends Component {
    // Base functionality
  }
]);

// Extended package
Package("org.myapp.extended", [
  class ExtendedComponent extends BaseComponent {
    // Extended functionality
  }
]);
```

## Related Topics

- [Component API](component.md)
- [Service API](service.md)
- [Controller API](controller.md)
- [Examples](../examples/README.md) 