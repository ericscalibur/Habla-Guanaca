// =============================================================
// Habla Guanaca — Pack 01: The Basics (Lessons 6-10)
// These get merged into the main pack file after audio generation
// =============================================================

// LESSON 6: Shopping & Haggling
const L06 = {
  id: "L06", title: "¿Cuánto cuesta?", subtitle: "Shopping & Haggling", icon: "🛍️",
  description: "Bargaining at markets, talking prices, and basic shopping", estimatedMinutes: 14,
  dialogue: {
    context: "You're browsing a market stall in Mercado Central, San Salvador.",
    lines: [
      { speaker: "B", textEs: "Buenas. ¿Cuánto cuesta esta camisa?", textEn: "Hi. How much is this shirt?" },
      { speaker: "A", textEs: "Esa vale diez dólares.", textEn: "That one is ten dollars." },
      { speaker: "B", textEs: "¡Uy, está muy caro! ¿Me lo deja en siete?", textEn: "Wow, that's too expensive! Can you do seven?" },
      { speaker: "A", textEs: "Va pues, ocho y se lo lleva.", textEn: "Alright, eight and it's yours." },
      { speaker: "B", textEs: "Dale. Aquí tiene.", textEn: "Deal. Here you go." },
    ],
  },
  newItems: [
    { id: "L06-01", promptEn: "How much does it cost?", targetEs: "¿Cuánto cuesta?", pronunciation: "KWAHN-toh KWEHS-tah" },
    { id: "L06-02", promptEn: "That one (fem/masc)", targetEs: "esa / ese", pronunciation: "EH-sah / EH-seh" },
    { id: "L06-03", promptEn: "It costs / It's worth", targetEs: "vale", pronunciation: "VAH-leh", culturalNote: "More common than 'cuesta' in casual speech" },
    { id: "L06-04", promptEn: "expensive", targetEs: "caro", pronunciation: "KAH-roh" },
    { id: "L06-05", promptEn: "cheap", targetEs: "barato", pronunciation: "bah-RAH-toh" },
    { id: "L06-06", promptEn: "Can you give me a deal?", targetEs: "¿Me lo deja en...?", pronunciation: "meh loh DEH-hah ehn", culturalNote: "Classic haggling phrase — 'can you leave it at...?'" },
    { id: "L06-07", promptEn: "money (SV slang)", targetEs: "pisto", standardEs: "dinero", pronunciation: "PEES-toh", culturalNote: "Very Salvadoran — everyone says pisto instead of dinero" },
    { id: "L06-08", promptEn: "I'll take it / Deal", targetEs: "Dale", pronunciation: "DAH-leh", culturalNote: "Casual agreement — like 'deal' or 'go for it'" },
    { id: "L06-09", promptEn: "five", targetEs: "cinco", pronunciation: "SEEN-koh" },
    { id: "L06-10", promptEn: "ten", targetEs: "diez", pronunciation: "dee-EHS" },
  ],
};

// LESSON 7: Time & Schedules
const L07 = {
  id: "L07", title: "¿Qué hora es?", subtitle: "Time & Schedules", icon: "⏰",
  description: "Telling time, making plans, and talking about your day", estimatedMinutes: 14,
  dialogue: {
    context: "You're making plans with your friend Carlos for tomorrow.",
    lines: [
      { speaker: "A", textEs: "¿Qué hora es?", textEn: "What time is it?" },
      { speaker: "B", textEs: "Son las tres de la tarde.", textEn: "It's three in the afternoon." },
      { speaker: "A", textEs: "¿A qué hora nos vemos mañana?", textEn: "What time do we meet tomorrow?" },
      { speaker: "B", textEs: "Como a las diez de la mañana. ¿Va?", textEn: "Around ten in the morning. Cool?" },
      { speaker: "A", textEs: "Va pues. Ahí nos vemos.", textEn: "Alright then. See you there." },
    ],
  },
  newItems: [
    { id: "L07-01", promptEn: "What time is it?", targetEs: "¿Qué hora es?", pronunciation: "keh OH-rah ehs" },
    { id: "L07-02", promptEn: "It's (time) o'clock", targetEs: "Son las...", pronunciation: "sohn lahs", culturalNote: "Use 'Es la...' only for 1:00, 'Son las...' for everything else" },
    { id: "L07-03", promptEn: "in the morning", targetEs: "de la mañana", pronunciation: "deh lah mah-NYAH-nah" },
    { id: "L07-04", promptEn: "in the afternoon", targetEs: "de la tarde", pronunciation: "deh lah TAHR-deh" },
    { id: "L07-05", promptEn: "at night", targetEs: "de la noche", pronunciation: "deh lah NOH-cheh" },
    { id: "L07-06", promptEn: "tomorrow", targetEs: "mañana", pronunciation: "mah-NYAH-nah" },
    { id: "L07-07", promptEn: "today", targetEs: "hoy", pronunciation: "oy" },
    { id: "L07-08", promptEn: "now / right now", targetEs: "ahorita", standardEs: "ahora", pronunciation: "ah-oh-REE-tah", culturalNote: "Salvadorans love adding -ita/-ito to everything. Ahorita = right now (or soon-ish)" },
    { id: "L07-09", promptEn: "later", targetEs: "después", pronunciation: "dehs-PWEHS" },
    { id: "L07-10", promptEn: "At what time?", targetEs: "¿A qué hora?", pronunciation: "ah keh OH-rah" },
  ],
};

