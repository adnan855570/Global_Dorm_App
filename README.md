# 🏠 Global Dorm - Student Accommodation Platform

A modern, full-stack web application designed to help international students find and apply for student accommodation. Built with React.js, FastAPI, and MongoDB, featuring real-time distance calculations, geocoding services, and a responsive dark/light theme interface.

## ✨ Features

### 🔐 Authentication & User Management

- **User Registration & Login**: Secure JWT-based authentication system
- **Protected Routes**: Role-based access control for different user types
- **Session Management**: Persistent login state with localStorage

### 🏘️ Room Management

- **Room Listings**: Browse available student accommodations
- **Advanced Filtering**: Search by location, price, language, and postcode
- **Room Details**: Comprehensive information including images, descriptions, and pricing
- **CRUD Operations**: Create, read, update, and delete room listings (authenticated users)

### 📝 Application System

- **Room Applications**: Students can apply for rooms with one-click submission
- **Application Tracking**: Monitor application status (pending, accepted, rejected, cancelled)
- **Status Management**: Cancel applications and track their progress

### 🌍 External Services Integration

- **Geocoding**: Convert UK postcodes to coordinates using postcodes.io API
- **Distance Calculation**: Real-time distance and travel time from rooms to campus using OSRM
- **Weather Information**: Location-based weather data (demo implementation)
- **Caching**: Redis-based caching for improved performance

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Modern UI**: Clean, intuitive interface with hover effects and animations
- **Toast Notifications**: User feedback for all actions

## 🛠️ Tech Stack

### Frontend

- **React 19.1.1** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **React Router DOM 7.7.1** - Client-side routing
- **React Hot Toast** - Toast notification system

### Backend

- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.10+** - Core programming language
- **MongoDB** - NoSQL database with Motor async driver
- **Redis** - In-memory caching layer
- **JWT** - JSON Web Token authentication
- **Pydantic** - Data validation using Python type annotations

### External Services

- **Postcodes.io** - UK postcode geocoding API
- **OSRM** - Open Source Routing Machine for distance calculations
- **HTTPX** - Async HTTP client for external API calls

### DevOps & Deployment

- **Docker** - Containerization for both frontend and backend
- **Nginx** - Web server for frontend deployment
- **Uvicorn** - ASGI server for FastAPI

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Python 3.10+
- MongoDB instance
- Redis instance
- Docker and Docker Compose (optional)

### Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `Backend/` directory:

```bash
MONGO_URI=mongodb://localhost:27017/global_dorm
DATABASE_NAME=global_dorm
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
```

#### Frontend Environment Variables

Create a `.env` file in the `Frontend/` directory:

```bash
VITE_API_URL=http://localhost:8000
```

### Local Development

#### Backend Setup

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### Docker Deployment

#### Backend

```bash
cd Backend
docker build -t global-dorm-backend .
docker run -p 8000:8000 global-dorm-backend
```

#### Frontend

```bash
cd Frontend
docker build --build-arg VITE_API_URL=http://your-api-url -t global-dorm-frontend .
docker run -p 80:80 global-dorm-frontend
```

## 📁 Project Structure

```
Global Dorm/
├── Backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── auth/           # Authentication & JWT handling
│   │   ├── db/             # Database connection & models
│   │   ├── models/         # Pydantic data models
│   │   ├── services/       # External service integrations
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Backend container configuration
│   └── requirements.txt    # Python dependencies
├── Frontend/               # React.js frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   ├── Dockerfile          # Frontend container configuration
│   └── package.json        # Node.js dependencies
└── README.md               # This file
```

## 🖼️ Application Overview

Below is a quick visual tour of the app. Save your screenshots to `docs/screenshots/` using the filenames below to render them automatically in this README.

- **Home Dashboard**: Welcome card with quick links to rooms and applications.

![Home Dashboard](docs/screenshots/home.png)

- **Login**: Secure authentication form with email and password.

![Login](docs/screenshots/login.png)

- **Register**: Create a new account to access protected features.

![Register](docs/screenshots/register.png)

- **Applications**: Track your room applications with status badges and cancel action.

![Applications](docs/screenshots/applications.png)

