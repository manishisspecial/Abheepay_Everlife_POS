const fs = require('fs');
const path = require('path');

// Generate Telering machines data
function generateTeleringMachines() {
  let sql = '-- Add Telering Machines\n\n';
  
  // Add Telering POS machines (390 machines)
  sql += '-- Telering POS Machines\n';
  sql += 'INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer, status, partner, partner_type, service_provider_id) VALUES\n';
  
  const posMachines = [];
  for (let i = 1; i <= 390; i++) {
    posMachines.push(`('TLR390${String(i).padStart(6, '0')}', 'MID390${String(i).padStart(6, '0')}', '390${String(i).padStart(6, '0')}', 'POS', 'POS-Telering', 'Telering', 'AVAILABLE', 'B2C', 'B2C', (SELECT id FROM service_providers WHERE name = 'Telering Process Private Limited'))`);
  }
  sql += posMachines.join(',\n') + '\n';
  sql += 'ON CONFLICT (serial_number) DO NOTHING;\n\n';

  // Add Telering Soundbox machines (1000 machines)
  sql += '-- Telering Soundbox Machines\n';
  sql += 'INSERT INTO machines (serial_number, mid, tid, machine_type, model, manufacturer, status, partner, partner_type, qr_code, has_standee, service_provider_id) VALUES\n';
  
  const soundboxMachines = [];
  for (let i = 1; i <= 1000; i++) {
    const hasStandee = Math.random() > 0.5;
    soundboxMachines.push(`('TLR1000${String(i).padStart(6, '0')}', 'MID1000${String(i).padStart(6, '0')}', '1000${String(i).padStart(6, '0')}', 'SOUNDBOX', 'SOUNDBOX-Telering', 'Telering', 'AVAILABLE', 'B2C', 'B2C', 'QR_TLR1000${String(i).padStart(6, '0')}', ${hasStandee}, (SELECT id FROM service_providers WHERE name = 'Telering Process Private Limited'))`);
  }
  sql += soundboxMachines.join(',\n') + '\n';
  sql += 'ON CONFLICT (serial_number) DO NOTHING;\n\n';

  // Update existing Everlife machines to have B2B partner type
  sql += '-- Update Everlife machines partner type\n';
  sql += 'UPDATE machines SET partner_type = \'B2B\' WHERE manufacturer = \'Everlife\';\n\n';

  // Update inventory stock
  sql += '-- Update Inventory Stock\n';
  sql += `INSERT INTO inventory_stock (service_provider_id, machine_type, model, manufacturer, total_quantity, available_quantity, allocated_quantity, maintenance_quantity) VALUES
((SELECT id FROM service_providers WHERE name = 'Telering Process Private Limited'), 'POS', 'POS-Telering', 'Telering', 390, 390, 0, 0),
((SELECT id FROM service_providers WHERE name = 'Telering Process Private Limited'), 'SOUNDBOX', 'SOUNDBOX-Telering', 'Telering', 1000, 1000, 0, 0),
((SELECT id FROM service_providers WHERE name = 'EVERLIFE PRODUCTS AND SERVICES PVT LTD'), 'POS', 'POS-Everlife', 'Everlife', 251, 251, 0, 0),
((SELECT id FROM service_providers WHERE name = 'EVERLIFE PRODUCTS AND SERVICES PVT LTD'), 'SOUNDBOX', 'SOUNDBOX-Everlife', 'Everlife', 0, 0, 0, 0)
ON CONFLICT (service_provider_id, machine_type, model, manufacturer) DO UPDATE SET
total_quantity = EXCLUDED.total_quantity,
available_quantity = EXCLUDED.available_quantity,
allocated_quantity = EXCLUDED.allocated_quantity,
maintenance_quantity = EXCLUDED.maintenance_quantity;\n\n`;

  return sql;
}

// Generate the SQL
const sql = generateTeleringMachines();

// Write to file
const outputPath = path.join(__dirname, '../database/add-telering-machines.sql');
fs.writeFileSync(outputPath, sql);

console.log('✅ Generated Telering machines SQL file:');
console.log(`📁 Location: ${outputPath}`);
console.log('📊 Summary:');
console.log('   - Telering POS machines: 390');
console.log('   - Telering Soundbox machines: 1000');
console.log('   - Partner types: B2C for Telering, B2B for Everlife');
console.log('   - Total new machines: 1390');
console.log('\n💡 To apply this data:');
console.log('   1. Copy the SQL from the generated file');
console.log('   2. Run it in your Supabase SQL Editor');
console.log('   3. Or use the setup-database-manual.js script'); 