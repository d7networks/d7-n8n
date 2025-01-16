import {
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class D7Api implements ICredentialType {
    name = 'd7Api';
    displayName = 'D7 API';
    documentationUrl = 'https://d7networks.com/';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
            description: 'The API key for the D7 API',
        },
    ];
}