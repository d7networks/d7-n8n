# D7Networks Messaging Integration for n8n

[![N8N Community Node](https://img.shields.io/badge/n8n-community-green)](https://n8n.io)
[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-d7-messaging)](https://www.npmjs.com/package/n8n-nodes-d7-messaging)

Professional-grade SMS and WhatsApp messaging integration for n8n workflow automation platform.

## Table of Contents
- [Overview](#overview)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Quick Install](#quick-install)
  - [Development Setup](#development-setup)
  - [Verification](#verification)
- [Configuration](#configuration)
- [SMS Integration](#sms-integration)
  - [Basic Usage](#basic-usage)
  - [Advanced Options](#advanced-options)
- [WhatsApp Integration](#whatsapp-integration)
  - [Template Messages](#template-messages)
  - [Media Messages](#media-messages)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Support](#support)
- [License](#license)

## Overview

This integration allows you to send SMS and WhatsApp messages using D7Networks through n8n workflows. It supports bulk messaging, template messages, media messages, and advanced delivery tracking.

## Installation

### Prerequisites

Before you start, make sure you have:
- Node.js (v20.x or higher)
- pnpm (latest version)
- n8n development environment
- D7Networks API credentials

### Quick Install

1. Open n8n web interface
2. Navigate to Settings → Community Nodes
3. Search for `n8n-nodes-d7-messaging`
4. Click Install
5. Restart n8n

### Development Setup

```bash
# Install pnpm globally
npm i pnpm -g

# Clone n8n repository
git clone https://github.com/n8n-io/n8n.git
cd n8n

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### Verification

1. Refresh your n8n workspace
2. Search for "D7 Messaging" in nodes panel
3. Verify node appears in search results
4. Test by dragging into workflow

## Configuration

### Authentication
1. Get your API key from D7Networks Portal
2. In n8n:
   - Open D7 node settings
   - Click "Create New Credential"
   - Enter your API key
   - Save credential

## SMS Integration

### API Details

#### Endpoint
```
POST https://api.d7networks.com/messages/v1/send
```

#### Configuration Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| Recipient Numbers | String | Yes | Phone numbers in E.164 format (e.g., +971XXXXXXXX) |
| Message Content | String | Yes | SMS text content |
| API Key | String | Yes | D7Networks authentication token |

### Default Settings
- Channel: SMS
- Message Type: Text
- Data Coding: Text
- Default Originator: SignOTP
- Client Reference: D7-AirTableSMS

## WhatsApp Integration

### Message Categories

#### 1. Utility Messages
- **Purpose**: Transactional communications
- **Types**: Text or Media-based
- **Requirements**: Pre-approved templates
- **Features**: Dynamic parameters

#### 2. Marketing Messages
- **Purpose**: Promotional content
- **Types**: Text or Media-based
- **Requirements**: Pre-approved templates
- **Features**: Rich media content

#### 3. Service Messages
- **Purpose**: Customer service communications
- **Types**:
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

### Supported Media Formats
- **Images**: JPG, PNG
- **Videos**: MP4
- **Documents**: PDF, DOC, DOCX

## API Reference

### Authentication
All APIs use Bearer token authentication:
```
Authorization: Bearer {API_KEY}
```

### Response Format
API responses include:
- Request status
- Message ID
- Delivery information
- Error details (if any)

## Error Handling

Common error scenarios and solutions:
- **401 Unauthorized**: Check API key validity
- **400 Bad Request**: Verify parameter format
- **429 Too Many Requests**: Implement rate limiting
- **500 Server Error**: Contact support

## Support
- [D7Networks Documentation](https://d7networks.com/docs)
- [GitHub Issues](https://github.com/yourusername/n8n-nodes-d7-messaging/issues)
- Email: support@d7networks.com

## License
MIT License - see [LICENSE](LICENSE) for details