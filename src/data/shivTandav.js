/**
 * Shiv Tandav Stotra — PROTOTYPE PREVIEW: verses 1 and 2, each broken into its compound parts,
 * to show the same word-by-word engine carries a long stotra. Meanings are DRAFT pending review.
 * Field reference: see gayatri.js.
 */
const w = (verse, n) => `/audio/shiv-tandav/verse-${verse}/word-${String(n).padStart(2, '0')}.mp3`

export const shivTandav = {
  id: 'shiv-tandav',
  title: 'शिव ताण्डव स्तोत्र',
  subtitle: 'Shiv Tandav Stotra',
  tagline: 'Two verses, word by word.',
  preview: true,

  verses: [
    {
      id: 'shiv-v1',
      words: [
        { id: 'shiv-1-01', sanskrit: 'जटाटवी', recited: 'जटाटवी', line: 0, joinNext: true, transliteration: 'jaṭāṭavī', hindiMeaning: 'जटाओं का घना वन', audio: w(1, 1), fullMantraAt: 0.06 },
        { id: 'shiv-1-02', sanskrit: 'गलत्', recited: 'गल', line: 0, joinNext: true, transliteration: 'galat', hindiMeaning: 'बहता हुआ', audio: w(1, 2), fullMantraAt: 0.68 },
        { id: 'shiv-1-03', sanskrit: 'जल', recited: 'ज्जल', line: 0, joinNext: true, transliteration: 'jala', hindiMeaning: 'जल — गंगा का', audio: w(1, 3), fullMantraAt: 0.88 },
        { id: 'shiv-1-04', sanskrit: 'प्रवाह', recited: 'प्रवाह', line: 0, joinNext: true, transliteration: 'pravāha', hindiMeaning: 'धारा', audio: w(1, 4), fullMantraAt: 1.29 },
        { id: 'shiv-1-05', sanskrit: 'पावित', recited: 'पावित', line: 0, joinNext: true, transliteration: 'pāvita', hindiMeaning: 'पवित्र किया हुआ', audio: w(1, 5), fullMantraAt: 1.91 },
        { id: 'shiv-1-06', sanskrit: 'स्थले', recited: 'स्थले', line: 0, transliteration: 'sthale', hindiMeaning: 'स्थान पर (कण्ठ पर)', audio: w(1, 6), fullMantraAt: 2.42 },
        { id: 'shiv-1-07', sanskrit: 'गले', recited: 'गले', line: 1, joinNext: true, transliteration: 'gale', hindiMeaning: 'गले में', audio: w(1, 7), fullMantraAt: 3.76 },
        { id: 'shiv-1-08', sanskrit: 'अवलम्ब्य', recited: 'ऽवलम्ब्य', line: 1, transliteration: 'avalambya', hindiMeaning: 'धारण करके', audio: w(1, 8), fullMantraAt: 4.05 },
        { id: 'shiv-1-09', sanskrit: 'लम्बिताम्', recited: 'लम्बितां', line: 1, transliteration: 'lambitām', hindiMeaning: 'लटकती हुई', audio: w(1, 9), fullMantraAt: 4.84 },
        { id: 'shiv-1-10', sanskrit: 'भुजङ्ग', recited: 'भुजङ्ग', line: 1, joinNext: true, transliteration: 'bhujaṅga', hindiMeaning: 'सर्प', audio: w(1, 10), fullMantraAt: 5.63 },
        { id: 'shiv-1-11', sanskrit: 'तुङ्ग', recited: 'तुङ्ग', line: 1, joinNext: true, transliteration: 'tuṅga', hindiMeaning: 'विशाल', audio: w(1, 11), fullMantraAt: 6.23 },
        { id: 'shiv-1-12', sanskrit: 'मालिकाम्', recited: 'मालिकाम्', line: 1, transliteration: 'mālikām', hindiMeaning: 'माला को', audio: w(1, 12), fullMantraAt: 6.72 },
        { id: 'shiv-1-13', sanskrit: 'डमड्डमड्डमड्डमत्', recited: 'डमड्डमड्डमड्डम', line: 2, joinNext: true, transliteration: 'ḍamaḍḍamaḍḍamaḍḍamat', hindiMeaning: 'डम-डम-डम की ध्वनि', audio: w(1, 13), fullMantraAt: 8.33 },
        { id: 'shiv-1-14', sanskrit: 'निनादवत्', recited: 'न्निनादव', line: 2, joinNext: true, transliteration: 'ninādavat', hindiMeaning: 'गूँजता हुआ', audio: w(1, 14), fullMantraAt: 9.55 },
        { id: 'shiv-1-15', sanskrit: 'डमर्वयम्', recited: 'ड्डमर्वयं', line: 2, transliteration: 'ḍamarvayam', hindiMeaning: 'यह डमरू', audio: w(1, 15), fullMantraAt: 10.25 },
        { id: 'shiv-1-16', sanskrit: 'चकार', recited: 'चकार', line: 3, transliteration: 'cakāra', hindiMeaning: 'किया', audio: w(1, 16), fullMantraAt: 11.85 },
        { id: 'shiv-1-17', sanskrit: 'चण्ड', recited: 'चण्ड', line: 3, joinNext: true, transliteration: 'caṇḍa', hindiMeaning: 'प्रचण्ड / उग्र', audio: w(1, 17), fullMantraAt: 12.39 },
        { id: 'shiv-1-18', sanskrit: 'ताण्डवम्', recited: 'ताण्डवं', line: 3, transliteration: 'tāṇḍavam', hindiMeaning: 'ताण्डव नृत्य', audio: w(1, 18), fullMantraAt: 12.92 },
        { id: 'shiv-1-19', sanskrit: 'तनोतु', recited: 'तनोतु', line: 3, transliteration: 'tanotu', hindiMeaning: 'प्रदान करें', audio: w(1, 19), fullMantraAt: 13.85 },
        { id: 'shiv-1-20', sanskrit: 'नः', recited: 'नः', line: 3, transliteration: 'naḥ', hindiMeaning: 'हमें', audio: w(1, 20), fullMantraAt: 14.51 },
        { id: 'shiv-1-21', sanskrit: 'शिवः', recited: 'शिवः', line: 3, transliteration: 'śivaḥ', hindiMeaning: 'भगवान शिव', audio: w(1, 21), fullMantraAt: 14.78 },
        { id: 'shiv-1-22', sanskrit: 'शिवम्', recited: 'शिवम्', line: 3, transliteration: 'śivam', hindiMeaning: 'कल्याण / मंगल', audio: w(1, 22), fullMantraAt: 15.31 },
      ],
      fullMantraAudio: '/audio/shiv-tandav/verse-1/full.mp3',
      totalMeaningHindi:
        'जिनकी घनी जटाओं से बहती गंगा की धारा ने उनके कण्ठ को पवित्र किया है, जिनके गले में विशाल सर्पों की माला लटक रही है, और जिनका डमरू डम-डम की ध्वनि से गूँज रहा है — उन शिव ने प्रचण्ड ताण्डव नृत्य किया। वे शिव हम सबका कल्याण करें।',
      totalMeaningAudio: '/audio/shiv-tandav/verse-1/meaning.mp3',
    },
    {
      id: 'shiv-v2',
      words: [
        { id: 'shiv-2-01', sanskrit: 'जटा', recited: 'जटा', line: 0, joinNext: true, transliteration: 'jaṭā', hindiMeaning: 'जटाएँ', audio: w(2, 1), fullMantraAt: 0.06 },
        { id: 'shiv-2-02', sanskrit: 'कटाह', recited: 'कटाह', line: 0, joinNext: true, transliteration: 'kaṭāha', hindiMeaning: 'कड़ाह जैसा गहरा घेरा', audio: w(2, 2), fullMantraAt: 0.38 },
        { id: 'shiv-2-03', sanskrit: 'सम्भ्रम', recited: 'सम्भ्रम', line: 0, joinNext: true, transliteration: 'sambhrama', hindiMeaning: 'तेज़ वेग से', audio: w(2, 3), fullMantraAt: 0.8 },
        { id: 'shiv-2-04', sanskrit: 'भ्रमत्', recited: 'भ्रम', line: 0, joinNext: true, transliteration: 'bhramat', hindiMeaning: 'घूमती हुई', audio: w(2, 4), fullMantraAt: 1.54 },
        { id: 'shiv-2-05', sanskrit: 'निलिम्प', recited: 'न्निलिम्प', line: 0, joinNext: true, transliteration: 'nilimpa', hindiMeaning: 'देवताओं की', audio: w(2, 5), fullMantraAt: 1.96 },
        { id: 'shiv-2-06', sanskrit: 'निर्झरी', recited: 'निर्झरी', line: 0, transliteration: 'nirjharī', hindiMeaning: 'नदी — गंगा', audio: w(2, 6), fullMantraAt: 2.91 },
        { id: 'shiv-2-07', sanskrit: 'विलोल', recited: 'विलोल', line: 1, joinNext: true, transliteration: 'vilola', hindiMeaning: 'चंचल', audio: w(2, 7), fullMantraAt: 4.46 },
        { id: 'shiv-2-08', sanskrit: 'वीचि', recited: 'वीचि', line: 1, joinNext: true, transliteration: 'vīci', hindiMeaning: 'लहरें', audio: w(2, 8), fullMantraAt: 4.94 },
        { id: 'shiv-2-09', sanskrit: 'वल्लरी', recited: 'वल्लरी', line: 1, joinNext: true, transliteration: 'vallarī', hindiMeaning: 'बेलों जैसी पंक्तियाँ', audio: w(2, 9), fullMantraAt: 5.32 },
        { id: 'shiv-2-10', sanskrit: 'विराजमान', recited: 'विराजमान', line: 1, joinNext: true, transliteration: 'virājamāna', hindiMeaning: 'सुशोभित', audio: w(2, 10), fullMantraAt: 5.9 },
        { id: 'shiv-2-11', sanskrit: 'मूर्धनि', recited: 'मूर्धनि', line: 1, transliteration: 'mūrdhani', hindiMeaning: 'मस्तक पर', audio: w(2, 11), fullMantraAt: 6.66 },
        { id: 'shiv-2-12', sanskrit: 'धगद्धगद्धगत्', recited: 'धगद्धगद्धग', line: 2, joinNext: true, transliteration: 'dhagaddhagaddhagat', hindiMeaning: 'धक-धक करके', audio: w(2, 12), fullMantraAt: 8.15 },
        { id: 'shiv-2-13', sanskrit: 'ज्वलत्', recited: 'ज्ज्वल', line: 2, joinNext: true, transliteration: 'jvalat', hindiMeaning: 'जलती हुई', audio: w(2, 13), fullMantraAt: 9.5 },
        { id: 'shiv-2-14', sanskrit: 'ललाट', recited: 'ल्ललाट', line: 2, joinNext: true, transliteration: 'lalāṭa', hindiMeaning: 'माथा', audio: w(2, 14), fullMantraAt: 10.31 },
        { id: 'shiv-2-15', sanskrit: 'पट्ट', recited: 'पट्ट', line: 2, joinNext: true, transliteration: 'paṭṭa', hindiMeaning: 'पटल / सतह', audio: w(2, 15), fullMantraAt: 11.13 },
        { id: 'shiv-2-16', sanskrit: 'पावके', recited: 'पावके', line: 2, transliteration: 'pāvake', hindiMeaning: 'अग्नि वाले', audio: w(2, 16), fullMantraAt: 11.67 },
        { id: 'shiv-2-17', sanskrit: 'किशोर', recited: 'किशोर', line: 3, joinNext: true, transliteration: 'kiśora', hindiMeaning: 'नया / बाल', audio: w(2, 17), fullMantraAt: 13.17 },
        { id: 'shiv-2-18', sanskrit: 'चन्द्र', recited: 'चन्द्र', line: 3, joinNext: true, transliteration: 'candra', hindiMeaning: 'चन्द्रमा', audio: w(2, 18), fullMantraAt: 13.65 },
        { id: 'shiv-2-19', sanskrit: 'शेखरे', recited: 'शेखरे', line: 3, transliteration: 'śekhare', hindiMeaning: 'मुकुट में धारण करने वाले में', audio: w(2, 19), fullMantraAt: 14.23 },
        { id: 'shiv-2-20', sanskrit: 'रतिः', recited: 'रतिः', line: 3, transliteration: 'ratiḥ', hindiMeaning: 'प्रेम / अनुराग', audio: w(2, 20), fullMantraAt: 14.72 },
        { id: 'shiv-2-21', sanskrit: 'प्रतिक्षणम्', recited: 'प्रतिक्षणं', line: 3, transliteration: 'pratikṣaṇam', hindiMeaning: 'हर क्षण', audio: w(2, 21), fullMantraAt: 15.11 },
        { id: 'shiv-2-22', sanskrit: 'मम', recited: 'मम', line: 3, transliteration: 'mama', hindiMeaning: 'मेरा', audio: w(2, 22), fullMantraAt: 16.08 },
      ],
      fullMantraAudio: '/audio/shiv-tandav/verse-2/full.mp3',
      totalMeaningHindi:
        'जिनकी जटाओं के गहरे घेरे में देवनदी गंगा तेज़ वेग से घूम रही है, जिनके मस्तक पर उसकी चंचल लहरें बेलों की तरह शोभा पा रही हैं, जिनके माथे पर अग्नि धक-धक करके जल रही है, और जिनके मुकुट में बाल-चन्द्रमा सुशोभित है — ऐसे शिव में मेरा प्रेम हर क्षण बना रहे।',
      totalMeaningAudio: '/audio/shiv-tandav/verse-2/meaning.mp3',
    },
  ],
}
