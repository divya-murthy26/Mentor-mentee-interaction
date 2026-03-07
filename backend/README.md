# Fund a Child India - Backend

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required variables:**
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A random secure string for JWT signing

**Optional (for full functionality):**
- Google Calendar API credentials (for calendar event creation)
- Email credentials (for feedback email notifications)

### Running

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | /api/auth/signup | No | - |
| POST | /api/auth/login | No | - |
| GET | /api/auth/me | Yes | Any |
| GET | /api/mentors | Yes | Any |
| POST | /api/mentors | Yes | Admin |
| GET | /api/mentees | Yes | Admin/Mentor |
| POST | /api/mentees | Yes | Admin |
| PATCH | /api/mentees/:id/assign | Yes | Admin |
| POST | /api/interactions | Yes | Mentee |
| GET | /api/interactions | Yes | Any |
| PATCH | /api/interactions/:id/accept | Yes | Mentor |
| POST | /api/feedback | Yes | Mentee |
| GET | /api/feedback | Yes | Any |
| GET | /api/feedback/:id/pdf | Yes | Any |

## Creating First Admin

Use the signup endpoint with role "admin":
```json
POST /api/auth/signup
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```
