import React from 'react';
import {
  ShieldCheck, UserCheck, HeartPulse, Flame, BookOpen,
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, ArrowLeft, Droplets,
  Wind, Award, Volume2, Frown, HardHat, Smile, Brain, Syringe, AirVent,
  Activity, Gauge, Waves, BriefcaseMedical, Zap, MessageSquare, Siren,
  RotateCcw, FileSpreadsheet, Users, Search, ThermometerSnowflake, Candy,
  GraduationCap, Trophy, VolumeX, Stethoscope, Layers, Crown, Phone
} from 'lucide-react';
import { Badge, Module, RoleplayScenario, ExamQuestion, PairScenario } from './types';

// Custom Icons
const HandIcon = ({size, className}: {size: number, className?: string}) => <div className={className} style={{fontSize: size}}>✋</div>;
const TargetIcon = ({size, className}: {size: number, className?: string}) => <div className={className} style={{fontSize: size}}>🎯</div>;
const PhoneIcon = ({size, className}: {size: number, className?: string}) => <div className={className} style={{fontSize: size}}>📞</div>;
const ArchiveIcon = ({size, className}: {size: number, className?: string}) => <div className={className} style={{fontSize: size}}>✂️</div>;

export const DESA_SIMULATOR_URL = 'https://ogvapps.github.io/desa/';
export const MIN_PASS_SCORE = 8; 
export const ADMIN_PIN = '2024';

export const LEVELS = [
  { level: 1, name: "Novato", minXp: 0 },
  { level: 2, name: "Aprendiz", minXp: 150 },
  { level: 3, name: "Rescatador", minXp: 400 }, // Desbloquea Guardia
  { level: 4, name: "Experto", minXp: 800 },
  { level: 5, name: "Maestro", minXp: 1500 },
];

export const XP_REWARDS = {
  MODULE_COMPLETE: 50,
  GAME_WIN: 30,
  EXAM_PASS: 200,
  PERFECT_SCORE: 100,
  GUARDIA_SAVE: 20,
  PAIR_GAME_WIN: 60
};

export const MISSION_TITLES = [
  "Misión 1: Fundamentos Vitales",
  "Misión 2: Traumatismos y Accidentes",
  "Misión 3: Emergencias Médicas",
  "Misión 4: Maestría y Práctica"
];

// EMERGENCY MODE DATA
export const EMERGENCY_STEPS = [
  { 
    title: "1. LLAMA AL 112", 
    text: "Mantén la calma. Di dónde estás y qué sucede.", 
    icon: <Phone size={48} className="text-white" />,
    color: "bg-blue-600"
  },
  { 
    title: "2. COMPRUEBA CONSCIENCIA", 
    text: "Habla alto y sacude suavemente los hombros.", 
    icon: <UserCheck size={48} className="text-white" />,
    color: "bg-orange-500"
  },
  { 
    title: "3. COMPRUEBA RESPIRACIÓN", 
    text: "Ver, Oír, Sentir durante 10 segundos.", 
    icon: <Wind size={48} className="text-white" />,
    color: "bg-teal-500"
  },
  { 
    title: "4. SI NO RESPIRA: RCP", 
    text: "Centro del pecho. Fuerte y rápido. 30 compresiones, 2 ventilaciones.", 
    icon: <HeartPulse size={48} className="text-white" />,
    color: "bg-red-600",
    action: "guide_rcp"
  },
  { 
    title: "5. SI RESPIRA: PLS", 
    text: "Ponlo de lado para que no se ahogue.", 
    icon: <RotateCcw size={48} className="text-white" />,
    color: "bg-green-600"
  },
  { 
    title: "HEMORRAGIA FUERTE", 
    text: "Aprieta la herida con fuerza. No sueltes.", 
    icon: <Droplets size={48} className="text-white" />,
    color: "bg-red-800"
  }
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  pas: <ShieldCheck size={48} className="text-blue-500" />,
  pls: <UserCheck size={48} className="text-green-500" />,
  rcp: <HeartPulse size={48} className="text-red-500" />,
  hemorragia: <Droplets size={48} className="text-red-600" />,
  quemaduras: <Flame size={48} className="text-orange-500" />,
  atragantamiento: <Wind size={48} className="text-cyan-500" />,
  sincope: <Frown size={48} className="text-teal-500" />,
  golpes: <HardHat size={48} className="text-gray-600" />,
  bucodental: <Smile size={48} className="text-pink-500" />,
  craneo: <Brain size={48} className="text-purple-600" />,
  anafilaxia: <Syringe size={48} className="text-red-700" />,
  asma: <AirVent size={48} className="text-blue-600" />,
  epilepsia: <Activity size={48} className="text-indigo-500" />,
  diabetes: <Gauge size={48} className="text-blue-700" />,
  ansiedad: <Waves size={48} className="text-green-400" />,
  botiquin: <BriefcaseMedical size={48} className="text-red-400" />,
  examen: <GraduationCap size={48} className="text-indigo-700" />,
  glosario: <BookOpen size={48} className="text-gray-600" />,
  certificado: <Award size={48} className="text-yellow-500" />,
  desa: <Zap size={48} className="text-yellow-600" />,
  roleplay: <MessageSquare size={48} className="text-violet-600" />,
  triaje: <Siren size={48} className="text-rose-600" />,
  flashcards: <Layers size={48} className="text-emerald-600" />,
  pair_game: <Users size={48} className="text-pink-600" />,
};

