#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Abheepay POS Management System...\n');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

function log(message, color = 'blue') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`\n${colors.green}Step ${step}:${colors.reset} ${message}`);
}

// Check if required files exist
function checkFiles() {
  logStep(1, 'Checking required files...');
  
  const requiredFiles = [
    'package.json',
    'server.js',
    'database/enhanced-schema.sql',
    'services/enhancedDatabaseService.js',
    'routes/enhancedRoutes.js',
    'client/package.json',
    'client/src/components/ServiceProviderSelection.js',
    'client/src/components/EnhancedInventory.js',
    'client/src/components/EnhancedOrderBooking.js',
    'client/src/components/EnhancedDashboard.js'
  ];

  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  });

  if (missingFiles.length > 0) {
    log('❌ Missing required files:', 'red');
    missingFiles.forEach(file => log(`   - ${file}`, 'red'));
    process.exit(1);
  }

  log('✅ All required files found', 'green');
}

// Install backend dependencies
function installBackendDeps() {
  logStep(2, 'Installing backend dependencies...');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    log('✅ Backend dependencies installed', 'green');
  } catch (error) {
    log('❌ Failed to install backend dependencies', 'red');
    process.exit(1);
  }
}

// Install frontend dependencies
function installFrontendDeps() {
  logStep(3, 'Installing frontend dependencies...');
  
  try {
    execSync('cd client && npm install', { stdio: 'inherit' });
    log('✅ Frontend dependencies installed', 'green');
  } catch (error) {
    log('❌ Failed to install frontend dependencies', 'red');
    process.exit(1);
  }
}

