# 🚀 Complete Setup Guide - Fix All Inventory Issues

## 🎯 Problem Summary
- Inventory pages showing blank for both Telering & Everlife
- Need 1000 soundboxes for Telering, 0 for Everlife
- Partner types showing "Unknown" instead of B2B/B2C
- Profile page needs better styling

## ✅ Solutions Implemented

### 1. Fixed API Endpoints
- ✅ Updated `EnhancedInventory.js` to use correct API endpoints
- ✅ Fixed service providers route to use database service
- ✅ Corrected API response handling

### 2. Generated Correct Data
- ✅ Created Telering machines (390 POS + 1000 Soundbox)
- ✅ Updated partner types (B2C for Telering, B2B for Everlife)
- ✅ Generated SQL scripts for easy setup

## 🚀 Step-by-Step Setup

### Step 1: Environment Setup

Create a `.env` file in the root directory:

```bash
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
```

### Step 2: Database Setup

1. **Go to your Supabase Dashboard**
2. **Open the SQL Editor**
3. **Run this SQL to create all tables:**

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    company_name VARCHAR(255),
    gst_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create distributors table
CREATE TABLE IF NOT EXISTS distributors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    company_name VARCHAR(255),
    gst_number VARCHAR(50),
    contact_person VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create machines table
CREATE TABLE IF NOT EXISTS machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    mid VARCHAR(255),
    tid VARCHAR(255),
    machine_type VARCHAR(50) NOT NULL,
    model VARCHAR(255),
    manufacturer VARCHAR(255),
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    partner VARCHAR(255),
    partner_type VARCHAR(20),
    qr_code VARCHAR(255),
    has_standee BOOLEAN DEFAULT FALSE,
    service_provider_id UUID REFERENCES service_providers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create retailers table
CREATE TABLE IF NOT EXISTS retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    shop_name VARCHAR(255),
    gst_number VARCHAR(50),
    distributor_id UUID REFERENCES distributors(id),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES machines(id),
    distributor_id UUID REFERENCES distributors(id),
    retailer_id UUID REFERENCES retailers(id),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    assignment_date DATE DEFAULT CURRENT_DATE,
    return_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(255) UNIQUE NOT NULL,
    distributor_id UUID REFERENCES distributors(id),
    retailer_id UUID REFERENCES retailers(id),
    service_provider_id UUID REFERENCES service_providers(id),
    order_type VARCHAR(50),
    order_status VARCHAR(20) DEFAULT 'PENDING',
    order_date DATE DEFAULT CURRENT_DATE,
    delivery_address TEXT,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    notes TEXT,
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory_stock table
CREATE TABLE IF NOT EXISTS inventory_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_provider_id UUID REFERENCES service_providers(id),
    machine_type VARCHAR(50) NOT NULL,
    model VARCHAR(255),
    manufacturer VARCHAR(255),
    total_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER DEFAULT 0,
    allocated_quantity INTEGER DEFAULT 0,
    maintenance_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_provider_id, machine_type, model, manufacturer)
);
```

### Step 3: Insert Data

1. **Copy the content from `database/real-pos-data.sql`**
2. **Paste it in the Supabase SQL Editor and run it**

3. **Copy the content from `database/add-telering-machines.sql`**
4. **Paste it in the Supabase SQL Editor and run it**

### Step 4: Test Database Connection

Run the database test script:

```bash
node scripts/test-database.js
```

This will verify:
- ✅ Database connection is working
- ✅ Tables exist
- ✅ Data is properly inserted
- ✅ Correct machine counts

### Step 5: Start the Application

1. **Start the backend server:**
```bash
npm run dev
```

2. **Start the React client (in a new terminal):**
```bash
cd client
npm start
```

3. **Verify both are running:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Step 6: Test the Inventory Pages

1. **Login to the application**
2. **Navigate to Service Providers**
3. **Click on Telering or Everlife**
4. **Verify the inventory pages show data**

## 📊 Expected Results

### Telering (ID: 1)
- **POS Machines**: 390 (Available)
- **Soundbox Machines**: 1000 (Available)
- **Partner Type**: B2C
- **Total**: 1390 machines

### Everlife (ID: 2)
- **POS Machines**: 251 (Available)
- **Soundbox Machines**: 0
- **Partner Type**: B2B
- **Total**: 251 machines

## 🔍 Troubleshooting

### If inventory pages are still blank:

1. **Check browser console for errors**
2. **Test API endpoints directly:**
   ```bash
   curl http://localhost:5000/api/service-providers
   curl http://localhost:5000/api/service-providers/1/inventory
   ```

3. **Verify database connection:**
   ```bash
   node scripts/test-database.js
   ```

4. **Check if React client is running:**
   - Should be accessible at http://localhost:3000

### If you see database connection errors:

1. **Check your `.env` file has correct Supabase credentials**
2. **Verify tables exist in Supabase**
3. **Ensure all SQL scripts ran successfully**

### If machines show "Unknown" partner type:

1. **Run the partner type update SQL from `add-telering-machines.sql`**
2. **Refresh the page**

## 🎉 Success Indicators

✅ Inventory pages load with data
✅ Telering shows 1000 soundboxes
✅ Everlife shows 0 soundboxes
✅ Partner types show B2B/B2C
✅ Profile page looks good
✅ No more "Unknown" partner types
✅ API endpoints return correct data
✅ Database connection is stable

## 📞 Quick Commands

```bash
# Test database connection
node scripts/test-database.js

# Generate Telering machines SQL
node scripts/add-telering-machines.js

# Start backend server
npm run dev

# Start React client
cd client && npm start

# Test API endpoints
curl http://localhost:5000/api/service-providers/1/inventory
```

## 🚨 Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution**: Check `.env` file and Supabase credentials

### Issue: "Tables don't exist"
**Solution**: Run the table creation SQL in Supabase

### Issue: "No data found"
**Solution**: Run the data insertion SQL scripts

### Issue: "React app not loading"
**Solution**: Ensure both backend (port 5000) and frontend (port 3000) are running

### Issue: "API returning 404"
**Solution**: Check server.js routes are properly registered

This comprehensive setup should resolve all inventory issues permanently! 🎯 