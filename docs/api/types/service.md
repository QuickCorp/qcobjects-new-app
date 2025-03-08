# Service Types Reference

This document details the TypeScript type definitions for QCObjects services.

## Core Types

### ServiceResponse
Basic response type for services.
```typescript
interface ServiceResponse {
  template?: string;
  serviceData?: ServiceData;
  [key: string]: unknown;
}
```

### ServiceData
Data structure for service responses.
```typescript
type ServiceData = string | {
  hasAdmin?: boolean;
  [key: string]: unknown;
};
```

### ServiceConfig
Configuration for services.
```typescript
interface ServiceConfig {
  name?: string;
  external?: boolean;
  cached?: boolean;
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  timeout?: number;
}
```

## HTTP Types

### HTTPMethod
Valid HTTP methods.
```typescript
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
```

### RequestConfig
Configuration for HTTP requests.
```typescript
interface RequestConfig {
  method: HTTPMethod;
  headers?: Record<string, string>;
  body?: string | FormData;
  credentials?: RequestCredentials;
  timeout?: number;
}
```

### ResponseData
Structure for processed response data.
```typescript
interface ResponseData<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}
```

## JSON Service Types

### JSONServiceConfig
Configuration specific to JSON services.
```typescript
interface JSONServiceConfig extends ServiceConfig {
  contentType?: string;
  acceptType?: string;
  parseResponse?: boolean;
}
```

### JSONResponse
Typed JSON response.
```typescript
interface JSONResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}
```

## Cache Types

### CacheConfig
Configuration for service caching.
```typescript
interface CacheConfig {
  enabled: boolean;
  duration: number;
  key?: string;
}
```

### CacheEntry
Structure for cached data.
```typescript
interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  expires: number;
}
```

## Usage Examples

### Basic Service
```typescript
class DataService extends Service {
  config: ServiceConfig = {
    name: "data-service",
    cached: true
  };
  
  async done(args?: ServiceResponse): Promise<unknown> {
    // Process service response
    return args;
  }
}
```

### JSON Service
```typescript
class APIService extends JSONService {
  config: JSONServiceConfig = {
    external: true,
    method: 'GET',
    url: 'https://api.example.com/data',
    contentType: 'application/json',
    parseResponse: true
  };
  
  async done(args?: ServiceResponse): Promise<JSONResponse> {
    if (!args?.template) return { data: null, success: false };
    
    const data = JSON.parse(args.template);
    return {
      data,
      success: true
    };
  }
}
```

### Cached Service
```typescript
class CachedService extends Service {
  private cache = new Map<string, CacheEntry>();
  
  config: ServiceConfig & CacheConfig = {
    cached: true,
    duration: 5 * 60 * 1000, // 5 minutes
    key: 'cached-data'
  };
  
  async done(args?: ServiceResponse): Promise<unknown> {
    const cacheKey = this.config.key;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() < cached.expires) {
      return cached.data;
    }
    
    // Fetch and cache new data
    const data = await this.fetchData();
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + this.config.duration
    });
    
    return data;
  }
}
```

## Type Guards

### isServiceResponse
Check if an object is a ServiceResponse.
```typescript
function isServiceResponse(obj: unknown): obj is ServiceResponse {
  return typeof obj === 'object' && 
         obj !== null &&
         ('template' in obj || 'serviceData' in obj);
}
```

### isJSONResponse
Check if an object is a JSONResponse.
```typescript
function isJSONResponse<T>(obj: unknown): obj is JSONResponse<T> {
  return typeof obj === 'object' &&
         obj !== null &&
         'data' in obj &&
         'success' in obj;
}
```

## Best Practices

### 1. Generic Services
```typescript
class TypedService<T> extends Service {
  async done(args?: ServiceResponse): Promise<JSONResponse<T>> {
    if (!args?.template) {
      return { data: null as T, success: false };
    }
    
    try {
      const data = JSON.parse(args.template) as T;
      return { data, success: true };
    } catch (error) {
      return { data: null as T, success: false };
    }
  }
}
```

### 2. Response Type Safety
```typescript
interface UserData {
  id: string;
  name: string;
  email: string;
}

class UserService extends TypedService<UserData> {
  validateResponse(data: unknown): data is UserData {
    return typeof data === 'object' &&
           data !== null &&
           'id' in data &&
           'name' in data &&
           'email' in data;
  }
  
  async done(args?: ServiceResponse): Promise<JSONResponse<UserData>> {
    const response = await super.done(args);
    if (!this.validateResponse(response.data)) {
      return { data: null as UserData, success: false };
    }
    return response;
  }
}
```

### 3. Error Handling
```typescript
interface ServiceError {
  code: string;
  message: string;
  details?: unknown;
}

class SafeService extends Service {
  async done(args?: ServiceResponse): Promise<unknown> {
    try {
      // Process response
      return args;
    } catch (error) {
      const serviceError: ServiceError = {
        code: 'SERVICE_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
      throw serviceError;
    }
  }
}
```

## Related Topics

- [Service API](../service.md)
- [Component Types](component.md)
- [Controller Types](controller.md)
- [Examples](../../examples/README.md) 