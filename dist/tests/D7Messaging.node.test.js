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
const D7Messaging_node_1 = require("../src/nodes/D7Messaging/D7Messaging.node");
describe('D7Messaging', () => {
    let node;
    let mockExecuteFunction;
    beforeEach(() => {
        node = new D7Messaging_node_1.D7Messaging();
        mockExecuteFunction = {
            getNodeParameter: jest.fn(),
            getCredentials: jest.fn(),
            helpers: {
                request: jest.fn(),
            },
        };
        mockExecuteFunction.getCredentials.mockResolvedValue({
            apiKey: 'test-api-key',
        });
        mockExecuteFunction.helpers.request.mockResolvedValue({
            status: 'success',
            message_id: 'test-message-id',
        });
    });
    describe('Node Description', () => {
        it('should have correct basic properties', () => {
            expect(node.description.name).toBe('d7Messaging');
            expect(node.description.displayName).toBe('D7 Messaging');
            expect(node.description.icon).toBe('file:d7.svg');
            expect(node.description.group).toEqual(['transform']);
            expect(node.description.version).toBe(1);
        });
        it('should have required credentials', () => {
            expect(node.description.credentials).toEqual([
                {
                    name: 'd7Api',
                    required: true,
                },
            ]);
        });
    });
    describe('SMS Messaging', () => {
        beforeEach(() => {
            const mockParams = {
                channel: 'sms',
                content: 'Test SMS message',
                recipients: '+1234567890,+0987654321',
            };
            mockExecuteFunction.getNodeParameter.mockImplementation((parameterName, _) => mockParams[parameterName]);
        });
        it('should send SMS message successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield node.execute.call(mockExecuteFunction);
            expect(mockExecuteFunction.helpers.request).toHaveBeenCalledWith('https://api.d7networks.com/messages/v1/send', {
                method: 'POST',
                body: JSON.stringify({
                    messages: [
                        {
                            channel: 'sms',
                            recipients: ['+1234567890', '+0987654321'],
                            content: 'Test SMS message',
                            msg_type: 'text',
                            data_coding: 'text',
                        },
                    ],
                    message_globals: {
                        originator: 'SignOTP',
                    },
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer test-api-key',
                },
            });
        }));
    });
    describe('WhatsApp Messaging', () => {
        describe('Text Messages', () => {
            beforeEach(() => {
                const mockParams = {
                    channel: 'whatsapp',
                    messageType: 'serviceText',
                    originator: 'test-originator',
                    messageBody: 'Test WhatsApp message',
                    previewUrl: true,
                    recipients: '+1234567890,+0987654321',
                };
                mockExecuteFunction.getNodeParameter.mockImplementation((parameterName, _) => mockParams[parameterName]);
            });
            it('should send WhatsApp text message successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                yield node.execute.call(mockExecuteFunction);
                expect(mockExecuteFunction.helpers.request).toHaveBeenCalledWith('https://api.d7networks.com/whatsapp/v2/send', {
                    method: 'POST',
                    body: JSON.stringify({
                        messages: [
                            {
                                originator: 'test-originator',
                                content: {
                                    message_type: 'TEXT',
                                    text: {
                                        preview_url: true,
                                        body: 'Test WhatsApp message',
                                    },
                                },
                                recipients: [
                                    { recipient: '+1234567890', recipient_type: 'individual' },
                                    { recipient: '+0987654321', recipient_type: 'individual' },
                                ],
                            },
                        ],
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer test-api-key',
                    },
                });
            }));
        });
        describe('Template Messages', () => {
            beforeEach(() => {
                const mockParams = {
                    channel: 'whatsapp',
                    messageType: 'utilityText',
                    originator: 'test-originator',
                    templateId: 'test-template',
                    language: 'en',
                    recipients: '+1234567890',
                    bodyParameters: {
                        parameters: [
                            { key: 'param1', value: 'value1' },
                            { key: 'param2', value: 'value2' },
                        ],
                    },
                };
                mockExecuteFunction.getNodeParameter.mockImplementation((parameterName, _) => mockParams[parameterName]);
            });
            it('should send WhatsApp template message successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                yield node.execute.call(mockExecuteFunction);
                expect(mockExecuteFunction.helpers.request).toHaveBeenCalledWith('https://api.d7networks.com/whatsapp/v2/send', {
                    method: 'POST',
                    body: JSON.stringify({
                        messages: [
                            {
                                originator: 'test-originator',
                                content: {
                                    message_type: 'TEMPLATE',
                                    template: {
                                        template_id: 'test-template',
                                        language: 'en',
                                        body_parameter_values: {
                                            param1: 'value1',
                                            param2: 'value2',
                                        },
                                    },
                                },
                                recipients: [
                                    { recipient: '+1234567890', recipient_type: 'individual' },
                                ],
                            },
                        ],
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer test-api-key',
                    },
                });
            }));
        });
        describe('Media Messages', () => {
            beforeEach(() => {
                const mockParams = {
                    channel: 'whatsapp',
                    messageType: 'serviceMedia',
                    originator: 'test-originator',
                    mediaUrl: 'https://example.com/media.jpg',
                    mediaType: 'image',
                    mediaCaption: 'Test media caption',
                    recipients: '+1234567890',
                };
                mockExecuteFunction.getNodeParameter.mockImplementation((parameterName, _) => mockParams[parameterName]);
            });
            it('should send WhatsApp media message successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                yield node.execute.call(mockExecuteFunction);
                expect(mockExecuteFunction.helpers.request).toHaveBeenCalledWith('https://api.d7networks.com/whatsapp/v2/send', {
                    method: 'POST',
                    body: JSON.stringify({
                        messages: [
                            {
                                originator: 'test-originator',
                                content: {
                                    message_type: 'ATTACHMENT',
                                    attachment: {
                                        type: 'image',
                                        url: 'https://example.com/media.jpg',
                                        caption: 'Test media caption',
                                    },
                                },
                                recipients: [
                                    { recipient: '+1234567890', recipient_type: 'individual' },
                                ],
                            },
                        ],
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer test-api-key',
                    },
                });
            }));
        });
    });
    describe('Error Handling', () => {
        beforeEach(() => {
            const mockParams = {
                channel: 'sms',
                content: 'Test message',
                recipients: '+1234567890',
            };
            mockExecuteFunction.getNodeParameter.mockImplementation((parameterName, _) => mockParams[parameterName]);
            mockExecuteFunction.helpers.request.mockRejectedValue(new Error('API Error'));
        });
        it('should handle API errors appropriately', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(node.execute.call(mockExecuteFunction)).rejects.toThrow('API Error');
        }));
    });
});
