const supabase = require('../config/database');

class Machine {
  constructor(data) {
    this.id = data.id;
    this.serialNumber = data.serial_number;
    this.mid = data.mid;
    this.tid = data.tid;
    this.type = data.machine_type; // 'POS' or 'SOUNDBOX'
    this.model = data.model;
    this.manufacturer = data.manufacturer;
    this.status = data.status; // 'AVAILABLE', 'ASSIGNED', 'MAINTENANCE', 'RETIRED'
    this.qrCode = data.qr_code; // For soundbox QR codes
    this.hasStandee = data.has_standee; // For soundbox standee
    this.purchaseDate = data.purchase_date;
    this.warrantyExpiry = data.warranty_expiry;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(machineData) {
    try {
      const { data, error } = await supabase
        .from('machines')
        .insert([{
          serial_number: machineData.serialNumber,
          mid: machineData.mid,
          tid: machineData.tid,
          machine_type: machineData.type,
          model: machineData.model,
          manufacturer: machineData.manufacturer,
          qr_code: machineData.qrCode,
          has_standee: machineData.hasStandee || false,
          status: 'AVAILABLE'
        }])
        .select()
        .single();

      if (error) throw error;
      return new Machine(data);
    } catch (error) {
      throw new Error(`Failed to create machine: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Machine(data) : null;
    } catch (error) {
      throw new Error(`Failed to find machine: ${error.message}`);
    }
  }

  static async findBySerialNumber(serialNumber) {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('serial_number', serialNumber)
        .single();

      if (error) throw error;
      return data ? new Machine(data) : null;
    } catch (error) {
      throw new Error(`Failed to find machine: ${error.message}`);
    }
  }

  static async findByMidTid(mid, tid) {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('mid', mid)
        .eq('tid', tid)
        .single();

      if (error) throw error;
      return data ? new Machine(data) : null;
    } catch (error) {
      throw new Error(`Failed to find machine: ${error.message}`);
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = supabase.from('machines').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.type) {
        query = query.eq('machine_type', filters.type);
      }
      if (filters.manufacturer) {
        query = query.eq('manufacturer', filters.manufacturer);
      }
      if (filters.search) {
        query = query.or(`serial_number.ilike.%${filters.search}%,mid.ilike.%${filters.search}%,tid.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(machine => new Machine(machine));
    } catch (error) {
      throw new Error(`Failed to fetch machines: ${error.message}`);
    }
  }

  async update(updateData) {
    try {
      const { data, error } = await supabase
        .from('machines')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      return new Machine(data);
    } catch (error) {
      throw new Error(`Failed to update machine: ${error.message}`);
    }
  }

  async delete() {
    try {
      const { error } = await supabase
        .from('machines')
        .delete()
        .eq('id', this.id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Failed to delete machine: ${error.message}`);
    }
  }
}

module.exports = Machine; 