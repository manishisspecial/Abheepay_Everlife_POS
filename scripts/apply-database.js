const fs = require('fs');
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

async function applyDatabaseSchema() {
    try {
        console.log('Starting database schema application...');
        
        // Read the fixed schema file
        const schemaSQL = fs.readFileSync('database/fixed-schema.sql', 'utf8');
        
        // Split the SQL into individual statements
        const statements = schemaSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`Found ${statements.length} SQL statements to execute`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            try {
                console.log(`Executing statement ${i + 1}/${statements.length}...`);
                
                // Execute the SQL statement
                const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
                
                if (error) {
                    console.error(`Error in statement ${i + 1}:`, error.message);
                    errorCount++;
                } else {
                    console.log(`✓ Statement ${i + 1} executed successfully`);
                    successCount++;
                }
                
                // Add a small delay to avoid overwhelming the database
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (err) {
                console.error(`Error executing statement ${i + 1}:`, err.message);
                errorCount++;
            }
        }
        
        console.log(`\n=== Database Schema Application Complete ===`);
        console.log(`Successful statements: ${successCount}`);
        console.log(`Failed statements: ${errorCount}`);
        
        if (errorCount === 0) {
            console.log('✅ All statements executed successfully!');
        } else {
            console.log('⚠️  Some statements failed. Check the logs above.');
        }
        
    } catch (error) {
        console.error('Error applying database schema:', error);
        process.exit(1);
    }
}

async function verifyDatabaseSetup() {
    try {
        console.log('\nVerifying database setup...');
        
        // Check if tables exist
        const tables = ['service_providers', 'distributors', 'machines', 'assignments', 'orders', 'inventory_stock'];
        
        for (const table of tables) {
            const { data, error } = await supabase
                .from(table)
                .select('id')
                .limit(1);
            
            if (error) {
                console.error(`❌ Table ${table} not accessible:`, error.message);
            } else {
                console.log(`✅ Table ${table} is accessible`);
            }
        }
        
        // Check data counts
        const { data: machineCount, error: machineError } = await supabase
            .from('machines')
            .select('id', { count: 'exact' });
        
        if (!machineError) {
            console.log(`📊 Total machines in database: ${machineCount.length}`);
        }
        
        const { data: distributorCount, error: distributorError } = await supabase
            .from('distributors')
            .select('id', { count: 'exact' });
        
        if (!distributorError) {
            console.log(`📊 Total distributors in database: ${distributorCount.length}`);
        }
        
    } catch (error) {
        console.error('Error verifying database setup:', error);
    }
}

// Main execution
async function main() {
    console.log('🚀 Abheepay POS Management - Database Setup');
    console.log('===========================================\n');
    
    await applyDatabaseSchema();
    await verifyDatabaseSetup();
    
    console.log('\n🎉 Database setup complete!');
    console.log('You can now start the application with: npm run dev');
}

main().catch(console.error); 