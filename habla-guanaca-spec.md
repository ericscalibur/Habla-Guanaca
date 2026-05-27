# Habla Guanaca — Architecture Spec
### A Pimsleur-Style Spanish Learning App (Salvadoran Dialect)
**Version:** 0.1 MVP — May 2026

---

## 1. Product Vision

Habla Guanaca is an audio-first, spaced-repetition language learning app that teaches conversational Salvadoran Spanish ("caliche") using the Pimsleur method. It runs as a self-contained React artifact (single `.jsx` file) with no backend, designed for rapid prototyping and iteration inside Claude's artifact renderer.

The name "Guanaca" is the colloquial term Salvadorans use for themselves — it signals immediately that this isn't textbook Spanish.

---

## 2. Core Methodology (Pimsleur Principles)

The app faithfully implements four pillars of Dr. Paul Pimsleur's research:

### 2.1 Graduated Interval Recall (GIR)

Words and phrases are re-tested at expanding intervals following Pimsleur's 1967 memory schedule:

```
5s → 25s → 2min → 10min → 1hr → 5hr → 1 day → 5 days → 25 days → 4 months
```

For the MVP (single-session, no persistence), we compress this to an in-lesson schedule:

```
Immediate → +2 items → +5 items → +12 items → end-of-lesson review
```

Each "item" is a prompt-response pair. The schedule ensures a word introduced early reappears at widening gaps throughout the 15–20 minute lesson.

### 2.2 Anticipation (Challenge-Response)

Every interaction follows a three-beat pattern:

1. **Prompt** — English phrase or contextual cue (audio + text on screen)
2. **Pause** — Timed silence (3–5 seconds) where the learner mentally formulates or speaks aloud
3. **Reveal** — Correct Salvadoran Spanish (audio + text) so the learner can self-check

The learner is never passively listening. The pause forces active retrieval.

### 2.3 Core Vocabulary

Pimsleur teaches the most frequent and immediately useful words first. For Salvadoran Spanish, this means:

- Common greetings using voseo ("¿Cómo estás vos?")
- Survival phrases (directions, food, numbers, time)
- High-frequency verbs conjugated in the vos form
- Culturally relevant vocabulary (pupusas, colón→dollar transition, local food, family terms)

### 2.4 Organic Learning

New material is introduced inside a conversational context, not in isolation. A lesson might teach "¿Cuánto cuesta?" not as a flashcard but embedded in a dialogue about buying pupusas at a market stall.

---

## 3. Salvadoran Spanish — Linguistic Scope

### 3.1 Voseo (Primary Differentiator)

Salvadoran Spanish uses **vos** instead of **tú** for informal second-person singular. This changes verb conjugations:

| Standard (tú) | Salvadoran (vos) | English |
|---|---|---|
| tú hablas | vos hablás | you speak |
| tú comes | vos comés | you eat |
| tú tienes | vos tenés | you have |
| tú eres | vos sos | you are |
| tú vienes | vos venís | you come |

The app teaches vos-form conjugations as the default, with tú noted as "textbook Spanish" for awareness.

### 3.2 Phonological Features

- **S-aspiration / deletion**: Word-final /s/ is often aspirated to [h] or dropped entirely. "Estamos" → "ehtamoh" or "etamo"
- **Nahuatl-origin sounds**: The /ts/ affricate and /tl/ cluster in loanwords (e.g., "elote," "atol")
- **Yeísmo**: /ll/ and /y/ merge (standard across Latin America)

### 3.3 Caliche Vocabulary (MVP Set)

Essential Salvadoran slang for the MVP:

| Caliche | Standard Spanish | English |
|---|---|---|
| cipote/cipota | niño/niña | kid / boy / girl |
| chivo/chiva | genial / cool | cool / awesome |
| pisto | dinero | money |
| pupusa | — | stuffed tortilla (national dish) |
| chele/chela | rubio/a, gringo/a | light-skinned / foreigner |
| bicho/bicha | tipo/tipa | guy / girl |
| chucho | perro | dog |
| maje | — | dude (casual) |
| va pues | está bien | alright / okay then |
| ¡Qué ondas! | ¿Qué tal? | What's up! |
| fijate que... | mira que... | check it out / listen... |
| de a huevo | de verdad | for real |
| cherada | tontería | silly thing |

### 3.4 Cultural Context

Lessons embed Salvadoran cultural references:
- Ordering pupusas (revueltas, frijol con queso, loroco)
- Navigating markets and street vendors
- Family structures and terms of endearment
- Salvadoran currency context (USD since 2001, but old colón references persist)
- Common expressions of politeness and respect

---

## 4. Application Architecture

### 4.1 Platform Constraints

The app runs as a **React JSX artifact** inside Claude's renderer. This means:

