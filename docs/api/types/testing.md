# Testing Types Reference

This document details the TypeScript type definitions for QCObjects testing utilities.

## Core Types

### TestSuite
Basic test suite configuration.
```typescript
interface TestSuite {
  name: string;
  description?: string;
  beforeAll?: () => void | Promise<void>;
  afterAll?: () => void | Promise<void>;
  beforeEach?: () => void | Promise<void>;
  afterEach?: () => void | Promise<void>;
  tests: TestCase[];
}
```

### TestCase
Individual test case definition.
```typescript
interface TestCase {
  name: string;
  description?: string;
  skip?: boolean;
  only?: boolean;
  timeout?: number;
  fn: () => void | Promise<void>;
}
```

### TestResult
Result of a test execution.
```typescript
interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: Error;
  stack?: string;
}
```

## Mock Types

### MockFunction
Type for mocked functions.
```typescript
interface MockFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  mock: {
    calls: Parameters<T>[];
    results: { type: 'return' | 'throw'; value: any }[];
    instances: any[];
    lastCall: Parameters<T> | undefined;
  };
  mockReturnValue(value: ReturnType<T>): this;
  mockImplementation(fn: T): this;
  mockRejectedValue(value: any): this;
  mockResolvedValue(value: any): this;
  mockReset(): void;
}
```

### MockInstance
Type for mocked class instances.
```typescript
type MockInstance<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any
    ? MockFunction<T[K]>
    : T[K];
};
```

### SpyInstance
Type for function spies.
```typescript
interface SpyInstance<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  calls: Parameters<T>[];
  callCount: number;
  called: boolean;
  calledWith(...args: Parameters<T>): boolean;
  restore(): void;
}
```

## Assertion Types

### Matcher
Type for assertion matchers.
```typescript
interface Matcher<T = unknown> {
  toBe(expected: T): void;
  toEqual(expected: T): void;
  toBeInstanceOf(constructor: Function): void;
  toBeDefined(): void;
  toBeUndefined(): void;
  toBeNull(): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toContain(item: unknown): void;
  toHaveLength(length: number): void;
  toHaveProperty(path: string, value?: unknown): void;
  toThrow(error?: string | RegExp | Error): void;
  toThrowError(error?: string | RegExp | Error): void;
  resolves: Matcher<T>;
  rejects: Matcher<T>;
}
```

## Usage Examples

### Basic Test Suite
```typescript
class ComponentTestSuite implements TestSuite {
  name = 'Component Tests';
  
  private component: Component;
  
  async beforeEach(): Promise<void> {
    this.component = new Component();
    await this.component.init();
  }
  
  async afterEach(): Promise<void> {
    await this.component.destroy();
  }
  
  tests: TestCase[] = [
    {
      name: 'should render correctly',
      fn: async () => {
        const element = await this.component.render();
        expect(element).toBeDefined();
        expect(element.innerHTML).toContain('Hello World');
      }
    },
    {
      name: 'should handle events',
      fn: async () => {
        const spy = createSpy();
        this.component.addEventListener('click', spy);
        
        await this.component.click();
        expect(spy).toHaveBeenCalled();
      }
    }
  ];
}
```

### Mocking Services
```typescript
class ServiceMock implements MockInstance<Service> {
  getData = jest.fn().mockResolvedValue({ id: 1, name: 'Test' });
  
  setData = jest.fn().mockImplementation(async (data: unknown) => {
    return { success: true };
  });
  
  static create(): MockInstance<Service> {
    return new ServiceMock();
  }
}

class ServiceTest implements TestSuite {
  name = 'Service Tests';
  private service: MockInstance<Service>;
  
  beforeEach(): void {
    this.service = ServiceMock.create();
  }
  
  tests: TestCase[] = [
    {
      name: 'should fetch data',
      fn: async () => {
        const result = await this.service.getData();
        expect(result).toEqual({ id: 1, name: 'Test' });
        expect(this.service.getData).toHaveBeenCalled();
      }
    }
  ];
}
```

## Type Guards

### isTestCase
Check if an object is a TestCase.
```typescript
function isTestCase(obj: unknown): obj is TestCase {
  return typeof obj === 'object' &&
         obj !== null &&
         'name' in obj &&
         'fn' in obj;
}
```

### isMockFunction
Check if a function is a mock.
```typescript
function isMockFunction<T extends (...args: any[]) => any>(
  fn: unknown
): fn is MockFunction<T> {
  return typeof fn === 'function' &&
         'mock' in fn &&
         typeof (fn as any).mockImplementation === 'function';
}
```

## Best Practices

### 1. Component Testing
```typescript
class TypedComponentTest<T extends Component> {
  protected component: T;
  protected element: HTMLElement;
  
  async setup(props: Partial<T>): Promise<void> {
    this.component = new Component(props) as T;
    this.element = await this.component.render();
    document.body.appendChild(this.element);
  }
  
  async cleanup(): Promise<void> {
    this.element.remove();
    await this.component.destroy();
  }
  
  async trigger(
    eventName: string,
    detail?: unknown
  ): Promise<void> {
    const event = new CustomEvent(eventName, { detail });
    this.element.dispatchEvent(event);
    await this.nextTick();
  }
  
  private nextTick(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve));
  }
}
```

### 2. Service Testing
```typescript
class ServiceTestHelper<T extends Service> {
  private mocks = new Map<string, MockFunction<any>>();
  
  mock<K extends keyof T>(
    method: K,
    implementation?: T[K]
  ): MockFunction<T[K]> {
    const mock = jest.fn(implementation);
    this.mocks.set(method as string, mock);
    return mock;
  }
  
  createMockedService(
    Base: new () => T,
    config?: Partial<T>
  ): T {
    const service = new Base();
    this.mocks.forEach((mock, method) => {
      service[method as keyof T] = mock as any;
    });
    return Object.assign(service, config);
  }
  
  reset(): void {
    this.mocks.forEach(mock => mock.mockReset());
  }
}
```

### 3. Async Testing
```typescript
class AsyncTestUtils {
  static async waitFor(
    callback: () => boolean | Promise<boolean>,
    timeout = 5000
  ): Promise<void> {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      if (await callback()) return;
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    throw new Error('Timeout waiting for condition');
  }
  
  static async nextTick(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve));
  }
  
  static async flushPromises(): Promise<void> {
    return new Promise(resolve => setImmediate(resolve));
  }
}
```

## Related Topics

- [Component Types](component.md)
- [Service Types](service.md)
- [Utils Types](utils.md)
- [Examples](../../examples/README.md) 