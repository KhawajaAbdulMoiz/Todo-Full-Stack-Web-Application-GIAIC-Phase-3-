# AI-Native Multi-User Todo Web Application with Conversational Agent

An AI-native, secure, multi-user todo application with conversational agent, authentication, responsive UI, and persistent storage built using Next.js, FastAPI, OpenAI Agents SDK, MCP Server, and Neon Serverless PostgreSQL.

## Features

- **AI-Powered Conversational Interface**: Natural language task management via OpenAI Agents
- **Secure Authentication**: JWT-based authentication with Better Auth
- **Task Management**: Full CRUD operations for user tasks via AI agent
- **User Isolation**: Users can only access their own tasks
- **Responsive UI**: Works on desktop and mobile devices
- **AI-Native Architecture**: Built with OpenAI Agents SDK and MCP Server
- **Stateless Backend**: Persistent storage with database-backed memory
- **Modern Tech Stack**: Next.js 16+, FastAPI, SQLModel, Neon PostgreSQL

## Tech Stack

- **Frontend**: Next.js 16+ with App Router, React 19+, OpenAI ChatKit, Tailwind CSS
- **Backend**: Python FastAPI, SQLModel, Pydantic
- **AI Framework**: OpenAI Agents SDK
- **MCP Server**: Official MCP SDK
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT)
- **Styling**: Tailwind CSS with custom animations and visual enhancements

## Architecture

The application follows an AI-native microservices architecture with:
- Frontend (Next.js) with conversational interface
- AI Agent layer (OpenAI Agents SDK) for natural language processing
- MCP Server exposing task operations as tools
- Backend (FastAPI) services with database access
- Shared database (Neon PostgreSQL) with proper user isolation
- JWT-based authentication for secure communication between all layers
- Stateless design with persistent database memory

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- PostgreSQL client tools
- Git for version control

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Set up backend:
   ```bash
   cd backend-task-api
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up frontend:
   ```bash
   cd frontend  # from project root
   npm install
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env` in both backend and frontend directories
   - Update the values with your specific configuration

### Running Locally

1. Start the backend:
   ```bash
   cd backend-task-api
   uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

## Project Structure

```
FullStackTodoApp/
├── backend-task-api/          # FastAPI backend service
│   ├── src/
│   │   ├── models/           # SQLModel data models
│   │   ├── services/         # Business logic
│   │   ├── api/              # API route handlers
│   │   └── core/             # Configuration and utilities
│   ├── requirements.txt
│   └── pyproject.toml
├── frontend/                 # Next.js frontend application with AI chat interface
│   ├── src/
│   │   ├── app/              # App Router pages
│   │   ├── components/       # Reusable UI components
│   │   ├── agents/           # AI agent integration
│   │   └── lib/              # Utilities and services
│   ├── package.json
│   └── next.config.js
├── mcp-server/               # Model Context Protocol server for AI tools
│   ├── src/
│   │   ├── tools/            # Task operation tools for AI agents
│   │   └── config/           # MCP configuration
│   └── requirements.txt
├── specs/                    # Feature specifications and plans
│   └── 001-frontend-ux-integration/
└── history/                  # Prompt history records
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Authenticate user
- `POST /api/v1/auth/logout` - Logout user

### Task Management
- `GET /api/v1/tasks` - Get user's tasks
- `POST /api/v1/tasks` - Create new task
- `PUT /api/v1/tasks/{id}` - Update task
- `DELETE /api/v1/tasks/{id}` - Delete task
- `PATCH /api/v1/tasks/{id}/toggle-completion` - Toggle task completion

## Security

- JWT verification required on all API and chat endpoints
- User isolation - users can only access their own tasks
- User data isolation enforced at API, tool, and database layers
- MCP tools validate user ownership before execution
- Secure token storage and transmission
- Input validation and sanitization
- Protection against common web vulnerabilities
- AI tool calls are traceable and auditable

## Development

### Backend Development
```bash
# Run tests
pytest

# Format code
black src/

# Lint code
flake8 src/
```

### Frontend Development
```bash
# Run tests
npm run test

# Format code
npm run format

# Lint code
npm run lint
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL database connection string
- `JWT_SECRET_KEY` - Secret key for JWT signing (use a strong random value)
- `JWT_ALGORITHM` - Algorithm for JWT signing (default: HS256)
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time (default: 30)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL
- `NEXT_PUBLIC_JWT_SECRET_KEY` - Same as backend JWT_SECRET_KEY

## Deployment

### Building for Production

Backend:
```bash
cd backend-task-api
pip install -r requirements.txt
python -m compileall src/
```

Frontend:
```bash
cd frontend
npm run build
```

### Docker Deployment
Use the provided `docker-compose.yml` file to deploy both services with Docker.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js for the excellent React framework
- FastAPI for the modern Python web framework
- Better Auth for the authentication solution
- Neon for the serverless PostgreSQL database
- The open-source community for countless valuable tools