export const BADGE_DATA: Badge[] = [
  { id: 'pas', title: 'PAS', icon: ICON_MAP.pas, color: 'text-blue-500' },
  { id: 'pls', title: 'PLS', icon: ICON_MAP.pls, color: 'text-green-500' },
  { id: 'rcp', title: 'RCP', icon: ICON_MAP.rcp, color: 'text-red-500' },
  { id: 'hemorragia', title: 'Hemorragia', icon: ICON_MAP.hemorragia, color: 'text-red-600' },
  { id: 'quemaduras', title: 'Quemaduras', icon: ICON_MAP.quemaduras, color: 'text-orange-500' },
  { id: 'atragantamiento', title: 'Heimlich', icon: ICON_MAP.atragantamiento, color: 'text-cyan-500' },
  { id: 'sincope', title: 'Síncope', icon: ICON_MAP.sincope, color: 'text-teal-500' },
  { id: 'golpes', title: 'Golpes', icon: ICON_MAP.golpes, color: 'text-gray-600' },
  { id: 'bucodental', title: 'Bucodental', icon: ICON_MAP.bucodental, color: 'text-pink-500' },
  { id: 'craneo', title: 'Cráneo', icon: ICON_MAP.craneo, color: 'text-purple-600' },
  { id: 'anafilaxia', title: 'Anafilaxia', icon: ICON_MAP.anafilaxia, color: 'text-red-700' },
  { id: 'asma', title: 'Asma', icon: ICON_MAP.asma, color: 'text-blue-600' },
  { id: 'epilepsia', title: 'Epilepsia', icon: ICON_MAP.epilepsia, color: 'text-indigo-500' },
  { id: 'diabetes', title: 'Diabetes', icon: ICON_MAP.diabetes, color: 'text-blue-700' },
  { id: 'ansiedad', title: 'Ansiedad', icon: ICON_MAP.ansiedad, color: 'text-green-400' },
  { id: 'botiquin', title: 'Botiquín', icon: ICON_MAP.botiquin, color: 'text-red-400' },
  { id: 'triaje', title: 'Triaje', icon: ICON_MAP.triaje, color: 'text-rose-600' },
  { id: 'sim_patio', title: 'Sim: Patio', icon: ICON_MAP.roleplay, color: 'text-violet-500' },
  { id: 'sim_comedor', title: 'Sim: Comedor', icon: ICON_MAP.roleplay, color: 'text-violet-500' },
];

