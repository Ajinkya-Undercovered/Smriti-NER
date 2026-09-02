// Types and constants for Smriti-NER
export const SUPPORTED_LANGUAGES = [
  { code: 'as', name: 'অসমীয়া', englishName: 'Assamese', region: 'Assam', voiceCode: 'as-IN' },
  { code: 'bn', name: 'বাংলা', englishName: 'Bengali', region: 'Tripura / Barak Valley', voiceCode: 'bn-IN' },
  { code: 'mni', name: 'ꯃꯩꯇꯩꯂꯣꯟ', englishName: 'Manipuri (Meitei)', region: 'Manipur', voiceCode: 'mni-IN' },
  { code: 'kha', name: 'Khasi', englishName: 'Khasi', region: 'Meghalaya', voiceCode: 'en-IN' },
  { code: 'lus', name: 'Mizo', englishName: 'Mizo', region: 'Mizoram', voiceCode: 'en-IN' },
  { code: 'brx', name: "बर'", englishName: 'Bodo', region: 'Bodoland', voiceCode: 'hi-IN' },
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', region: 'Pan-NER', voiceCode: 'hi-IN' },
  { code: 'en', name: 'English', englishName: 'English', region: 'North East India', voiceCode: 'en-IN' }
];

export const DIFFICULTY_LEVELS = {
  GENTLE: { id: 1, label: 'Gentle (কোমল)', grid: '2x2', pairs: 2 },
  COMFORTABLE: { id: 2, label: 'Comfortable (সুবিধাজনক)', grid: '2x3', pairs: 3 },
  ENGAGING: { id: 3, label: 'Engaging (আনন্দময়)', grid: '3x4', pairs: 6 },
  CHALLENGING: { id: 4, label: 'Challenging (উদ্যমী)', grid: '4x4', pairs: 8 }
};
