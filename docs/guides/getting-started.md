# Getting Started with QCObjects

This guide will help you get started with QCObjects and understand how to create your first application.

## Installation

1. Create a new project:
```bash
npm create qcobjects-new-app my-app
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start:dev
```

## Project Structure

The QCObjects application follows a structured layout:

```
src/
├── js/
│   ├── packages/           # Custom packages
│   │   ├── org.quickcorp.custom.components.ts
│   │   ├── org.quickcorp.custom.controllers.ts
│   │   └── org.quickcorp.custom.services.ts
│   ├── init.ts            # Application initialization
│   └── config.ts          # Configuration settings
├── types/
│   ├── qcobjects.d.ts     # QCObjects type definitions
│   ├── qcobjects-sdk.d.ts # SDK type definitions
│   └── shared.d.ts        # Shared type definitions
├── templates/             # HTML templates
├── css/                  # Stylesheets
└── img/                  # Images and assets
```

## First Steps

1. **Create a Component**

```typescript
import QCObjects from "qcobjects";
const { Package, Component } = QCObjects;

class MyComponent extends Component {
  name = "my-component";
  template = `
    <div>
      <h1>Hello QCObjects!</h1>
    </div>
  `;
}

Package("org.myapp.components", [
  MyComponent
]);
```

2. **Create a Controller**

```typescript
import QCObjects from "qcobjects";
const { Package, Controller } = QCObjects;

class MyController extends Controller {
  async done(standardResponse?: any): Promise<any> {
    // Controller logic here
    return super.done(standardResponse);
  }
}

Package("org.myapp.controllers", [
  MyController
]);
```

3. **Create a Service**

```typescript
import QCObjects from "qcobjects";
const { Package, Service } = QCObjects;

class MyService extends Service {
  async done(args?: any): Promise<unknown> {
    // Service logic here
    return args;
  }
}

Package("org.myapp.services", [
  MyService
]);
```

## Key Concepts

### Components

Components are the building blocks of your UI. They can:
- Define their own templates
- Handle their own lifecycle
- Manage their own state
- Use shadow DOM for encapsulation

### Controllers

Controllers manage the logic between components and services. They:
- Handle user interactions
- Process data
- Update the UI
- Manage component lifecycle

### Services

Services handle data operations and external communications:
- API calls
- Data processing
- Business logic
- State management

### Packages

Packages organize your code into logical modules:
- Group related functionality
- Manage dependencies
- Provide namespacing
- Enable code reuse

## Next Steps

- Explore the [Core Concepts](core-concepts.md) guide
- Check out the [TypeScript Integration](typescript.md) guide
- Try the [Tutorials](../tutorials/README.md)
- Browse the [Examples](../examples/README.md) 