export const MODULES: Module[] = [
  { 
    id: 'pas', title: '1. Método PAS', description: 'Aprende a Proteger, Avisar y Socorrer.', icon: 'pas', type: 'module', 
    content: { 
      videoUrls: ['https://www.youtube.com/watch?v=-OMdNPqwbso'], 
      steps: [
        { title: '¿Qué es PAS?', text: 'Es la regla de oro en emergencias: PROTEGER, AVISAR y SOCORRER. Memorízala bien.', icon: <ShieldCheck size={64} className="text-blue-500" /> },
        { title: '1. PROTEGER', text: 'Antes de actuar, asegúrate de que TÚ no corres peligro. Aparta objetos, señaliza la zona y ponte chaleco si es tráfico.', icon: <AlertTriangle size={64} className="text-orange-500" /> },
        { title: '2. AVISAR', text: 'Llama al 112. Mantén la calma. Entrena tu llamada en el siguiente simulador.', icon: <Volume2 size={64} className="text-blue-600" />, interactiveComponent: 'Chat112Game' },
        { title: '3. SOCORRER', text: 'Ayuda a la víctima dentro de tus conocimientos. No hagas más de lo que sabes.', icon: <HeartPulse size={64} className="text-red-500" /> },
        { title: '¡Ponlo en Práctica!', text: 'Ordena la secuencia correctamente en este minijuego.', icon: <Trophy size={64} className="text-yellow-500" />, interactiveComponent: 'SequenceGame_PAS' }
      ] 
    } 
  },
  { 
    id: 'pls', title: '2. Posición Lateral', description: 'Postura para inconscientes que respiran.', icon: 'pls', type: 'module', 
    content: { 
      videoUrls: ['https://www.youtube.com/watch?v=nUYWcEKeBZQ'],
      steps: [
        { title: '¿Cuándo usarla?', text: 'Si la persona está inconsciente (no responde) PERO SÍ respira con normalidad. Evita que se atragante con su lengua o vómito.', icon: <UserCheck size={64} className="text-green-500" /> },
        { title: 'Paso 1: Brazo Cerca', text: 'Coloca el brazo más cercano a ti en ángulo recto (como saludando).', icon: <ArrowLeft size={64} className="text-gray-600" /> },
        { title: 'Paso 2: Brazo Lejos', text: 'Trae el brazo lejano sobre el pecho y pon el dorso de su mano contra su mejilla contraria.', icon: <ArrowRight size={64} className="text-gray-600" /> },
        { title: 'Paso 3: Pierna y Giro', text: 'Levanta la pierna lejana y tira de ella hacia ti para girar todo el cuerpo de lado.', icon: <RotateCcw size={64} className="text-green-600" /> },
        { title: 'Paso 4: Ajuste', text: 'Abre la boca de la víctima ligeramente para facilitar la respiración. Llama al 112.', icon: <CheckCircle2 size={64} className="text-blue-500" /> }
      ] 
    } 
  },
  { 
    id: 'rcp', title: '3. RCP Básica', description: 'Reanimación Cardiopulmonar.', icon: 'rcp', type: 'module', 
    content: { 
      videoUrls: ['https://www.youtube.com/watch?v=7SBBka5fwW8'],
      steps: [
        { title: '¿Cuándo hacer RCP?', text: 'Solo si la persona NO responde y NO respira. Llama al 112 inmediatamente o pide que traigan un DESA.', icon: <AlertTriangle size={64} className="text-red-600" /> },
        { title: 'Posición de manos', text: 'Talón de una mano en el centro del pecho (esternón). La otra mano encima entrelazando los dedos.', icon: <HeartPulse size={64} className="text-red-500" /> },
        { title: 'Compresiones', text: 'Brazos rectos. Deja caer tu peso. Comprime fuerte y rápido (5-6 cm de profundidad).', icon: <Activity size={64} className="text-orange-500" /> },
        { title: 'El Ritmo', text: 'Debes hacer 100-120 compresiones por minuto. Sigue el ritmo de "Macarena" o "Bob Esponja".', icon: <Zap size={64} className="text-yellow-500" /> },
        { title: 'Entrenamiento Práctico', text: 'Demuestra que puedes mantener el ritmo correcto en este simulador.', icon: <Gauge size={64} className="text-red-600" />, interactiveComponent: 'RcpGame' }
      ] 
    } 
  },
  { 
    id: 'hemorragia', title: '4. Hemorragias', description: 'Control de sangrados.', icon: 'hemorragia', type: 'module', 
    content: { 
      videoUrls: ['https://www.youtube.com/watch?v=cVWQm_CPG3o'],
      steps: [
        { title: 'Presión Directa', text: 'Es lo más importante. Presiona fuerte sobre la herida con gasas o un trapo limpio.', icon: <Droplets size={64} className="text-red-600" /> },
        { title: 'No Quitar', text: 'Si el apósito se empapa, NO lo quites. Pon otro limpio encima y sigue apretando.', icon: <FileSpreadsheet size={64} className="text-gray-500" /> },
        { title: 'Elevación', text: 'Si es posible y no hay fractura, eleva la extremidad por encima del corazón.', icon: <ArrowRight size={64} className="text-blue-500 transform -rotate-45" /> },
        { title: 'Sangrado de Nariz', text: 'Inclina la cabeza hacia DELANTE (no atrás) y presiona las aletas nasales 10 minutos.', icon: <Frown size={64} className="text-red-400" /> }
      ] 
    } 
  },
  { 
    id: 'quemaduras', title: '5. Quemaduras', description: 'Enfriar y cubrir.', icon: 'quemaduras', type: 'module', 
    content: { 
      steps: [
        { title: 'Agua, agua y agua', text: 'Pon la zona quemada bajo agua fría (no helada) durante 15-20 minutos.', icon: <Droplets size={64} className="text-blue-400" /> },
        { title: 'Lo que NO debes hacer', text: 'Nunca apliques pasta de dientes, aceite ni rompas las ampollas. Eso causa infección.', icon: <XCircle size={64} className="text-red-500" /> },
        { title: 'Cubrir', text: 'Cubre suavemente con gasas estériles húmedas o film transparente limpio sin apretar.', icon: <ShieldCheck size={64} className="text-green-500" /> }
      ] 
    } 
  },
  { 
    id: 'atragantamiento', title: '6. Atragantamiento', description: 'Maniobra de Heimlich.', icon: 'atragantamiento', type: 'module', 
    content: { 
      videoUrls: ['https://www.youtube.com/watch?v=CsMfu8Iuvgc'],
      steps: [
        { title: '¿Tose?', text: 'Si la víctima tose, anímala a seguir tosiendo. No le des golpes en la espalda todavía.', icon: <Wind size={64} className="text-gray-500" /> },
        { title: 'No respira / No tose', text: 'Si deja de toser y se lleva las manos al cuello: Inclínalo y da 5 golpes fuertes entre los omóplatos.', icon: <HandIcon size={64} className="text-orange-500" /> },
        { title: 'Maniobra de Heimlich', text: 'Si no expulsa el objeto: Abraza desde atrás, puño en la boca del estómago y presiona hacia dentro y arriba.', icon: <Users size={64} className="text-blue-600" /> },
        { title: '¿Dónde presionar?', text: 'Aprende el punto exacto en este minijuego interactivo.', icon: <TargetIcon size={64} className="text-red-500" />, interactiveComponent: 'HeimlichGame' }
      ] 
    } 
  },
  { 
    id: 'sincope', title: '7. Desmayos', description: 'Síncope y Lipotimia.', icon: 'sincope', type: 'module', 
    content: { 
      steps: [
        { title: 'Síntomas previos', text: 'Mareo, sudor frío, palidez, visión borrosa. Actúa rápido antes de que caiga.', icon: <Frown size={64} className="text-gray-400" /> },
        { title: 'Tumbar y Elevar', text: 'Tumba a la persona y levántale las piernas (posición antishock) para que la sangre vaya al cerebro.', icon: <ArrowRight size={64} className="text-blue-500 transform -rotate-45" /> },
        { title: 'Aire Fresco', text: 'Evita aglomeraciones alrededor. Afloja ropa apretada (cuello, cinturón).', icon: <Wind size={64} className="text-cyan-400" /> },
        { title: 'Recuperación', text: 'No dar comida ni bebida hasta que esté totalmente recuperado. Si no despierta, PLS y 112.', icon: <CheckCircle2 size={64} className="text-green-500" /> }
      ] 
    } 
  },
  { 
    id: 'golpes', title: '8. Traumatismos', description: 'Golpes y Fracturas.', icon: 'golpes', type: 'module', 
    content: { 
      steps: [
        { title: 'Frío Local', text: 'Aplica hielo (envuelto en paño) sobre el golpe para bajar la inflamación y el dolor.', icon: <ThermometerSnowflake size={64} className="text-blue-400" /> },
        { title: 'Reposo', text: 'No muevas la zona afectada, especialmente si sospechas fractura (dolor intenso, deformidad).', icon: <AlertTriangle size={64} className="text-orange-500" /> },
        { title: 'Inmovilizar', text: 'Si hay fractura, no intentes colocar el hueso. Inmoviliza tal cual está y ve al hospital.', icon: <Activity size={64} className="text-red-500" /> }
      ] 
    } 
  },
  { 
    id: 'bucodental', title: '9. Dientes', description: 'Trauma dental.', icon: 'bucodental', type: 'module', 
    content: { 
      steps: [
        { title: 'Diente Roto', text: 'Si se rompe un trozo, intenta encontrarlo. Limpia suavemente con agua.', icon: <Search size={64} className="text-gray-500" /> },
        { title: 'Diente Arrancado', text: '¡El tiempo es oro! Coge el diente por la corona (la parte blanca), NUNCA por la raíz.', icon: <Smile size={64} className="text-gray-400" /> },
        { title: 'Transporte', text: 'Llévalo en un vaso con leche, suero o saliva del propio paciente. Ve al dentista urgentemente.', icon: <BriefcaseMedical size={64} className="text-blue-500" /> }
      ] 
    } 
  },
  { 
    id: 'craneo', title: '10. Golpe Cabeza', description: 'Vigilancia neurológica.', icon: 'craneo', type: 'module', 
    content: { 
      steps: [
        { title: 'Vigilancia', text: 'Tras un golpe fuerte en la cabeza, no dejes sola a la persona. Obsérvala.', icon: <UserCheck size={64} className="text-blue-500" /> },
        { title: 'Signos de Alarma', text: 'Vómitos, somnolencia excesiva, desorientación, pupilas de diferente tamaño. ¡Al hospital!', icon: <AlertTriangle size={64} className="text-red-600" /> },
        { title: 'No mover', text: 'Si el golpe fue muy fuerte o hay dolor de cuello, NO muevas a la víctima (riesgo lesión medular).', icon: <XCircle size={64} className="text-red-500" /> }
      ] 
    } 
  },
  { 
    id: 'anafilaxia', title: '11. Anafilaxia', description: 'Alergia grave.', icon: 'anafilaxia', type: 'module', 
    content: { 
      steps: [
        { title: 'Reacción Grave', text: 'Ocurre rápido tras comer algo, picadura o medicamento. Hinchazón de labios, dificultad para respirar.', icon: <Activity size={64} className="text-red-600" /> },
        { title: 'Autoinyector', text: 'Pregunta si lleva adrenalina (EpiPen). Si es así, ayúdale a usarla en el muslo.', icon: <Syringe size={64} className="text-orange-500" /> },
        { title: 'Llama al 112', text: 'Es una emergencia vital. Llama siempre, aunque mejore tras la inyección.', icon: <Volume2 size={64} className="text-blue-600" /> }
      ] 
    } 
  },
  { 
    id: 'asma', title: '12. Asma', description: 'Crisis respiratoria.', icon: 'asma', type: 'module', 
    content: { 
      steps: [
        { title: 'Calma', text: 'La ansiedad empeora la crisis. Tranquiliza a la persona y ayúdala a sentarse (mejor que tumbada).', icon: <Smile size={64} className="text-green-500" /> },
        { title: 'Inhalador', text: 'Usa su inhalador de rescate (ventolín). Normalmente 2 puffs.', icon: <AirVent size={64} className="text-blue-500" /> },
        { title: 'Si no mejora', text: 'Si tras unos minutos sigue con dificultad para respirar o labios azules, llama al 112.', icon: <PhoneIcon size={64} className="text-red-500" /> }
      ] 
    } 
  },
  { 
    id: 'epilepsia', title: '13. Epilepsia', description: 'Convulsiones.', icon: 'epilepsia', type: 'module', 
    content: { 
      videoUrls: ['https://www.youtube.com/watch?v=8TK3N3ZT_TQ'],
      steps: [
        { title: 'No sujetar', text: 'NO intentes inmovilizar a la persona. Despeja el área de objetos con los que pueda golpearse.', icon: <XCircle size={64} className="text-red-500" /> },
        { title: 'Protege la cabeza', text: 'Pon algo blando (chaqueta, cojín) bajo su cabeza para evitar golpes contra el suelo.', icon: <Brain size={64} className="text-violet-500" /> },
        { title: 'Boca Libre', text: 'NUNCA metas nada en su boca. No se tragará la lengua. Podrías hacerle daño o que te muerda.', icon: <XCircle size={64} className="text-orange-500" /> },
        { title: 'Al terminar', text: 'Cuando pare la convulsión, ponlo en PLS y deja que descanse. Cronometra la duración.', icon: <UserCheck size={64} className="text-green-500" /> }
      ] 
    } 
  },
  { 
    id: 'diabetes', title: '14. Diabetes', description: 'Azúcar alto/bajo.', icon: 'diabetes', type: 'module', 
    content: { 
      steps: [
        { title: 'Hipoglucemia', text: 'Bajada de azúcar: sudor, temblor, mareo, confusión. Es lo más común y peligroso a corto plazo.', icon: <ArrowRight size={64} className="text-red-500 transform rotate-90" /> },
        { title: 'Azúcar Rápido', text: 'Si está consciente, dale azúcar: zumo, refresco, caramelos o sobre de azúcar.', icon: <Candy size={64} className="text-orange-500" /> },
        { title: 'Inconsciente', text: 'Si pierde el conocimiento, NUNCA des nada por boca (se atragantará). Llama al 112 y PLS.', icon: <PhoneIcon size={64} className="text-blue-500" /> }
      ] 
    } 
  },
  { 
    id: 'ansiedad', title: '15. Ansiedad', description: 'Crisis de pánico.', icon: 'ansiedad', type: 'module', 
    content: { 
      steps: [
        { title: 'Hiperventilación', text: 'Respiran muy rápido y sienten hormigueo en manos y boca. Creen que se ahogan.', icon: <Wind size={64} className="text-gray-400" /> },
        { title: 'Acompañar', text: 'Habla con tono calmado y firme. "Estoy aquí contigo, vas a estar bien".', icon: <Users size={64} className="text-green-500" /> },
        { title: 'Respiración', text: 'Guíale para respirar lento. Inspira por nariz 3 seg, aguanta 3 seg, expulsa 3 seg.', icon: <Activity size={64} className="text-blue-400" /> }
      ] 
    } 
  },
  { 
    id: 'botiquin', title: '16. Botiquín', description: 'Material esencial.', icon: 'botiquin', type: 'module', 
    content: { 
      steps: [
        { title: 'Lo Básico', text: 'Un botiquín escolar o casero debe tener material de curas y protección.', icon: <BriefcaseMedical size={64} className="text-red-500" /> },
        { title: 'Protección', text: 'Guantes de un solo uso. Esencial para protegerte de infecciones al curar.', icon: <ShieldCheck size={64} className="text-blue-500" /> },
        { title: 'Curas', text: 'Suero fisiológico (limpiar), gasas estériles (cubrir/limpiar), antiséptico (clorhexidina), tiritas y esparadrapo.', icon: <Droplets size={64} className="text-cyan-500" /> },
        { title: 'Instrumental', text: 'Tijeras de punta redonda y pinzas.', icon: <ArchiveIcon size={64} className="text-gray-500" /> },
        { title: 'Desafío Botiquín', text: '¿Sabrías identificar qué sobra y qué falta? Demuéstralo.', icon: <CheckCircle2 size={64} className="text-green-600" />, interactiveComponent: 'BotiquinGame' }
      ] 
    } 
  },
  { 
    id: 'triaje', title: '17. Triaje Básico', description: 'Prioriza víctimas múltiples.', icon: 'triaje', type: 'module', 
    content: { 
      steps: [
        { title: '¿Qué es Triaje?', text: 'En accidentes con muchas víctimas, debemos atender primero a quien corre peligro de muerte inmediata pero salvable.', icon: <Siren size={64} className="text-rose-500" /> },
        { title: 'Prioridad 1 (Rojo)', text: 'Víctimas inconscientes, con problemas respiratorios o hemorragias graves. ¡Atiéndelos primero!', icon: <AlertTriangle size={64} className="text-red-600" /> },
        { title: 'El que grita está vivo', text: 'Alguien que grita mucho, aunque asuste, respira y tiene pulso. Puede esperar unos segundos mientras revisas a los silenciosos.', icon: <VolumeX size={64} className="text-orange-500" /> },
        { title: 'Simulación de Triaje', text: 'Tienes 3 víctimas. Selecciona en orden a quién atenderías primero.', icon: <Stethoscope size={64} className="text-blue-500" />, interactiveComponent: 'TriageGame' }
      ] 
    } 
  },
  { id: 'sim_patio', title: 'Caso 1: Patio', description: 'Simulación: Accidente en recreo.', icon: 'roleplay', type: 'roleplay' },
  { id: 'sim_comedor', title: 'Caso 2: Comedor', description: 'Simulación: Atragantamiento.', icon: 'roleplay', type: 'roleplay' },
  { id: 'pair_game', title: 'Modo Parejas', description: 'Simulación en vivo: Víctima vs Rescatador.', icon: 'pair_game', type: 'pair_game' },
  { id: 'flashcards', title: 'Flashcards', description: 'Repaso rápido de conceptos clave.', icon: 'flashcards', type: 'flashcards' },
  { id: 'examen', title: 'Examen Final', description: 'Evalúa tus conocimientos.', icon: 'examen', type: 'exam' },
  { id: 'desa', title: 'Simulador DESA', description: 'Práctica con desfibrilador.', icon: 'desa', type: 'desa' },
  { id: 'glosario', title: 'Glosario', description: 'Diccionario de términos.', icon: 'glosario', type: 'glossary' },
  { id: 'certificado', title: 'Certificado', description: 'Tu diploma simbólico.', icon: 'certificado', type: 'certificate' },
];

