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
SPANISH_VOICE = "es-MX-DaliaNeural"      # Female, Mexican (closest to SV)
ENGLISH_VOICE = "en-US-JennyNeural"       # Female, US English

# ============================================================
# ALL LESSON PHRASES (30 lessons across 3 packs)
# ============================================================

LESSONS = {
    # ── Pack 01: The Basics ──────────────────────────────────
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
    "L06": {
        "items": [
            {"id": "L06-01", "en": "How much does it cost?", "es": "¿Cuánto cuesta?"},
            {"id": "L06-02", "en": "That one", "es": "esa"},
            {"id": "L06-03", "en": "It costs. It's worth", "es": "vale"},
            {"id": "L06-04", "en": "expensive", "es": "caro"},
            {"id": "L06-05", "en": "cheap", "es": "barato"},
            {"id": "L06-06", "en": "Can you give me a deal?", "es": "¿Me lo deja en siete?"},
            {"id": "L06-07", "en": "money, Salvadoran slang", "es": "pisto"},
            {"id": "L06-08", "en": "I'll take it. Deal", "es": "Dale"},
            {"id": "L06-09", "en": "five", "es": "cinco"},
            {"id": "L06-10", "en": "ten", "es": "diez"},
        ],
        "dialogue": [
            {"es": "Buenas. ¿Cuánto cuesta esta camisa?"},
            {"es": "Esa vale diez dólares."},
            {"es": "¡Uy, está muy caro! ¿Me lo deja en siete?"},
            {"es": "Va pues, ocho y se lo lleva."},
            {"es": "Dale. Aquí tiene."},
        ]
    },
    "L07": {
        "items": [
            {"id": "L07-01", "en": "What time is it?", "es": "¿Qué hora es?"},
            {"id": "L07-02", "en": "It's three o'clock", "es": "Son las tres"},
            {"id": "L07-03", "en": "in the morning", "es": "de la mañana"},
            {"id": "L07-04", "en": "in the afternoon", "es": "de la tarde"},
            {"id": "L07-05", "en": "at night", "es": "de la noche"},
            {"id": "L07-06", "en": "tomorrow", "es": "mañana"},
            {"id": "L07-07", "en": "today", "es": "hoy"},
            {"id": "L07-08", "en": "now, right now", "es": "ahorita"},
            {"id": "L07-09", "en": "later", "es": "después"},
            {"id": "L07-10", "en": "At what time?", "es": "¿A qué hora?"},
        ],
        "dialogue": [
            {"es": "¿Qué hora es?"},
            {"es": "Son las tres de la tarde."},
            {"es": "¿A qué hora nos vemos mañana?"},
            {"es": "Como a las diez de la mañana. ¿Va?"},
            {"es": "Va pues. Ahí nos vemos."},
        ]
    },
    "L08": {
        "items": [
            {"id": "L08-01", "en": "I feel bad. I'm not well", "es": "Me siento mal"},
            {"id": "L08-02", "en": "It hurts. My head hurts", "es": "Me duele la cabeza"},
            {"id": "L08-03", "en": "head", "es": "la cabeza"},
            {"id": "L08-04", "en": "stomach", "es": "el estómago"},
            {"id": "L08-05", "en": "I have a fever", "es": "Tengo fiebre"},
            {"id": "L08-06", "en": "Take this, informal", "es": "Tomá"},
            {"id": "L08-07", "en": "pills, medicine", "es": "pastillas"},
            {"id": "L08-08", "en": "I need", "es": "Necesito"},
            {"id": "L08-09", "en": "hospital, clinic", "es": "el hospital"},
            {"id": "L08-10", "en": "help me", "es": "Ayudame"},
        ],
        "dialogue": [
            {"es": "Buenas. Me siento mal."},
            {"es": "¿Qué le pasa? ¿Qué sentís?"},
            {"es": "Me duele la cabeza y tengo fiebre."},
            {"es": "Tomá estas pastillas, dos cada ocho horas."},
        ]
    },
    "L09": {
        "items": [
            {"id": "L09-01", "en": "It's so hot!", "es": "¡Qué calor!"},
            {"id": "L09-02", "en": "It's raining", "es": "Está lloviendo"},
            {"id": "L09-03", "en": "cold weather", "es": "frío"},
            {"id": "L09-04", "en": "always", "es": "siempre"},
            {"id": "L09-05", "en": "soon", "es": "pronto"},
            {"id": "L09-06", "en": "Thank goodness", "es": "Menos mal"},
            {"id": "L09-07", "en": "really, very", "es": "bien"},
            {"id": "L09-08", "en": "summer", "es": "verano"},
            {"id": "L09-09", "en": "What's up?", "es": "¿Qué onda?"},
            {"id": "L09-10", "en": "nothing much", "es": "Aquí nomás"},
        ],
        "dialogue": [
            {"es": "¡Uf, qué calor hoy!"},
            {"es": "Sí, está bien caliente. ¿Siempre es así?"},
            {"es": "En verano sí. Pero ya va a llover."},
            {"es": "Menos mal. ¿Viene el bus pronto?"},
        ]
    },
    "L10": {
        "items": [
            {"id": "L10-01", "en": "Let's go!", "es": "¡Vamos!"},
            {"id": "L10-02", "en": "party", "es": "fiesta"},
            {"id": "L10-03", "en": "Are you coming?", "es": "¿Venís?"},
            {"id": "L10-04", "en": "Of course!", "es": "¡Claro que sí!"},
            {"id": "L10-05", "en": "beer", "es": "cerveza"},
            {"id": "L10-06", "en": "Cheers!", "es": "¡Salud!"},
            {"id": "L10-07", "en": "to dance", "es": "bailar"},
            {"id": "L10-08", "en": "I'm having a great time", "es": "La estoy pasando chivo"},
            {"id": "L10-09", "en": "I'm drunk", "es": "Estoy bolo"},
            {"id": "L10-10", "en": "Let's go home", "es": "Vámonos a la casa"},
        ],
        "dialogue": [
            {"es": "¡Mirá, vamos a salir esta noche! ¿Venís?"},
            {"es": "¡Claro que sí! ¿A dónde vamos?"},
            {"es": "A un bar bien chivo en la Zona Rosa."},
            {"es": "Dale. ¿A qué hora?"},
        ]
    },

    # ── Pack 02: Coqueteo ────────────────────────────────────
    "L11": {"items": [{"id": "L11-01", "en": "You're really pretty", "es": "Sos bien bonita"},{"id": "L11-02", "en": "You're really handsome", "es": "Sos bien guapo"},{"id": "L11-03", "en": "I like you", "es": "Me gustás"},{"id": "L11-04", "en": "Can I buy you a drink?", "es": "¿Te puedo invitar un trago?"},{"id": "L11-05", "en": "You have beautiful eyes", "es": "Tenés unos ojos bien lindos"},{"id": "L11-06", "en": "hot, attractive", "es": "churro"},{"id": "L11-07", "en": "cutie", "es": "chero"},{"id": "L11-08", "en": "What's your number?", "es": "¿Cuál es tu número?"},{"id": "L11-09", "en": "Do you want to dance?", "es": "¿Querés bailar?"},{"id": "L11-10", "en": "You smell really good", "es": "Olés bien rico"}],"dialogue": [{"es": "Disculpá, ¿cómo te llamás?"},{"es": "Soy Karla. ¿Y vos?"},{"es": "Mirá, sos bien bonita."},{"es": "¡Ay qué dulce vos! Gracias."}]},
    "L12": {"items": [{"id": "L12-01", "en": "Do you have a boyfriend?", "es": "¿Tenés novio?"},{"id": "L12-02", "en": "Do you have a girlfriend?", "es": "¿Tenés novia?"},{"id": "L12-03", "en": "I'm single", "es": "Estoy soltero"},{"id": "L12-04", "en": "Can I take you out?", "es": "¿Te puedo sacar a pasear?"},{"id": "L12-05", "en": "Give me your number", "es": "Dame tu número"},{"id": "L12-06", "en": "maybe", "es": "Puede ser"},{"id": "L12-07", "en": "I'm interested in you", "es": "Me interesás"},{"id": "L12-08", "en": "boyfriend, girlfriend", "es": "novio, novia"},{"id": "L12-09", "en": "Let's go out this weekend", "es": "Salgamos este fin de semana"},{"id": "L12-10", "en": "I had a great time with you", "es": "La pasé bien chivo con vos"}],"dialogue": [{"es": "¿Tenés novio?"},{"es": "No, estoy soltera. ¿Y vos?"},{"es": "También. ¿Te puedo sacar a pasear un día?"},{"es": "Puede ser. Dame tu número."}]},
    "L13": {"items": [{"id": "L13-01", "en": "I'm crazy about you", "es": "Me encantás"},{"id": "L13-02", "en": "my love", "es": "mi amor"},{"id": "L13-03", "en": "baby, babe", "es": "mi cielo"},{"id": "L13-04", "en": "I miss you", "es": "Te extraño"},{"id": "L13-05", "en": "I'm thinking about you", "es": "Estoy pensando en vos"},{"id": "L13-06", "en": "kiss me", "es": "Besame"},{"id": "L13-07", "en": "a kiss", "es": "un beso"},{"id": "L13-08", "en": "a hug", "es": "un abrazo"},{"id": "L13-09", "en": "You make me happy", "es": "Me hacés feliz"},{"id": "L13-10", "en": "I love you", "es": "Te quiero"}],"dialogue": [{"es": "Me encantás, ¿sabés?"},{"es": "Vos también me gustás mucho, mi amor."},{"es": "Sos la persona más linda que conozco."},{"es": "¡Ay, qué tierno!"}]},
    "L14": {"items": [{"id": "L14-01", "en": "Come here", "es": "Venite pa'cá"},{"id": "L14-02", "en": "I want to be with you", "es": "Quiero estar con vos"},{"id": "L14-03", "en": "You drive me crazy", "es": "Me volvés loco"},{"id": "L14-04", "en": "Touch me", "es": "Tocame"},{"id": "L14-05", "en": "That feels good", "es": "Qué rico"},{"id": "L14-06", "en": "Do you like that?", "es": "¿Te gusta?"},{"id": "L14-07", "en": "more", "es": "más"},{"id": "L14-08", "en": "slowly", "es": "despacio"},{"id": "L14-09", "en": "Don't stop", "es": "No parés"},{"id": "L14-10", "en": "Stay with me tonight", "es": "Quedate conmigo esta noche"}],"dialogue": [{"es": "Venite pa'cá."},{"es": "¿Qué querés?"},{"es": "Estar cerca de vos."},{"es": "Mmm, qué rico."}]},
    "L15": {"items": [{"id": "L15-01", "en": "Be naughty", "es": "Portate mal"},{"id": "L15-02", "en": "I want you", "es": "Te deseo"},{"id": "L15-03", "en": "Take off your clothes", "es": "Quitáte la ropa"},{"id": "L15-04", "en": "You're so sexy", "es": "Sos bien sexy"},{"id": "L15-05", "en": "Close your eyes", "es": "Cerrá los ojos"},{"id": "L15-06", "en": "Surprise me", "es": "Sorprendeme"},{"id": "L15-07", "en": "Turn off the light", "es": "Apagá la luz"},{"id": "L15-08", "en": "in bed", "es": "en la cama"},{"id": "L15-09", "en": "naked", "es": "desnudo"},{"id": "L15-10", "en": "Let's go to your place", "es": "Vamos a tu casa"}],"dialogue": [{"es": "Portate mal."},{"es": "¿Ah sí? ¿Qué querés que haga?"},{"es": "Sorprendeme."},{"es": "Cerrá los ojos."}]},
    "L16": {"items": [{"id": "L16-01", "en": "You look amazing", "es": "Estás como querés"},{"id": "L16-02", "en": "I'm going to cover you in kisses", "es": "Te voy a comer a besos"},{"id": "L16-03", "en": "I can't resist you", "es": "No me puedo resistir"},{"id": "L16-04", "en": "You're driving me crazy", "es": "Me tenés loco"},{"id": "L16-05", "en": "harder", "es": "más fuerte"},{"id": "L16-06", "en": "yes, like that", "es": "sí, así"},{"id": "L16-07", "en": "What are you waiting for?", "es": "¿Qué esperás?"},{"id": "L16-08", "en": "right there", "es": "ahí mero"},{"id": "L16-09", "en": "I'm yours", "es": "Soy tuyo"},{"id": "L16-10", "en": "Tonight you're mine", "es": "Esta noche sos mío"}],"dialogue": [{"es": "Estás como querés."},{"es": "Vos tampoco estás mal."},{"es": "Te voy a comer a besos."},{"es": "Pues qué esperás."}]},
    "L17": {"items": [{"id": "L17-01", "en": "Talk dirty to me", "es": "Hablame sucio"},{"id": "L17-02", "en": "Tell me", "es": "Decime"},{"id": "L17-03", "en": "I'm going to kiss you everywhere", "es": "Te voy a besar por todos lados"},{"id": "L17-04", "en": "Do you like it?", "es": "¿Te gusta así?"},{"id": "L17-05", "en": "body", "es": "cuerpo"},{"id": "L17-06", "en": "skin", "es": "piel"},{"id": "L17-07", "en": "to kiss", "es": "besar"},{"id": "L17-08", "en": "to bite playfully", "es": "morder"},{"id": "L17-09", "en": "first, then", "es": "primero, después"},{"id": "L17-10", "en": "Lie down", "es": "Acostate"}],"dialogue": [{"es": "Hablame sucio."},{"es": "¿Querés que te diga lo que te voy a hacer?"},{"es": "Sí, decime todo."},{"es": "Primero te voy a besar por todos lados."}]},
    "L18": {"items": [{"id": "L18-01", "en": "gorgeous", "es": "preciosa"},{"id": "L18-02", "en": "last night", "es": "anoche"},{"id": "L18-03", "en": "incredible", "es": "increíble"},{"id": "L18-04", "en": "stay a little longer", "es": "Quedate un rato más"},{"id": "L18-05", "en": "to get up", "es": "levantarse"},{"id": "L18-06", "en": "You're my weakness", "es": "Sos mi debilidad"},{"id": "L18-07", "en": "to cuddle", "es": "abrazarnos"},{"id": "L18-08", "en": "I slept really well", "es": "Dormí bien rico"},{"id": "L18-09", "en": "I want to see you again", "es": "Quiero verte otra vez"},{"id": "L18-10", "en": "You made my night", "es": "Me hiciste la noche"}],"dialogue": [{"es": "Buenos días, preciosa."},{"es": "Mmm, no me quiero levantar."},{"es": "Yo tampoco. Quedate un rato más."},{"es": "Anoche fue increíble."}]},
    "L19": {"items": [{"id": "L19-01", "en": "Who were you talking to?", "es": "¿Con quién estabas hablando?"},{"id": "L19-02", "en": "Don't be jealous", "es": "No seas celoso"},{"id": "L19-03", "en": "jealous", "es": "celoso"},{"id": "L19-04", "en": "Trust me", "es": "Confiá en mí"},{"id": "L19-05", "en": "I care about you a lot", "es": "Me importás mucho"},{"id": "L19-06", "en": "We need to talk", "es": "Necesitamos hablar"},{"id": "L19-07", "en": "it's complicated", "es": "Es complicado"},{"id": "L19-08", "en": "Don't lie to me", "es": "No me mintás"},{"id": "L19-09", "en": "I'm sorry", "es": "Perdoname"},{"id": "L19-10", "en": "Let's fix this", "es": "Arreglemos esto"}],"dialogue": [{"es": "¿Con quién estabas hablando?"},{"es": "Con un amigo. No seas celoso."},{"es": "Es que me importás mucho."},{"es": "Yo sé. Pero confiá en mí."}]},
    "L20": {"items": [{"id": "L20-01", "en": "Do you want to be my girlfriend?", "es": "¿Querés ser mi novia?"},{"id": "L20-02", "en": "Do you want to be my boyfriend?", "es": "¿Querés ser mi novio?"},{"id": "L20-03", "en": "I want to ask you something", "es": "Quiero preguntarte algo"},{"id": "L20-04", "en": "I want to be with you", "es": "Quiero estar con vos"},{"id": "L20-05", "en": "You're the love of my life", "es": "Sos el amor de mi vida"},{"id": "L20-06", "en": "forever", "es": "para siempre"},{"id": "L20-07", "en": "together", "es": "juntos"},{"id": "L20-08", "en": "I promise", "es": "Te lo prometo"},{"id": "L20-09", "en": "my other half", "es": "mi media naranja"},{"id": "L20-10", "en": "I love you so much", "es": "Te quiero un montón"}],"dialogue": [{"es": "Mirá, quiero preguntarte algo."},{"es": "Dale, decime."},{"es": "¿Querés ser mi novia?"},{"es": "¡Sí! ¡Claro que sí, mi amor!"}]},

    # ── Pack 03: Chismoseando ────────────────────────────────
    "L21": {"items": [{"id": "L21-01", "en": "Did you hear?", "es": "¿Ya supiste?"},{"id": "L21-02", "en": "What happened?", "es": "¿Qué pasó?"},{"id": "L21-03", "en": "No way!", "es": "¡No jodás!"},{"id": "L21-04", "en": "For real?", "es": "¿En serio?"},{"id": "L21-05", "en": "I heard that", "es": "Me dijeron que"},{"id": "L21-06", "en": "Don't tell anyone", "es": "No le digás a nadie"},{"id": "L21-07", "en": "gossip", "es": "chisme"},{"id": "L21-08", "en": "gossiper", "es": "chismoso"},{"id": "L21-09", "en": "It turns out that", "es": "Resulta que"},{"id": "L21-10", "en": "Swear to me", "es": "Jurame"}],"dialogue": [{"es": "¡Mirá, mirá! ¿Ya supiste lo de Carlos?"},{"es": "No, ¿qué pasó?"},{"es": "Dejó a la novia por otra."},{"es": "¡No jodás! ¿En serio?"}]},
    "L22": {"items": [{"id": "L22-01", "en": "idiot, fool", "es": "baboso"},{"id": "L22-02", "en": "dude, bro", "es": "maje"},{"id": "L22-03", "en": "stupid", "es": "tonto"},{"id": "L22-04", "en": "How embarrassing!", "es": "¡Qué vergüenza!"},{"id": "L22-05", "en": "He fell down", "es": "Se cayó"},{"id": "L22-06", "en": "Don't be dumb", "es": "No seás baboso"},{"id": "L22-07", "en": "What an idiot!", "es": "¡Qué maje!"},{"id": "L22-08", "en": "ridiculous", "es": "ridículo"},{"id": "L22-09", "en": "in front of everyone", "es": "enfrente de todos"},{"id": "L22-10", "en": "What a mess!", "es": "¡Qué desastre!"}],"dialogue": [{"es": "Mirá a ese baboso."},{"es": "¿Qué hizo?"},{"es": "Se cayó enfrente de todos."},{"es": "¡Qué vergüenza, maje!"}]},
    "L23": {"items": [{"id": "L23-01", "en": "shameless person", "es": "caretubo"},{"id": "L23-02", "en": "two-faced", "es": "falso"},{"id": "L23-03", "en": "He took the credit", "es": "Se llevó el crédito"},{"id": "L23-04", "en": "typical", "es": "típico"},{"id": "L23-05", "en": "shameless", "es": "cínico"},{"id": "L23-06", "en": "annoying person", "es": "molestoso"},{"id": "L23-07", "en": "brown-noser", "es": "lambón"},{"id": "L23-08", "en": "He thinks he's all that", "es": "Se cree la gran cosa"},{"id": "L23-09", "en": "Don't be so nosy", "es": "No seás tan metido"},{"id": "L23-10", "en": "mind your own business", "es": "Metete en tus cosas"}],"dialogue": [{"es": "¿Viste lo que hizo el jefe?"},{"es": "Sí, qué caretubo. Se llevó el crédito."},{"es": "Es bien cínico ese maje."},{"es": "Típico. Siempre es así."}]},
    "L24": {"items": [{"id": "L24-01", "en": "Stop messing around!", "es": "¡Dejá de joder!"},{"id": "L24-02", "en": "Calm down", "es": "¡Calmáte!"},{"id": "L24-03", "en": "Get out of here", "es": "Andáte de aquí"},{"id": "L24-04", "en": "big mouth", "es": "hocicón"},{"id": "L24-05", "en": "I'm fed up", "es": "Ya me harté"},{"id": "L24-06", "en": "Leave me alone", "es": "Dejame en paz"},{"id": "L24-07", "en": "Shut up", "es": "Callate"},{"id": "L24-08", "en": "Don't mess with me", "es": "No te metás conmigo"},{"id": "L24-09", "en": "I don't care", "es": "Me vale"},{"id": "L24-10", "en": "Whatever, dismissive", "es": "Me vale verga"}],"dialogue": [{"es": "¿Y vos por qué andás de hocicón?"},{"es": "¡Dejá de joder! No estoy hablando con vos."},{"es": "¡Calmáte pues!"},{"es": "Vos calmáte. Andáte de aquí."}]},
    "L25": {"items": [{"id": "L25-01", "en": "crude, rude", "es": "lépero"},{"id": "L25-02", "en": "jerk, vulgar", "es": "cerote"},{"id": "L25-03", "en": "stupid stuff", "es": "pendejadas"},{"id": "L25-04", "en": "stupid person", "es": "pendejo"},{"id": "L25-05", "en": "Better not", "es": "Mejor ni"},{"id": "L25-06", "en": "a real piece of work", "es": "es un caso"},{"id": "L25-07", "en": "He has no class", "es": "No tiene clase"},{"id": "L25-08", "en": "trash person", "es": "basura"},{"id": "L25-09", "en": "What a lowlife!", "es": "¡Qué corriente!"},{"id": "L25-10", "en": "Go to hell", "es": "Andáte a la mierda"}],"dialogue": [{"es": "Ese maje es bien lépero."},{"es": "Sí, siempre dice pendejadas."},{"es": "Es un gran cerote."},{"es": "Mejor ni le hablés."}]},
    "L26": {"items": [{"id": "L26-01", "en": "liar", "es": "mentiroso"},{"id": "L26-02", "en": "He played me", "es": "Me vio la cara"},{"id": "L26-03", "en": "Don't believe him", "es": "No le creás"},{"id": "L26-04", "en": "You were right", "es": "Tenías razón"},{"id": "L26-05", "en": "backstabber", "es": "traicionero"},{"id": "L26-06", "en": "I told you so", "es": "Te lo dije"},{"id": "L26-07", "en": "He can't be trusted", "es": "No es de fiar"},{"id": "L26-08", "en": "snake", "es": "culebra"},{"id": "L26-09", "en": "I learned my lesson", "es": "Ya aprendí la lección"},{"id": "L26-10", "en": "Watch out for that person", "es": "Cuidáte de esa persona"}],"dialogue": [{"es": "¿Te dije o no te dije? Ese maje es un mentiroso."},{"es": "Tenías razón. Me vio la cara."},{"es": "Nunca le creás a esa gente."},{"es": "Ya aprendí la lección."}]},
    "L27": {"items": [{"id": "L27-01", "en": "Who does he think he is?", "es": "¿Quién se cree?"},{"id": "L27-02", "en": "stuck up", "es": "creído"},{"id": "L27-03", "en": "show-off", "es": "alzado"},{"id": "L27-04", "en": "just because", "es": "solo porque"},{"id": "L27-05", "en": "to show off", "es": "farolear"},{"id": "L27-06", "en": "She thinks she's hot stuff", "es": "Se las tira"},{"id": "L27-07", "en": "Get over yourself", "es": "Bajáte los humos"},{"id": "L27-08", "en": "pretentious", "es": "plástico"},{"id": "L27-09", "en": "Money doesn't give you class", "es": "El pisto no da clase"},{"id": "L27-10", "en": "humble yourself", "es": "Sé humilde"}],"dialogue": [{"es": "¿Viste a la nueva? Se cree mucho."},{"es": "Sí, anda bien creída."},{"es": "Solo porque tiene pisto."},{"es": "El pisto no da clase."}]},
    "L28": {"items": [{"id": "L28-01", "en": "cringe moment", "es": "coyol"},{"id": "L28-02", "en": "secondhand embarrassment", "es": "vergüenza ajena"},{"id": "L28-03", "en": "I felt bad for him", "es": "Me dio pena por él"},{"id": "L28-04", "en": "He made a fool of himself", "es": "Hizo el ridículo"},{"id": "L28-05", "en": "awkward", "es": "incómodo"},{"id": "L28-06", "en": "He confessed his love", "es": "Se le declaró"},{"id": "L28-07", "en": "He got rejected", "es": "Lo batearon"},{"id": "L28-08", "en": "I can't even watch", "es": "No puedo ni ver"},{"id": "L28-09", "en": "That's so embarrassing!", "es": "¡Qué pena!"},{"id": "L28-10", "en": "What a disaster", "es": "Fue un desastre"}],"dialogue": [{"es": "¿Viste eso? ¡Qué coyol!"},{"es": "Se le declaró y ella le dijo que no."},{"es": "¡Qué vergüenza ajena!"},{"es": "Me dio pena por él."}]},
    "L29": {"items": [{"id": "L29-01", "en": "I have some good gossip", "es": "Tengo un chisme bien bueno"},{"id": "L29-02", "en": "Tell me now!", "es": "¡Contáme ya!"},{"id": "L29-03", "en": "They say that", "es": "Dicen que"},{"id": "L29-04", "en": "I don't believe you", "es": "No te creo"},{"id": "L29-05", "en": "Who told you?", "es": "¿Quién te dijo?"},{"id": "L29-06", "en": "apparently", "es": "al parecer"},{"id": "L29-07", "en": "everyone's talking about it", "es": "todo mundo está hablando de eso"},{"id": "L29-08", "en": "the drama", "es": "el drama"},{"id": "L29-09", "en": "spill the tea", "es": "Soltá la sopa"},{"id": "L29-10", "en": "This stays between us", "es": "Esto queda entre nosotros"}],"dialogue": [{"es": "Tengo un chisme bien bueno."},{"es": "¡Contáme ya!"},{"es": "Dicen que la Sandra está embarazada."},{"es": "¡No te creo! ¿Quién es el papá?"}]},
    "L30": {"items": [{"id": "L30-01", "en": "I can't stand you!", "es": "¡Ya no te aguanto!"},{"id": "L30-02", "en": "Nobody's begging you", "es": "Nadie te está rogando"},{"id": "L30-03", "en": "You're the worst", "es": "Sos lo peor"},{"id": "L30-04", "en": "The feeling is mutual", "es": "El sentimiento es mutuo"},{"id": "L30-05", "en": "I never want to see you again", "es": "No te quiero volver a ver"},{"id": "L30-06", "en": "Get lost!", "es": "¡Andá a la gran puchica!"},{"id": "L30-07", "en": "Don't ever come back", "es": "No volvás nunca"},{"id": "L30-08", "en": "You disgust me", "es": "Me das asco"},{"id": "L30-09", "en": "We're done", "es": "Ya se acabó"},{"id": "L30-10", "en": "Bye!", "es": "¡Chao!"}],"dialogue": [{"es": "¡Ya no te aguanto!"},{"es": "¡Pues andáte! Nadie te está rogando."},{"es": "¡Sos la peor persona que conozco!"},{"es": "El sentimiento es mutuo. ¡Chao!"}]},
}

