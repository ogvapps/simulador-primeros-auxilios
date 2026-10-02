export const DAILY_SCENARIOS_ES = [
  {
    id: 1,
    q: 'Vas paseando y ves a un ciclista caerse. Se golpea la cabeza y no se mueve. ¿Qué haces PRIMERO?',
    options: ['Corro a quitarle el casco para que respire mejor.', 'Llamo al 112 inmediatamente.', 'Me acerco con cuidado asegurando la zona (Conducta PAS).', 'Le doy agua para que se recupere.'],
    correct: 2,
    explanation: '¡Orden PAS! 1º Proteger (asegurar zona), 2º Avisar, 3º Socorrer. Quitar el casco puede agravar una lesión cervical.',
  },
  {
    id: 2,
    q: 'En una comida familiar, tu primo se lleva las manos al cuello y no puede toser ni respirar. ¿Qué maniobra aplicas?',
    options: ['Maniobra de Heimlich.', 'Relleno Capilar.', 'RCP (30 compresiones / 2 ventilaciones).', 'Le doy golpes en la nuca.'],
    correct: 0,
    explanation: 'Es una obstrucción completa. Heimlich es la técnica indicada. Los golpes en la espalda (nuca no) son previos, pero si no tose, Heimlich es vital.',
  },
  {
    id: 3,
    q: 'Encuentras a una persona inconsciente que SÍ respira. ¿En qué posición la colocas?',
    options: ['Boca arriba (Decúbito Supino).', 'Posición Lateral de Seguridad (PLS).', 'Sentado para que no se maree.', 'Boca abajo.'],
    correct: 1,
    explanation: 'La PLS evita que la lengua obstruya la vía aérea y que se ahogue si vomita.',
  },
  {
    id: 4,
    q: 'Te quemas la mano con aceite hirviendo. ¿Qué es lo primero que aplicas?',
    options: ['Hielo directo.', 'Pasta de dientes.', 'Agua fría del grifo durante 15-20 min.', 'Mantequilla o aceite.'],
    correct: 2,
    explanation: 'El agua fría detiene la destrucción de tejidos por calor. El hielo quema por frío y las pastas/aceites infectan.',
  },
  {
    id: 5,
    q: 'Presencias una convulsión epiléptica. ¿Qué NO debes hacer?',
    options: ['Meterle algo en la boca para que no se muerda la lengua.', 'Protegerle la cabeza con algo blando.', 'Cronometrar la duración.', 'Aflojar la ropa apretada.'],
    correct: 0,
    explanation: 'NUNCA introduzcas nada en la boca. Podrías romperle los dientes o sufrir tú una mordedura grave. No se tragará la lengua.',
  },
];

export const ROLEPLAY_SCENARIOS_ES = {
  sim_patio: {
    title: 'Emergencia en el Patio',
    startNode: 'inicio',
    nodes: {
      inicio: { text: 'Estás en el recreo. Ves a un compañero golpearse la cabeza y quedar inmóvil.', options: [{ text: 'Sacudirlo.', next: 'error_sacudir' }, { text: 'Aplicar PAS.', next: 'pas_proteger' }] },
      error_sacudir: { text: '¡ERROR! Podrías agravar una lesión. Nunca muevas bruscamente.', isFailure: true },
      pas_proteger: { text: 'Bien hecho. Aseguras la zona. No responde.', options: [{ text: 'Gritar ayuda y Ver-Oír-Sentir.', next: 'valoracion' }, { text: 'Ir a por un profe.', next: 'error_abandono' }] },
      error_abandono: { text: 'No abandones a la víctima inconsciente si estás solo.', isFailure: true },
      valoracion: { text: 'Respira pero está inconsciente.', options: [{ text: 'RCP.', next: 'error_rcp' }, { text: 'Posición Lateral (PLS).', next: 'exito_pls' }] },
      error_rcp: { text: 'Si respira, no se hace RCP.', isFailure: true },
      exito_pls: { text: '¡Perfecto! PLS y 112.', isSuccess: true },
    },
  },
  sim_comedor: {
    title: 'Susto en el Comedor',
    startNode: 'inicio',
    nodes: {
      inicio: { text: 'Alumno atragantado. Se lleva manos al cuello. No tose.', options: [{ text: 'Dar agua.', next: 'error_agua' }, { text: 'Actuar (Obstrucción total).', next: 'actuar' }] },
      error_agua: { text: 'El agua puede empeorar la obstrucción.', isFailure: true },
      actuar: { text: 'Te colocas detrás.', options: [{ text: 'Heimlich directo.', next: 'error_directo' }, { text: '5 golpes espalda.', next: 'golpes' }] },
      error_directo: { text: 'Primero 5 golpes interescapulares.', isFailure: true },
      golpes: { text: 'No sale el objeto.', options: [{ text: 'Compresiones Heimlich.', next: 'exito_heimlich' }] },
      exito_heimlich: { text: '¡Objeto expulsado!', isSuccess: true },
    },
  },
};