export const ROLEPLAY_SCENARIOS: Record<string, RoleplayScenario> = {
  sim_patio: {
    title: "Emergencia en el Patio",
    startNode: "inicio",
    nodes: {
      inicio: { text: "Estás en el recreo. Ves a un compañero golpearse la cabeza y quedar inmóvil.", options: [{ text: "Sacudirlo.", next: "error_sacudir" }, { text: "Aplicar PAS.", next: "pas_proteger" }] },
      error_sacudir: { text: "¡ERROR! Podrías agravar una lesión. Nunca muevas bruscamente.", isFailure: true },
      pas_proteger: { text: "Bien hecho. Aseguras la zona. No responde.", options: [{ text: "Gritar ayuda y Ver-Oír-Sentir.", next: "valoracion" }, { text: "Ir a por un profe.", next: "error_abandono" }] },
      error_abandono: { text: "No abandones a la víctima inconsciente si estás solo.", isFailure: true },
      valoracion: { text: "Respira pero está inconsciente.", options: [{ text: "RCP.", next: "error_rcp" }, { text: "Posición Lateral (PLS).", next: "exito_pls" }] },
      error_rcp: { text: "Si respira, no se hace RCP.", isFailure: true },
      exito_pls: { text: "¡Perfecto! PLS y 112.", isSuccess: true }
    }
  },
  sim_comedor: {
    title: "Susto en el Comedor",
    startNode: "inicio",
    nodes: {
      inicio: { text: "Alumno atragantado. Se lleva manos al cuello. No tose.", options: [{ text: "Dar agua.", next: "error_agua" }, { text: "Actuar (Obstrucción total).", next: "actuar" }] },
      error_agua: { text: "El agua puede empeorar la obstrucción.", isFailure: true },
      actuar: { text: "Te colocas detrás.", options: [{ text: "Heimlich directo.", next: "error_directo" }, { text: "5 golpes espalda.", next: "golpes" }] },
      error_directo: { text: "Primero 5 golpes interescapulares.", isFailure: true },
      golpes: { text: "No sale el objeto.", options: [{ text: "Compresiones Heimlich.", next: "exito_heimlich" }] },
      exito_heimlich: { text: "¡Objeto expulsado!", isSuccess: true }
    }
  }
};

