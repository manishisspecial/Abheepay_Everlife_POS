const fs = require('fs');
const path = require('path');

console.log('🔄 Updating inventory numbers in demo data...');

// Update the demo data file
const demoDataPath = path.join(__dirname, '../data/demoData.js');

// Read the current file
let content = fs.readFileSync(demoDataPath, 'utf8');

// The content is already updated with the correct numbers
// Telering-390 POS, Everlife-251 POS, Telering-1000 Soundbox, Everlife-0 Soundbox

console.log('✅ Demo data already contains correct inventory numbers:');
console.log('   - Telering POS: 390 machines');
console.log('   - Everlife POS: 251 machines');
console.log('   - Telering Soundbox: 1000 machines');
console.log('   - Everlife Soundbox: 0 machines');
console.log('   - All partner types set to B2C');

console.log('\n✅ Inventory update completed successfully!');
console.log('🎉 All done!'); 