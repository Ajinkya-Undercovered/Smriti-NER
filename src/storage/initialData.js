// Initial Culturally Tailored Assets & Clinical Data for North East India
export const NER_CULTURAL_CARDS = [
  {
    id: 'rhino',
    name: 'Kaziranga Rhino (এশিঙীয়া গঁড়)',
    state: 'Assam',
    symbol: '🦏',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'The pride of Assam and Kaziranga National Park'
  },
  {
    id: 'hornbill',
    name: 'Great Hornbill (ধনেশ পক্ষী)',
    state: 'Nagaland / Arunachal',
    symbol: '🦜',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Sacred bird celebrated in the Hornbill festival'
  },
  {
    id: 'muga-silk',
    name: 'Muga Mekhela Chador (মূগা ৰেচম)',
    state: 'Assam',
    symbol: '👘',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'Golden silk woven by traditional Assamese artisans'
  },
  {
    id: 'root-bridge',
    name: 'Living Root Bridge (জিৱন্ত শিপাৰ দলং)',
    state: 'Meghalaya',
    symbol: '🌉',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    description: 'Centuries-old bio-engineering by Khasi and Jaintia tribes'
  },
  {
    id: 'loktak-lake',
    name: 'Loktak Lake & Phumdis (ꯂꯣꯛꯇꯥꯛ ꯄꯥꯠ)',
    state: 'Manipur',
    symbol: '🛶',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    description: 'The iconic freshwater floating lake and Sangai deer habitat'
  },
  {
    id: 'majuli-mask',
    name: 'Majuli Mask Art (মাজুলীৰ মুখাশিল্প)',
    state: 'Assam',
    symbol: '🎭',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Traditional Vaishnavite spiritual mask craft of Majuli island'
  },
  {
    id: 'bamboo-dance',
    name: 'Cheraw Bamboo Dance (Mizo)',
    state: 'Mizoram',
    symbol: '🎋',
    badgeColor: 'bg-lime-100 text-lime-800 border-lime-300',
    description: 'Rhythmic folk dance over coordinated bamboo steps'
  },
  {
    id: 'sikkim-gompa',
    name: 'Rumtek Prayer Wheel (মাংহিম)',
    state: 'Sikkim',
    symbol: '☸️',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Sacred Buddhist prayer wheel symbolizing peace and meditation'
  }
];

export const INITIAL_PATIENT_PROFILE = {
  id: 'patient-ner-001',
  name: 'Bipin Chandra Hazarika',
  regionalName: 'বিপিন চন্দ্ৰ হাজৰিকা',
  age: 72,
  gender: 'Male',
  nativeLanguage: 'as',
  location: 'Tezpur, Sonitpur District, Assam',
  condition: 'Mild Cognitive Impairment (MCI Stage 2)',
  baselineMMSE: 23,
  caregiverName: 'Ananya Hazarika',
  caregiverRelation: 'Daughter (Guwahati)',
  caregiverPhone: '+91 94350 12345',
  ashaWorkerName: 'Pratima Das',
  ashaCentre: 'Tezpur Urban Primary Health Centre (UPHC)',
  ashaPhone: '+91 98640 67890',
  doctorName: 'Dr. Bhupen Sarmah, MD (Neurology, GMCH)',
  emergencyContact: '+91 94350 12345'
};

export const DEFAULT_AUTH_USERS = [
  {
    id: 'bipin72',
    name: 'Bipin Chandra Hazarika',
    regionalName: 'বিপিন চন্দ্ৰ হাজৰিকা',
    role: 'patient',
    passcode: '1234',
    patientId: 'patient-ner-001',
    avatar: '👴',
    location: 'Tezpur, Assam',
    condition: 'Mild Cognitive Impairment (MCI)'
  },
  {
    id: 'ananya_care',
    name: 'Ananya Hazarika',
    regionalName: 'অনন্যা হাজৰিকা',
    role: 'caregiver',
    passcode: '4321',
    patientId: 'patient-ner-001',
    avatar: '👩‍⚕️',
    location: 'Guwahati, Assam',
    condition: 'Primary Family Caregiver (Daughter)'
  },
  {
    id: 'pratima_asha',
    name: 'Pratima Das',
    regionalName: 'প্ৰতিমা দাস',
    role: 'asha_worker',
    passcode: '0000',
    patientId: 'patient-ner-001',
    avatar: '🩺',
    location: 'Tezpur UPHC, Assam',
    condition: 'Assigned ASHA Health Officer'
  }
];

