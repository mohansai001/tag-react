# TAG React Backend

A Node.js Express backend with clean architecture, PostgreSQL database, and comprehensive authentication system.

## 🚀 Features

- **Clean Architecture**: Controllers, Services, Middleware, Models separation
- **Authentication**: JWT tokens, refresh tokens, MSAL integration, session management
- **Database**: PostgreSQL with Sequelize ORM
- **Security**: Rate limiting, CORS, Helmet, input validation
- **Logging**: Winston with daily rotation
- **Documentation**: Swagger/OpenAPI
- **Environment Management**: Multiple environment configurations
- **Error Handling**: Centralized error management
- **Testing**: Jest setup for unit and integration tests

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.js          # Main configuration
│   │   ├── database/
│   │   │   └── database.js    # Database configuration
│   │   ├── logger.js          # Winston logger setup
│   │   └── swagger.js         # Swagger documentation
│   ├── controllers/
│   │   └── authController.js  # Authentication controllers
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   ├── validation.js     # Request validation
│   │   └── errorHandler.js   # Error handling
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── RefreshToken.js   # Refresh token model
│   ├── routes/
│   │   └── authRoutes.js     # Authentication routes
│   ├── services/
│   │   └── authService.js    # Authentication service
│   └── server.js             # Main server file
├── logs/                     # Application logs
├── env.development          # Development environment
├── env.qa                   # QA environment
├── env.stage                # Staging environment
├── env.prod                 # Production environment
└── package.json
```

## 🛠️ Setup

### Prerequisites

- Node.js >= 16.0.0
- PostgreSQL database (RetoolDB connection string provided)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the appropriate environment file:
   ```bash
   # For development
   cp env.development .env
   
   # For QA
   cp env.qa .env
   
   # For staging
   cp env.stage .env
   
   # For production
   cp env.prod .env
   ```

4. **Database Setup**
   
   The application uses RetoolDB with the provided connection string. No additional setup required.

5. **Run migrations**
   ```bash
   npm run migrate
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login user |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/logout` | Logout user |
| POST | `/api/v1/auth/msal` | MSAL authentication |
| POST | `/api/v1/auth/change-password` | Change password |
| POST | `/api/v1/auth/forgot-password` | Request password reset |
| POST | `/api/v1/auth/reset-password` | Reset password |
| GET | `/api/v1/auth/me` | Get current user profile |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

### Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api-docs` | Swagger API documentation |

## 🔐 Authentication

The application supports multiple authentication methods:

### JWT Authentication
- Access tokens with configurable expiration
- Refresh tokens for seamless re-authentication
- Token validation and revocation

### MSAL Integration
- Microsoft Azure AD authentication
- Automatic user creation from MSAL data
- Seamless integration with existing JWT system

### Session Management
- Express sessions with PostgreSQL storage
- Configurable session settings
- Session-based authentication option

## 🗄️ Database

### Models

#### User
- UUID primary key
- Email and username validation
- Password hashing with bcrypt
- Role-based access control
- MSAL integration support

#### RefreshToken
- Token storage and validation
- Expiration tracking
- IP address and user agent logging
- Revocation support

### Database Configuration
- Connection pooling
- SSL support for production
- Migration and seeding support
- Environment-specific configurations

## 🔒 Security Features

- **Rate Limiting**: Configurable request limits
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Express-validator integration
- **Password Security**: Simple password comparison
- **Token Security**: JWT with refresh tokens
- **Session Security**: Secure cookie settings
- **Retry Mechanism**: Exponential backoff for database operations

## 📊 Logging

- **Winston Logger**: Structured logging
- **Daily Rotation**: Automatic log file rotation
- **Multiple Transports**: Console and file logging
- **Environment-specific**: Different log levels per environment

## 🧪 Testing

- **Jest**: Testing framework
- **Supertest**: HTTP assertions
- **Test Coverage**: Coverage reporting
- **Mocking**: Database and external service mocking

## 📚 API Documentation

Swagger/OpenAPI documentation is available at `/api-docs` when the server is running.

Features:
- Interactive API testing
- Request/response examples
- Authentication documentation
- Schema definitions

## 🌍 Environment Configuration

The application supports multiple environments:

- **Development**: Local development with debug features
- **QA**: Quality assurance testing environment
- **Staging**: Pre-production environment
- **Production**: Live production environment

Each environment has its own configuration file with appropriate settings for:
- Database connections
- JWT secrets
- CORS origins
- Logging levels
- Feature flags

## 🚀 Deployment

### Production Checklist

- [ ] Set appropriate environment variables
- [ ] Configure database connection
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline

### Docker Support

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 