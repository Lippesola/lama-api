# 🦙 Lippesola Administration und Mitarbeiter Anmeldung - API

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

## Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).


## Environment Variables

|Environment Variable|Discription|Example / possible values|
|------|------|-------|
|KEYCLOAK_CLIENTID|OIDC Client ID|lama|
|KEYCLOAK_URL| Keycloak Base URL| https://keycloak.example.com/auth|
|KEYCLOAK_REALM| Realm in Keycloak to use| `Lippesola`|
|LAMA_APP_URL| Frontend URL of LAMA| https://lama.example.com, https://example.com/lama|
