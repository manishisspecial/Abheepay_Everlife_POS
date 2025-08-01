// Demo data for the POS Management System

// Demo machines data with B2B/B2C partners
const demoMachines = [
  // Telering B2B Partners - POS Machines
  { id: '1', serialNumber: 'TLR-IM191-001', mid: 'MID191001', tid: 'TID191001', type: 'POS', model: 'Instant Mudra-191', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B' },
  { id: '2', serialNumber: 'TLR-IM191-002', mid: 'MID191002', tid: 'TID191002', type: 'POS', model: 'Instant Mudra-191', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B' },
  { id: '3', serialNumber: 'TLR-DH6-001', mid: 'MID6001', tid: 'TID6001', type: 'POS', model: 'Dhamillion-6', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Dhamillion', partnerType: 'B2B' },
  { id: '4', serialNumber: 'TLR-QP10-001', mid: 'MID10001', tid: 'TID10001', type: 'POS', model: 'Quickpay-10', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Quickpay', partnerType: 'B2B' },
  { id: '5', serialNumber: 'TLR-PM10-001', mid: 'MID10P001', tid: 'TID10P001', type: 'POS', model: 'Paymatrix-10', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Paymatrix', partnerType: 'B2B' },
  { id: '6', serialNumber: 'TLR-DMC28-001', mid: 'MID28D001', tid: 'TID28D001', type: 'POS', model: 'DMCPAY-28', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'DMCPAY', partnerType: 'B2B' },
  { id: '7', serialNumber: 'TLR-RM11-001', mid: 'MID11R001', tid: 'TID11R001', type: 'POS', model: 'Raju Mobile-11', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Raju Mobile', partnerType: 'B2B' },
  
  // Telering B2B Partners - Soundbox (100 QR)
  { id: '8', serialNumber: 'TLR-SB-B2B-001', mid: 'MIDSB001', tid: 'TIDSB001', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B', qrCode: 'QR_TLR_B2B_001', hasStandee: true },
  { id: '9', serialNumber: 'TLR-SB-B2B-002', mid: 'MIDSB002', tid: 'TIDSB002', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Dhamillion', partnerType: 'B2B', qrCode: 'QR_TLR_B2B_002', hasStandee: true },
  { id: '10', serialNumber: 'TLR-SB-B2B-003', mid: 'MIDSB003', tid: 'TIDSB003', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'ASSIGNED', partner: 'Quickpay', partnerType: 'B2B', qrCode: 'QR_TLR_B2B_003', hasStandee: true },
  
  // Telering B2C Available - POS Machines
  { id: '11', serialNumber: 'TLR-B2C-001', mid: 'MIDB2C001', tid: 'TIDB2C001', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  { id: '12', serialNumber: 'TLR-B2C-002', mid: 'MIDB2C002', tid: 'TIDB2C002', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  { id: '13', serialNumber: 'TLR-B2C-003', mid: 'MIDB2C003', tid: 'TIDB2C003', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  
  // Telering B2C Available - Soundbox
  { id: '14', serialNumber: 'TLR-SB-B2C-001', mid: 'MIDSBB2C001', tid: 'TIDSBB2C001', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C', qrCode: 'QR_TLR_B2C_001', hasStandee: true },
  { id: '15', serialNumber: 'TLR-SB-B2C-002', mid: 'MIDSBB2C002', tid: 'TIDSBB2C002', type: 'SOUNDBOX', model: 'Telering-1000', manufacturer: 'Telering', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C', qrCode: 'QR_TLR_B2C_002', hasStandee: false },
  
  // Everlife B2B Partners - POS Machines
  { id: '16', serialNumber: 'EVL-IM101-001', mid: 'MID101E001', tid: 'TID101E001', type: 'POS', model: 'Instant Mudra-101', manufacturer: 'Everlife', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B' },
  { id: '17', serialNumber: 'EVL-IM101-002', mid: 'MID101E002', tid: 'TID101E002', type: 'POS', model: 'Instant Mudra-101', manufacturer: 'Everlife', status: 'ASSIGNED', partner: 'Instant Mudra', partnerType: 'B2B' },
  { id: '18', serialNumber: 'EVL-DMC80-001', mid: 'MID80E001', tid: 'TID80E001', type: 'POS', model: 'DMCPAY-80', manufacturer: 'Everlife', status: 'ASSIGNED', partner: 'DMCPAY', partnerType: 'B2B' },
  { id: '19', serialNumber: 'EVL-RM40-001', mid: 'MID40E001', tid: 'TID40E001', type: 'POS', model: 'Raju Mobile-40', manufacturer: 'Everlife', status: 'ASSIGNED', partner: 'Raju Mobile', partnerType: 'B2B' },
  
  // Everlife B2C Available - POS Machines
  { id: '20', serialNumber: 'EVL-B2C-001', mid: 'MIDB2CE001', tid: 'TIDB2CE001', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  { id: '21', serialNumber: 'EVL-B2C-002', mid: 'MIDB2CE002', tid: 'TIDB2CE002', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  { id: '22', serialNumber: 'EVL-B2C-003', mid: 'MIDB2CE003', tid: 'TIDB2CE003', type: 'POS', model: 'Everlife-251', manufacturer: 'Everlife', status: 'AVAILABLE', partner: 'B2C', partnerType: 'B2C' },
  
  // Maintenance Machines
  { id: '23', serialNumber: 'TLR-MAINT-001', mid: 'MIDMAINT001', tid: 'TIDMAINT001', type: 'POS', model: 'Telering-390', manufacturer: 'Telering', status: 'MAINTENANCE', partner: 'B2C', partnerType: 'B2C' },
  { id: '24', serialNumber: 'EVL-MAINT-001', mid: 'MIDMAINTE001', tid: 'TIDMAINTE001', type: 'SOUNDBOX', model: 'Everlife-251', manufacturer: 'Everlife', status: 'MAINTENANCE', partner: 'B2C', partnerType: 'B2C', qrCode: 'QR_EVL_MAINT_001', hasStandee: false }
];



// Demo distributors data
const demoDistributors = [
  { id: '1', email: 'abc@distributor.com', name: 'ABC Distributors', phone: '+91-9876543211', address: '123 Business Park, Mumbai, Maharashtra', company_name: 'ABC Trading Co.', gst_number: 'GST123456789', status: 'ACTIVE', created_at: '2024-01-01T00:00:00.000Z', updated_at: '2024-01-01T00:00:00.000Z' },
  { id: '2', email: 'xyz@distributor.com', name: 'XYZ Distributors', phone: '+91-9876543212', address: '456 Corporate Plaza, Delhi, Delhi', company_name: 'XYZ Enterprises', gst_number: 'GST987654321', status: 'ACTIVE', created_at: '2024-01-02T00:00:00.000Z', updated_at: '2024-01-02T00:00:00.000Z' },
  { id: '3', email: 'instant@distributor.com', name: 'Instant Mudra Solutions', phone: '+91-9876543213', address: '789 Distributor Center, Bangalore, Karnataka', company_name: 'Instant Mudra Solutions Pvt Ltd', gst_number: 'GST112233445', status: 'ACTIVE', created_at: '2024-01-03T00:00:00.000Z', updated_at: '2024-01-03T00:00:00.000Z' },
  { id: '4', email: 'dhamillion@distributor.com', name: 'Dhamillion Trading', phone: '+91-9876543214', address: '321 Distributor Street, Chennai, Tamil Nadu', company_name: 'Dhamillion Trading Co.', gst_number: 'GST556677889', status: 'ACTIVE', created_at: '2024-01-04T00:00:00.000Z', updated_at: '2024-01-04T00:00:00.000Z' },
  { id: '5', email: 'quickpay@distributor.com', name: 'Quickpay Solutions', phone: '+91-9876543215', address: '654 Distributor Lane, Hyderabad, Telangana', company_name: 'Quickpay Solutions Ltd', gst_number: 'GST111222333', status: 'ACTIVE', created_at: '2024-01-05T00:00:00.000Z', updated_at: '2024-01-05T00:00:00.000Z' },
  { id: '6', email: 'paymatrix@distributor.com', name: 'Paymatrix Technologies', phone: '+91-9876543216', address: '987 Distributor Road, Pune, Maharashtra', company_name: 'Paymatrix Technologies Pvt Ltd', gst_number: 'GST445566778', status: 'ACTIVE', created_at: '2024-01-06T00:00:00.000Z', updated_at: '2024-01-06T00:00:00.000Z' },
  { id: '7', email: 'dmcpay@distributor.com', name: 'DMCPAY Solutions', phone: '+91-9876543217', address: '147 Distributor Street, Gurgaon, Haryana', company_name: 'DMCPAY Solutions Ltd', gst_number: 'GST778899001', status: 'ACTIVE', created_at: '2024-01-07T00:00:00.000Z', updated_at: '2024-01-07T00:00:00.000Z' },
  { id: '8', email: 'raju@distributor.com', name: 'Raju Mobile Solutions', phone: '+91-9876543218', address: '258 Distributor Lane, Ahmedabad, Gujarat', company_name: 'Raju Mobile Solutions Pvt Ltd', gst_number: 'GST112233445', status: 'ACTIVE', created_at: '2024-01-08T00:00:00.000Z', updated_at: '2024-01-08T00:00:00.000Z' },
  { id: '9', email: 'def@distributor.com', name: 'DEF Distributors', phone: '+91-9876543219', address: '369 Distributor Road, Kolkata, West Bengal', company_name: 'DEF Trading Co.', gst_number: 'GST556677889', status: 'ACTIVE', created_at: '2024-01-09T00:00:00.000Z', updated_at: '2024-01-09T00:00:00.000Z' }
];

// Demo retailers data
const demoRetailers = [
  {
    id: '1',
    email: 'john@retailer.com',
    name: 'John Doe',
    phone: '+91-9876543213',
    address: '123 Main Street, Mumbai, Maharashtra',
    shop_name: 'Doe Electronics',
    gst_number: 'GST111111111',
    distributor_id: '1',
    distributor: {
      name: 'ABC Distributors',
      company: 'ABC Trading Co.'
    },
    status: 'ACTIVE',
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    email: 'jane@retailer.com',
    name: 'Jane Smith',
    phone: '+91-9876543214',
    address: '456 Market Road, Delhi, Delhi',
    shop_name: 'Smith Gadgets',
    gst_number: 'GST222222222',
    distributor_id: '1',
    distributor: {
      name: 'ABC Distributors',
      company: 'ABC Trading Co.'
    },
    status: 'ACTIVE',
    created_at: '2024-01-02T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z'
  },
  {
    id: '3',
    email: 'bob@retailer.com',
    name: 'Bob Johnson',
    phone: '+91-9876543215',
    address: '789 Shop Lane, Bangalore, Karnataka',
    shop_name: 'Johnson Mobile Store',
    gst_number: 'GST333333333',
    distributor_id: '2',
    distributor: {
      name: 'XYZ Distributors',
      company: 'XYZ Enterprises'
    },
    status: 'ACTIVE',
    created_at: '2024-01-03T00:00:00.000Z',
    updated_at: '2024-01-03T00:00:00.000Z'
  },
  {
    id: '4',
    email: 'alice@retailer.com',
    name: 'Alice Brown',
    phone: '+91-9876543216',
    address: '321 Store Street, Chennai, Tamil Nadu',
    shop_name: 'Brown Electronics',
    gst_number: 'GST444444444',
    distributor_id: '2',
    distributor: {
      name: 'XYZ Distributors',
      company: 'XYZ Enterprises'
    },
    status: 'ACTIVE',
    created_at: '2024-01-04T00:00:00.000Z',
    updated_at: '2024-01-04T00:00:00.000Z'
  },
  {
    id: '5',
    email: 'charlie@retailer.com',
    name: 'Charlie Wilson',
    phone: '+91-9876543217',
    address: '654 Retail Road, Hyderabad, Telangana',
    shop_name: 'Wilson Digital',
    gst_number: 'GST555555555',
    distributor_id: '3',
    distributor: {
      name: 'Instant Mudra Solutions',
      company: 'Instant Mudra Solutions Pvt Ltd'
    },
    status: 'ACTIVE',
    created_at: '2024-01-05T00:00:00.000Z',
    updated_at: '2024-01-05T00:00:00.000Z'
  },
  {
    id: '6',
    email: 'diana@retailer.com',
    name: 'Diana Davis',
    phone: '+91-9876543218',
    address: '987 Shop Plaza, Pune, Maharashtra',
    shop_name: 'Davis Mobile World',
    gst_number: 'GST666666666',
    distributor_id: '3',
    distributor: {
      name: 'Instant Mudra Solutions',
      company: 'Instant Mudra Solutions Pvt Ltd'
    },
    status: 'ACTIVE',
    created_at: '2024-01-06T00:00:00.000Z',
    updated_at: '2024-01-06T00:00:00.000Z'
  },
  {
    id: '7',
    email: 'edward@retailer.com',
    name: 'Edward Miller',
    phone: '+91-9876543219',
    address: '147 Market Lane, Gurgaon, Haryana',
    shop_name: 'Miller Electronics',
    gst_number: 'GST777777777',
    distributor_id: '4',
    distributor: {
      name: 'Dhamillion Trading',
      company: 'Dhamillion Trading Co.'
    },
    status: 'ACTIVE',
    created_at: '2024-01-07T00:00:00.000Z',
    updated_at: '2024-01-07T00:00:00.000Z'
  },
  {
    id: '8',
    email: 'fiona@retailer.com',
    name: 'Fiona Garcia',
    phone: '+91-9876543220',
    address: '258 Store Street, Ahmedabad, Gujarat',
    shop_name: 'Garcia Mobile Store',
    gst_number: 'GST888888888',
    distributor_id: '4',
    distributor: {
      name: 'Dhamillion Trading',
      company: 'Dhamillion Trading Co.'
    },
    status: 'ACTIVE',
    created_at: '2024-01-08T00:00:00.000Z',
    updated_at: '2024-01-08T00:00:00.000Z'
  },
  {
    id: '9',
    email: 'george@retailer.com',
    name: 'George Rodriguez',
    phone: '+91-9876543221',
    address: '369 Shop Road, Kolkata, West Bengal',
    shop_name: 'Rodriguez Electronics',
    gst_number: 'GST999999999',
    distributor_id: '5',
    distributor: {
      name: 'Quickpay Solutions',
      company: 'Quickpay Solutions Ltd'
    },
    status: 'ACTIVE',
    created_at: '2024-01-09T00:00:00.000Z',
    updated_at: '2024-01-09T00:00:00.000Z'
  },
  {
    id: '10',
    email: 'helen@retailer.com',
    name: 'Helen Martinez',
    phone: '+91-9876543222',
    address: '741 Market Plaza, Jaipur, Rajasthan',
    shop_name: 'Martinez Digital World',
    gst_number: 'GST000000000',
    distributor_id: '5',
    distributor: {
      name: 'Quickpay Solutions',
      company: 'Quickpay Solutions Ltd'
    },
    status: 'ACTIVE',
    created_at: '2024-01-10T00:00:00.000Z',
    updated_at: '2024-01-10T00:00:00.000Z'
  }
];

module.exports = {
  demoMachines,
  demoDistributors,
  demoRetailers
}; 