export const INITIAL_FAMILY_ALBUM = [
  {
    id: 'fam-1',
    name: 'Riya (নাতিনী / Granddaughter)',
    relation: 'Granddaughter',
    photoUrl: '👧',
    location: 'Cotton University, Guwahati',
    voiceHint: 'Your granddaughter Riya who studies in Guwahati',
    voiceHintAs: 'আপোনাৰ মৰমৰ নাতিনী ৰিয়া, যি গুৱাহাটীত পঢ়ে'
  },
  {
    id: 'fam-2',
    name: 'Debashish (ল' + "ৰা / Son)",
    relation: 'Son',
    photoUrl: '👨‍💼',
    location: 'Tezpur Tea Estate Engineer',
    voiceHint: 'Your elder son Debashish from Tezpur',
    voiceHintAs: 'আপোনাৰ বৰ ল' + "ৰা দেৱাশীষ"
  },
  {
    id: 'fam-3',
    name: 'Ancestral Tea Bungalow (পুৰণি চাহ বাগিচাৰ ঘৰ)',
    relation: 'Home',
    photoUrl: '🏡',
    location: 'Sonitpur, Assam',
    voiceHint: 'Your peaceful home in Tezpur with garden',
    voiceHintAs: 'তেজপুৰৰ আপোনাৰ আপোন ফুলনি থকা ঘৰখন'
  },
  {
    id: 'fam-4',
    name: 'Sheru (পোহনীয়া কুকুৰ / Pet Dog)',
    relation: 'Pet',
    photoUrl: '🐕',
    location: 'Courtyard Companion',
    voiceHint: 'Your faithful dog Sheru',
    voiceHintAs: 'আপোনাৰ বিশ্বাসী পোহনীয়া কুকুৰ শ্বেৰু'
  }
];

export const INITIAL_MEDICATIONS = [
  {
    id: 'med-1',
    name: 'Donepezil (ডনেপেজিল) - 5mg',
    dosage: '1 Tablet',
    timing: 'morning',
    timeString: '08:30 AM',
    instructions: 'Take after morning warm lal cha & light breakfast',
    taken: false,
    takenAt: null,
    pillIcon: '💊'
  },
  {
    id: 'med-2',
    name: 'Telmisartan BP (টেলমিচাৰ্টান) - 40mg',
    dosage: '1 Tablet',
    timing: 'morning',
    timeString: '09:00 AM',
    instructions: 'Blood pressure control tablet',
    taken: false,
    takenAt: null,
    pillIcon: '🔴'
  },
  {
    id: 'med-3',
    name: 'Ginkgo Biloba Neuro (গিংকো বিলোবা)',
    dosage: '1 Capsule',
    timing: 'afternoon',
    timeString: '01:30 PM',
    instructions: 'Take after traditional lunch',
    taken: false,
    takenAt: null,
    pillIcon: '🌿'
  },
  {
    id: 'med-4',
    name: 'Melatonin Sleep & Neuro Calm (মেলাটনিন) - 3mg',
    dosage: '1 Tablet',
    timing: 'night',
    timeString: '09:30 PM',
    instructions: '30 mins before sleep with warm milk or water',
    taken: false,
    takenAt: null,
    pillIcon: '🌙'
  }
];

export const INITIAL_DAILY_ROUTINES = [
  {
    id: 'seq-1',
    title: 'Morning Warm Lal Cha (ৰাতিপুৱাৰ ৰঙা চাহ)',
    time: '06:30 AM',
    icon: '☕',
    description: 'Sip fresh Assam red tea with ginger while watching sunrise',
    order: 1
  },
  {
    id: 'seq-2',
    title: 'Morning Namghar Prayers (প্ৰাতঃ প্ৰাৰ্থনা / নাম প্ৰসঙ্গ)',
    time: '07:15 AM',
    icon: '🪔',
    description: 'Light diya and peaceful devotional hymn chanting',
    order: 2
  },
  {
    id: 'seq-3',
    title: 'Morning BP & Memory Medicine (ৰাতিপুৱাৰ ঔষধ)',
    time: '08:30 AM',
    icon: '💊',
    description: 'Take morning tablet with water after light snacks',
    order: 3
  },
  {
    id: 'seq-4',
    title: 'Courtyard Garden Stroll (চোতালত খোজ কঢ়া)',
    time: '09:15 AM',
    icon: '🚶‍♂️',
    description: '15-minute gentle walk under morning sunlight near flower pots',
    order: 4
  },
  {
    id: 'seq-5',
    title: 'Healthy Traditional Lunch (দুপৰীয়াৰ আহাৰ)',
    time: '01:00 PM',
    icon: '🍲',
    description: 'Warm rice, seasonal dal, and fresh garden greens (xaak)',
    order: 5
  }
];

export const INITIAL_GAME_SESSIONS = [
  { id: 'sess-1', gameId: 'cultural-memory', timestamp: Date.now() - 86400000 * 3, fluencyScore: 82, averageLatencyMs: 3400, moves: 8, optimalMoves: 6, accuracy: 0.88 },
  { id: 'sess-2', gameId: 'tea-sorter', timestamp: Date.now() - 86400000 * 2, fluencyScore: 78, averageLatencyMs: 4100, moves: 12, optimalMoves: 10, accuracy: 0.83 },
  { id: 'sess-3', gameId: 'daily-routine', timestamp: Date.now() - 86400000 * 1, fluencyScore: 88, averageLatencyMs: 2900, moves: 5, optimalMoves: 5, accuracy: 0.95 },
  { id: 'sess-4', gameId: 'cultural-memory', timestamp: Date.now() - 3600000 * 4, fluencyScore: 85, averageLatencyMs: 3100, moves: 7, optimalMoves: 6, accuracy: 0.90 }
];