// LESSON 8: Feeling Sick & Health
const L08 = {
  id: "L08", title: "Me siento mal", subtitle: "Health & Feeling Sick", icon: "🤒",
  description: "Describing symptoms, asking for help, visiting a pharmacy", estimatedMinutes: 13,
  dialogue: {
    context: "You're not feeling well and visit a pharmacy.",
    lines: [
      { speaker: "B", textEs: "Buenas. Me siento mal.", textEn: "Hi. I'm not feeling well." },
      { speaker: "A", textEs: "¿Qué le pasa? ¿Qué sentís?", textEn: "What's wrong? What do you feel?" },
      { speaker: "B", textEs: "Me duele la cabeza y tengo fiebre.", textEn: "My head hurts and I have a fever." },
      { speaker: "A", textEs: "Tomá estas pastillas, dos cada ocho horas.", textEn: "Take these pills, two every eight hours." },
    ],
  },
  newItems: [
    { id: "L08-01", promptEn: "I feel bad / I'm not well", targetEs: "Me siento mal", pronunciation: "meh see-EHN-toh mahl" },
    { id: "L08-02", promptEn: "It hurts / My ... hurts", targetEs: "Me duele...", pronunciation: "meh DWEH-leh" },
    { id: "L08-03", promptEn: "head", targetEs: "la cabeza", pronunciation: "lah kah-BEH-sah" },
    { id: "L08-04", promptEn: "stomach", targetEs: "el estómago", pronunciation: "ehl ehs-TOH-mah-goh" },
    { id: "L08-05", promptEn: "I have a fever", targetEs: "Tengo fiebre", pronunciation: "TEHN-goh fee-EH-breh" },
    { id: "L08-06", promptEn: "Take this (vos imperative)", targetEs: "Tomá", standardEs: "Toma", pronunciation: "toh-MAH", culturalNote: "Another vos imperative — tomá, not toma" },
    { id: "L08-07", promptEn: "pills / medicine", targetEs: "pastillas", pronunciation: "pahs-TEE-yahs" },
    { id: "L08-08", promptEn: "I need", targetEs: "Necesito", pronunciation: "neh-seh-SEE-toh" },
    { id: "L08-09", promptEn: "hospital / clinic", targetEs: "el hospital", pronunciation: "ehl ohs-pee-TAHL" },
    { id: "L08-10", promptEn: "help me (vos)", targetEs: "Ayudame", standardEs: "Ayúdame", pronunciation: "ah-yoo-DAH-meh", culturalNote: "In SV, vos imperatives often drop the accent in casual speech" },
  ],
};

