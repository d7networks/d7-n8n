"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.D7Api = void 0;
class D7Api {
    constructor() {
        this.name = 'd7Api';
        this.displayName = 'D7 API credentials';
        this.documentationUrl = 'https://d7networks.com/';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                default: '',
                description: 'The API key for the D7 API',
            },
        ];
    }
}
exports.D7Api = D7Api;
