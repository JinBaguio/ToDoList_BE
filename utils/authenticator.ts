// PACKAGES
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const configFile = require('./config.json');
//let configFile: any;

class Authenticator {
    private config: any;    
    //private certFilePath: string;
    private cert: any;
    
    constructor(configParam: any, certFile: any) {
        //this.loadConfiguration();
        //this.certFilePath = path.resolve(__dirname, this.config.certName);
        //this.certFilePath =  path.join("./", this.config.certName);
        //this.cert = fs.readFileSync(this.certFilePath); 
        this.config = configParam;     
        this.cert = certFile;
    }

    /**
     * Load configuration based on SERVERLESS_STAGE
     */
    private loadConfiguration() {        
        console.log("servelrss state: ",)
        switch (process.env.SERVERLESS_STAGE) {

            case 'prod': process.env.SERVERLESS_STAGE = 'prod';
                this.config = configFile.prod;
                break;
            case 'stage':process.env.SERVERLESS_STAGE = 'stage'; this.config = configFile.stage; break;
            case 'uat':
            case 'perf':
            case 'it':
            case 'test':process.env.SERVERLESS_STAGE = 'test';this.config = configFile.test;break;
            case 'dev': process.env.SERVERLESS_STAGE = 'dev';this.config = configFile.dev;break;
            default:
                process.env.SERVERLESS_STAGE = 'local'
                this.config = configFile.local;
        }
        console.log('Loading configurations for tjhis' + process.env.SERVERLESS_STAGE);
    }

    /**
     * A function to extract an access token from Authorization header.
     *
     * This function assumes the value complies with the format described
     * in "RFC 6750, 2.1. Authorization Request Header Field". For example,
     * if "Bearer 123" is given to this function, "123" is returned.
     *
     * @param {String} authorization
     * @returns {String}
     */
    private extractAccessToken(authorization: string): string | null {        
        // Regular expression pattern for authorization header
        const bearerTokenPattern = /^Bearer[ ]+([^ ]+)[ ]*$/i;

        // If the value of Authorization header is not available.
        if (!authorization) {
            // No access token.
            return null;
        }
    
        // Check if it matches the pattern "Bearer {access-token}".
        const result = bearerTokenPattern.exec(authorization);
    
        // If the Authorization header does not match the pattern.
        if (!result) {
            // No access token.
            return null;
        }
    
        // Return the access token.
        return result[1];
    }

    /**
     * Check if the scope requirement is fulfilled.
     *
     * @param {String[]} requiredScopes
     * @param {String[]} tokenScopes
     * @returns {boolean}
     */
    private checkScopeRequirement(requiredScopes: any, tokenScopes: any) {
        if (!tokenScopes) {
            console.log('Missing token scopes.');
            return false;
        }

        if (!requiredScopes) {
            console.log('Missing required scopes.');
            return false;
        }

        for (let i = 0; i < requiredScopes.length; i++) {
            if (tokenScopes.indexOf(requiredScopes[i]) === -1) {
                console.log('Missing ' + requiredScopes[i] + ' scope.');
                return false;
            }
        }

        return true;        
    }

    assess(event: any, tokenScopes?: string[]): any {
        const token = this.extractAccessToken(event.headers['Authorization']);
        let principalId: string = '';
        let clientId: string = '';
        let verdict: string = 'Unauthorized';
        let isAuthenticated: boolean = false;

        if (!token) {
            console.log('No access token.');            
        }

        jwt.verify(token, this.cert, {
            algorithms: this.config.algorithm,
            issuer: this.config.issuer
        }, (err: any, decoded: any) => {
            if(err){
                console.log('Jwt verify error: ', err.message);
                //throw new Error(err.message);
                verdict = 'Unauthorized: ' + err.message;
            } else {
                principalId = decoded.sub.match('^[^@]*')[0] || null;
                clientId = decoded['client_id'] || null;                
                isAuthenticated = true;

                // if (!this.checkScopeRequirement(this.config.scope, decoded.scope)) {
                //     verdict = 'Unauthorized';
                // } else {
                //     verdict = 'Authenticated';
                //     isAuthenticated = true;
                // }     
            }
        });

        return {
            principalId: principalId,
            clientId: clientId,
            verdict: verdict,
            isAuthenticated: isAuthenticated
        }
    }
}

export { Authenticator }
function loadConfiguration(configFile) {
    var config;
    console.log("process.env.SERVERLESS_STAGE",process.env.SERVERLESS_STAGE);
    switch (process.env.SERVERLESS_STAGE) {
        case 'prod':
            config = configFile.prod;
            break;
        case 'stage':process.env.SERVERLESS_STAGE = 'stage'; config = configFile.stage; break;
        case 'uat':
        case 'perf':
        case 'it':
        case 'test': process.env.SERVERLESS_STAGE = 'test';config = configFile.test;break;
        case 'dev': process.env.SERVERLESS_STAGE = 'dev';config = configFile.dev;break;
        // case 'sbx':
        //     config = configFile.stage;
        //     break;
        default:
            process.env.SERVERLESS_STAGE = 'local';
            config = configFile.local;
    }
    console.log('Loading configurations for 5' + process.env.SERVERLESS_STAGE);
    return config;
}