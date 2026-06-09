# OpsGPT - System Architecture Documentation

## Overview

OpsGPT is a **full-stack multi-tenant SaaS platform** for BPO (Business Process Outsourcing) operations management with AI-powered insights. It enables operations teams to track KPIs, analyze performance issues, document root causes, manage justifications, generate reports, and build a searchable knowledge base of operational solutions.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Tech Stack](#tech-stack)
3. [Database Schema](#database-schema)
4. [API Endpoints](#api-endpoints)
5. [Frontend Components](#frontend-components)
6. [Business Logic](#business-logic)
7. [Authentication & Authorization](#authentication--authorization)
8. [Deployment](#deployment)
9. [Data Flow](#data-flow)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (Browser)                          │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                      React SPA (Vite)                         │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │  │Dashboard│  │  KPIs   │  │Reports  │  │Knowledge│  ...     │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘          │   │
│  │       └───────────┴───────────┴───────────┘                  │   │
│  │                         │                                     │   │
│  │              ┌──────────┴──────────┐                          │   │
│  │              │   AuthContext.jsx  │                          │   │
│  │              │   ApiService.js   │                          │   │
│  │              └──────────┬──────────┘                          │   │
│  └──────────────────────────┼───────────────────────────────────┘   │
└─────────────────────────────┼─────────────────────────────────────┘
                              │ HTTP/HTTPS (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         REVERSE PROXY (Nginx)                        │
│                           Port 80 / 443                              │
└─────────────────────────────┬─────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       FLASK BACKEND (Gunicorn)                      │
│                              Port 5000                               │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    Flask Application                          │   │
│  │                                                              │   │
│  │  ┌─────────────────────────────────────────────────────────┐ │   │
│  │  │                    Routes (Blueprints)                   │ │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │   │
│  │  │  │   Auth   │ │   Org    │ │   KPI    │ │Reports   │    │ │   │
│  │  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘    │ │   │
│  │  │       │            │            │            │          │ │   │
│  │  │  ┌────┴────────────┴────────────┴────────────┴────┐     │ │   │
│  │  │  │              Services Layer                    │     │ │   │
│  │  │  │  KPIService | ReportingService | KnowledgeSvc  │     │ │   │
│  │  │  └────────────────────────────────────────────────┘     │ │   │
│  │  │                         │                              │ │   │
│  │  │  ┌──────────────────────┴───────────────────────┐      │ │   │
│  │  │  │                  Models                      │      │ │   │
│  │  │  │  User | Organization | Project | KPI | ...   │      │ │   │
│  │  │  └──────────────────────────────────────────────┘      │ │   │
│  │  └─────────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ SQLAlchemy ORM
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE (Port 5432)                   │
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  users   │  │   orgs   │  │ projects │  │   kpis   │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │kpi_values│  │justifs   │  │ insights │  │workflows │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | SPA with hot module replacement |
| **UI Components** | Lucide React | Icon library |
| **Charts** | Recharts | Data visualization |
| **Routing** | React Router v6 | Client-side routing |
| **Backend** | Python 3.11 + Flask | REST API framework |
| **ORM** | Flask-SQLAlchemy | Database abstraction |
| **Auth** | Flask-JWT-Extended | JWT token authentication |
| **Database** | PostgreSQL 15 | Primary data store |
| **Server** | Gunicorn | WSGI application server |
| **Proxy** | Nginx | Reverse proxy & static file serving |
| **Container** | Docker Compose | Orchestration |

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│ organizations   │       │     users       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ org_id (FK)     │
│ name            │       │ id (PK)         │
│ code            │       │ email           │
│ description     │       │ password_hash   │
│ created_at      │       │ role            │
└────────┬────────┘       │ first_name      │
         │                │ last_name       │
         │                │ created_at      │
         │                └─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐
│    projects     │
├─────────────────┤
│ id (PK)         │
│ org_id (FK)     │
│ name            │
│ client_name     │
│ description     │
│ is_active       │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐     ┌─────────────────┐
│ kpi_definitions │     │   root_causes   │
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ project_id (FK) │     │ project_id (FK) │
│ name            │     │ category        │
│ code            │     │ subcategory     │
│ description     │     │ description     │
│ target_value    │     └─────────────────┘
│ unit            │
│ direction       │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐     ┌─────────────────┐
│    kpi_values   │────►│kpi_justifications│
├─────────────────┤     ├─────────────────┤
│ id (PK)         │     │ id (PK)         │
│ project_id (FK) │     │ kpi_value_id(FK)│
│ kpi_id (FK)     │     │ user_id (FK)    │
│ date            │     │ comment         │
│ actual_value    │     │ root_cause_cat  │
│ target_value    │     │ root_cause_sub  │
│ variance        │     │ action_plan     │
└─────────────────┘     │ status          │
                        └────────┬────────┘
                                 │
                                 │ 1:1 (optional)
                                 ▼
                        ┌─────────────────────┐
                        │ approval_workflows  │
                        ├─────────────────────┤
                        │ id (PK)             │
                        │ entity_type         │
                        │ entity_id           │
                        │ current_status      │
                        │ submitted_by (FK)   │
                        │ approved_by (FK)    │
                        │ certified_by (FK)   │
                        └─────────────────────┘

┌─────────────────────────┐
│  operational_insights   │
├─────────────────────────┤
│ id (PK)                 │
│ project_id (FK)         │
│ kpi_name                │
│ root_cause              │
│ root_cause_category     │
│ comment                 │
│ resolution              │
│ confidence_score        │
│ source_type             │
│ is_verified             │
└─────────────────────────┘
```

### Model Descriptions

#### User (`app/models/user.py`)
Represents platform users with role-based access.

| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Unique identifier |
| org_id | Integer (FK) | Reference to organization |
| email | String | Unique email address |
| password_hash | String | Bcrypt hashed password |
| role | String | User role (Admin/Manager/Analyst) |
| first_name | String | User's first name |
| last_name | String | User's last name |

#### Organization (`app/models/org.py`)
Top-level tenant entity.

| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Unique identifier |
| name | String | Organization name |
| code | String | Unique organization code |
| description | Text | Organization description |

#### Project (`app/models/org.py`)
Client project under an organization.

| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Unique identifier |
| org_id | Integer (FK) | Parent organization |
| name | String | Project name |
| client_name | String | Client company name |
| description | Text | Project description |
| is_active | Boolean | Project status |

#### KPIDefinition (`app/models/kpi.py`)
Template for a measurable KPI.

| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Unique identifier |
| project_id | Integer (FK) | Parent project |
| name | String | KPI display name |
| code | String | Short code (e.g., "AHT") |
| description | Text | KPI description |
| target_value | Float | Target threshold |
| unit | String | Measurement unit |
| direction | String | "higher" or "lower" is better |

#### KPIValue (`app/models/kpi.py`)
Actual recorded values for a KPI on a specific date.

| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Unique identifier |
| project_id | Integer (FK) | Parent project |
| kpi_id | Integer (FK) | KPI definition reference |
| date | Date | Measurement date |
| actual_value | Float | Actual recorded value |
| target_value | Float | Target for this entry |
| variance | Float | Percentage variance from target |

#### KPIJustification (`app/models/kpi.py`)
Explanation for KPI variance requiring approval.

| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Unique identifier |
| kpi_value_id | Integer (FK) | Related KPI value |
| user_id | Integer (FK) | Author |
| comment | Text | Explanation text |
| root_cause_category | String | High-level cause (People/Tech/Process) |
| root_cause_subcategory | String | Specific cause |
| action_plan | Text | Remediation steps |
| status | String | Workflow status |

#### RootCause (`app/models/kpi.py`)
Catalog of known root causes.

| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Unique identifier |
| project_id | Integer (FK) | Parent project |
| category | String | High-level category |
| subcategory | String | Specific category |
| description | Text | Detailed description |

#### OperationalInsight (`app/models/knowledge.py`)
Knowledge base entry for AI-ready insights.

| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Unique identifier |
| project_id | Integer (FK) | Parent project |
| kpi_name | String | Related KPI |
| root_cause | String | Root cause description |
| root_cause_category | String | Category classification |
| comment | Text | Insight details |
| resolution | Text | Solution/solution |
| confidence_score | Float | 0.0-1.0 confidence |
| source_type | String | "manual" or "ai_generated" |
| is_verified | Boolean | Verification status |

#### ApprovalWorkflow (`app/models/approval.py`)
Tracks multi-stage approval process.

| Field | Type | Description |
|-------|------|-------------|
| id | Integer (PK) | Unique identifier |
| entity_type | String | "justification", "insight", or "report" |
| entity_id | Integer | ID of the entity being approved |
| current_status | String | Current workflow status |
| submitted_by | Integer (FK) | User who submitted |
| approved_by | Integer (FK) | Approving user |
| certified_by | Integer (FK) | Certifying user |
| submitted_at | DateTime | Submission timestamp |
| approved_at | DateTime | Approval timestamp |
| certified_at | DateTime | Certification timestamp |
| notes | Text | Approval notes |

---

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login and get JWT token | No |
| GET | `/auth/me` | Get current user profile | Yes |

**Register Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass",
  "org_id": 1,
  "role": "Manager",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "Manager",
    "org_id": 1
  }
}
```

### Organization Routes (`/org`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/org/create` | Create organization | Yes |
| GET | `/org/` | List all organizations | Yes |
| GET | `/org/<id>` | Get organization details | Yes |
| POST | `/org/projects` | Create project | Yes |
| GET | `/org/projects/org/<org_id>` | List projects by org | Yes |
| GET | `/org/projects/<project_id>` | Get project details | Yes |
| PUT | `/org/projects/<project_id>` | Update project | Yes |

### KPI Routes (`/kpi`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/kpi/create-definition` | Create KPI definition | Yes |
| GET | `/kpi/definitions/project/<project_id>` | List KPI definitions | Yes |
| POST | `/kpi/ingest-value` | Record KPI value | Yes |
| GET | `/kpi/project/<project_id>` | Get all KPI values | Yes |
| GET | `/kpi/values/<kpi_id>/dates` | Get KPI values by date range | Yes |
| POST | `/kpi/justify` | Create justification | Yes |
| GET | `/kpi/justifications/<project_id>` | List justifications | Yes |
| PUT | `/kpi/justifications/<id>` | Update justification | Yes |
| POST | `/kpi/root-cause/create` | Create root cause | Yes |
| GET | `/kpi/root-cause/project/<project_id>` | List root causes | Yes |

**Ingest KPI Value:**
```json
{
  "project_id": 1,
  "kpi_id": 1,
  "date": "2024-01-15",
  "actual_value": 285.5
}
```

### Reports Routes (`/reports`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/reports/daily/<project_id>` | Daily report | Yes |
| GET | `/reports/weekly/<project_id>` | Weekly report | Yes |
| GET | `/reports/monthly/<project_id>` | Monthly report | Yes |

**Daily Report Response:**
```json
{
  "period": "daily",
  "start_date": "2024-01-15",
  "end_date": "2024-01-15",
  "kpi_summary": [
    {
      "name": "Average Handle Time",
      "actual_value": 285,
      "target_value": 300,
      "variance": -5.0
    }
  ],
  "total_justifications": 3,
  "root_cause_summary": [
    {"category": "People", "count": 2}
  ]
}
```

### Knowledge Routes (`/knowledge`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/knowledge/insights` | Create insight | Yes |
| GET | `/knowledge/insights/project/<project_id>` | List insights | Yes |
| GET | `/knowledge/insights/<id>` | Get insight details | Yes |
| PUT | `/knowledge/insights/<id>` | Update insight | Yes |
| GET | `/knowledge/insights/search` | Search insights | Yes |

---

## Frontend Components

### Page Structure

```
frontend/src/
├── App.jsx                 # Main router with protected routes
├── main.jsx               # Entry point
├── context/
│   └── AuthContext.jsx    # Authentication state management
├── services/
│   └── api.js             # API client with token handling
├── components/
│   ├── Layout.jsx         # Main layout wrapper
│   └── Sidebar.jsx        # Navigation sidebar
└── pages/
    ├── Login.jsx          # Authentication page
    ├── Dashboard.jsx       # Overview & KPIs charts
    ├── Projects.jsx        # Project management
    ├── KPIs.jsx           # KPI definitions & trends
    ├── Justifications.jsx # RCA workflow management
    ├── Reports.jsx         # Analytics & reporting
    ├── Knowledge.jsx      # Knowledge base
    └── Settings.jsx        # User settings
```

### Route Protection

```jsx
// Protected Route Pattern
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}
```

### API Service Pattern

```javascript
class ApiService {
  constructor() {
    this.token = localStorage.getItem('opsgpt_token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  }
}
```

---

## Business Logic

### Variance Calculation (`app/utils/security.py`)

```python
def calculate_variance(actual: float, target: float) -> float:
    """Calculate percentage variance from target"""
    if target == 0:
        return 0.0
    return round(((actual - target) / target) * 100, 2)
```

**Example:**
- Target: 300 seconds
- Actual: 285 seconds
- Variance: ((285 - 300) / 300) * 100 = -5.0%

### Root Cause Classification (`app/utils/security.py`)

Auto-classifies justification comments into categories:

| Keyword | Category | Subcategory |
|---------|----------|-------------|
| "new hire", "training" | People | New Hire / Training |
| "system", "technology", "tool" | Technology | System Issue |
| "process", "procedure" | Process | Procedure Gap |
| "staffing", "headcount" | People | Staffing |
| "client", "customer" | External | Client Related |
| "volume", "traffic" | Process | Volume Variance |
| (default) | Unclassified | To Be Determined |

### Approval Workflow

```
┌─────────┐    Submit     ┌───────────┐   Approve   ┌───────────┐  Certify  ┌───────────┐
│  DRAFT  │ ─────────────►│  PENDING  │ ──────────►│ APPROVED  │ ────────►│ CERTIFIED │
└─────────┘               └───────────┘             └───────────┘           └───────────┘
     │                          │                       │                        │
     └── Reject                 └── Reject              └── Reject               └── Archive
```

### KPI Service (`app/services/kpi_service.py`)

```python
class KPIService:
    @staticmethod
    def create_definition(project_id, name, code, ...):
        # Create new KPI template
        
    @staticmethod
    def ingest_value(project_id, kpi_id, date, actual_value, ...):
        # Record KPI measurement with auto-calculated variance
        
    @staticmethod
    def get_trend(kpi_id, days=30):
        # Get historical trend data
        
    @staticmethod
    def create_justification(kpi_value_id, user_id, comment, ...):
        # Auto-classify root cause and create justification
        
    @staticmethod
    def approve_justification(justification_id, approver_id):
        # Move to approved status
        
    @staticmethod
    def certify_justification(justification_id, certifier_id):
        # Final certification
```

### Reporting Service (`app/services/reporting_service.py`)

```python
class ReportingService:
    @staticmethod
    def get_kpi_summary(project_id, start_date, end_date):
        # Aggregated KPI statistics
        
    @staticmethod
    def get_root_cause_analysis(project_id, start_date, end_date):
        # Grouped root cause distribution
        
    @staticmethod
    def get_trend_analysis(kpi_id, days=90):
        # Long-term trend data
        
    @staticmethod
    def get_compliance_report(project_id, start_date, end_date):
        # Compliance rate calculation
```

### Knowledge Service (`app/services/knowledge_service.py`)

```python
class KnowledgeService:
    @staticmethod
    def create_insight(project_id, ...):
        # Create new knowledge base entry
        
    @staticmethod
    def create_from_justification(justification_id, confidence_score=0.5):
        # Promote approved justification to knowledge base
        
    @staticmethod
    def verify_insight(insight_id):
        # Mark insight as verified
        
    @staticmethod
    def get_similar_insights(project_id, root_cause_category, limit=5):
        # Find similar resolved issues
        
    @staticmethod
    def update_confidence_score(insight_id, new_score):
        # Adjust confidence based on usage/feedback
```

---

## Authentication & Authorization

### JWT Token Flow

```
1. User submits credentials
   POST /auth/login
   { "email": "user@example.com", "password": "..." }

2. Server validates and returns token
   Response: { "token": "eyJ...", "user": {...} }

3. Client stores token in localStorage

4. Subsequent requests include token
   Headers: { "Authorization": "Bearer eyJ..." }

5. Server validates token on each request
   @jwt_required() decorator on protected routes
```

### Password Security

```python
# Hashing with bcrypt
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
```

### Role-Based Access

| Role | Capabilities |
|------|--------------|
| Admin | Full system access, manage users, orgs |
| Manager | Manage projects, KPIs, approve justifications |
| Analyst | View reports, create justifications |

---

## Deployment

### Docker Compose Services

```yaml
services:
  db:
    image: postgres:15-alpine
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
    
  backend:
    build: .
    ports: ["5000:5000"]
    environment:
      DATABASE_URL: postgresql://opsmind:opsmind123@db:5432/opsmind_db
    restart: unless-stopped
    
  frontend:
    image: nginx:alpine
    ports: ["80:80"]
    volumes:
      - ./frontend/dist:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

### Quick Start

```bash
# Clone and deploy
git clone https://github.com/DonnieBot/OpsGPT.git
cd OpsGPT
docker-compose up --build

# Access at http://localhost
```

### Default Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@opsmind.com | admin123 | Admin |
| manager@opsmind.com | manager123 | Manager |
| analyst@opsmind.com | analyst123 | Analyst |

---

## Data Flow

### KPI Tracking Flow

```
1. Admin creates KPI Definition
   POST /kpi/create-definition
   └── Stores target, unit, direction

2. System ingests daily values
   POST /kpi/ingest-value
   └── Calculates variance automatically

3. Dashboard displays trends
   GET /kpi/values/{kpi_id}/dates
   └── Recharts renders line graphs

4. Variance triggers justification
   POST /kpi/justify
   └── Auto-classifies root cause
```

### Justification Approval Flow

```
1. Analyst creates justification
   POST /kpi/justify
   └── Status: "draft"

2. Analyst submits for review
   PUT /kpi/justifications/{id}
   └── Status: "pending"

3. Manager approves
   PUT /kpi/justifications/{id}
   └── Status: "approved"

4. Senior approves certifies
   PUT /kpi/justifications/{id}
   └── Status: "certified"

5. System promotes to knowledge base
   KnowledgeService.create_from_justification()
   └── Creates verified insight
```

### Report Generation Flow

```
1. User selects report period
   GET /reports/weekly/1?date=2024-01-15

2. Service calculates date range
   ├── Week starts Monday
   └── Week ends Sunday

3. Service aggregates data
   ├── AVG actual/target/variance
   ├── MIN/MAX variance
   ├── Root cause distribution
   └── Justification counts by status

4. Response includes
   ├── KPI summary with stats
   ├── Root cause breakdown
   └── Compliance metrics
```

---

## Future Extensions

The README mentions planned features:

- [ ] **OpenAI RCA Generator** - AI-powered root cause suggestions
- [ ] **pgvector Similarity Search** - Vector embeddings for insight matching
- [ ] **Predictive KPI Engine** - ML-based forecasting
- [ ] **Real-time WebSocket Updates** - Live dashboard updates
- [ ] **Multi-tenant Billing** - Subscription management

---

## File Structure Summary

```
OpsGPT/
├── app/                          # Flask Backend
│   ├── __init__.py               # App factory
│   ├── config.py                 # Configuration
│   ├── extensions.py             # Flask extensions (db, jwt)
│   ├── models/                   # SQLAlchemy models
│   │   ├── user.py
│   │   ├── org.py
│   │   ├── kpi.py
│   │   ├── knowledge.py
│   │   └── approval.py
│   ├── routes/                   # API endpoints
│   │   ├── auth.py
│   │   ├── org.py
│   │   ├── kpi.py
│   │   ├── reports.py
│   │   └── knowledge.py
│   ├── services/                 # Business logic
│   │   ├── kpi_service.py
│   │   ├── reporting_service.py
│   │   └── knowledge_service.py
│   └── utils/                    # Utilities
│       ├── security.py
│       └── decorators.py
├── frontend/                      # React SPA
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── index.css
│   └── package.json
├── migrations/                    # Alembic migrations
├── seeds/                         # Seed data
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── requirements.txt
└── README.md
```

---

*Document generated from codebase analysis*