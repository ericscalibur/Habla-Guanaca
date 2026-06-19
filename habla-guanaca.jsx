import { useState, useEffect, useCallback, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, SkipForward, RotateCcw, ChevronRight, ChevronLeft, Settings, X, BookOpen, Headphones, Clock, Star, Check, RefreshCw } from "lucide-react";

// ============================================================
// LESSON DATA — Salvadoran Spanish (Caliche)
// ============================================================

const LESSONS = [
  {
    id: "L01",
    title: "Mucho gusto",
    subtitle: "Meeting People",
    icon: "👋",
    description: "Greetings, introductions, and your first voseo",
    estimatedMinutes: 12,
    dialogue: {
      context: "You're at a pupusería in San Salvador. Someone sits next to you.",
      lines: [
        { speaker: "A", textEs: "¡Hola! ¿Cómo estás vos?", textEn: "Hi! How are you?" },
        { speaker: "B", textEs: "Bien, gracias. ¿Y vos?", textEn: "Good, thanks. And you?" },
        { speaker: "A", textEs: "Mucho gusto. Me llamo Carlos.", textEn: "Nice to meet you. My name is Carlos." },
        { speaker: "B", textEs: "Igualmente. Yo soy María.", textEn: "Likewise. I'm María." },
      ],
    },
    newItems: [
      { id: "L01-01", promptEn: "Hello", targetEs: "Hola", pronunciation: "OH-lah", culturalNote: "Same across all Spanish dialects" },
      { id: "L01-02", promptEn: "How are you? (informal)", targetEs: "¿Cómo estás vos?", standardEs: "¿Cómo estás tú?", pronunciation: "KOH-moh ehs-TAHS vohs", culturalNote: "In El Salvador, 'vos' replaces 'tú' for informal 'you'" },
      { id: "L01-03", promptEn: "I'm fine / I'm good", targetEs: "Estoy bien", pronunciation: "ehs-TOY bee-EHN" },
      { id: "L01-04", promptEn: "And you?", targetEs: "¿Y vos?", standardEs: "¿Y tú?", pronunciation: "ee VOHS", culturalNote: "Short and casual — very Salvadoran" },
      { id: "L01-05", promptEn: "Nice to meet you", targetEs: "Mucho gusto", pronunciation: "MOO-choh GOOS-toh" },
      { id: "L01-06", promptEn: "My name is...", targetEs: "Me llamo...", pronunciation: "meh YAH-moh", culturalNote: "Literally 'I call myself...'" },
      { id: "L01-07", promptEn: "What's your name?", targetEs: "¿Cómo te llamás vos?", standardEs: "¿Cómo te llamas tú?", pronunciation: "KOH-moh teh yah-MAHS vohs", culturalNote: "Notice the vos conjugation: llamás (not llamas)" },
      { id: "L01-08", promptEn: "Likewise / Same here", targetEs: "Igualmente", pronunciation: "ee-gwal-MEHN-teh" },
      { id: "L01-09", promptEn: "Good morning", targetEs: "Buenos días", pronunciation: "BWEH-nohs DEE-ahs" },
      { id: "L01-10", promptEn: "See you later", targetEs: "Nos vemos", pronunciation: "nohs VEH-mohs", culturalNote: "More casual than 'adiós' — common in SV" },
    ],
  },
  {
    id: "L02",
    title: "¿De dónde sos vos?",
    subtitle: "Where Are You From?",
    icon: "🌎",
    description: "Origins, nationalities, and the verb 'ser' with vos",
    estimatedMinutes: 14,
    dialogue: {
      context: "Continuing the conversation at the pupusería.",
      lines: [
        { speaker: "A", textEs: "¿De dónde sos vos?", textEn: "Where are you from?" },
        { speaker: "B", textEs: "Soy de Estados Unidos. ¿Y vos?", textEn: "I'm from the United States. And you?" },
        { speaker: "A", textEs: "Yo soy de aquí, de San Salvador.", textEn: "I'm from here, from San Salvador." },
        { speaker: "B", textEs: "¡Qué chivo! Me gusta mucho El Salvador.", textEn: "Cool! I really like El Salvador." },
      ],
    },
    newItems: [
      { id: "L02-01", promptEn: "Where are you from? (informal)", targetEs: "¿De dónde sos vos?", standardEs: "¿De dónde eres tú?", pronunciation: "deh DOHN-deh sohs vohs", culturalNote: "'Sos' is the vos form of 'ser' (to be)" },
      { id: "L02-02", promptEn: "I am from...", targetEs: "Soy de...", pronunciation: "soy deh" },
      { id: "L02-03", promptEn: "the United States", targetEs: "Estados Unidos", pronunciation: "ehs-TAH-dohs oo-NEE-dohs" },
      { id: "L02-04", promptEn: "You are (informal, identity)", targetEs: "Vos sos", standardEs: "Tú eres", pronunciation: "vohs sohs", culturalNote: "Key voseo form — 'sos' instead of 'eres'" },
      { id: "L02-05", promptEn: "Cool! / Awesome!", targetEs: "¡Qué chivo!", pronunciation: "keh CHEE-voh", culturalNote: "Salvadoran slang — 'chivo' means cool/awesome" },
      { id: "L02-06", promptEn: "I like (something) a lot", targetEs: "Me gusta mucho", pronunciation: "meh GOOS-tah MOO-choh" },
      { id: "L02-07", promptEn: "here", targetEs: "aquí", pronunciation: "ah-KEE" },
      { id: "L02-08", promptEn: "I am Salvadoran", targetEs: "Soy salvadoreño/a", pronunciation: "soy sahl-vah-doh-REH-nyoh/nyah" },
      { id: "L02-09", promptEn: "Do you speak English?", targetEs: "¿Hablás inglés?", standardEs: "¿Hablas inglés?", pronunciation: "ah-BLAHS een-GLEHS", culturalNote: "Vos conjugation: hablás (stress on last syllable)" },
      { id: "L02-10", promptEn: "A little bit", targetEs: "Un poquito", pronunciation: "oon poh-KEE-toh" },
    ],
  },
  {
    id: "L03",
    title: "Quiero pupusas",
    subtitle: "Ordering Food",
    icon: "🫓",
    description: "Ordering at a pupusería — numbers, prices, and food vocab",
    estimatedMinutes: 15,
    dialogue: {
      context: "You walk up to a pupusa stand at a market.",
      lines: [
        { speaker: "A", textEs: "Buenas. ¿Qué va a querer?", textEn: "Hi. What would you like?" },
        { speaker: "B", textEs: "Quiero dos pupusas revueltas, por favor.", textEn: "I'd like two revueltas pupusas, please." },
        { speaker: "A", textEs: "¿Con curtido?", textEn: "With curtido (pickled slaw)?" },
        { speaker: "B", textEs: "Sí. ¿Cuánto es?", textEn: "Yes. How much is it?" },
        { speaker: "A", textEs: "Son dos dólares.", textEn: "That's two dollars." },
      ],
    },
    newItems: [
      { id: "L03-01", promptEn: "I want / I'd like", targetEs: "Quiero", pronunciation: "kee-EH-roh" },
      { id: "L03-02", promptEn: "pupusa (stuffed tortilla)", targetEs: "pupusa", pronunciation: "poo-POO-sah", culturalNote: "National dish of El Salvador — thick corn tortilla stuffed with fillings" },
      { id: "L03-03", promptEn: "please", targetEs: "por favor", pronunciation: "pohr fah-VOHR" },
      { id: "L03-04", promptEn: "How much is it?", targetEs: "¿Cuánto es?", pronunciation: "KWAHN-toh ehs" },
      { id: "L03-05", promptEn: "one", targetEs: "uno", pronunciation: "OO-noh" },
      { id: "L03-06", promptEn: "two", targetEs: "dos", pronunciation: "dohs" },
      { id: "L03-07", promptEn: "three", targetEs: "tres", pronunciation: "trehs" },
      { id: "L03-08", promptEn: "water", targetEs: "agua", pronunciation: "AH-gwah" },
      { id: "L03-09", promptEn: "the bill / the check", targetEs: "la cuenta", pronunciation: "lah KWEHN-tah" },
      { id: "L03-10", promptEn: "Thank you very much", targetEs: "Muchas gracias", pronunciation: "MOO-chahs GRAH-see-ahs" },
    ],
  },
  {
    id: "L04",
    title: "¿Dónde queda...?",
    subtitle: "Getting Around",
    icon: "🗺️",
    description: "Asking for directions and navigating San Salvador",
    estimatedMinutes: 14,
    dialogue: {
      context: "You're on the street and need to find a bus stop.",
      lines: [
        { speaker: "B", textEs: "Disculpe, ¿dónde queda la parada de bus?", textEn: "Excuse me, where is the bus stop?" },
        { speaker: "A", textEs: "Queda cerca. Andá derecho dos cuadras.", textEn: "It's close. Go straight two blocks." },
        { speaker: "B", textEs: "¿A la derecha o a la izquierda?", textEn: "To the right or to the left?" },
        { speaker: "A", textEs: "Derecho, y después a la izquierda.", textEn: "Straight, and then to the left." },
      ],
    },
    newItems: [
      { id: "L04-01", promptEn: "Excuse me (formal)", targetEs: "Disculpe", pronunciation: "dees-KOOL-peh" },
      { id: "L04-02", promptEn: "Where is...?", targetEs: "¿Dónde queda...?", pronunciation: "DOHN-deh KEH-dah", culturalNote: "'Quedar' is used more than 'estar' for locations in SV" },
      { id: "L04-03", promptEn: "Go straight (informal/vos)", targetEs: "Andá derecho", standardEs: "Ve derecho", pronunciation: "ahn-DAH deh-REH-choh", culturalNote: "Vos imperative: andá (not ve)" },
      { id: "L04-04", promptEn: "to the right", targetEs: "a la derecha", pronunciation: "ah lah deh-REH-chah" },
      { id: "L04-05", promptEn: "to the left", targetEs: "a la izquierda", pronunciation: "ah lah ees-kee-EHR-dah" },
      { id: "L04-06", promptEn: "close / nearby", targetEs: "cerca", pronunciation: "SEHR-kah" },
      { id: "L04-07", promptEn: "far", targetEs: "lejos", pronunciation: "LEH-hohs" },
      { id: "L04-08", promptEn: "the bus stop", targetEs: "la parada de bus", pronunciation: "lah pah-RAH-dah deh boos" },
      { id: "L04-09", promptEn: "block (city block)", targetEs: "cuadra", pronunciation: "KWAH-drah" },
      { id: "L04-10", promptEn: "Thank you, you're very kind", targetEs: "Gracias, muy amable", pronunciation: "GRAH-see-ahs, mooy ah-MAH-bleh" },
    ],
  },
  {
    id: "L05",
    title: "La familia",
    subtitle: "Family & Relationships",
    icon: "👨‍👩‍👧‍👦",
    description: "Family terms, possessives, and tener with vos",
    estimatedMinutes: 14,
    dialogue: {
      context: "Your new friend Carlos is showing you photos on his phone.",
      lines: [
        { speaker: "A", textEs: "Mirá, esta es mi familia.", textEn: "Look, this is my family." },
        { speaker: "B", textEs: "¡Qué chivo! ¿Tenés hermanos?", textEn: "Cool! Do you have siblings?" },
        { speaker: "A", textEs: "Sí, tengo dos hermanas y un cipote.", textEn: "Yes, I have two sisters and a little brother." },
        { speaker: "B", textEs: "Yo también tengo hermanos.", textEn: "I also have siblings." },
      ],
    },
    newItems: [
      { id: "L05-01", promptEn: "Look! (informal/vos)", targetEs: "¡Mirá!", standardEs: "¡Mira!", pronunciation: "mee-RAH", culturalNote: "Vos imperative — very common in daily SV speech" },
      { id: "L05-02", promptEn: "my family", targetEs: "mi familia", pronunciation: "mee fah-MEE-lee-ah" },
      { id: "L05-03", promptEn: "Do you have...? (informal/vos)", targetEs: "¿Tenés...?", standardEs: "¿Tienes...?", pronunciation: "teh-NEHS", culturalNote: "Vos conjugation of tener" },
      { id: "L05-04", promptEn: "brother / sister", targetEs: "hermano / hermana", pronunciation: "ehr-MAH-noh / ehr-MAH-nah" },
      { id: "L05-05", promptEn: "kid / child (SV slang)", targetEs: "cipote / cipota", standardEs: "niño / niña", pronunciation: "see-POH-teh / see-POH-tah", culturalNote: "Classic caliche — every Salvadoran knows this word" },
      { id: "L05-06", promptEn: "mom / dad", targetEs: "mamá / papá", pronunciation: "mah-MAH / pah-PAH" },
      { id: "L05-07", promptEn: "I have", targetEs: "Tengo", pronunciation: "TEHN-goh" },
      { id: "L05-08", promptEn: "also / too", targetEs: "también", pronunciation: "tahm-bee-EHN" },
      { id: "L05-09", promptEn: "my friend (male/female)", targetEs: "mi amigo / mi amiga", pronunciation: "mee ah-MEE-goh / ah-MEE-gah" },
      { id: "L05-10", promptEn: "Alright then / Okay", targetEs: "Va pues", pronunciation: "vah pwehs", culturalNote: "Quintessential Salvadoran expression — used to agree, confirm, or say goodbye" },
    ],
  },
];