async def generate_audio(text, voice, output_path, rate="-10%"):
    """Generate a single MP3 file. Retries with padded text if short inputs fail."""
    # Very short text can cause edge-tts to return no audio
    # Pad with a leading period if text is under 4 chars
    padded = f". {text}" if len(text) < 4 else text
    for attempt in range(3):
        try:
            communicate = edge_tts.Communicate(padded if attempt > 0 else text, voice, rate=rate)
            await communicate.save(output_path)
            print(f"  ✓ {output_path}")
            return
        except Exception as e:
            if attempt < 2:
                padded = f"{text}."  # try trailing period
                print(f"  ⚠ Retry {attempt+1} for '{text}' — {e}")
                await asyncio.sleep(1)
            else:
                print(f"  ✗ FAILED: {output_path} — {e}")
                # Write a tiny silent mp3 placeholder so the build doesn't break
                if os.path.exists(output_path):
                    os.remove(output_path)
                return

async def main():
    os.makedirs("audio/es", exist_ok=True)
    os.makedirs("audio/en", exist_ok=True)

    manifest = {}

    for lesson_id, lesson in LESSONS.items():
        print(f"\n{'='*50}")
        print(f"Generating {lesson_id}...")
        print(f"{'='*50}")

        for item in lesson["items"]:
            item_id = item["id"]
            manifest[item_id] = {}

            es_path = f"audio/es/{item_id}.mp3"
            await generate_audio(item["es"], SPANISH_VOICE, es_path)
            manifest[item_id]["es"] = es_path

            en_path = f"audio/en/{item_id}.mp3"
            await generate_audio(item["en"], ENGLISH_VOICE, en_path)
            manifest[item_id]["en"] = en_path

        for i, line in enumerate(lesson.get("dialogue", [])):
            dl_id = f"{lesson_id}-DL{i+1:02d}"
            dl_path = f"audio/es/{dl_id}.mp3"
            await generate_audio(line["es"], SPANISH_VOICE, dl_path)
            manifest[dl_id] = {"es": dl_path}

    with open("audio/manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"\n✅ Done! Generated {len(manifest)} audio files.")
    print(f"   Manifest saved to audio/manifest.json")

    print(f"\nGenerating base64 bundle for embedding...")
    bundle = {}
    skipped = 0
    for key, paths in manifest.items():
        bundle[key] = {}
        for lang, path in paths.items():
            if os.path.exists(path) and os.path.getsize(path) > 0:
                with open(path, "rb") as f:
                    b64 = base64.b64encode(f.read()).decode("utf-8")
                    bundle[key][lang] = f"data:audio/mpeg;base64,{b64}"
            else:
                skipped += 1
    if skipped:
        print(f"  ⚠ Skipped {skipped} missing/empty audio files")

    with open("audio/audio-bundle.json", "w") as f:
        json.dump(bundle, f)
    print(f"✅ Base64 bundle saved to audio/audio-bundle.json")

    print(f"\n--- Summary ---")
    print(f"Total audio files: {len(manifest)}")
    print(f"Spanish voice: {SPANISH_VOICE}")
    print(f"English voice: {ENGLISH_VOICE}")
    print(f"\nTo see all available voices:")
    print(f"  edge-tts --list-voices | grep es-")

if __name__ == "__main__":
    asyncio.run(main())