// Create environment file
function setupEnvironment() {
  logStep(4, 'Setting up environment variables...');
  
  const envExample = `# Database Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Security
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;
  
  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envExample);
    log('✅ Created .env file with example configuration', 'green');
    log('⚠️  Please update .env with your actual credentials', 'yellow');
  } else {
    log('✅ .env file already exists', 'green');
  }
}

// Create database setup script
function createDatabaseScript() {
  logStep(5, 'Creating database setup script...');
  
  const dbScript = `#!/bin/bash

echo "🚀 Setting up Abheepay POS Management Database..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) is not installed"
    echo "Please install PostgreSQL and try again"
    exit 1
fi

# Database connection parameters
DB_HOST=\${DB_HOST:-localhost}
DB_PORT=\${DB_PORT:-5432}
DB_NAME=\${DB_NAME:-abheepay_pos}
DB_USER=\${DB_USER:-postgres}

echo "📊 Creating database schema..."

# Run the enhanced schema
psql -h \$DB_HOST -p \$DB_PORT -U \$DB_USER -d \$DB_NAME -f database/enhanced-schema.sql

if [ \$? -eq 0 ]; then
    echo "✅ Database schema created successfully"
    echo "✅ Data populated with:"
    echo "   - 2 Service Providers (Telering & Everlife)"
    echo "   - 390 Telering-390 POS Machines"
    echo "   - 251 Everlife-251 POS Machines"
    echo "   - 1000 Soundbox Machines (500 each to providers)"
    echo "   - 15 Distributors with real company data"
    echo "   - 15 Retailers with branch information"
else
    echo "❌ Failed to create database schema"
    exit 1
fi

echo "🎉 Database setup completed successfully!"`;
  
  fs.writeFileSync('setup-database.sh', dbScript);
  fs.chmodSync('setup-database.sh', '755');
  log('✅ Created database setup script (setup-database.sh)', 'green');
}

// Create startup script
function createStartupScript() {
  logStep(6, 'Creating startup script...');
  
  const startupScript = `#!/bin/bash

echo "🚀 Starting Abheepay POS Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js and try again"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    echo "Please install npm and try again"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found"
    echo "Please create .env file with your configuration"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install
cd client && npm install && cd ..

echo "🔧 Starting backend server..."
npm run dev &

echo "🎨 Starting frontend development server..."
cd client && npm start &

echo "✅ Abheepay POS Management System is starting..."
echo "🌐 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"`;
  
  fs.writeFileSync('start-system.sh', startupScript);
  fs.chmodSync('start-system.sh', '755');
  log('✅ Created startup script (start-system.sh)', 'green');
}

// Create verification script
function createVerificationScript() {
  logStep(7, 'Creating system verification script...');
  
  const verifyScript = `#!/bin/bash

echo "🔍 Verifying Abheepay POS Management System..."

# Check backend
echo "📦 Checking backend..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend server is running"
else
    echo "❌ Backend server is not responding"
fi

# Check frontend
echo "🎨 Checking frontend..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend server is running"
else
    echo "❌ Frontend server is not responding"
fi

# Check database connection
echo "📊 Checking database connection..."
if curl -s http://localhost:5000/api/service-providers > /dev/null; then
    echo "✅ Database connection is working"
else
    echo "❌ Database connection failed"
fi

echo "🎉 System verification completed!"`;
  
  fs.writeFileSync('verify-system.sh', verifyScript);
  fs.chmodSync('verify-system.sh', '755');
  log('✅ Created verification script (verify-system.sh)', 'green');
}

// Create documentation
function createQuickStartGuide() {
  logStep(8, 'Creating quick start guide...');
  
  const quickStart = `# Abheepay POS Management System - Quick Start Guide

## 🚀 Quick Setup

### 1. Environment Setup
\`\`\`bash
# Copy environment file
cp env.example .env

# Edit with your credentials
nano .env
\`\`\`

### 2. Database Setup
\`\`\`bash
# Run database setup
./setup-database.sh
\`\`\`

### 3. Start System
\`\`\`bash
# Start both backend and frontend
./start-system.sh
\`\`\`

### 4. Verify System
\`\`\`bash
# Check if everything is working
./verify-system.sh
\`\`\`

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📊 System Features

### Complete Flow
1. **Service Provider Selection** - Choose Telering or Everlife
2. **Inventory Management** - View and filter machines
3. **Order Booking** - Multi-step allocation process
4. **Delivery Tracking** - Real-time status updates
5. **Dashboard Analytics** - Live statistics and reports

### Key Components
- **390 Telering-390 POS Machines**
- **251 Everlife-251 POS Machines**
- **1000 Soundbox Machines** (with QR codes)
- **15 Distributors** with real company data
- **15 Retailers** with branch information

## 🔧 Troubleshooting

### Common Issues
1. **Port already in use**: Change PORT in .env file
2. **Database connection failed**: Check Supabase credentials
3. **Frontend not loading**: Ensure backend is running first

### Logs
- Backend logs: Check terminal running npm run dev
- Frontend logs: Check terminal running npm start
- Database logs: Check Supabase dashboard

## 📞 Support

For issues or questions:
1. Check the complete README.md
2. Review API documentation
3. Contact development team

---
**Abheepay POS Management System** - Complete, automated, and user-friendly!`;
  
  fs.writeFileSync('QUICK_START.md', quickStart);
  log('✅ Created quick start guide (QUICK_START.md)', 'green');
}

// Main setup function
function main() {
  console.log(`${colors.blue}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║                Abheepay POS Management System                ║${colors.reset}`);
  console.log(`${colors.blue}║                    Enhanced Setup Script                     ║${colors.reset}`);
  console.log(`${colors.blue}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
  
  checkFiles();
  installBackendDeps();
  installFrontendDeps();
  setupEnvironment();
  createDatabaseScript();
  createStartupScript();
  createVerificationScript();
  createQuickStartGuide();
  
  console.log(`\n${colors.green}🎉 Setup completed successfully!${colors.reset}`);
  console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
  console.log('1. Update .env file with your Supabase credentials');
  console.log('2. Run: ./setup-database.sh');
  console.log('3. Run: ./start-system.sh');
  console.log('4. Open: http://localhost:3000');
  console.log(`\n${colors.blue}📚 Documentation:${colors.reset}`);
  console.log('- Complete README: COMPLETE_SYSTEM_README.md');
  console.log('- Quick Start: QUICK_START.md');
  console.log('- API Docs: Check server.js for endpoints');
  
  console.log(`\n${colors.green}🚀 Your enhanced POS management system is ready!${colors.reset}`);
}

// Run setup
main(); 