// ============================================================
// SEE-GUESS MODE CONTENT
// "See an image, say the word." The app listens via speech
// recognition; you advance only when it hears a correct answer
// (or 10s elapses, then it shows the word for 3s).
//
// A LEVEL = 5 lessons. A LESSON = 20 images.
//   Level 1: single-word answers
//   Level 2: two-word answers
//
// Each item:
//   id     unique id
//   image  relative path to the picture YOU supply (see images/seeguess/MANIFEST.txt)
//   answer the canonical Spanish answer (shown on timeout)
//   accept array of accepted spoken answers (accent/case-insensitive).
//          Include regional synonyms so SV speakers aren't marked wrong.
//   en     English gloss — NEVER shown to the learner; used only for the
//          image manifest so you know what picture to put in each slot.
// ============================================================
(function () {
  window.HABLA_SEEGUESS = window.HABLA_SEEGUESS || [];

  const img = (slug) => "images/seeguess/" + slug + ".jpg";
  // helper so each item is terse: it(slug, answer, en, [extra accepted])
  const it = (idPrefix, n, slug, answer, en, extra) => ({
    id: idPrefix + "-" + String(n).padStart(2, "0"),
    image: img(slug),
    answer: answer,
    accept: [answer].concat(extra || []),
    en: en,
  });

  // ---------- LEVEL 1 — single words ----------
  const L1L1 = [ // Animales
    ["perro", "perro", "dog"],
    ["gato", "gato", "cat"],
    ["vaca", "vaca", "cow"],
    ["caballo", "caballo", "horse"],
    ["gallina", "gallina", "hen"],
    ["pato", "pato", "duck"],
    ["cerdo", "cerdo", "pig", ["chancho", "cuche", "marrano"]],
    ["pez", "pez", "fish"],
    ["ave", "ave", "bird", ["pájaro"]],
    ["conejo", "conejo", "rabbit"],
    ["raton", "ratón", "mouse"],
    ["tortuga", "tortuga", "turtle"],
    ["arana", "araña", "spider"],
    ["abeja", "abeja", "bee"],
    ["mariposa", "mariposa", "butterfly"],
    ["oso", "oso", "bear"],
    ["leon", "león", "lion"],
    ["elefante", "elefante", "elephant"],
    ["mono", "mono", "monkey"],
    ["serpiente", "serpiente", "snake", ["culebra", "vibora"]],
    ["murcielago", "murciélago", "bat"],
    ["ardilla", "ardilla", "squirrel"],
  ];

  const L1L2 = [ // Comida y bebida
    ["manzana", "manzana", "apple"],
    ["banano", "banano", "banana", ["guineo"]],
    ["naranja", "naranja", "orange"],
    ["fresa", "fresa", "strawberry"],
    ["uva", "uva", "grape", ["uvas"]],
    ["sandia", "sandía", "watermelon"],
    ["pina", "piña", "pineapple"],
    ["mango", "mango", "mango"],
    ["limon", "limón", "lime"],
    ["pan", "pan", "bread"],
    ["queso", "queso", "cheese"],
    ["huevo", "huevo", "egg"],
    ["leche", "leche", "milk"],
    ["cafe", "café", "coffee"],
    ["agua", "agua", "water"],
    ["arroz", "arroz", "rice"],
    ["frijoles", "frijoles", "beans", ["frijol", "frijolitos"]],
    ["pollo", "pollo", "chicken"],
    ["pescado", "pescado", "fish (food)"],
    ["tortilla", "tortilla", "tortilla"],
  ];

  const L1L3 = [ // La casa
    ["casa", "casa", "house"],
    ["puerta", "puerta", "door"],
    ["ventana", "ventana", "window"],
    ["silla", "silla", "chair"],
    ["mesa", "mesa", "table"],
    ["cama", "cama", "bed"],
    ["lampara", "lámpara", "lamp"],
    ["reloj", "reloj", "clock"],
    ["llave", "llave", "key"],
    ["telefono", "teléfono", "landline phone"],
    ["celular", "celular", "cell phone / mobile", ["cel"]],
    ["libro", "libro", "book"],
    ["lapiz", "lápiz", "pencil"],
    ["vaso", "vaso", "glass"],
    ["plato", "plato", "plate"],
    ["cuchara", "cuchara", "spoon"],
    ["tenedor", "tenedor", "fork"],
    ["cuchillo", "cuchillo", "knife"],
    ["jabon", "jabón", "soap"],
    ["toalla", "toalla", "towel"],
    ["espejo", "espejo", "mirror"],
  ];

  const L1L4 = [ // El cuerpo
    ["cabeza", "cabeza", "head"],
    ["pelo", "pelo", "hair", ["cabello"]],
    ["ojo", "ojo", "eye", ["ojos"]],
    ["nariz", "nariz", "nose"],
    ["boca", "boca", "mouth"],
    ["oreja", "oreja", "ear"],
    ["diente", "diente", "tooth", ["dientes"]],
    ["mano", "mano", "hand"],
    ["dedo", "dedo", "finger"],
    ["brazo", "brazo", "arm"],
    ["pierna", "pierna", "leg"],
    ["pie", "pie", "foot"],
    ["rodilla", "rodilla", "knee"],
    ["hombro", "hombro", "shoulder"],
    ["cuello", "cuello", "neck"],
    ["corazon", "corazón", "heart"],
    ["estomago", "estómago", "stomach", ["panza", "barriga"]],
    ["lengua", "lengua", "tongue"],
    ["ceja", "ceja", "eyebrow", ["cejas"]],
    ["una", "uña", "fingernail", ["unas"]],
  ];

  const L1L5 = [ // Naturaleza
    ["sol", "sol", "sun"],
    ["luna", "luna", "moon"],
    ["estrella", "estrella", "star"],
    ["nube", "nube", "cloud"],
    ["lluvia", "lluvia", "rain"],
    ["arbol", "árbol", "tree"],
    ["flor", "flor", "flower"],
    ["hoja", "hoja", "leaf"],
    ["montana", "montaña", "mountain"],
    ["rio", "río", "river"],
    ["mar", "mar", "sea", ["oceano"]],
    ["playa", "playa", "beach"],
    ["lago", "lago", "lake"],
    ["volcan", "volcán", "volcano"],
    ["fuego", "fuego", "fire"],
    ["piedra", "piedra", "stone", ["roca"]],
    ["cielo", "cielo", "sky"],
    ["nieve", "nieve", "snow"],
    ["viento", "viento", "wind"],
    ["arena", "arena", "sand"],
  ];

  // ---------- LEVEL 2 — two-word answers ----------
  const L2L1 = [ // Ropa y colores
    ["camiseta-roja", "camiseta roja", "red t-shirt", ["playera roja"]],
    ["camiseta-verde", "camiseta verde", "green t-shirt", ["playera verde"]],
    ["pantalon-azul", "pantalón azul", "blue pants"],
    ["vestido-rojo", "vestido rojo", "red dress"],
    ["zapatos-negros", "zapatos negros", "black shoes"],
    ["sombrero-blanco", "sombrero blanco", "white hat"],
    ["falda-amarilla", "falda amarilla", "yellow skirt"],
    ["calcetines-blancos", "calcetines blancos", "white socks"],
    ["chaqueta-negra", "chaqueta negra", "black jacket"],
    ["gorra-roja", "gorra roja", "red cap"],
    ["corbata-azul", "corbata azul", "blue tie"],
    ["sueter-verde", "suéter verde", "green sweater"],
    ["bufanda-rosada", "bufanda rosada", "pink scarf", ["bufanda rosa"]],
    ["guantes-grises", "guantes grises", "gray gloves"],
    ["cinturon-cafe", "cinturón café", "brown belt", ["cinturon marron"]],
    ["bolsa-negra", "bolsa negra", "black bag", ["cartera negra"]],
    ["reloj-dorado", "reloj dorado", "gold watch"],
    ["lentes-negros", "lentes negros", "black glasses", ["anteojos negros"]],
    ["camisa-blanca", "camisa blanca", "white shirt"],
    ["short-azul", "short azul", "blue shorts", ["pantaloneta azul"]],
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
      subtitle: "Single words",
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
      subtitle: "Two-word answers",
      icon: "🔵",
      lessons: [
        lesson("sg-2-1", "Ropa y colores", L2L1),
        // Lessons 2–5 pending — added after the mode is validated.
      ],
    },
  ];
})();
