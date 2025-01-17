import {
    INodeType,
    INodeTypeDescription,
    INodeExecutionData,
    IExecuteFunctions,
    NodeConnectionType,
  } from 'n8n-workflow';
  
  type TextContent = {
    message_type: 'TEXT';
    text: {
      preview_url: boolean;
      body: string;
    };
  };
  
  type MediaContent = {
    message_type: 'ATTACHMENT';
    attachment: {
      type: string;
      url: string;
      caption: string;
    };
  };
  
  type TemplateContent = {
    message_type: 'TEMPLATE';
    template: {
      template_id: string;
      language: string;
      body_parameter_values: { [key: string]: string };
      media?: {
        media_type: string;
        media_url: string;
      };
    };
  };
  
  type WhatsAppContent = TextContent | MediaContent | TemplateContent;
  
  export class D7Messaging implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'D7 Messaging',
      name: 'd7Messaging',
      icon: 'file:d7.svg',
      group: ['transform'],
      version: 1,
      description: 'Send messages using D7 APIs (SMS & WhatsApp)',
      defaults: {
        name: 'D7 Messaging',
        color: '#1F8E3C',
      },
      inputs: ['main' as NodeConnectionType],
      outputs: ['main' as NodeConnectionType],
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
        // SMS Properties
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
        // WhatsApp Properties
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
            { name: 'WhatsApp Utility Text', value: 'utilityText' },
            { name: 'WhatsApp Utility Media', value: 'utilityMedia' },
            { name: 'WhatsApp Marketing Text', value: 'marketingText' },
            { name: 'WhatsApp Marketing Media', value: 'marketingMedia' },
            { name: 'WhatsApp Service Text', value: 'serviceText' },
            { name: 'WhatsApp Service Media', value: 'serviceMedia' },
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
              channel: ['whatsapp'],
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
              channel: ['whatsapp'],
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
              channel: ['whatsapp'],
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
              channel: ['whatsapp'],
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
              channel: ['whatsapp'],
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
              channel: ['whatsapp'],
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
          description: 'Comma-separated list of phone numbers',
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
              channel: ['whatsapp'],
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
  
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
      const channel = this.getNodeParameter('channel', 0) as string;
      const recipients = this.getNodeParameter('recipients', 0) as string;
      const apiKey = this.getNodeParameter('apiKey', 0) as string;
  
      if (channel === 'sms') {
        const content = this.getNodeParameter('content', 0) as string;
        
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
  
        const response = await this.helpers.request(
          'https://api.d7networks.com/messages/v1/send',
          {
            method: 'POST',
            body: JSON.stringify(messageData),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          },
        );
  
        return [[{ json: response }]];
      } else {
        const messageType = this.getNodeParameter('messageType', 0) as string;
        const originator = this.getNodeParameter('originator', 0) as string;
  
        const recipientsList = recipients.split(',').map((recipient) => ({
          recipient: recipient.trim(),
          recipient_type: 'individual',
        }));
  
        let content: WhatsAppContent;
  
        if (messageType === 'serviceText') {
          const messageBody = this.getNodeParameter('messageBody', 0) as string;
          const previewUrl = this.getNodeParameter('previewUrl', 0) as boolean;
  
          content = {
            message_type: 'TEXT',
            text: {
              preview_url: previewUrl,
              body: messageBody,
            },
          };
        } else if (messageType === 'serviceMedia') {
          const mediaUrl = this.getNodeParameter('mediaUrl', 0) as string;
          const mediaType = this.getNodeParameter('mediaType', 0) as string;
          const mediaCaption = this.getNodeParameter('mediaCaption', 0) as string;
  
          content = {
            message_type: 'ATTACHMENT',
            attachment: {
              type: mediaType,
              url: mediaUrl,
              caption: mediaCaption,
            },
          };
        } else {
          const templateId = this.getNodeParameter('templateId', 0) as string;
          const language = this.getNodeParameter('language', 0) as string;
          const bodyParametersData = this.getNodeParameter('bodyParameters', 0) as {
            parameters: Array<{ key: string; value: string }>;
          };
  
          const bodyParameterValues: { [key: string]: string } = {};
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
            const mediaUrl = this.getNodeParameter('mediaUrl', 0) as string;
            const mediaType = this.getNodeParameter('mediaType', 0) as string;
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
  
        const response = await this.helpers.request(
          'https://api.d7networks.com/whatsapp/v2/send',
          {
            method: 'POST',
            body: JSON.stringify(messageData),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          },
        );
  
        return [[{ json: response }]];
      }
    }
  }