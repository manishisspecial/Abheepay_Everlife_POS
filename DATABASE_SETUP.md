# Database Setup Guide

## Overview

This guide will help you set up the Abheepay POS Management System with a real Supabase database instead of mock data. The system will include:

- **10 Telering-390 POS machines**
- **10 Everlife-251 POS machines**  
- **1000 SoundBox-1000 soundbox machines**
- **3 Sample distributors** (from your data)
- **3 Sample retailers** (linked to distributors)

## Prerequisites

1. **Supabase Account**: You need a Supabase project set up
2. **Environment Variables**: Configure your Supabase credentials
3. **Database Schema**: The schema should be created in Supabase

## Step 1: Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 2: Database Schema Setup

### Option A: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/schema.sql`
4. Execute the SQL to create all tables and initial data

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Push the schema
supabase db push
```

## Step 3: Initialize Database with Data

Run the database initialization script to populate your database with all the required data:

```bash
npm run init-db
```

This script will:

1. **Insert 10 Telering-390 POS machines** (TLR390001 to TLR390010)
2. **Insert 10 Everlife-251 POS machines** (EVL251001 to EVL251010)
3. **Insert 1000 SoundBox-1000 soundbox machines** (SB000001 to SB001000)
4. **Insert 3 sample distributors** from your data
5. **Insert 3 sample retailers** linked to the distributors

## Step 4: Verify Database Connection

Test that your application can connect to the database:

```bash
npm run dev
```

Visit `http://localhost:5000/api/machines` to see the machines data from the database.

## Database Schema Details

### Tables Created

1. **machines** - Stores all POS and soundbox machines
2. **distributors** - Stores distributor information
3. **retailers** - Stores retailer information (linked to distributors)
4. **assignments** - Stores machine assignments
5. **settlements** - Stores settlement information
6. **admins** - Stores admin users

### Key Features

- **UUID Primary Keys**: All tables use UUID primary keys
- **Foreign Key Relationships**: Proper relationships between tables
- **Status Tracking**: Machines have status (AVAILABLE, ASSIGNED, etc.)
- **Audit Trail**: Created/updated timestamps on all tables
- **Data Validation**: Proper constraints and validation

## Data Structure

### Machines

```sql
-- Telering-390 POS Machines
serial_number: TLR390001 to TLR390010
model: Telering-390
manufacturer: Telering
status: AVAILABLE

-- Everlife-251 POS Machines  
serial_number: EVL251001 to EVL251010
model: Everlife-251
manufacturer: Everlife
status: AVAILABLE

-- SoundBox-1000 Soundbox Machines
serial_number: SB000001 to SB001000
model: SoundBox-1000
manufacturer: Abheepay
status: AVAILABLE
qr_code: QR_SB000001 to QR_SB001000
has_standee: true/false (random)
```

### Distributors

```sql
-- Sample Distributors
1. INSTANT MUDRA TECHNOLOGIES PRIVATE LIMITED
2. DMCPAY SOLUTIONS PRIVATE LIMITED  
3. PAYMATRIX SOLUTIONS PRIVATE LIMITED
```

### Retailers

```sql
-- Sample Retailers (linked to distributors)
1. Instant Mudra Branch 1
2. DMCPAY Branch 1
3. Paymatrix Branch 1
```

## API Endpoints

Once the database is set up, all API endpoints will return real data:

- `GET /api/machines` - Get all machines from database
- `GET /api/assignments` - Get all assignments from database
- `GET /api/distributors` - Get all distributors from database
- `GET /api/retailers` - Get all retailers from database

## Troubleshooting

### Common Issues

1. **Connection Error**: Check your Supabase URL and API key
2. **Schema Error**: Ensure the database schema is properly created
3. **Data Not Loading**: Run the initialization script again
4. **Permission Error**: Check your Supabase RLS policies

### Debug Commands

```bash
# Test database connection
node -e "require('./config/database').from('machines').select('*').then(console.log)"

# Check environment variables
node -e "console.log('SUPABASE_URL:', process.env.SUPABASE_URL)"

# Run initialization with verbose logging
DEBUG=* npm run init-db
```

## Migration from Mock Data

If you're currently using mock data, follow these steps:

1. **Backup Current Data**: Export any important data
2. **Set Up Database**: Follow the setup steps above
3. **Update Application**: The routes are already updated to use database
4. **Test Functionality**: Verify all features work with real data
5. **Remove Mock Files**: Delete `data/demoData.js` if no longer needed

## Production Deployment

For production deployment:

1. **Set Environment Variables**: Configure production Supabase credentials
2. **Run Migration**: Execute the schema in production database
3. **Initialize Data**: Run the initialization script in production
4. **Test Endpoints**: Verify all API endpoints work correctly
5. **Monitor Performance**: Set up monitoring for database performance

## Security Considerations

1. **Row Level Security (RLS)**: Enable RLS policies in Supabase
2. **API Key Management**: Use service role keys only on server
3. **Input Validation**: All inputs are validated before database operations
4. **Error Handling**: Proper error handling prevents data exposure

## Performance Optimization

1. **Indexes**: Database indexes are created for better performance
2. **Pagination**: API endpoints support pagination for large datasets
3. **Caching**: Consider implementing caching for frequently accessed data
4. **Connection Pooling**: Supabase handles connection pooling automatically

## Support

If you encounter issues:

1. Check the Supabase dashboard for error logs
2. Verify your environment variables are correct
3. Test the database connection manually
4. Review the application logs for detailed error messages

---

**Note**: This setup replaces all mock data with real database operations. The application will now be fully dynamic and data-driven. 