// ============================================================
// GIR SCHEDULING — Build lesson sequence with spaced reviews
// ============================================================

function buildLessonSequence(newItems) {
  const sequence = [];
  const reviewQueue = [];
  const intervals = [2, 4, 8, 15];
  let position = 0;

  for (let i = 0; i < newItems.length; i++) {
    // Insert due reviews before new item
    while (reviewQueue.length > 0 && reviewQueue[0].nextAt <= position) {
      const review = reviewQueue.shift();
      sequence.push({ ...review.item, type: "review", reviewNum: review.reviewNum });
      const nextIdx = intervals.indexOf(review.interval);
      if (nextIdx < intervals.length - 1) {
        reviewQueue.push({
          item: review.item,
          interval: intervals[nextIdx + 1],
          nextAt: position + intervals[nextIdx + 1],
          reviewNum: review.reviewNum + 1,
        });
        reviewQueue.sort((a, b) => a.nextAt - b.nextAt);
      }
      position++;
    }

    // Add new item
    sequence.push({ ...newItems[i], type: "new" });
    position++;

    // Schedule first review
    reviewQueue.push({
      item: newItems[i],
      interval: intervals[0],
      nextAt: position + intervals[0],
      reviewNum: 1,
    });
    reviewQueue.sort((a, b) => a.nextAt - b.nextAt);
  }

  // Drain remaining reviews (cap at 10 extra)
  let extra = 0;
  while (reviewQueue.length > 0 && extra < 10) {
    const review = reviewQueue.shift();
    sequence.push({ ...review.item, type: "review", reviewNum: review.reviewNum });
    extra++;
  }

  return sequence;
}

