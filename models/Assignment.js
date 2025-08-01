const supabase = require('../config/database');

class Assignment {
  constructor(data) {
    this.id = data.id;
    this.machineId = data.machine_id;
    this.distributorId = data.distributor_id;
    this.retailerId = data.retailer_id;
    this.assignedBy = data.assigned_by;
    this.assignedAt = data.assigned_at;
    this.validFrom = data.valid_from;
    this.validTo = data.valid_to;
    this.status = data.status; // 'ACTIVE', 'REASSIGNED', 'RETURNED', 'EXPIRED'
    this.notes = data.notes;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(assignmentData) {
    try {
      // First, deactivate any existing active assignment for this machine
      await supabase
        .from('assignments')
        .update({ 
          status: 'REASSIGNED',
          valid_to: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('machine_id', assignmentData.machineId)
        .eq('status', 'ACTIVE');

      // Create new assignment
      const { data, error } = await supabase
        .from('assignments')
        .insert([{
          machine_id: assignmentData.machineId,
          distributor_id: assignmentData.distributorId,
          retailer_id: assignmentData.retailerId,
          assigned_by: assignmentData.assignedBy,
          assigned_at: new Date().toISOString(),
          valid_from: assignmentData.validFrom || new Date().toISOString(),
          valid_to: assignmentData.validTo,
          status: 'ACTIVE',
          notes: assignmentData.notes
        }])
        .select()
        .single();

      if (error) throw error;

      // Update machine status to ASSIGNED
      await supabase
        .from('machines')
        .update({ status: 'ASSIGNED' })
        .eq('id', assignmentData.machineId);

      return new Assignment(data);
    } catch (error) {
      throw new Error(`Failed to create assignment: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          machine:machines(*),
          distributor:distributors(*),
          retailer:retailers(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Assignment(data) : null;
    } catch (error) {
      throw new Error(`Failed to find assignment: ${error.message}`);
    }
  }

  static async findByMachineId(machineId) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          machine:machines(*),
          distributor:distributors(*),
          retailer:retailers(*)
        `)
        .eq('machine_id', machineId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(assignment => new Assignment(assignment));
    } catch (error) {
      throw new Error(`Failed to find assignments: ${error.message}`);
    }
  }

  static async findActiveByMachineId(machineId) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          machine:machines(*),
          distributor:distributors(*),
          retailer:retailers(*)
        `)
        .eq('machine_id', machineId)
        .eq('status', 'ACTIVE')
        .single();

      if (error) throw error;
      return data ? new Assignment(data) : null;
    } catch (error) {
      throw new Error(`Failed to find active assignment: ${error.message}`);
    }
  }

  static async findByDistributorId(distributorId) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          machine:machines(*),
          distributor:distributors(*),
          retailer:retailers(*)
        `)
        .eq('distributor_id', distributorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(assignment => new Assignment(data));
    } catch (error) {
      throw new Error(`Failed to find distributor assignments: ${error.message}`);
    }
  }

  static async findByRetailerId(retailerId) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          machine:machines(*),
          distributor:distributors(*),
          retailer:retailers(*)
        `)
        .eq('retailer_id', retailerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(assignment => new Assignment(data));
    } catch (error) {
      throw new Error(`Failed to find retailer assignments: ${error.message}`);
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = supabase
        .from('assignments')
        .select(`
          *,
          machine:machines(*),
          distributor:distributors(*),
          retailer:retailers(*)
        `);

      if (filters.status) {
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
      if (filters.dateFrom) {
        query = query.gte('assigned_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('assigned_at', filters.dateTo);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(assignment => new Assignment(assignment));
    } catch (error) {
      throw new Error(`Failed to fetch assignments: ${error.message}`);
    }
  }

  async update(updateData) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      return new Assignment(data);
    } catch (error) {
      throw new Error(`Failed to update assignment: ${error.message}`);
    }
  }

  async return() {
    try {
      // Update assignment status to RETURNED
      const { data, error } = await supabase
        .from('assignments')
        .update({
          status: 'RETURNED',
          valid_to: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;

      // Update machine status to AVAILABLE
      await supabase
        .from('machines')
        .update({ status: 'AVAILABLE' })
        .eq('id', this.machineId);

      return new Assignment(data);
    } catch (error) {
      throw new Error(`Failed to return assignment: ${error.message}`);
    }
  }

  static async getAssignmentHistory(machineId) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          machine:machines(*),
          distributor:distributors(*),
          retailer:retailers(*)
        `)
        .eq('machine_id', machineId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(assignment => new Assignment(assignment));
    } catch (error) {
      throw new Error(`Failed to get assignment history: ${error.message}`);
    }
  }
}

module.exports = Assignment; 