const supabase = require('../config/database');

class Retailer {
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
    this.distributorId = data.distributor_id;
    this.status = data.status; // 'ACTIVE', 'INACTIVE', 'SUSPENDED'
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  static async create(retailerData) {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .insert([{
          name: retailerData.name,
          email: retailerData.email,
          phone: retailerData.phone,
          address: retailerData.address,
          city: retailerData.city,
          state: retailerData.state,
          pincode: retailerData.pincode,
          gst_number: retailerData.gstNumber,
          pan_number: retailerData.panNumber,
          distributor_id: retailerData.distributorId,
          status: 'ACTIVE'
        }])
        .select()
        .single();

      if (error) throw error;
      return new Retailer(data);
    } catch (error) {
      throw new Error(`Failed to create retailer: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select(`
          *,
          distributor:distributors(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? new Retailer(data) : null;
    } catch (error) {
      throw new Error(`Failed to find retailer: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select(`
          *,
          distributor:distributors(*)
        `)
        .eq('email', email)
        .single();

      if (error) throw error;
      return data ? new Retailer(data) : null;
    } catch (error) {
      throw new Error(`Failed to find retailer: ${error.message}`);
    }
  }

  static async findByDistributorId(distributorId) {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select(`
          *,
          distributor:distributors(*)
        `)
        .eq('distributor_id', distributorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(retailer => new Retailer(retailer));
    } catch (error) {
      throw new Error(`Failed to find retailers: ${error.message}`);
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = supabase
        .from('retailers')
        .select(`
          *,
          distributor:distributors(*)
        `);

      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.distributorId) {
        query = query.eq('distributor_id', filters.distributorId);
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
      return data.map(retailer => new Retailer(retailer));
    } catch (error) {
      throw new Error(`Failed to fetch retailers: ${error.message}`);
    }
  }

  async update(updateData) {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      return new Retailer(data);
    } catch (error) {
      throw new Error(`Failed to update retailer: ${error.message}`);
    }
  }

  async delete() {
    try {
      const { error } = await supabase
        .from('retailers')
        .delete()
        .eq('id', this.id);

      if (error) throw error;
      return true;
    } catch (error) {
      throw new Error(`Failed to delete retailer: ${error.message}`);
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
        .eq('retailer_id', this.id)
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
          distributor:distributors(*)
        `)
        .eq('retailer_id', this.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to get assignment history: ${error.message}`);
    }
  }

  async getDistributor() {
    try {
      const { data, error } = await supabase
        .from('distributors')
        .select('*')
        .eq('id', this.distributorId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to get distributor: ${error.message}`);
    }
  }
}

module.exports = Retailer; 