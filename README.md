# OpsGPT AI - Operations Intelligence Backend

A **multi-tenant AI Operations Intelligence backend** for BPOs (Business Process Outsourcing companies).

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Build and start
docker-compose up --build

# Seed the database (in another terminal)
docker exec -it opsgpt-app-1 python seeds/seed.py

# API runs at: http://localhost:5000
```

### Manual Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Set up PostgreSQL and update .env
# DATABASE_URL=postgresql://opsmind:opsmind123@localhost:5432/opsmind_db

# Run migrations
alembic upgrade head

# Seed database
python seeds/seed.py

# Start server
python wsgi.py
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Organizations
- `POST /org/create` - Create organization
- `GET /org/<id>` - Get organization
- `GET /org/` - List all organizations

### Projects
- `POST /org/projects` - Create project
- `GET /org/projects/org/<org_id>` - List projects by org
- `GET /org/projects/<id>` - Get project

### KPI Management
- `POST /kpi/create-definition` - Create KPI definition
- `GET /kpi/definitions/project/<project_id>` - List KPIs
- `POST /kpi/ingest-value` - Ingest KPI value
- `GET /kpi/project/<project_id>` - Get KPI values

### Justifications
- `POST /kpi/justify` - Create justification with auto-classification
- `GET /kpi/justifications/<project_id>` - Get justifications
- `PUT /kpi/justifications/<id>` - Update justification

### Root Causes
- `POST /kpi/root-cause/create` - Create root cause
- `GET /kpi/root-cause/project/<project_id>` - List root causes

### Knowledge Base
- `POST /knowledge/insights` - Create insight
- `GET /knowledge/insights/project/<project_id>` - Get insights
- `GET /knowledge/insights/search` - Search insights

### Reporting
- `GET /reports/daily/<project_id>` - Daily report
- `GET /reports/weekly/<project_id>` - Weekly report
- `GET /reports/monthly/<project_id>` - Monthly report

## 🔐 Default Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@opsmind.com | admin123 | Admin |
| manager@opsmind.com | manager123 | Manager |
| analyst@opsmind.com | analyst123 | Analyst |

## 🧠 Core Features

### Multi-tenant Architecture
- Organizations → Projects → KPIs
- JWT-based authentication
- Role-based access (Admin, Manager, Analyst)

### Dynamic KPI Configuration
- Custom KPI definitions per project
- Configurable targets and units
- Direction-based variance calculation

### Operational Intelligence
- Auto-classification of root causes
- Justification capture with RCA
- Knowledge base for AI training

### Reporting Engine
- Daily/Weekly/Monthly aggregations
- Root cause analysis
- Compliance tracking

## 🐳 Docker Commands

```bash
# Build image
docker build -t opsgpt .

# Run container
docker run -p 5000:5000 opsgpt

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 📦 Tech Stack

- **Python 3.11**
- **Flask** (Blueprint architecture)
- **PostgreSQL 15**
- **SQLAlchemy** ORM
- **Alembic** migrations
- **JWT** Authentication
- **Gunicorn** production server

## 🌱 Future Extensions

- OpenAI integration for RCA generation
- pgvector for similarity search
- Predictive KPI forecasting
- React dashboard frontend