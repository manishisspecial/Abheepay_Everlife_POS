const supabase = require('../config/database');

class EnhancedDatabaseService {
  // Service Provider Operations
  async getAllServiceProviders() {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching service providers:', error);
        throw new Error('Failed to fetch service providers');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getServiceProviderById(id) {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching service provider:', error);
        throw new Error('Service provider not found');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Enhanced Machine Operations
  async getAllMachines(filters = {}) {
    try {
      let query = supabase
        .from('machines')
        .select(`
          *,
          service_providers:service_provider_id(*)
        `)
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

      if (filters.serviceProviderId) {
        query = query.eq('service_provider_id', filters.serviceProviderId);
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

  async getAvailableMachines(filters = {}) {
    try {
      let query = supabase
        .from('machines')
        .select(`
          *,
          service_providers:service_provider_id(*)
        `)
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

      if (filters.serviceProviderId) {
        query = query.eq('service_provider_id', filters.serviceProviderId);
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

  async getMachinesByServiceProvider(serviceProviderId, filters = {}) {
    try {
      let query = supabase
        .from('machines')
        .select(`
          *,
          service_providers:service_provider_id(*)
        `)
        .eq('service_provider_id', serviceProviderId)
        .order('created_at', { ascending: false });

      // Apply additional filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.type && filters.type !== 'all') {
        query = query.eq('machine_type', filters.type);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.or(`serial_number.ilike.%${searchTerm}%,mid.ilike.%${searchTerm}%,tid.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching machines by service provider:', error);
        throw new Error('Failed to fetch machines');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Order Operations
  async getAllOrders(filters = {}) {
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          distributors:distributor_id(*),
          retailers:retailer_id(*),
          service_providers:service_provider_id(*)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.distributorId) {
        query = query.eq('distributor_id', filters.distributorId);
      }

      if (filters.serviceProviderId) {
        query = query.eq('service_provider_id', filters.serviceProviderId);
      }

      if (filters.orderType && filters.orderType !== 'all') {
        query = query.eq('order_type', filters.orderType);
      }

      const { data, error } = await query;

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
          service_providers:service_provider_id(*),
          order_items(
            *,
            machines:machine_id(*)
          )
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
        .insert([orderData])
        .select(`
          *,
          distributors:distributor_id(*),
          retailers:retailer_id(*),
          service_providers:service_provider_id(*)
        `)
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

  async updateOrderStatus(id, status, notes = null) {
    try {
      const updateData = { status };
      
      if (notes) {
        updateData.notes = notes;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          distributors:distributor_id(*),
          retailers:retailer_id(*),
          service_providers:service_provider_id(*)
        `)
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        throw new Error('Failed to update order status');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Delivery Tracking Operations
  async getDeliveryTrackingByAssignment(assignmentId) {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .eq('assignment_id', assignmentId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching delivery tracking:', error);
        throw new Error('Failed to fetch delivery tracking');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async createDeliveryTracking(trackingData) {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .insert([trackingData])
        .select()
        .single();

      if (error) {
        console.error('Error creating delivery tracking:', error);
        throw new Error('Failed to create delivery tracking');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async updateDeliveryStatus(id, status, deliveryDate = null, deliveredBy = null, notes = null) {
    try {
      const updateData = { 
        delivery_status: status,
        updated_at: new Date().toISOString()
      };
      
      if (deliveryDate) {
        updateData.delivery_date = deliveryDate;
      }
      
      if (deliveredBy) {
        updateData.delivered_by = deliveredBy;
      }
      
      if (notes) {
        updateData.delivery_notes = notes;
      }

      const { data, error } = await supabase
        .from('delivery_tracking')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating delivery status:', error);
        throw new Error('Failed to update delivery status');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Inventory Stock Operations
  async getInventoryStock(filters = {}) {
    try {
      let query = supabase
        .from('inventory_stock')
        .select(`
          *,
          service_providers:service_provider_id(*)
        `)
        .order('created_at', { ascending: false });

      if (filters.serviceProviderId) {
        query = query.eq('service_provider_id', filters.serviceProviderId);
      }

      if (filters.machineType && filters.machineType !== 'all') {
        query = query.eq('machine_type', filters.machineType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching inventory stock:', error);
        throw new Error('Failed to fetch inventory stock');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async updateInventoryStock(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('inventory_stock')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          service_providers:service_provider_id(*)
        `)
        .single();

      if (error) {
        console.error('Error updating inventory stock:', error);
        throw new Error('Failed to update inventory stock');
      }

      return data;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  // Enhanced Statistics
  async getDashboardStats() {
    try {
      // Get machine statistics
      const { data: machines, error: machinesError } = await supabase
        .from('machines')
        .select('machine_type, status, service_provider_id');

      if (machinesError) {
        console.error('Error fetching machine stats:', machinesError);
        throw new Error('Failed to fetch machine statistics');
      }

      // Get assignment statistics
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('status, machines(machine_type)');

      if (assignmentsError) {
        console.error('Error fetching assignment stats:', assignmentsError);
        throw new Error('Failed to fetch assignment statistics');
      }

      // Get order statistics
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('status, order_type');

      if (ordersError) {
        console.error('Error fetching order stats:', ordersError);
        throw new Error('Failed to fetch order statistics');
      }

      // Get service provider statistics
      const { data: serviceProviders, error: spError } = await supabase
        .from('service_providers')
        .select('id, name');

      if (spError) {
        console.error('Error fetching service provider stats:', spError);
        throw new Error('Failed to fetch service provider statistics');
      }

      const stats = {
        machines: {
          total: machines.length,
          pos: machines.filter(m => m.machine_type === 'POS').length,
          soundbox: machines.filter(m => m.machine_type === 'SOUNDBOX').length,
          available: machines.filter(m => m.status === 'AVAILABLE').length,
          assigned: machines.filter(m => m.status === 'ASSIGNED').length,
          maintenance: machines.filter(m => m.status === 'MAINTENANCE').length
        },
        assignments: {
          total: assignments.length,
          active: assignments.filter(a => a.status === 'ACTIVE').length,
          inactive: assignments.filter(a => a.status === 'INACTIVE').length,
          returned: assignments.filter(a => a.status === 'RETURNED').length,
          reassigned: assignments.filter(a => a.status === 'REASSIGNED').length
        },
        orders: {
          total: orders.length,
          pending: orders.filter(o => o.status === 'PENDING').length,
          approved: orders.filter(o => o.status === 'APPROVED').length,
          completed: orders.filter(o => o.status === 'COMPLETED').length,
          cancelled: orders.filter(o => o.status === 'CANCELLED').length
        },
        serviceProviders: serviceProviders.length
      };

      return stats;
    } catch (error) {
      console.error('Database service error:', error);
      throw error;
    }
  }

  async getServiceProviderStats(serviceProviderId) {
    try {
      const { data: machines, error: machinesError } = await supabase
        .from('machines')
        .select('machine_type, status')
        .eq('service_provider_id', serviceProviderId);

      if (machinesError) {
        console.error('Error fetching service provider machine stats:', machinesError);
        throw new Error('Failed to fetch service provider statistics');
      }

      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory_stock')
        .select('*')
        .eq('service_provider_id', serviceProviderId);

      if (inventoryError) {
        console.error('Error fetching inventory stats:', inventoryError);
        throw new Error('Failed to fetch inventory statistics');
      }

      const stats = {
        machines: {
          total: machines.length,
          pos: machines.filter(m => m.machine_type === 'POS').length,
          soundbox: machines.filter(m => m.machine_type === 'SOUNDBOX').length,
          available: machines.filter(m => m.status === 'AVAILABLE').length,
          assigned: machines.filter(m => m.status === 'ASSIGNED').length,
          maintenance: machines.filter(m => m.status === 'MAINTENANCE').length
        },
        inventory: inventory.map(item => ({
          type: item.machine_type,
          model: item.model,
          total: item.total_quantity,
          available: item.available_quantity,
          allocated: item.allocated_quantity,
          maintenance: item.maintenance_quantity
        }))
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

  // Generate unique order number
  async generateOrderNumber() {
    try {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `ORD${timestamp}${random}`;
    } catch (error) {
      console.error('Error generating order number:', error);
      throw error;
    }
  }

  // Generate unique tracking number
  async generateTrackingNumber() {
    try {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `TRK${timestamp}${random}`;
    } catch (error) {
      console.error('Error generating tracking number:', error);
      throw error;
    }
  }
}

module.exports = new EnhancedDatabaseService(); 