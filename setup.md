# Abheepay POS Management System - Setup Guide

## 🚀 Quick Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Modern web browser

### Step 1: Backend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Copy `env.example` to `.env`
   - Update the following variables:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Database Setup**
   - Create a new Supabase project at https://supabase.com
   - Go to SQL Editor in your Supabase dashboard
   - Run the SQL schema from `database/schema.sql`
   - This creates all tables, indexes, and security policies
   - Default admin user: admin@abheepay.com / admin123

4. **Start Backend Server**
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Navigate to Client Directory**
   ```bash
   cd client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Frontend Development Server**
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

### Step 3: First Login

1. Open your browser and go to `http://localhost:3000`
2. Use the demo credentials:
   - **Email**: admin@abheepay.com
   - **Password**: admin123
   - **User Type**: Admin

## 📊 Database Schema Overview

The system includes the following tables:

- **machines**: POS/Soundbox device information
- **assignments**: Machine assignment history and current status
- **distributors**: Distributor information and credentials
- **retailers**: Retailer information linked to distributors
- **admins**: System administrators
- **settlements**: Optional settlement data integration

## 🔐 User Roles & Permissions

### Admin
- Full system access
- Can manage all users and machines
- Can create assignments
- Can generate all reports

### Distributor
- Can manage their retailers
- Can assign machines to their retailers
- Can view their assignments and machines
- Cannot access other distributors' data

### Retailer
- Can view their assigned machines
- Can view their assignment history
- Cannot create assignments
- Cannot access other retailers' data

## 🛠️ Key Features Implemented

### Backend
- ✅ Complete REST API with authentication
- ✅ Role-based access control
- ✅ Machine management (CRUD operations)
- ✅ Assignment management with history tracking
- ✅ User management (Distributors & Retailers)
- ✅ Report generation (CSV/Excel export)
- ✅ Settlement integration framework
- ✅ Input validation and error handling
- ✅ Security middleware (helmet, rate limiting)

### Frontend
- ✅ Modern React application with Tailwind CSS
- ✅ Authentication system with JWT
- ✅ Responsive dashboard with statistics
- ✅ Role-based navigation
- ✅ Login page with user type selection
- ✅ Placeholder pages for all major features
- ✅ Toast notifications for user feedback

### Database
- ✅ Complete PostgreSQL schema
- ✅ Row Level Security (RLS) policies
- ✅ Proper relationships and constraints
- ✅ Indexes for optimal performance
- ✅ Audit trail support

## 🔧 Configuration Options

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Client Configuration
CLIENT_URL=http://localhost:3000

# Optional: Settlement API Configuration
SETTLEMENT_API_URL=your-settlement-api-url
SETTLEMENT_API_KEY=your-settlement-api-key
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/change-password` - Change password

### Machines
- `GET /api/machines` - List all machines with filters
- `POST /api/machines` - Create new machine
- `GET /api/machines/:id` - Get machine details
- `PUT /api/machines/:id` - Update machine
- `DELETE /api/machines/:id` - Delete machine

### Assignments
- `GET /api/assignments` - List assignments with filters
- `POST /api/assignments` - Create new assignment
- `POST /api/assignments/:id/return` - Return machine
- `GET /api/assignments/machine/:machineId` - Get machine history

### Reports
- `GET /api/reports/assignments` - Export assignment report
- `GET /api/reports/machines` - Export machine inventory
- `GET /api/reports/distributors` - Export distributor report
- `GET /api/reports/retailers` - Export retailer report

## 🚀 Next Steps

1. **Complete Frontend Pages**: Implement the remaining page components (Machines, Assignments, etc.)
2. **Add Forms**: Create forms for adding/editing machines, assignments, and users
3. **Implement Search & Filters**: Add advanced search and filtering capabilities
4. **Add Real-time Features**: Implement WebSocket connections for real-time updates
5. **Settlement Integration**: Connect to actual settlement APIs
6. **Testing**: Add unit and integration tests
7. **Deployment**: Deploy to production environment

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify Supabase URL and API key in `.env`
   - Check if database schema has been applied

2. **Authentication Issues**
   - Ensure JWT_SECRET is set in `.env`
   - Check if admin user exists in database

3. **Frontend Not Loading**
   - Verify backend is running on port 5000
   - Check browser console for errors

4. **CORS Errors**
   - Ensure CLIENT_URL is set correctly in backend `.env`
   - Check if frontend is running on the correct port

### Support
For additional support, check the main README.md file or create an issue in the repository. 