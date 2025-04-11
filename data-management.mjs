// data-management.mjs
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sbp_43bb0a72b33f8677c1674ea9bdc3221bb0f19f68.supabase.co';
const supabaseKey = 'sbp_43bb0a72b33f8677c1674ea9bdc3221bb0f19f68';

const supabase = createClient(supabaseUrl, supabaseKey);

class DataManagement {
  async addPatientRecord(patientId, record) {
    const { data, error } = await supabase.from('patient_records').insert([
      { patient_id: patientId, record },
    ]);
    return data;
  }

  async getPatientRecord(patientId) {
    const { data, error } = await supabase
      .from('patient_records')
      .select('*')
      .eq('patient_id', patientId);
    return data;
  }
}

export default DataManagement;
