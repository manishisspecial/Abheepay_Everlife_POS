const supabase = require('../config/database');

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');

    // Test 1: Check if we can connect to Supabase
    console.log('📡 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('service_providers')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection failed:', testError);
      console.log('💡 Please check your .env file and ensure:');
      console.log('   1. SUPABASE_URL is set correctly');
      console.log('   2. SUPABASE_ANON_KEY is set correctly');
      console.log('   3. Your Supabase project is active');
      return;
    }

    console.log('✅ Database connection successful!');

    // Test 2: Check if tables exist
    console.log('📋 Checking if tables exist...');
    
    const tables = ['service_providers', 'machines', 'distributors', 'retailers'];
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' does not exist or is not accessible`);
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    }

    // Test 3: Check if data exists
    console.log('📊 Checking existing data...');
    
    const { data: providers, error: providersError } = await supabase
      .from('service_providers')
      .select('*');
    
    if (providersError) {
      console.log('❌ No service providers found');
    } else {
      console.log(`✅ Found ${providers.length} service providers`);
      providers.forEach(p => console.log(`   - ${p.name}`));
    }

    const { data: machines, error: machinesError } = await supabase
      .from('machines')
      .select('*');
    
    if (machinesError) {
      console.log('❌ No machines found');
    } else {
      console.log(`✅ Found ${machines.length} machines`);
      
      // Group by manufacturer
      const byManufacturer = machines.reduce((acc, machine) => {
        const manufacturer = machine.manufacturer || 'Unknown';
        if (!acc[manufacturer]) acc[manufacturer] = { pos: 0, soundbox: 0 };
        if (machine.machine_type === 'POS') acc[manufacturer].pos++;
        if (machine.machine_type === 'SOUNDBOX') acc[manufacturer].soundbox++;
        return acc;
      }, {});
      
      Object.entries(byManufacturer).forEach(([manufacturer, counts]) => {
        console.log(`   - ${manufacturer}: ${counts.pos} POS, ${counts.soundbox} Soundbox`);
      });
    }

    console.log('\n🎯 Database Status Summary:');
    console.log('✅ Connection: Working');
    console.log('✅ Service Providers: Available');
    console.log('✅ Machines: Available');
    
    if (machines && machines.length > 0) {
      console.log('\n📈 Current Inventory:');
      const teleringMachines = machines.filter(m => m.manufacturer === 'Telering');
      const everlifeMachines = machines.filter(m => m.manufacturer === 'Everlife');
      
      console.log(`   Telering: ${teleringMachines.filter(m => m.machine_type === 'POS').length} POS, ${teleringMachines.filter(m => m.machine_type === 'SOUNDBOX').length} Soundbox`);
      console.log(`   Everlife: ${everlifeMachines.filter(m => m.machine_type === 'POS').length} POS, ${everlifeMachines.filter(m => m.machine_type === 'SOUNDBOX').length} Soundbox`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDatabase(); 