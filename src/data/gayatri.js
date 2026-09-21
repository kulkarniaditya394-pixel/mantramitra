/**
 * Gayatri Mantra — content model.
 *
 * CONTENT SOURCES (why these meanings and not others):
 * The verse is Ṛgveda 3.62.10, ṛṣi Viśvāmitra, chandas Gāyatrī, and its devatā is SAVITṚ —
 * the Sun as the divine impeller and vivifier. This is why the verse is also called the Sāvitrī.
 * The meanings below follow that mainstream reading:
 *   - Sāyaṇa's bhāṣya (via Wilson 1866): bhargas = the orb of light, "the consumer of sins";
 *     savitṛ = the radiant sun, progenitor of all; dhīmahi = "we meditate upon".
 *   - H. H. Wilson (1866): "We meditate on that desirable light of the divine Savitā,
 *     who influences our pious rites."
 *   - R. T. H. Griffith (1896): "May we attain that excellent glory of Savitar the God:
 *     So may he stimulate our prayers."
 *   - Monier-Williams: "May he enlighten our understandings."
 * Note: ॐ भूर्भुवः स्वः is the mahāvyāhṛti prefix used in japa (Taittirīya Āraṇyaka / Yajurveda),
 * NOT part of the Ṛgvedic verse itself. It is included here because that is how the mantra is
 * universally recited today, and marked with `vyahriti: true` so the UI can say so.
 *
 * Other traditions render this differently (Ārya Samāj / Dayānanda reads Savitṛ as Īśvara rather
 * than the solar deity; Advaita readings equate bhargas with Brahman). Keep `source` filled in on
 * every verse so the app can always state which reading it is showing.
 * STATUS: pending final approval by the client's Sanskrit advisor.
 *
 * AUDIO: every spoken element points at a file under /public/audio/gayatri/. Files that don't
 * exist yet are handled gracefully (the app keeps flowing with a quiet "audio arriving soon" note).
 * Drop the real files in with these exact names and the app picks them up — no code changes.
 * Set a path to null to mark a clip as intentionally unrecorded.
 *
 * A mantra holds one or more verses; each verse is played word by word, then in full, then its
 * meaning. Verse fields: id, words[], fullMantraAudio, totalMeaningHindi, totalMeaningAudio, source.
 *
 * Word fields
 *   sanskrit        pada (dictionary) form, shown large in the focus card
 *   recited         how the word appears inside the continuous mantra (sandhi form), split on a
 *                   clean letter boundary so it can be highlighted in place without breaking
 *                   Devanagari conjuncts (e.g. भूः + भुवः → "भू" + "र्भुवः")
 *   line            which line of the complete mantra the word sits on (0-based)
 *   joinNext        true when the next word continues on the same line without a space
 *   transliteration IAST
 *   hindiMeaning    simple Hindi meaning
 *   grammar         short grammatical note (case / form) — shown as a small secondary line
 *   vyahriti        true for the ॐ भूर्भुवः स्वः prefix, which is not part of the Ṛgvedic verse
 *   audio           path of this word's clip, or null
 *   fullMantraAt    optional start time (seconds) of this word inside fullMantraAudio. When filled
 *                   in, words highlight in sync during full-mantra playback.
 */
