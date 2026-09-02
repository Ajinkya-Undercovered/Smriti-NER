// Application Constants & Types
export const SUPPORTED_LANGUAGES = [
  { code: 'as', name: 'অসমীয়া', englishName: 'Assamese', region: 'Assam', voiceCode: 'as-IN' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali', region: 'Tripura / Assam (Barak Valley)', voiceCode: 'bn-IN' },
  { code: 'mni', name: 'ꯃꯩꯇꯩꯂꯣꯟ', englishName: 'Manipuri (Meitei)', region: 'Manipur', voiceCode: 'mni-IN' },
  { code: 'kha', name: 'Khasi', englishName: 'Khasi', region: 'Meghalaya', voiceCode: 'en-IN' },
  { code: 'lus', name: 'Mizo', englishName: 'Mizo', region: 'Mizoram', voiceCode: 'en-IN' },
  { code: 'brx', name: "बर'", englishName: 'Bodo', region: 'Assam (Bodoland)', voiceCode: 'hi-IN' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', region: 'Pan-NER', voiceCode: 'hi-IN' },
  { code: 'en', name: 'English', englishName: 'English', region: 'North East India', voiceCode: 'en-IN' }
];

export const COGNITIVE_DOMAINS = {
  MEMORY: 'memory',
  ATTENTION: 'attention',
  ORIENTATION: 'orientation',
  VISUOSPATIAL: 'visuospatial',
  EXECUTIVE: 'executive',
  MOTOR_RHYTHM: 'motor_rhythm'
};

export const DIFFICULTY_LEVELS = {
  GENTLE: { id: 1, label: 'Gentle (কোমল / শান্ত)', grid: '2x2', pairs: 2, timeBonus: true, hintRate: 0.8 },
  COMFORTABLE: { id: 2, label: 'Comfortable (সুবিধাজনক)', grid: '2x3', pairs: 3, timeBonus: true, hintRate: 0.5 },
  ENGAGING: { id: 3, label: 'Engaging (আনন্দময়)', grid: '3x4', pairs: 6, timeBonus: false, hintRate: 0.2 },
  CHALLENGING: { id: 4, label: 'Challenging (উদ্যমী)', grid: '4x4', pairs: 8, timeBonus: false, hintRate: 0.1 }
};

export const CLINICAL_ALERTS = {
  NORMAL: { level: 'low', label: 'Stable Cognitive State', color: 'emerald' },
  FATIGUE: { level: 'medium', label: 'Cognitive Fatigue Detected - Rest Recommended', color: 'amber' },
  DECLINE_RISK: { level: 'high', label: 'Response Latency Spike (>20%) - Caregiver Notified', color: 'rose' }
};
