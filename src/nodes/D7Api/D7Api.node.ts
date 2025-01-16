import {
  INodeType,
  INodeTypeDescription,
  INodeExecutionData,
  IExecuteFunctions,
  NodeConnectionType,
  IHttpRequestMethods,
} from 'n8n-workflow';

export class D7Api implements INodeType {
  description: INodeTypeDescription = {
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
    inputs: ['main' as NodeConnectionType],
    outputs: ['main' as NodeConnectionType],
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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const recipients = this.getNodeParameter('recipients', 0) as string;
    const content = this.getNodeParameter('content', 0) as string;
    const apiKey = this.getNodeParameter('apiKey', 0) as string;

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
      method: 'POST' as IHttpRequestMethods,
      body: JSON.stringify(messageData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    };

    const response = await this.helpers.request(url, options);

    return [
      [
        {
          json: response,
        },
      ],
    ];
  }
}