// ============================================================
// TTS WRAPPER — Voice-aware with picker support
// ============================================================

// Get all available Spanish voices, sorted by quality
function getSpanishVoices() {
  if (!window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  const spanishVoices = voices.filter((v) =>
    v.lang.startsWith("es")
  );
  // Sort: prefer premium/neural voices (non-compact, Google, Microsoft)
  return spanishVoices.sort((a, b) => {
    const scoreVoice = (v) => {
      let s = 0;
      const name = v.name.toLowerCase();
      if (name.includes("google")) s += 10;
      if (name.includes("neural") || name.includes("natural")) s += 10;
      if (name.includes("premium")) s += 8;
      if (name.includes("enhanced")) s += 5;
      if (name.includes("compact")) s -= 10;
      // Prefer Latin American locales
      if (v.lang === "es-419" || v.lang === "es-MX") s += 3;
      if (v.lang === "es-US") s += 2;
      return s;
    };
    return scoreVoice(b) - scoreVoice(a);
  });
}

function getEnglishVoices() {
  if (!window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  return voices.filter((v) => v.lang.startsWith("en")).sort((a, b) => {
    const scoreVoice = (v) => {
      let s = 0;
      const name = v.name.toLowerCase();
      if (name.includes("google")) s += 10;
      if (name.includes("neural") || name.includes("natural")) s += 10;
      if (name.includes("premium")) s += 8;
      if (name.includes("enhanced")) s += 5;
      if (name.includes("compact")) s -= 10;
      if (v.lang === "en-US") s += 3;
      return s;
    };
    return scoreVoice(b) - scoreVoice(a);
  });
}

function speakWithVoice(text, voice, rate = 0.85) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }
    utterance.rate = rate;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    window.speechSynthesis.speak(utterance);
  });
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================

