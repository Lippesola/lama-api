import KcAdminClient from '@keycloak/keycloak-admin-client';
const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_URL || 'https://account.lippesola.de/auth',
    realmName: process.env.KEYCLOAK_REALM || 'Lippesola.de',
});

await kcAdminClient.auth({
    username: process.env.KEYCLOAK_ADMIN_USER || 'admin-lama',
    password: process.env.KEYCLOAK_ADMIN_PASS || 'top-secret',
    grantType: 'password',
    clientId: process.env.KEYCLOAK_ADMIN_CLIENTID || 'admin-cli'
});

export default kcAdminClient