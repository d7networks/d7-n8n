# D7Networks Integration Documentation

This comprehensive documentation covers the implementation and usage of D7Networks' SMS and WhatsApp API integrations in n8n.

## D7 SMS API

The D7 SMS API node provides a streamlined interface for sending SMS messages through the D7Networks messaging platform.

### Configuration Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| Recipient Numbers | String | Comma-separated list of phone numbers in E.164 format (e.g., +971XXXXXXXX) | Yes |
| Message Content | String | The text content to be sent in the SMS | Yes |
| API Key | String | Authentication token from D7Networks portal | Yes |

### Technical Implementation

The SMS API utilizes the following endpoint:
```
POST https://api.d7networks.com/messages/v1/send
```

Message Configuration:
- Channel: SMS
- Message Type: Text
- Data Coding: Text
- Default Originator: SignOTP
- Client Reference: D7-AirTableSMS

## D7 WhatsApp API

The D7 WhatsApp API node enables sophisticated WhatsApp messaging capabilities with multiple message types and media support.

### Message Categories

#### 1. Utility Messages
- Purpose: Transactional communications
- Types: Text or Media-based
- Requires pre-approved templates
- Supports dynamic parameters

#### 2. Marketing Messages
- Purpose: Promotional content
- Types: Text or Media-based
- Requires pre-approved templates
- Supports rich media content

#### 3. Service Messages
- Purpose: Customer service communications
- Types:
    - Text: Custom messages with URL preview
    - Media: Rich media with captions

### Configuration Parameters

#### Common Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Message Type | Options | Yes | Select message category and type |
| Originator | String | Yes | WhatsApp business number |
| Recipients | String | Yes | Comma-separated phone numbers |
| API Key | String | Yes | D7Networks authentication token |

#### Template-specific Parameters
| Parameter | Type | Applicable Types | Description |
|-----------|------|-----------------|-------------|
| Template ID | String | Utility/Marketing | Template identifier |
| Language | String | Utility/Marketing | Template language code |
| Body Parameters | Collection | Utility/Marketing | Dynamic template values |

#### Media Parameters
| Parameter | Type | Applicable Types | Description |
|-----------|------|-----------------|-------------|
| Media URL | String | Media messages | Content URL |
| Media Type | Options | Media messages | Image/Video/Document |
| Media Caption | String | Service Media | Optional caption |

### Technical Details

Endpoint:
```
POST https://api.d7networks.com/whatsapp/v2/send
```

Supported Media Formats:
- Images: JPG, PNG
- Videos: MP4
- Documents: PDF, DOC, DOCX

### Authentication

Both APIs use Bearer token authentication:
```
Authorization: Bearer {API_KEY}
```

### Response Handling

Both nodes return the API response in JSON format, including:
- Request status
- Message ID
- Delivery information
- Error details (if any)

For detailed API specifications and error codes, refer to the [D7Networks API Documentation](https://d7networks.com/docs).