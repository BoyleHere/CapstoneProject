# 🎉 EventZen — Corporate Event Management Platform

> *Deloitte Capstone Project*

EventZen is a full-stack, microservices-based corporate event management system that streamlines event planning, venue booking, vendor coordination, and attendee management. It is designed for enterprises where administrators orchestrate events and customers reserve their seats — all through a clean, role-aware web interface.

---

## 📐 Architecture Overview

EventZen follows a **microservices architecture** composed of three independent backend services and a unified React frontend:

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                │
│                     localhost:5173                      │
└───────┬──────────────┬──────────────────┬───────────────┘
        │              │                  │
        ▼              ▼                  ▼
┌──────────────┐ ┌───────────────┐ ┌─────────────────────┐
│  UserService │ │  EventService │ │   BookingService     │
│  (.NET / C#) │ │  (Java/Spring)│ │   (Java/Spring)      │
│  Port: 5130  │ │  Port: 8080   │ │   Port: 8081         │
└──────┬───────┘ └───────┬───────┘ └─────────┬────────────┘
       │                 │                   │
       └─────────────────┴───────────────────┘
                         │
                    ┌────▼────┐
                    │  MySQL  │
                    │EventZen │
                    │   DB    │
                    └─────────┘
```

---

## 🧩 Modules & Features

### 1. 🔐 User Service (ASP.NET Core / C#)

Handles authentication, authorization, and user profile management. Issues **JWT tokens** consumed by all other services.

**Key Features:**
- User registration (auto-assigned `CUSTOMER` role)
- JWT-based login with BCrypt password hashing
- Profile view and update for authenticated users
- Role-based access control (`ADMIN` / `CUSTOMER`)

---

### 2. 📅 Event Service (Java / Spring Boot)

The core service for managing events, venues, and vendors. All write operations are restricted to `ADMIN` role; read operations are available to all authenticated users.

**Sub-modules:**

#### 🏟️ Venue Management
- Create, read, update, and soft-delete venues
- Filter venues by location, date, and capacity
- **Venue conflict prevention**: A database trigger prevents double-booking a venue for the same date/time

#### 🗓️ Event Management
- Full CRUD for events (linked to a venue)
- Filter active events by venue, date range
- Events carry metadata: max attendees per user, budget, cost per ticket

#### 🤝 Vendor Management
- Register vendors with service type and contact details
- Soft-delete with audit trail support

#### 🔗 Event-Vendor Assignment
- Assign one or more vendors to a specific event
- Remove vendor assignments from events
- List all vendors assigned to an event

---

### 3. 📋 Booking Service (Java / Spring Boot)

Manages the full lifecycle of event bookings, including attendee tracking and administrative oversight.

**Key Features:**
- Create bookings with attendee list
- Enforce per-user **max attendee limit** set by event configuration
- **Capacity enforcement**: a DB trigger auto-sets booking to `PENDING` if venue capacity would be exceeded
- View personal booking history and detailed booking info
- Admin dashboard with paginated view of all bookings (sorted newest-first)
- Event attendance statistics (total attendees booked)
- Soft-delete bookings (admin only)
- Booking statuses: `PENDING` → `APPROVED` / `REJECTED` / `CANCELLED`

---

### 4. 🖥️ Frontend (React + Vite + TypeScript)

A responsive single-page application with role-based routing and a clean UI.

**Key Features:**
- Role-aware navigation (different menus for Admin vs Customer)
- Protected routes with automatic redirect to login
- JWT stored in context; passed automatically in API calls
- Axios-based API integration with all three backend services
- Lucide icons for a consistent visual language

---

## 🔌 Backend API Endpoints

All services require a JWT Bearer token in the `Authorization` header unless noted otherwise.

### 👤 User Service — `http://localhost:5130`

| Method | Endpoint | Access | Description |
|--------|--------------------------|-----------|-------------------------------|
| `POST` | `/api/auth/register` | Public | Register a new customer account |
| `POST` | `/api/auth/login` | Public | Login and receive a JWT token |
| `GET` | `/api/users/profile` | Auth | Get the logged-in user's profile |
| `PUT` | `/api/users/profile` | Auth | Update name or password |

---

### 📅 Event Service — `http://localhost:8080`

#### Events

| Method | Endpoint | Access | Description |
|--------|------------------------|-----------|-------------------------------|
| `POST` | `/events` | ADMIN | Create a new event |
| `GET` | `/events` | Auth | List all active events (with optional filters: `venueId`, `fromDate`, `toDate`) |
| `GET` | `/events/{id}` | Auth | Get event details by ID |
| `PUT` | `/events/{id}` | ADMIN | Update an existing event |
| `DELETE` | `/events/{id}` | ADMIN | Soft-delete an event |

#### Venues

| Method | Endpoint | Access | Description |
|--------|------------------------|-----------|-------------------------------|
| `POST` | `/venues` | ADMIN | Create a new venue |
| `GET` | `/venues` | Auth | List all active venues (optional filters: `location`, `date`, `capacity`) |
| `GET` | `/venues/{id}` | Auth | Get venue details by ID |
| `PUT` | `/venues/{id}` | ADMIN | Update a venue |
| `DELETE` | `/venues/{id}` | ADMIN | Soft-delete a venue |

#### Vendors

| Method | Endpoint | Access | Description |
|--------|------------------------|-----------|-------------------------------|
| `POST` | `/vendors` | ADMIN | Create a vendor |
| `GET` | `/vendors` | Auth | List all active vendors |
| `GET` | `/vendors/{id}` | Auth | Get vendor details by ID |
| `PUT` | `/vendors/{id}` | ADMIN | Update a vendor |
| `DELETE` | `/vendors/{id}` | ADMIN | Soft-delete a vendor |

#### Event–Vendor Assignments

| Method | Endpoint | Access | Description |
|--------|----------------------------------------|-----------|-------------------------------|
| `POST` | `/events/{eventId}/vendors/{vendorId}` | ADMIN | Assign a vendor to an event |
| `GET` | `/events/{eventId}/vendors` | Auth | List all vendors for an event |
| `DELETE` | `/events/{eventId}/vendors/{vendorId}` | ADMIN | Remove a vendor from an event |

> 📖 Swagger UI available at: `http://localhost:8080/swagger-ui.html`

---

### 📋 Booking Service — `http://localhost:8081`

| Method | Endpoint | Access | Description |
|--------|---------------------------------------------|-----------------|------------------------------------------------------|
| `POST` | `/bookings` | CUSTOMER, ADMIN | Create a new booking with attendee list |
| `GET` | `/bookings/my` | CUSTOMER, ADMIN | Get the logged-in user's bookings |
| `GET` | `/bookings/{bookingId}` | CUSTOMER, ADMIN | Get detailed info for a specific booking |
| `PUT` | `/bookings/{bookingId}` | CUSTOMER, ADMIN | Update an existing booking (attendee count, status) |
| `GET` | `/bookings` | ADMIN | Get all bookings (paginated, sorted by newest) |
| `GET` | `/bookings/event/{eventId}/attendees` | ADMIN | List all attendees for a given event |
| `GET` | `/bookings/event/{eventId}/stats` | CUSTOMER, ADMIN | Get booking stats (total attendees) for an event |
| `DELETE` | `/bookings/admin/{bookingId}` | ADMIN | Soft-delete a booking |

> 📖 Swagger UI available at: `http://localhost:8081/swagger-ui.html`

---

## 🌐 Frontend URLs & Pages

Base URL: `http://localhost:5173`

### Public Pages

| URL | Page | Description |
|-----------|------|-------------|
| `/` | Home | Welcome landing page with EventZen intro |
| `/events` | Events | Browse all upcoming active events |
| `/login` | Login | Authenticate with email and password |
| `/register` | Register | Create a new customer account |

### Customer Pages *(requires login as CUSTOMER)*

| URL | Page | Description |
|--------------------------|------|-------------|
| `/profile` | Profile | View and update personal information |
| `/my-bookings` | My Bookings | View all personal bookings with status |
| `/my-bookings/:id` | Booking Details | Detailed view of a single booking with attendee list |

### Admin Pages *(requires login as ADMIN)*

| URL | Page | Description |
|--------------------------|------|-------------|
| `/admin` | Dashboard | Overview of all bookings with pagination (newest first); event statistics |
| `/admin/events` | Manage Events | Create, view, edit, and delete events; assign vendors |
| `/admin/events/:id` | Event Details | Detailed admin view for a specific event with attendee info |
| `/admin/venues` | Manage Venues | Full CRUD for venues with capacity and pricing |
| `/admin/vendors` | Manage Vendors | Full CRUD for vendor registry |

---

## 🗄️ Database Schema

All services share a single **MySQL** database named `EventZen`.

| Table | Description |
|----------------|------------------------------------------------------|
| `users` | User accounts with roles (ADMIN / CUSTOMER) |
| `venues` | Event venues with location, capacity, and pricing |
| `events` | Events linked to venues with budget and ticket cost |
| `vendors` | Service vendors (catering, AV, etc.) |
| `event_vendors` | Many-to-many mapping of vendors to events |
| `bookings` | Customer bookings linked to users and events |
| `attendees` | Individual attendees per booking (name, email, phone) |
| `payments` | Payment records per booking (schema-ready) |
| `audit_logs` | Automatic audit trail for all major table operations |

### Key Database Constraints (Triggers)

- **`prevent_venue_conflict`** — Blocks inserting an event if the same venue is already booked at that exact date/time.
- **`enforce_capacity`** — Sets a booking to `PENDING` automatically if the venue's capacity would be exceeded by approved bookings.
- **Auto `updated_at` triggers** — Keeps `updated_at` columns current on every UPDATE across all tables.
- **Audit INSERT/UPDATE triggers** — Logs old and new data to `audit_logs` for full traceability.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-----------------|---------------------------------------------|
| Frontend | React 19, TypeScript, Vite, React Router v7 |
| UI Components | Lucide React, Vanilla CSS |
| HTTP Client | Axios |
| User Service | ASP.NET Core (.NET), C#, Entity Framework |
| Event Service | Java 17, Spring Boot 4.0, Spring Data JPA |
| Booking Service | Java 17, Spring Boot 4.0, Spring Data JPA |
| Authentication | JWT (JJWT 0.12.x), BCrypt |
| Database | MySQL |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Build Tools | Maven (Java services), npm / Vite (Frontend) |

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- .NET SDK 8+
- Node.js 18+
- MySQL Server (running locally)

### 1. Database Setup

```sql
-- Run the full schema script
source EventZen_full_schema.sql
```

### 2. Start User Service (ASP.NET Core)

```bash
cd EventZen.UserService
dotnet run
# Runs on http://localhost:5130
```

### 3. Start Event Service (Spring Boot)

```bash
cd EventZen.EventService
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### 4. Start Booking Service (Spring Boot)

```bash
cd EventZen.BookingService
./mvnw spring-boot:run
# Runs on http://localhost:8081
```

### 5. Start Frontend (Vite)

```bash
cd EventZen.Frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔑 Roles & Permissions Summary

| Feature | ADMIN | CUSTOMER |
|--------------------------------------|:-----:|:--------:|
| Register / Login | ✅ | ✅ |
| Browse Events & Venues | ✅ | ✅ |
| View Profile | ✅ | ✅ |
| Create / Edit / Delete Events | ✅ | ❌ |
| Create / Edit / Delete Venues | ✅ | ❌ |
| Create / Edit / Delete Vendors | ✅ | ❌ |
| Assign Vendors to Events | ✅ | ❌ |
| Create & Update Bookings | ✅ | ✅ |
| View Own Bookings | ✅ | ✅ |
| View All Bookings (Admin Dashboard) | ✅ | ❌ |
| View Event Attendee Lists | ✅ | ❌ |
| Soft-Delete Bookings | ✅ | ❌ |

---

## 📁 Project Structure

```
Capstone-Project/
├── EventZen.UserService/        # ASP.NET Core — Auth & User management
│   ├── Controllers/             # AuthController, UserController
│   ├── Models/                  # User entity
│   ├── DTOs/                    # Request/Response DTOs
│   ├── Services/                # JwtService
│   └── Data/                    # ApplicationDbContext (EF Core)
│
├── EventZen.EventService/       # Spring Boot — Events, Venues, Vendors
│   └── src/main/java/com/eventzen/eventservice/
│       ├── controller/          # EventController, VenueController, VendorController, EventVendorController
│       ├── service/             # Business logic layer
│       ├── entity/              # JPA entities
│       ├── dto/                 # Request/Response DTOs
│       ├── repository/          # Spring Data JPA repositories
│       └── config/              # SecurityConfig, JWT filter
│
├── EventZen.BookingService/     # Spring Boot — Bookings & Attendees
│   └── src/main/java/com/eventzen/bookingservice/
│       ├── controller/          # BookingController
│       ├── service/             # BookingService, BookingServiceImpl
│       ├── entity/              # Booking, Attendee entities
│       ├── dto/                 # Request/Response DTOs
│       └── config/              # SecurityConfig, JWT filter
│
├── EventZen.Frontend/           # React + Vite + TypeScript
│   └── src/
│       ├── pages/Admin/         # Dashboard, ManageEvents, ManageVenues, ManageVendors, AdminEventDetails
│       ├── pages/Auth/          # Login, Register
│       ├── pages/Customer/      # Events, MyBookings, BookingDetails, Profile
│       ├── components/          # Navbar
│       └── context/             # AuthContext (JWT state management)
│
├── EventZen_full_schema.sql     # Full MySQL schema with triggers
└── README.md
```

---

*Built with ❤️ for the Deloitte Capstone Project — EventZen by Prashast*
