# Storage Types Reference

This document details the TypeScript type definitions for QCObjects storage system.

## Core Types

### StorageConfig
Basic storage configuration.
```typescript
interface StorageConfig {
  namespace?: string;
  prefix?: string;
  driver?: 'local' | 'session' | 'memory';
  encryption?: boolean;
  compression?: boolean;
  expiry?: number;
}
```

### StorageItem
Structure for stored items.
```typescript
interface StorageItem<T> {
  value: T;
  timestamp: number;
  expires?: number;
  metadata?: Record<string, unknown>;
}
```

### StorageDriver
Interface for storage drivers.
```typescript
interface StorageDriver {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}
```

### StorageEvent
Events emitted by storage.
```typescript
interface StorageEvent<T = unknown> {
  type: 'set' | 'remove' | 'clear';
  key?: string;
  oldValue?: T;
  newValue?: T;
  timestamp: number;
}
```

## Storage Types

### LocalStorageDriver
Implementation for localStorage.
```typescript
interface LocalStorageDriver extends StorageDriver {
  readonly available: boolean;
  readonly size: number;
  readonly remainingSpace: number;
}
```

### SessionStorageDriver
Implementation for sessionStorage.
```typescript
interface SessionStorageDriver extends StorageDriver {
  readonly available: boolean;
  readonly size: number;
}
```

### MemoryStorageDriver
Implementation for in-memory storage.
```typescript
interface MemoryStorageDriver extends StorageDriver {
  readonly size: number;
  readonly maxSize: number;
  clear(namespace?: string): Promise<void>;
}
```

## Usage Examples

### Basic Storage Usage
```typescript
class AppStorage {
  private driver: StorageDriver;
  private config: StorageConfig;
  
  constructor(config: StorageConfig) {
    this.config = {
      namespace: 'app',
      driver: 'local',
      ...config
    };
    
    this.driver = this.createDriver();
  }
  
  private createDriver(): StorageDriver {
    switch (this.config.driver) {
      case 'local':
        return new LocalStorageDriver(this.config);
      case 'session':
        return new SessionStorageDriver(this.config);
      case 'memory':
        return new MemoryStorageDriver(this.config);
      default:
        throw new Error(`Unsupported storage driver: ${this.config.driver}`);
    }
  }
  
  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getNamespacedKey(key);
    const item = await this.driver.get<StorageItem<T>>(fullKey);
    
    if (!item) return null;
    
    if (this.isExpired(item)) {
      await this.remove(key);
      return null;
    }
    
    return item.value;
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const fullKey = this.getNamespacedKey(key);
    const item: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      expires: ttl ? Date.now() + ttl : undefined
    };
    
    await this.driver.set(fullKey, item);
  }
  
  private getNamespacedKey(key: string): string {
    return `${this.config.namespace}:${key}`;
  }
  
  private isExpired(item: StorageItem<unknown>): boolean {
    return Boolean(
      item.expires && 
      item.expires < Date.now()
    );
  }
}
```

### Encrypted Storage
```typescript
class EncryptedStorage extends AppStorage {
  private encryptionKey: string;
  
  constructor(config: StorageConfig, encryptionKey: string) {
    super({
      ...config,
      encryption: true
    });
    this.encryptionKey = encryptionKey;
  }
  
  async get<T>(key: string): Promise<T | null> {
    const encrypted = await super.get<string>(key);
    if (!encrypted) return null;
    
    const decrypted = await this.decrypt(encrypted);
    return JSON.parse(decrypted) as T;
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    const encrypted = await this.encrypt(serialized);
    await super.set(key, encrypted, ttl);
  }
  
  private async encrypt(data: string): Promise<string> {
    // Implement encryption logic
    return data;
  }
  
  private async decrypt(data: string): Promise<string> {
    // Implement decryption logic
    return data;
  }
}
```

## Type Guards

### isStorageDriver
Check if an object implements StorageDriver.
```typescript
function isStorageDriver(obj: unknown): obj is StorageDriver {
  return typeof obj === 'object' &&
         obj !== null &&
         'get' in obj &&
         'set' in obj &&
         'remove' in obj &&
         'clear' in obj;
}
```

### isStorageItem
Check if an object is a StorageItem.
```typescript
function isStorageItem<T>(obj: unknown): obj is StorageItem<T> {
  return typeof obj === 'object' &&
         obj !== null &&
         'value' in obj &&
         'timestamp' in obj;
}
```

## Best Practices

### 1. Type-Safe Storage
```typescript
class TypedStorage<T extends Record<string, unknown>> {
  private storage: AppStorage;
  
  constructor(config: StorageConfig) {
    this.storage = new AppStorage(config);
  }
  
  async get<K extends keyof T>(key: K): Promise<T[K] | null> {
    return this.storage.get<T[K]>(key as string);
  }
  
  async set<K extends keyof T>(
    key: K,
    value: T[K],
    ttl?: number
  ): Promise<void> {
    await this.storage.set(key as string, value, ttl);
  }
}

// Usage
interface AppState {
  user: {
    id: string;
    name: string;
  };
  settings: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

const storage = new TypedStorage<AppState>({
  namespace: 'app',
  driver: 'local'
});

await storage.set('user', { id: '1', name: 'John' });
const user = await storage.get('user');
```

### 2. Storage Middleware
```typescript
type StorageMiddleware = (
  next: StorageDriver
) => StorageDriver;

class StorageWithMiddleware implements StorageDriver {
  private driver: StorageDriver;
  private middlewares: StorageMiddleware[] = [];
  
  use(middleware: StorageMiddleware): void {
    this.middlewares.push(middleware);
    this.applyMiddlewares();
  }
  
  private applyMiddlewares(): void {
    this.driver = this.middlewares.reduce(
      (driver, middleware) => middleware(driver),
      this.driver
    );
  }
  
  // Implement StorageDriver methods
}

// Usage
const loggingMiddleware: StorageMiddleware = (next) => ({
  async get(key) {
    console.log(`Getting key: ${key}`);
    return next.get(key);
  },
  // ... implement other methods
});
```

### 3. Storage Events
```typescript
class ObservableStorage extends AppStorage {
  private listeners = new Set<
    (event: StorageEvent) => void
  >();
  
  subscribe(listener: (event: StorageEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  private notify(event: StorageEvent): void {
    this.listeners.forEach(listener => listener(event));
  }
  
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const oldValue = await this.get(key);
    await super.set(key, value, ttl);
    
    this.notify({
      type: 'set',
      key,
      oldValue,
      newValue: value,
      timestamp: Date.now()
    });
  }
}
```

## Related Topics

- [Component Types](component.md)
- [Service Types](service.md)
- [Utils Types](utils.md)
- [Examples](../../examples/README.md) 