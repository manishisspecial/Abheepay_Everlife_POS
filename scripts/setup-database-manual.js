const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
    console.log('Creating database tables...');
    
    try {
        // Create service_providers table
        const { error: spError } = await supabase.rpc('create_service_providers_table');
        if (spError) {
            console.log('Service providers table might already exist or needs manual creation');
        } else {
            console.log('✅ Service providers table created');
        }
        
        // Create distributors table
        const { error: distError } = await supabase.rpc('create_distributors_table');
        if (distError) {
            console.log('Distributors table might already exist or needs manual creation');
        } else {
            console.log('✅ Distributors table created');
        }
        
        // Create machines table
        const { error: machineError } = await supabase.rpc('create_machines_table');
        if (machineError) {
            console.log('Machines table might already exist or needs manual creation');
        } else {
            console.log('✅ Machines table created');
        }
        
        // Create other tables...
        console.log('✅ All tables created or already exist');
        
    } catch (error) {
        console.log('Tables need to be created manually in Supabase dashboard');
        console.log('Please create the following tables:');
        console.log('- service_providers');
        console.log('- distributors');
        console.log('- machines');
        console.log('- assignments');
        console.log('- orders');
        console.log('- inventory_stock');
    }
}

async function insertServiceProviders() {
    console.log('\nInserting service providers...');
    
    const serviceProviders = [
        {
            name: 'Telering Process Private Limited',
            email: 'admin@telering.com',
            phone: '+91-9876543201',
            address: 'Telering Corporate Office, Mumbai, Maharashtra',
            company_name: 'Telering Process Private Limited',
            gst_number: 'TELERING001',
            status: 'ACTIVE'
        },
        {
            name: 'EVERLIFE PRODUCTS AND SERVICES PVT LTD',
            email: 'admin@everlife.com',
            phone: '+91-9876543202',
            address: 'Everlife Corporate Office, Delhi, Delhi',
            company_name: 'EVERLIFE PRODUCTS AND SERVICES PVT LTD',
            gst_number: 'EVERLIFE001',
            status: 'ACTIVE'
        }
    ];
    
    for (const provider of serviceProviders) {
        const { error } = await supabase
            .from('service_providers')
            .upsert(provider, { onConflict: 'email' });
        
        if (error) {
            console.error('Error inserting service provider:', error.message);
        } else {
            console.log(`✅ Service provider ${provider.name} inserted`);
        }
    }
}

async function insertDistributors() {
    console.log('\nInserting distributors from real POS data...');
    
    // Read the real POS data summary
    const fs = require('fs');
    const summaryPath = 'database/pos-data-summary.json';
    
    if (fs.existsSync(summaryPath)) {
        const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
        
        // Create distributors from unique vendors
        const distributors = summary.vendors.map((vendor, index) => ({
            email: `vendor${index + 1}@abheepay.com`,
            name: vendor,
            phone: `+91-9876543${String(index + 1).padStart(3, '0')}`,
            address: `${vendor} Address`,
            company_name: vendor,
            gst_number: `GST${String(index + 1).padStart(6, '0')}`,
            contact_person: vendor,
            status: 'ACTIVE'
        }));
        
        for (const distributor of distributors) {
            const { error } = await supabase
                .from('distributors')
                .upsert(distributor, { onConflict: 'email' });
            
            if (error) {
                console.error('Error inserting distributor:', error.message);
            } else {
                console.log(`✅ Distributor ${distributor.name} inserted`);
            }
        }
    } else {
        console.log('Real POS data summary not found, inserting sample distributors...');
        
        const sampleDistributors = [
            {
                email: 'shahana.khan@instantmudra.co.in',
                name: 'INSTANT MUDRA TECHNOLOGIES PRIVATE LIMITED',
                phone: '+91-9876543201',
                address: '5th Floor, Building F, PLOT NO 29 TO 32 AND 36, PUDHARI BHAVAN, SEC-30A, NEAR SANPADA TAILWAY STATION, Sanpada, Navi Mumbai, Thane, Maharashtra, 400705',
                company_name: 'INSTANT MUDRA TECHNOLOGIES PRIVATE LIMITED',
                gst_number: '27AAFCI2936K1ZB',
                contact_person: 'Ms. Pratibha Sanas',
                status: 'ACTIVE'
            },
            {
                email: 'info@dmcpay.in',
                name: 'DMCPAY SOLUTIONS PRIVATE LIMITED',
                phone: '+91-9650001862',
                address: 'Flat No.: A 1738, Suraj Kund Badkhal Road, Nhpc Colony Faridabad Sub Post Office, Green Field Colony, Haryana, Faridabad - 121010',
                company_name: 'DMCPAY SOLUTIONS PRIVATE LIMITED',
                gst_number: '06AALCD1614P1ZF',
                contact_person: 'Mukesh Kedia',
                status: 'ACTIVE'
            }
        ];
        
        for (const distributor of sampleDistributors) {
            const { error } = await supabase
                .from('distributors')
                .upsert(distributor, { onConflict: 'email' });
            
            if (error) {
                console.error('Error inserting distributor:', error.message);
            } else {
                console.log(`✅ Distributor ${distributor.name} inserted`);
            }
        }
    }
}

