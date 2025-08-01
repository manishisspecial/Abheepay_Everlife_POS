# Abheepay POS/Soundbox Management System

A comprehensive management system for Abheepay POS and Soundbox devices, allowing efficient assignment and tracking of machines between distributors and retailers.

## 🚀 Features

### Core Functionality
- **Machine Management**: Add, edit, and track POS/Soundbox devices with unique MID/TID combinations
- **Assignment Flow**: Hierarchical assignment from admin → distributor → retailer
- **Usage History**: Complete audit trail of all machine assignments and transfers
- **Status Tracking**: Real-time status updates (Available, Assigned, Maintenance, Retired)

### User Management
- **Multi-role System**: Admin, Distributor, and Retailer roles with appropriate permissions
- **Secure Authentication**: JWT-based authentication with role-based access control
- **Profile Management**: Users can update their profiles and change passwords

### Reporting & Analytics
- **Exportable Reports**: Generate CSV/Excel reports for assignments, machines, and users
- **Dashboard Analytics**: Real-time statistics and insights
- **Search & Filter**: Advanced filtering by date, status, location, and more

### Optional Features
- **Settlement Integration**: Real-time settlement status (T+0, T+1, etc.) for each MID/TID
- **Bulk Operations**: Import machines and create bulk assignments
- **Audit Trail**: Complete history tracking for compliance and auditing

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **Supabase** for database and authentication
- **JWT** for secure authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

### Frontend
- **React** with functional components and hooks
- **Tailwind CSS** for modern, responsive UI
- **React Router** for navigation
- **Axios** for API communication

### Database
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)** for data protection
- **UUID** primary keys for scalability

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Modern web browser

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd abheepay-pos-management
```

### 2. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Environment Configuration
1. Copy `env.example` to `.env`
2. Update the following variables:
   ```env
   JWT_SECRET=your-super-secret-jwt-key-here
   SUPABASE_URL=your-supabase-project-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

#### Database Setup
1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL editor
3. The schema includes:
   - All necessary tables with proper relationships
   - Indexes for optimal performance
   - Row Level Security policies
   - Default admin user (admin@abheepay.com / admin123)

#### Start Backend Server
```bash
npm run dev
```
The backend will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies
```bash
cd client
npm install
```

#### Start Frontend Development Server
```bash
npm start
```
The frontend will start on `http://localhost:3000`

## 📊 Database Schema

### Core Tables
- **machines**: POS/Soundbox device information
- **assignments**: Machine assignment history and current status
- **distributors**: Distributor information and credentials
- **retailers**: Retailer information linked to distributors
- **admins**: System administrators
- **settlements**: Optional settlement data integration

### Key Relationships
- Distributors can have multiple retailers
- Machines can have multiple assignment records (history)
- Each assignment links a machine to a distributor and optionally a retailer

## 🔐 Authentication & Authorization

### User Roles
1. **Admin**: Full system access, can manage all users and machines
2. **Distributor**: Can manage their retailers and assigned machines
3. **Retailer**: Can view their assigned machines and assignment history

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt
- Row Level Security (RLS) in database
- Role-based API access control
- Input validation and sanitization

## 📈 API Endpoints

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

### Settlements (Optional)
- `GET /api/settlements/machine/:machineId` - Get machine settlement
- `GET /api/settlements/distributor/:distributorId` - Get distributor settlement
- `GET /api/settlements/summary` - Get overall settlement summary

## 🎨 Frontend Features

### Dashboard
- Real-time statistics and metrics
- Recent activity feed
- Quick action buttons

### Machine Management
- Add/edit machines with validation
- Bulk import functionality
- Advanced search and filtering
- Status management

### Assignment Management
- Create assignments with date validation
- Bulk assignment operations
- Assignment history tracking
- Return functionality

### User Management
- Role-based user creation
- Profile management
- Password change functionality

### Reporting
- Export reports in CSV/Excel format
- Customizable date ranges
- Filtered reports by various criteria

## 🔧 Configuration

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

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Install dependencies: `npm install --production`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting platform

### Database Deployment
- Use Supabase's built-in hosting and scaling
- Configure RLS policies for production
- Set up automated backups

## 📝 API Documentation

For detailed API documentation, see the individual route files in the `routes/` directory or use tools like Postman to explore the endpoints.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
- Complete machine and assignment management
- Multi-role user system
- Reporting and export capabilities
- Settlement integration framework 