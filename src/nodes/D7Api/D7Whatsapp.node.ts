import {
    INodeType,
    INodeTypeDescription,
    INodeExecutionData,
    IExecuteFunctions,
    NodeConnectionType,
    IHttpRequestMethods,
  } from 'n8n-workflow';
  
  export class D7Whatsapp implements INodeType {
    description: INodeTypeDescription = {
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
      inputs: ['main' as NodeConnectionType],
      outputs: ['main' as NodeConnectionType],
      properties: [
        {
          displayName: 'Message Type',
          name: 'messageType',
          type: 'options',
          options: [
            {
              name: 'WhatsApp Utility Text',
              value: 'utilityText',
            },
            {
              name: 'WhatsApp Utility Media',
              value: 'utilityMedia',
            },
            {
              name: 'WhatsApp Marketing Text',
              value: 'marketingText',
            },
            {
              name: 'WhatsApp Marketing Media',
              value: 'marketingMedia',
            },
            {
              name: 'WhatsApp Service Text',
              value: 'serviceText',
            },
            {
              name: 'WhatsApp Service Media',
              value: 'serviceMedia',
            },
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
        // Template-specific fields
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
        // Service Text specific fields
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
        // Service Media specific fields
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
        // Common media fields
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
            {
              name: 'Image',
              value: 'image',
            },
            {
              name: 'Video',
              value: 'video',
            },
            {
              name: 'Document',
              value: 'document',
            },
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
        // Template parameters
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
                {
                  displayName: 'Key',
                  name: 'key',
                  type: 'string',
                  default: '',
                  description: 'Parameter key',
                },
                {
                  displayName: 'Value',
                  name: 'value',
                  type: 'string',
                  default: '',
                  description: 'Parameter value',
                },
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
        }
        
      ],
    };
  
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
      const messageType = this.getNodeParameter('messageType', 0) as string;
      const originator = this.getNodeParameter('originator', 0) as string;
      const recipients = this.getNodeParameter('recipients', 0) as string;
      const apiKey = this.getNodeParameter('apiKey', 0) as string;
  
      const recipientsList = recipients.split(',').map(recipient => ({
        recipient: recipient.trim(),
        recipient_type: 'individual',
      }));
  
      let content: any = {};
  
      // Handle different message types
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
        // Handle template-based messages (utility and marketing)
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
  
      const options = {
        method: 'POST' as IHttpRequestMethods,
        body: JSON.stringify(messageData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      };
  
      const response = await this.helpers.request(
        'https://api.d7networks.com/whatsapp/v2/send',
        options,
      );
  
      return [[{ json: response }]];
    }
  }