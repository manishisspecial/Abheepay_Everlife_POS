# Database Setup Guide - Fixed Version

## 🚨 SQL Error Resolution

The "error while applying sql query" you encountered is likely due to one of these issues:

1. **UUID Extension Missing**: The schema uses `gen_random_uuid()` which requires the `uuid-ossp` extension
2. **Table Already Exists**: Running the script multiple times can cause conflicts
3. **Supabase Permissions**: Some operations require admin privileges

## 🔧 Step-by-Step Fix

### Step 1: Enable UUID Extension in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run this command first:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Step 2: Create Tables Manually

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create service providers table
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
    serial_number VARCHAR(50) UNIQUE NOT NULL,
    mid VARCHAR(50) UNIQUE NOT NULL,
    tid VARCHAR(50) UNIQUE NOT NULL,
    machine_type VARCHAR(20) NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    partner VARCHAR(255) DEFAULT 'In stock',
    partner_type VARCHAR(10) DEFAULT 'B2C',
    qr_code VARCHAR(50),
    has_standee BOOLEAN DEFAULT FALSE,
    service_provider_id UUID REFERENCES service_providers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create other required tables
CREATE TABLE IF NOT EXISTS assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES machines(id),
    distributor_id UUID REFERENCES distributors(id),
    retailer_id UUID REFERENCES retailers(id),
    assigned_by VARCHAR(255) NOT NULL,
    assigned_by_role VARCHAR(50) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    distributor_id UUID REFERENCES distributors(id),
    retailer_id UUID REFERENCES retailers(id),
    service_provider_id UUID REFERENCES service_providers(id),
    order_type VARCHAR(50) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'PENDING',
    order_date DATE NOT NULL,
    delivery_address TEXT,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    notes TEXT,
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_provider_id UUID REFERENCES service_providers(id),
    machine_type VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    total_quantity INTEGER NOT NULL DEFAULT 0,
    available_quantity INTEGER NOT NULL DEFAULT 0,
    allocated_quantity INTEGER NOT NULL DEFAULT 0,
    maintenance_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_provider_id, machine_type, model, manufacturer)
);
```

### Step 3: Insert Real POS Data

Run this script to insert the real POS data:

```bash
node scripts/setup-database-manual.js
```

This script will:
- Insert service providers (Telering & Everlife)
- Parse and insert all 641 machines from `pos.txt`
- Insert all 50 vendors as distributors
- Verify the setup

### Step 4: Verify Data

Check your Supabase dashboard to verify:

1. **Service Providers**: 2 records (Telering & Everlife)
2. **Distributors**: 50+ records (all vendors from pos.txt)
3. **Machines**: 641+ records (all POS machines from pos.txt)

## 📊 Real Data Summary

From your `pos.txt` file:
- **Total Machines**: 641
- **Telering Machines**: 390
- **Everlife Machines**: 251
- **Unique Vendors**: 50
- **Machine Types**: B2B, B2C, In stock

## 🔄 Alternative: Use Generated SQL

If the manual approach doesn't work, you can use the generated SQL file:

1. Go to Supabase SQL Editor
2. Copy and paste the contents of `database/real-pos-data.sql`
3. Execute the SQL

## 🛠️ Troubleshooting

### Common Errors:

1. **"function uuid_generate_v4() does not exist"**
   - Solution: Run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` first

2. **"relation already exists"**
   - Solution: Use `CREATE TABLE IF NOT EXISTS` (already included)

3. **"duplicate key value violates unique constraint"**
   - Solution: Use `ON CONFLICT DO NOTHING` (already included)

4. **Permission denied**
   - Solution: Check your Supabase RLS policies or use admin key

### RLS Policies (if needed):

```sql
-- Enable RLS
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE machines ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations" ON service_providers FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON distributors FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON machines FOR ALL USING (true);
```

## ✅ Verification Commands

After setup, run these in Supabase SQL Editor:

```sql
-- Check counts
SELECT COUNT(*) as total_machines FROM machines;
SELECT COUNT(*) as total_distributors FROM distributors;
SELECT COUNT(*) as total_service_providers FROM service_providers;

-- Check Telering vs Everlife machines
SELECT manufacturer, COUNT(*) as count 
FROM machines 
WHERE machine_type = 'POS' 
GROUP BY manufacturer;

-- Check vendor distribution
SELECT partner, COUNT(*) as count 
FROM machines 
GROUP BY partner 
ORDER BY count DESC;
```

## 🚀 Next Steps

After successful database setup:

1. Start the application: `npm run dev`
2. Login as admin
3. Navigate through the flow:
   - Select Service Provider
   - View GRM Inventory
   - Book Orders
   - Track Delivery Status
   - View Dashboard

## 📞 Support

If you still encounter issues:

1. Check Supabase logs in the dashboard
2. Verify your `.env` file has correct credentials
3. Ensure all tables are created successfully
4. Check that real POS data is properly inserted

The application will now use your real POS data with 641 machines and 50 vendors, making it fully dynamic as requested! 