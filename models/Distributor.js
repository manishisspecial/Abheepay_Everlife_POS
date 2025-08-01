const supabase = require('../config/database');

class Distributor {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
    this.city = data.city;
    this.state = data.state;
    this.pincode = data.pincode;
    this.gstNumber = data.gst_number;
    this.panNumber = data.pan_number;
    this.status = data.status; // 'ACTIVE', 'INACTIVE', 'SUSPENDED'
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(distributorData) {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .insert([{
          name: distributorData.name,
          email: distributorData.email,
          phone: distributorData.phone,
          address: distributorData.address,
          city: distributorData.city,
          state: distributorData.state,
          pincode: distributorData.pincode,
          gst_number: distributorData.gstNumber,
          pan_number: distributorData.panNumber,
          status: 'ACTIVE'
        }])
        .select()
        .single();

      if (error) throw error;
      return new Distributor(data);
    } catch (error) {
      throw new Error(`Failed to create distributor: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Distributor(data) : null;
    } catch (error) {
      throw new Error(`Failed to find distributor: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data ? new Distributor(data) : null;
    } catch (error) {
      throw new Error(`Failed to find distributor: ${error.message}`);
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = supabase.from('distributors').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.city) {
        query = query.eq('city', filters.city);
      }
      if (filters.state) {
        query = query.eq('state', filters.state);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(distributor => new Distributor(distributor));
    } catch (error) {
      throw new Error(`Failed to fetch distributors: ${error.message}`);
    }
  }

  async update(updateData) {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      return new Distributor(data);
    } catch (error) {
      throw new Error(`Failed to update distributor: ${error.message}`);
    }
  }

  async delete() {
    try {
      const { error } = await supabase
        .from('distributors')
        .delete()
        .eq('id', this.id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Failed to delete distributor: ${error.message}`);
    }
  }

  async getAssignedMachines() {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          machine:machines(*)
        `)
        .eq('distributor_id', this.id)
        .eq('status', 'ACTIVE');

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to get assigned machines: ${error.message}`);
    }
  }

  async getAssignmentHistory() {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          machine:machines(*),
          retailer:retailers(*)
        `)
        .eq('distributor_id', this.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to get assignment history: ${error.message}`);
    }
  }
}

module.exports = Distributor; 