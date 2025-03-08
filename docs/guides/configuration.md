# QCObjects Configuration Guide

> **Note**: This documentation was created with the assistance of AI technology. While we strive for accuracy, some information may not be 100% accurate or may need validation. Please refer to the official QCObjects documentation for the most up-to-date and verified information.

## Table of Contents
- [Project Configuration](#project-configuration)
- [TypeScript Configuration](#typescript-configuration)
- [Build Configuration](#build-configuration)
- [Development Configuration](#development-configuration)
- [Deployment Configuration](#deployment-configuration)
- [Testing Configuration](#testing-configuration)
- [Application Configuration (config.json)](#application-configuration-configjson)
- [Cloud Provider Integration](#cloud-provider-integration)

## Project Configuration

### Package.json Configuration
```json
{
  "name": "your-app-name",
  "version": "x.x.x",
  "type": "module",        // Enable ES modules
  "types": "src/**/*.d.ts", // TypeScript type definitions
  "browserslist": "> 0.5%, last 2 versions, not dead",
  "engines": {
    "npm": ">=8",
    "node": ">=16"
  }
}
```

### Watch Configuration
Configure file watching for development:
```json
{
  "watch": {
    "start": {
      "patterns": ["src"],
      "extensions": "ts,html,css",
      "quiet": true,
      "legacyWatch": true,
      "delay": 2500,
      "runOnChangeOnly": false
    }
  }
}
```

## TypeScript Configuration

### Basic TypeScript Settings
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowJs": true,
    "checkJs": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./build",
    "removeComments": true
  }
}
```

### Module Resolution
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "qcobjects": ["node_modules/qcobjects"],
      "qcobjects-sdk": ["node_modules/qcobjects-sdk"]
    }
  }
}
```

### Type Checking
```json
{
  "compilerOptions": {
    "strict": true,
    "skipLibCheck": true,
    "types": ["node", "jasmine"],
    "forceConsistentCasingInFileNames": true
  }
}
```

## Build Configuration

### Build Scripts
```json
{
  "scripts": {
    "build:ts": "npm test && npx tsc",
    "build:ts-types": "npx tsc --project tsconfig.d.json",
    "build:static": "qcobjects publish:static src/ build/",
    "build": "npm run publish:web",
    "publish:static": "(qcobjects publish:static build/ public/) && npm run minify:css",
    "publish:web": "npm run build:static && npm run build:ts && npm run publish:static && npm run publish:esbuild && npm run generate-sw"
  }
}
```

### ESBuild Configuration
```json
{
  "scripts": {
    "publish:esbuild": "npx esbuild build/js/*.js build/js/**/*.js --bundle --outdir=public/js --keep-names --minify --global-name=global --sourcemap --splitting --chunk-names=chunks/[name]-[hash] --format=esm --target=es2021"
  }
}
```

### CSS Minification
```json
{
  "scripts": {
    "minify:css": "npx esbuild build/css/*.css build/css/**/*.css --outdir=public/css --keep-names --minify --global-name=global --sourcemap --loader:.svg=file --target=es2021"
  }
}
```

## Development Configuration

### Development Server
```json
{
  "scripts": {
    "start": "npm run createcert && npm run serve",
    "serve": "qcobjects-server",
    "start:dev": "npm-watch start"
  }
}
```

### Development Tools
```json
{
  "devDependencies": {
    "@types/jasmine": "^5.1.4",
    "@types/node": "^20.11.24",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint": "^8.56.0",
    "typescript": "^5.0.4"
  }
}
```

## Deployment Configuration

### Docker Deployment
```json
{
  "scripts": {
    "build:docker": "docker build -t qcobjects/qcobjects-newapp:latest .",
    "build:docker-compose": "docker-compose -f docker-compose.yml build --no-cache --force-rm --pull -q qcobjects",
    "publish:docker": "docker push qcobjects/qcobjects-newapp:latest",
    "deploy:docker": "npm run build:docker && npm run publish:docker"
  }
}
```

### Platform-Specific Deployment
```json
{
  "scripts": {
    "publish:ios": "qcobjects publish ios",
    "publish:android": "qcobjects publish android",
    "publish:electron": "qcobjects publish electron",
    "publish:web": "npm run build:static && npm run build:ts && npm run publish:static && npm run publish:esbuild && npm run generate-sw"
  }
}
```

### Cloud Platform Configuration
```json
{
  "scripts": {
    "azure-server": "npm start",
    "aws-server": "npm start",
    "do-server": "npm start",
    "gae-server": "qcobjects-gae-server"
  }
}
```

## Testing Configuration

### Test Scripts
```json
{
  "scripts": {
    "test": "npm run lint && NODE_OPTIONS=--experimental-vm-modules jasmine",
    "lint": "npx eslint . --config eslint.config.js --max-warnings 4",
    "coverage": "nyc --reporter=lcov --reporter=text-summary npm run test"
  }
}
```

### Performance Testing
```json
{
  "scripts": {
    "lighthouse": "lighthouse https://127.0.0.1:8443/ --quiet --chrome-flags=\"--ignore-certificate-errors\" --budget-path=./lighthouse-budget.json --output html --output-path ./lighthouse/lighthouse-report.html --view"
  }
}
```

## Environment-Specific Configuration

### Development Environment
```json
{
  "targets": {
    "default": {
      "source": "build/index.html",
      "distDir": "public"
    }
  }
}
```

### Production Environment
Create a `config.json` in your project root:
```json
{
  "production": {
    "host": "your-production-domain.com",
    "port": 443,
    "protocol": "https",
    "ssl": {
      "cert": "path/to/cert.pem",
      "key": "path/to/key.pem"
    }
  }
}
```

## Security Configuration

### SSL Configuration
```json
{
  "scripts": {
    "createcert": "qcobjects-createcert"
  }
}
```

### Service Worker Configuration
```json
{
  "scripts": {
    "generate-sw": "npx qcobjects generate-sw your-app-name -d public"
  }
}
```

## Best Practices

1. **Version Control**
   ```json
   {
     "scripts": {
       "sync": "git add . && git commit -am ",
       "preversion": "npm i --upgrade && npm test",
       "postversion": "git push && git push --tags"
     }
   }
   ```

2. **Code Quality**
   ```json
   {
     "lint-staged": {
       "**/*": "prettier --write --ignore-unknown"
     }
   }
   ```

3. **Dependencies Management**
   ```json
   {
     "resolutions": {
       "typescript": "^5.0.4",
       "eslint": "^8.56.0"
     }
   }
   ```

## Related Resources

- [QCObjects Official Documentation](https://docs.qcobjects.org/)
- [TypeScript Configuration](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [ESBuild Documentation](https://esbuild.github.io/)
- [Docker Documentation](https://docs.docker.com/)

## Application Configuration (config.json)

### Core Settings
```json
{
  "domain": "$ENV(DOMAIN)",
  "certificate_provider": "$ENV(CERTIFICATE_PROVIDER)",
  "devmode": "$ENV(DEVMODE)",
  "autodiscover": true,
  "autodiscover_commands": true,
  "autodiscover_handlers": true,
  "documentRoot": "$config(projectPath)public/",
  "documentRootFileIndex": "index.html",
  "cacheControl": "max-age=31536000",
  "relativeImportPath": "js/packages/",
  "useLocalSDK": true,
  "useLegacyHTTP": false
}
```

### Server Configuration
```json
{
  "serverPortHTTP": "8080",
  "serverPortHTTPS": "8443",
  "private-key-pem": "$config(domain)-privkey.pem",
  "private-cert-pem": "$config(domain)-cert.pem",
  "enableShellCommands": true
}
```

### Backend Configuration

#### Database Settings
```json
{
  "backend": {
    "db_engine": {
      "name": "$ENV(ENGINE_NAME)",
      "databaseName": "$ENV(DATABASE_NAME)"
    }
  }
}
```

#### Authentication Settings
```json
{
  "backend": {
    "auth": {
      "enabled": true,
      "defaultUser": "$ENV(DEFAULT_USER)",
      "defaultPasswd": "$ENV(DEFAULT_PASSWORD)",
      "microsoftapikey": "$ENV(MICROSOFT_API_KEY)",
      "googleapikey": "$ENV(GOOGLE_API_KEY)"
    }
  }
}
```

#### Route Configuration
```json
{
  "backend": {
    "routes": [
      {
        "name": "Route Name",
        "description": "Route Description",
        "path": "^/path-pattern$",
        "microservice": "microservice.name",
        "headers": {
          "content-type": "text/html; charset=utf-8"
        },
        "responseHeaders": {},
        "cors": {
          "allow_origins": "*"
        }
      }
    ]
  }
}
```

### Package Structure
```json
{
  "package": {
    "source": {
      "backend": "backend",
      "frontend": "src"
    },
    "build": "build",
    "dist": "dist"
  }
}
```

### Environment Variables
QCObjects supports environment variables in configuration using `$ENV()` syntax:

```json
{
  "OPENAI_API_KEY": "$ENV(OPENAI_API_KEY)",
  "domain": "$ENV(DOMAIN)",
  "devmode": "$ENV(DEVMODE)"
}
```

### Configuration Reference

#### Core Settings
- `domain`: Application domain (from environment)
- `certificate_provider`: SSL certificate provider
- `devmode`: Development mode flag
- `autodiscover`: Enable automatic discovery of components
- `autodiscover_commands`: Enable automatic discovery of commands
- `autodiscover_handlers`: Enable automatic discovery of handlers
- `documentRoot`: Root directory for static files
- `documentRootFileIndex`: Default index file
- `cacheControl`: Cache control header value
- `relativeImportPath`: Path for package imports
- `useLocalSDK`: Use local SDK instead of CDN
- `useLegacyHTTP`: Enable legacy HTTP support

#### Server Settings
- `serverPortHTTP`: HTTP port (default: 8080)
- `serverPortHTTPS`: HTTPS port (default: 8443)
- `private-key-pem`: SSL private key file
- `private-cert-pem`: SSL certificate file
- `enableShellCommands`: Enable shell command execution

#### Backend Settings
1. **Database Configuration**
   - `db_engine.name`: Database engine name
   - `db_engine.databaseName`: Database name

2. **Authentication**
   - `auth.enabled`: Enable authentication
   - `auth.defaultUser`: Default user credentials
   - `auth.defaultPasswd`: Default password
   - `auth.microsoftapikey`: Microsoft API key
   - `auth.googleapikey`: Google API key

3. **Routes**
   - `name`: Route identifier
   - `description`: Route description
   - `path`: URL pattern (regex)
   - `microservice`: Associated microservice
   - `headers`: Request headers
   - `responseHeaders`: Response headers
   - `cors`: CORS configuration

#### Package Structure
- `source.backend`: Backend source directory
- `source.frontend`: Frontend source directory
- `build`: Build output directory
- `dist`: Distribution directory

### Best Practices

1. **Environment Variables**
   - Use `$ENV()` for sensitive information
   - Keep credentials in environment variables
   - Use different environments for development/production

2. **Security**
   - Enable CORS only when necessary
   - Configure proper cache control
   - Use HTTPS in production
   - Keep API keys in environment variables

3. **Development**
   - Enable `devmode` in development
   - Use `autodiscover` for easier development
   - Configure proper logging levels

4. **Production**
   - Disable `devmode`
   - Configure proper cache settings
   - Set up proper SSL certificates
   - Configure proper CORS settings

## Cloud Provider Integration

### Amazon Web Services (AWS)

#### AWS Elastic Beanstalk Configuration
```json
{
  "aws": {
    "region": "$ENV(AWS_REGION)",
    "elasticbeanstalk": {
      "environment": "$ENV(AWS_EB_ENV)",
      "application": "$ENV(AWS_EB_APP)",
      "platform": "Node.js",
      "port": 8080
    }
  }
}
```

#### AWS Lambda Configuration
```json
{
  "aws": {
    "lambda": {
      "runtime": "nodejs18.x",
      "handler": "index.handler",
      "memory": 128,
      "timeout": 30,
      "environment": {
        "variables": {
          "NODE_ENV": "production",
          "DOMAIN": "$ENV(DOMAIN)"
        }
      }
    }
  }
}
```

#### Example Elastic Beanstalk Configuration File
```yaml
# .elasticbeanstalk/config.yml
branch-defaults:
  main:
    environment: your-env-name
    group_suffix: null
global:
  application_name: your-app-name
  branch: null
  default_ec2_keyname: null
  default_platform: Node.js 18
  default_region: us-east-1
  include_git_submodules: true
  instance_profile: null
  platform_name: null
  platform_version: null
  profile: null
  repository: null
  sc: git
  workspace_type: Application
```

### Microsoft Azure

#### Azure App Service Configuration
```json
{
  "azure": {
    "appService": {
      "name": "$ENV(AZURE_APP_NAME)",
      "resourceGroup": "$ENV(AZURE_RESOURCE_GROUP)",
      "runtime": "NODE|18-lts",
      "settings": {
        "WEBSITE_NODE_DEFAULT_VERSION": "~18",
        "SCM_DO_BUILD_DURING_DEPLOYMENT": "true"
      }
    }
  }
}
```

#### Example Azure Configuration File
```json
// azure.config.json
{
  "configurations": {
    "appService": {
      "port": 8080,
      "nodeVersion": "~18",
      "startupCommand": "npm run azure-server"
    },
    "staticWebApp": {
      "outputLocation": "public",
      "apiLocation": "api",
      "appLocation": "/"
    }
  }
}
```

### Google Cloud Platform (GCP)

#### App Engine Configuration
```json
{
  "gcp": {
    "appEngine": {
      "service": "$ENV(GAE_SERVICE)",
      "runtime": "nodejs18",
      "env": "standard",
      "instance_class": "F1"
    }
  }
}
```

#### Example App Engine Configuration File
```yaml
# app.yaml
runtime: nodejs18
env: standard
instance_class: F1

env_variables:
  NODE_ENV: "production"
  DOMAIN: "$ENV(DOMAIN)"

handlers:
- url: /.*
  script: auto
  secure: always

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10
```

### Digital Ocean

#### App Platform Configuration
```json
{
  "digitalocean": {
    "app": {
      "name": "$ENV(DO_APP_NAME)",
      "region": "$ENV(DO_REGION)",
      "environment": "production",
      "instance": {
        "size": "basic-xxs",
        "count": 1
      }
    }
  }
}
```

#### Example App Specification
```yaml
# .do/app.yaml
name: qcobjects-app
region: nyc
services:
- name: web
  github:
    branch: main
    deploy_on_push: true
    repo: owner/repository
  build_command: npm run build
  run_command: npm run do-server
  environment_slug: nodejs
  instance_count: 1
  instance_size_slug: basic-xxs
```

### Common Cloud Configuration Patterns

#### Environment Variables
```json
{
  "cloud": {
    "environment": {
      "NODE_ENV": "production",
      "DOMAIN": "$ENV(DOMAIN)",
      "PORT": "$ENV(PORT)",
      "SSL_CERT": "$ENV(SSL_CERT)",
      "SSL_KEY": "$ENV(SSL_KEY)"
    }
  }
}
```

#### Static File Serving
```json
{
  "cloud": {
    "static": {
      "directory": "public",
      "headers": {
        "Cache-Control": "public, max-age=31536000",
        "Access-Control-Allow-Origin": "*"
      }
    }
  }
}
```

#### Health Checks
```json
{
  "cloud": {
    "health": {
      "path": "/health",
      "interval": "30s",
      "timeout": "5s",
      "unhealthy_threshold": 2,
      "healthy_threshold": 2
    }
  }
}
```

### Best Practices for Cloud Deployment

1. **Environment Configuration**
   - Use environment variables for sensitive data
   - Configure different settings for development/staging/production
   - Use cloud provider's secret management services

2. **Performance Optimization**
   - Enable CDN for static assets
   - Configure proper caching headers
   - Use auto-scaling when available
   - Implement health checks

3. **Security**
   - Enable HTTPS
   - Configure proper CORS settings
   - Use managed SSL certificates
   - Implement proper access controls

4. **Monitoring**
   - Set up logging
   - Configure performance monitoring
   - Set up alerts for critical issues
   - Implement proper error tracking

5. **Cost Optimization**
   - Use appropriate instance sizes
   - Implement auto-scaling rules
   - Configure proper caching
   - Monitor resource usage

[Previous sections remain unchanged...] 