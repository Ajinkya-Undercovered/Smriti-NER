// Assamese (অসমীয়া) Phonetic Engine & Romanization Dictionary
// Ensures Assamese speech is pronounced naturally in Assamese even on systems with English-only voices!

const CURATED_PHRASES = [
  { match: /মাতৃভাষা অসমীয়াত ধ্বনি সক্ৰিয় হ’ল/i, roman: 'Matribhasha Axomiyat dhwani xokriyo hol' },
  { match: /অসমীয়া আৰু ইংৰাজী দুয়োটা ভাষাত শুনা যাব/i, roman: 'Axomiya aru Ingrazi duyota bhashat xuna jabo' },
  { match: /স্মৃতি-NER লৈ স্বাগতম/i, roman: 'Smriti-NER loi swagatom' },
  { match: /ৰোগীৰ একাউণ্টেৰে লগ ইন কৰক/i, roman: 'Rogir account-ere log in korok' },
  { match: /গৃহ পৰিদৰ্শনৰ তথ্য সংৰক্ষণ কৰা হ’ল/i, roman: 'Griha poridorxonor tothyo xongrokhon kora hol' },
  { match: /নতুন ঔষধ যোগ কৰা হ’ল/i, roman: 'Notun oukhokh zog kora hol' },
  { match: /ডাঃ ভূপেন শৰ্মাৰ সৈতে সংযোগ কৰা হৈছে/i, roman: 'Doctor Bhupen Xormar xoite xongzog kora hoise' },
  { match: /মনোৰঞ্জন আৰু স্মৃতি খেল/i, roman: 'Monoranjan aru smriti khel' },
  { match: /মোৰ ঔষধ আৰু পানীৰ সোঁৱৰণী/i, roman: 'Mor oukhokh aru panir xoworoni' },
  { match: /AI কণ্ঠ সহায়ক/i, roman: 'AI kontho xohayok' },
  { match: /সোণালী স্মৃতি আৰু শান্ত সংগীত/i, roman: 'Xonali smriti aru xanto xongit' },
  { match: /চিকিৎসক আৰু আশা সাহায্য/i, roman: 'Chikitsak aru ASHA xahayyo' },
  { match: /মোৰ অগ্ৰগতি/i, roman: 'Mor ogrogoti' },
  { match: /আজিৰ কামসমূহ/i, roman: 'Ajir kam xomuh' },
  { match: /খেল খেলক বা ঔষধ চাওক/i, roman: 'khel khelok ba oukhokh saok' },
  { match: /আজি আপুনি কি কৰিব বিচাৰে/i, roman: 'aji aponi ki koribo bisare' },
  { match: /শান্তিৰে আছে/i, roman: 'xantire ase' },
  { match: /এশিঙীয়া গঁড়/i, roman: 'Exingiya Gorh' },
  { match: /ধনেশ পক্ষী/i, roman: 'Dhonesh Pokkhi' },
  { match: /মূগা ৰেচম/i, roman: 'Muga Reshom' },
  { match: /জিৱন্ত শিপাৰ দলং/i, roman: 'Jiwonto xipar dolong' },
  { match: /মাজুলীৰ মুখাশিল্প/i, roman: 'Majulir mukha xilpo' },
  { match: /বিহু ঢোল/i, roman: 'Bihu Dhol' },
  { match: /জাপি/i, roman: 'Jaapi' },
  { match: /কপৌ ফুল/i, roman: 'Kopou Phool' },
  { match: /চাহ পাত/i, roman: 'Chah Paat' },
  { match: /নমস্কাৰ/i, roman: 'Nomoskar' },
  { match: /স্বাগতম/i, roman: 'Swagatom' },
  { match: /অসমীয়া/i, roman: 'Axomiya' },
  { match: /অসম/i, roman: 'Assam' }
];

const VOWELS = {
  '\u0985': 'o',
  '\u0986': 'a',
  '\u0987': 'i',
  '\u0988': 'i',
  '\u0989': 'u',
  '\u098A': 'u',
  '\u098B': 'ri',
  '\u098F': 'e',
  '\u0990': 'oi',
  '\u0993': 'o',
  '\u0994': 'ou'
};

const MATRAS = {
  '\u09BE': 'a',
  '\u09BF': 'i',
  '\u09C0': 'i',
  '\u09C1': 'u',
  '\u09C2': 'u',
  '\u09C3': 'ri',
  '\u09C7': 'e',
  '\u09C8': 'oi',
  '\u09CB': 'o',
  '\u09CC': 'ou'
};

const CONSONANTS = {
  '\u0995': 'k',
  '\u0996': 'kh',
  '\u0997': 'g',
  '\u0998': 'gh',
  '\u0999': 'ng',
  '\u099A': 's',
  '\u099B': 's',
  '\u099C': 'z',
  '\u099D': 'jh',
  '\u099E': 'ny',
  '\u099F': 't',
  '\u09A0': 'th',
  '\u09A1': 'd',
  '\u09A2': 'dh',
  '\u09A3': 'n',
  '\u09A4': 't',
  '\u09A5': 'th',
  '\u09A6': 'd',
  '\u09A7': 'dh',
  '\u09A8': 'n',
  '\u09AA': 'p',
  '\u09AB': 'ph',
  '\u09AC': 'b',
  '\u09AD': 'bh',
  '\u09AE': 'm',
  '\u09AF': 'z',
  '\u09F0': 'r',
  '\u09B0': 'r',
  '\u09B2': 'l',
  '\u09F1': 'w',
  '\u09B6': 'x',
  '\u09B7': 'x',
  '\u09B8': 'x',
  '\u09B9': 'h',
  '\u09DC': 'r',
  '\u09DD': 'rh',
  '\u09DF': 'y',
  '\u09CE': 't',
  '\u0982': 'ng',
  '\u0983': 'h',
  '\u0981': 'n'
};

const HALANT = '\u09CD';

export function transliterateAssameseToPhonetic(input) {
  if (!input) return '';
  let text = String(input);

  for (const item of CURATED_PHRASES) {
    text = text.replace(item.match, item.roman);
  }

  if (!/[\u0980-\u09FF]/.test(text)) {
    return text;
  }

  let output = '';
  const len = text.length;

  for (let i = 0; i < len; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (VOWELS[char]) {
      output += VOWELS[char];
    } else if (MATRAS[char]) {
      output += MATRAS[char];
    } else if (CONSONANTS[char]) {
      output += CONSONANTS[char];
      if (next === HALANT) {
        i++;
      } else if (MATRAS[next]) {
      } else if (CONSONANTS[next]) {
        output += 'o';
      } else if (!next || /\s|[.,!?;:'"()–—-]/.test(next)) {
      } else {
        output += 'o';
      }
    } else if (char === HALANT) {
    } else {
      output += char;
    }
  }

  return output.replace(/\s+/g, ' ').trim();
}
