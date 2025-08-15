# LifeCycle AI - Women's Health Companion

A comprehensive women's health tracking application with AI-powered insights using Google Gemini.

## Features

- 🤖 **AI Health Assistant** - Chat with AI for personalized health advice
- 📊 **Health Assessment** - Comprehensive scoring and recommendations
- 🔄 **Cycle Tracking** - Monitor menstrual cycles and patterns
- 💊 **Symptom Logging** - Track symptoms with severity levels
- 😊 **Mood Tracking** - Monitor emotional well-being and energy levels
- 🏃 **Wellness Monitoring** - Track sleep, steps, water intake, and exercise
- 🍎 **Nutrition Tracking** - Log meals and monitor calorie intake
- ⏰ **Health Reminders** - Set medication and wellness reminders
- 🤰 **Pregnancy Tracking** - Monitor pregnancy milestones (if applicable)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM (in-memory storage for development)
- **AI**: Google Gemini 2.5-flash
- **UI**: Shadcn/ui + Tailwind CSS + Radix UI
- **State Management**: TanStack React Query
- **Routing**: Wouter

## Local Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- VS Code (recommended)
- Git

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd lifecycle-ai

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Required for AI features
GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional: Database (uses in-memory storage if not provided)
DATABASE_URL=postgresql://username:password@localhost:5432/lifecycle_ai

# Development settings
NODE_ENV=development
PORT=5000
```

### 3. Get Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

### 4. Start Development Server

```bash
# Start the development server (both frontend and backend)
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000 (served by Express)
- **Backend API**: http://localhost:5000/api

### 5. VS Code Setup

#### Recommended Extensions

Install these VS Code extensions for the best development experience:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

#### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

#### Launch Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "env": {
        "NODE_ENV": "development"
      },
      "runtimeArgs": ["-r", "tsx/cjs"]
    }
  ]
}
```

### 6. Development Workflow

#### File Structure
```
lifecycle-ai/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and API client
│   │   └── hooks/       # Custom React hooks
├── server/              # Express backend
│   ├── services/        # Business logic
│   ├── routes.ts        # API routes
│   └── index.ts         # Server entry point
├── shared/              # Shared types and schemas
└── package.json
```

#### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run check        # TypeScript type checking
npm run db:push      # Push database schema changes

# Production
npm run build        # Build for production
npm start           # Start production server
```

#### Key Development Notes

1. **Hot Reload**: Both frontend and backend support hot reload
2. **API Routes**: All API endpoints are available at `/api/*`
3. **Database**: Uses in-memory storage by default (data resets on restart)
4. **AI Features**: Require valid `GEMINI_API_KEY` environment variable
5. **Type Safety**: Full TypeScript support across frontend and backend

### 7. Testing the Application

After starting the dev server, test these features:

- ✅ Navigate to different pages using the sidebar
- ✅ Try the AI chat feature
- ✅ Add cycle tracking data
- ✅ Log symptoms and moods
- ✅ Use the health assessment feature
- ✅ Track wellness metrics

### 8. Troubleshooting

#### Common Issues

**Port 5000 already in use:**
```bash
# Kill process on port 5000
npx kill-port 5000
# Or change PORT in .env file
```

**AI features not working:**
- Verify `GEMINI_API_KEY` is set correctly
- Check API key has proper permissions
- Ensure internet connection for API calls

**TypeScript errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 9. Database Setup (Optional)

For persistent data, set up PostgreSQL:

```bash
# Install PostgreSQL locally or use cloud service
# Update DATABASE_URL in .env
# Run schema migration
npm run db:push
```

## Deployment

The app is configured for deployment on Render with the included `render.yaml` file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.