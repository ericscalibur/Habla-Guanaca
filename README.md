# Habla Guanaca 🇸🇻

A language learning app for **Salvadoran Spanish** — the kind people actually speak on the streets of San Salvador, not the textbook version.

## What makes this different

Most Spanish apps teach you standard Mexican or Castilian Spanish. Land in El Salvador and suddenly everyone's saying *vos sos* instead of *tú eres*, calling kids *cipotes*, and ending every conversation with *va pues*. This app teaches you that Spanish — complete with **voseo** conjugations, **caliche** slang, and cultural context you won't find anywhere else.

## How it works

Each lesson follows an audio-first, spaced repetition approach:

1. **Prompt** — You see and hear an English phrase
2. **Anticipate** — A timed pause where you think (or say) the answer aloud
3. **Reveal** — The Salvadoran Spanish answer appears with pronunciation and cultural notes

New vocabulary is introduced inside realistic scenarios — ordering pupusas at a market, asking for directions, meeting someone new — and reviewed at expanding intervals throughout the lesson to lock it into memory.

## Lessons

| # | Title | What you'll learn |
|---|---|---|
| 1 | Mucho gusto | Greetings, introductions, your first voseo |
| 2 | ¿De dónde sos vos? | Origins, nationalities, the verb *ser* with vos |
| 3 | Quiero pupusas | Ordering food, numbers, prices |
| 4 | ¿Dónde queda...? | Directions, getting around San Salvador |
| 5 | La familia | Family terms, possessives, *tener* with vos |

## Quick start

No build step. Just open `index.html` in a browser.

```bash
# serve locally
npx serve .

# or just open the file directly
open index.html
```

## Voice settings

The app uses your browser's built-in text-to-speech. Open Settings (gear icon) to pick from available Spanish and English voices. Quality varies by browser and OS — Chrome typically has the best selection.

### Pre-rendered audio (optional)

For consistent, high-quality audio on any device:

```bash
pip install edge-tts
python generate-audio.py
```

This generates MP3s using Microsoft's free neural voices. No API key needed.

## Deploy to your phone

Push to GitHub, connect to [Netlify](https://app.netlify.com), and you'll have a URL you can bookmark on your phone's home screen. No app store needed.

## Salvadoran Spanish crash course

A few things you'll learn that textbooks skip:

- **Vos** replaces **tú** — *vos sos* not *tú eres*
- Verb stress shifts: *hablás, comés, tenés, venís*
- **Caliche** = Salvadoran slang (*chivo* = cool, *cipote* = kid, *pisto* = money)
- **Va pues** = the most Salvadoran phrase there is (alright then / okay / goodbye)

## Tech stack

- React 18 (loaded from CDN)
- Tailwind CSS
- Web Speech API
- Zero backend, zero dependencies to install

## License

MIT
