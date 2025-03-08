# Service API Reference

Services in QCObjects handle data operations, external API calls, and business logic. They provide a standardized way to manage data flow in your application.

## Service Types

### Base Service

The foundational service class that provides core functionality.

```typescript
class MyService extends Service {
  async done(args?: ServiceResponse): Promise<unknown> {
    // Process data
    return args;
  }
}
```

### JSON Service

Specialized service for handling JSON data and HTTP requests.

```typescript
class MyJSONService extends JSONService {
  external = true;
  method = "GET";
  url = "https://api.example.com/data";
}
```

## Properties

### Common Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | `string` | `""` | Service identifier |
| `cached` | `boolean` | `false` | Enable response caching |
| `method` | `string` | `"GET"` | HTTP method |
| `headers` | `Record<string, string>` | `{}` | HTTP headers |
| `url` | `string` | `""` | Service endpoint URL |

### Advanced Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `external` | `boolean` | `false` | External API flag |
| `withCredentials` | `boolean` | `false` | Include credentials |
| `timeout` | `number` | `0` | Request timeout |
| `cache` | `Map<string, unknown>` | `new Map()` | Cache storage |

## Methods

### Core Methods

#### `async done(args?: ServiceResponse): Promise<unknown>`
Process service response data.
```typescript
class DataService extends Service {
  async done(args?: ServiceResponse): Promise<unknown> {
    if (!args?.template) return;
    
    // Process data
    const data = JSON.parse(args.template);
    return {
      ...args,
      processedData: data
    };
  }
}
```

#### `async fail(args?: ServiceResponse): Promise<unknown>`
Handle service failures.
```typescript
class ResilientService extends Service {
  async fail(args?: ServiceResponse): Promise<unknown> {
    logger.error('Service failed:', args);
    return {
      error: true,
      message: 'Service operation failed'
    };
  }
}
```

### HTTP Methods

#### `async fetch(): Promise<Response>`
Perform HTTP request.
```typescript
class APIService extends JSONService {
  url = "https://api.example.com/data";
  
  async fetch(): Promise<Response> {
    const response = await super.fetch();
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response;
  }
}
```

#### `setHeaders(headers: Record<string, string>): void`
Set HTTP headers.
```typescript
service.setHeaders({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer token'
});
```

## Examples

### Basic Data Service
```typescript
class UserService extends Service {
  name = "user-service";
  
  async done(args?: ServiceResponse): Promise<unknown> {
    if (!args?.template) return;
    
    const userData = JSON.parse(args.template);
    return {
      ...args,
      serviceData: {
        username: userData.name,
        email: userData.email
      }
    };
  }
}
```

### REST API Service
```typescript
class APIService extends JSONService {
  external = true;
  cached = true;
  method = "GET";
  headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  async done(args?: ServiceResponse): Promise<unknown> {
    if (!args?.template) return;
    
    const response = JSON.parse(args.template);
    return {
      ...args,
      serviceData: response.data
    };
  }
  
  async fail(args?: ServiceResponse): Promise<unknown> {
    logger.error('API request failed:', args);
    return {
      error: true,
      message: 'Failed to fetch data'
    };
  }
}
```

### Cached Service
```typescript
class CachedDataService extends Service {
  cached = true;
  cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  async done(args?: ServiceResponse): Promise<unknown> {
    if (!args?.template) return;
    
    const cacheKey = this.getCacheKey(args);
    let data = this.cache.get(cacheKey);
    
    if (!data) {
      data = await this.fetchFreshData();
      this.cache.set(cacheKey, data);
    }
    
    return {
      ...args,
      serviceData: data
    };
  }
  
  private getCacheKey(args: ServiceResponse): string {
    return `${this.name}_${JSON.stringify(args)}`;
  }
  
  private async fetchFreshData(): Promise<unknown> {
    // Fetch fresh data
    return {};
  }
}
```

## Best Practices

1. **Error Handling**
```typescript
class RobustService extends Service {
  async done(args?: ServiceResponse): Promise<unknown> {
    try {
      // Process data
      return result;
    } catch (error) {
      logger.error('Service error:', error);
      return this.fail(args);
    }
  }
}
```

2. **Response Validation**
```typescript
class ValidatedService extends Service {
  validate(data: unknown): boolean {
    return typeof data === 'object' && 
           data !== null &&
           'required' in data;
  }
  
  async done(args?: ServiceResponse): Promise<unknown> {
    if (!args?.template) return;
    
    const data = JSON.parse(args.template);
    if (!this.validate(data)) {
      return this.fail(args);
    }
    
    return {
      ...args,
      serviceData: data
    };
  }
}
```

3. **Modular Services**
```typescript
class CompositeService extends Service {
  async done(args?: ServiceResponse): Promise<unknown> {
    const data1 = await this.fetchFirstData();
    const data2 = await this.fetchSecondData();
    
    return {
      ...args,
      serviceData: {
        first: data1,
        second: data2
      }
    };
  }
}
```

## Related Topics

- [Component API](component.md)
- [Controller API](controller.md)
- [Service Types](types/service.md)
- [Examples](../examples/README.md) 