- Single `.jsx` file, default export
- No `localStorage` or `sessionStorage` (must use React state)
- Available libraries: React (with hooks), Tailwind CSS (utility classes only), lucide-react, recharts, lodash, d3
- External CDN scripts from `cdnjs.cloudflare.com` only
- No backend, no API calls from within the artifact
- Audio via Web Speech API (`window.speechSynthesis`) — available in most browsers

### 4.2 High-Level Component Tree

```
<App>
├── <LessonSelector />          // Choose lesson from available set
├── <LessonEngine />            // Core lesson state machine
│   ├── <AudioPlayer />         // TTS wrapper + timing control
│   ├── <PromptCard />          // Shows English prompt during challenge phase
│   ├── <PauseTimer />          // Visual countdown during anticipation phase
│   ├── <RevealCard />          // Shows Spanish answer with pronunciation guide
│   └── <ProgressBar />         // Lesson completion + GIR schedule visualization
├── <LessonComplete />          // End-of-lesson summary + stats
└── <SettingsPanel />           // Voice speed, pause duration, text visibility toggles
```

### 4.3 State Machine (Lesson Engine)

The lesson engine is a finite state machine with these states:

```
IDLE → LESSON_INTRO → PROMPT → ANTICIPATION → REVEAL → [PROMPT | LESSON_REVIEW | LESSON_COMPLETE]
```

**State transitions:**

| State | Duration | User Action | Next State |
|---|---|---|---|
| `IDLE` | — | Select lesson | `LESSON_INTRO` |
| `LESSON_INTRO` | ~10s | Auto-advance or tap | `PROMPT` |
| `PROMPT` | 2–4s (TTS duration) | — | `ANTICIPATION` |
| `ANTICIPATION` | 3–5s (configurable) | Tap to skip | `REVEAL` |
| `REVEAL` | 3–5s (TTS + display) | Tap to continue | `PROMPT` or `LESSON_REVIEW` |
| `LESSON_REVIEW` | varies | Complete review | `LESSON_COMPLETE` |
| `LESSON_COMPLETE` | — | Select next lesson | `IDLE` |

### 4.4 Data Model — Lesson Content

```typescript
type LessonItem = {
  id: string;                    // e.g., "L01-003"
  type: "new" | "review";       // new introduction vs. GIR review
  promptEn: string;             // English prompt text
  targetEs: string;             // Salvadoran Spanish answer
  standardEs?: string;          // Standard Spanish equivalent (if different)
  pronunciation?: string;       // IPA or simplified pronunciation guide
  culturalNote?: string;        // Optional context about Salvadoran usage
  girInterval: number;          // Items until next review (GIR schedule position)
};

type Lesson = {
  id: string;                   // e.g., "L01"
  title: string;                // e.g., "Greetings & Meeting People"
  description: string;          // Brief lesson overview
  estimatedMinutes: number;     // Target: 15–20 minutes
  items: LessonItem[];          // Ordered sequence including GIR-scheduled reviews
  dialogue?: DialogueScene;     // Optional opening/closing dialogue
};

type DialogueScene = {
  context: string;              // Scene description
  lines: {
    speaker: "A" | "B";
    textEs: string;
    textEn: string;
  }[];
};
```

### 4.5 GIR Scheduling Algorithm

```javascript
function buildLessonSequence(newItems, reviewItems) {
  const sequence = [];
  const reviewQueue = []; // priority queue sorted by nextAppearance

  // Interleave new items with GIR-scheduled reviews
  let position = 0;
  for (const item of newItems) {
    // Insert any reviews due at this position
    while (reviewQueue.length > 0 && reviewQueue[0].nextAt <= position) {
      const review = reviewQueue.shift();
      sequence.push({ ...review.item, type: "review" });
      // Schedule next review at expanded interval
      const nextInterval = expandInterval(review.interval);
      reviewQueue.push({
        item: review.item,
        interval: nextInterval,
        nextAt: position + nextInterval
      });
      reviewQueue.sort((a, b) => a.nextAt - b.nextAt);
      position++;
    }

    // Introduce new item
    sequence.push({ ...item, type: "new" });
    position++;

    // Schedule its first review (2 items later)
    reviewQueue.push({
      item,
      interval: 2,
      nextAt: position + 2
    });
    reviewQueue.sort((a, b) => a.nextAt - b.nextAt);
  }

  // Drain remaining reviews
  while (reviewQueue.length > 0) {
    const review = reviewQueue.shift();
    sequence.push({ ...review.item, type: "review" });
  }

  return sequence;
}

function expandInterval(current) {
  // Compressed Pimsleur schedule for in-lesson use
  const schedule = [2, 5, 12, 25];
  const idx = schedule.indexOf(current);
  return idx < schedule.length - 1 ? schedule[idx + 1] : 25;
}
```

