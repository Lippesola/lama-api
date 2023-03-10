# LAMA API
🦙 Lippesola Administration und Mitarbeiter Anmeldung backend

----
## Deploy

### Volumes
LAMA API needs persistant storage under `/lama-api/uploads`


## Environment Variables

|Environment Variable|Description|Example / possible values|
|------|------|-------|
|DB_HOST| Host of the Database Server|`localhost`,`192.168.1.23:3306`, `172.16.2.45:5432`
|DB_USER| Database user|lamauser
|DB_PASS| Database password|`sdfgDFG` (do not use that one ;)
|DB_NAME| Database name|lamadb|
|DB_VENDOR| Database backend|`mariadb`,`mariadb`,`postgres`,`sqlite`, `mssql`, `db2`, `snowflake`, `oracle`
|KEYCLOAK_CLIENTID|OIDC Client ID|lama
|KEYCLOAK_URL| Keycloak Base URL| https://keycloak.example.com/auth|
|KEYCLOAK_REALM| Realm in Keycloak to use| `Lippesola`
|KEYCLOAK_ADMIN_USER| Keycloak admin username| `lamadmin`
|KEYCLOAK_ADMIN_PASS| Keycloak admin username| `top-secret`
|KEYCLOAK_ADMIN_CLIENTID| Keycloak admin clientId| `admin-cli`
|LAMA_APP_URL| Frontend URL of LAMA| https://lama.example.com, https://example.com/lama