export const PAIR_SCENARIOS: PairScenario[] = [
    {
        id: 'atragantamiento_pair',
        title: 'Atragantamiento',
        icon: <Wind size={32}/>,
        steps: [
            {
                phase: 1,
                victimInstruction: "ACTUACIÓN: Simula que comes algo. De repente, llévate las manos al cuello. Abre la boca como intentando respirar pero NO hagas ningún ruido. Pon cara de angustia.",
                rescuerQuestion: "Ves a tu compañero llevarse las manos al cuello. ¿Qué haces?",
                rescuerOptions: [
                    { text: "Darle agua inmediatamente", isCorrect: false, feedback: "¡No! El agua puede empeorar la obstrucción." },
                    { text: "Preguntar: ¿Te atragantas? y animar a toser", isCorrect: true, feedback: "Correcto. Si no tose, es obstrucción total." },
                    { text: "Darle golpes en la espalda ya", isCorrect: false, feedback: "Primero verifica si puede toser." }
                ]
            },
            {
                phase: 2,
                victimInstruction: "ACTUACIÓN: Niega con la cabeza. NO tosas. Empieza a ponerte 'azul'.",
                rescuerQuestion: "La víctima no tose y no puede hablar. ¿Siguiente paso?",
                rescuerOptions: [
                    { text: "5 Golpes interescapulares (espalda)", isCorrect: true, feedback: "¡Bien! Inclínalo y golpea fuerte entre omóplatos." },
                    { text: "Maniobra de Heimlich directa", isCorrect: false, feedback: "Empieza primero con los 5 golpes de espalda." }
                ]
            },
            {
                phase: 3,
                victimInstruction: "ACTUACIÓN: Sigue igual. Los golpes no han funcionado.",
                rescuerQuestion: "Los golpes no han funcionado. ¿Ahora qué?",
                rescuerOptions: [
                    { text: "Meter el dedo en la boca", isCorrect: false, feedback: "¡Peligro! Puedes introducir más el objeto." },
                    { text: "Compresiones Abdominales (Heimlich)", isCorrect: true, feedback: "¡Exacto! Puño en la boca del estómago, hacia dentro y arriba." }
                ]
            },
            {
                phase: 4,
                victimInstruction: "ACTUACIÓN: Expulsa el 'objeto' imaginario y respira fuerte.",
                rescuerQuestion: "¡El objeto ha salido!",
                rescuerOptions: [
                    { text: "Sentarlo y tranquilizarlo", isCorrect: true, feedback: "¡Misión Cumplida!" }
                ]
            }
        ]
    },
    {
        id: 'inconsciente_pair',
        title: 'Síncope (Desmayo)',
        icon: <UserCheck size={32}/>,
        steps: [
            {
                phase: 1,
                victimInstruction: "ACTUACIÓN: Di 'me siento mareado'. Tambaléate y cae al suelo suavemente. Cierra los ojos y quédate quieto.",
                rescuerQuestion: "Tu compañero se desploma. ¿Lo primero?",
                rescuerOptions: [
                    { text: "Echarle agua en la cara", isCorrect: false, feedback: "No es una película." },
                    { text: "Acercarse y estimular (Gritar y Sacudir)", isCorrect: true, feedback: "Bien. Comprueba consciencia." }
                ]
            },
            {
                phase: 2,
                victimInstruction: "ACTUACIÓN: No respondas. Pero respira normal (hincha el pecho visiblemente).",
                rescuerQuestion: "No responde, pero ves que el pecho se mueve.",
                rescuerOptions: [
                    { text: "Empezar RCP", isCorrect: false, feedback: "¡Alto! Si respira, el corazón late." },
                    { text: "Posición Lateral de Seguridad (PLS)", isCorrect: true, feedback: "Correcto. Evita que se trague la lengua." }
                ]
            },
            {
                phase: 3,
                victimInstruction: "ACTUACIÓN: Déjate colocar de lado. Sigue con ojos cerrados.",
                rescuerQuestion: "Ya está en PLS. ¿Ahora?",
                rescuerOptions: [
                    { text: "Irse a buscar ayuda", isCorrect: false, feedback: "No le dejes solo. Llama al 112 desde ahí." },
                    { text: "Llamar al 112 y vigilar respiración", isCorrect: true, feedback: "¡Excelente!" }
                ]
            }
        ]
    }
];