---

## 5. Audio / TTS Strategy

### 5.1 MVP: Web Speech API

For the artifact MVP, we use the browser's built-in `window.speechSynthesis`:

```javascript
function speak(text, lang = "es-419", rate = 0.85) {
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;   // es-419 = Latin American Spanish
    utterance.rate = rate;    // Slightly slower for learners
    utterance.onend = resolve;
    window.speechSynthesis.speak(utterance);
  });
}
```

**Language codes to try (in priority order):**
1. `es-SV` — Salvadoran Spanish (rarely available)
2. `es-419` — Latin American Spanish (good coverage)
3. `es-MX` — Mexican Spanish (widely available, closest proxy)
4. `es` — Generic Spanish (fallback)

**Limitations:**
- Voice quality varies dramatically by browser/OS
- No Salvadoran-specific voice exists in any browser's built-in set
- Pronunciation of caliche terms will be approximate at best
- Chrome on desktop typically has the best Latin American Spanish voices

### 5.2 Future: Cloud TTS (Post-MVP)

When moving beyond the artifact to a hosted app, the recommended upgrade path:

| Service | Salvadoran Support | Price | Notes |
|---|---|---|---|
| **ElevenLabs** | Custom voice cloning from Salvadoran speakers | $5/mo starter, 10K chars free | Best quality, can clone a native speaker's voice |
| **Google Cloud TTS** | es-419 (Latin American), es-US | $4/1M chars | Neural voices, reliable, good API |
| **Amazon Polly** | es-US, es-MX | $4/1M chars | NTTS voices, AWS ecosystem |
| **Azure Cognitive Services** | es-MX, es-US, es-ES (no es-SV) | $15/1M chars | High-quality neural voices; use es-MX as closest proxy |
| **SpeechGen** | 20+ Latin American varieties | Pay-per-use | Pre-generate audio files, no runtime API needed |

**Recommended post-MVP approach:** No major TTS provider currently offers an explicit `es-SV` (Salvadoran) locale. The best strategy is **ElevenLabs voice cloning** trained on a native Salvadoran speaker for authentic caliche pronunciation, supplemented by **Google Cloud TTS** or **Azure** (`es-MX` or `es-US`) for standard phrases. Pre-render all audio as `.mp3` files bundled with the app — this removes runtime TTS dependency entirely and lets you hand-tune pronunciation.

### 5.3 Content Sourcing for Audio

For the MVP, all audio is generated at runtime via Web Speech API. For production:

1. **Script all lessons** as structured JSON (see data model above)
2. **Pre-render audio** using Azure TTS (es-SV) for each `targetEs` string
3. **Record native speakers** for caliche-heavy phrases that TTS handles poorly
4. **Store as static assets** — MP3 files named by item ID (e.g., `L01-003.mp3`)

---

## 6. MVP Lesson Content Plan

### 6.1 Lesson Structure (5 Lessons for MVP)

| # | Title | New Items | Key Grammar | Cultural Context |
|---|---|---|---|---|
| L01 | **Mucho gusto — Meeting People** | 8–10 | Greetings, vos sos, me llamo | Formal vs. informal greetings in SV |
| L02 | **¿De dónde sos vos? — Where Are You From?** | 8–10 | Ser (vos form), nationalities, soy de... | Salvadoran diaspora, geography |
| L03 | **Quiero pupusas — Ordering Food** | 8–10 | Querer, pedir, numbers 1–10, ¿cuánto cuesta? | Pupuserías, curtido, market vocabulary |
| L04 | **¿Dónde queda...? — Getting Around** | 8–10 | Directions, estar, ir (vos forms) | Navigating San Salvador, bus system |
| L05 | **La familia — Family & Relationships** | 8–10 | Possessives, tener (vos tenés), family terms | Salvadoran family culture, terms of endearment |

### 6.2 Lesson Flow Example (L01 — first 6 items)

```
1. [NEW]    Prompt: "Hello / Hi"
            Answer: "Hola"
            Note: Same as standard Spanish

2. [NEW]    Prompt: "How are you?" (informal)
            Answer: "¿Cómo estás vos?"
            Standard: "¿Cómo estás tú?"
            Note: In SV, vos replaces tú

3. [REVIEW] Prompt: "Say 'hello' again"
            Answer: "Hola"
            (GIR: reviewing item 1 after 2-item gap)

4. [NEW]    Prompt: "I'm fine / I'm good"
            Answer: "Estoy bien"

5. [REVIEW] Prompt: "How do you ask 'how are you' informally?"
            Answer: "¿Cómo estás vos?"
            (GIR: reviewing item 2 after 3-item gap)

6. [NEW]    Prompt: "My name is..."
            Answer: "Me llamo..."
            
... continues with expanding review intervals ...
```

### 6.3 Content Sourcing Strategy

