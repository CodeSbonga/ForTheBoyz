# Telkom Parental Dashboard

A full-stack web application that provides parental controls and study mode management for families, built with Python Flask backend and React frontend.

## Features

- **Telkom-branded Dashboard**: Authentic Telkom South Africa styling and branding
- **Parental Controls**: Study mode toggle, website whitelisting, and usage tracking
- **Real-time Analytics**: Usage reports with charts and AI recommendations
- **Student Portal**: Kid-friendly interface with educational resources
- **Game Zone**: Fun learning games (Number Puzzle, Snakes & Ladders)
- **Role-based Authentication**: Parent, Student, and Admin roles

## Tech Stack

### Backend
- Python Flask
- SQLAlchemy (SQLite database)
- Flask-Login (Authentication)
- Pandas, Matplotlib, Seaborn, Plotly (Analytics)

### Frontend
- React with TypeScript
- TailwindCSS (Telkom-branded styling)
- React Router (Navigation)
- Axios (API calls)

## Quick Start

### 1. Backend Setup
```bash
cd backend
source ../venv/bin/activate
python app.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 3. Access the Application
- Main Dashboard: http://localhost:3000
- Backend API: http://localhost:5000

## Demo Credentials

- **Parent**: username: `parent`, password: `parent123`
- **Student**: username: `student`, password: `student123`
- **Admin**: username: `admin`, password: `admin123`

## Project Structure

```
telkom-parental-dashboard/
├── backend/
│   └── app.py                 # Flask application
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API services
│   │   └── types/             # TypeScript types
│   └── package.json
├── data/
│   └── app.db                 # SQLite database
└── README.md
```

## Key Features

### Parental Dashboard
- Study mode control with time scheduling
- Website whitelist/blacklist management
- Usage analytics with charts
- AI-powered recommendations

### Student Portal
- Educational resource access
- Game zone with learning games
- Study mode status display
- Progress tracking

### Game Zone
- Number Puzzle: Logic and problem-solving
- Snakes & Ladders: Fun learning game
- Score tracking and leaderboards

## API Endpoints

- `POST /api/login` - User authentication
- `GET /api/study-mode` - Get study mode settings
- `POST /api/study-mode` - Update study mode
- `GET /api/rules` - Get whitelist/blacklist rules
- `POST /api/rules` - Add new rule
- `DELETE /api/rules` - Remove rule
- `GET /api/usage-reports` - Get usage analytics
- `GET /api/game-scores` - Get game scores
- `POST /api/game-scores` - Save game score

## Development

The application is designed to be hackathon-ready with:
- Minimal setup requirements
- Pre-populated sample data
- Responsive design for mobile and desktop
- Real-time data visualization
- Complete CRUD operations

## License

MIT License - Built for Telkom South Africa hackathon