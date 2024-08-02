# CONFIG.md

## Overview
This document provides detailed information about the configuration fields used in the `config.yaml` file.

## Configuration Fields

### General Settings
- **devmode**: Specifies the development mode level. Possible values: `info`, `debug`, `warn`, `error`.
- **autodiscover**: Enables or disables the autodiscovery of components. Possible values: `true`, `false`.
- **autodiscover_commands**: Enables or disables the autodiscovery of commands. Possible values: `true`, `false`.
- **autodiscover_handlers**: Enables or disables the autodiscovery of handlers. Possible values: `true`, `false`.
- **documentRoot**: Sets the root directory for serving documents. Example: `"$config(projectPath)public/"`.
- **documentRootFileIndex**: Specifies the default file to serve when accessing the document root. Example: `index.html`.
- **cacheControl**: Defines the cache control policy. Example: `max-age=31536000`.
- **relativeImportPath**: Sets the relative path for importing JavaScript packages. Example: `js/packages/`.
- **serverPortHTTP**: Specifies the port for the HTTP server. Example: `'8080'`.
- **serverPortHTTPS**: Specifies the port for the HTTPS server. Example: `'8443'`.
- **useLocalSDK**: Enables or disables the use of the local SDK. Possible values: `true`, `false`.
- **useLegacyHTTP**: Enables or disables the use of legacy HTTP. Possible values: `true`, `false`.
- **private-key-pem**: Path to the private key PEM file. Example: `"$config(domain)-privkey.pem"`.
- **private-cert-pem**: Path to the private certificate PEM file. Example: `"$config(domain)-cert.pem"`.
- **enableShellCommands**: Enables or disables shell commands. Possible values: `true`, `false`.

### Backend Configuration
- **backend**: Contains backend-specific settings.
  - **db_engine**: Database engine configuration.
    - **name**: Name of the database engine. Example: `"$ENV(ENGINE_NAME)"`.
    - **databaseName**: Name of the database. Example: `"$ENV(DATABASE_NAME)"`.
  - **auth**: Authentication settings.
    - **enabled**: Enables or disables authentication. Possible values: `true`, `false`.
    - **defaultUser**: Default username for authentication. Example: `"$ENV(DEFAULT_USER)"`.
    - **defaultPasswd**: Default password for authentication. Example: `"$ENV(DEFAULT_PASSWORD)"`.
    - **microsoftapikey**: API key for Microsoft services. Example: `"$ENV(MICROSOFT_API_KEY)"`.
    - **googleapikey**: API key for Google services. Example: `"$ENV(GOOGLE_API_KEY)"`.
  - **routes**: List of route configurations.
    - **name**: Name of the route.
    - **description**: Description of the route.
    - **path**: Path pattern for the route.
    - **microservice**: Microservice handling the route.
    - **redirect_to**: Redirection target for the route.
    - **responseHeaders**: Headers to include in the response.
    - **cors**: CORS settings for the route.
      - **allow_origins**: Allowed origins for CORS. Example: `"*"`.

### Package Configuration
- **package**: Contains package-specific settings.
  - **source**: Source directories for the package.
    - **backend**: Source directory for backend code. Example: `backend`.
    - **frontend**: Source directory for frontend code. Example: `src`.
  - **build**: Build directory. Example: `build`.
  - **dist**: Distribution directory. Example: `dist`.

