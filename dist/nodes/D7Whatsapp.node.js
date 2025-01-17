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
exports.D7Whatsapp = void 0;
class D7Whatsapp {
    constructor() {
        this.description = {
            displayName: 'D7 WhatsApp API',
            name: 'd7Whatsapp',
            icon: 'file:d7.svg',
            group: ['transform'],
            version: 1,
            description: 'Send WhatsApp messages using the D7 API',
            defaults: {
                name: 'D7 WhatsApp API',
                color: '#25D366',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Message Type',
                    name: 'messageType',
                    type: 'options',
                    options: [
                        { name: 'WhatsApp Utility Text', value: 'utilityText' },
                        { name: 'WhatsApp Utility Media', value: 'utilityMedia' },
                        { name: 'WhatsApp Marketing Text', value: 'marketingText' },
                        { name: 'WhatsApp Marketing Media', value: 'marketingMedia' },
                        { name: 'WhatsApp Service Text', value: 'serviceText' },
                        { name: 'WhatsApp Service Media', value: 'serviceMedia' },
                    ],
                    default: 'utilityText',
                    required: true,
                },
                {
                    displayName: 'Originator',
                    name: 'originator',
                    type: 'string',
                    default: '',
                    description: 'WhatsApp number registered with D7 Networks',
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
                            messageType: ['utilityText', 'utilityMedia', 'marketingText', 'marketingMedia'],
                        },
                    },
                    required: true,
                },
                {
                    displayName: 'Language',
                    name: 'language',
                    type: 'string',
                    default: 'en',
                    description: 'Template language code',
                    displayOptions: {
                        show: {
                            messageType: ['utilityText', 'utilityMedia', 'marketingText', 'marketingMedia'],
                        },
                    },
                },
                {
                    displayName: 'Message Body',
                    name: 'messageBody',
                    type: 'string',
                    default: '',
                    description: 'Text message content',
                    displayOptions: {
                        show: {
                            messageType: ['serviceText'],
                        },
                    },
                    required: true,
                },
                {
                    displayName: 'Preview URL',
                    name: 'previewUrl',
                    type: 'boolean',
                    default: true,
                    description: 'Enable URL preview in message',
                    displayOptions: {
                        show: {
                            messageType: ['serviceText'],
                        },
                    },
                },
                {
                    displayName: 'Media Caption',
                    name: 'mediaCaption',
                    type: 'string',
                    default: '',
                    description: 'Caption for the media',
                    displayOptions: {
                        show: {
                            messageType: ['serviceMedia'],
                        },
                    },
                },
                {
                    displayName: 'Media URL',
                    name: 'mediaUrl',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            messageType: ['utilityMedia', 'marketingMedia', 'serviceMedia'],
                        },
                    },
                    description: 'URL of the media to be sent',
                },
                {
                    displayName: 'Media Type',
                    name: 'mediaType',
                    type: 'options',
                    displayOptions: {
                        show: {
                            messageType: ['utilityMedia', 'marketingMedia', 'serviceMedia'],
                        },
                    },
                    options: [
                        { name: 'Image', value: 'image' },
                        { name: 'Video', value: 'video' },
                        { name: 'Document', value: 'document' },
                    ],
                    default: 'image',
                },
                {
                    displayName: 'Recipients',
                    name: 'recipients',
                    type: 'string',
                    default: '',
                    description: 'Comma-separated list of phone numbers to send messages to',
                    required: true,
                },
                {
                    displayName: 'Body Parameters',
                    name: 'bodyParameters',
                    type: 'fixedCollection',
                    typeOptions: {
                        multipleValues: true,
                    },
                    displayOptions: {
                        show: {
                            messageType: ['utilityText', 'utilityMedia', 'marketingText', 'marketingMedia'],
                        },
                    },
                    default: {},
                    options: [
                        {
                            name: 'parameters',
                            displayName: 'Parameter',
                            values: [
                                { displayName: 'Key', name: 'key', type: 'string', default: '' },
                                { displayName: 'Value', name: 'value', type: 'string', default: '' },
                            ],
                        },
                    ],
                    description: 'Template body parameters',
                },
                {
                    displayName: 'API Key',
                    name: 'apiKey',
                    type: 'string',
                    default: '',
                    description: 'API Key from D7 portal',
                    required: true,
                },
            ],
        };
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const messageType = this.getNodeParameter('messageType', 0);
            const originator = this.getNodeParameter('originator', 0);
            const recipients = this.getNodeParameter('recipients', 0);
            const apiKey = this.getNodeParameter('apiKey', 0);
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
            const options = {
                method: 'POST',
                body: JSON.stringify(messageData),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            };
            const response = yield this.helpers.request('https://api.d7networks.com/whatsapp/v2/send', options);
            return [[{ json: response }]];
        });
    }
}
exports.D7Whatsapp = D7Whatsapp;
