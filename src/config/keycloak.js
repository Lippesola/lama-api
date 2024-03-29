import session from 'express-session'
import Keycloak from 'keycloak-connect'

let _keycloak;

var keycloakConfig = {
    bearerOnly: true,
    serverUrl: process.env.KEYCLOAK_URL || 'https://account.lippesola.de/auth',
    realm: process.env.KEYCLOAK_REALM || 'solaid'
};

function getKeycloak() {
    if (_keycloak) {
        return _keycloak;
    } 
    else {
        console.log("Initializing Keycloak...");
        var memoryStore = new session.MemoryStore();
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
}

export default getKeycloak()