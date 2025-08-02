# Machine Assignment System Guide

## Overview

The Abheepay POS Management System now includes a comprehensive machine assignment system that allows you to assign Telering-390 and Everlife-251 POS machines, plus 1000 soundbox machines to distributors and retailers. The system updates both the application data and database in real-time when assignments are made.

## Data Structure

### Available Machines

The system now includes:

1. **10 Telering-390 POS Machines**
   - Serial Numbers: TLR390001 to TLR390010
   - Model: Telering-390
   - Manufacturer: Telering

2. **10 Everlife-251 POS Machines**
   - Serial Numbers: EVL251001 to EVL251010
   - Model: Everlife-251
   - Manufacturer: Everlife

3. **1000 SoundBox-1000 Soundbox Machines**
   - Serial Numbers: SB000001 to SB001000
   - Model: SoundBox-1000
   - Manufacturer: Abheepay
   - Includes QR codes and standee information

## Assignment Functionality

### Creating Assignments

1. **Navigate to Assignments Page**
   - Go to `/assignments` in the application
   - Click "New Assignment" button

2. **Select Machines**
   - Choose from available machines (status: AVAILABLE)
   - Multiple machines can be selected at once
   - Filter by type (POS/Soundbox) and manufacturer

3. **Choose Distributor**
   - Select a distributor from the dropdown
   - This is a required field

4. **Choose Retailer (Optional)**
   - Optionally select a retailer under the chosen distributor
   - If no retailer is selected, machines are assigned directly to the distributor

5. **Set Assignment Period**
   - **Valid From**: Required start date
   - **Valid To**: Optional end date

6. **Add Notes**
   - Optional notes about the assignment

### Assignment Status Management

Assignments can have the following statuses:

- **ACTIVE**: Machine is currently assigned and in use
- **INACTIVE**: Assignment is temporarily suspended
- **RETURNED**: Machine has been returned and is available again
- **REASSIGNED**: Machine has been reassigned to another party

### Real-time Updates

When an assignment is created:

1. **Machine Status Updates**
   - Machine status changes from "AVAILABLE" to "ASSIGNED"
   - Partner information is updated to show the assignee
   - Partner type is set to "B2B" for distributor assignments or "B2C" for retailer assignments

2. **Database Updates**
   - Assignment record is created in the assignments table
   - Machine status is updated in the machines table
   - All changes are immediately reflected in the application

## API Endpoints

### Assignments API

- `GET /api/assignments` - Get all assignments with filters
- `GET /api/assignments/:id` - Get specific assignment
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id/status` - Update assignment status
- `DELETE /api/assignments/:id` - Delete assignment

### Available Machines API

- `GET /api/assignments/machines/available` - Get available machines for assignment
- Supports filtering by type, manufacturer, and model

### Assignment Statistics

- `GET /api/assignments/stats/overview` - Get assignment statistics

## Database Schema

### Machines Table
```sql
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    mid VARCHAR(50) UNIQUE NOT NULL,
    tid VARCHAR(50) UNIQUE NOT NULL,
    machine_type VARCHAR(50) NOT NULL CHECK (machine_type IN ('POS', 'SOUNDBOX')),
    status machine_status DEFAULT 'AVAILABLE',
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    qr_code VARCHAR(255),
    has_standee BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Assignments Table
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES machines(id) ON DELETE CASCADE,
    distributor_id UUID REFERENCES distributors(id) ON DELETE SET NULL,
    retailer_id UUID REFERENCES retailers(id) ON DELETE SET NULL,
    assigned_by UUID NOT NULL,
    assigned_by_role user_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_from DATE NOT NULL,
    valid_to DATE,
    status assignment_status DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage Examples

### Creating an Assignment

```javascript
const assignmentData = {
  machineIds: ['1', '2', '3'], // Machine IDs to assign
  distributorId: 'distributor-123',
  retailerId: 'retailer-456', // Optional
  assignedBy: 'admin',
  assignedByRole: 'admin',
  validFrom: '2024-01-01',
  validTo: '2024-12-31', // Optional
  notes: 'Assignment for new store opening'
};

const response = await fetch('/api/assignments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(assignmentData)
});
```

### Updating Assignment Status

```javascript
const response = await fetch('/api/assignments/assignment-123/status', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'RETURNED' })
});
```

## Database Population

### For Production

To populate the database with all 1000 soundbox machines, run the SQL script:

```bash
# Run the main schema
psql -d your_database -f database/schema.sql

# Generate all 1000 soundbox machines
psql -d your_database -f scripts/generate-soundbox-data.sql
```

### For Development

The demo data includes:
- 10 Telering-390 POS machines
- 10 Everlife-251 POS machines  
- 1000 SoundBox-1000 soundbox machines

All machines start with "AVAILABLE" status and can be assigned through the assignment system.

## Security and Validation

The assignment system includes:

1. **Input Validation**
   - Required fields validation
   - Date format validation
   - Machine availability checks
   - Distributor/retailer relationship validation

2. **Status Management**
   - Prevents assigning already assigned machines
   - Ensures proper status transitions
   - Maintains data integrity

3. **Audit Trail**
   - Tracks who created assignments
   - Records assignment timestamps
   - Maintains assignment history

## Troubleshooting

### Common Issues

1. **Machine Not Available**
   - Check if machine is already assigned
   - Verify machine exists in the system

2. **Assignment Creation Fails**
   - Ensure all required fields are provided
   - Check distributor/retailer relationships
   - Verify date formats

3. **Status Update Issues**
   - Ensure assignment exists
   - Check if status transition is valid

### Debug Information

Check the browser console and server logs for detailed error messages. The API returns specific error messages for validation failures.

## Future Enhancements

Planned improvements include:

1. **Bulk Assignment Operations**
2. **Assignment Templates**
3. **Advanced Reporting**
4. **Email Notifications**
5. **Mobile App Integration**

---

For technical support or questions about the assignment system, please refer to the API documentation or contact the development team. 