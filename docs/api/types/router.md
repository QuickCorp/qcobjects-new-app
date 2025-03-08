# Router Types Reference

This document details the TypeScript type definitions for QCObjects routing system.

## Core Types

### RouteDefinition
Basic route configuration.
```typescript
interface RouteDefinition {
  path: string;
  component: string | typeof Component;
  controller?: string | typeof Controller;
  template?: string;
  templateURI?: string;
  [key: string]: unknown;
}
```

### RouterConfig
Configuration for router initialization.
```typescript
interface RouterConfig {
  mode: 'history' | 'hash';
  base?: string;
  routes: RouteDefinition[];
  scrollBehavior?: ScrollBehavior;
  fallback?: RouteDefinition;
}
```

### RouteParams
Parameters extracted from route path.
```typescript
interface RouteParams {
  [key: string]: string;
}
```

### RouteLocation
Current route location information.
```typescript
interface RouteLocation {
  path: string;
  fullPath: string;
  hash: string;
  query: Record<string, string>;
  params: RouteParams;
  name?: string;
  meta?: Record<string, unknown>;
}
```

## Navigation Types

### NavigationGuard
Route navigation guard function.
```typescript
type NavigationGuard = (
  to: RouteLocation,
  from: RouteLocation,
  next: (to?: RouteLocation | false | void) => void
) => void | Promise<void>;
```

### NavigationFailure
Navigation error information.
```typescript
interface NavigationFailure {
  type: number;
  from: RouteLocation;
  to: RouteLocation;
  message: string;
}
```

### ScrollBehavior
Scroll behavior configuration.
```typescript
interface ScrollBehavior {
  x?: number;
  y?: number;
  selector?: string;
  behavior?: 'auto' | 'smooth';
}
```

## Usage Examples

### Basic Router Setup
```typescript
class AppRouter {
  private config: RouterConfig = {
    mode: 'history',
    base: '/',
    routes: [
      {
        path: '/',
        component: 'HomeComponent',
        controller: 'HomeController'
      },
      {
        path: '/users/:userId',
        component: 'UserComponent',
        controller: 'UserController'
      }
    ],
    fallback: {
      path: '*',
      component: 'NotFoundComponent'
    }
  };
  
  private guards: NavigationGuard[] = [];
  
  addGuard(guard: NavigationGuard): void {
    this.guards.push(guard);
  }
  
  async navigate(to: string): Promise<void> {
    const targetRoute = this.matchRoute(to);
    if (!targetRoute) {
      throw new Error(`Route not found: ${to}`);
    }
    
    const from = this.getCurrentLocation();
    
    for (const guard of this.guards) {
      await new Promise<void>((resolve, reject) => {
        guard(targetRoute, from, (result) => {
          if (result === false) {
            reject(new Error('Navigation cancelled'));
          } else {
            resolve();
          }
        });
      });
    }
    
    // Perform navigation
    history.pushState({}, '', to);
  }
  
  private matchRoute(path: string): RouteLocation | null {
    // Route matching implementation
    return null;
  }
  
  private getCurrentLocation(): RouteLocation {
    return {
      path: window.location.pathname,
      fullPath: window.location.pathname + window.location.search,
      hash: window.location.hash,
      query: this.parseQuery(window.location.search),
      params: {}
    };
  }
  
  private parseQuery(search: string): Record<string, string> {
    const params = new URLSearchParams(search);
    const query: Record<string, string> = {};
    params.forEach((value, key) => {
      query[key] = value;
    });
    return query;
  }
}
```

### Route Component
```typescript
class RouteComponent extends Component {
  private params: RouteParams = {};
  private query: Record<string, string> = {};
  
  constructor(params: RouteParams, query: Record<string, string>) {
    super();
    this.params = params;
    this.query = query;
  }
  
  async beforeRouteEnter(
    to: RouteLocation,
    from: RouteLocation,
    next: () => void
  ): Promise<void> {
    // Component-specific navigation guard
    next();
  }
  
  async beforeRouteLeave(
    to: RouteLocation,
    from: RouteLocation,
    next: () => void
  ): Promise<void> {
    // Check for unsaved changes
    next();
  }
}
```

## Type Guards

### isRouteDefinition
Check if an object is a RouteDefinition.
```typescript
function isRouteDefinition(obj: unknown): obj is RouteDefinition {
  return typeof obj === 'object' &&
         obj !== null &&
         'path' in obj &&
         'component' in obj;
}
```

### isNavigationFailure
Check if an error is a NavigationFailure.
```typescript
function isNavigationFailure(error: unknown): error is NavigationFailure {
  return typeof error === 'object' &&
         error !== null &&
         'type' in error &&
         'from' in error &&
         'to' in error;
}
```

## Best Practices

### 1. Type-Safe Route Parameters
```typescript
interface TypedRouteParams<T extends Record<string, string>> {
  params: T;
  query: Record<string, string>;
}

class TypedRoute<T extends Record<string, string>> {
  constructor(private location: RouteLocation) {}
  
  getParams(): TypedRouteParams<T> {
    return {
      params: this.location.params as T,
      query: this.location.query
    };
  }
}
```

### 2. Route Guards Factory
```typescript
class RouteGuardsFactory {
  static createAuthGuard(
    authService: AuthService
  ): NavigationGuard {
    return async (to, from, next) => {
      if (to.meta?.requiresAuth && !await authService.isAuthenticated()) {
        next({ path: '/login', query: { redirect: to.fullPath } });
      } else {
        next();
      }
    };
  }
  
  static createRoleGuard(
    roles: string[]
  ): NavigationGuard {
    return (to, from, next) => {
      const userRoles = to.meta?.userRoles as string[];
      if (roles.some(role => userRoles.includes(role))) {
        next();
      } else {
        next(false);
      }
    };
  }
}
```

### 3. Route Change Handling
```typescript
class RouterEventHandler {
  private subscribers = new Set<(location: RouteLocation) => void>();
  
  subscribe(callback: (location: RouteLocation) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  notify(location: RouteLocation): void {
    this.subscribers.forEach(callback => callback(location));
  }
  
  handlePopState(): void {
    window.addEventListener('popstate', () => {
      const location = {
        path: window.location.pathname,
        fullPath: window.location.pathname + window.location.search,
        hash: window.location.hash,
        query: {},
        params: {}
      };
      this.notify(location);
    });
  }
}
```

## Related Topics

- [Component Types](component.md)
- [Controller Types](controller.md)
- [DOM Types](dom.md)
- [Examples](../../examples/README.md) 