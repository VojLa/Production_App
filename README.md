# ManuFlow

ERP systém pro výrobní firmy. Zakázky, sklad, fakturace a kooperace na jednom místě.

## Technologie

| Vrstva    | Technologie              |
|-----------|--------------------------|
| Frontend  | Next.js 14, TypeScript   |
| Backend   | FastAPI, Python 3.12     |
| Databáze  | PostgreSQL 16            |
| Auth      | JWT (Bearer token)       |
| Nasazení  | Docker + Docker Compose  |

## Spuštění projektu

### Požadavky

- Docker
- Docker Compose

### Postup

```bash
# 1. Klonujte repozitář
git clone https://github.com/your-org/manuflow.git
cd manuflow

# 2. Zkopírujte konfiguraci
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Spusťte projekt
docker compose up --build
```

### Přístupy po spuštění

| Služba        | URL                          |
|---------------|------------------------------|
| Frontend      | http://localhost:3000        |
| Backend API   | http://localhost:8000        |
| API Docs      | http://localhost:8000/docs   |

### Demo účet

```
Email:  demo@manuflow.cz
Heslo:  demo1234
```

## Struktura projektu

```
manuflow/
├── apps/
│   ├── api/          # FastAPI backend
│   └── web/          # Next.js frontend
└── db/
    ├── init/         # SQL migrace
    └── seeds/        # Testovací data
```

## Vývoj bez Dockeru

### Backend

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd apps/web
npm install
npm run dev
```