export default function HablaGuanaca() {
  // App state
  const [screen, setScreen] = useState("home"); // home | lesson | complete
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState({});

  // Lesson engine state
  const [sequence, setSequence] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState("intro"); // intro | prompt | anticipate | reveal
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [pauseDuration, setPauseDuration] = useState(4);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [showPronunciation, setShowPronunciation] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  // Voice selection
  const [spanishVoices, setSpanishVoices] = useState([]);
  const [englishVoices, setEnglishVoices] = useState([]);
  const [selectedSpanishVoice, setSelectedSpanishVoice] = useState(null);
  const [selectedEnglishVoice, setSelectedEnglishVoice] = useState(null);

  // Timer
  const [timer, setTimer] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const isHoldingRef = useRef(false);
  const timerRef = useRef(null);
  const isMountedRef = useRef(true);

  const holdTimer = useCallback((e) => {
    // Capture the pointer so we always get the matching release event,
    // even if the finger drifts off this element while held.
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch {}
    isHoldingRef.current = true;
    setIsHolding(true);
  }, []);
  const releaseTimer = useCallback(() => {
    isHoldingRef.current = false;
    setIsHolding(false);
  }, []);

  useEffect(() => {
    // Load voices — browsers load them async
    const loadVoices = () => {
      const es = getSpanishVoices();
      const en = getEnglishVoices();
      if (es.length > 0) {
        setSpanishVoices(es);
        setSelectedSpanishVoice((prev) => prev || es[0]);
      }
      if (en.length > 0) {
        setEnglishVoices(en);
        setSelectedEnglishVoice((prev) => prev || en[0]);
      }
    };
    if (window.speechSynthesis) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      isMountedRef.current = false;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Start a lesson
  const startLesson = useCallback((lesson) => {
    const seq = buildLessonSequence(lesson.newItems);
    setSelectedLesson(lesson);
    setSequence(seq);
    setCurrentIdx(0);
    setPhase("intro");
    setScore({ correct: 0, total: 0 });
    setScreen("lesson");
    setIsPaused(false);
  }, []);

  // Phase transitions
  const goToPrompt = useCallback(async () => {
    setPhase("prompt");
    const item = sequence[currentIdx];
    if (item && ttsEnabled) {
      await speakWithVoice(item.promptEn, selectedEnglishVoice, speechRate);
    }
    if (autoAdvance && isMountedRef.current) {
      setTimeout(() => {
        if (isMountedRef.current) setPhase("anticipate");
      }, 800);
    }
  }, [sequence, currentIdx, ttsEnabled, speechRate, autoAdvance, selectedEnglishVoice]);

  // Start anticipation timer
  useEffect(() => {
    if (phase === "anticipate" && !isPaused) {
      setTimer(pauseDuration);
      timerRef.current = setInterval(() => {
        // Press-and-hold freezes the countdown; release resumes from here
        if (isHoldingRef.current) return;
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setPhase("reveal");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      isHoldingRef.current = false;
      setIsHolding(false);
    };
  }, [phase, isPaused, pauseDuration]);

  // Play Spanish audio on reveal
  useEffect(() => {
    if (phase === "reveal" && ttsEnabled) {
      const item = sequence[currentIdx];
      if (item) speakWithVoice(item.targetEs, selectedSpanishVoice, speechRate);
    }
  }, [phase]);

  const nextItem = useCallback(() => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (currentIdx + 1 >= sequence.length) {
      setCompletedLessons((prev) => ({ ...prev, [selectedLesson.id]: true }));
      setScreen("complete");
    } else {
      setCurrentIdx((i) => i + 1);
      setPhase("prompt");
      // Trigger prompt for next item
      setTimeout(async () => {
        const nextItemData = sequence[currentIdx + 1];
        if (nextItemData && ttsEnabled && isMountedRef.current) {
          await speakWithVoice(nextItemData.promptEn, selectedEnglishVoice, speechRate);
        }
        if (autoAdvance && isMountedRef.current) {
          setTimeout(() => {
            if (isMountedRef.current) setPhase("anticipate");
          }, 800);
        }
      }, 300);
    }
  }, [currentIdx, sequence, selectedLesson, ttsEnabled, speechRate, autoAdvance, selectedEnglishVoice]);

  const skipToReveal = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(0);
    setPhase("reveal");
  }, []);

  const replayAudio = useCallback(() => {
    const item = sequence[currentIdx];
    if (!item || !ttsEnabled) return;
    if (phase === "prompt") speakWithVoice(item.promptEn, selectedEnglishVoice, speechRate);
    else speakWithVoice(item.targetEs, selectedSpanishVoice, speechRate);
  }, [sequence, currentIdx, phase, ttsEnabled, speechRate, selectedEnglishVoice, selectedSpanishVoice]);

  const currentItem = sequence[currentIdx] || null;
  const progress = sequence.length > 0 ? ((currentIdx + 1) / sequence.length) * 100 : 0;

  // ============================================================
  // RENDER
  // ============================================================

  // ---------- HOME SCREEN ----------
  if (screen === "home") {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-4 max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h1 className="text-3xl font-bold mb-1">
            <span className="text-blue-400">Habla</span>{" "}
            <span className="text-emerald-400">Guanaca</span>
          </h1>
          <p className="text-gray-400 text-sm">Salvadoran Spanish · Pimsleur Method</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Headphones size={12} /> Audio-first</span>
            <span className="flex items-center gap-1"><RefreshCw size={12} /> Spaced repetition</span>
            <span className="flex items-center gap-1"><BookOpen size={12} /> Voseo</span>
          </div>
        </div>

        {/* Settings gear */}
        <button
          onClick={() => setShowSettings(true)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Settings size={20} />
        </button>

        {/* Lesson cards */}
        <div className="space-y-3">
          {LESSONS.map((lesson, idx) => {
            const isCompleted = completedLessons[lesson.id];
            const isLocked = idx > 0 && !completedLessons[LESSONS[idx - 1].id] && idx > 1;
            return (
              <button
                key={lesson.id}
                onClick={() => !isLocked && startLesson(lesson)}
                disabled={isLocked}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isLocked
                    ? "border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed"
                    : isCompleted
                    ? "border-emerald-800 bg-emerald-950/30 hover:bg-emerald-950/50"
                    : "border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lesson.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{lesson.title}</span>
                      {isCompleted && <Check size={14} className="text-emerald-400" />}
                    </div>
                    <p className="text-gray-400 text-xs">{lesson.subtitle}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{lesson.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-600 text-xs flex items-center gap-1">
                      <Clock size={10} /> {lesson.estimatedMinutes}m
                    </span>
                    {!isLocked && (
                      <ChevronRight size={16} className="text-gray-600 mt-1 ml-auto" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Voseo explainer */}
        <div className="mt-6 p-3 bg-blue-950/30 border border-blue-900/50 rounded-lg">
          <p className="text-xs text-blue-300 font-semibold mb-1">🇸🇻 Why Salvadoran Spanish?</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Salvadorans use <span className="text-blue-300 font-medium">vos</span> instead of tú.
            You'll say "vos sos" not "tú eres," and "¿cómo estás vos?" not "¿cómo estás tú?"
            Plus local slang called <span className="text-emerald-300 font-medium">caliche</span> that
            you won't find in textbooks.
          </p>
        </div>

        {/* Settings modal */}
        {showSettings && (
          <SettingsModal
            {...{ pauseDuration, setPauseDuration, speechRate, setSpeechRate, showPronunciation, setShowPronunciation, autoAdvance, setAutoAdvance, ttsEnabled, setTtsEnabled, spanishVoices, englishVoices, selectedSpanishVoice, setSelectedSpanishVoice, selectedEnglishVoice, setSelectedEnglishVoice }}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    );
  }

  // ---------- LESSON SCREEN ----------
  if (screen === "lesson") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col max-w-lg mx-auto">
        {/* Top bar */}
        <div className="p-3 flex items-center gap-3">
          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              setScreen("home");
            }}
            className="p-1.5 text-gray-500 hover:text-gray-300"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">{selectedLesson?.title}</span>
              <span className="text-xs text-gray-500">{currentIdx + 1}/{sequence.length}</span>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 text-gray-500 hover:text-gray-300"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Content area */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-6"
          {...(phase === "anticipate"
            ? {
                // Pointer events unify mouse + touch into one stream, so the
                // browser's legacy compatibility mouse-events (fired ~300ms
                // after a touch) can't spuriously trigger a release mid-hold.
                onPointerDown: holdTimer,
                onPointerUp: releaseTimer,
                onPointerCancel: releaseTimer,
                onContextMenu: (e) => e.preventDefault(),
                style: { touchAction: "none" },
              }
            : {})}
        >
          {/* INTRO PHASE */}
          {phase === "intro" && selectedLesson?.dialogue && (
            <div className="w-full max-w-md">
              <div className="text-center mb-6">
                <span className="text-4xl mb-3 block">{selectedLesson.icon}</span>
                <h2 className="text-xl font-bold">{selectedLesson.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{selectedLesson.subtitle}</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 mb-4 border border-gray-800">
                <p className="text-xs text-gray-400 mb-3 italic">{selectedLesson.dialogue.context}</p>
                {selectedLesson.dialogue.lines.map((line, i) => (
                  <div key={i} className={`flex mb-2 ${line.speaker === "B" ? "justify-end" : ""}`}>
                    <div className={`max-w-xs p-2.5 rounded-lg text-sm ${
                      line.speaker === "A"
                        ? "bg-gray-800 text-gray-200"
                        : "bg-blue-900/50 text-blue-200"
                    }`}>
                      <p className="font-medium">{line.textEs}</p>
                      <p className="text-xs opacity-60 mt-0.5">{line.textEn}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-500 text-xs mb-4">
                You'll learn each phrase from this conversation
              </p>
              <button
                onClick={goToPrompt}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Play size={18} /> Start Lesson
              </button>
            </div>
          )}

          {/* PROMPT PHASE */}
          {phase === "prompt" && currentItem && (
            <div className="w-full max-w-md text-center">
              {currentItem.type === "review" && (
                <span className="inline-block px-2 py-0.5 bg-amber-900/30 border border-amber-800/50 text-amber-400 text-xs rounded-full mb-4">
                  <RefreshCw size={10} className="inline mr-1" /> Review
                </span>
              )}
              {currentItem.type === "new" && (
                <span className="inline-block px-2 py-0.5 bg-blue-900/30 border border-blue-800/50 text-blue-400 text-xs rounded-full mb-4">
                  <Star size={10} className="inline mr-1" /> New
                </span>
              )}
              <p className="text-gray-400 text-sm mb-2">How do you say:</p>
              <h2 className="text-3xl font-bold text-white mb-6">{currentItem.promptEn}</h2>
              {!autoAdvance && (
                <button
                  onClick={() => setPhase("anticipate")}
                  className="mt-4 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  I'm ready →
                </button>
              )}
            </div>
          )}

          {/* ANTICIPATION PHASE */}
          {phase === "anticipate" && currentItem && (
            <div className="w-full max-w-md text-center">
              <p className="text-gray-500 text-xs mb-4 uppercase tracking-wider">Think or say it aloud...</p>
              <h2 className="text-3xl font-bold text-white mb-8">{currentItem.promptEn}</h2>
              {/* Timer ring — tap & hold anywhere on screen to pause, release to resume */}
              <div className="relative w-24 h-24 mx-auto mb-2 select-none pointer-events-none">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke={isHolding ? "#f59e0b" : "#3b82f6"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * timer) / pauseDuration}
                    className="transition-all duration-1000"
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${isHolding ? "text-amber-400" : "text-blue-400"}`}>
                  {timer}
                </span>
              </div>
              <p className={`text-[11px] mb-4 h-4 select-none pointer-events-none transition-colors ${isHolding ? "text-amber-400" : "text-gray-600"}`}>
                {isHolding ? "⏸ Paused — release to resume" : "Tap & hold anywhere to pause"}
              </p>
              <button
                onClick={skipToReveal}
                onPointerDown={(e) => e.stopPropagation()}
                className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-400 transition-colors flex items-center gap-2 mx-auto"
              >
                <SkipForward size={14} /> Show answer
              </button>
            </div>
          )}

          {/* REVEAL PHASE */}
          {phase === "reveal" && currentItem && (
            <div className="w-full max-w-md text-center">
              <p className="text-gray-500 text-xs mb-2">{currentItem.promptEn}</p>
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">{currentItem.targetEs}</h2>
              {showPronunciation && currentItem.pronunciation && (
                <p className="text-gray-500 text-sm mb-3 font-mono">/{currentItem.pronunciation}/</p>
              )}
              {currentItem.standardEs && (
                <p className="text-xs text-gray-600 mb-2">
                  Textbook Spanish: <span className="text-gray-400">{currentItem.standardEs}</span>
                </p>
              )}
              {currentItem.culturalNote && (
                <div className="bg-blue-950/30 border border-blue-900/40 rounded-lg p-2.5 mb-4 mx-auto max-w-xs">
                  <p className="text-xs text-blue-300">🇸🇻 {currentItem.culturalNote}</p>
                </div>
              )}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={replayAudio}
                  className="p-3 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                  title="Replay audio"
                >
                  <Volume2 size={18} className="text-gray-300" />
                </button>
                <button
                  onClick={nextItem}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                >
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings modal */}
        {showSettings && (
          <SettingsModal
            {...{ pauseDuration, setPauseDuration, speechRate, setSpeechRate, showPronunciation, setShowPronunciation, autoAdvance, setAutoAdvance, ttsEnabled, setTtsEnabled, spanishVoices, englishVoices, selectedSpanishVoice, setSelectedSpanishVoice, selectedEnglishVoice, setSelectedEnglishVoice }}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    );
  }

  // ---------- COMPLETE SCREEN ----------
  if (screen === "complete") {
    const totalNew = sequence.filter((s) => s.type === "new").length;
    const totalReviews = sequence.filter((s) => s.type === "review").length;
    const nextLessonIdx = LESSONS.findIndex((l) => l.id === selectedLesson?.id) + 1;
    const nextLesson = nextLessonIdx < LESSONS.length ? LESSONS[nextLessonIdx] : null;

    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 max-w-lg mx-auto">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-1">¡Chivo!</h2>
          <p className="text-gray-400 mb-6">You completed {selectedLesson?.title}</p>

          <div className="bg-gray-900 rounded-xl p-4 mb-6 border border-gray-800 inline-block">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-400">{totalNew}</p>
                <p className="text-xs text-gray-500">New phrases</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-400">{totalReviews}</p>
                <p className="text-xs text-gray-500">Reviews</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 w-full max-w-xs mx-auto">
            <button
              onClick={() => startLesson(selectedLesson)}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <RotateCcw size={16} /> Practice Again
            </button>
            {nextLesson && (
              <button
                onClick={() => startLesson(nextLesson)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Next: {nextLesson.title} <ChevronRight size={16} />
              </button>
            )}
            <button
              onClick={() => setScreen("home")}
              className="w-full py-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Back to lessons
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ============================================================
// SETTINGS MODAL
// ============================================================

function SettingsModal({ pauseDuration, setPauseDuration, speechRate, setSpeechRate, showPronunciation, setShowPronunciation, autoAdvance, setAutoAdvance, ttsEnabled, setTtsEnabled, spanishVoices, englishVoices, selectedSpanishVoice, setSelectedSpanishVoice, selectedEnglishVoice, setSelectedEnglishVoice, onClose }) {
  const previewVoice = (voice, text) => {
    speakWithVoice(text, voice, 0.85);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-sm border border-gray-800 overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 shrink-0">
          <h3 className="font-semibold text-white">Settings</h3>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-300">
            <X size={18} />
          </button>
        </div>
        <div className="p-4 space-y-5 overflow-y-auto">
          {/* Spanish voice picker */}
          <div>
            <label className="text-sm text-gray-300 block mb-1.5">Spanish voice</label>
            <div className="space-y-1">
              {spanishVoices.map((voice, i) => (
                <button
                  key={voice.name + i}
                  onClick={() => {
                    setSelectedSpanishVoice(voice);
                    previewVoice(voice, "¿Cómo estás vos?");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedSpanishVoice?.name === voice.name
                      ? "bg-blue-900/50 border border-blue-700 text-blue-200"
                      : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-750"
                  }`}
                >
                  <div>
                    <span className="font-medium">{voice.name.replace(/Microsoft |Google |Apple /gi, "")}</span>
                    <span className="text-gray-500 ml-1.5">{voice.lang}</span>
                  </div>
                  {selectedSpanishVoice?.name === voice.name && <Check size={12} className="text-blue-400" />}
                </button>
              ))}
              {spanishVoices.length === 0 && (
                <p className="text-xs text-gray-500 italic">No Spanish voices found — TTS may not work</p>
              )}
            </div>
          </div>

          {/* English voice picker */}
          <div>
            <label className="text-sm text-gray-300 block mb-1.5">English voice</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {englishVoices.slice(0, 8).map((voice, i) => (
                <button
                  key={voice.name + i}
                  onClick={() => {
                    setSelectedEnglishVoice(voice);
                    previewVoice(voice, "How are you?");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedEnglishVoice?.name === voice.name
                      ? "bg-blue-900/50 border border-blue-700 text-blue-200"
                      : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-750"
                  }`}
                >
                  <div>
                    <span className="font-medium">{voice.name.replace(/Microsoft |Google |Apple /gi, "")}</span>
                    <span className="text-gray-500 ml-1.5">{voice.lang}</span>
                  </div>
                  {selectedEnglishVoice?.name === voice.name && <Check size={12} className="text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pause duration */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm text-gray-300">Thinking time</label>
              <span className="text-sm text-blue-400 font-mono">{pauseDuration}s</span>
            </div>
            <input
              type="range" min="2" max="8" value={pauseDuration}
              onChange={(e) => setPauseDuration(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-0.5">
              <span>Quick</span><span>Relaxed</span>
            </div>
          </div>

          {/* Speech rate */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm text-gray-300">Speech speed</label>
              <span className="text-sm text-blue-400 font-mono">{speechRate}x</span>
            </div>
            <input
              type="range" min="0.5" max="1.2" step="0.05" value={speechRate}
              onChange={(e) => setSpeechRate(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-0.5">
              <span>Slow</span><span>Natural</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <ToggleRow label="Pronunciation guide" checked={showPronunciation} onChange={setShowPronunciation} />
            <ToggleRow label="Auto-advance" checked={autoAdvance} onChange={setAutoAdvance} />
            <ToggleRow label="Text-to-speech" checked={ttsEnabled} onChange={setTtsEnabled} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative ${
          checked ? "bg-blue-600" : "bg-gray-700"
        }`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
          checked ? "left-5" : "left-0.5"
        }`} />
      </button>
    </div>
  );
}
