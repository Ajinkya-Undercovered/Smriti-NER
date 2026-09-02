import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { DEFAULT_AUTH_USERS } from './initialData.js';

export const supabaseService = {
  // 0. User Authentication & Profiles (Dementia-safe remembered sessions)
  async getUsers() {
    if (!isSupabaseConfigured || !supabase) return DEFAULT_AUTH_USERS;
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error || !data || data.length === 0) return DEFAULT_AUTH_USERS;
      return data.map(u => ({
        id: u.id,
        name: u.name,
        regionalName: u.regional_name,
        role: u.role,
        passcode: u.passcode,
        patientId: u.patient_id,
        avatar: u.avatar || '👴',
        location: u.location,
        condition: u.condition || ''
      }));
    } catch (e) {
      console.warn('Supabase fetch users fallback to default:', e.message);
      return DEFAULT_AUTH_USERS;
    }
  },

  async authenticateUser(userId, passcode) {
    const users = await this.getUsers();
    const user = users.find(u => u.id === userId && String(u.passcode) === String(passcode));
    return user || null;
  },

  // 1. Patient Profile
  async getPatient(patientId = 'patient-ner-001') {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase fetch patient error:', e.message);
      return null;
    }
  },

  async savePatient(patient) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('patients')
        .upsert({
          id: patient.id || 'patient-ner-001',
          name: patient.name,
          regional_name: patient.regionalName,
          age: patient.age,
          gender: patient.gender,
          location: patient.location,
          condition: patient.condition,
          baseline_mmse: patient.baselineMMSE,
          caregiver_name: patient.caregiverName,
          caregiver_relation: patient.caregiverRelation,
          caregiver_phone: patient.caregiverPhone,
          asha_worker_name: patient.ashaWorkerName,
          asha_centre: patient.ashaCentre,
          asha_phone: patient.ashaPhone,
          doctor_name: patient.doctorName,
          updated_at: new Date().toISOString()
        });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase save patient error:', e.message);
      return null;
    }
  },

  // 2. Game Sessions & Clinical Cognitive Logs
  async getGameSessions(patientId = 'patient-ner-001') {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: true });
      if (error) throw error;
      return data.map(d => ({
        id: d.id,
        gameId: d.game_id,
        fluencyScore: d.fluency_score,
        averageLatencyMs: d.average_latency_ms,
        moves: d.moves,
        optimalMoves: d.optimal_moves,
        accuracy: d.accuracy,
        durationSec: d.duration_sec,
        timestamp: new Date(d.timestamp).getTime()
      }));
    } catch (e) {
      console.warn('Supabase fetch sessions error:', e.message);
      return null;
    }
  },

  async saveGameSession(session, patientId = 'patient-ner-001') {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          patient_id: patientId,
          game_id: session.gameId,
          fluency_score: session.fluencyScore,
          average_latency_ms: session.averageLatencyMs,
          moves: session.moves,
          optimal_moves: session.optimalMoves,
          accuracy: session.accuracy,
          duration_sec: session.durationSec || 60,
          timestamp: new Date(session.timestamp || Date.now()).toISOString()
        });
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn('Supabase save session error:', e.message);
      return null;
    }
  },

  // 3. Medications
  async getMedications(patientId = 'patient-ner-001') {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('patient_id', patientId);
      if (error) throw error;
      return data.map(m => ({
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        timing: m.timing,
        timeString: m.time_string,
        instructions: m.instructions,
        taken: m.taken,
        takenAt: m.taken_at,
        pillIcon: m.pill_icon || '💊'
      }));
    } catch (e) {
      console.warn('Supabase fetch medications error:', e.message);
      return null;
    }
  },

  async saveMedications(medications, patientId = 'patient-ner-001') {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const records = medications.map(m => ({
        id: m.id,
        patient_id: patientId,
        name: m.name,
        dosage: m.dosage || '1 Dose',
        timing: m.timing,
        time_string: m.timeString,
        instructions: m.instructions,
        taken: m.taken,
        taken_at: m.takenAt,
        pill_icon: m.pillIcon
      }));
      const { error } = await supabase.from('medications').upsert(records);
      if (error) throw error;
    } catch (e) {
      console.warn('Supabase save medications error:', e.message);
    }
  },

  // 4. Family Album
  async getFamilyAlbum(patientId = 'patient-ner-001') {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('family_album')
        .select('*')
        .eq('patient_id', patientId);
      if (error) throw error;
      return data.map(f => ({
        id: f.id,
        name: f.name,
        relation: f.relation,
        photoUrl: f.photo_url,
        location: f.location,
        voiceHint: f.voice_hint,
        voiceHintAs: f.voice_hint_as
      }));
    } catch (e) {
      console.warn('Supabase fetch family error:', e.message);
      return null;
    }
  },

  async saveFamilyMember(member, patientId = 'patient-ner-001') {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { error } = await supabase.from('family_album').upsert({
        id: member.id,
        patient_id: patientId,
        name: member.name,
        relation: member.relation,
        photo_url: member.photoUrl,
        location: member.location,
        voice_hint: member.voiceHint,
        voice_hint_as: member.voiceHintAs
      });
      if (error) throw error;
    } catch (e) {
      console.warn('Supabase save family member error:', e.message);
    }
  },

  async deleteFamilyMember(memberId) {
    if (!isSupabaseConfigured || !supabase) return null;
    try {
      const { error } = await supabase.from('family_album').delete().eq('id', memberId);
      if (error) throw error;
    } catch (e) {
      console.warn('Supabase delete family error:', e.message);
    }
  }
};
