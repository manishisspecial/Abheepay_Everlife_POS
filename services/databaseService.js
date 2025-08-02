const supabase = require('../config/database');

class DatabaseService {
  // Machine Operations
  async getAllMachines(filters = {}) {
    try {
      let query = supabase
        .from('machines')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.type && filters.type !== 'all') {
        query = query.eq('machine_type', filters.type);
      }

      if (filters.manufacturer && filters.manufacturer !== 'all') {
        query = query.eq('manufacturer', filters.manufacturer);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.or(`serial_number.ilike.%${searchTerm}%,mid.ilike.%${searchTerm}%,tid.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching machines:', error);
        throw new Error('Failed to fetch machines');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getMachineById(id) {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching machine:', error);
        throw new Error('Machine not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getAvailableMachines(filters = {}) {
    try {
      let query = supabase
        .from('machines')
        .select('*')
        .eq('status', 'AVAILABLE')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.type && filters.type !== 'all') {
        query = query.eq('machine_type', filters.type);
      }

      if (filters.manufacturer && filters.manufacturer !== 'all') {
        query = query.eq('manufacturer', filters.manufacturer);
      }

      if (filters.model && filters.model !== 'all') {
        query = query.eq('model', filters.model);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching available machines:', error);
        throw new Error('Failed to fetch available machines');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async updateMachineStatus(id, status, partner = null, partnerType = null) {
    try {
      const updateData = { status };
      
      if (partner) {
        updateData.partner = partner;
      }
      
      if (partnerType) {
        updateData.partner_type = partnerType;
      }

      const { data, error } = await supabase
        .from('machines')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating machine status:', error);
        throw new Error('Failed to update machine status');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async createMachine(machineData) {
    try {
      // Check if machine with same serial number already exists
      const { data: existingMachine, error: checkError } = await supabase
        .from('machines')
        .select('id')
        .eq('serial_number', machineData.serialNumber)
        .single();

      if (existingMachine) {
        throw new Error('Machine with this serial number already exists');
      }

      const { data, error } = await supabase
        .from('machines')
        .insert({
          serial_number: machineData.serialNumber,
          mid: machineData.mid,
          tid: machineData.tid,
          machine_type: machineData.type,
          model: machineData.model,
          manufacturer: machineData.manufacturer,
          status: 'AVAILABLE',
          partner: machineData.partner,
          partner_type: machineData.partnerType,
          qr_code: machineData.type === 'SOUNDBOX' ? `QR_${machineData.serialNumber}` : null,
          has_standee: machineData.type === 'SOUNDBOX' ? Math.random() > 0.5 : false,
          service_provider_id: machineData.serviceProviderId
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating machine:', error);
        throw new Error('Failed to create machine');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async updateMachine(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('machines')
        .update({
          serial_number: updateData.serialNumber,
          mid: updateData.mid,
          tid: updateData.tid,
          machine_type: updateData.type,
          model: updateData.model,
          manufacturer: updateData.manufacturer,
          status: updateData.status,
          partner: updateData.partner,
          partner_type: updateData.partnerType,
          qr_code: updateData.qrCode,
          has_standee: updateData.hasStandee,
          service_provider_id: updateData.serviceProviderId
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating machine:', error);
        throw new Error('Machine not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async deleteMachine(id) {
    try {
      // First check if machine exists
      const { data: existingMachine, error: checkError } = await supabase
        .from('machines')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existingMachine) {
        throw new Error('Machine not found');
      }

      const { error } = await supabase
        .from('machines')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting machine:', error);
        throw new Error('Failed to delete machine');
      }

      return existingMachine;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getPartnerStats() {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('partner, machine_type, status');

      if (error) {
        console.error('Error fetching partner stats:', error);
        throw new Error('Failed to fetch partner statistics');
      }

      const partnerStats = {};
      
      data.forEach(machine => {
        if (!partnerStats[machine.partner]) {
          partnerStats[machine.partner] = {
            total: 0,
            pos: 0,
            soundbox: 0,
            available: 0,
            assigned: 0,
            maintenance: 0
          };
        }
        
        partnerStats[machine.partner].total++;
        partnerStats[machine.partner][machine.machine_type.toLowerCase()]++;
        partnerStats[machine.partner][machine.status.toLowerCase()]++;
      });

      return partnerStats;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Assignment Operations
  async getAllAssignments(filters = {}) {
    try {
      let query = supabase
        .from('assignments')
        .select(`
          *,
          machines:machine_id(*),
          distributors:distributor_id(*),
          retailers:retailer_id(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.distributorId) {
        query = query.eq('distributor_id', filters.distributorId);
      }

      if (filters.retailerId) {
        query = query.eq('retailer_id', filters.retailerId);
      }

      if (filters.machineId) {
        query = query.eq('machine_id', filters.machineId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching assignments:', error);
        throw new Error('Failed to fetch assignments');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getAssignmentById(id) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          machines:machine_id(*),
          distributors:distributor_id(*),
          retailers:retailer_id(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching assignment:', error);
        throw new Error('Assignment not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async createAssignment(assignmentData) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData])
        .select(`
          *,
          machines:machine_id(*),
          distributors:distributor_id(*),
          retailers:retailer_id(*)
        `)
        .single();

      if (error) {
        console.error('Error creating assignment:', error);
        throw new Error('Failed to create assignment');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async updateAssignmentStatus(id, status, notes = null) {
    try {
      const updateData = { status };
      
      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('assignments')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          machines:machine_id(*),
          distributors:distributor_id(*),
          retailers:retailer_id(*)
        `)
        .single();

      if (error) {
        console.error('Error updating assignment status:', error);
        throw new Error('Failed to update assignment status');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async deleteAssignment(id) {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting assignment:', error);
        throw new Error('Failed to delete assignment');
      }

      return true;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Distributor Operations
  async getAllDistributors() {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching distributors:', error);
        throw new Error('Failed to fetch distributors');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getDistributorById(id) {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching distributor:', error);
        throw new Error('Distributor not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async createDistributor(distributorData) {
    try {
      // Check if distributor with same email already exists
      const { data: existingDistributor, error: checkError } = await supabase
        .from('distributors')
        .select('id')
        .eq('email', distributorData.email)
        .single();

      if (existingDistributor) {
        throw new Error('Distributor with this email already exists');
      }

      const { data, error } = await supabase
        .from('distributors')
        .insert({
          email: distributorData.email,
          name: distributorData.name,
          phone: distributorData.phone,
          address: distributorData.address,
          company_name: distributorData.company_name,
          gst_number: distributorData.gst_number,
          contact_person: distributorData.contact_person,
          status: 'ACTIVE'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating distributor:', error);
        throw new Error('Failed to create distributor');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async updateDistributor(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .update({
          email: updateData.email,
          name: updateData.name,
          phone: updateData.phone,
          address: updateData.address,
          company_name: updateData.company_name,
          gst_number: updateData.gst_number,
          contact_person: updateData.contact_person,
          status: updateData.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating distributor:', error);
        throw new Error('Distributor not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async deleteDistributor(id) {
    try {
      // First check if distributor exists
      const { data: existingDistributor, error: checkError } = await supabase
        .from('distributors')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existingDistributor) {
        throw new Error('Distributor not found');
      }

      const { error } = await supabase
        .from('distributors')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting distributor:', error);
        throw new Error('Failed to delete distributor');
      }

      return existingDistributor;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Retailer Operations
  async getAllRetailers(filters = {}) {
    try {
      let query = supabase
        .from('retailers')
        .select(`
          *,
          distributors:distributor_id(*)
        `)
        .order('name', { ascending: true });

      if (filters.distributorId) {
        query = query.eq('distributor_id', filters.distributorId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching retailers:', error);
        throw new Error('Failed to fetch retailers');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getRetailerById(id) {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select(`
          *,
          distributors:distributor_id(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching retailer:', error);
        throw new Error('Retailer not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async createRetailer(retailerData) {
    try {
      // Check if retailer with same email already exists
      const { data: existingRetailer, error: checkError } = await supabase
        .from('retailers')
        .select('id')
        .eq('email', retailerData.email)
        .single();

      if (existingRetailer) {
        throw new Error('Retailer with this email already exists');
      }

      const { data, error } = await supabase
        .from('retailers')
        .insert({
          email: retailerData.email,
          name: retailerData.name,
          phone: retailerData.phone,
          address: retailerData.address,
          shop_name: retailerData.shop_name,
          gst_number: retailerData.gst_number,
          distributor_id: retailerData.distributor_id,
          status: 'ACTIVE'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating retailer:', error);
        throw new Error('Failed to create retailer');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async updateRetailer(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .update({
          email: updateData.email,
          name: updateData.name,
          phone: updateData.phone,
          address: updateData.address,
          shop_name: updateData.shop_name,
          gst_number: updateData.gst_number,
          distributor_id: updateData.distributor_id,
          status: updateData.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating retailer:', error);
        throw new Error('Retailer not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async deleteRetailer(id) {
    try {
      // First check if retailer exists
      const { data: existingRetailer, error: checkError } = await supabase
        .from('retailers')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existingRetailer) {
        throw new Error('Retailer not found');
      }

      const { error } = await supabase
        .from('retailers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting retailer:', error);
        throw new Error('Failed to delete retailer');
      }

      return existingRetailer;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Order Operations
  async getAllOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          distributors:distributor_id(*),
          retailers:retailer_id(*),
          service_providers:service_provider_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          distributors:distributor_id(*),
          retailers:retailer_id(*),
          service_providers:service_provider_id(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
        throw new Error('Order not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_number: `ORD${Date.now()}`,
          distributor_id: orderData.distributorId,
          retailer_id: orderData.retailerId,
          service_provider_id: orderData.serviceProviderId,
          order_type: orderData.orderType,
          order_status: 'PENDING',
          order_date: new Date().toISOString().split('T')[0],
          delivery_address: orderData.deliveryAddress,
          contact_person: orderData.contactPerson,
          contact_phone: orderData.contactPhone,
          contact_email: orderData.contactEmail,
          notes: orderData.notes,
          total_amount: orderData.totalAmount
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async updateOrder(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          order_type: updateData.orderType,
          order_status: updateData.orderStatus,
          delivery_address: updateData.deliveryAddress,
          contact_person: updateData.contactPerson,
          contact_phone: updateData.contactPhone,
          contact_email: updateData.contactEmail,
          notes: updateData.notes,
          total_amount: updateData.totalAmount
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating order:', error);
        throw new Error('Order not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async deleteOrder(id) {
    try {
      // First check if order exists
      const { data: existingOrder, error: checkError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (checkError || !existingOrder) {
        throw new Error('Order not found');
      }

      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting order:', error);
        throw new Error('Failed to delete order');
      }

      return existingOrder;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Statistics Operations
  async getMachineStats() {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('machine_type, status');

      if (error) {
        console.error('Error fetching machine stats:', error);
        throw new Error('Failed to fetch machine statistics');
      }

      const stats = {
        total: data.length,
        pos: data.filter(m => m.machine_type === 'POS').length,
        soundbox: data.filter(m => m.machine_type === 'SOUNDBOX').length,
        available: data.filter(m => m.status === 'AVAILABLE').length,
        assigned: data.filter(m => m.status === 'ASSIGNED').length,
        maintenance: data.filter(m => m.status === 'MAINTENANCE').length
      };

      return stats;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getAssignmentStats() {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('status, machines(machine_type)');

      if (error) {
        console.error('Error fetching assignment stats:', error);
        throw new Error('Failed to fetch assignment statistics');
      }

      const stats = {
        totalAssignments: data.length,
        activeAssignments: data.filter(a => a.status === 'ACTIVE').length,
        inactiveAssignments: data.filter(a => a.status === 'INACTIVE').length,
        returnedAssignments: data.filter(a => a.status === 'RETURNED').length,
        reassignedAssignments: data.filter(a => a.status === 'REASSIGNED').length,
        assignmentsByType: {
          POS: data.filter(a => a.machines?.machine_type === 'POS').length,
          SOUNDBOX: data.filter(a => a.machines?.machine_type === 'SOUNDBOX').length
        }
      };

      return stats;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Bulk Operations
  async createBulkAssignments(assignments) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert(assignments)
        .select(`
          *,
          machines:machine_id(*),
          distributors:distributor_id(*),
          retailers:retailer_id(*)
        `);

      if (error) {
        console.error('Error creating bulk assignments:', error);
        throw new Error('Failed to create bulk assignments');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async updateMultipleMachineStatus(machineIds, status, partner = null, partnerType = null) {
    try {
      const updateData = { status };
      
      if (partner) {
        updateData.partner = partner;
      }
      
      if (partnerType) {
        updateData.partner_type = partnerType;
      }

      const { data, error } = await supabase
        .from('machines')
        .update(updateData)
        .in('id', machineIds)
        .select();

      if (error) {
        console.error('Error updating multiple machine status:', error);
        throw new Error('Failed to update machine statuses');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseService(); 