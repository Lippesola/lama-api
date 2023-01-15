# LAMA API
🦙 Lippesola Administration und Mitarbeiter Anmeldung backend

----

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
|DB_HOST| Host of the Database Server|`localhost`,`192.168.1.23:3306`, `172.16.2.45:5432`
|DB_USER| Database user|lamauser
|DB_PASS| Database password|`sdfgDFG` (do not use that one ;)
|DB_NAME| Database name|lamadb|
|DB_VENDOR| Database backend|`mariadb`,`mariadb`,`postgres`,`sqlite`, `mssql`, `db2`, `snowflake`, `oracle`
|KEYCLOAK_CLIENTID|OIDC Client ID|lama
|KEYCLOAK_URL| Keycloak Base URL| https://keycloak.example.com/auth|
|KEYCLOAK_REALM| Realm in Keycloak to use| `Lippesola`
|LAMA_APP_URL| Frontend URL of LAMA| https://lama.example.com, https://example.com/lama
