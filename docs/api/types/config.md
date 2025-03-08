# Configuration Types Reference

This document details the TypeScript type definitions for QCObjects configuration system.

## Core Types

### AppConfig
Application-wide configuration.
```typescript
interface AppConfig {
  name: string;
  version: string;
  env: 'development' | 'production' | 'test';
  debug?: boolean;
  baseUrl?: string;
  api?: {
    baseUrl: string;
    timeout?: number;
    headers?: Record<string, string>;
  };
  router?: RouterConfig;
  storage?: StorageConfig;
  i18n?: I18nConfig;
  [key: string]: unknown;
}
```

### ComponentConfig
Component-specific configuration.
```typescript
interface ComponentConfig {
  name: string;
  template?: string;
  templateUrl?: string;
  styles?: string[];
  shadowMode?: 'open' | 'closed';
  attributes?: Record<string, string>;
  data?: Record<string, unknown>;
  methods?: Record<string, Function>;
  lifecycle?: ComponentLifecycle;
}
```

### ServiceConfig
Service configuration options.
```typescript
interface ServiceConfig {
  name: string;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  cache?: boolean | {
    duration: number;
    key?: string;
  };
  retry?: {
    attempts: number;
    delay: number;
  };
}
```

## Environment Types

### EnvConfig
Environment-specific configuration.
```typescript
interface EnvConfig {
  NODE_ENV: string;
  API_URL: string;
  DEBUG: boolean;
  FEATURES: Record<string, boolean>;
  SENTRY_DSN?: string;
  GA_TRACKING_ID?: string;
  [key: string]: unknown;
}
```

### FeatureFlags
Feature flag configuration.
```typescript
interface FeatureFlags {
  [key: string]: {
    enabled: boolean;
    rollout?: number;
    dependencies?: string[];
    config?: Record<string, unknown>;
  };
}
```

## Usage Examples

### Basic App Configuration
```typescript
class AppConfigManager {
  private static instance: AppConfigManager;
  private config: AppConfig;
  
  private constructor() {
    this.config = this.loadConfig();
  }
  
  static getInstance(): AppConfigManager {
    if (!AppConfigManager.instance) {
      AppConfigManager.instance = new AppConfigManager();
    }
    return AppConfigManager.instance;
  }
  
  private loadConfig(): AppConfig {
    const env = process.env.NODE_ENV || 'development';
    
    return {
      name: 'QCObjects App',
      version: '1.0.0',
      env,
      debug: env !== 'production',
      api: {
        baseUrl: process.env.API_URL || 'http://localhost:3000',
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      },
      router: {
        mode: 'history',
        base: '/'
      }
    };
  }
  
  get<T extends keyof AppConfig>(key: T): AppConfig[T] {
    return this.config[key];
  }
  
  set<T extends keyof AppConfig>(key: T, value: AppConfig[T]): void {
    this.config[key] = value;
  }
}
```

### Component Configuration
```typescript
class ComponentConfigBuilder {
  private config: ComponentConfig = {
    name: '',
    shadowMode: 'open',
    data: {},
    methods: {}
  };
  
  setName(name: string): this {
    this.config.name = name;
    return this;
  }
  
  setTemplate(template: string): this {
    this.config.template = template;
    return this;
  }
  
  setTemplateUrl(url: string): this {
    this.config.templateUrl = url;
    return this;
  }
  
  addStyle(style: string): this {
    this.config.styles = [...(this.config.styles || []), style];
    return this;
  }
  
  setShadowMode(mode: 'open' | 'closed'): this {
    this.config.shadowMode = mode;
    return this;
  }
  
  setData(data: Record<string, unknown>): this {
    this.config.data = data;
    return this;
  }
  
  addMethod(
    name: string,
    fn: Function
  ): this {
    this.config.methods = {
      ...(this.config.methods || {}),
      [name]: fn
    };
    return this;
  }
  
  build(): ComponentConfig {
    if (!this.config.name) {
      throw new Error('Component name is required');
    }
    return { ...this.config };
  }
}
```

## Type Guards

### isAppConfig
Check if an object is an AppConfig.
```typescript
function isAppConfig(obj: unknown): obj is AppConfig {
  return typeof obj === 'object' &&
         obj !== null &&
         'name' in obj &&
         'version' in obj &&
         'env' in obj;
}
```

### isComponentConfig
Check if an object is a ComponentConfig.
```typescript
function isComponentConfig(obj: unknown): obj is ComponentConfig {
  return typeof obj === 'object' &&
         obj !== null &&
         'name' in obj;
}
```

## Best Practices

### 1. Environment-Based Configuration
```typescript
class EnvironmentConfig {
  private env: EnvConfig;
  
  constructor() {
    this.env = this.loadEnv();
  }
  
  private loadEnv(): EnvConfig {
    const env = process.env.NODE_ENV || 'development';
    
    switch (env) {
      case 'production':
        return this.loadProductionEnv();
      case 'test':
        return this.loadTestEnv();
      default:
        return this.loadDevelopmentEnv();
    }
  }
  
  private loadProductionEnv(): EnvConfig {
    return {
      NODE_ENV: 'production',
      API_URL: 'https://api.example.com',
      DEBUG: false,
      FEATURES: {
        newFeature: false
      }
    };
  }
  
  get<T extends keyof EnvConfig>(key: T): EnvConfig[T] {
    return this.env[key];
  }
}
```

### 2. Feature Flag Management
```typescript
class FeatureFlagManager {
  private flags: FeatureFlags;
  
  constructor(flags: FeatureFlags) {
    this.flags = flags;
  }
  
  isEnabled(feature: string): boolean {
    const flag = this.flags[feature];
    if (!flag) return false;
    
    if (!flag.enabled) return false;
    
    if (flag.dependencies?.some(dep => !this.isEnabled(dep))) {
      return false;
    }
    
    if (flag.rollout !== undefined) {
      return Math.random() < flag.rollout;
    }
    
    return true;
  }
  
  getConfig<T>(feature: string): T | undefined {
    return this.flags[feature]?.config as T;
  }
}
```

### 3. Configuration Validation
```typescript
class ConfigValidator {
  static validate<T>(
    config: T,
    schema: Record<keyof T, {
      type: string;
      required?: boolean;
      validate?: (value: any) => boolean;
    }>
  ): void {
    for (const [key, rules] of Object.entries(schema)) {
      const value = config[key as keyof T];
      
      if (rules.required && value === undefined) {
        throw new Error(`Missing required config key: ${key}`);
      }
      
      if (value !== undefined) {
        if (typeof value !== rules.type) {
          throw new Error(
            `Invalid type for ${key}. Expected ${rules.type}, got ${typeof value}`
          );
        }
        
        if (rules.validate && !rules.validate(value)) {
          throw new Error(`Validation failed for ${key}`);
        }
      }
    }
  }
}

// Usage
const configSchema = {
  name: { type: 'string', required: true },
  version: { type: 'string', required: true },
  debug: { type: 'boolean' },
  api: {
    type: 'object',
    validate: (value: unknown) => {
      return typeof value === 'object' &&
             value !== null &&
             'baseUrl' in value;
    }
  }
};

ConfigValidator.validate(config, configSchema);
```

## Related Topics

- [Component Types](component.md)
- [Router Types](router.md)
- [Storage Types](storage.md)
- [Examples](../../examples/README.md) 