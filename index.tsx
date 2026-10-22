import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Share2, Check, Volume2, Square } from 'lucide-react';

// --- Types & Constants ---
interface Question {
  id: number;
  section: 'section1' | 'section2';
  category: string;
  text: { en: string; mr: string };
  options: {
    text: { en: string; mr: string };
    scores: { vata: number; pitta: number; kapha: number };
  }[];
}

interface AyurvedicAnalysis {
  dosha: string;
  summary: string;
  detailed_explanation: string;
  traits: string[];
  risks: string[];
  advice: string[];
  foods_to_avoid: string[];
  precautions: string[];
  suggestions_tips: string[];
  exercises_yoga: string[];
  causes_reasons: string[];
  risk_percentage: number;
  scores: { vata: number; pitta: number; kapha: number };
}

const QUESTIONS: Question[] = [
  {
    id: 1, section: 'section1', category: 'Activities',
    text: { en: "How do you do your activities?", mr: "तुम्ही तुमची कामे कशी करता?" },
    options: [
      { text: { en: "With a lot of initiative, very quickly", mr: "खूप पुढाकार घेऊन, अतिशय वेगाने" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "With medium initiative or speed", mr: "मध्यम पुढाकार किंवा वेगाने" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slowly and steadily", mr: "हळूहळू आणि स्थिरपणे" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 2, section: 'section1', category: 'Excitement',
    text: { en: "How do you become excited?", mr: "तुम्ही किती लवकर उत्तेजित होता?" },
    options: [
      { text: { en: "Very quickly", mr: "अतिशय वेगाने" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Quickly", mr: "वेगाने" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slowly", mr: "हळूहळू" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 3, section: 'section1', category: 'Learning',
    text: { en: "Receptive power (How quickly do you learn new things)?", mr: "तुमची ग्रहण शक्ती कशी आहे (नवीन गोष्टी शिकणे)?" },
    options: [
      { text: { en: "Very quick assimilation", mr: "अतिशय लवकर समजते" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Quick assimilation", mr: "लवकर समजते" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slow assimilation", mr: "हळूहळू समजते" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 4, section: 'section1', category: 'Memory',
    text: { en: "How is your memory?", mr: "तुमची स्मरणशक्ती कशी आहे?" },
    options: [
      { text: { en: "Short memory", mr: "अल्पकालीन स्मरणशक्ती" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Medium / Very sharp memory", mr: "मध्यम / अतिशय तीक्ष्ण स्मरणशक्ती" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Long memory", mr: "दीर्घकालीन स्मरणशक्ती" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 5, section: 'section1', category: 'Speech',
    text: { en: "How do you talk?", mr: "तुम्ही कसे बोलता?" },
    options: [
      { text: { en: "Fast, missing some letters or words", mr: "जलद, काही अक्षरे किंवा शब्द गाळणे" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Fast but sharp and clear cut", mr: "जलद पण स्पष्ट आणि तीक्ष्ण" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slow, clear and sweet", mr: "हळूवार, स्पष्ट आणि मधुर" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 6, section: 'section1', category: 'Gait',
    text: { en: "How do you walk?", mr: "तुम्ही कसे चालता?" },
    options: [
      { text: { en: "Very fast, light movement", mr: "अतिशय जलद, हलकी हालचाल" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Medium movement but sharp", mr: "मध्यम वेग पण निश्चयी" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Slow, pressing the foot on the ground", mr: "हळूवार, पाय घट्ट टेकवून" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 7, section: 'section1', category: 'Hunger',
    text: { en: "How is your hunger?", mr: "तुमची भूक कशी आहे?" },
    options: [
      { text: { en: "Irregular (Sometimes yes, sometimes no)", mr: "अनियमित (कधी लागते, कधी नाही)" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Sharp (Cannot skip, need food first then work)", mr: "तीव्र (टाळू शकत नाही, आधी जेवण मग काम)" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Low (Can skip meals easily)", mr: "मंद (सहज जेवण टाळू शकतो)" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 8, section: 'section1', category: 'Taste',
    text: { en: "Which group of tastes do you like more?", mr: "तुम्हाला कोणत्या चवी जास्त आवडतात?" },
    options: [
      { text: { en: "Sweet, Sour, Salty", mr: "गोड, आंबट, खारट" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Sweet, Bitter, Astringent", mr: "गोड, कडू, तुरट" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Pungent, Bitter, Astringent", mr: "तिखट, कडू, तुरट" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 9, section: 'section1', category: 'Cravings',
    text: { en: "Do you crave warm or cold food?", mr: "तुम्हाला गरम की थंड अन्न आवडते?" },
    options: [
      { text: { en: "Yes, warm food", mr: "हो, गरम अन्न आवडते" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "No, I crave cold food", mr: "नाही, थंड अन्न आवडते" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Warm and dry", mr: "गरम आणि कोरडे अन्न" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 10, section: 'section1', category: 'Sweat',
    text: { en: "How much do you perspire (sweat)?", mr: "तुम्हाला घाम किती येतो?" },
    options: [
      { text: { en: "Scanty", mr: "कमी / अत्यल्प" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Abundant, sometimes with odor", mr: "भरपूर, कधीकधी वासासह" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Very little", mr: "अतिशय कमी" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 11, section: 'section1', category: 'Sleep',
    text: { en: "How is your sleep?", mr: "तुमची झोप कशी आहे?" },
    options: [
      { text: { en: "Scanty, interrupted (~6 hours)", mr: "कमी, मध्येच मोडणारी (~६ तास)" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Little but sound (6-8 hours)", mr: "कमी पण शांत (६-८ तास)" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Abundant, heavy (>8 hours)", mr: "भरपूर, गाढ (८ तासांपेक्षा जास्त)" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 12, section: 'section1', category: 'Dreams',
    text: { en: "What is the theme of your dreams?", mr: "तुम्हाला स्वप्न कशा प्रकारचे पडतात?" },
    options: [
      { text: { en: "Flying, jumping, fear, mountains", mr: "उडणे, उड्या मारणे, भीती, डोंगर" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Anger, fire, wars, struggle", mr: "राग, अग्नी, युद्ध, संघर्ष" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Water, lakes, birds, romance", mr: "पाणी, तलाव, पक्षी, प्रेम" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 13, section: 'section2', category: 'Body Frame',
    text: { en: "How is your body frame?", mr: "तुमची शरीराची ठेवण कशी आहे?" },
    options: [
      { text: { en: "Lean, long or short", mr: "कृश (पातळ), उंच किंवा ठेंगणे" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Medium size", mr: "मध्यम" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Large, plump, fleshy", mr: "मोठी, मांसल आणि पुष्ट" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 14, section: 'section2', category: 'Skin Moistness',
    text: { en: "How is your skin moistness?", mr: "तुमची त्वचा किती तेलकट आहे?" },
    options: [
      { text: { en: "Dry", mr: "कोरडी" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Slightly unctuous (Oily)", mr: "किंचित तेलकट" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Unctuous (Oily and smooth)", mr: "तेलकट आणि मऊ" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 15, section: 'section2', category: 'Complexion',
    text: { en: "Your skin complexion?", mr: "तुमचा रंग (त्वचा) कसा आहे?" },
    options: [
      { text: { en: "Dark, blackish", mr: "सावळा, काळपट" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Fair, reddish, copper type", mr: "गोरा, लालसर, तांबूस छटा" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "White, bright", mr: "पांढरट, तेजस्वी" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  },
  {
    id: 16, section: 'section2', category: 'Hair',
    text: { en: "Your hair (head)?", mr: "तुमचे केस कसे आहेत?" },
    options: [
      { text: { en: "Scanty, rough", mr: "विरळ, खडबडीत" }, scores: { vata: 3, pitta: 0, kapha: 0 } },
      { text: { en: "Soft, graying tendency, baldness", mr: "मऊ, अकाली पांढरे होणे किंवा गळणे" }, scores: { vata: 0, pitta: 3, kapha: 0 } },
      { text: { en: "Plentiful, thick, wavy, glossy", mr: "दाट, जाड, कुरळे, चमकदार" }, scores: { vata: 0, pitta: 0, kapha: 3 } }
    ]
  }
];

const TRANSLATIONS: Record<string, any> = {
  en: {
    title: 'PRAKRITI', subtitle: 'YOUR AYURVEDIC BLUEPRINT', desc: 'Prakriti is your foundational psycho-physiological profile, determining your physical traits, mental inclinations, and health predispositions.',
    start: 'BEGIN JOURNEY', previous: 'Back', next: 'Next', finish: 'See Analysis', loading: 'Analyzing your clinical profile...', results: 'Your Prakriti Analysis', primary: 'Primary Constitution',
    breakdown: 'Dosha Breakdown', traits: 'Key Characteristics', risks: 'Potential Imbalances', advice: 'Wellness Recommendations', insight: 'Holistic Insight', listen: 'Listen to Analysis', stop: 'Stop Audio', restart: 'START OVER', section1: 'Behavior & Physiology', section2: 'Physical Examination', error: 'Analysis could not be generated. Please retry.',
    share: 'Share Result', copied: 'Copied!',
    loginTitle: 'Sign In', loginDesc: 'Enter your credentials to access the Prakriti blueprint portal.',
    demoCreds: 'Demo Credentials', username: 'Username', password: 'Password', signInBtn: 'Sign In',
    profileTitle: 'Your Demographic Details', profileDesc: 'Enter your basic measurements to customize your Ayurvedic recommendations.',
    fullName: 'Full Name', height: 'Height (cm)', age: 'Age (years)', gender: 'Gender', selectGender: 'Select Gender',
    male: 'Male', female: 'Female', other: 'Other', pnotSay: 'Prefer not to say', saveProfile: 'Continue',
    retestBannerTitle: '1-Month Progress Tracking', retestBannerDesc: 'Have you followed your Ayurvedic blueprint for 1 month? Simulate a retest to generate a comparative progress graph and see how your doshas have balanced!',
    retestBtn: 'Simulate 1-Month Retest', retestActive: 'Taking Retest', comparisonTitle: '1-Month Clinical Progress', comparisonSub: 'Comparison of your baseline constitution versus 1-month retest result.',
    baselineLabel: 'Baseline', retestLabel: '1-Month Retest', balanceTrend: 'Balance Trend', closerToBalance: 'Optimal Balance',
    tabSummary: 'Summary', tabFoods: 'Avoid Foods', tabPrecautions: 'Precautions', tabSuggestions: 'Tips', tabYoga: 'Yoga & Exercise', tabCauses: 'Causes',
    riskGaugeTitle: 'Constitutional Health Risk', riskLow: 'Low Risk', riskMedium: 'Moderate Risk', riskHigh: 'High Risk',
    riskDesc: 'Calculated risk of developing dosha-specific structural or metabolic imbalances based on current profile and habits.'
  },
  mr: {
    title: 'प्रकृती', subtitle: 'तुमची आयुर्वेदिक ब्लूप्रिंट', desc: 'प्रकृती हे तुमचे मूळ मानस-शारीरिक व्यक्तिमत्व आहे, जे तुमचे शारीरिक गुणधर्म आणि आरोग्याची स्थिती ठरवते.',
    start: 'सुरू करा', previous: 'मागे', next: 'पुढील', finish: 'निकाल पहा', loading: 'तुमच्या प्रकृतीचे विश्लेषण करत आहे...', results: 'तुमचे प्रकृती विश्लेषण', primary: 'मुख्य प्रकृती',
    breakdown: 'दोषांचे विश्लेषण', traits: 'मुख्य वैशिष्ट्ये', risks: 'संभाव्य धोके', advice: 'आरोग्य शिफारसी', insight: 'सखोल माहिती', listen: 'विश्लेषण ऐका', stop: 'ऑडिओ थांबवा', restart: 'पुन्हा सुरू करा', section1: 'व्यवहार आणि शारीरिक क्रिया', section2: 'शारीरिक परीक्षण', error: 'विश्लेषण अयशस्वी झाले. कृपया पुन्हा प्रयत्न करा.',
    share: 'निकाल शेअर करा', copied: 'कॉपी केले!',
    loginTitle: 'लॉग इन करा', loginDesc: 'प्रकृती ब्लूप्रिंट पोर्टलमध्ये प्रवेश करण्यासाठी तुमची माहिती प्रविष्ट करा.',
    demoCreds: 'डेमो क्रेडेंशियल्स', username: 'वापरकर्ता नाव', password: 'पासवर्ड', signInBtn: 'प्रवेश करा',
    profileTitle: 'तुमची वैयक्तिक माहिती', profileDesc: 'तुमच्या आयुर्वेदिक शिफारसी सानुकूलित करण्यासाठी तुमची मोजमापे प्रविष्ट करा.',
    fullName: 'पूर्ण नाव', height: 'उंची (सेमी)', age: 'वय (वर्षे)', gender: 'लिंग', selectGender: 'लिंग निवडा',
    male: 'पुरुष', female: 'स्त्री', other: 'इतर', pnotSay: 'सांगू इच्छित नाही', saveProfile: 'पुढे जा',
    retestBannerTitle: '१-महिन्याचा प्रगती अहवाल', retestBannerDesc: 'तुमची १ महिना तुमच्या आयुर्वेदिक शिफारसी दिनचर्या पाळली आहे का? प्रगतीचा आलेख पाहण्यासाठी चाचणीची पुनरावृत्ती करा!',
    retestBtn: '१-महिन्याची पुनरावृत्ती चाचणी', retestActive: 'पुनरावृत्ती चाचणी सुरू', comparisonTitle: '१-महिन्याची क्लिनिकल प्रगती', comparisonSub: 'तुमच्या सुरुवातीच्या प्रकृतीची १-महिन्याच्या पुनरावृत्ती निकालाशी तुलना.',
    baselineLabel: 'सुरुवातीची चाचणी', retestLabel: '१-महिन्यानंतरची चाचणी', balanceTrend: 'प्रगती दिशा', closerToBalance: 'उत्कृष्ट संतुलन',
    tabSummary: 'थोडक्यात माहिती', tabFoods: 'वर्ज्य अन्न', tabPrecautions: 'दक्षता/सावधानता', tabSuggestions: 'टीप आणि सल्ले', tabYoga: 'योग आणि व्यायाम', tabCauses: 'कारणे',
    riskGaugeTitle: 'आरोग्य धोका मूल्यांकन', riskLow: 'कमी धोका', riskMedium: 'मध्यम धोका', riskHigh: 'उच्च धोका',
    riskDesc: 'तुमच्या वैयक्तिक प्रोफाइल, वय आणि दोषांच्या आधारे उद्भवू शकणाऱ्या संभाव्य विकारांचे मोजमाप.'
  }
};

const LOADING_MESSAGES = {
  en: ["Calibrating Vata-Pitta ratios...", "Assessing physiological tendencies...", "Synthesizing Ayurvedic insights...", "Mapping your biological blueprint..."],
  mr: ["वात-पित्त प्रमाणाचे मोजमाप करत आहे...", "शारीरिक प्रवृत्तींचे मूल्यांकन करत आहे...", "आयुर्वेदिक माहितीचे विश्लेषण करत आहे...", "तुमचा जैविक नकाशा तयार करत आहे..."]
};

// --- Classical Rule-Based Ayurvedic Engine (100% Client-Side, No External Server/AI Needed) ---
function computePrakritiAnalysis(
  scores: { vata: number; pitta: number; kapha: number },
  lang: 'en' | 'mr',
  profile: { name: string; height: number; age: number; gender: string } | null
): AyurvedicAnalysis {
  const { vata, pitta, kapha } = scores;
  const total = Math.max(1, vata + pitta + kapha);
  const pVata = Math.round((vata / total) * 100);
  const pPitta = Math.round((pitta / total) * 100);
  const pKapha = Math.round((kapha / total) * 100);

  const maxScore = Math.max(pVata, pPitta, pKapha);
  const minScore = Math.min(pVata, pPitta, pKapha);
  const age = profile?.age || 28;
  const gender = profile?.gender || 'not specified';

  // Determine constitution type
  let type = 'vata';
  let isDual = false;
  let isTridosha = false;
  let doshaTitle = '';

  if (maxScore - minScore <= 8) {
    isTridosha = true;
    doshaTitle = lang === 'en' ? 'Sama Prakriti (Tridoshic)' : 'सम प्रकृती (त्रिदोषज)';
  } else {
    const sorted = [
      { name: 'vata', score: pVata, en: 'Vata', mr: 'वात' },
      { name: 'pitta', score: pPitta, en: 'Pitta', mr: 'पित्त' },
      { name: 'kapha', score: pKapha, en: 'Kapha', mr: 'कफ' }
    ].sort((a, b) => b.score - a.score);

    if (sorted[0].score - sorted[1].score <= 7) {
      isDual = true;
      type = `${sorted[0].name}_${sorted[1].name}`;
      doshaTitle = lang === 'en' 
        ? `${sorted[0].en}-${sorted[1].en} Constitution` 
        : `${sorted[0].mr}-${sorted[1].mr} प्रकृती`;
    } else {
      type = sorted[0].name;
      doshaTitle = lang === 'en' 
        ? `${sorted[0].en} Dominant Constitution` 
        : `${sorted[0].mr} प्रधान प्रकृती`;
    }
  }

  // Calculate Health Risk percentage based on dosha variance from 33.3% and age factor
  const imbalanceDeviation = Math.abs(pVata - 33.3) + Math.abs(pPitta - 33.3) + Math.abs(pKapha - 33.3);
  let baseRisk = Math.round(18 + (imbalanceDeviation * 0.65));
  if (age > 45) baseRisk += 8;
  if (age > 60) baseRisk += 8;
  const risk_percentage = Math.min(85, Math.max(12, baseRisk));

  // Age and gender specific yoga recommendations generator
  const getExercises = () => {
    const isSenior = age >= 50;
    const isYouth = age < 30;

    if (lang === 'en') {
      if (type.includes('vata')) {
        return [
          isSenior ? "Gentle Tadasana (Mountain Pose) with wall support" : "Vrikshasana (Tree Pose) for nervous system grounding",
          "Pawanmuktasana (Wind-Relieving Pose) for digestive ease",
          "Setu Bandhasana (Supported Bridge Pose) for calming anxiety",
          isYouth ? "Moderate 20-min rhythmic Surya Namaskar" : "Slow restorative walking in serene nature (15-20 mins)",
          "Nadi Shodhana (Alternate Nostril Pranayama) - 10 minutes before bed"
        ];
      } else if (type.includes('pitta')) {
        return [
          "Sheetali & Sheetkari Pranayama for internal cooling",
          "Chandra Namaskar (Moon Salutation) performed at dusk",
          "Bhujangasana (Gentle Cobra Pose) to release abdominal heat",
          "Matsyasana (Fish Pose) for thyroid and cardiovascular opening",
          isSenior ? "Brisk morning walk in cool, fresh air" : "Swimming or moderate cycling in shaded environments"
        ];
      } else {
        return [
          isYouth ? "Vigorous Surya Namaskar (Sun Salutations - 12 rounds)" : "Moderate Sun Salutations (4-6 gentle rounds)",
          "Dhanurasana (Bow Pose) to stimulate sluggish digestion",
          "Virabhadrasana I & II (Warrior Poses) to build stamina",
          "Kapalabhati Pranayama (Shining Skull breath) to clear lethargy",
          "Daily 30-min brisk aerobic walking or uphill hiking"
        ];
      }
    } else {
      if (type.includes('vata')) {
        return [
          isSenior ? "भिंतीच्या आधाराने ताडासन (संतुलनासाठी)" : "वृक्षासन (एकाग्रता आणि मज्जासंस्थेच्या संतुलनासाठी)",
          "पवनमुक्तासन (पचनाच्या तक्रारी व वायू दूर करण्यासाठी)",
          "सेतुबंधासन (मानसिक तणाव कमी करण्यासाठी)",
          isYouth ? "मंद गतीने सूर्यनमस्कार (६ ते ८ आवर्तने)" : "सकाळी शांत वातावरणात मंद चालणे (१५-२० मिनिटे)",
          "नाडी शोधन प्राणायाम (१० मिनिटे झोपण्यापूर्वी)"
        ];
      } else if (type.includes('pitta')) {
        return [
          "शीतली आणि शीतकारी प्राणायाम (शरीरातील उष्णता कमी करण्यासाठी)",
          "चंद्र नमस्कार (संध्याकाळी थंड वातावरणात करणे)",
          "भुजंगासन (पोटातील अतिरिक्त पित्त शांत करण्यासाठी)",
          "मत्स्यासन (छाती आणि हृदयाच्या आरोग्यासाठी)",
          isSenior ? "सकाळी थंड हवेत चालणे" : "पोहणे किंवा हलका सायकल चालवण्याचा व्यायाम"
        ];
      } else {
        return [
          isYouth ? "उत्साही सूर्यनमस्कार (१० ते १२ आवर्तने)" : "मध्यम गतीचे सूर्यनमस्कार (४ ते ६ आवर्तने)",
          "धनुरासन (सुस्त पचनक्रिया सुधारण्यासाठी)",
          "वीरभद्रासन (शरीरातील ऊर्जा आणि ताकद वाढवण्यासाठी)",
          "कपालभाती प्राणायाम (कफ आणि आळस घालवण्यासाठी)",
          "दररोज ३० मिनिटे जलद गतीने चालणे"
        ];
      }
    }
  };

  // Compile full diagnosis content
  if (lang === 'mr') {
    if (isTridosha) {
      return {
        dosha: doshaTitle,
        summary: `अभिनंदन! तुमच्या शरीरात वात, पित्त आणि कफ हे तिन्ही जैविक घटक समप्रमाणात आहेत. ही एक आदर्श आणि दुर्मीळ प्रकृती मानली जाते, ज्यामुळे तुम्हाला उत्तम प्रतिकारशक्ती आणि मानसिक स्थैर्य लाभते.`,
        detailed_explanation: `त्रिदोष समतोल असल्याने तुमची पचनसंस्था (जठराग्नी) संतुलित आहे. ऋतुमानानुसार नियमित जीवनशैली ठेवल्यास तुमचे आरोग्य दीर्घायुषी राहील. शरीरातील वायू, उष्णता आणि स्निग्धता यांचा योग्य समतोल टिकवणे हे तुमचे मुख्य उद्दिष्ट असावे.`,
        traits: ['उत्कृष्ट प्रतिकारशक्ती', 'स्थिर आणि समतोल मन', 'समतोल पचनक्रिया', 'उत्तम झोप व ताजेतवानेपणा'],
        risks: ['ऋतुबदलाच्या वेळी होणारे तात्पुरते असंतुलन', 'अतिउत्साहामुळे होणारा थकवा', 'आहारातील अनियमितता'],
        advice: ['ऋतूनुसार पथ्य पाळा (ऋतुचर्या)', 'वेळेवर जेवण आणि पुरेशी झोप घ्या', 'नियमित हलका व्यायाम करा'],
        foods_to_avoid: ['अतिप्रमाणात शिळे अन्न', 'अतिशय तिखट किंवा अतिशय तेलकट पदार्थ', 'प्रक्रिया केलेले पॅकबंद अन्न'],
        precautions: ['हवामानातील अचानक बदलांपासून संरक्षण करा', 'जेवणाच्या वेळा वारंवार बदलू नका', 'तणावापासून दूर राहा'],
        suggestions_tips: ['दिवसातून पुरेसे कोमट पाणी प्या', 'ऋतूनुसार स्थानिक फळे आणि ताज्या भाज्या खा', 'ध्यानधारणा व योगासने करा'],
        exercises_yoga: getExercises(),
        causes_reasons: ['निसर्गनियमांचे पालन न करणे', 'अवेळी झोपणे किंवा जागरण करणे', 'असंतुलित आहार घेणे'],
        risk_percentage,
        scores
      };
    }

    if (type.includes('vata') && !type.includes('pitta') && !type.includes('kapha')) {
      return {
        dosha: doshaTitle,
        summary: `तुमच्या प्रकृतीमध्ये वात दोषाचे (वायू आणि आकाश तत्व) प्रमाण जास्त आहे. तुम्ही स्वभावाने उत्साही, कल्पक आणि जलद निर्णय घेणारे आहात, परंतु अवेळी थकवा आणि चिंता जाणवू शकते.`,
        detailed_explanation: `वात दोषाचे मूळ गुणधर्म कोरडेपणा, हलकेपणा, शीतता आणि चंचलता हे आहेत. यामुळे तुमची पचनक्रिया अनियमित असू शकते, त्वचा कोरडी पडू शकते आणि सांध्यांमध्ये हलके आवाज येऊ शकतात. शरीराला उबदारपणा आणि पोषण देणारे अन्न तुम्हाला निरोगी ठेवेल.`,
        traits: ['अतिशय चपळ आणि कल्पक बुद्धी', 'नवीन गोष्टी पटकन शिकण्याची क्षमता', 'सडपातळ शरीरयष्टी', 'उत्कट कार्यक्षमता'],
        risks: ['मानसिक ताण व चिंता', 'त्वचेचा कोरडेपणा आणि बद्धकोष्ठता', 'सांधेदुखी आणि अनिद्रा', 'अचानक थकवा जाणवणे'],
        advice: ['नेहमी गरम व ताजे अन्न खा', 'तिळाच्या तेलाने अंगाला हलकी मालिश (अभ्यंग) करा', 'नियमित वेळी झोपण्याची सवय ठेवा'],
        foods_to_avoid: ['थंड पेये आणि फ्रीजमधील पाणी', 'कच्च्या भाज्यांचे कोशिंबीर जास्त खाणे', 'सुक्या मेव्याचे कोरडे सेवन', 'कडधान्यांचा अतिवापर'],
        precautions: ['थंड वाऱ्यापासून कान आणि डोके झाका', 'जेवण कधीही वगळू नका', 'रात्री उशिरापर्यंत मोबाईल किंवा टीव्ही पाहणे टाळा'],
        suggestions_tips: ['रात्री झोपताना चिमूटभर जायफळ टाकून कोमट दूध प्या', 'जेवणात गाईचे साजूक तूप वापरा', 'भरपूर पाणी आणि सूप प्या'],
        exercises_yoga: getExercises(),
        causes_reasons: ['अनियमित जीवनशैली व जागरण', 'कोरड्या व थंड पदार्थांचे अतिसेवन', 'जास्त प्रवास व सततचा मानसिक ताण'],
        risk_percentage,
        scores
      };
    }

    if (type.includes('pitta')) {
      return {
        dosha: doshaTitle,
        summary: `तुमच्या प्रकृतीत पित्त दोषाचे (अग्नी आणि जल तत्व) आधिक्य आहे. तुम्ही तीक्ष्ण बुद्धिमत्ता, नेतृत्वगुण आणि उत्कृष्ट पचनशक्ती असलेले व्यक्ती आहात, मात्र उष्णतेचे विकार लवकर होऊ शकतात.`,
        detailed_explanation: `पित्ताचे गुणधर्म उष्ण, तीक्ष्ण, हलके आणि थोडे तेलकट असतात. यामुळे तुम्हाला भूक चांगली लागते, घाम जास्त येतो आणि शरीराचे तापमान थोडे उबदार असते. मानसिक पातळीवर राग किंवा चिडचिड लवकर होऊ शकते, म्हणून शरीराला व मनाला शांत ठेवणे आवश्यक आहे.`,
        traits: ['तीक्ष्ण बुद्धी आणि एकाग्रता', 'उत्कृष्ट नेतृत्व क्षमता', 'बलवान पचनक्रिया', 'उत्साही आणि ध्येयवादी दृष्टिकोन'],
        risks: ['अॅसिडिटी आणि छातीत जळजळ', 'अंगावर पुरळ किंवा त्वचेचे लालसर विकार', 'अति घाम आणि डोकेदुखी', 'अकाली केस पांढरे होणे'],
        advice: ['थंड आणि गोड प्रवृत्तीचा आहार घ्या', 'उन्हात जास्त फिरणे टाळा', 'नारळ पाणी आणि ताक नियमित प्या'],
        foods_to_avoid: ['अति तिखट, मसालेदार व तळलेले पदार्थ', 'आंबट फळे, व्हिनेगर आणि लोणचे', 'अति प्रमाणात चहा, कॉफी आणि मद्य', 'गरम मसाले'],
        precautions: ['दुपारच्या कडक उन्हात बाहेर पडणे टाळा', 'उपाशी पोटी जास्त वेळ राहू नका', 'राग आणि मानसिक ताण नियंत्रणात ठेवा'],
        suggestions_tips: ['जेवणानंतर जिरे किंवा बडीशेपचे पाणी प्या', 'आहारात काकडी, टरबूज आणि पुदिना वापरा', 'चंदनाचा किंवा गुलाबाचा अत्तर वापरा'],
        exercises_yoga: getExercises(),
        causes_reasons: ['अति तिखट व मसालेदार पदार्थांचे सेवन', 'कडक उन्हात जास्त काम करणे', 'अतिविचार, राग आणि कामाचा अतिरिक्त ताण'],
        risk_percentage,
        scores
      };
    }

    // Default to Kapha or dual with Kapha
    return {
      dosha: doshaTitle,
      summary: `तुमच्या प्रकृतीमध्ये कफ दोषाचे (पृथ्वी आणि जल तत्व) प्राबल्य आहे. तुमची शरीरयष्टी मजबूत, स्वभाव शांत, सहनशील आणि प्रेमळ आहे. मात्र शरीरात आळस आणि कफ साचण्याची प्रवृत्ती असते.`,
      detailed_explanation: `कफाचे मूलभूत गुणधर्म जड, थंड, मऊ, तेलकट आणि स्थिर असतात. तुमची पचनक्रिया मंद असते आणि वजन लवकर वाढू शकते. प्रतिकारशक्ती उत्तम असली तरी नियमित व्यायाम न केल्यास आळस, सर्दी आणि दम्याचा त्रास होऊ शकतो. शरीराला सक्रिय ठेवणे गरजेचे आहे.`,
      traits: ['मजबूत आणि कणखर शरीरयष्टी', 'शांत, संयमी आणि दयाळू स्वभाव', 'उत्कृष्ट दीर्घकालीन स्मरणशक्ती', 'उच्च रोगप्रतिकारशक्ती'],
      risks: ['वजन वाढणे व लठ्ठपणा', 'छातीत कफ साचणे आणि सर्दी', 'दिवसा झोपेची प्रवृत्ती आणि सुस्ती', 'कोलेस्टेरॉल व मधुमेह'],
      advice: ['दररोज सकाळी न चुकता व्यायाम करा', 'हलके, गरम आणि सुके अन्न खा', 'दुपारी झोपणे पूर्णपणे टाळा'],
      foods_to_avoid: ['गोड, तेलकट व तुपकट पदार्थ', 'थंड दूध, आईस्क्रीम आणि चीज', 'मैद्याचे पदार्थ व जड मिठाया', 'केळी आणि सीताफळ अतिप्रमाणात'],
      precautions: ['दुपारी कधीही झोपू नका', 'थंड आणि दमट वातावरणात जास्त वेळ राहू नका', 'उपाशी न राहता हलका आहार वेळेवर घ्या'],
      suggestions_tips: ['सकाळी कोमट पाण्यात थोडे मध आणि सुंठ पावडर घालून प्या', 'आहारात लसूण, आले आणि काळी मिरी वापरा', 'नियमित गरम पाण्याचे वाफारे घ्या'],
      exercises_yoga: getExercises(),
      causes_reasons: ['शारीरिक हालचालींचा अभाव व बैठे काम', 'गोड व तेलकट पदार्थांचे अतिसेवन', 'दुपारी झोपण्याची सवय आणि अतिप्रमाणात थंड पाणी'],
      risk_percentage,
      scores
    };
  }

  // English Fallback
  if (isTridosha) {
    return {
      dosha: doshaTitle,
      summary: `Outstanding! Your system exhibits a rare, balanced equilibrium among Vata, Pitta, and Kapha. This classical state confers robust natural immunity, emotional calm, and enduring vitality.`,
      detailed_explanation: `With your tridoshic forces evenly proportioned, your metabolic fire (Agni) functions consistently. Your cellular tissues remain harmonized without extreme swings toward dryness, acidity, or fluid retention. Your primary health goal is seasonal preservation.`,
      traits: ['Resilient immune equilibrium', 'Balanced digestion & steady appetite', 'Emotional poise and adaptability', 'Sound restorative sleep cycles'],
      risks: ['Vulnerability during seasonal shifts', 'Overconfidence leading to irregular habits', 'Occasional digestive sluggishness if routine breaks'],
      advice: ['Observe seasonal dietary adjustments (Ritucharya)', 'Maintain regular eating and resting hours', 'Engage in moderate, non-exhausting exercise'],
      foods_to_avoid: ['Heavily processed or reheated meals', 'Excessively pungent, sour, or frozen foods', 'Stale left-overs and artificial sodas'],
      precautions: ['Protect yourself against sudden atmospheric chills', 'Avoid skipping nutritious meals', 'Maintain regular sleep intervals'],
      suggestions_tips: ['Sip warm water through the day to assist Agni', 'Incorporate fresh seasonal vegetables and fruits', 'Practice light daily mindfulness and breathing'],
      exercises_yoga: getExercises(),
      causes_reasons: ['Irregular seasonal habits', 'Excessive workload without downtime', 'Disregarding natural biological urges'],
      risk_percentage,
      scores
    };
  }

  if (type.includes('vata') && !type.includes('pitta') && !type.includes('kapha')) {
    return {
      dosha: doshaTitle,
      summary: `Your constitution is governed predominantly by Vata (Air and Ether elements). You possess a vibrant, quick-thinking, and imaginative nature, but are prone to sudden fatigue, anxiety, and digestive irregularities.`,
      detailed_explanation: `Vata represents dryness, lightness, coldness, and mobility. Physiologically, this manifests as variable hunger, dry skin, sensitive joints, and a restless nervous system. Warmth, nourishing healthy fats, and a steady daily routine serve as your primary medicine.`,
      traits: ['Rapid creative thinking and agility', 'Enthusiastic and adaptable mindset', 'Slender, naturally light physique', 'Energetic bursts of productivity'],
      risks: ['Nervous tension, anxiety, and overthinking', 'Chronic skin dryness and constipation', 'Joint stiffness and cold extremities', 'Interrupted or restless sleep patterns'],
      advice: ['Favor warm, freshly cooked, grounding foods', 'Apply warm sesame oil to your feet and joints before bed', 'Maintain a disciplined, calming bedtime routine'],
      foods_to_avoid: ['Raw cold salads and iced beverages', 'Dry snacks like popcorn and crackers', 'Excessive beans and cabbage without carminative spices', 'Caffeinated energy drinks'],
      precautions: ['Protect your ears, head, and throat from cold winds', 'Never skip breakfast or lunch', 'Avoid multitasking under high-pressure deadlines'],
      suggestions_tips: ['Drink warm milk with a pinch of nutmeg and cardamom at bedtime', 'Add pure A2 cow ghee to your warm meals', 'Stay hydrated with warm cumin-coriander herbal teas'],
      exercises_yoga: getExercises(),
      causes_reasons: ['Irregular meal times and late nights', 'Consuming cold, dry, or light foods in excess', 'Over-stimulation from digital screens and travel'],
      risk_percentage,
      scores
    };
  }

  if (type.includes('pitta')) {
    return {
      dosha: doshaTitle,
      summary: `Your constitution is dominated by Pitta (Fire and Water elements). You are characterized by razor-sharp intellect, dynamic leadership, and strong metabolism, though prone to internal heat and irritability.`,
      detailed_explanation: `Pitta governs transformation, digestion, and body temperature. Its primary attributes are hot, sharp, light, and slightly oily. You likely experience intense hunger, high perspiration, and red-toned skin. Cultivating cooling practices and emotional patience preserves your vitality.`,
      traits: ['Sharp analytical intellect and drive', 'Strong digestion and reliable energy', 'Natural decisiveness and leadership', 'Warm complexion and expressive presence'],
      risks: ['Acid reflux, heartburn, and ulcers', 'Inflammatory skin flare-ups and rashes', 'Premature graying or thinning hair', 'Irritability and impatience under stress'],
      advice: ['Choose cooling, naturally sweet, and bitter foods', 'Avoid working during midday sun peaks', 'Hydrate regularly with coconut water and fresh mint teas'],
      foods_to_avoid: ['Extremely spicy chili, hot peppers, and vinegar', 'Deep-fried salty foods and fermented cheeses', 'Excessive black coffee and alcohol', 'Overly sour citrus fruits'],
      precautions: ['Avoid prolonged exposure to intense heat and sun', 'Do not postpone meals when hungry', 'Steer clear of heated arguments when hungry or tired'],
      suggestions_tips: ['Enjoy fresh pomegranate, sweet melons, and cucumber salads', 'Cook with cooling ghee or coconut oil', 'Practice evening moon walks in cool environments'],
      exercises_yoga: getExercises(),
      causes_reasons: ['Over-consumption of spicy, pungent, and salty foods', 'Excessive competitiveness and chronic emotional anger', 'Working under direct heat or skipping meals'],
      risk_percentage,
      scores
    };
  }

  // Kapha Dominant or Dual with Kapha
  return {
    dosha: doshaTitle,
    summary: `Your constitution is grounded by Kapha (Earth and Water elements). You embody natural physical strength, calm patience, emotional loyalty, and high endurance, though you have a tendency toward stagnation.`,
    detailed_explanation: `Kapha embodies heaviness, coldness, softness, and stability. While it confers deep resilience and smooth tissues, its imbalance creates sluggish metabolism, lethargy, fluid retention, and weight gain. Invigorating physical movement and warm spices are essential to maintain lightness.`,
    traits: ['Robust stamina and steady physical frame', 'Calm, patient, and grounded disposition', 'Deep, restorative sleep and strong memory', 'Natural physical resilience and smooth skin'],
    risks: ['Weight gain and slow metabolic rate', 'Respiratory congestion and morning phlegm', 'Daytime drowsiness and lack of motivation', 'Water retention and sluggish lymphatic flow'],
    advice: ['Engage in vigorous morning exercise every day', 'Eat light, warm, and freshly spiced foods', 'Completely eliminate daytime naps'],
    foods_to_avoid: ['Heavy oily sweets, deep-fried snacks, and pastries', 'Chilled dairy, ice cream, and thick creamy cheeses', 'Excessive wheat, red meat, and processed sugars', 'Cold carbonated sweet drinks'],
    precautions: ['Avoid sleeping immediately after meals', 'Do not stay in damp, cold environments for prolonged periods', 'Avoid sedentary routines; take walking breaks every hour'],
    suggestions_tips: ['Drink warm water with ginger and raw honey in the morning', 'Use black pepper, ginger, and turmeric liberally in cooking', 'Practice dry brushing (Garshana) to stimulate lymphatic flow'],
    exercises_yoga: getExercises(),
    causes_reasons: ['Sedentary lifestyle and lack of active cardio', 'Overeating heavy, sweet, and oily foods', 'Sleeping during the day and in damp climates'],
    risk_percentage,
    scores
  };
}

// --- Visual Components ---

const DoshaChart = React.memo(({ scores }: { scores: any }) => {
  const vata = scores?.vata || 0;
  const pitta = scores?.pitta || 0;
  const kapha = scores?.kapha || 0;
  const total = Math.max(1, vata + pitta + kapha);
  
  return (
    <div className="dosha-chart">
      {[
        { name: 'Vata', val: vata },
        { name: 'Pitta', val: pitta },
        { name: 'Kapha', val: kapha }
      ].map(d => {
        const percent = Math.round((d.val / total) * 100);
        return (
          <div key={d.name} className="chart-column">
            <div className="bar-container"><div className="bar" style={{ height: `${percent}%` }} /></div>
            <span className="chart-label">{d.name} {percent}%</span>
          </div>
        );
      })}
    </div>
  );
});

const ProgressGraph = React.memo(({ baseline, retest, lang }: { baseline: any; retest: any; lang: 'en' | 'mr' }) => {
  if (!baseline || !retest) return null;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const totalBaseline = Math.max(1, baseline.vata + baseline.pitta + baseline.kapha);
  const totalRetest = Math.max(1, retest.vata + retest.pitta + retest.kapha);

  const baselineVata = Math.round((baseline.vata / totalBaseline) * 100);
  const baselinePitta = Math.round((baseline.pitta / totalBaseline) * 100);
  const baselineKapha = Math.round((baseline.kapha / totalBaseline) * 100);

  const retestVata = Math.round((retest.vata / totalRetest) * 100);
  const retestPitta = Math.round((retest.pitta / totalRetest) * 100);
  const retestKapha = Math.round((retest.kapha / totalRetest) * 100);

  const getTrend = (basePercent: number, retestPercent: number) => {
    const diff = Math.abs(basePercent - 33.3) - Math.abs(retestPercent - 33.3);
    if (diff > 1) return { text: lang === 'en' ? 'Stabilizing (+ Balanced)' : 'संतुलनाकडे (+ सुधारणा)', color: '#2d5a27' };
    return { text: lang === 'en' ? 'Maintained Equilibrium' : 'स्थिर समतोल', color: '#666' };
  };

  return (
    <div className="progress-graph-card">
      <div className="progress-graph-header">
        <h4>📊 {t.comparisonTitle}</h4>
        <p>{t.comparisonSub}</p>
      </div>

      <div className="comparison-bars-grid">
        {[
          { name: 'Vata', base: baselineVata, next: retestVata, color: '#3a7bd5' },
          { name: 'Pitta', base: baselinePitta, next: retestPitta, color: '#f5af19' },
          { name: 'Kapha', base: baselineKapha, next: retestKapha, color: '#38ef7d' }
        ].map(item => {
          const trend = getTrend(item.base, item.next);
          return (
            <div key={item.name} className="comparison-item">
              <div className="comparison-item-header">
                <strong>{item.name}</strong>
                <span style={{ fontSize: '0.8rem', color: trend.color, fontWeight: 600 }}>{trend.text}</span>
              </div>
              <div className="comparison-dual-bars">
                <div className="bar-subgroup">
                  <span className="bar-sublabel">{t.baselineLabel}: {item.base}%</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${item.base}%`, background: '#888' }} />
                  </div>
                </div>
                <div className="bar-subgroup">
                  <span className="bar-sublabel">{t.retestLabel}: {item.next}%</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${item.next}%`, background: item.color }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const RiskGauge = React.memo(({ percentage, lang }: { percentage: number; lang: 'en' | 'mr' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  let riskLevel = t.riskLow;
  let strokeColor = '#2d5a27';
  let badgeBg = 'rgba(45, 90, 39, 0.12)';

  if (percentage >= 60) {
    riskLevel = t.riskHigh;
    strokeColor = '#c94c4c';
    badgeBg = 'rgba(201, 76, 76, 0.12)';
  } else if (percentage >= 35) {
    riskLevel = t.riskMedium;
    strokeColor = '#d48806';
    badgeBg = 'rgba(212, 136, 6, 0.12)';
  }

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="risk-gauge-card">
      <div className="gauge-svg-container">
        <svg width="140" height="140" viewBox="0 0 140 140" className="gauge-svg">
          <circle cx="70" cy="70" r={radius} className="gauge-track" />
          <circle 
            cx="70" 
            cy="70" 
            r={radius} 
            className="gauge-progress"
            style={{ 
              strokeDasharray: circumference, 
              strokeDashoffset: offset,
              stroke: strokeColor 
            }} 
          />
        </svg>
        <div className="gauge-score-text">
          <span className="gauge-number" style={{ color: strokeColor }}>{percentage}%</span>
          <span className="gauge-label">{lang === 'en' ? 'Risk Index' : 'धोका निर्देशांक'}</span>
        </div>
      </div>
      <div className="gauge-info">
        <h4 className="gauge-title">{t.riskGaugeTitle}</h4>
        <p className="gauge-desc">{t.riskDesc}</p>
        <div className="gauge-status-badge" style={{ backgroundColor: badgeBg, color: strokeColor }}>
          {riskLevel}
        </div>
      </div>
    </div>
  );
});

// --- App Component ---
const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('prakriti_auth') === 'true' || sessionStorage.getItem('prakriti_auth') === 'true';
  });

  const [profile, setProfile] = useState<{ name: string; height: number; age: number; gender: string } | null>(() => {
    const saved = localStorage.getItem('prakriti_profile') || sessionStorage.getItem('prakriti_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [step, setStep] = useState<'login' | 'profile' | 'intro' | 'quiz' | 'loading' | 'results'>(() => {
    const authed = localStorage.getItem('prakriti_auth') === 'true' || sessionStorage.getItem('prakriti_auth') === 'true';
    if (!authed) return 'login';
    const savedProfile = localStorage.getItem('prakriti_profile') || sessionStorage.getItem('prakriti_profile');
    if (!savedProfile) return 'profile';
    return 'intro';
  });

  const [isTempSave, setIsTempSave] = useState<boolean>(() => {
    return sessionStorage.getItem('prakriti_temp_save') === 'true';
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [lang, setLang] = useState<'en' | 'mr'>('en');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | undefined)[]>(Array(QUESTIONS.length).fill(undefined));
  const [analysis, setAnalysis] = useState<AyurvedicAnalysis | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [copiedState, setCopiedState] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('summary');

  const [baselineScores, setBaselineScores] = useState<{ vata: number; pitta: number; kapha: number } | null>(() => {
    const saved = localStorage.getItem('prakriti_baseline_scores') || sessionStorage.getItem('prakriti_baseline_scores');
    return saved ? JSON.parse(saved) : null;
  });
  const [retestScores, setRetestScores] = useState<{ vata: number; pitta: number; kapha: number } | null>(() => {
    const saved = localStorage.getItem('prakriti_retest_scores') || sessionStorage.getItem('prakriti_retest_scores');
    return saved ? JSON.parse(saved) : null;
  });

  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.en, [lang]);

  // Handle Login Authentication
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim();

    if (u === 'user1@gmail.com' && p === '123456') {
      if (isTempSave) {
        sessionStorage.setItem('prakriti_auth', 'true');
        sessionStorage.setItem('prakriti_temp_save', 'true');
        localStorage.removeItem('prakriti_auth');
      } else {
        localStorage.setItem('prakriti_auth', 'true');
        localStorage.removeItem('prakriti_temp_save');
        sessionStorage.removeItem('prakriti_auth');
      }
      setIsAuthenticated(true);
      setLoginError('');

      const savedProfile = localStorage.getItem('prakriti_profile') || sessionStorage.getItem('prakriti_profile');
      if (savedProfile) {
        setStep('intro');
      } else {
        setStep('profile');
      }
    } else {
      setLoginError(lang === 'en' ? 'Invalid credentials. Please click Demo Credentials to view.' : 'अवैध वापरकर्ता नाव किंवा पासवर्ड. कृपया डेमो क्रेडेंशियल्स तपासा.');
    }
  };

  // Handle Profile Submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameVal = (document.getElementById('profile-name') as HTMLInputElement)?.value || '';
    const ageVal = parseInt((document.getElementById('profile-age') as HTMLInputElement)?.value || '0');
    const heightVal = parseInt((document.getElementById('profile-height') as HTMLInputElement)?.value || '0');
    const genderVal = (document.getElementById('profile-gender') as HTMLSelectElement)?.value || '';
    const isTempChecked = (document.getElementById('profile-temp-save') as HTMLInputElement)?.checked || false;

    if (!nameVal.trim()) {
      alert(lang === 'en' ? 'Please enter your name.' : 'कृपया तुमचे नाव प्रविष्ट करा.');
      return;
    }
    if (!ageVal || ageVal <= 0 || ageVal > 120) {
      alert(lang === 'en' ? 'Please enter a valid age between 1 and 120.' : 'कृपया योग्य वय प्रविष्ट करा.');
      return;
    }
    if (!heightVal || heightVal <= 50 || heightVal > 250) {
      alert(lang === 'en' ? 'Please enter a valid height in cm.' : 'कृपया योग्य उंची (सेमी) प्रविष्ट करा.');
      return;
    }
    if (!genderVal) {
      alert(lang === 'en' ? 'Please select your gender.' : 'कृपया तुमचे लिंग निवडा.');
      return;
    }

    const newProfile = { name: nameVal, height: heightVal, age: ageVal, gender: genderVal };
    
    if (isTempChecked) {
      sessionStorage.setItem('prakriti_profile', JSON.stringify(newProfile));
      sessionStorage.setItem('prakriti_temp_save', 'true');
      sessionStorage.setItem('prakriti_auth', 'true');
      localStorage.removeItem('prakriti_auth');
      localStorage.removeItem('prakriti_profile');
      localStorage.removeItem('prakriti_baseline_scores');
      localStorage.removeItem('prakriti_retest_scores');
      setIsTempSave(true);
    } else {
      localStorage.setItem('prakriti_profile', JSON.stringify(newProfile));
      localStorage.setItem('prakriti_auth', 'true');
      sessionStorage.removeItem('prakriti_auth');
      sessionStorage.removeItem('prakriti_profile');
      sessionStorage.removeItem('prakriti_baseline_scores');
      sessionStorage.removeItem('prakriti_retest_scores');
      sessionStorage.removeItem('prakriti_temp_save');
      setIsTempSave(false);
    }

    setProfile(newProfile);
    setStep('intro');
  };

  const handleLogout = () => {
    localStorage.removeItem('prakriti_auth');
    localStorage.removeItem('prakriti_profile');
    localStorage.removeItem('prakriti_baseline_scores');
    localStorage.removeItem('prakriti_retest_scores');
    sessionStorage.removeItem('prakriti_auth');
    sessionStorage.removeItem('prakriti_profile');
    sessionStorage.removeItem('prakriti_baseline_scores');
    sessionStorage.removeItem('prakriti_retest_scores');
    sessionStorage.removeItem('prakriti_temp_save');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsAuthenticated(false);
    setProfile(null);
    setBaselineScores(null);
    setRetestScores(null);
    setUsername('');
    setPassword('');
    setAnswers(Array(QUESTIONS.length).fill(undefined));
    setCurrentIdx(0);
    setIsTempSave(false);
    setStep('login');
  };

  const handleSimulateRetest = () => {
    if (!baselineScores) return;

    const total = baselineScores.vata + baselineScores.pitta + baselineScores.kapha;
    const balancedAvg = total / 3;

    const simulated = {
      vata: Math.max(1, Math.round(baselineScores.vata + (balancedAvg - baselineScores.vata) * 0.35)),
      pitta: Math.max(1, Math.round(baselineScores.pitta + (balancedAvg - baselineScores.pitta) * 0.35)),
      kapha: Math.max(1, Math.round(baselineScores.kapha + (balancedAvg - baselineScores.kapha) * 0.35)),
    };

    if (isTempSave) {
      sessionStorage.setItem('prakriti_retest_scores', JSON.stringify(simulated));
    } else {
      localStorage.setItem('prakriti_retest_scores', JSON.stringify(simulated));
    }
    setRetestScores(simulated);
    setActiveTab('summary');
  };

  // Instant Client-Side Diagnostic Calculation (Zero External API / Database Dependency)
  const generateAnalysis = useCallback((currentAnswers: (number | undefined)[]) => {
    setStep('loading');
    const scores = { vata: 0, pitta: 0, kapha: 0 };
    currentAnswers.forEach((val, i) => {
      if (val !== undefined && QUESTIONS[i]) {
        const opt = QUESTIONS[i].options[val].scores;
        scores.vata += opt.vata;
        scores.pitta += opt.pitta;
        scores.kapha += opt.kapha;
      }
    });

    // Provide a brief, polished transition before revealing the full diagnostic blueprint
    setTimeout(() => {
      const result = computePrakritiAnalysis(scores, lang, profile);
      setAnalysis(result);

      if (isTempSave) {
        sessionStorage.setItem('prakriti_baseline_scores', JSON.stringify(scores));
      } else {
        localStorage.setItem('prakriti_baseline_scores', JSON.stringify(scores));
      }
      setBaselineScores(scores);
      setStep('results');
    }, 700);
  }, [lang, profile, isTempSave]);

  // Re-generate current analysis when language is changed
  useEffect(() => {
    if (step === 'results' && baselineScores) {
      const updated = computePrakritiAnalysis(baselineScores, lang, profile);
      setAnalysis(updated);
    }
  }, [lang, step, baselineScores, profile]);

  const handleSelect = useCallback((optionIdx: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    let latestAnswers: (number | undefined)[] = [];
    
    setAnswers(prev => {
      const next = [...prev];
      next[currentIdx] = optionIdx;
      latestAnswers = next;
      return next;
    });

    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(prev => Math.min(prev + 1, QUESTIONS.length - 1));
        setIsTransitioning(false);
      } else {
        generateAnalysis(latestAnswers);
        setIsTransitioning(false);
      }
    }, 280); 
  }, [currentIdx, generateAnalysis, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    if (currentIdx > 0) setCurrentIdx(prev => prev - 1);
    else setStep('intro');
  }, [currentIdx, isTransitioning]);

  useEffect(() => {
    if (step !== 'quiz') return;
    const handleKey = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === '1') handleSelect(0);
      else if (e.key === '2') handleSelect(1);
      else if (e.key === '3') handleSelect(2);
      else if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step, handleSelect, handlePrev, isTransitioning]);

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }
  };

  const handleShare = () => {
    if (!analysis) return;

    const vata = analysis.scores?.vata || 0;
    const pitta = analysis.scores?.pitta || 0;
    const kapha = analysis.scores?.kapha || 0;
    const total = Math.max(1, vata + pitta + kapha);
    const vataPercent = Math.round((vata / total) * 100);
    const pittaPercent = Math.round((pitta / total) * 100);
    const kaphaPercent = Math.round((kapha / total) * 100);

    const mainHeader = lang === 'en' ? '🌿 My Ayurvedic Prakriti Profile' : '🌿 माझी आयुर्वेदिक प्रकृती';
    const doshaLabel = lang === 'en' ? 'Primary Constitution' : 'मुख्य प्रकृती';
    const breakdownLabel = lang === 'en' ? 'Dosha Breakdown' : 'दोषांचे विश्लेषण';
    const summaryLabel = lang === 'en' ? 'Holistic Summary' : 'सखोल मार्गदर्शक';

    const shareText = `${mainHeader}
User: ${profile?.name || 'Ayurveda Seeker'} (${profile?.gender || ''}, ${profile?.age || ''} yrs)

✨ ${doshaLabel}: ${analysis.dosha}

📊 ${breakdownLabel}:
- Vata: ${vataPercent}%
- Pitta: ${pittaPercent}%
- Kapha: ${kaphaPercent}%

📝 ${summaryLabel}:
${analysis.summary}

Explore your own Ayurvedic blueprint at ${window.location.origin}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          setCopiedState(true);
          setTimeout(() => setCopiedState(false), 2000);
        })
        .catch(() => fallbackCopy(shareText));
    } else {
      fallbackCopy(shareText);
    }
  };

  // Browser Client-Side Speech Synthesis (Works 100% offline, zero server or AI dependencies)
  const playTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert(lang === 'en' ? 'Speech synthesis is not supported on this device/browser.' : 'तुमच्या ब्राउझरमध्ये ऑडिओ सुविधा उपलब्ध नाही.');
      return;
    }

    if (isAudioPlaying) {
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
      return;
    }

    if (!analysis) return;

    window.speechSynthesis.cancel();
    const spokenText = `${analysis.dosha}. ${analysis.summary}. ${analysis.detailed_explanation}`;
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = lang === 'mr' ? 'mr-IN' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsAudioPlaying(false);
    utterance.onerror = () => setIsAudioPlaying(false);

    setIsAudioPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="app-container">
      {/* Top Header & Language Toggle */}
      <div className="language-selector-fixed">
        <button className={`lang-pill ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>English</button>
        <button className={`lang-pill ${lang === 'mr' ? 'active' : ''}`} onClick={() => setLang('mr')}>मराठी</button>
      </div>

      <header>
        <div className="logo">
          <h1>{t.title}</h1>
          <span className="subtitle">{t.subtitle}</span>
        </div>

        {isAuthenticated && profile && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-light)' }}>
            <span>👤 <strong>{profile.name}</strong> ({profile.age}y, {profile.gender})</span>
            {isTempSave && <span style={{ background: '#e2e8f0', padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem' }}>Session</span>}
            <button 
              onClick={handleLogout} 
              style={{ background: 'transparent', border: 'none', color: '#c94c4c', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.8rem', padding: '0 0.2rem' }}
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Step: Login */}
        {step === 'login' && (
          <div className="auth-card section-lift-in">
            <h2 className="form-title">{t.loginTitle}</h2>
            <p className="form-subtitle">{t.loginDesc}</p>

            <details className="demo-credentials-box" style={{ marginBottom: '1.5rem', cursor: 'pointer' }}>
              <summary className="demo-credentials-title" style={{ fontWeight: 600, outline: 'none', userSelect: 'none' }}>🔑 {t.demoCreds} (Click to view)</summary>
              <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.4' }}>
                <p><strong>{t.username}:</strong> <code>user1@gmail.com</code></p>
                <p><strong>{t.password}:</strong> <code>123456</code></p>
              </div>
            </details>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="input-label" htmlFor="username">{t.username}</label>
                <input 
                  type="text" 
                  id="username" 
                  className="input-field" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  placeholder="e.g. user1@gmail.com"
                />
              </div>

              <div className="form-group">
                <label className="input-label" htmlFor="password">{t.password}</label>
                <input 
                  type="password" 
                  id="password" 
                  className="input-field" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••"
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="login-temp-save" 
                  checked={isTempSave}
                  onChange={(e) => setIsTempSave(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="login-temp-save" style={{ fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none', color: '#666' }}>
                  {lang === 'en' ? 'Save temporarily (Session only, clears on tab close)' : 'तात्पुरते जतन करा (फक्त या सत्रासाठी, टॅब बंद केल्यावर हटवले जाईल)'}
                </label>
              </div>

              {loginError && <p className="auth-error">{loginError}</p>}

              <button type="submit" className="form-submit-btn">{t.signInBtn}</button>
            </form>
          </div>
        )}

        {/* Step: Profile Demographics */}
        {step === 'profile' && (
          <div className="auth-card section-lift-in">
            <h2 className="form-title">{t.profileTitle}</h2>
            <p className="form-subtitle">{t.profileDesc}</p>

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="input-label" htmlFor="profile-name">{t.fullName}</label>
                <input 
                  type="text" 
                  id="profile-name" 
                  className="input-field" 
                  defaultValue={profile?.name || ''} 
                  required 
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="input-label" htmlFor="profile-age">{t.age}</label>
                  <input 
                    type="number" 
                    id="profile-age" 
                    className="input-field" 
                    defaultValue={profile?.age || 26} 
                    min="1" 
                    max="120" 
                    required 
                  />
                </div>

                <div className="form-group" style={{ flex: 1 }}>
                  <label className="input-label" htmlFor="profile-height">{t.height}</label>
                  <input 
                    type="number" 
                    id="profile-height" 
                    className="input-field" 
                    defaultValue={profile?.height || 168} 
                    min="50" 
                    max="250" 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="input-label" htmlFor="profile-gender">{t.gender}</label>
                <select 
                  id="profile-gender" 
                  className="input-field" 
                  defaultValue={profile?.gender || 'Female'} 
                  required
                >
                  <option value="" disabled>{t.selectGender}</option>
                  <option value="Female">{t.female}</option>
                  <option value="Male">{t.male}</option>
                  <option value="Other">{t.other}</option>
                  <option value="Prefer not to say">{t.pnotSay}</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <input 
                  type="checkbox" 
                  id="profile-temp-save" 
                  defaultChecked={isTempSave}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="profile-temp-save" style={{ fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none', color: '#666' }}>
                  {lang === 'en' ? 'Save temporarily (Session only, clears on tab close)' : 'तात्पुरते जतन करा (फक्त या सत्रासाठी, टॅब बंद केल्यावर हटवले जाईल)'}
                </label>
              </div>

              <button type="submit" className="form-submit-btn">{t.saveProfile}</button>
            </form>
          </div>
        )}

        {/* Step: Intro */}
        {step === 'intro' && (
          <div className="intro-section section-lift-in" key="intro">
            <div className="dosha-indicators">
              <div className="dosha-item vata-bg">Vata</div>
              <div className="dosha-item pitta-bg">Pitta</div>
              <div className="dosha-item kapha-bg">Kapha</div>
            </div>
            <p className="intro-description">{t.desc}</p>
            <button id="start-button" onClick={() => setStep('quiz')}>{t.start}</button>
          </div>
        )}

        {/* Step: Quiz */}
        {step === 'quiz' && (
          <div className="quiz-container section-lift-in" key={`quiz-step`}>
            {QUESTIONS[currentIdx] ? (
              <div className="question-slide-in" key={`q-container-${currentIdx}`}>
                <div className="progress-bar-container"><div className="progress-bar-filler" style={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }} /></div>
                <div className="question-container">
                  <button className="back-action-btn" onClick={handlePrev} disabled={isTransitioning}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    {t.previous}
                  </button>
                  
                  <div className="question-meta">
                    <span className="section-name">{t[QUESTIONS[currentIdx].section]}</span>
                    <span className="idx-info">{currentIdx + 1} / {QUESTIONS.length}</span>
                  </div>
                  <h2 className="question-text">{QUESTIONS[currentIdx].text[lang]}</h2>
                  <div className="options-list">
                    {QUESTIONS[currentIdx].options.map((opt, i) => (
                      <button 
                        key={i} 
                        className={`option-button ${answers[currentIdx] === i ? 'selected' : ''} ${isTransitioning ? 'transitioning' : ''}`} 
                        onClick={() => handleSelect(i)}
                        disabled={isTransitioning}
                      >
                        <span className="opt-key">{i+1}</span> 
                        <span className="opt-text">{opt.text[lang]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Step: Loading */}
        {step === 'loading' && (
          <div className="loading-indicator section-lift-in" key="loading">
            <div className="loading-animation">
              <span className="loading-icon vata">💨</span>
              <span className="loading-icon pitta">🔥</span>
              <span className="loading-icon kapha">💧</span>
            </div>
            <p className="loading-text" key={loadingMsgIdx}>{LOADING_MESSAGES[lang][loadingMsgIdx]}</p>
          </div>
        )}

        {/* Step: Results */}
        {step === 'results' && analysis && (
          <div className="results-container section-lift-in" key="results">
            
            {/* Tabs Navigation */}
            <div className="tabs-navigation">
              <button onClick={() => setActiveTab('summary')} className={`tab-trigger-btn ${activeTab === 'summary' ? 'active' : ''}`}>{t.tabSummary}</button>
              <button onClick={() => setActiveTab('foods')} className={`tab-trigger-btn ${activeTab === 'foods' ? 'active' : ''}`}>{t.tabFoods}</button>
              <button onClick={() => setActiveTab('precautions')} className={`tab-trigger-btn ${activeTab === 'precautions' ? 'active' : ''}`}>{t.tabPrecautions}</button>
              <button onClick={() => setActiveTab('tips')} className={`tab-trigger-btn ${activeTab === 'tips' ? 'active' : ''}`}>{t.tabSuggestions}</button>
              <button onClick={() => setActiveTab('yoga')} className={`tab-trigger-btn ${activeTab === 'yoga' ? 'active' : ''}`}>{t.tabYoga}</button>
              <button onClick={() => setActiveTab('causes')} className={`tab-trigger-btn ${activeTab === 'causes' ? 'active' : ''}`}>{t.tabCauses}</button>
            </div>

            {/* TAB: Summary */}
            {activeTab === 'summary' && (
              <div className="tab-content-box" style={{ animation: 'sectionLiftIn 0.4s ease' }}>
                <div className={`dominant-dosha-card ${(analysis.dosha || '').toLowerCase().includes('vata') ? 'vata' : (analysis.dosha || '').toLowerCase().includes('pitta') ? 'pitta' : 'kapha'}`}>
                  <h2>{t.primary}</h2>
                  <p className="dosha-name">{analysis.dosha || 'Analysis Complete'}</p>
                  <p className="summary-text">{analysis.summary || ''}</p>
                  <DoshaChart scores={analysis.scores} />
                </div>

                <div className="results-buttons-row" style={{ marginBottom: '2rem' }}>
                  <button onClick={playTTS} className="audio-btn">
                    {isAudioPlaying ? <Square size={18} /> : <Volume2 size={18} />}
                    <span>{isAudioPlaying ? t.stop : t.listen}</span>
                  </button>

                  <button onClick={handleShare} className={`share-btn ${copiedState ? 'copied' : ''}`}>
                    {copiedState ? <Check size={18} /> : <Share2 size={18} />}
                    <span>{copiedState ? t.copied : t.share}</span>
                  </button>
                </div>

                {/* Retest Banner or Graph */}
                {!retestScores ? (
                  <div className="retest-banner-card">
                    <h3 className="retest-banner-title">🔄 {t.retestBannerTitle}</h3>
                    <p className="retest-banner-desc">{t.retestBannerDesc}</p>
                    <button onClick={handleSimulateRetest} className="retest-trigger-btn">
                      {t.retestBtn}
                    </button>
                  </div>
                ) : (
                  <ProgressGraph baseline={baselineScores} retest={retestScores} lang={lang} />
                )}

                {/* Constitutional Risk Dial */}
                {analysis.risk_percentage !== undefined && (
                  <RiskGauge percentage={analysis.risk_percentage} lang={lang} />
                )}

                {/* Main insights block */}
                {analysis.detailed_explanation && (
                  <details open className="insight-card" style={{ marginTop: '2rem' }}>
                    <summary className="detail-summary" style={{ borderRadius: '18px 18px 0 0' }}>{t.insight}</summary>
                    <div className="detailed-explanation" style={{ border: '1px solid rgba(45, 90, 39, 0.08)', borderRadius: '0 0 18px 18px' }}>
                      {analysis.detailed_explanation.split('\n').map((p: string, i: number) => <p key={i} style={{ marginBottom: '1rem' }}>{p}</p>)}
                    </div>
                  </details>
                )}
              </div>
            )}

            {/* TAB: Foods to Avoid */}
            {activeTab === 'foods' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">🚫 {t.tabFoods}</h3>
                <p className="tab-section-intro">
                  {lang === 'en' 
                    ? `Foods that aggravate your current dominant dosha state. Strictly limit or avoid these to prevent structural and gastrointestinal imbalances.` 
                    : `तुमच्या शरीरातील दोषांचे प्रमाण वाढवणारे किंवा बिघडवणारे अन्नपदार्थ. पचनक्रिया आणि शारीरिक स्वास्थ्य बिघडू नये म्हणून या आहाराचे सेवन टाळावे.`}
                </p>
                <ul className="recommendation-list">
                  {(analysis.foods_to_avoid || []).map((food: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ fontSize: '1.05rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      ❌ {food}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TAB: Precautions */}
            {activeTab === 'precautions' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">⚠️ {t.tabPrecautions}</h3>
                <p className="tab-section-intro">
                  {lang === 'en'
                    ? `Important lifestyle warnings, environmental factors, and clinical habits to look out for to maintain metabolic and constitutional equilibrium.`
                    : `शारीरिक आणि मानसिक संतुलन राखण्यासाठी आवश्यक असलेली जीवनशैलीतील काळजी आणि घ्यावयाची खबरदारी.`}
                </p>

                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>
                  {lang === 'en' ? 'Clinical Precautions & Cautions' : 'महत्त्वाची काळजी आणि सावधगिरी'}
                </h4>
                <ul className="recommendation-list">
                  {(analysis.precautions || []).map((prec: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ padding: '0.5rem 0' }}>
                      🔸 {prec}
                    </li>
                  ))}
                </ul>

                {analysis.risks && analysis.risks.length > 0 && (
                  <>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#c94c4c', marginBottom: '1rem', marginTop: '2rem' }}>
                      {t.risks}
                    </h4>
                    <ul className="recommendation-list">
                      {analysis.risks.map((rk: string, i: number) => (
                        <li key={i} className="recommendation-item" style={{ padding: '0.5rem 0' }}>
                          ⚠️ {rk}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {/* TAB: Tips */}
            {activeTab === 'tips' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">💡 {t.tabSuggestions}</h3>
                <p className="tab-section-intro">
                  {lang === 'en'
                    ? `Actionable daily tips, custom lifestyle adjustments, and practical home remedies to keep your biological elements beautifully balanced.`
                    : `जैविक घटकांना संतुलित ठेवण्यासाठी दैनंदिन उपयुक्त टिप्स, जीवनशैलीतील बदल आणि व्यावहारिक घरगुती सल्ले.`}
                </p>

                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', marginTop: '1.5rem' }}>
                  {lang === 'en' ? 'Lifestyle Suggestions & Tips' : 'जीवनशैली सल्ले व सोप्या टिप्स'}
                </h4>
                <ul className="recommendation-list">
                  {(analysis.suggestions_tips || []).map((tip: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ padding: '0.5rem 0' }}>
                      ✨ {tip}
                    </li>
                  ))}
                </ul>

                {analysis.advice && analysis.advice.length > 0 && (
                  <>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem', marginTop: '2rem' }}>
                      {t.advice}
                    </h4>
                    <ul className="recommendation-list">
                      {analysis.advice.map((ad: string, i: number) => (
                        <li key={i} className="recommendation-item" style={{ padding: '0.5rem 0' }}>
                          🌱 {ad}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {/* TAB: Yoga & Exercises */}
            {activeTab === 'yoga' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">🧘 {t.tabYoga}</h3>
                <p className="tab-section-intro">
                  {lang === 'en'
                    ? `Exercises and specific yoga asanas tailored directly to your age (${profile?.age || 'N/A'}), gender, and body frame, ensuring natural revitalization without physical strain.`
                    : `तुमच्या वय (${profile?.age || 'N/A'}), लिंग आणि शरीरयष्टीनुसार डिझाइन केलेली योगासने आणि व्यायाम प्रकार, ज्यामुळे शरीराला थकवा न येता नैसर्गिक ताकद मिळेल.`}
                </p>
                <ul className="recommendation-list">
                  {(analysis.exercises_yoga || []).map((ex: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ padding: '0.6rem 0', borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      🧘 {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* TAB: Causes & Reasons */}
            {activeTab === 'causes' && (
              <div className="tab-content-box">
                <h3 className="tab-section-header">🧬 {t.tabCauses}</h3>
                <p className="tab-section-intro">
                  {lang === 'en'
                    ? `Understanding the underlying environmental, dietary, and metabolic reasons why these particular doshas fluctuate or dominate in your constitution.`
                    : `तुमच्या प्रकृतीमध्ये हे विशिष्ट दोष कमी-अधिक का होतात आणि त्याला कारणीभूत ठरणारे पर्यावरणीय व पचनक्रिया संबंधी मूळ घटक जाणून घ्या.`}
                </p>
                <ul className="recommendation-list">
                  {(analysis.causes_reasons || []).map((cause: string, i: number) => (
                    <li key={i} className="recommendation-item" style={{ padding: '0.6rem 0', borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                      🔬 {cause}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              onClick={() => { 
                setAnswers(Array(QUESTIONS.length).fill(undefined)); 
                setCurrentIdx(0); 
                setStep('intro'); 
                setIsTransitioning(false); 
                setActiveTab('summary');
              }} 
              className="restart-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="restart-icon"><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
              {t.restart}
            </button>
          </div>
        )}
      </main>

      <footer>© {new Date().getFullYear()} Ayurvedic Prakriti Blueprint • Classical Clinical Diagnostics</footer>
    </div>
  );
};

const container = document.getElementById('root');
if (container) createRoot(container).render(<App />);