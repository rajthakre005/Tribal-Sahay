# Tribal Sahay - Unified Scholarship Mobile Application

**Ministry of Tribal Affairs**

A unified mobile-first Scholarship Module that enables ST students to access and track scholarship services across all five schemes (Pre-Matric, Post-Matric, Top Class, National Fellowship, and National Overseas Scholarship) through a common interface.

## 📋 Problem Statement

The Ministry of Tribal Affairs administers five scholarship schemes spread across three disconnected systems:
- National Scholarship Portal (NSP)
- Scholarship Fellowship Management Portal (SFMP - Canara Bank)
- Standalone NOS Portal

Students must track applications, verification stages, and disbursements separately with no single view. This solution provides a unified platform with automated verification through government data sources.

## 🎯 Key Features

### 1. Scholarship Module
- **Unified Dashboard**: Track all 5 scholarship schemes from one interface
- **Application Tracking**: From submission → verification → sanction → disbursement
- **Digital Document Wallet**: DigiLocker integration for document management
- **Consolidated View**: Payments, DBT status, pending actions, and deficiencies
- **Document Reuse**: Reuse previously submitted information across applications

### 2. JAGO Chatbot Integration
- **Eligibility Information**: Scheme-specific eligibility queries
- **Application Status**: Real-time status updates
- **Document Guidance**: Required documents and deficiency alerts
- **Multilingual Support**: Multiple Indian languages
- **Timely Alerts**: Milestone notifications for applications and payments

### 3. Unified Verification & Integration Layer
- **Automated Verification**: Integration with government data sources
  - DigiLocker (documents)
  - AISHE (institution details)
  - UDISE+ (enrollment data)
  - APAAR (academic records)
  - UIDAI (identity verification)
  - State e-District systems (certificates)
  - UGC-NTA (qualifications)
- **Exception Handling**: Mismatches routed for manual review
- **Digital Verification**: ST/PVTG status, income, academic records

### 4. Coverage Identification
- **Gap Analysis**: Identify enrolled ST students not availing scholarships
- **Data Matching**: UDISE+, APAAR, and OTR integration
- **Targeted Outreach**: Enable outreach to unreached beneficiaries

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Application                         │
│                  (React Native / Flutter)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ REST API
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                    API Gateway Layer                          │
│              (Express.js + Authentication)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────┴───────┐  ┌───────┴───────┐  ┌───────┴───────┐
│  Scholarship   │  │  Verification  │  │   Chatbot     │
│    Module      │  │     Layer      │  │   Service     │
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                  │                  │
┌───────┴───────┐  ┌───────┴───────┐  ┌───────┴───────┐
│   MongoDB     │  │  Government   │  │   JAGO API    │
│   Database    │  │   APIs        │  │               │
└───────────────┘  └───────────────┘  └───────────────┘
```

## 🛠️ Tech Stack

### Frontend (Mobile)
- **React Native** - Cross-platform mobile development
- **Redux Toolkit** - State management
- **React Navigation** - Navigation
- **Axios** - HTTP client
- **AsyncStorage** - Local storage

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Winston** - Logging
- **Node-cron** - Scheduled tasks

### Integrations
- **DigiLocker API** - Document verification
- **NSP API** - National Scholarship Portal
- **SFMP API** - Canara Bank portal
- **UDISE+ API** - Enrollment data
- **APAAR API** - Academic records
- **JAGO Chatbot API** - AI assistant

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd tribal-sahay
```

2. Install dependencies
```bash
npm run install-all
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB
```bash
# Make sure MongoDB is running on your system
mongod
```

5. Start the development server
```bash
npm run dev
```

## 📁 Project Structure

```
tribal-sahay/
├── client/                    # React Native mobile app
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── screens/          # Screen components
│   │   ├── navigation/       # Navigation configuration
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store
│   │   ├── utils/            # Utility functions
│   │   └── assets/           # Images, fonts, etc.
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── services/             # Business logic
│   ├── integrations/         # External API integrations
│   ├── utils/                # Utility functions
│   └── index.js              # Server entry point
│
├── docs/                     # Documentation
│   ├── api/                  # API documentation
│   └── architecture/         # System architecture
│
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/forgot-password` - Password reset

### Scholarship Module
- `GET /api/scholarships` - List all scholarship schemes
- `GET /api/scholarships/:id` - Get scholarship details
- `POST /api/applications` - Submit scholarship application
- `GET /api/applications` - Get user's applications
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application
- `GET /api/applications/:id/status` - Track application status

### Document Wallet
- `GET /api/documents` - List user documents
- `POST /api/documents/upload` - Upload document
- `DELETE /api/documents/:id` - Delete document
- `POST /api/digilocker/connect` - Connect DigiLocker
- `GET /api/digilocker/documents` - Fetch DigiLocker documents

### Verification
- `POST /api/verification/identity` - Verify identity
- `POST /api/verification/st-status` - Verify ST/PVTG status
- `POST /api/verification/income` - Verify income certificate
- `POST /api/verification/academic` - Verify academic records
- `POST /api/verification/institution` - Verify institution details

### Chatbot
- `POST /api/chatbot/query` - Send query to JAGO chatbot
- `GET /api/chatbot/history` - Get chat history

### Payments
- `GET /api/payments` - List user payments
- `GET /api/payments/:id` - Get payment details
- `GET /api/payments/dbt-status` - Check DBT status

## 🗄️ Database Models

### User
- Personal information
- Contact details
- ST/PVTG status
- Academic information
- Document references

### Application
- Scheme type
- Application status
- Verification status
- Document submissions
- Payment details

### Document
- Document type
- File reference
- Verification status
- Source (uploaded/DigiLocker)

### Verification
- Verification type
- Status
- Source system
- Timestamp
- Remarks

## 🔒 Security Features

- JWT-based authentication
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure file upload
- Encrypted sensitive data
- Audit logging

## 📱 Supported Scholarship Schemes

1. **Pre-Matric Scholarship** - For ST students studying in classes IX and X
2. **Post-Matric Scholarship** - For ST students studying at post-matriculation level
3. **Top Class Education** - For ST students pursuing professional/technical courses
4. **National Fellowship (NFST)** - For ST candidates pursuing M.Phil/Ph.D
5. **National Overseas Scholarship (NOS)** - For ST students pursuing higher studies abroad

## 🌐 Government Integrations

- **DigiLocker** - Document storage and verification
- **AISHE** - All India Survey on Higher Education
- **UDISE+** - Unified District Information System for Education
- **APAAR** - Automated Permanent Academic Account Registry
- **UIDAI** - Unique Identification Authority of India
- **State e-District** - State government certificate verification
- **UGC-NTA** - University Grants Commission / National Testing Agency

## 📊 Reporting & Analytics

- Application statistics
- Disbursement tracking
- Coverage analysis
- Verification success rates
- Gap identification reports
- Beneficiary demographics

## 🚀 Deployment

### Backend
```bash
# Build
npm run build

# Start production server
NODE_ENV=production npm start
```

### Mobile
```bash
# Android
cd client
npm run android

# iOS
cd client
npm run ios
```

## 📞 Support

For technical support or queries:
- Email: support@mota.gov.in
- Helpline: 1800-XXX-XXXX

## 📄 License

MIT License - Ministry of Tribal Affairs, Government of India

## 🙏 Acknowledgements

- Ministry of Tribal Affairs, Government of India
- National Scholarship Portal
- DigiLocker
- JAGO Chatbot Team
