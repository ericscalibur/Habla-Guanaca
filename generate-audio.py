#!/usr/bin/env python3
"""
Habla Guanaca — Audio Generator
Generates MP3 files for all lesson phrases using Microsoft Edge's free neural TTS.
No API key needed.

Usage:
  pip install edge-tts
  python generate-audio.py

Output: creates audio/ directory with MP3s and a JSON manifest.
"""

import asyncio
import json
import os
import base64
import edge_tts

# Microsoft Edge neural voices — Latin American Spanish
# Run: edge-tts --list-voices | grep es-  to see all options
SPANISH_VOICE = "es-MX-DaliaNeural"      # Female, Mexican (closest to SV)
ENGLISH_VOICE = "en-US-JennyNeural"       # Female, US English

# All lesson phrases to generate
LESSONS = {
    "L01": {
        "items": [
            {"id": "L01-01", "en": "Hello", "es": "Hola"},
            {"id": "L01-02", "en": "How are you? informal", "es": "¿Cómo estás vos?"},
            {"id": "L01-03", "en": "I'm fine. I'm good", "es": "Estoy bien"},
            {"id": "L01-04", "en": "And you?", "es": "¿Y vos?"},
            {"id": "L01-05", "en": "Nice to meet you", "es": "Mucho gusto"},
            {"id": "L01-06", "en": "My name is", "es": "Me llamo"},
            {"id": "L01-07", "en": "What's your name?", "es": "¿Cómo te llamás vos?"},
            {"id": "L01-08", "en": "Likewise. Same here", "es": "Igualmente"},
            {"id": "L01-09", "en": "Good morning", "es": "Buenos días"},
            {"id": "L01-10", "en": "See you later", "es": "Nos vemos"},
        ],
        "dialogue": [
            {"es": "¡Hola! ¿Cómo estás vos?"},
            {"es": "Bien, gracias. ¿Y vos?"},
            {"es": "Mucho gusto. Me llamo Carlos."},
            {"es": "Igualmente. Yo soy María."},
        ]
    },
    "L02": {
        "items": [
            {"id": "L02-01", "en": "Where are you from? informal", "es": "¿De dónde sos vos?"},
            {"id": "L02-02", "en": "I am from", "es": "Soy de"},
            {"id": "L02-03", "en": "the United States", "es": "Estados Unidos"},
            {"id": "L02-04", "en": "You are, informal, identity", "es": "Vos sos"},
            {"id": "L02-05", "en": "Cool! Awesome!", "es": "¡Qué chivo!"},
            {"id": "L02-06", "en": "I like something a lot", "es": "Me gusta mucho"},
            {"id": "L02-07", "en": "here", "es": "aquí"},
            {"id": "L02-08", "en": "I am Salvadoran", "es": "Soy salvadoreño"},
            {"id": "L02-09", "en": "Do you speak English?", "es": "¿Hablás inglés?"},
            {"id": "L02-10", "en": "A little bit", "es": "Un poquito"},
        ],
        "dialogue": [
            {"es": "¿De dónde sos vos?"},
            {"es": "Soy de Estados Unidos. ¿Y vos?"},
            {"es": "Yo soy de aquí, de San Salvador."},
            {"es": "¡Qué chivo! Me gusta mucho El Salvador."},
        ]
    },
    "L03": {
        "items": [
            {"id": "L03-01", "en": "I want. I'd like", "es": "Quiero"},
            {"id": "L03-02", "en": "pupusa, stuffed tortilla", "es": "pupusa"},
            {"id": "L03-03", "en": "please", "es": "por favor"},
            {"id": "L03-04", "en": "How much is it?", "es": "¿Cuánto es?"},
            {"id": "L03-05", "en": "one", "es": "uno"},
            {"id": "L03-06", "en": "two", "es": "dos"},
            {"id": "L03-07", "en": "three", "es": "tres"},
            {"id": "L03-08", "en": "water", "es": "agua"},
            {"id": "L03-09", "en": "the bill, the check", "es": "la cuenta"},
            {"id": "L03-10", "en": "Thank you very much", "es": "Muchas gracias"},
        ],
        "dialogue": [
            {"es": "Buenas. ¿Qué va a querer?"},
            {"es": "Quiero dos pupusas revueltas, por favor."},
            {"es": "¿Con curtido?"},
            {"es": "Sí. ¿Cuánto es?"},
            {"es": "Son dos dólares."},
        ]
    },
    "L04": {
        "items": [
            {"id": "L04-01", "en": "Excuse me, formal", "es": "Disculpe"},
            {"id": "L04-02", "en": "Where is?", "es": "¿Dónde queda?"},
            {"id": "L04-03", "en": "Go straight, informal", "es": "Andá derecho"},
            {"id": "L04-04", "en": "to the right", "es": "a la derecha"},
            {"id": "L04-05", "en": "to the left", "es": "a la izquierda"},
            {"id": "L04-06", "en": "close, nearby", "es": "cerca"},
            {"id": "L04-07", "en": "far", "es": "lejos"},
            {"id": "L04-08", "en": "the bus stop", "es": "la parada de bus"},
            {"id": "L04-09", "en": "block, city block", "es": "cuadra"},
            {"id": "L04-10", "en": "Thank you, you're very kind", "es": "Gracias, muy amable"},
        ],
        "dialogue": [
            {"es": "Disculpe, ¿dónde queda la parada de bus?"},
            {"es": "Queda cerca. Andá derecho dos cuadras."},
            {"es": "¿A la derecha o a la izquierda?"},
            {"es": "Derecho, y después a la izquierda."},
        ]
    },
    "L05": {
        "items": [
            {"id": "L05-01", "en": "Look! informal", "es": "¡Mirá!"},
            {"id": "L05-02", "en": "my family", "es": "mi familia"},
            {"id": "L05-03", "en": "Do you have? informal", "es": "¿Tenés?"},
            {"id": "L05-04", "en": "brother, sister", "es": "hermano, hermana"},
            {"id": "L05-05", "en": "kid, child, Salvadoran slang", "es": "cipote, cipota"},
            {"id": "L05-06", "en": "mom, dad", "es": "mamá, papá"},
            {"id": "L05-07", "en": "I have", "es": "Tengo"},
            {"id": "L05-08", "en": "also, too", "es": "también"},
            {"id": "L05-09", "en": "my friend", "es": "mi amigo, mi amiga"},
            {"id": "L05-10", "en": "Alright then. Okay", "es": "Va pues"},
        ],
        "dialogue": [
            {"es": "Mirá, esta es mi familia."},
            {"es": "¡Qué chivo! ¿Tenés hermanos?"},
            {"es": "Sí, tengo dos hermanas y un cipote."},
            {"es": "Yo también tengo hermanos."},
        ]
    },
}