// LESSON 9: Weather & Small Talk
const L09 = {
  id: "L09", title: "¡Qué calor!", subtitle: "Weather & Small Talk", icon: "☀️",
  description: "Talking about weather, making small talk, and filling silence", estimatedMinutes: 12,
  dialogue: {
    context: "Waiting for the bus, you chat with a stranger about the heat.",
    lines: [
      { speaker: "A", textEs: "¡Uf, qué calor hoy!", textEn: "Ugh, it's so hot today!" },
      { speaker: "B", textEs: "Sí, está bien caliente. ¿Siempre es así?", textEn: "Yeah, it's really hot. Is it always like this?" },
      { speaker: "A", textEs: "En verano sí. Pero ya va a llover.", textEn: "In summer, yeah. But it's about to rain." },
      { speaker: "B", textEs: "Menos mal. ¿Viene el bus pronto?", textEn: "Thank goodness. Is the bus coming soon?" },
    ],
  },
  newItems: [
    { id: "L09-01", promptEn: "It's so hot!", targetEs: "¡Qué calor!", pronunciation: "keh kah-LOHR" },
    { id: "L09-02", promptEn: "It's raining", targetEs: "Está lloviendo", pronunciation: "ehs-TAH yoh-vee-EHN-doh" },
    { id: "L09-03", promptEn: "cold (weather)", targetEs: "frío", pronunciation: "FREE-oh" },
    { id: "L09-04", promptEn: "always", targetEs: "siempre", pronunciation: "see-EHM-preh" },
    { id: "L09-05", promptEn: "soon", targetEs: "pronto", pronunciation: "PROHN-toh" },
    { id: "L09-06", promptEn: "Thank goodness / What a relief", targetEs: "Menos mal", pronunciation: "MEH-nohs mahl" },
    { id: "L09-07", promptEn: "really / very (SV intensifier)", targetEs: "bien", pronunciation: "bee-EHN", culturalNote: "In SV, 'bien' is used like 'really' — 'bien chivo' = really cool, 'bien caro' = really expensive" },
    { id: "L09-08", promptEn: "summer", targetEs: "verano", pronunciation: "veh-RAH-noh", culturalNote: "In SV, 'verano' = dry season (Nov-Apr), 'invierno' = rainy season (May-Oct)" },
    { id: "L09-09", promptEn: "What's up? / What's going on?", targetEs: "¿Qué onda?", pronunciation: "keh OHN-dah", culturalNote: "Super casual greeting — like 'what's up?' among friends" },
    { id: "L09-10", promptEn: "nothing much / same old", targetEs: "Aquí nomás", pronunciation: "ah-KEE noh-MAHS", culturalNote: "Classic response to '¿qué onda?' — just chillin'" },
  ],
};

// LESSON 10: Party & Nightlife
const L10 = {
  id: "L10", title: "¡Vamos de fiesta!", subtitle: "Party & Nightlife", icon: "🎉",
  description: "Going out, drinking, dancing, and having fun", estimatedMinutes: 14,
  dialogue: {
    context: "Carlos invites you out on a Friday night.",
    lines: [
      { speaker: "A", textEs: "¡Mirá, vamos a salir esta noche! ¿Venís?", textEn: "Hey, we're going out tonight! You coming?" },
      { speaker: "B", textEs: "¡Claro que sí! ¿A dónde vamos?", textEn: "Of course! Where are we going?" },
      { speaker: "A", textEs: "A un bar bien chivo en la Zona Rosa.", textEn: "To a really cool bar in Zona Rosa." },
      { speaker: "B", textEs: "Dale. ¿A qué hora?", textEn: "Deal. What time?" },
      { speaker: "A", textEs: "Como a las nueve. No lleguéis tarde.", textEn: "Around nine. Don't be late." },
    ],
  },
  newItems: [
    { id: "L10-01", promptEn: "Let's go! (vos included)", targetEs: "¡Vamos!", pronunciation: "VAH-mohs" },
    { id: "L10-02", promptEn: "party / fiesta", targetEs: "fiesta", pronunciation: "fee-EHS-tah" },
    { id: "L10-03", promptEn: "Are you coming? (vos)", targetEs: "¿Venís?", standardEs: "¿Vienes?", pronunciation: "veh-NEES", culturalNote: "Vos conjugation of venir" },
    { id: "L10-04", promptEn: "Of course!", targetEs: "¡Claro que sí!", pronunciation: "KLAH-roh keh see" },
    { id: "L10-05", promptEn: "beer", targetEs: "cerveza", pronunciation: "sehr-VEH-sah" },
    { id: "L10-06", promptEn: "Cheers!", targetEs: "¡Salud!", pronunciation: "sah-LOOD" },
    { id: "L10-07", promptEn: "to dance", targetEs: "bailar", pronunciation: "bye-LAHR" },
    { id: "L10-08", promptEn: "I'm having a great time", targetEs: "La estoy pasando chivo", standardEs: "La estoy pasando bien", pronunciation: "lah ehs-TOY pah-SAHN-doh CHEE-voh", culturalNote: "Using 'chivo' instead of 'bien' — pure Salvadoran" },
    { id: "L10-09", promptEn: "I'm drunk (casual)", targetEs: "Estoy bolo/a", standardEs: "Estoy borracho/a", pronunciation: "ehs-TOY BOH-loh", culturalNote: "Bolo = Salvadoran slang for drunk. Very common." },
    { id: "L10-10", promptEn: "Let's go home", targetEs: "Vámonos a la casa", pronunciation: "VAH-moh-nohs ah lah KAH-sah" },
  ],
};

console.log("Lessons 6-10 defined:", [L06, L07, L08, L09, L10].map(l => l.id + " " + l.title).join(", "));
