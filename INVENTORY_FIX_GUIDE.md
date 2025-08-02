# 🔧 Inventory Fix Guide

## 🎯 Issues to Fix

1. **Telering & Everlife inventory page not found** - Blank pages
2. **Soundbox counts** - Need 1000 for Telering, 0 for Everlife
3. **Partner type** - Update to B2B/B2C instead of "Unknown"
4. **Profile page** - Already looks good

## ✅ What's Been Fixed

### 1. Service Providers Route Fixed
- Updated `routes/serviceProviders.js` to use database service
- Fixed inventory filtering logic
- Now properly connects to real database

### 2. Generated Telering Machines Data
- Created `database/add-telering-machines.sql`
- **390 Telering POS machines** (B2C partner type)
- **1000 Telering Soundbox machines** (B2C partner type)
- **251 Everlife POS machines** (B2B partner type)
- **0 Everlife Soundbox machines** (as requested)

## 🚀 How to Apply the Fix

### Step 1: Set up your Supabase environment variables

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

### Step 2: Apply the database schema

1. Go to your Supabase Dashboard
2. Open the SQL Editor
3. Run the following SQL to create tables:

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

### Step 3: Insert the real data

1. Copy the content from `database/real-pos-data.sql`
2. Paste it in the Supabase SQL Editor and run it

### Step 4: Add Telering machines

1. Copy the content from `database/add-telering-machines.sql`
2. Paste it in the Supabase SQL Editor and run it

### Step 5: Test the application

1. Start the server:
```bash
npm run dev
```

2. Visit the inventory pages:
   - http://localhost:5000/inventory/1 (Telering)
   - http://localhost:5000/inventory/2 (Everlife)

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
1. Check browser console for errors
2. Verify API endpoints are working: `http://localhost:5000/api/service-providers/1/inventory`
3. Ensure database connection is working

### If machines show "Unknown" partner type:
1. Run the partner type update SQL from the add-telering-machines.sql file
2. Refresh the page

### If you see database connection errors:
1. Check your `.env` file has correct Supabase credentials
2. Verify tables exist in Supabase
3. Check Supabase logs for any errors

## 🎉 Success Indicators

✅ Inventory pages load with data
✅ Telering shows 1000 soundboxes
✅ Everlife shows 0 soundboxes
✅ Partner types show B2B/B2C
✅ Profile page looks good
✅ No more "Unknown" partner types

## 📞 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Supabase configuration
3. Ensure all SQL scripts ran successfully
4. Check the server logs for any API errors 