export const DAILY_SCENARIOS_EN = [
  {
    id: 1,
    q: 'You see a cyclist fall. Hits head and does not move. What do you do FIRST?',
    options: ['Run to remove helmet so they breathe better.', 'Call 112 immediately.', 'Approach carefully ensuring the area (PAS).', 'Give water.'],
    correct: 2,
    explanation: 'PAS Order! 1st Protect (ensure zone), 2nd Alert, 3rd Support. Removing helmet can worsen cervical injury.',
  },
  {
    id: 2,
    q: 'At a family meal, your cousin grabs their neck and cannot cough or breathe. What do you do?',
    options: ['Heimlich Maneuver.', 'Capillary Refill.', 'CPR (30 compressions / 2 breaths).', 'Slap the neck.'],
    correct: 0,
    explanation: 'It is a complete obstruction. Heimlich is indicated. Back blows are prior, but if no cough, Heimlich is vital.',
  },
  {
    id: 3,
    q: 'You find an unconscious person who IS breathing. Position?',
    options: ['Face up (Supine).', 'Recovery Position (PLS).', 'Sitting.', 'Face down.'],
    correct: 1,
    explanation: 'PLS prevents tongue or vomit from blocking the airway.',
  },
  {
    id: 4,
    q: 'Burn hand with boiling oil. First thing to apply?',
    options: ['Direct ice.', 'Toothpaste.', 'Cold tap water for 15-20 min.', 'Butter or oil.'],
    correct: 2,
    explanation: 'Cold water stops tissue destruction by heat. Ice burns by cold and pastes infect.',
  },
  {
    id: 5,
    q: 'You witness an epileptic seizure. What NOT to do?',
    options: ['Put something in mouth.', 'Protect head with soft object.', 'Time the duration.', 'Loosen tight clothes.'],
    correct: 0,
    explanation: 'NEVER put anything in mouth. You could break teeth or get bitten. They will not swallow tongue.',
  },
];

export const ROLEPLAY_SCENARIOS_EN = {
  sim_patio: {
    title: 'Emergency at Playground',
    startNode: 'start',
    nodes: {
      start: { text: 'You are at break. You see a classmate hit their head and stay still.', options: [{ text: 'Shake them.', next: 'error_shake' }, { text: 'Apply PAS.', next: 'pas_protect' }] },
      error_shake: { text: 'ERROR! You could worsen an injury. Never move abruptly.', isFailure: true },
      pas_protect: { text: 'Well done. Zone secured. No response.', options: [{ text: 'Shout for help and See-Hear-Feel.', next: 'check' }, { text: 'Go find a teacher.', next: 'error_leave' }] },
      error_leave: { text: 'Do not leave unconscious victim alone if solo.', isFailure: true },
      check: { text: 'Breathing but unconscious.', options: [{ text: 'CPR.', next: 'error_cpr' }, { text: 'Recovery Pos (PLS).', next: 'success_pls' }] },
      error_cpr: { text: 'If breathing, no CPR.', isFailure: true },
      success_pls: { text: 'Perfect! PLS and 112.', isSuccess: true },
    },
  },
  sim_comedor: {
    title: 'Scare at Canteen',
    startNode: 'start',
    nodes: {
      start: { text: 'Student choking. Hands to neck. No cough.', options: [{ text: 'Give water.', next: 'error_water' }, { text: 'Act (Total blockage).', next: 'act' }] },
      error_water: { text: 'Water can worsen obstruction.', isFailure: true },
      act: { text: 'Stand behind.', options: [{ text: 'Heimlich direct.', next: 'error_direct' }, { text: '5 Back blows.', next: 'blows' }] },
      error_direct: { text: 'First 5 back blows.', isFailure: true },
      blows: { text: 'Object not out.', options: [{ text: 'Heimlich compressions.', next: 'success_heimlich' }] },
      success_heimlich: { text: 'Object expelled!', isSuccess: true },
    },
  },
};

export const DAILY_SCENARIOS = DAILY_SCENARIOS_ES;
export const ROLEPLAY_SCENARIOS = ROLEPLAY_SCENARIOS_ES;