export const EXAM_QUESTIONS: ExamQuestion[] = [
  { q: '¿Primer paso del PAS?', opts: ['Avisar', 'Socorrer', 'Proteger'], a: 'Proteger', expl: 'Siempre debes PROTEGERTE a ti y a la víctima antes de hacer nada más.', isCritical: true },
  { q: 'Teléfono emergencias Europa', opts: ['911', '091', '112'], a: '112', expl: 'El 112 es el número único de emergencias en toda la UE.', isCritical: true },
  { q: 'Víctima inconsciente que respira. ¿Posición?', opts: ['Boca arriba', 'PLS', 'Sentado'], a: 'PLS', expl: 'La PLS evita que la lengua o el vómito obstruyan la vía aérea.', isCritical: true },
  { q: 'Ritmo RCP adultos', opts: ['60-80 cpm', '100-120 cpm', '140 cpm'], a: '100-120 cpm', expl: 'El ritmo óptimo es rápido, 100-120 compresiones por minuto.', isCritical: true },
  { q: 'Relación Compresión:Ventilación', opts: ['15:2', '30:2', '30:5'], a: '30:2', expl: '30 compresiones seguidas de 2 ventilaciones.' },
  { q: '¿Qué hacer ante hemorragia nasal?', opts: ['Cabeza atrás', 'Taponar con algodón', 'Cabeza adelante y presión'], a: 'Cabeza adelante y presión', expl: 'Inclinar hacia adelante evita tragar sangre.' },
  { q: 'Quemadura: ¿Qué aplicar primero?', opts: ['Pasta dientes', 'Hielo directo', 'Agua fría 15 min'], a: 'Agua fría 15 min', expl: 'Solo agua fría para enfriar la zona.' },
  { q: 'Maniobra para atragantamiento grave', opts: ['Heimlich', 'Rautek', 'Fowler'], a: 'Heimlich', expl: 'La maniobra de Heimlich desobstruye la vía aérea.', isCritical: true },
  { q: 'Síntoma de anafilaxia', opts: ['Dolor pierna', 'Hinchazón labios y pitos', 'Sed'], a: 'Hinchazón labios y pitos', expl: 'La anafilaxia es una reacción alérgica severa.' },
  { q: 'Ante convulsión, ¿meter algo en la boca?', opts: ['Sí, un pañuelo', 'Sí, una cuchara', 'NUNCA'], a: 'NUNCA', expl: 'Nunca introduzcas nada, podrías causar lesiones.', isCritical: true },
];

