const fs = require('fs');
const path = require('path');

// Parse POS data from pos.txt
function parsePosData() {
    const posData = fs.readFileSync('pos.txt', 'utf8');
    const lines = posData.split('\n').filter(line => line.trim());
    
    const machines = [];
    const vendors = new Set();
    
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split('\t').map(part => part.trim());
        
        if (parts.length >= 5) {
            const tid = parts[0];
            const dsn = parts[1];
            const vendorName = parts[2];
            const type = parts[3];
            const serviceProvider = parts[4];
            
            if (tid && dsn && vendorName) {
                machines.push({
                    tid,
                    dsn,
                    vendorName,
                    type,
                    serviceProvider
                });
                
                vendors.add(vendorName);
            }
        }
    }
    
    return { machines, vendors: Array.from(vendors) };
}

// Parse vendor details from pos.name.text
function parseVendorDetails() {
    const vendorData = fs.readFileSync('pos.name.text', 'utf8');
    const vendors = {};
    
    const sections = vendorData.split('\n\n').filter(section => section.trim());
    
    sections.forEach(section => {
        const lines = section.split('\n').filter(line => line.trim());
        if (lines.length >= 2) {
            const companyName = lines[0].trim();
            const address = lines[1].replace('Address: ', '').trim();
            
            let gstNumber = '';
            let contactPerson = '';
            let email = '';
            
            for (let i = 2; i < lines.length; i++) {
                const line = lines[i];
                if (line.includes('GST No:')) {
                    gstNumber = line.replace('GST No: ', '').trim();
                } else if (line.includes('Contact Person')) {
                    contactPerson = line.replace('Contact Person - ', '').trim();
                } else if (line.includes('@')) {
                    email = line.trim();
                }
            }
            
            vendors[companyName] = {
                companyName,
                address,
                gstNumber,
                contactPerson,
                email
            };
        }
    });
    
    return vendors;
}

// Generate SQL insert statements
function generateSQL(machines, vendors, vendorDetails) {
    let sql = '-- Generated SQL from real POS data\n\n';
    
    // Insert service providers
    sql += '-- Service Providers\n';
    sql += 'INSERT INTO service_providers (name, email, phone, address, company_name, gst_number, status) VALUES\n';
    sql += "('Telering Process Private Limited', 'admin@telering.com', '+91-9876543201', 'Telering Corporate Office, Mumbai, Maharashtra', 'Telering Process Private Limited', 'TELERING001', 'ACTIVE'),\n";
    sql += "('EVERLIFE PRODUCTS AND SERVICES PVT LTD', 'admin@everlife.com', '+91-9876543202', 'Everlife Corporate Office, Delhi, Delhi', 'EVERLIFE PRODUCTS AND SERVICES PVT LTD', 'EVERLIFE001', 'ACTIVE')\n";
    sql += 'ON CONFLICT (email) DO NOTHING;\n\n';
    
    // Insert distributors (vendors)
    sql += '-- Distributors (Vendors)\n';
    sql += 'INSERT INTO distributors (email, name, phone, address, company_name, gst_number, contact_person, status) VALUES\n';
    
    const distributorInserts = [];
    vendors.forEach((vendorName, index) => {
        const details = vendorDetails[vendorName] || {};
        const email = details.email || `vendor${index + 1}@abheepay.com`;
        const phone = `+91-9876543${String(index + 1).padStart(3, '0')}`;
        const address = details.address || `${vendorName} Address`;
        const gstNumber = details.gstNumber || `GST${String(index + 1).padStart(6, '0')}`;
        const contactPerson = details.contactPerson || vendorName;
        
        distributorInserts.push(`('${email}', '${vendorName}', '${phone}', '${address}', '${vendorName}', '${gstNumber}', '${contactPerson}', 'ACTIVE')`);
    });
    
    sql += distributorInserts.join(',\n') + '\n';
    sql += 'ON CONFLICT (email) DO NOTHING;\n\n';
    
    // Insert machines
    sql += '-- Machines\n';
    sql += 'INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer, status, partner, partner_type, service_provider_id) VALUES\n';
    
    const machineInserts = [];
    machines.forEach((machine, index) => {
        const serviceProviderId = machine.serviceProvider === 'Telering' ? 
            "(SELECT id FROM service_providers WHERE name = 'Telering Process Private Limited')" :
            "(SELECT id FROM service_providers WHERE name = 'EVERLIFE PRODUCTS AND SERVICES PVT LTD')";
        
        machineInserts.push(`('${machine.dsn}', 'MID${machine.tid}', '${machine.tid}', 'POS', 'POS-${machine.serviceProvider}', '${machine.serviceProvider}', 'AVAILABLE', '${machine.vendorName}', '${machine.type}', ${serviceProviderId})`);
    });
    
    sql += machineInserts.join(',\n') + '\n';
    sql += 'ON CONFLICT (serial_number) DO NOTHING;\n\n';
    
    // Insert inventory stock
    sql += '-- Inventory Stock\n';
    sql += 'INSERT INTO inventory_stock (service_provider_id, machine_type, model, manufacturer, total_quantity, available_quantity, allocated_quantity, maintenance_quantity) VALUES\n';
    sql += "((SELECT id FROM service_providers WHERE name = 'Telering Process Private Limited'), 'POS', 'POS-Telering', 'Telering', " + 
           machines.filter(m => m.serviceProvider === 'Telering').length + ", " + 
           machines.filter(m => m.serviceProvider === 'Telering').length + ", 0, 0),\n";
    sql += "((SELECT id FROM service_providers WHERE name = 'EVERLIFE PRODUCTS AND SERVICES PVT LTD'), 'POS', 'POS-Everlife', 'Everlife', " + 
           machines.filter(m => m.serviceProvider === 'Everlife').length + ", " + 
           machines.filter(m => m.serviceProvider === 'Everlife').length + ", 0, 0)\n";
    sql += 'ON CONFLICT (service_provider_id, machine_type, model, manufacturer) DO NOTHING;\n\n';
    
    return sql;
}

// Main execution
try {
    console.log('Parsing POS data...');
    const { machines, vendors } = parsePosData();
    
    console.log('Parsing vendor details...');
    const vendorDetails = parseVendorDetails();
    
    console.log('Generating SQL...');
    const sql = generateSQL(machines, vendors, vendorDetails);
    
    // Write SQL to file
    fs.writeFileSync('database/real-pos-data.sql', sql);
    
    console.log(`Generated SQL with ${machines.length} machines and ${vendors.length} vendors`);
    console.log('SQL file created: database/real-pos-data.sql');
    
    // Also create a summary
    const summary = {
        totalMachines: machines.length,
        teleringMachines: machines.filter(m => m.serviceProvider === 'Telering').length,
        everlifeMachines: machines.filter(m => m.serviceProvider === 'Everlife').length,
        totalVendors: vendors.length,
        vendors: vendors
    };
    
    fs.writeFileSync('database/pos-data-summary.json', JSON.stringify(summary, null, 2));
    console.log('Summary created: database/pos-data-summary.json');
    
} catch (error) {
    console.error('Error processing POS data:', error);
} 