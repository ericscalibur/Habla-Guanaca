// ============================================================
// SEE-GUESS MODE CONTENT
// "See an image, say the word." The app listens via speech
// recognition; you advance only when it hears a correct answer
// (or 10s elapses, then it shows the word for 3s).
//
// A LEVEL = 5 lessons. A LESSON = 20 images.
//   Level 1: a single noun, with its article
//   Level 2: noun + adjective, with its article
//
// Nouns always carry their article ("el chucho", not "chucho") so the
// gender is learned with the word. Saying the bare noun still counts —
// it() adds the article-less form to `accept` automatically.
//
// Each item:
//   id     unique id
//   image  relative path to the picture YOU supply (see images/seeguess/MANIFEST.txt)
//   answer the canonical Spanish answer, article included (shown on timeout)
//   accept array of accepted spoken answers (accent/case-insensitive).
//          Include regional synonyms so SV speakers aren't marked wrong.
//   en     English gloss — NEVER shown to the learner; used only for the
//          image manifest so you know what picture to put in each slot.
// ============================================================
(function () {
  window.HABLA_SEEGUESS = window.HABLA_SEEGUESS || [];

  const img = (slug) => "images/seeguess/" + slug + ".jpg";
  const bare = (s) => s.replace(/^(el|la|los|las)\s+/i, "");
  // helper so each item is terse: it(slug, answer, en, [extra accepted])
  const it = (idPrefix, n, slug, answer, en, extra) => {
    const accept = [answer].concat(extra || []);
    // the learner who says just "chucho" is still right
    if (bare(answer) !== answer) accept.push(bare(answer));
    return {
      id: idPrefix + "-" + String(n).padStart(2, "0"),
      image: img(slug),
      answer: answer,
      accept: accept,
      en: en,
    };
  };

  // ---------- LEVEL 1 — single nouns ----------
  const L1L1 = [ // Animales
    ["perro", "el chucho", "dog", ["perro"]],
    ["gato", "el gato", "cat"],
    ["vaca", "la vaca", "cow"],
    ["caballo", "el caballo", "horse"],
    ["gallina", "la gallina", "hen"],
    ["pato", "el pato", "duck"],
    ["cerdo", "el tunco", "pig", ["cerdo", "chancho", "cuche", "marrano"]],
    ["pez", "el pez", "fish"],
    ["ave", "el ave", "bird", ["pájaro"]],
    ["conejo", "el conejo", "rabbit"],
    ["raton", "el ratón", "mouse"],
    ["tortuga", "la tortuga", "turtle"],
    ["arana", "la araña", "spider"],
    ["abeja", "la abeja", "bee"],
    ["mariposa", "la mariposa", "butterfly"],
    ["oso", "el oso", "bear"],
    ["leon", "el león", "lion"],
    ["elefante", "el elefante", "elephant"],
    ["mono", "el mono", "monkey"],
    ["serpiente", "la serpiente", "snake", ["culebra", "vibora"]],
    ["murcielago", "el murciélago", "bat"],
    ["ardilla", "la ardilla", "squirrel"],
    ["tacuazin", "el tacuazín", "opossum", ["tacuacín"]],
    ["mazacuata", "la mazacuata", "boa constrictor", ["masacuata"]],
    ["tucan", "el tucán", "toucan"],
    ["torogoz", "el torogoz", "torogoz (motmot, national bird of SV)"],
    ["garrobo", "el garrobo", "black spiny-tailed iguana"],
  ];

  const L1L2 = [ // Comida y bebida
    ["manzana", "la manzana", "apple"],
    ["banano", "el banano", "banana", ["guineo"]],
    ["naranja", "la naranja", "orange"],
    ["fresa", "la fresa", "strawberry"],
    ["uva", "la uva", "grape", ["uvas"]],
    ["sandia", "la sandía", "watermelon"],
    ["pina", "la piña", "pineapple"],
    ["mango", "el mango", "mango"],
    ["limon", "el limón", "lime"],
    ["pan", "el pan", "bread"],
    ["queso", "el queso", "cheese"],
    ["huevo", "el huevo", "egg"],
    ["leche", "la leche", "milk"],
    ["cafe", "el café", "coffee"],
    ["agua", "el agua", "water"],
    ["arroz", "el arroz", "rice"],
    ["frijoles", "los frijoles", "beans", ["frijol", "frijolitos"]],
    ["pollo", "el pollo", "chicken"],
    ["pescado", "el pescado", "fish (food)"],
    ["tortilla", "la tortilla", "tortilla"],
  ];

  const L1L3 = [ // La casa
    ["casa", "la casa", "house"],
    ["puerta", "la puerta", "door"],
    ["ventana", "la ventana", "window"],
    ["silla", "la silla", "chair"],
    ["mesa", "la mesa", "table"],
    ["cama", "la cama", "bed"],
    ["lampara", "la lámpara", "lamp"],
    ["reloj", "el reloj", "clock"],
    ["llave", "la llave", "key"],
    ["telefono", "el teléfono", "landline phone"],
    ["celular", "el celular", "cell phone / mobile", ["cel"]],
    ["libro", "el libro", "book"],
    ["lapiz", "el lápiz", "pencil"],
    ["vaso", "el vaso", "glass"],
    ["plato", "el plato", "plate"],
    ["cuchara", "la cuchara", "spoon"],
    ["tenedor", "el tenedor", "fork"],
    ["cuchillo", "el cuchillo", "knife"],
    ["jabon", "el jabón", "soap"],
    ["toalla", "la toalla", "towel"],
    ["espejo", "el espejo", "mirror"],
  ];

  const L1L4 = [ // El cuerpo
    ["cabeza", "la cabeza", "head"],
    ["pelo", "el pelo", "hair", ["cabello"]],
    ["ojo", "el ojo", "eye", ["ojos"]],
    ["nariz", "la nariz", "nose"],
    ["boca", "la boca", "mouth"],
    ["oreja", "la oreja", "ear"],
    ["diente", "el diente", "tooth", ["dientes"]],
    ["mano", "la mano", "hand"],
    ["dedo", "el dedo", "finger"],
    ["brazo", "el brazo", "arm"],
    ["pierna", "la pierna", "leg"],
    ["pie", "el pie", "foot"],
    ["rodilla", "la rodilla", "knee"],
    ["hombro", "el hombro", "shoulder"],
    ["cuello", "el cuello", "neck"],
    ["corazon", "el corazón", "heart"],
    ["estomago", "el estómago", "stomach", ["panza", "barriga"]],
    ["lengua", "la lengua", "tongue"],
    ["ceja", "la ceja", "eyebrow", ["cejas"]],
    ["una", "la uña", "fingernail", ["unas"]],
  ];

  const L1L5 = [ // Naturaleza
    ["sol", "el sol", "sun"],
    ["luna", "la luna", "moon"],
    ["estrella", "la estrella", "star"],
    ["nube", "la nube", "cloud"],
    ["lluvia", "la lluvia", "rain"],
    ["arbol", "el árbol", "tree"],
    ["flor", "la flor", "flower"],
    ["hoja", "la hoja", "leaf"],
    ["montana", "la montaña", "mountain"],
    ["rio", "el río", "river"],
    ["mar", "el mar", "sea", ["oceano"]],
    ["playa", "la playa", "beach"],
    ["lago", "el lago", "lake"],
    ["volcan", "el volcán", "volcano"],
    ["fuego", "el fuego", "fire"],
    ["piedra", "la piedra", "stone", ["roca"]],
    ["cielo", "el cielo", "sky"],
    ["nieve", "la nieve", "snow"],
    ["viento", "el viento", "wind"],
    ["arena", "la arena", "sand"],
  ];

  // ---------- LEVEL 2 — noun + adjective ----------
  const L2L1 = [ // Ropa y colores
    ["camiseta-roja", "la camiseta roja", "red t-shirt", ["playera roja"]],
    ["camiseta-verde", "la camiseta verde", "green t-shirt", ["playera verde"]],
    ["pantalon-azul", "el pantalón azul", "blue pants"],
    ["vestido-rojo", "el vestido rojo", "red dress"],
    ["zapatos-negros", "los zapatos negros", "black shoes"],
    ["sombrero-blanco", "el sombrero blanco", "white hat"],
    ["falda-amarilla", "la falda amarilla", "yellow skirt"],
    ["calcetines-blancos", "los calcetines blancos", "white socks"],
    ["chaqueta-negra", "la chaqueta negra", "black jacket"],
    ["gorra-roja", "la gorra roja", "red cap"],
    ["corbata-azul", "la corbata azul", "blue tie"],
    ["sueter-verde", "el suéter verde", "green sweater"],
    ["bufanda-rosada", "la bufanda rosada", "pink scarf", ["bufanda rosa"]],
    ["guantes-grises", "los guantes grises", "gray gloves"],
    ["cinturon-cafe", "el cinturón café", "brown belt", ["cinturon marron"]],
    ["bolsa-negra", "la bolsa negra", "black bag", ["cartera negra"]],
    ["reloj-dorado", "el reloj dorado", "gold watch"],
    ["lentes-negros", "los lentes negros", "black glasses", ["anteojos negros"]],
    ["camisa-blanca", "la camisa blanca", "white shirt"],
    ["short-azul", "el short azul", "blue shorts", ["pantaloneta azul"]],
  ];

  const lesson = (id, title, rows) => ({
    id,
    title,
    items: rows.map((r, i) => it(id, i + 1, r[0], r[1], r[2], r[3])),
  });

  window.HABLA_SEEGUESS = [
    {
      id: "sg-1",
      level: 1,
      name: "Level 1",
      subtitle: "Single nouns",
      icon: "🟢",
      lessons: [
        lesson("sg-1-1", "Animales", L1L1),
        lesson("sg-1-2", "Comida", L1L2),
        lesson("sg-1-3", "La casa", L1L3),
        lesson("sg-1-4", "El cuerpo", L1L4),
        lesson("sg-1-5", "Naturaleza", L1L5),
      ],
    },
    {
      id: "sg-2",
      level: 2,
      name: "Level 2",
      subtitle: "Noun + adjective",
      icon: "🔵",
      lessons: [
        lesson("sg-2-1", "Ropa y colores", L2L1),
        // Lessons 2–5 pending — added after the mode is validated.
      ],
    },
  ];
})();