- **Rooms**: Browse and filter listings; fetch geocode and distance to campus.

![Rooms](docs/screenshots/rooms.png)

Note: If the images don’t load in GitHub, ensure these files exist:

- `docs/screenshots/home.png`
- `docs/screenshots/login.png`
- `docs/screenshots/register.png`
- `docs/screenshots/applications.png`
- `docs/screenshots/rooms.png`

## 🔌 FastAPI Backend & API Endpoints

### FastAPI Application Structure

The backend is built with **FastAPI** and provides a RESTful API with automatic OpenAPI documentation, JWT authentication, and MongoDB integration.

**Key Features:**

- **Automatic API Documentation**: Available at `/docs` and `/redoc` when running
- **JWT Authentication**: Secure token-based authentication system
- **MongoDB Integration**: Async database operations with Motor driver
- **Redis Caching**: Performance optimization for external API calls
- **CORS Support**: Configured for frontend integration
- **Input Validation**: Pydantic models for request/response validation

### API Endpoints

#### 🔐 Authentication Endpoints

| Method | Endpoint          | Description       | Auth Required |
| ------ | ----------------- | ----------------- | ------------- |
| `POST` | `/users/register` | User registration | ❌            |
| `POST` | `/users/login`    | User login        | ❌            |

**Request/Response Examples:**

**Register User:**

```json
POST /users/register
{
  "email": "student@example.com",
  "password": "securepassword123"
}
```

**Login User:**

```json
POST /users/login
{
  "email": "student@example.com",
  "password": "securepassword123"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

#### 🏘️ Room Management Endpoints

| Method   | Endpoint           | Description               | Auth Required |
| -------- | ------------------ | ------------------------- | ------------- |
| `GET`    | `/rooms/`          | List all available rooms  | ❌            |
| `POST`   | `/rooms/`          | Create new room listing   | ✅            |
| `GET`    | `/rooms/{room_id}` | Get specific room details | ❌            |
| `PUT`    | `/rooms/{room_id}` | Update room information   | ✅            |
| `DELETE` | `/rooms/{room_id}` | Delete room listing       | ✅            |

**Room Data Model:**

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Large Ensuite Room",
  "description": "Spacious room with private bathroom",
  "address": "123 Student Street, London",
  "price_per_month": 850.0,
  "postcode": "E1 4NS",
  "languages": ["English", "Spanish"],
  "image": "https://example.com/room-image.jpg"
}
```

#### 📝 Application Management Endpoints

| Method  | Endpoint                    | Description              | Auth Required |
| ------- | --------------------------- | ------------------------ | ------------- |
| `POST`  | `/applications/`            | Apply for a room         | ✅            |
| `GET`   | `/applications/`            | Get user's applications  | ✅            |
| `GET`   | `/applications/{id}`        | Get specific application | ✅            |
| `PATCH` | `/applications/{id}/cancel` | Cancel application       | ✅            |

**Application Data Model:**

```json
{
  "id": "507f1f77bcf86cd799439012",
  "user_email": "student@example.com",
  "room_id": "507f1f77bcf86cd799439011",
  "status": "applied",
  "applied_at": "2024-01-15T10:30:00Z"
}
```

#### 🌍 External Services Endpoints

| Method | Endpoint                  | Description                     | Auth Required | Parameters         |
| ------ | ------------------------- | ------------------------------- | ------------- | ------------------ |
| `GET`  | `/external/geocode`       | Convert postcode to coordinates | ❌            | `postcode` (query) |
| `GET`  | `/external/room-distance` | Calculate distance to campus    | ❌            | `room_id` (query)  |

**External Services Examples:**

**Geocode Postcode:**

```json
GET /external/geocode?postcode=E14NS

Response:
{
  "latitude": 51.5074,
  "longitude": -0.1278
}
```

**Calculate Distance:**

```json
GET /external/room-distance?room_id=507f1f77bcf86cd799439011

Response:
{
  "distance_meters": 2500,
  "duration_seconds": 300
}
```

#### 🔍 Frontend Route Usage

The React frontend uses these API endpoints as follows:

**Authentication Flow:**

