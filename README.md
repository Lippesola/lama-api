# LAMA API
🦙 Lippesola Administration und Mitarbeiter Anmeldung backend

----
## Local Development

Keycloak + Datenbank laufen in Docker, die API läuft direkt auf dem Host. So sehen Browser, Frontend und API alle dieselbe Keycloak-URL (`http://localhost:8180`) — der `iss`-Claim der Tokens matcht ohne `/etc/hosts`-Änderungen.

```bash
# Terminal 1 — Keycloak + Datenbank
docker compose up -d

# Terminal 2 — API (beim ersten Mal: cp .env.example .env, dann ggf. anpassen)
cp .env.example .env
npm ci
npm start

# Terminal 3 — Frontend (im lama-app-Verzeichnis)
quasar dev
```

Für das vollständig containerisierte Setup (z. B. in CI):
```bash
docker compose --profile full up
```

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
