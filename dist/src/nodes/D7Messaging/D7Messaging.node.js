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
exports.D7Messaging = void 0;
class D7Messaging {
    constructor() {
        this.description = {
            displayName: 'D7 Messaging',
            name: 'd7Messaging',
            icon: 'file:d7.svg',
            group: ['transform'],
            version: 1,
            description: 'Send messages using D7 APIs (SMS & WhatsApp)',
            defaults: {
                name: 'D7 Messaging',
            },
            inputs: ['main'],
            outputs: ['main'],
            credentials: [
                {
                    name: 'd7Api',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Channel',
                    name: 'channel',
                    type: 'options',
                    options: [
                        { name: 'SMS', value: 'sms' },
                        { name: 'WhatsApp', value: 'whatsapp' },
                    ],
                    default: 'sms',
                    required: true,
                },
                {
                    displayName: 'Message Content',
                    name: 'content',
                    type: 'string',
                    default: '',
                    description: 'The content of the SMS message',
                    displayOptions: {
                        show: {
                            channel: ['sms'],
                        },
                    },
                },
                {
                    displayName: 'Message Type',
                    name: 'messageType',
                    type: 'options',
                    displayOptions: {
                        show: {
                            channel: ['whatsapp'],
                        },
                    },
                    options: [
                        { name: 'WhatsApp Marketing Media', value: 'marketingMedia' },
                        { name: 'WhatsApp Marketing Text', value: 'marketingText' },
                        { name: 'WhatsApp Service Media', value: 'serviceMedia' },
                        { name: 'WhatsApp Service Text', value: 'serviceText' },
                        { name: 'WhatsApp Utility Media', value: 'utilityMedia' },
                        { name: 'WhatsApp Utility Text', value: 'utilityText' },
                    ],
                    default: 'utilityText',
                },
                {
                    displayName: 'Originator',
                    name: 'originator',
                    type: 'string',
                    default: '',
                    description: 'WhatsApp number registered with D7 Networks',
                    displayOptions: {
                        show: {
                            channel: ['whatsapp'],
                        },
                    },
                    required: true,
                },
                {
                    displayName: 'Template ID',
                    name: 'templateId',
                    type: 'string',
                    default: '',
                    description: 'Template ID from D7 portal',
                    displayOptions: {
                        show: {
                            channel: ['whatsapp'],
                            messageType: [
                                'utilityText',
                                'utilityMedia',
                                'marketingText',
                                'marketingMedia',
                            ],
                        },
                    },
                    required: true,
                },
                {
                    displayName: 'Whether to Preview URL',
                    name: 'previewUrl',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to enable URL preview in message',
                    displayOptions: {
                        show: {
                            channel: ['whatsapp'],
                            messageType: ['serviceText'],
                        },
                    },
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const credentials = yield this.getCredentials('d7Api');
            const apiKey = credentials.apiKey;
            const channel = this.getNodeParameter('channel', 0);
            const recipients = this.getNodeParameter('recipients', 0);
            if (channel === 'sms') {
                const content = this.getNodeParameter('content', 0);
                const messageData = {
                    messages: [
                        {
                            channel: 'sms',
                            recipients: recipients.split(','),
                            content,
                            msg_type: 'text',
                            data_coding: 'text',
                        },
                    ],
                    message_globals: {
                        originator: 'SignOTP',
                    },
                };
                const response = yield this.helpers.request('https://api.d7networks.com/messages/v1/send', {
                    method: 'POST',
                    body: JSON.stringify(messageData),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                });
                return [[{ json: response }]];
            }
            else {
                const messageType = this.getNodeParameter('messageType', 0);
                const originator = this.getNodeParameter('originator', 0);
                const recipientsList = recipients.split(',').map((recipient) => ({
                    recipient: recipient.trim(),
                    recipient_type: 'individual',
                }));
                let content;
                if (messageType === 'serviceText') {
                    const messageBody = this.getNodeParameter('messageBody', 0);
                    const previewUrl = this.getNodeParameter('previewUrl', 0);
                    content = {
                        message_type: 'TEXT',
                        text: {
                            preview_url: previewUrl,
                            body: messageBody,
                        },
                    };
                }
                else if (messageType === 'serviceMedia') {
                    const mediaUrl = this.getNodeParameter('mediaUrl', 0);
                    const mediaType = this.getNodeParameter('mediaType', 0);
                    const mediaCaption = this.getNodeParameter('mediaCaption', 0);
                    content = {
                        message_type: 'ATTACHMENT',
                        attachment: {
                            type: mediaType,
                            url: mediaUrl,
                            caption: mediaCaption,
                        },
                    };
                }
                else {
                    const templateId = this.getNodeParameter('templateId', 0);
                    const language = this.getNodeParameter('language', 0);
                    const bodyParametersData = this.getNodeParameter('bodyParameters', 0);
                    const bodyParameterValues = {};
                    if (bodyParametersData.parameters) {
                        bodyParametersData.parameters.forEach((param) => {
                            bodyParameterValues[param.key] = param.value;
                        });
                    }
                    content = {
                        message_type: 'TEMPLATE',
                        template: {
                            template_id: templateId,
                            language,
                            body_parameter_values: bodyParameterValues,
                        },
                    };
                    if (messageType.includes('Media')) {
                        const mediaUrl = this.getNodeParameter('mediaUrl', 0);
                        const mediaType = this.getNodeParameter('mediaType', 0);
                        content.template.media = {
                            media_type: mediaType,
                            media_url: mediaUrl,
                        };
                    }
                }
                const messageData = {
                    messages: [
                        {
                            originator,
                            content,
                            recipients: recipientsList,
                        },
                    ],
                };
                const response = yield this.helpers.request('https://api.d7networks.com/whatsapp/v2/send', {
                    method: 'POST',
                    body: JSON.stringify(messageData),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                    },
                });
                return [[{ json: response }]];
            }
        });
    }
}
exports.D7Messaging = D7Messaging;
