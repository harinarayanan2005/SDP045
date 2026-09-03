// AkiVoice AI — Enhanced Sentiment & Speech Delivery Engine
import Sentiment from 'sentiment';

const sentimentInstance = new Sentiment();

// Common speech filler words and hesitation markers
export const FILLER_WORDS = [
  'um', 'uh', 'er', 'ah', 'like', 'you know', 'basically', 'actually', 
  'literally', 'i mean', 'kind of', 'sort of', 'right', 'so yeah', 'honestly'
];

// Emotion Lexicon weights
const EMOTION_LEXICON = {
  joy: ['delighted', 'happy', 'great', 'awesome', 'amazing', 'superb', 'thrilled', 'excited', 'fantastic', 'wonderful', 'joy', 'celebrate', 'love', 'brilliant', 'success'],
  confidence: ['certainly', 'definitely', 'guaranteed', 'achieved', 'proven', 'strong', 'convinced', 'mastered', 'excel', 'leader', 'vision', 'solid', 'precise', 'unquestionable'],
  serenity: ['calm', 'peaceful', 'balanced', 'stable', 'smooth', 'clarity', 'mindful', 'gentle', 'steady', 'patient', 'harmonious', 'serene', 'tranquil'],
  hesitation: ['maybe', 'perhaps', 'possibly', 'uncertain', 'might', 'doubt', 'guess', 'unclear', 'suppose', 'hesitant', 'unsure', 'sorta', 'kinda'],
  frustration: ['angry', 'bad', 'terrible', 'horrible', 'delay', 'broken', 'failed', 'annoying', 'awful', 'frustrated', 'flawed', 'stuck', 'worst', 'poor', 'slow'],
  energy: ['powerful', 'dynamic', 'fast', 'accelerate', 'bold', 'urgent', 'passion', 'explosive', 'rapid', 'vibrant', 'boost', 'momentum', 'fierce']
};

/**
 * Calculates Flesch-Kincaid Reading Ease score
 */
function calculateReadability(text, words, sentences) {
  if (words.length === 0 || sentences.length === 0) return { score: 70, level: 'Standard' };
  
  // Estimate syllables count
  let syllableCount = 0;
  words.forEach(word => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    if (cleanWord.length <= 3) {
      syllableCount += 1;
    } else {
      const matches = cleanWord.match(/[aeiouy]{1,2}/g);
      syllableCount += matches ? matches.length : 1;
    }
  });

  const wordsPerSentence = words.length / Math.max(1, sentences.length);
  const syllablesPerWord = syllableCount / Math.max(1, words.length);
  const score = Math.round(206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord));
  const clampedScore = Math.max(0, Math.min(100, score));

  let level = 'Standard';
  if (clampedScore >= 80) level = 'Very Easy & Conversational';
  else if (clampedScore >= 60) level = 'Standard & Engaging';
  else if (clampedScore >= 40) level = 'Complex / Technical';
  else level = 'Dense Academic';

  return { score: clampedScore, level };
}

/**
 * Comprehensive analysis of speech transcript text
 */