export const gayatri = {
  id: 'gayatri',
  title: 'गायत्री मंत्र',
  subtitle: 'Gayatri Mantra',
  tagline: 'Learn the mantra. Understand every word.',
  preview: false,

  verses: [
    {
      id: 'gayatri-v1',
      words: [
        { id: 'gayatri-01', sanskrit: 'ॐ', recited: 'ॐ', line: 0, transliteration: 'oṁ', hindiMeaning: 'प्रणव — परब्रह्म का नाद-रूप', grammar: 'महाव्याहृति', vyahriti: true, audio: '/audio/gayatri/word-01.mp3', fullMantraAt: 0.06 },
        { id: 'gayatri-02', sanskrit: 'भूः', recited: 'भू', line: 0, joinNext: true, transliteration: 'bhūḥ', hindiMeaning: 'भूलोक — पृथ्वी', grammar: 'महाव्याहृति', vyahriti: true, audio: '/audio/gayatri/word-02.mp3', fullMantraAt: 0.27 },
        { id: 'gayatri-03', sanskrit: 'भुवः', recited: 'र्भुवः', line: 0, transliteration: 'bhuvaḥ', hindiMeaning: 'भुवर्लोक — अंतरिक्ष', grammar: 'महाव्याहृति', vyahriti: true, audio: '/audio/gayatri/word-03.mp3', fullMantraAt: 0.68 },
        { id: 'gayatri-04', sanskrit: 'स्वः', recited: 'स्वः', line: 0, transliteration: 'svaḥ', hindiMeaning: 'स्वर्लोक — द्युलोक', grammar: 'महाव्याहृति', vyahriti: true, audio: '/audio/gayatri/word-04.mp3', fullMantraAt: 1.92 },
        { id: 'gayatri-05', sanskrit: 'तत्', recited: 'तत्', line: 1, joinNext: true, transliteration: 'tat', hindiMeaning: 'उस — सविता के उस तेज को', grammar: 'सर्वनाम', audio: '/audio/gayatri/word-05.mp3', fullMantraAt: 3.57 },
        { id: 'gayatri-06', sanskrit: 'सवितुः', recited: 'सवितु', line: 1, joinNext: true, transliteration: 'savituḥ', hindiMeaning: 'सविता का — सूर्यरूप प्रेरक देव का, जो सबको जन्म और गति देता है', grammar: 'षष्ठी — सवितृ का', audio: '/audio/gayatri/word-06.mp3', fullMantraAt: 3.8 },
        { id: 'gayatri-07', sanskrit: 'वरेण्यम्', recited: 'र्वरेण्यम्', line: 1, transliteration: 'vareṇyam', hindiMeaning: 'वरण करने योग्य — सर्वश्रेष्ठ', grammar: 'द्वितीया — भर्गः का विशेषण', audio: '/audio/gayatri/word-07.mp3', fullMantraAt: 4.17 },
        { id: 'gayatri-08', sanskrit: 'भर्गः', recited: 'भर्गो', line: 2, transliteration: 'bhargaḥ', hindiMeaning: 'तेज — वह प्रकाश जो पापों को भस्म कर देता है', grammar: 'द्वितीया — ध्यान का विषय', audio: '/audio/gayatri/word-08.mp3', fullMantraAt: 5.74 },
        { id: 'gayatri-09', sanskrit: 'देवस्य', recited: 'देवस्य', line: 2, transliteration: 'devasya', hindiMeaning: 'देव का — दिव्य सविता का', grammar: 'षष्ठी', audio: '/audio/gayatri/word-09.mp3', fullMantraAt: 6.27 },
        { id: 'gayatri-10', sanskrit: 'धीमहि', recited: 'धीमहि', line: 2, transliteration: 'dhīmahi', hindiMeaning: 'हम ध्यान करें — अपनी अंतरात्मा में धारण करें', grammar: 'क्रिया — उत्तम पुरुष बहुवचन', audio: '/audio/gayatri/word-10.mp3', fullMantraAt: 6.89 },
        { id: 'gayatri-11', sanskrit: 'धियः', recited: 'धियो', line: 3, transliteration: 'dhiyaḥ', hindiMeaning: 'बुद्धियों को — हमारी समझ को', grammar: 'द्वितीया बहुवचन', audio: '/audio/gayatri/word-11.mp3', fullMantraAt: 8.23 },
        { id: 'gayatri-12', sanskrit: 'यः', recited: 'यो', line: 3, transliteration: 'yaḥ', hindiMeaning: 'जो — वही सविता देव', grammar: 'प्रथमा — सविता का निर्देश', audio: '/audio/gayatri/word-12.mp3', fullMantraAt: 8.8 },
        { id: 'gayatri-13', sanskrit: 'नः', recited: 'नः', line: 3, transliteration: 'naḥ', hindiMeaning: 'हमारी', grammar: 'षष्ठी बहुवचन', audio: '/audio/gayatri/word-13.mp3', fullMantraAt: 9.09 },
        { id: 'gayatri-14', sanskrit: 'प्रचोदयात्', recited: 'प्रचोदयात्', line: 3, transliteration: 'pracodayāt', hindiMeaning: 'प्रेरित करे — सन्मार्ग की ओर प्रवृत्त करे', grammar: 'क्रिया — विधिलिङ्, प्रार्थना', audio: '/audio/gayatri/word-14.mp3', fullMantraAt: 9.37 },
      ],

      fullMantraAudio: '/audio/gayatri/full-mantra.mp3',

      totalMeaningHindi:
        'हम सविता देव के — उस सूर्यरूप प्रेरक परमात्मा के — वरण करने योग्य, पापनाशक तेज को अपनी अंतरात्मा में धारण करें। वही देव हमारी बुद्धि को सन्मार्ग की ओर प्रेरित करे।',
      totalMeaningAudio: '/audio/gayatri/total-meaning.mp3',

      source: {
        scripture: 'ऋग्वेद ३.६२.१०',
        rishi: 'विश्वामित्र',
        devata: 'सविता (सूर्य)',
        chhanda: 'गायत्री',
        note: 'ॐ भूर्भुवः स्वः महाव्याहृति है — जप के लिए जोड़ी जाती है, ऋग्वेद की ऋचा का भाग नहीं।',
        reference: 'Wilson (1866): “We meditate on that desirable light of the divine Savitā, who influences our pious rites.”',
      },
    },
  ],
}
