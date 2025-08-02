const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function updateInventoryNumbers() {
  try {
    console.log('🔄 Starting inventory update...');

    // Clear existing machines
    const { error: deleteError } = await supabase
      .from('machines')
      .delete()
      .neq('id', 0); // Delete all records

    if (deleteError) {
      console.error('❌ Error clearing machines:', deleteError);
      return;
    }
    console.log('✅ Cleared existing machines');

    // Insert Telering POS machines (390)
    const teleringPosMachines = [];
    for (let i = 1; i <= 390; i++) {
      teleringPosMachines.push({
        serial_number: `TLR390${i.toString().padStart(3, '0')}`,
        mid: `MID390${i.toString().padStart(3, '0')}`,
        tid: `TID390${i.toString().padStart(3, '0')}`,
        machine_type: 'POS',
        model: 'Telering-390',
        manufacturer: 'Telering',
        status: 'AVAILABLE',
        partner: 'In stock',
        partner_type: 'B2C',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert Everlife POS machines (251)
    const everlifePosMachines = [];
    for (let i = 1; i <= 251; i++) {
      everlifePosMachines.push({
        serial_number: `EVL251${i.toString().padStart(3, '0')}`,
        mid: `MID251${i.toString().padStart(3, '0')}`,
        tid: `TID251${i.toString().padStart(3, '0')}`,
        machine_type: 'POS',
        model: 'Everlife-251',
        manufacturer: 'Everlife',
        status: 'AVAILABLE',
        partner: 'In stock',
        partner_type: 'B2C',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert Telering Soundbox machines (1000)
    const teleringSoundboxMachines = [];
    for (let i = 1; i <= 1000; i++) {
      teleringSoundboxMachines.push({
        serial_number: `TLRSB${i.toString().padStart(6, '0')}`,
        mid: `MIDSB${i.toString().padStart(6, '0')}`,
        tid: `TIDSB${i.toString().padStart(6, '0')}`,
        machine_type: 'SOUNDBOX',
        model: 'SoundBox-1000',
        manufacturer: 'Telering',
        status: 'AVAILABLE',
        partner: 'In stock',
        partner_type: 'B2C',
        qr_code: `QR_SB${i.toString().padStart(6, '0')}`,
        has_standee: Math.random() > 0.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert all machines
    const allMachines = [...teleringPosMachines, ...everlifePosMachines, ...teleringSoundboxMachines];
    
    // Insert in batches to avoid payload size limits
    const batchSize = 100;
    for (let i = 0; i < allMachines.length; i += batchSize) {
      const batch = allMachines.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('machines')
        .insert(batch);

      if (insertError) {
        console.error('❌ Error inserting batch:', insertError);
        return;
      }
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allMachines.length / batchSize)}`);
    }

    console.log('✅ Inserted machines:');
    console.log(`   - Telering POS: ${teleringPosMachines.length}`);
    console.log(`   - Everlife POS: ${everlifePosMachines.length}`);
    console.log(`   - Telering Soundbox: ${teleringSoundboxMachines.length}`);
    console.log(`   - Total: ${allMachines.length}`);

    // Update service providers with correct inventory numbers
    const { error: updateError } = await supabase
      .from('service_providers')
      .update({
        pos_machines: 390,
        soundbox_machines: 1000,
        updated_at: new Date().toISOString()
      })
      .eq('code', 'TELERING');

    if (updateError) {
      console.error('❌ Error updating Telering:', updateError);
    } else {
      console.log('✅ Updated Telering inventory numbers');
    }

    const { error: updateError2 } = await supabase
      .from('service_providers')
      .update({
        pos_machines: 251,
        soundbox_machines: 0,
        updated_at: new Date().toISOString()
      })
      .eq('code', 'EVERLIFE');

    if (updateError2) {
      console.error('❌ Error updating Everlife:', updateError2);
    } else {
      console.log('✅ Updated Everlife inventory numbers');
    }

    // Verify the data
    const { data: teleringCount, error: teleringError } = await supabase
      .from('machines')
      .select('machine_type, manufacturer')
      .eq('manufacturer', 'Telering');

    const { data: everlifeCount, error: everlifeError } = await supabase
      .from('machines')
      .select('machine_type, manufacturer')
      .eq('manufacturer', 'Everlife');

    if (teleringError || everlifeError) {
      console.error('❌ Error verifying data:', teleringError || everlifeError);
      return;
    }

    const teleringStats = {
      pos: teleringCount.filter(m => m.machine_type === 'POS').length,
      soundbox: teleringCount.filter(m => m.machine_type === 'SOUNDBOX').length,
      total: teleringCount.length
    };

    const everlifeStats = {
      pos: everlifeCount.filter(m => m.machine_type === 'POS').length,
      soundbox: everlifeCount.filter(m => m.machine_type === 'SOUNDBOX').length,
      total: everlifeCount.length
    };

    console.log('\n📊 Inventory Summary:');
    console.log('Telering:');
    console.log(`   - POS: ${teleringStats.pos}`);
    console.log(`   - Soundbox: ${teleringStats.soundbox}`);
    console.log(`   - Total: ${teleringStats.total}`);
    
    console.log('Everlife:');
    console.log(`   - POS: ${everlifeStats.pos}`);
    console.log(`   - Soundbox: ${everlifeStats.soundbox}`);
    console.log(`   - Total: ${everlifeStats.total}`);

    console.log('\n✅ Inventory update completed successfully!');

  } catch (error) {
    console.error('❌ Error updating inventory:', error);
    throw error;
  }
}

// Run the update
updateInventoryNumbers()
  .then(() => {
    console.log('🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed:', error);
    process.exit(1);
  }); 