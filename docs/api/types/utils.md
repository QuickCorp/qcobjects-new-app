# Utility Types Reference

This document details the TypeScript utility types and helpers used throughout QCObjects.

## Core Types

### Nullable
Makes a type nullable.
```typescript
type Nullable<T> = T | null;
```

### Optional
Makes all properties of a type optional.
```typescript
type Optional<T> = {
  [P in keyof T]?: T[P];
};
```

### DeepPartial
Makes all properties and nested properties optional.
```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

### ReadonlyDeep
Makes all properties and nested properties readonly.
```typescript
type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P];
};
```

## Function Types

### AsyncFunction
Type for async functions.
```typescript
type AsyncFunction<T = unknown, A extends any[] = any[]> = (
  ...args: A
) => Promise<T>;
```

### Callback
Type for callback functions.
```typescript
type Callback<T = void> = (error?: Error | null, result?: T) => void;
```

### EventHandler
Type for event handlers.
```typescript
type EventHandler<E extends Event = Event> = (event: E) => void;
```

## Object Types

### Dictionary
Generic dictionary type.
```typescript
interface Dictionary<T> {
  [key: string]: T;
}
```

### TypedMap
Strongly typed map interface.
```typescript
interface TypedMap<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  size: number;
}
```

### Serializable
Type for JSON-serializable values.
```typescript
type Serializable =
  | string
  | number
  | boolean
  | null
  | Serializable[]
  | { [key: string]: Serializable };
```

## Utility Functions

### TypeGuard
Type for type guard functions.
```typescript
type TypeGuard<T> = (value: unknown) => value is T;
```

### Mixin
Type for mixin functions.
```typescript
type Mixin<T extends object> = new (...args: any[]) => T;
```

### Constructor
Generic constructor type.
```typescript
type Constructor<T = object> = new (...args: any[]) => T;
```

## Usage Examples

### Type Guards
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

function isArray<T>(
  value: unknown,
  itemGuard: TypeGuard<T>
): value is T[] {
  return Array.isArray(value) && value.every(itemGuard);
}
```

### Mixins
```typescript
function WithLogging<T extends Constructor>(Base: T) {
  return class extends Base {
    log(message: string): void {
      console.log(`[${this.constructor.name}]: ${message}`);
    }
  };
}

function WithTimestamp<T extends Constructor>(Base: T) {
  return class extends Base {
    timestamp: number = Date.now();
    
    getTimestamp(): number {
      return this.timestamp;
    }
  };
}
```

### Type-Safe Event Emitter
```typescript
interface TypedEventEmitter<T extends Dictionary<any>> {
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
}

class EventEmitter<T extends Dictionary<any>> implements TypedEventEmitter<T> {
  private listeners = new Map<
    keyof T,
    Set<(data: any) => void>
  >();
  
  on<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }
  
  off<K extends keyof T>(event: K, listener: (data: T[K]) => void): void {
    this.listeners.get(event)?.delete(listener);
  }
  
  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners.get(event)?.forEach(listener => listener(data));
  }
}
```

## Type Guards

### isNullable
Check if a value is nullable.
```typescript
function isNullable<T>(value: unknown): value is Nullable<T> {
  return value === null || value !== undefined;
}
```

### isPromise
Check if a value is a Promise.
```typescript
function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}
```

### isConstructor
Check if a value is a constructor.
```typescript
function isConstructor<T>(value: unknown): value is Constructor<T> {
  return typeof value === 'function' &&
         value.prototype !== undefined;
}
```

## Best Practices

### 1. Type-Safe Error Handling
```typescript
class TypedError<T extends string> extends Error {
  constructor(
    public readonly code: T,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
  }
  
  static isTypedError<T extends string>(
    error: unknown
  ): error is TypedError<T> {
    return error instanceof TypedError;
  }
}

type ErrorCode = 'VALIDATION_ERROR' | 'NOT_FOUND' | 'UNAUTHORIZED';
type Result<T> = { success: true; data: T } | { success: false; error: TypedError<ErrorCode> };

function handleResult<T>(result: Result<T>): T {
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}
```

### 2. Safe Type Assertions
```typescript
function assertType<T>(
  value: unknown,
  guard: TypeGuard<T>,
  message: string = 'Type assertion failed'
): asserts value is T {
  if (!guard(value)) {
    throw new TypeError(message);
  }
}

function assertNonNull<T>(
  value: T | null | undefined,
  message: string = 'Value is null or undefined'
): asserts value is T {
  if (value === null || value === undefined) {
    throw new TypeError(message);
  }
}
```

### 3. Immutable Data Structures
```typescript
class ImmutableMap<K, V> implements ReadonlyMap<K, V> {
  private map: Map<K, V>;
  
  constructor(entries?: Iterable<readonly [K, V]>) {
    this.map = new Map(entries);
  }
  
  get(key: K): V | undefined {
    return this.map.get(key);
  }
  
  has(key: K): boolean {
    return this.map.has(key);
  }
  
  get size(): number {
    return this.map.size;
  }
  
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.map[Symbol.iterator]();
  }
  
  entries(): IterableIterator<[K, V]> {
    return this.map.entries();
  }
  
  keys(): IterableIterator<K> {
    return this.map.keys();
  }
  
  values(): IterableIterator<V> {
    return this.map.values();
  }
  
  forEach(callbackfn: (value: V, key: K, map: ReadonlyMap<K, V>) => void): void {
    this.map.forEach((value, key) => callbackfn(value, key, this));
  }
}
```

## Related Topics

- [Component Types](component.md)
- [Controller Types](controller.md)
- [Service Types](service.md)
- [Examples](../../examples/README.md) 