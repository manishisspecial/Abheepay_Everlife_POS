const supabase = require('../config/database');

async function fixInventoryData() {
  try {
    console.log('🔄 Starting inventory data fix...');

    // 1. Update existing machines to have proper partner types
    console.log('📝 Updating partner types for existing machines...');
    const { error: updateError } = await supabase
      .from('machines')
      .update({ partner_type: 'B2B' })
      .eq('manufacturer', 'Everlife');

    if (updateError) {
      console.error('Error updating partner types:', updateError);
    } else {
      console.log('✅ Updated partner types for Everlife machines');
    }

    // 2. Add Telering POS machines (390 machines)
    console.log('📝 Adding Telering POS machines...');
    const teleringPosMachines = [];
    for (let i = 1; i <= 390; i++) {
      teleringPosMachines.push({
        serial_number: `TLR390${String(i).padStart(6, '0')}`,
        mid: `MID390${String(i).padStart(6, '0')}`,
        tid: `390${String(i).padStart(6, '0')}`,
        machine_type: 'POS',
        model: 'POS-Telering',
        manufacturer: 'Telering',
        status: 'AVAILABLE',
        partner: 'B2C',
        partner_type: 'B2C',
        service_provider_id: '(SELECT id FROM service_providers WHERE name = \'Telering Process Private Limited\')'
      });
    }

    // 3. Add Telering Soundbox machines (1000 machines)
    console.log('📝 Adding Telering Soundbox machines...');
    const teleringSoundboxMachines = [];
    for (let i = 1; i <= 1000; i++) {
      teleringSoundboxMachines.push({
        serial_number: `TLR1000${String(i).padStart(6, '0')}`,
        mid: `MID1000${String(i).padStart(6, '0')}`,
        tid: `1000${String(i).padStart(6, '0')}`,
        machine_type: 'SOUNDBOX',
        model: 'SOUNDBOX-Telering',
        manufacturer: 'Telering',
        status: 'AVAILABLE',
        partner: 'B2C',
        partner_type: 'B2C',
        qr_code: `QR_TLR1000${String(i).padStart(6, '0')}`,
        has_standee: Math.random() > 0.5,
        service_provider_id: '(SELECT id FROM service_providers WHERE name = \'Telering Process Private Limited\')'
      });
    }

    // 4. Insert Telering machines
    console.log('📝 Inserting Telering machines...');
    const allTeleringMachines = [...teleringPosMachines, ...teleringSoundboxMachines];
    
    // Insert in batches of 100
    for (let i = 0; i < allTeleringMachines.length; i += 100) {
      const batch = allTeleringMachines.slice(i, i + 100);
      const { error: insertError } = await supabase
        .from('machines')
        .insert(batch);

      if (insertError) {
        console.error(`Error inserting batch ${i/100 + 1}:`, insertError);
      } else {
        console.log(`✅ Inserted batch ${i/100 + 1} (${batch.length} machines)`);
      }
    }

    // 5. Update inventory stock
    console.log('📝 Updating inventory stock...');
    const { error: stockError } = await supabase
      .from('inventory_stock')
      .upsert([
        {
          service_provider_id: '(SELECT id FROM service_providers WHERE name = \'Telering Process Private Limited\')',
          machine_type: 'POS',
          model: 'POS-Telering',
          manufacturer: 'Telering',
          total_quantity: 390,
          available_quantity: 390,
          allocated_quantity: 0,
          maintenance_quantity: 0
        },
        {
          service_provider_id: '(SELECT id FROM service_providers WHERE name = \'Telering Process Private Limited\')',
          machine_type: 'SOUNDBOX',
          model: 'SOUNDBOX-Telering',
          manufacturer: 'Telering',
          total_quantity: 1000,
          available_quantity: 1000,
          allocated_quantity: 0,
          maintenance_quantity: 0
        },
        {
          service_provider_id: '(SELECT id FROM service_providers WHERE name = \'EVERLIFE PRODUCTS AND SERVICES PVT LTD\')',
          machine_type: 'POS',
          model: 'POS-Everlife',
          manufacturer: 'Everlife',
          total_quantity: 251,
          available_quantity: 251,
          allocated_quantity: 0,
          maintenance_quantity: 0
        },
        {
          service_provider_id: '(SELECT id FROM service_providers WHERE name = \'EVERLIFE PRODUCTS AND SERVICES PVT LTD\')',
          machine_type: 'SOUNDBOX',
          model: 'SOUNDBOX-Everlife',
          manufacturer: 'Everlife',
          total_quantity: 0,
          available_quantity: 0,
          allocated_quantity: 0,
          maintenance_quantity: 0
        }
      ]);

    if (stockError) {
      console.error('Error updating inventory stock:', stockError);
    } else {
      console.log('✅ Updated inventory stock');
    }

    console.log('🎉 Inventory data fix completed!');
    console.log('📊 Summary:');
    console.log('   - Telering: 390 POS + 1000 Soundbox = 1390 machines');
    console.log('   - Everlife: 251 POS + 0 Soundbox = 251 machines');
    console.log('   - Total: 1641 machines');

  } catch (error) {
    console.error('❌ Error fixing inventory data:', error);
  }
}

// Run the script
fixInventoryData(); 