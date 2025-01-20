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
Before you start, make sure you have the following installed on your system:
- **Node.js**: Version 20.x or higher. You can download it from [nodejs.org](https://nodejs.org/).
- **pnpm**: The latest version of the package manager. Install it using the command below.
- **n8n Development Environment**: Ensure you have n8n set up. You can follow the [n8n documentation](https://docs.n8n.io/getting-started/installation/) for guidance.

### Quick Install
To quickly install the D7 Messaging node in n8n, follow these steps:
1. **Open n8n**: Launch your n8n instance in your web browser.
2. **Navigate to Settings**: Click on the three dots (⋮) near your profile name in the bottom left corner and select **Settings**.
3. **Go to Community Nodes**: In the left panel, scroll down and select **Community Nodes**.
4. **Search for the Node**: In the search bar, type `n8n-nodes-d7-messaging`.
5. **Install the Node**: Click on the **Install** button next to the search result.
6. **Restart n8n**: After installation, restart your n8n instance to apply the changes.

### Development Setup
For a manual setup, follow these detailed steps:

1. **Install pnpm** globally:
   Open your terminal and run the following command:
   ```bash
   npm i pnpm -g

2. **Clone the n8n repository: In your terminal,:** run:
git clone https://github.com/n8n-io/n8n.git
cd n8n

3. **Install dependencies: Inside the n8n directory,:**  run:
pnpm install


4. **Start the development server: After the dependencies are installed, start the development server with:** :
pnpm run dev


5. **Open n8n in your browser: Once the server is running, open your web browser and go to* :
http://localhost:5678.


6. **Install the D7 Messaging Node:** :
(*)Navigate to Settings → Community Nodes.
(*)Search for n8n-nodes-d7-messaging.
(*)Click Install.
(*)Restart n8n to apply the changes.


**Verification** 
To verify the installation:

(*)Refresh the n8n workspace: After restarting, refresh your browser.
(*)Search for "D7 Messaging": In the nodes panel, search for "D7 Messaging".
(*)Drag and Drop: If the node appears, drag and drop it into your workflow to start using it.


**Configuration** 
*Authentication*
Get your API key from the D7Networks Portal.
*In n8n, add a new credential:*
    Open the D7 node settings.
    Click "Create New Credential".
    Enter your API key.
    Save the credential.





## D7 DOC

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