async def generate_audio(text, voice, output_path, rate="-10%"):
    """Generate a single MP3 file."""
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    await communicate.save(output_path)
    print(f"  ✓ {output_path}")

async def main():
    os.makedirs("audio/es", exist_ok=True)
    os.makedirs("audio/en", exist_ok=True)

    manifest = {}

    for lesson_id, lesson in LESSONS.items():
        print(f"\n{'='*50}")
        print(f"Generating {lesson_id}...")
        print(f"{'='*50}")

        # Generate item audio
        for item in lesson["items"]:
            item_id = item["id"]
            manifest[item_id] = {}

            # Spanish
            es_path = f"audio/es/{item_id}.mp3"
            await generate_audio(item["es"], SPANISH_VOICE, es_path)
            manifest[item_id]["es"] = es_path

            # English
            en_path = f"audio/en/{item_id}.mp3"
            await generate_audio(item["en"], ENGLISH_VOICE, en_path)
            manifest[item_id]["en"] = en_path

        # Generate dialogue audio
        for i, line in enumerate(lesson.get("dialogue", [])):
            dl_id = f"{lesson_id}-DL{i+1:02d}"
            dl_path = f"audio/es/{dl_id}.mp3"
            await generate_audio(line["es"], SPANISH_VOICE, dl_path)
            manifest[dl_id] = {"es": dl_path}

    # Save manifest
    with open("audio/manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\n✅ Done! Generated {len(manifest)} audio files.")
    print(f"   Manifest saved to audio/manifest.json")

    # Also generate a base64 bundle for embedding in HTML
    print(f"\nGenerating base64 bundle for embedding...")
    bundle = {}
    for key, paths in manifest.items():
        bundle[key] = {}
        for lang, path in paths.items():
            with open(path, "rb") as f:
                b64 = base64.b64encode(f.read()).decode("utf-8")
                bundle[key][lang] = f"data:audio/mpeg;base64,{b64}"

    with open("audio/audio-bundle.json", "w") as f:
        json.dump(bundle, f)
    print(f"✅ Base64 bundle saved to audio/audio-bundle.json")
    print(f"   (Embed this in your HTML app for offline playback)")

    # Print available voices for reference
    print(f"\n--- Voice Configuration ---")
    print(f"Spanish: {SPANISH_VOICE}")
    print(f"English: {ENGLISH_VOICE}")
    print(f"\nTo change voices, edit the SPANISH_VOICE / ENGLISH_VOICE")
    print(f"constants at the top of this script.")
    print(f"Run: python -c \"import asyncio, edge_tts; asyncio.run(edge_tts.list_voices())\"")
    print(f"to see all available voices.")

if __name__ == "__main__":
    asyncio.run(main())
