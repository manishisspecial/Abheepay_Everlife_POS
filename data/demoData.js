// Demo data for the POS Management System

// Demo machines data with Telering-390, Everlife-251 POS machines and 1000 soundbox machines
const demoMachines = [
  // Telering-390 POS Machines (10 machines)
  { id: '1', serialNumber: 'TLR390001', mid: 'MID390001', tid: 'TID390001', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '2', serialNumber: 'TLR390002', mid: 'MID390002', tid: 'TID390002', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '3', serialNumber: 'TLR390003', mid: 'MID390003', tid: 'TID390003', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '4', serialNumber: 'TLR390004', mid: 'MID390004', tid: 'TID390004', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '5', serialNumber: 'TLR390005', mid: 'MID390005', tid: 'TID390005', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '6', serialNumber: 'TLR390006', mid: 'MID390006', tid: 'TID390006', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '7', serialNumber: 'TLR390007', mid: 'MID390007', tid: 'TID390007', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '8', serialNumber: 'TLR390008', mid: 'MID390008', tid: 'TID390008', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '9', serialNumber: 'TLR390009', mid: 'MID390009', tid: 'TID390009', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '10', serialNumber: 'TLR390010', mid: 'MID390010', tid: 'TID390010', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  
  // Everlife-251 POS Machines (10 machines)
  { id: '11', serialNumber: 'EVL251001', mid: 'MID251001', tid: 'TID251001', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '12', serialNumber: 'EVL251002', mid: 'MID251002', tid: 'TID251002', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '13', serialNumber: 'EVL251003', mid: 'MID251003', tid: 'TID251003', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '14', serialNumber: 'EVL251004', mid: 'MID251004', tid: 'TID251004', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '15', serialNumber: 'EVL251005', mid: 'MID251005', tid: 'TID251005', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '16', serialNumber: 'EVL251006', mid: 'MID251006', tid: 'TID251006', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '17', serialNumber: 'EVL251007', mid: 'MID251007', tid: 'TID251007', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '18', serialNumber: 'EVL251008', mid: 'MID251008', tid: 'TID251008', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '19', serialNumber: 'EVL251009', mid: 'MID251009', tid: 'TID251009', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' },
  { id: '20', serialNumber: 'EVL251010', mid: 'MID251010', tid: 'TID251010', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'In stock', partnerType: 'B2C' }
];

// Generate 1000 soundbox machines
const generateSoundboxMachines = () => {
  const soundboxMachines = [];
  for (let i = 1; i <= 1000; i++) {
    const machineId = i + 20; // Start after POS machines
    const serialNumber = `SB${i.toString().padStart(6, '0')}`;
    const mid = `MIDSB${i.toString().padStart(6, '0')}`;
    const tid = `TIDSB${i.toString().padStart(6, '0')}`;
    const qrCode = `QR_SB${i.toString().padStart(6, '0')}`;
    const hasStandee = Math.random() > 0.5; // Randomly assign standee
    
    soundboxMachines.push({
      id: machineId.toString(),
      serialNumber,
      mid,
      tid,
      type: 'SOUNDBOX',
      model: 'SoundBox-1000',
      manufacturer: 'Abheepay',
      status: 'AVAILABLE',
      partner: 'In stock',
      partnerType: 'B2C',
      qrCode,
      hasStandee
    });
  }
  return soundboxMachines;
};

// Add soundbox machines to the main array
demoMachines.push(...generateSoundboxMachines());


// Demo distributors data with real partner details from pos.name.text
const demoDistributors = [
  { 
    id: '1', 
    email: 'shahana.khan@instantmudra.co.in', 
    name: 'INSTANT MUDRA TECHNOLOGIES PRIVATE LIMITED', 
    phone: '+91-9876543201', 
    address: '5th Floor, Building F, PLOT NO 29 TO 32 AND 36, PUDHARI BHAVAN, SEC-30A, NEAR SANPADA TAILWAY STATION, Sanpada, Navi Mumbai, Thane, Maharashtra, 400705', 
    company_name: 'INSTANT MUDRA TECHNOLOGIES PRIVATE LIMITED', 
    gst_number: '27AAFCI2936K1ZB', 
    contact_person: 'Ms. Pratibha Sanas',
    status: 'ACTIVE', 
    created_at: '2024-01-01T00:00:00.000Z', 
    updated_at: '2024-01-01T00:00:00.000Z' 
  },
  { 
    id: '2', 
    email: 'info@dmcpay.in', 
    name: 'DMCPAY SOLUTIONS PRIVATE LIMITED', 
    phone: '+91-9650001862', 
    address: 'Flat No.: A 1738, Suraj Kund Badkhal Road, Nhpc Colony Faridabad Sub Post Office, Green Field Colony, Haryana, Faridabad - 121010', 
    company_name: 'DMCPAY SOLUTIONS PRIVATE LIMITED', 
    gst_number: '06AALCD1614P1ZF', 
    contact_person: 'Mukesh Kedia',
    status: 'ACTIVE', 
    created_at: '2024-01-02T00:00:00.000Z', 
    updated_at: '2024-01-02T00:00:00.000Z' 
  },
  { 
    id: '3', 
    email: 'paymatrixsolutions@gmail.com', 
    name: 'PAYMATRIX SOLUTIONS PRIVATE LIMITED', 
    phone: '+91-9876543203', 
    address: 'Shop no 8 shewanta Heights Punyai Nagar Near Crown Bakery Pune Satara Road Balaji nagar Dhankwadi - Pune - 411043', 
    company_name: 'PAYMATRIX SOLUTIONS PRIVATE LIMITED', 
    gst_number: '27AAPCP0507M1Z3', 
    contact_person: 'Reetesh Tandekar',
    status: 'ACTIVE', 
    created_at: '2024-01-03T00:00:00.000Z', 
    updated_at: '2024-01-03T00:00:00.000Z' 
  },
  { 
    id: '4', 
    email: 'dhamilliontech@gmail.com', 
    name: 'Dhamillion Technologies Private Limited', 
    phone: '+91-9876543204', 
    address: 'Flat No 8, Block-D,Paradise Homes,Hayathnagar,Rangareddy - 501505', 
    company_name: 'Dhamillion Technologies Private Limited', 
    gst_number: '36AALCD2916N1Z9', 
    contact_person: 'Raghav',
    status: 'ACTIVE', 
    created_at: '2024-01-04T00:00:00.000Z', 
    updated_at: '2024-01-04T00:00:00.000Z' 
  },
  { 
    id: '5', 
    email: 'aaditya2011@gmail.com', 
    name: 'QWIKPYEE/Aditya Jagannath Puthanpure', 
    phone: '+91-9876543205', 
    address: 'B201, Tirumala Omkar Residency Canal Road, Anandvalli Pipeline Road, Gangapur Nashik - 422013', 
    company_name: 'QWIKPYEE/Aditya Jagannath Puthanpure', 
    gst_number: 'GST556677889', 
    contact_person: 'Aditya Jagannath Puthanpure',
    status: 'ACTIVE', 
    created_at: '2024-01-05T00:00:00.000Z', 
    updated_at: '2024-01-05T00:00:00.000Z' 
  },
  { 
    id: '6', 
    email: 'raju@mobile.com', 
    name: 'Raju Mobile', 
    phone: '+91-9876543206', 
    address: 'Shop No. 1, Plot No. 11/12A, Sector-1, Shirwane, Nerul, Navi Mumbai, Thane, Maharashtra-400706', 
    company_name: 'Raju Mobile', 
    gst_number: 'GST667788990', 
    contact_person: 'Raju Mobile',
    status: 'ACTIVE', 
    created_at: '2024-01-06T00:00:00.000Z', 
    updated_at: '2024-01-06T00:00:00.000Z' 
  },
  { 
    id: '7', 
    email: 'gk@enterprises.com', 
    name: 'GK Enterprices', 
    phone: '+91-9876543207', 
    address: '369 Market Street, Delhi, Delhi', 
    company_name: 'GK Enterprices', 
    gst_number: 'GST778899001', 
    contact_person: 'GK Enterprices',
    status: 'ACTIVE', 
    created_at: '2024-01-07T00:00:00.000Z', 
    updated_at: '2024-01-07T00:00:00.000Z' 
  },
  { 
    id: '8', 
    email: 'akshay@akshay.com', 
    name: 'Akshay', 
    phone: '+91-9876543208', 
    address: '741 Retail Plaza, Hyderabad, Telangana', 
    company_name: 'Akshay', 
    gst_number: 'GST889900112', 
    contact_person: 'Akshay',
    status: 'ACTIVE', 
    created_at: '2024-01-08T00:00:00.000Z', 
    updated_at: '2024-01-08T00:00:00.000Z' 
  },
  { 
    id: '9', 
    email: 'jaskaren@jaskaren.com', 
    name: 'Jaskaren', 
    phone: '+91-9876543209', 
    address: '852 Shop Road, Ahmedabad, Gujarat', 
    company_name: 'Jaskaren', 
    gst_number: 'GST990011223', 
    contact_person: 'Jaskaren',
    status: 'ACTIVE', 
    created_at: '2024-01-09T00:00:00.000Z', 
    updated_at: '2024-01-09T00:00:00.000Z' 
  },
  { 
    id: '10', 
    email: 'jaharunisha@jaharunisha.com', 
    name: 'jaharunisha', 
    phone: '+91-9876543210', 
    address: '963 Store Lane, Kolkata, West Bengal', 
    company_name: 'jaharunisha', 
    gst_number: 'GST001122334', 
    contact_person: 'jaharunisha',
    status: 'ACTIVE', 
    created_at: '2024-01-10T00:00:00.000Z', 
    updated_at: '2024-01-10T00:00:00.000Z' 
  },
  { 
    id: '11', 
    email: 'sanjay@sanjay.com', 
    name: 'Sanjay Bhati', 
    phone: '+91-9876543211', 
    address: '147 Business Center, Jaipur, Rajasthan', 
    company_name: 'Sanjay Bhati', 
    gst_number: 'GST112233445', 
    contact_person: 'Sanjay Bhati',
    status: 'ACTIVE', 
    created_at: '2024-01-11T00:00:00.000Z', 
    updated_at: '2024-01-11T00:00:00.000Z' 
  },
  { 
    id: '12', 
    email: 'kamlesh@kamlesh.com', 
    name: 'Kamlesh Rathod', 
    phone: '+91-9876543212', 
    address: '258 Distributor Street, Lucknow, Uttar Pradesh', 
    company_name: 'Kamlesh Rathod', 
    gst_number: 'GST223344556', 
    contact_person: 'Kamlesh Rathod',
    status: 'ACTIVE', 
    created_at: '2024-01-12T00:00:00.000Z', 
    updated_at: '2024-01-12T00:00:00.000Z' 
  },
  { 
    id: '13', 
    email: 'mroy@mroy.com', 
    name: 'M Roy', 
    phone: '+91-9876543213', 
    address: '369 Retail Plaza, Patna, Bihar', 
    company_name: 'M Roy', 
    gst_number: 'GST334455667', 
    contact_person: 'M Roy',
    status: 'ACTIVE', 
    created_at: '2024-01-13T00:00:00.000Z', 
    updated_at: '2024-01-13T00:00:00.000Z' 
  },
  { 
    id: '14', 
    email: 'ameen@ameen.com', 
    name: 'AMEEN', 
    phone: '+91-9876543214', 
    address: '741 Market Lane, Bhopal, Madhya Pradesh', 
    company_name: 'AMEEN', 
    gst_number: 'GST445566778', 
    contact_person: 'AMEEN',
    status: 'ACTIVE', 
    created_at: '2024-01-14T00:00:00.000Z', 
    updated_at: '2024-01-14T00:00:00.000Z' 
  },
  { 
    id: '15', 
    email: 'pandey@pandey.com', 
    name: 'Pandey', 
    phone: '+91-9876543215', 
    address: '852 Business Street, Chandigarh, Punjab', 
    company_name: 'Pandey', 
    gst_number: 'GST556677889', 
    contact_person: 'Pandey',
    status: 'ACTIVE', 
    created_at: '2024-01-15T00:00:00.000Z', 
    updated_at: '2024-01-15T00:00:00.000Z' 
  }
];

// Demo retailers data with real partner details from pos.name.text
const demoRetailers = [
  {
    id: '1',
    email: 'shahana.khan@instantmudra.co.in',
    name: 'Instant Mudra Branch 1',
    phone: '+91-9876543201',
    address: '5th Floor, Building F, PLOT NO 29 TO 32 AND 36, PUDHARI BHAVAN, SEC-30A, NEAR SANPADA TAILWAY STATION, Sanpada, Navi Mumbai, Thane, Maharashtra, 400705',
    shop_name: 'Instant Mudra Store 1',
    gst_number: '27AAFCI2936K1ZB',
    distributor_id: '1',
    distributor: {
      name: 'INSTANT MUDRA TECHNOLOGIES PRIVATE LIMITED',
      company: 'INSTANT MUDRA TECHNOLOGIES PRIVATE LIMITED'
    },
    status: 'ACTIVE',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'info@dmcpay.in',
    name: 'DMCPAY Branch 1',
    phone: '+91-9650001862',
    address: 'Flat No.: A 1738, Suraj Kund Badkhal Road, Nhpc Colony Faridabad Sub Post Office, Green Field Colony, Haryana, Faridabad - 121010',
    shop_name: 'DMCPAY Store 1',
    gst_number: '06AALCD1614P1ZF',
    distributor_id: '2',
    distributor: {
      name: 'DMCPAY SOLUTIONS PRIVATE LIMITED',
      company: 'DMCPAY SOLUTIONS PRIVATE LIMITED'
    },
    status: 'ACTIVE',
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    email: 'paymatrixsolutions@gmail.com',
    name: 'Paymatrix Branch 1',
    phone: '+91-9876543203',
    address: 'Shop no 8 shewanta Heights Punyai Nagar Near Crown Bakery Pune Satara Road Balaji nagar Dhankwadi - Pune - 411043',
    shop_name: 'Paymatrix Store 1',
    gst_number: '27AAPCP0507M1Z3',
    distributor_id: '3',
    distributor: {
      name: 'PAYMATRIX SOLUTIONS PRIVATE LIMITED',
      company: 'PAYMATRIX SOLUTIONS PRIVATE LIMITED'
    },
    status: 'ACTIVE',
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    email: 'dhamilliontech@gmail.com',
    name: 'Dhamillion Branch 1',
    phone: '+91-9876543204',
    address: 'Flat No 8, Block-D,Paradise Homes,Hayathnagar,Rangareddy - 501505',
    shop_name: 'Dhamillion Store 1',
    gst_number: '36AALCD2916N1Z9',
    distributor_id: '4',
    distributor: {
      name: 'Dhamillion Technologies Private Limited',
      company: 'Dhamillion Technologies Private Limited'
    },
    status: 'ACTIVE',
    created_at: '2024-01-04T00:00:00.000Z',
    updated_at: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '5',
    email: 'aaditya2011@gmail.com',
    name: 'Aditya Branch 1',
    phone: '+91-9876543205',
    address: 'B201, Tirumala Omkar Residency Canal Road, Anandvalli Pipeline Road, Gangapur Nashik - 422013',
    shop_name: 'Aditya Store 1',
    gst_number: 'GST556677889',
    distributor_id: '5',
    distributor: {
      name: 'QWIKPYEE/Aditya Jagannath Puthanpure',
      company: 'QWIKPYEE/Aditya Jagannath Puthanpure'
    },
    status: 'ACTIVE',
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '6',
    email: 'raju@mobile.com',
    name: 'Raju Mobile Branch 1',
    phone: '+91-9876543206',
    address: 'Shop No. 1, Plot No. 11/12A, Sector-1, Shirwane, Nerul, Navi Mumbai, Thane, Maharashtra-400706',
    shop_name: 'Raju Mobile Store 1',
    gst_number: 'GST667788990',
    distributor_id: '6',
    distributor: {
      name: 'Raju Mobile',
      company: 'Raju Mobile'
    },
    status: 'ACTIVE',
    created_at: '2024-01-06T00:00:00.000Z',
    updated_at: '2024-01-06T00:00:00.000Z'
  },
  {
    id: '7',
    email: 'gk@enterprises.com',
    name: 'GK Enterprises Branch 1',
    phone: '+91-9876543207',
    address: '369 Market Street, Delhi, Delhi',
    shop_name: 'GK Enterprises Store 1',
    gst_number: 'GST778899001',
    distributor_id: '7',
    distributor: {
      name: 'GK Enterprices',
      company: 'GK Enterprices'
    },
    status: 'ACTIVE',
    created_at: '2024-01-07T00:00:00.000Z',
    updated_at: '2024-01-07T00:00:00.000Z'
  },
  {
    id: '8',
    email: 'akshay@akshay.com',
    name: 'Akshay Branch 1',
    phone: '+91-9876543208',
    address: '741 Retail Plaza, Hyderabad, Telangana',
    shop_name: 'Akshay Store 1',
    gst_number: 'GST889900112',
    distributor_id: '8',
    distributor: {
      name: 'Akshay',
      company: 'Akshay'
    },
    status: 'ACTIVE',
    created_at: '2024-01-08T00:00:00.000Z',
    updated_at: '2024-01-08T00:00:00.000Z'
  },
  {
    id: '9',
    email: 'jaskaren@jaskaren.com',
    name: 'Jaskaren Branch 1',
    phone: '+91-9876543209',
    address: '852 Shop Road, Ahmedabad, Gujarat',
    shop_name: 'Jaskaren Store 1',
    gst_number: 'GST990011223',
    distributor_id: '9',
    distributor: {
      name: 'Jaskaren',
      company: 'Jaskaren'
    },
    status: 'ACTIVE',
    created_at: '2024-01-09T00:00:00.000Z',
    updated_at: '2024-01-09T00:00:00.000Z'
  },
  {
    id: '10',
    email: 'jaharunisha@jaharunisha.com',
    name: 'Jaharunisha Branch 1',
    phone: '+91-9876543210',
    address: '963 Store Lane, Kolkata, West Bengal',
    shop_name: 'Jaharunisha Store 1',
    gst_number: 'GST001122334',
    distributor_id: '10',
    distributor: {
      name: 'jaharunisha',
      company: 'jaharunisha'
    },
    status: 'ACTIVE',
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z'
  },
  {
    id: '11',
    email: 'sanjay@sanjay.com',
    name: 'Sanjay Bhati Branch 1',
    phone: '+91-9876543211',
    address: '147 Business Center, Jaipur, Rajasthan',
    shop_name: 'Sanjay Bhati Store 1',
    gst_number: 'GST112233445',
    distributor_id: '11',
    distributor: {
      name: 'Sanjay Bhati',
      company: 'Sanjay Bhati'
    },
    status: 'ACTIVE',
    created_at: '2024-01-11T00:00:00.000Z',
    updated_at: '2024-01-11T00:00:00.000Z'
  },
  {
    id: '12',
    email: 'kamlesh@kamlesh.com',
    name: 'Kamlesh Rathod Branch 1',
    phone: '+91-9876543212',
    address: '258 Distributor Street, Lucknow, Uttar Pradesh',
    shop_name: 'Kamlesh Rathod Store 1',
    gst_number: 'GST223344556',
    distributor_id: '12',
    distributor: {
      name: 'Kamlesh Rathod',
      company: 'Kamlesh Rathod'
    },
    status: 'ACTIVE',
    created_at: '2024-01-12T00:00:00.000Z',
    updated_at: '2024-01-12T00:00:00.000Z'
  },
  {
    id: '13',
    email: 'mroy@mroy.com',
    name: 'M Roy Branch 1',
    phone: '+91-9876543213',
    address: '369 Retail Plaza, Patna, Bihar',
    shop_name: 'M Roy Store 1',
    gst_number: 'GST334455667',
    distributor_id: '13',
    distributor: {
      name: 'M Roy',
      company: 'M Roy'
    },
    status: 'ACTIVE',
    created_at: '2024-01-13T00:00:00.000Z',
    updated_at: '2024-01-13T00:00:00.000Z'
  },
  {
    id: '14',
    email: 'ameen@ameen.com',
    name: 'AMEEN Branch 1',
    phone: '+91-9876543214',
    address: '741 Market Lane, Bhopal, Madhya Pradesh',
    shop_name: 'AMEEN Store 1',
    gst_number: 'GST445566778',
    distributor_id: '14',
    distributor: {
      name: 'AMEEN',
      company: 'AMEEN'
    },
    status: 'ACTIVE',
    created_at: '2024-01-14T00:00:00.000Z',
    updated_at: '2024-01-14T00:00:00.000Z'
  },
  {
    id: '15',
    email: 'pandey@pandey.com',
    name: 'Pandey Branch 1',
    phone: '+91-9876543215',
    address: '852 Business Street, Chandigarh, Punjab',
    shop_name: 'Pandey Store 1',
    gst_number: 'GST556677889',
    distributor_id: '15',
    distributor: {
      name: 'Pandey',
      company: 'Pandey'
    },
    status: 'ACTIVE',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-01-15T00:00:00.000Z'
  }
];

module.exports = {
  demoMachines,
  demoDistributors,
  demoRetailers
}; 