"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.D7Api = void 0;
class D7Api {
    constructor() {
        this.description = {
            displayName: 'D7 SMS API',
            name: 'd7Api',
            icon: 'file:d7.svg',
            group: ['transform'],
            version: 1,
            description: 'Send messages using the D7 API',
            defaults: {
                name: 'D7 SMS API',
                color: '#1F8E3C',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Recipient Numbers',
                    name: 'recipients',
                    type: 'string',
                    default: '',
                    description: 'Comma-separated list of phone numbers to send messages to.',
                },
                {
                    displayName: 'Message Content',
                    name: 'content',
                    type: 'string',
                    default: '',
                    description: 'The content of the message to be sent.',
                },
                {
                    displayName: 'API Key',
                    name: 'apiKey',
                    type: 'string',
                    default: '',
                    description: 'Paste the API key from the D7 portal.',
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const recipients = this.getNodeParameter('recipients', 0);
            const content = this.getNodeParameter('content', 0);
            const apiKey = this.getNodeParameter('apiKey', 0);
            const url = 'https://api.d7networks.com/messages/v1/send';
            const messageData = {
                messages: [
                    {
                        channel: 'sms',
                        client_ref: 'D7-AirTableSMS',
                        recipients: recipients.split(','),
                        content: content,
                        msg_type: 'text',
                        data_coding: 'text',
                    },
                ],
                message_globals: {
                    originator: 'SignOTP',
                },
            };
            const options = {
                method: 'POST',
                body: JSON.stringify(messageData),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            };
            const response = yield this.helpers.request(url, options);
            return [
                [
                    {
                        json: response,
                    },
                ],
            ];
        });
    }
}
exports.D7Api = D7Api;