The lesson content (text) is authored directly — it doesn't require licensing since we're creating original instructional sequences. Sources for vocabulary accuracy:

- **Voseo conjugation tables**: Standard linguistic references for Central American voseo
- **Caliche vocabulary**: Cross-referenced across multiple Salvadoran Spanish resources and native speaker communities
- **Cultural context**: Based on common real-world scenarios in El Salvador
- **Frequency data**: High-frequency word lists for Latin American Spanish, filtered for Salvadoran usage

---

## 7. Dependencies & Tech Stack

### 7.1 MVP (Artifact)

| Dependency | Purpose | Source |
|---|---|---|
| React (hooks) | UI framework | Built into artifact renderer |
| Tailwind CSS | Styling | Built into artifact renderer |
| lucide-react | Icons (play, pause, volume, etc.) | Built into artifact renderer |
| Web Speech API | Text-to-speech | Browser built-in |
| — | No external deps needed | — |

**Total external dependencies: 0** — Everything runs on what's already available in the artifact sandbox.

### 7.2 Production Upgrade Path

| Dependency | Purpose | When Needed |
|---|---|---|
| Next.js or Vite+React | App framework | When moving to hosted app |
| Azure Cognitive Services SDK | TTS with es-SV locale | Replacing Web Speech API |
| ElevenLabs API | Voice cloning for caliche | Authentic pronunciation |
| Supabase or Firebase | User auth + progress persistence | Multi-session progress |
| Zustand or Jotai | State management | When state outgrows useState |
| Howler.js | Audio playback (pre-rendered MP3s) | When using static audio files |
| i18next | Interface localization | If adding UI language options |

---

## 8. UX Design Principles

### 8.1 Visual Design

- **Minimal, focused interface** — one card at a time, no distractions
- **Large, readable text** — the Spanish text is the hero element
- **Color coding** — English prompts in neutral/muted tones, Spanish answers in a vibrant accent color (Salvadoran flag blue: `#0047AB`)
- **Pronunciation guide** below the Spanish text in a lighter weight
- **Progress bar** at the top showing lesson completion
- **Dark mode default** — reduces eye strain during audio-focused sessions

### 8.2 Interaction Model

- **Tap/click to advance** through states (or auto-advance with timer)
- **Settings accessible but not prominent** — speed, pause duration, text visibility
- **No typing required** — this is audio-first, not a quiz app
- **"Repeat" button** — replay current item's audio at any time
- **Speed control** — 0.7x (slow), 0.85x (default), 1.0x (natural) speech rate

### 8.3 Accessibility

- All text visible on screen (not audio-only)
- Keyboard navigation support
- Sufficient color contrast ratios
- Pause timer clearly visible and configurable

---

## 9. Future Roadmap (Post-MVP)

### Phase 2: Enhanced Learning
- Speech recognition for pronunciation checking (Web Speech API `SpeechRecognition`)
- Typing exercises for spelling reinforcement
- Spaced repetition across sessions (requires persistence layer)
- Lesson progress saved to state management

### Phase 3: Full Curriculum
- 30 lessons covering beginner to intermediate
- Grammar explanations (opt-in, not interrupting flow)
- Dialogue mode — full conversations to practice
- Cultural deep-dives (video/image content)

### Phase 4: Platform
- Mobile app (React Native port)
- Offline support with pre-downloaded audio
- Community features — native speaker recordings
- Additional Central American dialects (Guatemalan, Honduran)

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Web Speech API quality varies by browser | Poor pronunciation, robotic sound | Document recommended browsers; design for TTS upgrade path |
| No es-SV TTS voice anywhere | Pronunciation won't be authentically Salvadoran | Use es-419/es-MX as proxy; plan for ElevenLabs voice cloning from native speaker |
| Caliche vocabulary accuracy | Could teach incorrect/outdated slang | Cross-reference multiple sources; plan for native speaker review |
| Artifact sandbox limitations (no persistence) | Progress lost on page reload | Design state for easy serialization; export/import progress JSON |
| Single-file size constraints | Complex app may exceed artifact limits | Lean data structures; paginate lesson content |

---

## 11. Implementation Plan

### Sprint 1 (Now): Foundation
1. Build the lesson engine state machine
2. Implement Web Speech API wrapper with language fallback
3. Create Lesson 1 content (Greetings)
4. Wire up the core PROMPT → ANTICIPATION → REVEAL loop

### Sprint 2: Polish & Content
5. Add GIR scheduling algorithm
6. Build remaining 4 lessons
7. Settings panel (speed, pause duration)
8. Lesson selection screen
9. End-of-lesson summary

### Sprint 3: Enhancement
10. Visual polish (animations, transitions)
11. Pronunciation guides
12. Cultural notes display
13. Progress tracking within session