export function analyzeSpeech(transcriptText, durationSeconds = 0) {
  const cleanText = (transcriptText || '').trim();
  if (!cleanText) {
    return {
      isEmpty: true,
      sentiment: { score: 0, comparative: 0, label: 'Neutral', polarity: 'neutral', confidence: 0 },
      emotions: { joy: 0, confidence: 0, serenity: 0, hesitation: 0, frustration: 0, energy: 0 },
      speechDelivery: {
        totalWords: 0,
        uniqueWords: 0,
        diversityRatio: 0,
        wpm: 0,
        paceLabel: 'Idle',
        fillerCount: 0,
        fillerRatio: 0,
        detectedFillers: [],
        readability: { score: 0, level: 'None' }
      },
      tokens: []
    };
  }

  // 1. Sentiment Score from Sentiment engine
  const rawSentiment = sentimentInstance.analyze(cleanText);
  const score = rawSentiment.score;
  const comparative = rawSentiment.comparative;

  let label = 'Balanced & Neutral';
  let polarity = 'neutral';
  let confidence = Math.min(100, Math.round(Math.abs(comparative) * 85) + 30);

  if (score > 2 || comparative > 0.15) {
    label = score >= 5 ? 'Deeply Positive & Enthusiastic' : 'Positive & Uplifting';
    polarity = 'positive';
  } else if (score < -2 || comparative < -0.15) {
    label = score <= -5 ? 'Critically Negative & Concerned' : 'Negative & Critical';
    polarity = 'negative';
  }

  // 2. Tokenize & Sentence splitting
  const rawWords = cleanText.split(/\s+/).filter(w => w.length > 0);
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const wordTokens = rawWords.map(w => w.toLowerCase().replace(/[^a-z0-9'-]/g, ''));

  // 3. Filler Word Detection
  const detectedFillers = [];
  let fillerCount = 0;

  // Single word fillers
  wordTokens.forEach((word, idx) => {
    if (FILLER_WORDS.includes(word)) {
      fillerCount++;
      detectedFillers.push({ word, index: idx });
    }
  });

  // Multi-word fillers check
  const lowerText = cleanText.toLowerCase();
  ['you know', 'i mean', 'kind of', 'sort of', 'so yeah'].forEach(multi => {
    const occurrences = lowerText.split(multi).length - 1;
    if (occurrences > 0) {
      fillerCount += occurrences;
    }
  });

  const uniqueWords = new Set(wordTokens).size;
  const diversityRatio = Math.round((uniqueWords / Math.max(1, rawWords.length)) * 100);
  const fillerRatio = Math.min(100, Math.round((fillerCount / Math.max(1, rawWords.length)) * 100));

  // 4. Words Per Minute (WPM) & Pace
  const minutes = durationSeconds > 0 ? durationSeconds / 60 : Math.max(0.2, rawWords.length / 140);
  const wpm = Math.round(rawWords.length / minutes);
  let paceLabel = 'Optimal Conversational';
  if (wpm < 110) paceLabel = 'Slow & Deliberate';
  else if (wpm > 175) paceLabel = 'Rapid & Rushed';

  // 5. 6-Factor Emotion Radar Calculation
  const emotions = {
    joy: 20,
    confidence: 25,
    serenity: 35,
    hesitation: Math.min(100, fillerRatio * 5 + (wordTokens.filter(w => EMOTION_LEXICON.hesitation.includes(w)).length * 15)),
    frustration: 10,
    energy: 25
  };

  // Adjust emotions based on word matches
  wordTokens.forEach(w => {
    if (EMOTION_LEXICON.joy.includes(w)) emotions.joy += 18;
    if (EMOTION_LEXICON.confidence.includes(w)) emotions.confidence += 16;
    if (EMOTION_LEXICON.serenity.includes(w)) emotions.serenity += 14;
    if (EMOTION_LEXICON.frustration.includes(w)) emotions.frustration += 22;
    if (EMOTION_LEXICON.energy.includes(w)) emotions.energy += 16;
  });

  if (polarity === 'positive') {
    emotions.joy = Math.min(100, emotions.joy + 35);
    emotions.confidence = Math.min(100, emotions.confidence + 25);
    emotions.serenity = Math.min(100, emotions.serenity + 20);
    emotions.frustration = Math.max(5, emotions.frustration - 15);
  } else if (polarity === 'negative') {
    emotions.frustration = Math.min(100, emotions.frustration + 45);
    emotions.hesitation = Math.min(100, emotions.hesitation + 25);
    emotions.joy = Math.max(5, emotions.joy - 20);
  }

  // Normalize emotions to 0 - 100
  Object.keys(emotions).forEach(k => {
    emotions[k] = Math.min(100, Math.max(5, Math.round(emotions[k])));
  });

  // 6. Token Highlights for Interactive Heatmap
  const positiveWords = new Set(rawSentiment.positive || []);
  const negativeWords = new Set(rawSentiment.negative || []);

  const tokens = rawWords.map((word, index) => {
    const cleanW = word.toLowerCase().replace(/[^a-z0-9'-]/g, '');
    let type = 'neutral';
    let labelTag = '';

    if (FILLER_WORDS.includes(cleanW)) {
      type = 'filler';
      labelTag = 'Filler Word';
    } else if (positiveWords.has(cleanW)) {
      type = 'positive';
      labelTag = 'Positive';
    } else if (negativeWords.has(cleanW)) {
      type = 'negative';
      labelTag = 'Negative';
    }

    return {
      original: word,
      clean: cleanW,
      type,
      labelTag,
      index
    };
  });

  const readability = calculateReadability(cleanText, rawWords, sentences);

  // 7. AI Executive Summary & Action Items Extraction
  const executiveSummary = generateExecutiveSummary(cleanText, sentences, { polarity, label, score }, emotions, { wpm, fillerCount, totalWords: rawWords.length });

  return {
    isEmpty: false,
    sentiment: {
      score,
      comparative: Number(comparative.toFixed(3)),
      label,
      polarity,
      confidence
    },
    emotions,
    speechDelivery: {
      totalWords: rawWords.length,
      uniqueWords,
      diversityRatio,
      wpm,
      paceLabel,
      fillerCount,
      fillerRatio,
      detectedFillers,
      readability
    },
    executiveSummary,
    tokens
  };
}

/**
 * Generates an executive summary, key themes, and action items
 */
function generateExecutiveSummary(text, sentences, sentiment, emotions, delivery) {
  // Extract significant keywords / themes (words > 4 chars, non-filler)
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const stopwords = new Set(['this', 'that', 'with', 'from', 'have', 'were', 'which', 'about', 'there', 'their', 'would', 'could', 'should', 'these', 'other', 'being']);
  const freqMap = {};
  words.forEach(w => {
    if (!stopwords.has(w) && !FILLER_WORDS.includes(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  });

  const sortedKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0].charAt(0).toUpperCase() + entry[0].slice(1));

  // Synopsis
  let synopsis = '';
  if (sentences.length >= 2) {
    synopsis = `${sentences[0].trim()} Overall, the speech delivers a ${sentiment.label.toLowerCase()} message with ${emotions.confidence}% vocal conviction.`;
  } else {
    synopsis = `The speaker provided a concise statement highlighting key operational objectives with ${sentiment.polarity} emotional resonance.`;
  }

  // Action Items based on tone & delivery
  const actionItems = [];
  if (delivery.wpm > 165) {
    actionItems.push('Schedule deliberate pacing pauses after key assertions to reinforce audience absorption.');
  } else {
    actionItems.push('Maintain current vocal momentum and steady cadence across high-priority talking points.');
  }

  if (delivery.fillerCount > 2) {
    actionItems.push(`Target reduction of detected hesitation markers (${delivery.fillerCount} filler occurrences) in subsequent rehearsals.`);
  } else {
    actionItems.push('Leverage high verbal precision to anchor authority in executive briefings.');
  }

  if (sentiment.polarity === 'positive') {
    actionItems.push('Capitalize on strong positive resonance to drive project buy-in and stakeholder alignment.');
  } else if (sentiment.polarity === 'negative') {
    actionItems.push('Formulate mitigation strategies and clear action timelines for critical issues raised.');
  } else {
    actionItems.push('Structure next follow-up with concrete metric milestones to transition from objective review to execution.');
  }

  return {
    synopsis,
    keyThemes: sortedKeywords.length ? sortedKeywords : ['Voice Analytics', 'Speech Clarity', 'Execution'],
    actionItems,
    impactRating: sentiment.polarity === 'positive' ? 'High Alignment & Buy-in' : sentiment.polarity === 'negative' ? 'Urgent Strategic Focus' : 'Objective Information Transfer'
  };
}
