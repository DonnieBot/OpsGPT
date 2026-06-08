# ⚡ OpsGPT AI - Full SaaS Operations Intelligence Platform

A **complete, production-ready multi-tenant SaaS** for BPO operations management with AI-powered insights.

![Dashboard Preview](https://via.placeholder.com/800x400/6366f1/ffffff?text=OpsGPT+Dashboard)

## 🚀 Deploy in 60 Seconds

```bash
# Clone and deploy
git clone https://github.com/DonnieBot/OpsGPT.git
cd OpsGPT
docker-compose up --build
```

**Done!** Access your SaaS at: `http://localhost`

---

## ✨ Features

### 📊 Dashboard
- Real-time KPI performance trends
- Root cause distribution charts
- Quick access to pending justifications
- Executive-ready metrics

### 🎯 KPI Management
- Dynamic KPI definitions per client
- Automated variance calculation
- Trend visualization
- Threshold alerts

### 📝 Justifications & RCA
- Auto-classification of root causes
- Approval workflow (Draft → Approved → Certified)
- Action plan tracking
- Team collaboration

### 📈 Reports
- Daily/Weekly/Monthly analytics
- Export to CSV/PDF
- Root cause analysis
- Compliance tracking

### 💡 Knowledge Base
- AI-ready operational insights
- Verified resolution patterns
- Confidence scoring
- Similar incident finder

### ⚙️ Settings
- Profile management
- Organization settings
- Notification preferences
- Security controls

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + Recharts |
| Backend | Python 3.11 + Flask |
| Database | PostgreSQL 15 |
| Auth | JWT |
| Web Server | Gunicorn + Nginx |
| Container | Docker Compose |

---

## 🔐 Default Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@opsmind.com | admin123 | Admin |
| manager@opsmind.com | manager123 | Manager |
| analyst@opsmind.com | analyst123 | Analyst |

---

## 📁 Project Structure

```
OpsGPT/
├── frontend/           # React SPA
│   ├── src/
│   │   ├── pages/      # Dashboard, Projects, KPIs, Reports, etc.
│   │   ├── components/ # Sidebar, Layout, etc.
│   │   ├── services/   # API service
│   │   └── context/    # Auth context
│   └── dist/           # Built assets
├── app/                # Flask backend
│   ├── models/         # SQLAlchemy models
│   ├── routes/         # API endpoints
│   └── services/       # Business logic
├── migrations/         # Alembic DB migrations
├── seeds/             # Sample data
├── docker-compose.yml # Full stack deployment
├── Dockerfile          # Multi-stage build
└── nginx.conf         # Production Nginx config
```

---

## 🐳 Docker Deployment

```bash
# Start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after changes
docker-compose up --build
```

### Services:
- **Port 80**: Frontend (Nginx)
- **Port 5000**: Backend API
- **Port 5432**: PostgreSQL

---

## 🔧 Manual Setup

### Backend
```bash
pip install -r requirements.txt
python seeds/seed.py
python wsgi.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌱 Future Extensions

- [ ] OpenAI RCA Generator
- [ ] pgvector Similarity Search
- [ ] Predictive KPI Engine
- [ ] Real-time WebSocket Updates
- [ ] Multi-tenant Billing

---

## 📄 License

MIT License - Built with ❤️ for BPO Operations Teams