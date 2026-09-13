/**
 * Gayatri Mantra — content model.
 *
 * CONTENT STATUS: DRAFT. The Hindi meanings below are common simple renderings written for this
 * prototype. They must be reviewed and approved by the client's Sanskrit/Hindi advisor before
 * any public release. Edit freely — every piece of mantra text in the UI is read from this file.
 *
 * AUDIO: every spoken element points at a file under /public/audio/gayatri/. Files that don't
 * exist yet are handled gracefully (the app keeps flowing with a quiet "audio arriving soon" note).
 * Drop the real files in with these exact names and the app picks them up — no code changes.
 * Set a path to null to mark a clip as intentionally unrecorded.
 *
 * A mantra holds one or more verses; each verse is played word by word, then in full, then its
 * meaning. Verse fields: id, words[], fullMantraAudio, totalMeaningHindi, totalMeaningAudio.
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
        { id: 'gayatri-01', sanskrit: 'ॐ', recited: 'ॐ', line: 0, transliteration: 'oṁ', hindiMeaning: 'परमात्मा का पवित्र नाम — प्रणव', audio: '/audio/gayatri/word-01.mp3', fullMantraAt: 0.06 },
        { id: 'gayatri-02', sanskrit: 'भूः', recited: 'भू', line: 0, joinNext: true, transliteration: 'bhūḥ', hindiMeaning: 'पृथ्वी / भौतिक जगत', audio: '/audio/gayatri/word-02.mp3', fullMantraAt: 0.27 },
        { id: 'gayatri-03', sanskrit: 'भुवः', recited: 'र्भुवः', line: 0, transliteration: 'bhuvaḥ', hindiMeaning: 'अंतरिक्ष / प्राणों का लोक', audio: '/audio/gayatri/word-03.mp3', fullMantraAt: 0.68 },
        { id: 'gayatri-04', sanskrit: 'स्वः', recited: 'स्वः', line: 0, transliteration: 'svaḥ', hindiMeaning: 'स्वर्ग / आकाश-लोक', audio: '/audio/gayatri/word-04.mp3', fullMantraAt: 1.92 },
        { id: 'gayatri-05', sanskrit: 'तत्', recited: 'तत्', line: 1, joinNext: true, transliteration: 'tat', hindiMeaning: 'वह / उस परम सत्य को', audio: '/audio/gayatri/word-05.mp3', fullMantraAt: 3.57 },
        { id: 'gayatri-06', sanskrit: 'सवितुः', recited: 'सवितु', line: 1, joinNext: true, transliteration: 'savituḥ', hindiMeaning: 'सविता (सूर्य) का — जो सबको जीवन देता है', audio: '/audio/gayatri/word-06.mp3', fullMantraAt: 3.8 },
        { id: 'gayatri-07', sanskrit: 'वरेण्यम्', recited: 'र्वरेण्यम्', line: 1, transliteration: 'vareṇyam', hindiMeaning: 'श्रेष्ठ / अपनाने योग्य', audio: '/audio/gayatri/word-07.mp3', fullMantraAt: 4.17 },
        { id: 'gayatri-08', sanskrit: 'भर्गः', recited: 'भर्गो', line: 2, transliteration: 'bhargaḥ', hindiMeaning: 'तेज / पापों को मिटाने वाला प्रकाश', audio: '/audio/gayatri/word-08.mp3', fullMantraAt: 5.74 },
        { id: 'gayatri-09', sanskrit: 'देवस्य', recited: 'देवस्य', line: 2, transliteration: 'devasya', hindiMeaning: 'देव का / दिव्य परमात्मा का', audio: '/audio/gayatri/word-09.mp3', fullMantraAt: 6.27 },
        { id: 'gayatri-10', sanskrit: 'धीमहि', recited: 'धीमहि', line: 2, transliteration: 'dhīmahi', hindiMeaning: 'हम ध्यान करते हैं', audio: '/audio/gayatri/word-10.mp3', fullMantraAt: 6.89 },
        { id: 'gayatri-11', sanskrit: 'धियः', recited: 'धियो', line: 3, transliteration: 'dhiyaḥ', hindiMeaning: 'बुद्धि को', audio: '/audio/gayatri/word-11.mp3', fullMantraAt: 8.23 },
        { id: 'gayatri-12', sanskrit: 'यः', recited: 'यो', line: 3, transliteration: 'yaḥ', hindiMeaning: 'जो', audio: '/audio/gayatri/word-12.mp3', fullMantraAt: 8.8 },
        { id: 'gayatri-13', sanskrit: 'नः', recited: 'नः', line: 3, transliteration: 'naḥ', hindiMeaning: 'हमारी', audio: '/audio/gayatri/word-13.mp3', fullMantraAt: 9.09 },
        { id: 'gayatri-14', sanskrit: 'प्रचोदयात्', recited: 'प्रचोदयात्', line: 3, transliteration: 'pracodayāt', hindiMeaning: 'प्रेरित करे / सही मार्ग पर ले चले', audio: '/audio/gayatri/word-14.mp3', fullMantraAt: 9.37 },
      ],

      fullMantraAudio: '/audio/gayatri/full-mantra.mp3',

      totalMeaningHindi:
        'हम उस परमात्मा के श्रेष्ठ और पवित्र तेज का ध्यान करते हैं, जो पृथ्वी, अंतरिक्ष और स्वर्ग — तीनों लोकों में व्याप्त है और सबको जीवन देता है। वह परमात्मा हमारी बुद्धि को सही मार्ग की ओर प्रेरित करे।',
      totalMeaningAudio: '/audio/gayatri/total-meaning.mp3',
    },
  ],
}