```javascript
// Login
const response = await fetch(`${API}/users/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

// Store JWT token
localStorage.setItem("jwt", data.access_token);
```

**Room Browsing:**

```javascript
// Fetch all rooms
const rooms = await fetch(`${API}/rooms/`);

// Apply for room
const application = await fetch(`${API}/applications`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
  body: JSON.stringify({ room_id }),
});
```

**Application Management:**

```javascript
// Get user's applications
const applications = await fetch(`${API}/applications/`, {
  headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
});

// Cancel application
const cancelled = await fetch(`${API}/applications/${id}/cancel`, {
  method: "PATCH",
  headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
});
```

**External Services Integration:**

```javascript
// Get room distance
const distance = await fetch(`${API}/external/room-distance?room_id=${roomId}`);

// Get weather/geocode data
const geocode = await fetch(`${API}/external/geocode?postcode=${postcode}`);
```

### 🔒 Authentication Headers

All protected endpoints require the JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### 📊 API Response Format

All API responses follow a consistent format:

- **Success**: Direct data return or HTTP 200/201 status
- **Error**: HTTP error status with detail message
- **Validation**: Pydantic model validation with detailed error messages

## 🎯 Key Features Explained

### Distance Calculation System

The application automatically calculates the distance from each room to the campus using:

1. **Geocoding**: Converts UK postcodes to latitude/longitude coordinates
2. **Routing**: Uses OSRM to calculate driving distance and travel time
3. **Caching**: Redis stores results to avoid repeated API calls

### Application Workflow

1. Students browse available rooms with filters
2. Apply for rooms with one-click submission
3. Track application status in real-time
4. Cancel applications if needed
5. Receive notifications for status changes

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Dark/light theme toggle
- Smooth transitions and hover effects
- Accessible form controls and navigation

## 🧪 Testing

### Backend Tests

```bash
cd Backend
python -m pytest tests/
```

### Frontend Tests

```bash
cd Frontend
npm run test
```

### API Load Testing with Locust

Basic load testing is included using Locust to stress key FastAPI endpoints.

#### Locustfile

The `Backend/locustfile.py` defines a `DormUser` that exercises:

```python
from locust import HttpUser, task, between

class DormUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def get_root(self):
        self.client.get("/")

    @task
    def get_rooms(self):
        self.client.get("/rooms")

    @task
    def test_geocode(self):
        self.client.get("/external/geocode?postcode=E1 4NS")
```

#### How to run

1. Ensure the backend is running on `http://localhost:8000`.
2. Install Locust (backend venv):

```bash
cd Backend
pip install locust
```

3. Start Locust:

```bash
locust -f locustfile.py --host http://localhost:8000
```

4. Open `http://localhost:8089`, configure users and spawn rate, start the test, and monitor charts (RPS, failures, latency percentiles).

#### Scenarios covered

- GET `/` (health)
- GET `/rooms` (listings)
- GET `/external/geocode?postcode=E1 4NS` (geocoding)

To extend with authenticated flows (login, applications), add a setup step to obtain a JWT from `/users/login` and include `Authorization: Bearer <token>` in subsequent requests.

## 📊 Performance Features

- **Redis Caching**: Reduces external API calls
- **Async Operations**: Non-blocking I/O operations
- **Database Indexing**: Optimized MongoDB queries
- **CDN Ready**: Static assets optimized for delivery

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Pydantic model validation
- **Protected Routes**: Role-based access control

## 🚀 Deployment Considerations

### Production Environment

- Set `JWT_SECRET` to a strong, unique value
- Configure CORS origins to your domain
- Use environment-specific MongoDB and Redis instances
- Enable HTTPS for production

### Scaling

- Implement load balancing for multiple backend instances
- Use MongoDB replica sets for high availability
- Configure Redis clustering for distributed caching
- Implement API rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Postcodes.io** for UK postcode geocoding
- **OSRM** for open-source routing services
- **FastAPI** community for the excellent web framework
- **React** team for the powerful frontend library
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the API documentation at `/docs` when running the backend
- Review the code comments for implementation details

---

**Global Dorm** - Making student accommodation search simple and efficient! 🎓🏠
