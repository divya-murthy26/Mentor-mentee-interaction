# Fund a Child India - Frontend

## Setup Instructions

### Prerequisites
- Node.js v18+
- Backend running on port 5000

### Installation

```bash
npm install
```

### Environment Configuration

```bash
cp .env.example .env
```

The default proxy configuration points to `http://localhost:5000`. If your backend runs elsewhere, update `REACT_APP_API_URL` in `.env`.

### Running

```bash
npm start
```

App runs on `http://localhost:3000`.

## Application Routes

| Route | Description | Role |
|-------|-------------|------|
| `/` | Landing page | Public |
| `/login` | User login | Public |
| `/signup` | User registration | Public |
| `/admin/dashboard` | Admin management | Admin |
| `/mentor/dashboard` | Mentor workspace | Mentor |
| `/mentee/dashboard` | Mentee workspace | Mentee |

## Features by Role

### Admin
- Create mentor and mentee accounts
- Assign mentors to mentees
- View all interactions and feedback
- Overview stats dashboard

### Mentor
- View and manage session requests
- Accept or reject interactions
- View upcoming confirmed sessions
- View mentee feedback

### Mentee
- Schedule online or offline sessions
- Choose Google Meet or Zoom for online sessions
- View session status (pending/accepted/completed)
- Submit post-session feedback with star ratings
- Download feedback as PDF

## Tech Stack

- React 18
- React Router v6
- Axios
- Google Fonts (Playfair Display + DM Sans)
- Custom CSS with CSS Variables
