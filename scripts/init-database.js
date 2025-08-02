const supabase = require('../config/database');

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');

    // 1. Insert Telering-390 POS Machines
    console.log('📱 Inserting Telering-390 POS machines...');
    const teleringMachines = [];
    for (let i = 1; i <= 10; i++) {
      teleringMachines.push({
        serial_number: `TLR390${i.toString().padStart(3, '0')}`,
        mid: `MID390${i.toString().padStart(3, '0')}`,
        tid: `TID390${i.toString().padStart(3, '0')}`,
        machine_type: 'POS',
        model: 'Telering-390',
        manufacturer: 'Telering',
        status: 'AVAILABLE'
      });
    }

    const { data: teleringData, error: teleringError } = await supabase
      .from('machines')
      .insert(teleringMachines)
      .select();

    if (teleringError) {
      console.error('Error inserting Telering machines:', teleringError);
    } else {
      console.log(`✅ Inserted ${teleringData.length} Telering-390 machines`);
    }

    // 2. Insert Everlife-251 POS Machines
    console.log('📱 Inserting Everlife-251 POS machines...');
    const everlifeMachines = [];
    for (let i = 1; i <= 10; i++) {
      everlifeMachines.push({
        serial_number: `EVL251${i.toString().padStart(3, '0')}`,
        mid: `MID251${i.toString().padStart(3, '0')}`,
        tid: `TID251${i.toString().padStart(3, '0')}`,
        machine_type: 'POS',
        model: 'Everlife-251',
        manufacturer: 'Everlife',
        status: 'AVAILABLE'
      });
    }

    const { data: everlifeData, error: everlifeError } = await supabase
      .from('machines')
      .insert(everlifeMachines)
      .select();

    if (everlifeError) {
      console.error('Error inserting Everlife machines:', everlifeError);
    } else {
      console.log(`✅ Inserted ${everlifeData.length} Everlife-251 machines`);
    }

    // 3. Insert SoundBox-1000 Soundbox Machines
    console.log('🔊 Inserting SoundBox-1000 soundbox machines...');
    const soundboxMachines = [];
    for (let i = 1; i <= 1000; i++) {
      soundboxMachines.push({
        serial_number: `SB${i.toString().padStart(6, '0')}`,
        mid: `MIDSB${i.toString().padStart(6, '0')}`,
        tid: `TIDSB${i.toString().padStart(6, '0')}`,
        machine_type: 'SOUNDBOX',
        model: 'SoundBox-1000',
        manufacturer: 'Abheepay',
        status: 'AVAILABLE',
        qr_code: `QR_SB${i.toString().padStart(6, '0')}`,
        has_standee: Math.random() > 0.5
      });
    }

    // Insert in batches of 100 to avoid payload size limits
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < soundboxMachines.length; i += batchSize) {
      const batch = soundboxMachines.slice(i, i + batchSize);
      const { data: batchData, error: batchError } = await supabase
        .from('machines')
        .insert(batch)
        .select();

      if (batchError) {
        console.error(`Error inserting soundbox batch ${Math.floor(i/batchSize) + 1}:`, batchError);
      } else {
        insertedCount += batchData.length;
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}: ${batchData.length} soundbox machines`);
      }
    }

    console.log(`✅ Total soundbox machines inserted: ${insertedCount}`);

    // 4. Insert Sample Distributors
    console.log('🏢 Inserting sample distributors...');
    const distributors = [
      {
        email: 'shahana.khan@instantmudra.co.in',
        name: 'INSTANT MUDRA TECHNOLOGIES PRIVATE LIMITED',
        phone: '+91-9876543201',
        address: '5th Floor, Building F, PLOT NO 29 TO 32 AND 36, PUDHARI BHAVAN, SEC-30A, NEAR SANPADA TAILWAY STATION, Sanpada, Navi Mumbai, Thane, Maharashtra, 400705',
        company_name: 'INSTANT MUDRA TECHNOLOGIES PRIVATE LIMITED',
        gst_number: '27AAFCI2936K1ZB',
        status: 'ACTIVE'
      },
      {
        email: 'info@dmcpay.in',
        name: 'DMCPAY SOLUTIONS PRIVATE LIMITED',
        phone: '+91-9650001862',
        address: 'Flat No.: A 1738, Suraj Kund Badkhal Road, Nhpc Colony Faridabad Sub Post Office, Green Field Colony, Haryana, Faridabad - 121010',
        company_name: 'DMCPAY SOLUTIONS PRIVATE LIMITED',
        gst_number: '06AALCD1614P1ZF',
        status: 'ACTIVE'
      },
      {
        email: 'paymatrixsolutions@gmail.com',
        name: 'PAYMATRIX SOLUTIONS PRIVATE LIMITED',
        phone: '+91-9876543203',
        address: 'Shop no 8 shewanta Heights Punyai Nagar Near Crown Bakery Pune Satara Road Balaji nagar Dhankwadi - Pune - 411043',
        company_name: 'PAYMATRIX SOLUTIONS PRIVATE LIMITED',
        gst_number: '27AAPCP0507M1Z3',
        status: 'ACTIVE'
      }
    ];

    const { data: distributorData, error: distributorError } = await supabase
      .from('distributors')
      .insert(distributors)
      .select();

    if (distributorError) {
      console.error('Error inserting distributors:', distributorError);
    } else {
      console.log(`✅ Inserted ${distributorData.length} distributors`);
    }

    // 5. Insert Sample Retailers
    console.log('🏪 Inserting sample retailers...');
    const retailers = [
      {
        email: 'retailer1@abheepay.com',
        name: 'Instant Mudra Branch 1',
        phone: '+91-9876543201',
        address: '5th Floor, Building F, PLOT NO 29 TO 32 AND 36, PUDHARI BHAVAN, SEC-30A, NEAR SANPADA TAILWAY STATION, Sanpada, Navi Mumbai, Thane, Maharashtra, 400705',
        shop_name: 'Instant Mudra Store 1',
        gst_number: '27AAFCI2936K1ZB',
        distributor_id: distributorData[0].id,
        status: 'ACTIVE'
      },
      {
        email: 'retailer2@abheepay.com',
        name: 'DMCPAY Branch 1',
        phone: '+91-9650001862',
        address: 'Flat No.: A 1738, Suraj Kund Badkhal Road, Nhpc Colony Faridabad Sub Post Office, Green Field Colony, Haryana, Faridabad - 121010',
        shop_name: 'DMCPAY Store 1',
        gst_number: '06AALCD1614P1ZF',
        distributor_id: distributorData[1].id,
        status: 'ACTIVE'
      },
      {
        email: 'retailer3@abheepay.com',
        name: 'Paymatrix Branch 1',
        phone: '+91-9876543203',
        address: 'Shop no 8 shewanta Heights Punyai Nagar Near Crown Bakery Pune Satara Road Balaji nagar Dhankwadi - Pune - 411043',
        shop_name: 'Paymatrix Store 1',
        gst_number: '27AAPCP0507M1Z3',
        distributor_id: distributorData[2].id,
        status: 'ACTIVE'
      }
    ];

    const { data: retailerData, error: retailerError } = await supabase
      .from('retailers')
      .insert(retailers)
      .select();

    if (retailerError) {
      console.error('Error inserting retailers:', retailerError);
    } else {
      console.log(`✅ Inserted ${retailerData.length} retailers`);
    }

    // 6. Verify Data
    console.log('🔍 Verifying data...');
    const { data: machineCount, error: machineCountError } = await supabase
      .from('machines')
      .select('machine_type, status', { count: 'exact' });

    if (machineCountError) {
      console.error('Error counting machines:', machineCountError);
    } else {
      console.log(`✅ Total machines in database: ${machineCount.length}`);
    }

    const { data: distributorCount, error: distributorCountError } = await supabase
      .from('distributors')
      .select('*', { count: 'exact' });

    if (distributorCountError) {
      console.error('Error counting distributors:', distributorCountError);
    } else {
      console.log(`✅ Total distributors in database: ${distributorCount.length}`);
    }

    const { data: retailerCount, error: retailerCountError } = await supabase
      .from('retailers')
      .select('*', { count: 'exact' });

    if (retailerCountError) {
      console.error('Error counting retailers:', retailerCountError);
    } else {
      console.log(`✅ Total retailers in database: ${retailerCount.length}`);
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${teleringData?.length || 0} Telering-390 POS machines`);
    console.log(`   • ${everlifeData?.length || 0} Everlife-251 POS machines`);
    console.log(`   • ${insertedCount} SoundBox-1000 soundbox machines`);
    console.log(`   • ${distributorData?.length || 0} distributors`);
    console.log(`   • ${retailerData?.length || 0} retailers`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase }; 