export const GLOSSARY = [
  { t: 'PAS', d: 'Proteger, Avisar, Socorrer.' },
  { t: 'PLS', d: 'Posición Lateral de Seguridad.' },
  { t: 'RCP', d: 'Reanimación Cardiopulmonar.' },
  { t: 'DESA', d: 'Desfibrilador Externo Semiautomático.' },
  { t: 'Heimlich', d: 'Compresiones abdominales para atragantamiento.' },
  { t: 'Anafilaxia', d: 'Reacción alérgica grave.' },
  { t: 'Hipoglucemia', d: 'Bajada de azúcar.' },
];

export const FLASHCARDS_DATA = [
  { q: "¿Ritmo de la RCP?", a: "100-120 compresiones por minuto." },
  { q: "¿Orden del PAS?", a: "1. Proteger\n2. Avisar\n3. Socorrer" },
  { q: "¿Teléfono de Emergencias?", a: "112 (Válido en toda la UE)." },
  { q: "¿Profundidad compresiones adulto?", a: "5-6 cm." },
  { q: "¿Víctima inconsciente que SÍ respira?", a: "Posición Lateral de Seguridad (PLS)." },
  { q: "¿Víctima inconsciente que NO respira?", a: "Iniciar RCP inmediatamente." },
  { q: "¿Qué hacer en sangrado nasal?", a: "Inclinar cabeza adelante y presionar aletas." },
  { q: "¿Qué NO poner en quemaduras?", a: "Pasta de dientes, aceite o hielo directo." },
  { q: "¿Obstrucción total vía aérea?", a: "Maniobra de Heimlich." },
  { q: "¿Convulsiones?", a: "Proteger cabeza, NO meter nada en boca." }
];

export const LEARNING_MODULE_IDS = MODULES.filter(m => m.type === 'module' || m.type === 'roleplay').map(m => m.id);
export const FULL_EXAM = EXAM_QUESTIONS;