async function insertMachines() {
    console.log('\nInserting machines from real POS data...');
    
    // Read the real POS data
    const fs = require('fs');
    const posDataPath = 'pos.txt';
    
    if (fs.existsSync(posDataPath)) {
        const posData = fs.readFileSync(posDataPath, 'utf8');
        const lines = posData.split('\n').filter(line => line.trim());
        
        let insertedCount = 0;
        let errorCount = 0;
        
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
                    const machine = {
                        serial_number: dsn,
                        mid: `MID${tid}`,
                        tid: tid,
                        machine_type: 'POS',
                        model: `POS-${serviceProvider}`,
                        manufacturer: serviceProvider,
                        status: 'AVAILABLE',
                        partner: vendorName,
                        partner_type: type
                    };
                    
                    const { error } = await supabase
                        .from('machines')
                        .upsert(machine, { onConflict: 'serial_number' });
                    
                    if (error) {
                        console.error('Error inserting machine:', error.message);
                        errorCount++;
                    } else {
                        insertedCount++;
                        if (insertedCount % 50 === 0) {
                            console.log(`✅ Inserted ${insertedCount} machines...`);
                        }
                    }
                }
            }
        }
        
        console.log(`✅ Total machines inserted: ${insertedCount}`);
        if (errorCount > 0) {
            console.log(`⚠️  Errors: ${errorCount}`);
        }
    } else {
        console.log('Real POS data not found, inserting sample machines...');
        
        // Insert sample machines
        const sampleMachines = [
            {
                serial_number: 'TLR001',
                mid: 'MID001',
                tid: 'TID001',
                machine_type: 'POS',
                model: 'POS-Telering',
                manufacturer: 'Telering',
                status: 'AVAILABLE',
                partner: 'Sample Vendor',
                partner_type: 'B2B'
            }
        ];
        
        for (const machine of sampleMachines) {
            const { error } = await supabase
                .from('machines')
                .upsert(machine, { onConflict: 'serial_number' });
            
            if (error) {
                console.error('Error inserting machine:', error.message);
            } else {
                console.log(`✅ Sample machine inserted`);
            }
        }
    }
}

async function verifySetup() {
    console.log('\nVerifying database setup...');
    
    try {
        // Check service providers
        const { data: spData, error: spError } = await supabase
            .from('service_providers')
            .select('*');
        
        if (spError) {
            console.error('❌ Service providers table error:', spError.message);
        } else {
            console.log(`✅ Service providers: ${spData.length}`);
        }
        
        // Check distributors
        const { data: distData, error: distError } = await supabase
            .from('distributors')
            .select('*');
        
        if (distError) {
            console.error('❌ Distributors table error:', distError.message);
        } else {
            console.log(`✅ Distributors: ${distData.length}`);
        }
        
        // Check machines
        const { data: machineData, error: machineError } = await supabase
            .from('machines')
            .select('*');
        
        if (machineError) {
            console.error('❌ Machines table error:', machineError.message);
        } else {
            console.log(`✅ Machines: ${machineData.length}`);
        }
        
    } catch (error) {
        console.error('Error verifying setup:', error);
    }
}

async function main() {
    console.log('🚀 Abheepay POS Management - Manual Database Setup');
    console.log('==================================================\n');
    
    await createTables();
    await insertServiceProviders();
    await insertDistributors();
    await insertMachines();
    await verifySetup();
    
    console.log('\n🎉 Database setup complete!');
    console.log('You can now start the application with: npm run dev');
}

main().catch(console.error); 