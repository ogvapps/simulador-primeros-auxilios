
import React from 'react';
import {
    ShieldCheck, UserCheck, HeartPulse, Flame, Wind, Frown, HardHat, Smile, Brain, Syringe, AirVent,
    Activity, Gauge, Waves, BriefcaseMedical, GraduationCap, BookOpen, Award, Zap, MessageSquare, Siren,
    Droplets, ArrowLeft, ArrowRight, RotateCcw, AlertTriangle, CheckCircle2, XCircle, Users, Target, Search, FileSpreadsheet, ThermometerSnowflake, Candy, Volume2, VolumeX, Phone
} from 'lucide-react';

// --- ICONS ---
// Re-exporting icon components for usage in dynamic rendering if needed, 
// though typically we use the ICON_MAP in components. 
// We will define the ICON_MAP strings here and the actual render map in the components or here.
// To avoid JSX in pure JS files if possible, we can keep this file .jsx or .js with React import.
// Since we are using JSX for icons in the data, this file must be .jsx (or .js with React).

export const XP_REWARDS = {
    MODULE_COMPLETE: 50,
    GAME_WIN: 30,
    EXAM_PASS: 200,
    PERFECT_SCORE: 100,
    GUARDIA_SAVE: 20
};

export const LEVELS_ES = [
    { level: 1, name: "Novato", minXp: 0 },
    { level: 2, name: "Aprendiz", minXp: 150 },
    { level: 3, name: "Rescatador", minXp: 400 },
    { level: 4, name: "Experto", minXp: 800 },
    { level: 5, name: "Maestro", minXp: 1500 },
];

export const LEAGUES_ES = [
    { id: 'diamond', name: 'Diamante', minRank: 0, maxRank: 2, color: 'from-cyan-400 to-blue-500', icon: '💎' },
    { id: 'gold', name: 'Oro', minRank: 3, maxRank: 9, color: 'from-yellow-400 to-amber-500', icon: '🥇' },
    { id: 'silver', name: 'Plata', minRank: 10, maxRank: 24, color: 'from-slate-300 to-slate-400', icon: '🥈' },
    { id: 'bronze', name: 'Bronce', minRank: 25, maxRank: 9999, color: 'from-orange-700 to-orange-800', icon: '🥉' }
];

export const HIDDEN_BADGES_ES = [
    { id: 'streak_3', name: 'Encendido', desc: 'Racha de 3 días', icon: '🔥', secret: false },
    { id: 'streak_7', name: 'Imparable', desc: 'Racha de 7 días', icon: '🚀', secret: true },
    { id: 'night_owl', name: 'Búho Nocturno', desc: 'Estudia pasadas las 22:00', icon: '🦉', secret: true },
    { id: 'speedster', name: 'Velocista', desc: 'Completa un módulo en tiempo récord', icon: '⚡', secret: true }
];


export const ADMIN_PIN = '1120';
export const DESA_SIMULATOR_URL = 'https://ogvapps.github.io/desa/';

// Helper components for icons not in Lucide or needing custom styling
const HandIcon = ({ size, className }) => <div className={className} style={{ fontSize: size }}>✋</div>;

const ArchiveIcon = ({ size, className }) => <div className={className} style={{ fontSize: size }}>✂️</div>;
const Stethoscope = ({ size, className }) => <BriefcaseMedical size={size} className={className} />;

export const MODULES_ES = [
    {
        id: 'pas', title: '1. Método PAS', description: 'Aprende a Proteger, Avisar y Socorrer.', icon: 'pas', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=-OMdNPqwbso'],
            steps: [
                {
                    title: '¿Qué es PAS?',
                    text: 'Es la regla de oro en emergencias: PROTEGER, AVISAR y SOCORRER. Memorízala bien.',
                    icon: <ShieldCheck size={64} className="text-blue-500" />,
                    saberMas: 'El acrónimo PAS (Proteger, Avisar, Socorrer) se utiliza internacionalmente. Seguir este orden estricto es crucial porque muchas personas intentan Socorrer primero, poniendo en riesgo su propia vida (por ejemplo, electrocutándose o siendo atropelladas).'
                },
                {
                    title: '1. PROTEGER',
                    text: 'Antes de actuar, asegúrate de que TÚ no corres peligro. Aparta objetos, señaliza la zona y ponte chaleco si es tráfico.',
                    icon: <AlertTriangle size={64} className="text-orange-500" />,
                    why: 'Si tú te accidentas al intentar ayudar, te conviertes en una nueva víctima y duplicas el problema.',
                    warning: 'Evita la "visión de túnel": mirar solo a la víctima y no ver un coche que viene o un cable suelto.',
                    saberMas: 'En accidentes de tráfico, esto implica encender las luces de emergencia, ponerte el chaleco reflectante ANTES de salir del vehículo, y colocar los triángulos de preseñalización o baliza V16 a 50 metros. Si no es seguro, no te bajes.'
                },
                {
                    title: '2. AVISAR',
                    text: 'Llama al 112. Mantén la calma. Entrena tu llamada en el siguiente simulador.',
                    icon: <Volume2 size={64} className="text-blue-600" />,
                    interactiveComponent: 'Chat112Game',
                    saberMas: 'El 112 puede localizar tu llamada. Responde a las preguntas del operador con claridad: ¿Qué ha pasado? ¿Dónde? ¿Cuántas víctimas? ¿Estado de las víctimas? No cuelgues hasta que te lo indiquen.'
                },
                {
                    title: '3. SOCORRER',
                    text: 'Ayuda a la víctima dentro de tus conocimientos. No hagas más de lo que sabes.',
                    icon: <HeartPulse size={64} className="text-red-500" />,
                    saberMas: 'Socorrer incluye la evaluación inicial (consciencia y respiración) y medidas básicas como la Posición Lateral de Seguridad (PLS) o la RCP si fuera necesaria. Tu objetivo no es curar, sino mantener con vida a la víctima hasta que llegue la ayuda.'
                },
                {
                    title: '¡Ponlo en Práctica!',
                    text: 'Ordena la secuencia correctamente en este minijuego.',
                    icon: <Award size={64} className="text-yellow-500" />,
                    interactiveComponent: 'SequenceGame_PAS'
                }
            ]
        }
    },
    {
        id: 'pls', title: '2. Posición Lateral', description: 'Postura para inconscientes que respiran.', icon: 'pls', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=nUYWcEKeBZQ'],
            steps: [
                { title: '¿Cuándo usarla?', text: 'Si la persona está inconsciente (no responde) PERO SÍ respira con normalidad. Evita que se atragante con su lengua o vómito.', icon: <UserCheck size={64} className="text-green-500" />, why: 'Al perder la consciencia, la lengua se relaja y cae hacia atrás, bloqueando la garganta. De lado, la gravedad la mantiene despejada.' },
                { title: 'Paso 1: Brazo Cerca', text: 'Coloca el brazo más cercano a ti en ángulo recto (como saludando).', icon: <ArrowLeft size={64} className="text-gray-600" /> },
                { title: 'Paso 2: Brazo Lejos', text: 'Trae el brazo lejano sobre el pecho y pon el dorso de su mano contra su mejilla contraria.', icon: <ArrowRight size={64} className="text-gray-600" /> },
                { title: 'Paso 3: Pierna y Giro', text: 'Levanta la pierna lejana y tira de ella hacia ti para girar todo el cuerpo de lado.', icon: <RotateCcw size={64} className="text-green-600" /> },
                { title: 'Paso 4: Ajuste', text: 'Abre la boca de la víctima ligeramente para facilitar la respiración. Llama al 112.', icon: <CheckCircle2 size={64} className="text-blue-500" />, tip: 'Asegúrate de que su cabeza descanse sobre el dorso de su mano. Eso mantiene el cuello alineado y la vía aérea abierta.' },
            ]
        }
    },
    {
        id: 'rcp', title: '3. RCP Básica', description: 'Reanimación Cardiopulmonar.', icon: 'rcp', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=7SBBka5fwW8'],
            steps: [
                { title: '¿Cuándo hacer RCP?', text: 'Solo si la persona NO responde y NO respira. Llama al 112 inmediatamente o pide que traigan un DESA.', icon: <AlertTriangle size={64} className="text-red-600" /> },
                { title: 'Posición de manos', text: 'Talón de una mano en el centro del pecho (esternón). La otra mano encima entrelazando los dedos.', icon: <HeartPulse size={64} className="text-red-500" />, why: 'El esternón es un hueso fuerte que transmite la fuerza al corazón. Presionar costillas podría romperlas sin bombear sangre.', tip: 'Levanta los dedos para asegurar que solo el talón de la mano toca el pecho.' },
                { title: 'Compresiones', text: 'Brazos rectos. Deja caer tu peso. Comprime fuerte y rápido (5-6 cm de profundidad).', icon: <Activity size={64} className="text-orange-500" />, why: 'Al comprimir, mecánicamente bombeas sangre al cerebro. Al soltar, permites que el corazón se llene de nuevo.', warning: '¡NO dobles los codos! Si usas la fuerza de tus brazos te agotarás en segundos. Bloquea codos y usa tu peso corporal.' },
                { title: 'El Ritmo', text: 'Debes hacer 100-120 compresiones por minuto. Sigue el ritmo de "Macarena" o "Bob Esponja".', icon: <Zap size={64} className="text-yellow-500" />, tip: 'Si hay más gente, túrnate cada 2 minutos. La calidad de la RCP baja drásticamente por fatiga aunque no lo notes.' },
                { title: 'Entrenamiento Práctico', text: 'Demuestra que puedes mantener el ritmo correcto en este simulador.', icon: <Gauge size={64} className="text-red-600" />, interactiveComponent: 'CPRHero' }
            ]
        }
    },
    {
        id: 'hemorragia', title: '4. Hemorragias', description: 'Control de sangrados.', icon: 'hemorragia', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=cVWQm_CPG3o'],
            steps: [
                { title: 'Presión Directa', text: 'Es lo más importante. Presiona fuerte sobre la herida con gasas o un trapo limpio.', icon: <Droplets size={64} className="text-red-600" />, why: 'La presión mecánica cierra los vasos rotos contra el hueso o músculo, dando tiempo a que las plaquetas formen un tapón (coágulo).' },
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
                { title: 'Agua, agua y agua', text: 'Pon la zona quemada bajo agua fría (no helada) durante 15-20 minutos.', icon: <Droplets size={64} className="text-blue-400" />, why: 'Aunque quites el fuego, el calor residual sigue profundizando en la piel. El agua frena esa destrucción celular.', warning: 'NUNCA uses hielo directo. El frío extremo "quema" por congelación y daña más el tejido.' },
                { title: 'Lo que NO debes hacer', text: 'Nunca apliques pasta de dientes, aceite ni rompas las ampollas. Eso causa infección.', icon: <XCircle size={64} className="text-red-500" />, why: 'La pasta de dientes no es estéril, se seca formando una costra dura que duele mucho al retirar y favorece infecciones.' },
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
                { title: 'No respira / No tose', text: 'Si deja de toser y se lleva las manos al cuello: Inclínalo y da 5 golpes fuertes entre los omóplatos.', icon: <HandIcon size={64} className="text-orange-500" />, tip: 'Sujétale el pecho con una mano e inclínalo hacia delante. Así, si el objeto sale, caerá al suelo por gravedad y no volverá a entrar.' },
                { title: 'Maniobra de Heimlich', text: 'Si no expulsa el objeto: Abraza desde atrás, puño en la boca del estómago y presiona hacia dentro y arriba.', icon: <Users size={64} className="text-blue-600" />, why: 'Esta presión brusca eleva el diafragma, comprimiendo los pulmones como un fuelle. El aire residual sale a presión expulsando el objeto.', warning: 'Cuidado con las costillas flotantes. El puño va entre el ombligo y el esternón.' },
                { title: '¿Dónde presionar?', text: 'Aprende el punto exacto en este minijuego interactivo.', icon: <Target size={64} className="text-red-500" />, interactiveComponent: 'HeimlichGame' }
            ]
        }
    },
    {
        id: 'sincope', title: '7. Desmayos', description: 'Síncope y Lipotimia.', icon: 'sincope', type: 'module',
        content: {
            steps: [
                { title: 'Síntomas previos', text: 'Mareo, sudor frío, palidez, visión borrosa. Actúa rápido antes de que caiga.', icon: <Frown size={64} className="text-gray-400" /> },
                { title: 'Tumbar y Elevar', text: 'Tumba a la persona y levántale las piernas (posición antishock) para que la sangre vaya al cerebro.', icon: <ArrowRight size={64} className="text-blue-500 transform -rotate-45" />, why: 'Por gravedad, la sangre acumulada en las piernas retorna al corazón y este la bombea al cerebro, recuperando la consciencia.' },
                { title: 'Aire Fresco', text: 'Evita aglomeraciones alrededor. Afloja ropa apretada (cuello, cinturón).', icon: <Wind size={64} className="text-cyan-400" /> },
                { title: 'Recuperación', text: 'No dar comida ni bebida hasta que esté totalmente recuperado. Si no despierta, PLS y 112.', icon: <CheckCircle2 size={64} className="text-green-500" />, warning: '¡Peligro! Si le das agua estando mareado, puede atragantarse y el líquido ir a los pulmones (broncoaspiración).' },
            ]
        }
    },
    {
        id: 'golpes', title: '8. Traumatismos', description: 'Golpes y Fracturas.', icon: 'golpes', type: 'module',
        content: {
            steps: [
                { title: 'Frío Local', text: 'Aplica hielo (envuelto en paño) sobre el golpe para bajar la inflamación y el dolor.', icon: <ThermometerSnowflake size={64} className="text-blue-400" />, why: 'El frío contrae los vasos sanguíneos (vasoconstricción), reduciendo el sangrado interno (moratón) y la hinchazón.' },
                { title: 'Reposo', text: 'No muevas la zona afectada, especialmente si sospechas fractura (dolor intenso, deformidad).', icon: <AlertTriangle size={64} className="text-orange-500" /> },
                { title: 'Inmovilizar', text: 'Si hay fractura, no intentes colocar el hueso. Inmoviliza tal cual está y ve al hospital.', icon: <Activity size={64} className="text-red-500" />, warning: 'Si intentas enderezar un hueso roto, puedes rasgar nervios o arterias cercanas y causar un daño irreversible.' },
            ]
        }
    },
    {
        id: 'bucodental', title: '9. Dientes', description: 'Trauma dental.', icon: 'bucodental', type: 'module',
        content: {
            steps: [
                { title: 'Diente Roto', text: 'Si se rompe un trozo, intenta encontrarlo. Limpia suavemente con agua.', icon: <Search size={64} className="text-gray-500" /> },
                { title: 'Diente Arrancado', text: '¡El tiempo es oro! Coge el diente por la corona (la parte blanca), NUNCA por la raíz.', icon: <Smile size={64} className="text-gray-400" />, why: 'En la raíz hay fibras vivas (ligamento periodontal) necesarias para reimplantarlo con éxito. Si las tocas, mueren.' },
                { title: 'Transporte', text: 'Llévalo en un vaso con leche, suero o saliva del propio paciente. Ve al dentista urgentemente.', icon: <BriefcaseMedical size={64} className="text-blue-500" />, tip: 'La leche entera o la saliva mantienen el pH y nutrientes para que las células del diente sobrevivan 1 o 2 horas.' },
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
                { title: 'Autoinyector', text: 'Pregunta si lleva adrenalina (EpiPen). Si es así, ayúdale a usarla en el muslo.', icon: <Syringe size={64} className="text-orange-500" />, tip: 'El muslo (vasto lateral) tiene mucho músculo y riego sanguíneo, absorbiendo el medicamento rapidísimo.' },
                { title: 'Llama al 112', text: 'Es una emergencia vital. Llama siempre, aunque mejore tras la inyección.', icon: <Volume2 size={64} className="text-blue-600" /> }
            ]
        }
    },
    {
        id: 'asma', title: '12. Asma', description: 'Crisis respiratoria.', icon: 'asma', type: 'module',
        content: {
            steps: [
                { title: 'Calma', text: 'La ansiedad empeora la crisis. Tranquiliza a la persona y ayúdala a sentarse (mejor que tumbada).', icon: <Smile size={64} className="text-green-500" />, why: 'Sentado el diafragma baja y los pulmones se expanden mejor. Tumbado cuesta más respirar.' },
                { title: 'Inhalador', text: 'Usa su inhalador de rescate (ventolín). Normalmente 2 puffs.', icon: <AirVent size={64} className="text-blue-500" /> },
                { title: 'Si no mejora', text: 'Si tras unos minutos sigue con dificultad para respirar o labios azules, llama al 112.', icon: <Phone size={64} className="text-red-500" /> }
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
                { title: 'Boca Libre', text: 'NUNCA metas nada en su boca. No se tragará la lengua. Podrías hacerle daño o que te muerda.', icon: <XCircle size={64} className="text-orange-500" />, why: 'Es anatómicamente imposible tragarse la lengua, la sujeta el frenillo. Meter objetos solo rompe dientes o te amputa dedos.' },
                { title: 'Al terminar', text: 'Cuando pare la convulsión, ponlo en PLS y deja que descanse. Cronometra la duración.', icon: <UserCheck size={64} className="text-green-500" /> }
            ]
        }
    },
    {
        id: 'diabetes', title: '14. Diabetes', description: 'Hiperglucemia, Hipoglucemia y Glucagón.', icon: 'diabetes', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=ierjrLcyJLo', 'https://www.youtube.com/watch?v=uTWKxAovnuc&t=19s'],
            steps: [
                { title: 'Hipoglucemia (Bajada)', text: 'Es lo más urgente. Sudor frío, temblores, mareo, confusión o agresividad. Ocurre rápido.', icon: <ArrowRight size={64} className="text-red-500 transform rotate-90" /> },
                { title: 'Si está Consciente', text: 'Dar azúcar rápido inmediatamente: zumo, refresco (no light), sobres de azúcar o geles de glucosa.', icon: <Candy size={64} className="text-orange-500" />, why: 'El cerebro solo se alimenta de glucosa. Sin ella, empieza a "apagarse" (neuronas sufren) en minutos.' },
                { title: 'Glucagón (Inconsciente)', text: 'Si pierde la conciencia, NO dar nada por boca. Existe un kit naranja (Glucagón) inyectable. Se pincha en el muslo si sabes usarlo. Llama al 112.', icon: <Syringe size={64} className="text-red-600" /> },
                { title: 'Hiperglucemia (Subida)', text: 'Azúcar muy alto. Síntomas: Mucha sed, ganas constantes de orinar, piel seca, aliento con olor a fruta. Requiere insulina o atención médica.', icon: <Activity size={64} className="text-blue-500" /> },
                { title: 'Protocolo General', text: 'Ante la duda o inconsciencia: NUNCA dar comida/bebida. Colocar en PLS (de lado) y llamar al 112.', icon: <Phone size={64} className="text-green-500" /> }
            ]
        }
    },
    {
        id: 'ansiedad', title: '15. Ansiedad', description: 'Crisis de pánico.', icon: 'ansiedad', type: 'module',
        content: {
            steps: [
                { title: 'Hiperventilación', text: 'Respiran muy rápido y sienten hormigueo en manos y boca. Creen que se ahogan.', icon: <Wind size={64} className="text-gray-400" /> },
                { title: 'Acompañar', text: 'Habla con tono calmado y firme. "Estoy aquí contigo, vas a estar bien".', icon: <Users size={64} className="text-green-500" /> },
                { title: 'Respiración', text: 'Guíale para respirar lento. Inspira por nariz 3 seg, aguanta 3 seg, expulsa 3 seg.', icon: <Activity size={64} className="text-blue-400" />, why: 'La respiración lenta y abdominal activa el sistema parasimpático ("freno" del cuerpo), reduciendo la adrenalina.' }
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
                { title: 'Prioridad 1 (Rojo)', text: 'Víctimas inconscientes, con problemas respiratorios o hemorragias graves. ¡Atiéndelos primero!', icon: <AlertTriangle size={64} className="text-red-600" />, why: 'Tienen minutos de vida. Si no actúas ya, mueren. Los demás pueden esperar un poco más.' },
                { title: 'El que grita está vivo', text: 'Alguien que grita mucho, aunque asuste, respira y tiene pulso. Puede esperar unos segundos mientras revisas a los silenciosos.', icon: <VolumeX size={64} className="text-orange-500" /> },
                { title: 'Simulación de Triaje', text: 'Tienes 3 víctimas. Selecciona en orden a quién atenderías primero.', icon: <Stethoscope size={64} className="text-blue-500" />, interactiveComponent: 'TriageGame' }
            ]
        }
    },
    { id: 'sim_patio', title: 'Caso 1: Patio', description: 'Simulación: Accidente en recreo.', icon: 'roleplay', type: 'roleplay' },
    { id: 'sim_comedor', title: 'Caso 2: Comedor', description: 'Simulación: Atragantamiento.', icon: 'roleplay', type: 'roleplay' },
    { id: 'timeTrial', title: 'Contrarreloj', description: 'Entrena velocidad y precisión.', icon: 'zap', type: 'timeTrial' },
    { id: 'examen', title: 'Examen Final', description: 'Evalúa tus conocimientos.', icon: 'examen', type: 'exam' },
    { id: 'desa', title: 'Simulador DESA', description: 'Práctica con desfibrilador.', icon: 'desa', type: 'desa' },
    { id: 'glosario', title: 'Glosario', description: 'Diccionario de términos.', icon: 'glosario', type: 'glossary' },
    { id: 'certificado', title: 'Certificado', description: 'Tu diploma simbólico.', icon: 'certificado', type: 'certificate' },
];

// Daily Challenge Scenarios
export const DAILY_SCENARIOS_ES = [
    {
        id: 1,
        q: "Vas paseando y ves a un ciclista caerse. Se golpea la cabeza y no se mueve. ¿Qué haces PRIMERO?",
        options: ["Corro a quitarle el casco para que respire mejor.", "Llamo al 112 inmediatamente.", "Me acerco con cuidado asegurando la zona (Conducta PAS).", "Le doy agua para que se recupere."],
        correct: 2,
        explanation: "¡Orden PAS! 1º Proteger (asegurar zona), 2º Avisar, 3º Socorrer. Quitar el casco puede agravar una lesión cervical."
    },
    {
        id: 2,
        q: "En una comida familiar, tu primo se lleva las manos al cuello y no puede toser ni respirar. ¿Qué maniobra aplicas?",
        options: ["Maniobra de Heimlich.", "Relleno Capilar.", "RCP (30 compresiones / 2 ventilaciones).", "Le doy golpes en la nuca."],
        correct: 0,
        explanation: "Es una obstrucción completa. Heimlich es la técnica indicada. Los golpes en la espalda (nuca no) son previos, pero si no tose, Heimlich es vital."
    },
    {
        id: 3,
        q: "Encuentras a una persona inconsciente que SÍ respira. ¿En qué posición la colocas?",
        options: ["Boca arriba (Decúbito Supino).", "Posición Lateral de Seguridad (PLS).", "Sentado para que no se maree.", "Boca abajo."],
        correct: 1,
        explanation: "La PLS evita que la lengua obstruya la vía aérea y que se ahogue si vomita."
    },
    {
        id: 4,
        q: "Te quemas la mano con aceite hirviendo. ¿Qué es lo primero que aplicas?",
        options: ["Hielo directo.", "Pasta de dientes.", "Agua fría del grifo durante 15-20 min.", "Mantequilla o aceite."],
        correct: 2,
        explanation: "El agua fría detiene la destrucción de tejidos por calor. El hielo quema por frío y las pastas/aceites infectan."
    },
    {
        id: 5,
        q: "Presencias una convulsión epiléptica. ¿Qué NO debes hacer?",
        options: ["Meterle algo en la boca para que no se muerda la lengua.", "Protegerle la cabeza con algo blando.", "Cronometrar la duración.", "Aflojar la ropa apretada."],
        correct: 0,
        explanation: "NUNCA introduzcas nada en la boca. Podrías romperle los dientes o sufrir tú una mordedura grave. No se tragará la lengua."
    }
];

export const ROLEPLAY_SCENARIOS_ES = {
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

// Update Pass Score for 40 questions (80% = 32)
export const MIN_PASS_SCORE = 20;

export const EXAM_QUESTIONS_ES = [
    // Original 10
    { q: '¿Primer paso del PAS?', opts: ['Avisar', 'Socorrer', 'Proteger'], a: 'Proteger', expl: 'Siempre debes PROTEGERTE a ti y a la víctima antes de hacer nada más.' },
    { q: 'Teléfono emergencias Europa', opts: ['911', '091', '112'], a: '112', expl: 'El 112 es el número único de emergencias en toda la UE.' },
    { q: 'Víctima inconsciente que respira. ¿Posición?', opts: ['Boca arriba', 'PLS', 'Sentado'], a: 'PLS', expl: 'La PLS evita que la lengua o el vómito obstruyan la vía aérea.' },
    { q: 'Ritmo RCP adultos', opts: ['60-80 cpm', '100-120 cpm', '140 cpm'], a: '100-120 cpm', expl: 'El ritmo óptimo es rápido, 100-120 compresiones por minuto.' },
    { q: 'Relación Compresión:Ventilación', opts: ['15:2', '30:2', '30:5'], a: '30:2', expl: '30 compresiones seguidas de 2 ventilaciones.' },
    { q: '¿Qué hacer ante hemorragia nasal?', opts: ['Cabeza atrás', 'Taponar con algodón', 'Cabeza adelante y presión'], a: 'Cabeza adelante y presión', expl: 'Inclinar hacia adelante evita tragar sangre.' },
    { q: 'Quemadura: ¿Qué aplicar primero?', opts: ['Pasta dientes', 'Hielo directo', 'Agua fría 15 min'], a: 'Agua fría 15 min', expl: 'Solo agua fría para enfriar la zona.' },
    { q: 'Maniobra para atragantamiento grave', opts: ['Heimlich', 'Rautek', 'Fowler'], a: 'Heimlich', expl: 'La maniobra de Heimlich desobstruye la vía aérea.' },
    { q: 'Síntoma de anafilaxia', opts: ['Dolor pierna', 'Hinchazón labios y pitos', 'Sed'], a: 'Hinchazón labios y pitos', expl: 'La anafilaxia es una reacción alérgica severa.' },
    { q: 'Ante convulsión, ¿meter algo en la boca?', opts: ['Sí, un pañuelo', 'Sí, una cuchara', 'NUNCA'], a: 'NUNCA', expl: 'Nunca introduzcas nada, podrías causar lesiones.' },

    // New 30 Questions
    { q: '¿Cuánto profundizar en compresiones torácicas (adulto)?', opts: ['2-3 cm', '5-6 cm', '8-10 cm'], a: '5-6 cm', expl: 'Se necesita comprimir fuerte (5-6 cm) para bombear sangre.' },
    { q: 'Si la víctima vomita durante la RCP...', opts: ['Parar y esperar', 'Poner de lado y limpiar boca', 'Seguir comprimiendo'], a: 'Poner de lado y limpiar boca', expl: 'Gírala de lado para limpiar el vómito y luego continúa RCP.' },
    { q: 'El DEA/DESA sirve para...', opts: ['Desatragantar', 'Parar hemoragias', 'Revertir paradas cardiacas'], a: 'Revertir paradas cardiacas', expl: 'El desfibrilador administra una descarga para reiniciar el ritmo cardiaco.' },
    { q: 'Si estás solo con un niño inconsciente que NO respira...', opts: ['Llamar antes de tocar', '1 min de RCP y luego llamar', 'Esperar a ver si respira'], a: '1 min de RCP y luego llamar', expl: 'En niños, la causa suele ser respiratoria. Haz RCP un minuto antes de alejarte a llamar.' },
    { q: '¿Cómo comprobar la consciencia?', opts: ['Pellizcar fuerte', 'Hablar alto y sacudir hombros', 'Echar agua'], a: 'Hablar alto y sacudir hombros', expl: 'Estimula verbal y físicamente (hombros) sin ser agresivo.' },
    { q: '¿Qué NO hacer en una quemadura grave?', opts: ['Romper ampollas', 'Enfriar con agua', 'Cubrir con paño limpio'], a: 'Romper ampollas', expl: 'Las ampollas protegen de infecciones. Nunca las rompas.' },
    { q: 'Objeto clavado en el cuerpo...', opts: ['Sacarlo rápido', 'Moverlo para ver profundidad', 'No tocar y fijar'], a: 'No tocar y fijar', expl: 'Si lo sacas, puede aumentar la hemorragia. Inmovilízalo protegiendo alrededor.' },
    { q: 'Torniquete: ¿Cuándo se usa?', opts: ['Siempre que sangra', 'Hemorragias exanguinantes incontrolables', 'Picaduras'], a: 'Hemorragias exanguinantes incontrolables', expl: 'Último recurso en extremidades cuando la presión directa no funciona y hay riesgo vital.' },
    { q: 'Signo de fractura ósea', opts: ['Deformidad y dolor intenso', 'Picor', 'Piel seca'], a: 'Deformidad y dolor intenso', expl: 'La deformidad, hinchazón y dolor al mover son típicos de fractura.' },
    { q: 'Esguince: Tratamiento inmediato', opts: ['Calor intenso', 'Caminar para calentar', 'Frío, Reposo y Elevación'], a: 'Frío, Reposo y Elevación', expl: 'Recuerda RICE (Reposo, Hielo, Compresión, Elevación).' },
    { q: 'Diente definitivo arrancado (avulsión)', opts: ['Tirarlo', 'Lavarlo con jabón', 'Guardar en leche/saliva'], a: 'Guardar en leche/saliva', expl: 'Consérvalo en medio líquido fisiológico y ve urgente al dentista.' },
    { q: 'Lipotimia: ¿Qué hacer?', opts: ['Dar agua rápido', 'Elevar piernas (Trendelenburg)', 'Sentarlo'], a: 'Elevar piernas (Trendelenburg)', expl: 'Elevar las piernas ayuda al retorno venoso al cerebro.' },
    { q: 'Golpe de calor: Primeros auxilios', opts: ['Manta térmica', 'Enfriar cuerpo gradualmente', 'Baño helado brusco'], a: 'Enfriar cuerpo gradualmente', expl: 'Llevar a un lugar fresco y aplicar paños húmedos.' },
    { q: 'Ictus: Escala CINCINNATI', opts: ['Cara, Brazos, Habla', 'Dolor pecho', 'Fiebre alta'], a: 'Cara, Brazos, Habla', expl: 'Pide sonreír (Cara), levantar brazos y hablar para detectar Ictus.' },
    { q: 'Infarto: Síntoma común', opts: ['Dolor opresivo en pecho e irradiado', 'Picor nariz', 'Hambre'], a: 'Dolor opresivo en pecho e irradiado', expl: 'El dolor suele ir al brazo izquierdo, cuello o mandíbula.' },
    { q: 'Triaje: ¿Quién tiene prioridad?', opts: ['El que más grita', 'Inconsciente que respira mal', 'Muerto'], a: 'Inconsciente que respira mal', expl: 'Prioridad Roja: Vida en peligro inmediato pero salvable.' },
    { q: '¿Qué contiene un botiquín básico?', opts: ['Antibióticos', 'Bisturí', 'Gasas, guantes, antiséptico'], a: 'Gasas, guantes, antiséptico', expl: 'Material de cura y autoprotección es lo esencial, no medicación.' },
    { q: 'Atragantamiento parcial (tose)', opts: ['Golpear espalda', 'Animar a toser', 'Heimlich'], a: 'Animar a toser', expl: 'Si tose, pasa aire. Deja que el mecanismo natural actúe.' },
    { q: 'Crisis asmática: Posición', opts: ['Tumbado boca abajo', 'Sentado o semisentado', 'De pie'], a: 'Sentado o semisentado', expl: 'Sentado facilita la respiración. Usa su broncodilatador.' },
    { q: 'Hipoglucemia consciente', opts: ['Insulina', 'Azúcar/Bebida dulce', 'Nada por boca'], a: 'Azúcar/Bebida dulce', expl: 'Necesita azúcar rápido para subir la glucemia.' },
    { q: 'Si sospechas lesión medular (columna)', opts: ['Mover al hospital', 'NO mover salvo peligro vital', 'Sentar cómodo'], a: 'NO mover salvo peligro vital', expl: 'Moverlo podría causar parálisis permanente.' },
    { q: 'Herida en tórax "soplante"', opts: ['Dejar abierta', 'Tapar 3 lados (parche valve)', 'Taponar todo'], a: 'Tapar 3 lados (parche valve)', expl: 'Permite salir aire pero no entrar para evitar neumotórax a tensión.' },
    { q: 'Amputación: ¿Qué hacer con el miembro?', opts: ['Agua caliente', 'Hielo directo', 'Bolsa estanca y luego hielo'], a: 'Bolsa estanca y luego hielo', expl: 'No pongas el tejido directo en hielo. Protégelo en bolsa primero.' },
    { q: 'Picadura de avispa (sin alergia)', opts: ['Barro', 'Amoniaco', 'Frío local y retirar aguijón'], a: 'Frío local y retirar aguijón', expl: 'Retira el aguijón rascando (no pinzas) y aplica frío.' },
    { q: 'Mordedura de animal', opts: ['Chupar veneno', 'Lavar con agua y jabón abundante', 'Torniquete'], a: 'Lavar con agua y jabón abundante', expl: 'La infección es el mayor riesgo. Lava a fondo.' },
    { q: 'Intoxicación por humo', opts: ['Leche', 'Salir al aire fresco', 'Vomitar'], a: 'Salir al aire fresco', expl: 'La prioridad es oxigenar. Aléjate de la fuente tóxica.' },
    { q: 'Electrocución', opts: ['Tocar para ver si tiene pulso', 'Cortar corriente primero', 'Echar agua'], a: 'Cortar corriente primero', expl: 'Asegura la escena desconectando la luz antes de tocar a la víctima.' },
    { q: 'Cuerpo extraño en ojo', opts: ['Frotar fuerte', 'Lavar con suero/agua abundante', 'Sacar con pinzas'], a: 'Lavar con suero/agua abundante', expl: 'El lavado por arrastre es lo más seguro. No frotes.' },
    { q: 'Crisis de ansiedad', opts: ['Respirar en bolsa', 'Respiración lenta acompañando', 'Gritarle'], a: 'Respiración lenta acompañando', expl: 'Guía su respiración: "Inspira... Aguanta... Expulsa".' },
    { q: '¿Cuándo dejar de hacer RCP?', opts: ['A los 5 min', 'Cuando llegue ayuda experta o canse', 'Si rompes costilla'], a: 'Cuando llegue ayuda experta o canse', expl: 'Continúa hasta que te releven, llegue el 112 o la víctima despierte.' },
];

export const GLOSSARY_ES = [
    // A
    { t: 'ABCDE', d: 'Protocolo de valoración: Vía Aérea, Respiración, Circulación, Discapacidad y Exposición.' },
    { t: 'Abrasión', d: 'Rasguño o roce superficial en la piel.' },
    { t: 'Adrenalina', d: 'Hormona y medicamento usado en reacciones alérgicas graves (anafilaxia).' },
    { t: 'Agónico (Respiración)', d: 'Respiración ineficaz, boqueos aislados. Se considera paro cardíaco.' },
    { t: 'Anafilaxia', d: 'Reacción alérgica severa y rápida que puede cerrar la garganta.' },
    { t: 'Angina de Pecho', d: 'Dolor torácico porque al corazón le falta oxígeno momentáneamente.' },
    { t: 'Apósito', d: 'Material (gasa, vendaje) que se coloca sobre una herida para cubrirla.' },
    { t: 'Arteria', d: 'Vaso sanguíneo que lleva sangre oxigenada del corazón al cuerpo. Sangrado rojo brillante y a borbotones.' },
    { t: 'Asfixia', d: 'Falta de oxígeno por obstrucción o dificultad respiratoria.' },
    { t: 'Avulsión', d: 'Arrancamiento de una parte del cuerpo (ej: un diente o una uña).' },

    // B
    { t: 'Boca a Boca', d: 'Técnica de ventilación artificial insuflando aire a los pulmones.' },
    { t: 'Botiquín', d: 'Caja o maleta con material médico para primeros auxilios.' },
    { t: 'Bradicardia', d: 'Ritmo cardíaco muy lento (menos de 60 latidos/min).' },
    { t: 'Broncoaspiración', d: 'Paso de comida, vómito o líquidos a los pulmones (vía respiratoria).' },

    // C
    { t: 'Capilares', d: 'Vasos sanguíneos diminutos. Su sangrado es leve y en sábana.' },
    { t: 'Cianosis', d: 'Coloración azulada de piel y labios por falta de oxígeno.' },
    { t: 'Coágulo', d: 'Tapón de sangre sólida que detiene la hemorragia.' },
    { t: 'Compresiones', d: 'Presiones rítmicas en el pecho para bombear sangre artificialmente.' },
    { t: 'Conmoción', d: 'Pérdida momentánea de funciones cerebrales tras un golpe.' },
    { t: 'Contusión', d: 'Golpe que no rompe la piel pero causa dolor y moratón.' },
    { t: 'Convulsión', d: 'Movimientos musculares involuntarios y violentos (ej: epilepsia).' },

    // D
    { t: 'Decúbito Supino', d: 'Tumbado boca arriba.' },
    { t: 'DESA', d: 'Desfibrilador Externo Semiautomático. Aparato que da descargas al corazón.' },
    { t: 'Deshidratación', d: 'Pérdida excesiva de agua corporal.' },
    { t: 'Disnea', d: 'Sensación de falta de aire o dificultad para respirar.' },

    // E
    { t: 'Edema', d: 'Hinchazón por acumulación de líquido.' },
    { t: 'Electrocución', d: 'Lesión causada por el paso de corriente eléctrica por el cuerpo.' },
    { t: 'Epistaxis', d: 'Sangrado por la nariz.' },
    { t: 'Equimosis', d: 'Nombre médico para un "moratón" o cardenal.' },
    { t: 'Eritema', d: 'Enrojecimiento de la piel (ej: quemadura solar).' },
    { t: 'Esguince', d: 'Estiramiento o rasgadura de ligamentos (torcedura).' },
    { t: 'Esternón', d: 'Hueso plano en el centro del pecho donde se hace la RCP.' },

    // F
    { t: 'Férula', d: 'Objeto rígido usado para inmovilizar una fractura.' },
    { t: 'Fibrilación', d: 'Ritmo cardíaco caótico que impide el bombeo de sangre (Parada).' },
    { t: 'Fractura', d: 'Rotura de un hueso. Puede ser abierta (sale el hueso) o cerrada.' },

    // G
    { t: 'Gasping', d: 'Boqueo. Respiración agónica ineficaz típica del paro cardíaco.' },
    { t: 'Glucagón', d: 'Hormona inyectable para subir el azúcar urgentemente.' },
    { t: 'Golpe de Calor', d: 'Subida peligrosa de temperatura corporal por sol/calor extremo.' },

    // H
    { t: 'Heimlich', d: 'Maniobra de compresiones abdominales para desatragantar.' },
    { t: 'Hematoma', d: 'Acumulación de sangre bajo la piel (chichón/moratón grave).' },
    { t: 'Hemorragia', d: 'Salida de sangre de los vasos sanguíneos.' },
    { t: 'Hiperventilación', d: 'Respiración muy rápida, común en ansiedad.' },
    { t: 'Hipoglucemia', d: 'Bajada excesiva de azúcar en sangre.' },
    { t: 'Hipotermia', d: 'Bajada peligrosa de la temperatura corporal.' },
    { t: 'Hipoxia', d: 'Falta de oxígeno en los tejidos.' },

    // I
    { t: 'Ictus', d: 'Infarto cerebral o derrame. Pérdida de función de una parte del cerebro.' },
    { t: 'Infarto', d: 'Muerte de tejido (normalmente corazón) por falta de riego sanguíneo.' },
    { t: 'Inmovilización', d: 'Técnica para impedir que una lesión se mueva y empeore.' },
    { t: 'Insolación', d: 'Trastorno por exposición excesiva al sol.' },

    // L
    { t: 'Lipotimia', d: 'Desmayo breve y común, generalmente por calor, hambre o estrés.' },
    { t: 'Luxación', d: 'Salida de un hueso de su articulación ("se ha salido el hombro").' },

    // M
    { t: 'Manta Térmica', d: 'Lámina dorada/plateada para mantener temperatura corporal.' },
    { t: 'Medula Espinal', d: 'Cable nervioso dentro de la columna. Si se rompe causa parálisis.' },

    // N
    { t: 'Necrosis', d: 'Muerte de tejido (se pone negro).' },
    { t: 'Neumotórax', d: 'Entrada de aire en el torax que colapsa el pulmón.' },

    // O
    { t: 'Obstrucción Vía Aérea', d: 'Bloqueo que impide respirar (atragantamiento).' },
    { t: 'OVACE', d: 'Obstrucción de Vía Aérea por Cuerpo Extraño.' },

    // P
    { t: 'Parada Cardíaca (PCR)', d: 'El corazón deja de latir. Muerte clínica reversible con RCP.' },
    { t: 'PAS', d: 'Proteger, Avisar, Socorrer. Protocolo básico.' },
    { t: 'PLS', d: 'Posición Lateral de Seguridad. De lado para inconscientes.' },
    { t: 'Politraumatismo', d: 'Múltiples lesiones graves simultáneas.' },
    { t: 'Pulso', d: 'Latido percibile en arterias (cuello, muñeca).' },

    // Q
    { t: 'Quemadura', d: 'Lesión por calor, químicos o fricción. Grados 1º, 2º y 3º.' },

    // R
    { t: 'RCP', d: 'Reanimación Cardiopulmonar. Compresiones + Ventilaciones.' },
    { t: 'Reflejo Pupilar', d: 'Contracción de la pupila ante la luz.' },

    // S
    { t: 'Shock', d: 'Estado grave donde no llega suficiente sangre a los órganos vitales.' },
    { t: 'Síncope', d: 'Pérdida de conciencia repentina (desmayo).' },
    { t: 'Soporte Vital Básico', d: 'Medidas iniciales para mantener la vida (RCP, DESA).' },
    { t: 'Suero Fisiológico', d: 'Agua con sal al 0.9% similar a fluidos corporales. Ideal para lavar.' },

    // T
    { t: 'Taquicardia', d: 'Ritmo cardíaco muy rápido (más de 100 lpm).' },
    { t: 'TCE', d: 'Traumatismo Craneoencefálico (golpe en la cabeza).' },
    { t: 'Tétanos', d: 'Enfermedad grave por heridas sucias. Requiere vacuna.' },
    { t: 'Torniquete', d: 'Banda apretada para cortar totalmente hemorragias masivas.' },
    { t: 'Triaje', d: 'Clasificación de víctimas por gravedad en catástrofes.' },
    { t: 'Trombosis', d: 'Formación de un coágulo dentro de un vaso.' },

    // U
    { t: 'Urgencia', d: 'Situación que requiere atención pero no riesgo vital inmediato.' },
    { t: 'Urticaria', d: 'Ronchas rojas en la piel con picor (alergia).' },

    // V
    { t: 'Vena', d: 'Vaso que devuelve sangre al corazón. Sangrado oscuro y continuo.' },
    { t: 'Vía Aérea', d: 'Camino del aire (boca, garganta, tráquea, pulmones).' },

    // Z
    { t: 'Zona Segura', d: 'Lugar sin peligros donde se debe trasladar a la víctima.' }
];

export const AVATARS_ES = [
    { id: 'default', name: 'Novato', cost: 0, color: 'bg-slate-200 text-slate-600', icon: 'User' },
    { id: 'medic', name: 'Médico', cost: 500, color: 'bg-blue-100 text-blue-600', icon: 'Stethoscope' },
    { id: 'firefighter', name: 'Bombero', cost: 800, color: 'bg-orange-100 text-orange-600', icon: 'Flame' },
    { id: 'paramedic', name: 'Paramédico', cost: 1200, color: 'bg-green-100 text-green-600', icon: 'Siren' },
    { id: 'hero', name: 'Héroe', cost: 2000, color: 'bg-yellow-100 text-yellow-600', icon: 'Award' },
    { id: 'legend', name: 'Leyenda', cost: 5000, color: 'bg-purple-100 text-purple-600', icon: 'Crown' }
];

export const LEVELS_EN = [
    { level: 1, name: "Rookie", minXp: 0 },
    { level: 2, name: "Apprentice", minXp: 150 },
    { level: 3, name: "Rescuer", minXp: 400 },
    { level: 4, name: "Expert", minXp: 800 },
    { level: 5, name: "Master", minXp: 1500 },
];

export const LEAGUES_EN = [
    { id: 'diamond', name: 'Diamond', minRank: 0, maxRank: 2, color: 'from-cyan-400 to-blue-500', icon: '💎' },
    { id: 'gold', name: 'Gold', minRank: 3, maxRank: 9, color: 'from-yellow-400 to-amber-500', icon: '🥇' },
    { id: 'silver', name: 'Silver', minRank: 10, maxRank: 24, color: 'from-slate-300 to-slate-400', icon: '🥈' },
    { id: 'bronze', name: 'Bronze', minRank: 25, maxRank: 9999, color: 'from-orange-700 to-orange-800', icon: '🥉' }
];

export const HIDDEN_BADGES_EN = [
    { id: 'streak_3', name: 'Ignited', desc: '3-day streak', icon: '🔥', secret: false },
    { id: 'streak_7', name: 'Unstoppable', desc: '7-day streak', icon: '🚀', secret: true },
    { id: 'night_owl', name: 'Night Owl', desc: 'Study after 10 PM', icon: '🦉', secret: true },
    { id: 'speedster', name: 'Speedster', desc: 'Complete a module in record time', icon: '⚡', secret: true }
];

export const AVATARS_EN = [
    { id: 'default', name: 'Rookie', cost: 0, color: 'bg-slate-200 text-slate-600', icon: 'User' },
    { id: 'medic', name: 'Medic', cost: 500, color: 'bg-blue-100 text-blue-600', icon: 'Stethoscope' },
    { id: 'firefighter', name: 'Firefighter', cost: 800, color: 'bg-orange-100 text-orange-600', icon: 'Flame' },
    { id: 'paramedic', name: 'Paramedic', cost: 1200, color: 'bg-green-100 text-green-600', icon: 'Siren' },
    { id: 'hero', name: 'Hero', cost: 2000, color: 'bg-yellow-100 text-yellow-600', icon: 'Award' },
    { id: 'legend', name: 'Legend', cost: 5000, color: 'bg-purple-100 text-purple-600', icon: 'Crown' }
];

export const MODULES_EN = [
    {
        id: 'pas', title: '1. PAS Method', description: 'Learn to Protect, Alert, and Support.', icon: 'pas', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=-OMdNPqwbso'],
            steps: [
                {
                    title: 'What is PAS?',
                    text: 'It is the golden rule in emergencies: PROTECT, ALERT, and SUPPORT. Memorize it well.',
                    icon: <ShieldCheck size={64} className="text-blue-500" />,
                    saberMas: 'The PAS acronym (Protect, Alert, Support) is used internationally. Following this strict order is crucial because many people try to Support first, putting their own lives at risk (e.g., getting electrocuted or run over).'
                },
                {
                    title: '1. PROTECT',
                    text: 'Before acting, ensure YOU are not in danger. Remove objects, signal the area, and wear a vest if in traffic.',
                    icon: <AlertTriangle size={64} className="text-orange-500" />,
                    why: 'If you get injured while trying to help, you become a new victim and double the problem.',
                    warning: 'Avoid "tunnel vision": looking only at the victim and not seeing an oncoming car or a loose cable.',
                    saberMas: 'In traffic accidents, this implies turning on hazard lights, putting on the reflective vest BEFORE exiting the vehicle, and placing warning triangles or V16 beacon at 50 meters. If it is not safe, do not get out.'
                },
                {
                    title: '2. ALERT',
                    text: 'Call 112/911. Stay calm. Train your call in the following simulator.',
                    icon: <Volume2 size={64} className="text-blue-600" />,
                    interactiveComponent: 'Chat112Game',
                    saberMas: 'Emergency services can locate your call. Answer the operator\'s questions clearly: What happened? Where? How many victims? Status of victims? Do not hang up until told to do so.'
                },
                {
                    title: '3. SUPPORT',
                    text: 'Help the victim within your knowledge. Do not do more than you know.',
                    icon: <HeartPulse size={64} className="text-red-500" />,
                    saberMas: 'Supporting includes initial assessment (consciousness and breathing) and basic measures like the Recovery Position (PLS) or CPR if necessary. Your goal is not to cure, but to keep the victim alive until help arrives.'
                },
                {
                    title: 'Put it into Practice!',
                    text: 'Order the sequence correctly in this mini-game.',
                    icon: <Award size={64} className="text-yellow-500" />,
                    interactiveComponent: 'SequenceGame_PAS'
                }
            ]
        }
    },
    {
        id: 'pls', title: '2. Recovery Position', description: 'Posture for unconscious breathing victims.', icon: 'pls', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=nUYWcEKeBZQ'],
            steps: [
                { title: 'When to use it?', text: 'If the person is unconscious (does not respond) BUT DOES breathe normally. Prevents choking on tongue or vomit.', icon: <UserCheck size={64} className="text-green-500" />, why: 'When losing consciousness, the tongue relaxes and falls back, blocking the throat. Lying on the side, gravity keeps it clear.' },
                { title: 'Step 1: Near Arm', text: 'Place the arm closest to you at a right angle (like waving).', icon: <ArrowLeft size={64} className="text-gray-600" /> },
                { title: 'Step 2: Far Arm', text: 'Bring the far arm across the chest and place the back of their hand against their opposite cheek.', icon: <ArrowRight size={64} className="text-gray-600" /> },
                { title: 'Step 3: Leg and Turn', text: 'Lift the far leg and pull it towards you to turn the whole body on its side.', icon: <RotateCcw size={64} className="text-green-600" /> },
                { title: 'Step 4: Adjust', text: 'Open the victim\'s mouth slightly to facilitate breathing. Call 112.', icon: <CheckCircle2 size={64} className="text-blue-500" />, tip: 'Ensure their head rests on the back of their hand. This keeps the neck aligned and the airway open.' },
            ]
        }
    },
    {
        id: 'rcp', title: '3. Basic CPR', description: 'Cardiopulmonary Resuscitation.', icon: 'rcp', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=7SBBka5fwW8'],
            steps: [
                { title: 'When to do CPR?', text: 'Only if the person does NOT respond and does NOT breathe. Call 112 immediately or ask for an AED.', icon: <AlertTriangle size={64} className="text-red-600" /> },
                { title: 'Hand Position', text: 'Heel of one hand in the center of the chest (sternum). The other hand on top interlocking fingers.', icon: <HeartPulse size={64} className="text-red-500" />, why: 'The sternum is a strong bone that transmits force to the heart. Pressing ribs could break them without pumping blood.', tip: 'Lift your fingers to ensure only the heel of the hand touches the chest.' },
                { title: 'Compressions', text: 'Arms straight. Let your weight fall. Compress hard and fast (5-6 cm deep).', icon: <Activity size={64} className="text-orange-500" />, why: 'By compressing, you mechanically pump blood to the brain. By releasing, you allow the heart to fill again.', warning: 'Do NOT bend your elbows! If you use arm strength you will exhaust yourself in seconds. Lock elbows and use body weight.' },
                { title: 'The Rhythm', text: 'You must do 100-120 compressions per minute. Follow the rhythm of "Stayin\' Alive".', icon: <Zap size={64} className="text-yellow-500" />, tip: 'If there are more people, take turns every 2 minutes. CPR quality drops drastically due to fatigue even if you don\'t notice.' },
                { title: 'Practical Training', text: 'Prove you can maintain the correct rhythm in this simulator.', icon: <Gauge size={64} className="text-red-600" />, interactiveComponent: 'CPRHero' }
            ]
        }
    },
    {
        id: 'hemorragia', title: '4. Hemorrhages', description: 'Bleeding control.', icon: 'hemorragia', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=cVWQm_CPG3o'],
            steps: [
                { title: 'Direct Pressure', text: 'It is the most important. Press hard on the wound with gauze or a clean cloth.', icon: <Droplets size={64} className="text-red-600" />, why: 'Mechanical pressure closes broken vessels against bone or muscle, allowing platelets to form a plug (clot).' },
                { title: 'Do Not Remove', text: 'If the dressing soaks through, DO NOT remove it. Put another clean one on top and keep pressing.', icon: <FileSpreadsheet size={64} className="text-gray-500" /> },
                { title: 'Elevation', text: 'If possible and no fracture, elevate the limb above the heart.', icon: <ArrowRight size={64} className="text-blue-500 transform -rotate-45" /> },
                { title: 'Nosebleed', text: 'Tilt head FORWARD (not backward) and pinch nostrils for 10 minutes.', icon: <Frown size={64} className="text-red-400" /> }
            ]
        }
    },
    {
        id: 'quemaduras', title: '5. Burns', description: 'Cool and cover.', icon: 'quemaduras', type: 'module',
        content: {
            steps: [
                { title: 'Water, water, water', text: 'Run cold water (not ice cold) over the burn for 15-20 minutes.', icon: <Droplets size={64} className="text-blue-400" />, why: 'Even if you remove the fire, residual heat continues to damage skin. Water stops that cellular destruction.', warning: 'NEVER use direct ice. Extreme cold "burns" by freezing and damages tissue further.' },
                { title: 'What NOT to do', text: 'Never apply toothpaste, oil, or break blisters. That causes infection.', icon: <XCircle size={64} className="text-red-500" />, why: 'Toothpaste is not sterile, dries into a hard crust that hurts to remove and favors infection.' },
                { title: 'Cover', text: 'Cover gently with clean wet gauze or clean plastic wrap without tightening.', icon: <ShieldCheck size={64} className="text-green-500" /> }
            ]
        }
    },
    {
        id: 'atragantamiento', title: '6. Choking', description: 'Heimlich Maneuver.', icon: 'atragantamiento', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=CsMfu8Iuvgc'],
            steps: [
                { title: 'Coughing?', text: 'If the victim coughs, encourage them to keep coughing. Do not slap their back yet.', icon: <Wind size={64} className="text-gray-500" /> },
                { title: 'Not breathing / Not coughing', text: 'If they stop coughing and grab their neck: Lean them forward and give 5 strong back blows between shoulder blades.', icon: <HandIcon size={64} className="text-orange-500" />, tip: 'Support their chest with one hand and lean them forward. Thus, if the object comes out, it falls to the ground by gravity.' },
                { title: 'Heimlich Maneuver', text: 'If object is not expelled: Hug from behind, fist at stomach pit and press inward and upward.', icon: <Users size={64} className="text-blue-600" />, why: 'This sudden pressure raises the diaphragm, compressing lungs like bellows. Residual air exits under pressure expelling the object.', warning: 'Mind the floating ribs. Fist goes between belly button and sternum.' },
                { title: 'Where to press?', text: 'Learn the exact spot in this interactive mini-game.', icon: <Target size={64} className="text-red-500" />, interactiveComponent: 'HeimlichGame' }
            ]
        }
    },
    {
        id: 'sincope', title: '7. Fainting', description: 'Syncope and Fainting.', icon: 'sincope', type: 'module',
        content: {
            steps: [
                { title: 'Previous Symptoms', text: 'Dizziness, cold sweat, paleness, blurred vision. Act fast before they fall.', icon: <Frown size={64} className="text-gray-400" /> },
                { title: 'Lay Down and Elevate', text: 'Lay the person down and raise their legs (anti-shock position) so blood goes to the brain.', icon: <ArrowRight size={64} className="text-blue-500 transform -rotate-45" />, why: 'By gravity, blood accumulated in legs returns to the heart and pumps to the brain, recovering consciousness.' },
                { title: 'Fresh Air', text: 'Avoid crowds around. Loosen tight clothing (collar, belt).', icon: <Wind size={64} className="text-cyan-400" /> },
                { title: 'Recovery', text: 'Do not give food or drink until fully recovered. If not waking up, PLS and 112.', icon: <CheckCircle2 size={64} className="text-green-500" />, warning: 'Danger! If given water while dizzy, they may choke and liquid go to lungs (aspiration).' },
            ]
        }
    },
    {
        id: 'golpes', title: '8. Trauma', description: 'Bumps and Fractures.', icon: 'golpes', type: 'module',
        content: {
            steps: [
                { title: 'Local Cold', text: 'Apply ice (wrapped in cloth) on the hit to reduce inflammation and pain.', icon: <ThermometerSnowflake size={64} className="text-blue-400" />, why: 'Cold constricts blood vessels, reducing internal bleeding (bruise) and swelling.' },
                { title: 'Rest', text: 'Do not move the affected area, especially if fracture is suspected (intense pain, deformity).', icon: <AlertTriangle size={64} className="text-orange-500" /> },
                { title: 'Immobilize', text: 'If fracture, do not try to set the bone. Immobilize as is and go to hospital.', icon: <Activity size={64} className="text-red-500" />, warning: 'If you try to straighten a broken bone, you can tear nerves or arteries causing irreversible damage.' },
            ]
        }
    },
    {
        id: 'bucodental', title: '9. Teeth', description: 'Dental Trauma.', icon: 'bucodental', type: 'module',
        content: {
            steps: [
                { title: 'Broken Tooth', text: 'If a piece breaks, try to find it. Clean gently with water.', icon: <Search size={64} className="text-gray-500" /> },
                { title: 'Knocked Out Tooth', text: 'Time is gold! Pick the tooth by the crown (white part), NEVER the root.', icon: <Smile size={64} className="text-gray-400" />, why: 'The root has living fibers needed for successful reimplantation. If touched, they die.' },
                { title: 'Transport', text: 'Carry it in a glass of milk, saline, or patient\'s saliva. Go to dentist urgently.', icon: <BriefcaseMedical size={64} className="text-blue-500" />, tip: 'Whole milk or saliva maintains pH and nutrients for tooth cells to survive 1-2 hours.' },
            ]
        }
    },
    {
        id: 'craneo', title: '10. Head Hit', description: 'Neurological watch.', icon: 'craneo', type: 'module',
        content: {
            steps: [
                { title: 'Surveillance', text: 'After a strong head hit, do not leave the person alone. Watch them.', icon: <UserCheck size={64} className="text-blue-500" /> },
                { title: 'Alarm Signs', text: 'Vomiting, excessive drowsiness, disorientation, different pupil sizes. Hospital!', icon: <AlertTriangle size={64} className="text-red-600" /> },
                { title: 'Do not move', text: 'If hit was very strong or neck pain, DO NOT move the victim (spinal injury risk).', icon: <XCircle size={64} className="text-red-500" /> }
            ]
        }
    },
    {
        id: 'anafilaxia', title: '11. Anaphylaxis', description: 'Severe allergy.', icon: 'anafilaxia', type: 'module',
        content: {
            steps: [
                { title: 'Severe Reaction', text: 'Happens fast after eating, sting, or meds. Swelling of lips, difficulty breathing.', icon: <Activity size={64} className="text-red-600" /> },
                { title: 'Auto-injector', text: 'Ask if they carry adrenaline (EpiPen). If so, help them use it on the thigh.', icon: <Syringe size={64} className="text-orange-500" />, tip: 'The thigh (vastus lateralis) has muscle and blood flow, absorbing meds very fast.' },
                { title: 'Call 112', text: 'It is a vital emergency. Always call, even if they improve after injection.', icon: <Volume2 size={64} className="text-blue-600" /> }
            ]
        }
    },
    {
        id: 'asma', title: '12. Asthma', description: 'Respiratory crisis.', icon: 'asma', type: 'module',
        content: {
            steps: [
                { title: 'Calm', text: 'Anxiety worsens the crisis. Calm the person and help them sit (better than lying down).', icon: <Smile size={64} className="text-green-500" />, why: 'Sitting lowers diaphragm allowing lungs to expand. Lying down makes breathing harder.' },
                { title: 'Inhaler', text: 'Use rescue inhaler (ventolin). Usually 2 puffs.', icon: <AirVent size={64} className="text-blue-500" /> },
                { title: 'If no improvement', text: 'If after minutes difficulty breathing persists or blue lips, call 112.', icon: <Phone size={64} className="text-red-500" /> }
            ]
        }
    },
    {
        id: 'epilepsia', title: '13. Epilepsy', description: 'Seizures.', icon: 'epilepsia', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=8TK3N3ZT_TQ'],
            steps: [
                { title: 'Do not restrain', text: 'Do NOT try to hold the person down. Clear area of objects they might hit.', icon: <XCircle size={64} className="text-red-500" /> },
                { title: 'Protect Head', text: 'Put something soft (jacket, cushion) under head to avoid floor impact.', icon: <Brain size={64} className="text-violet-500" /> },
                { title: 'Mouth Free', text: 'NEVER put anything in their mouth. They won\'t swallow tongue. You could hurt teeth or get bitten.', icon: <XCircle size={64} className="text-orange-500" />, why: 'It is anatomically impossible to swallow the tongue. Inserting objects only breaks teeth.' },
                { title: 'When finished', text: 'When seizure stops, put in Recovery Pos and let rest. Time the duration.', icon: <UserCheck size={64} className="text-green-500" /> }
            ]
        }
    },
    {
        id: 'diabetes', title: '14. Diabetes', description: 'Hyper/Hypoglycemia.', icon: 'diabetes', type: 'module',
        content: {
            videoUrls: ['https://www.youtube.com/watch?v=ierjrLcyJLo', 'https://www.youtube.com/watch?v=uTWKxAovnuc&t=19s'],
            steps: [
                { title: 'Hypoglycemia (Low)', text: 'Most urgent. Cold sweat, tremors, dizziness, confusion. Happens fast.', icon: <ArrowRight size={64} className="text-red-500 transform rotate-90" /> },
                { title: 'If Conscious', text: 'Give sugar fast: juice, soda (not diet), sugar packets. ', icon: <Candy size={64} className="text-orange-500" />, why: 'Brain feeds only on glucose. Without it, it shuts down.' },
                { title: 'Glucagon (Unconscious)', text: 'If unconscious, NOTHING by mouth. Orange kit (Glucagon) injectable. Call 112.', icon: <Syringe size={64} className="text-red-600" /> },
                { title: 'Hyperglycemia (High)', text: 'High sugar. Thirst, constant urination, dry skin, fruity breath. Needs insulin.', icon: <Activity size={64} className="text-blue-500" /> },
                { title: 'General Protocol', text: 'Doubt or unconscious: NEVER feed. PLS and 112.', icon: <Phone size={64} className="text-green-500" /> }
            ]
        }
    },
    {
        id: 'ansiedad', title: '15. Anxiety', description: 'Panic attack.', icon: 'ansiedad', type: 'module',
        content: {
            steps: [
                { title: 'Hyperventilation', text: 'Breathing very fast, tingling hands/mouth. Fear of dying.', icon: <Wind size={64} className="text-gray-400" /> },
                { title: 'Accompany', text: 'Speak calmly. "I am here with you, you will be fine".', icon: <Users size={64} className="text-green-500" /> },
                { title: 'Breathing', text: 'Guide slow breathing. Inhale 3s, hold 3s, exhale 3s.', icon: <Activity size={64} className="text-blue-400" />, why: 'Slow abdominal breathing activates parasympathetic system, reducing adrenaline.' }
            ]
        }
    },
    {
        id: 'botiquin', title: '16. First Aid Kit', description: 'Essential material.', icon: 'botiquin', type: 'module',
        content: {
            steps: [
                { title: 'Basics', text: 'School or home kit must have curing and protection material.', icon: <BriefcaseMedical size={64} className="text-red-500" /> },
                { title: 'Protection', text: 'Disposable gloves. Essential to protect from infection.', icon: <ShieldCheck size={64} className="text-blue-500" /> },
                { title: 'Cures', text: 'Saline (clean), sterile gauze (cover), antiseptic (chlorhexidine), bandaids.', icon: <Droplets size={64} className="text-cyan-500" /> },
                { title: 'Instruments', text: 'Round tip scissors and tweezers.', icon: <ArchiveIcon size={64} className="text-gray-500" /> },
                { title: 'Kit Challenge', text: 'Identify what belongs and what doesn\'t.', icon: <CheckCircle2 size={64} className="text-green-600" />, interactiveComponent: 'BotiquinGame' }
            ]
        }
    },
    {
        id: 'triaje', title: '17. Basic Triage', description: 'Prioritize multiple victims.', icon: 'triaje', type: 'module',
        content: {
            steps: [
                { title: 'What is Triage?', text: 'In accidents with many victims, attend first those in immediate danger but saveable.', icon: <Siren size={64} className="text-rose-500" /> },
                { title: 'Priority 1 (Red)', text: 'Unconscious, respiratory issues or severe bleeding. First!', icon: <AlertTriangle size={64} className="text-red-600" />, why: 'They have minutes of life. Others can wait.' },
                { title: 'Screaming is alive', text: 'Someone screaming loudly is breathing and has pulse. Can wait while you check silent ones.', icon: <VolumeX size={64} className="text-orange-500" /> },
                { title: 'Triage Sim', text: 'You have 3 victims. Select order.', icon: <Stethoscope size={64} className="text-blue-500" />, interactiveComponent: 'TriageGame' }
            ]
        }
    },
    { id: 'sim_patio', title: 'Case 1: Playground', description: 'Sim: Accident at break.', icon: 'roleplay', type: 'roleplay' },
    { id: 'sim_comedor', title: 'Case 2: Canteen', description: 'Sim: Choking.', icon: 'roleplay', type: 'roleplay' },
    { id: 'timeTrial', title: 'Time Trial', description: 'Train speed and precision.', icon: 'zap', type: 'timeTrial' },
    { id: 'examen', title: 'Final Exam', description: 'Evaluate knowledge.', icon: 'examen', type: 'exam' },
    { id: 'desa', title: 'AED Sim', description: 'Defibrillator practice.', icon: 'desa', type: 'desa' },
    { id: 'glosario', title: 'Glossary', description: 'Terms dictionary.', icon: 'glosario', type: 'glossary' },
    { id: 'certificado', title: 'Certificate', description: 'Your symbolic diploma.', icon: 'certificado', type: 'certificate' },
];

export const DAILY_SCENARIOS_EN = [
    {
        id: 1,
        q: "You see a cyclist fall. Hits head and does not move. What do you do FIRST?",
        options: ["Run to remove helmet so they breathe better.", "Call 112 immediately.", "Approach carefully ensuring the area (PAS).", "Give water."],
        correct: 2,
        explanation: "PAS Order! 1st Protect (ensure zone), 2nd Alert, 3rd Support. Removing helmet can worsen cervical injury."
    },
    {
        id: 2,
        q: "At a family meal, your cousin grabs their neck and can't cough or breathe. What do you do?",
        options: ["Heimlich Maneuver.", "Capillary Refill.", "CPR (30 compressions / 2 breaths).", "Slap the neck."],
        correct: 0,
        explanation: "It is a complete obstruction. Heimlich is indicated. Back blows are prior, but if no cough, Heimlich is vital."
    },
    {
        id: 3,
        q: "You find an unconscious person who IS breathing. Position?",
        options: ["Face up (Supine).", "Recovery Position (PLS).", "Sitting.", "Face down."],
        correct: 1,
        explanation: "PLS prevents tongue or vomit from obstructing airway."
    },
    {
        id: 4,
        q: "Burn hand with boiling oil. First thing to apply?",
        options: ["Direct ice.", "Toothpaste.", "Cold tap water for 15-20 min.", "Butter or oil."],
        correct: 2,
        explanation: "Cold water stops tissue destruction by heat. Ice burns by cold and pastes infect."
    },
    {
        id: 5,
        q: "You witness an epileptic seizure. What NOT to do?",
        options: ["Put something in mouth.", "Protect head with soft object.", "Time the duration.", "Loosen tight clothes."],
        correct: 0,
        explanation: "NEVER put anything in mouth. You could break teeth or get bitten. They won't swallow tongue."
    }
];

export const ROLEPLAY_SCENARIOS_EN = {
    sim_patio: {
        title: "Emergency at Playground",
        startNode: "start",
        nodes: {
            start: { text: "You are at break. You see a classmate hit their head and stay still.", options: [{ text: "Shake them.", next: "error_shake" }, { text: "Apply PAS.", next: "pas_protect" }] },
            error_shake: { text: "ERROR! You could worsen an injury. Never move abruptly.", isFailure: true },
            pas_protect: { text: "Well done. Zone secured. No response.", options: [{ text: "Shout for help and See-Hear-Feel.", next: "check" }, { text: "Go find a teacher.", next: "error_leave" }] },
            error_leave: { text: "Do not leave unconscious victim alone if solo.", isFailure: true },
            check: { text: "Breathing but unconscious.", options: [{ text: "CPR.", next: "error_cpr" }, { text: "Recovery Pos (PLS).", next: "success_pls" }] },
            error_cpr: { text: "If breathing, no CPR.", isFailure: true },
            success_pls: { text: "Perfect! PLS and 112.", isSuccess: true }
        }
    },
    sim_comedor: {
        title: "Scare at Canteen",
        startNode: "start",
        nodes: {
            start: { text: "Student choking. Hands to neck. No cough.", options: [{ text: "Give water.", next: "error_water" }, { text: "Act (Total blockage).", next: "act" }] },
            error_water: { text: "Water can worsen obstruction.", isFailure: true },
            act: { text: "Stand behind.", options: [{ text: "Heimlich direct.", next: "error_direct" }, { text: "5 Back blows.", next: "blows" }] },
            error_direct: { text: "First 5 back blows.", isFailure: true },
            blows: { text: "Object not out.", options: [{ text: "Heimlich compressions.", next: "success_heimlich" }] },
            success_heimlich: { text: "Object expelled!", isSuccess: true }
        }
    }
};

export const EXAM_QUESTIONS_EN = [
    // Original 10
    { q: 'First step of PAS?', opts: ['Alert', 'Support', 'Protect'], a: 'Protect', expl: 'Always PROTECT yourself and the victim before doing anything else.' },
    { q: 'Emergency phone Europe', opts: ['911', '091', '112'], a: '112', expl: '112 is the single emergency number in the EU.' },
    { q: 'Unconscious victim breathing. Position?', opts: ['Face up', 'PLS', 'Sitting'], a: 'PLS', expl: 'PLS prevents tongue or vomit blocking the airway.' },
    { q: 'CPR Rhythm Adults', opts: ['60-80 bpm', '100-120 bpm', '140 bpm'], a: '100-120 bpm', expl: 'Optimal rhythm is fast, 100-120 compressions per minute.' },
    { q: 'Compression:Ventilation Ratio', opts: ['15:2', '30:2', '30:5'], a: '30:2', expl: '30 compressions followed by 2 ventilations.' },
    { q: 'What to do for nosebleed?', opts: ['Head back', 'Plug with cotton', 'Head forward and pinch'], a: 'Head forward and pinch', expl: 'Tilting forward prevents swallowing blood.' },
    { q: 'Burn: What to apply first?', opts: ['Toothpaste', 'Direct ice', 'Cold water 15 min'], a: 'Cold water 15 min', expl: 'Only cold water to cool the area.' },
    { q: 'Maneuver for severe choking', opts: ['Heimlich', 'Rautek', 'Fowler'], a: 'Heimlich', expl: 'Heimlich maneuver clears the airway.' },
    { q: 'Symptom of Anaphylaxis', opts: ['Leg pain', 'Swollen lips and wheezing', 'Thirst'], a: 'Swollen lips and wheezing', expl: 'Anaphylaxis is a severe allergic reaction.' },
    { q: 'During seizure, put something in mouth?', opts: ['Yes, a handkerchief', 'Yes, a spoon', 'NEVER'], a: 'NEVER', expl: 'Never insert anything, you could cause injury.' },

    // New 30 Questions translation
    { q: 'Chest compression depth (adult)?', opts: ['2-3 cm', '5-6 cm', '8-10 cm'], a: '5-6 cm', expl: 'Deep compressions (5-6 cm) are needed to pump blood.' },
    { q: 'If victim vomits during CPR...', opts: ['Stop and wait', 'Turn to side and clear mouth', 'Keep compressing'], a: 'Turn to side and clear mouth', expl: 'Turn them to clear vomit, then continue CPR.' },
    { q: 'AED is used for...', opts: ['Unchoking', 'Stop bleeding', 'Reverse cardiac arrest'], a: 'Reverse cardiac arrest', expl: 'Defibrillator gives shock to restart heart rhythm.' },
    { q: 'Alone with unconscious child NOT breathing...', opts: ['Call before touching', '1 min CPR then call', 'Wait to see if breathes'], a: '1 min CPR then call', expl: 'In kids, cause is usually respiratory. Do CPR one minute before leaving to call.' },
    { q: 'How to check consciousness?', opts: ['Pinch hard', 'Speak loud and shake shoulders', 'Pour water'], a: 'Speak loud and shake shoulders', expl: 'Verbal and physical stimulation (shoulders) without being aggressive.' },
    { q: 'What NOT to do in severe burn?', opts: ['Break blisters', 'Cool with water', 'Cover with clean cloth'], a: 'Break blisters', expl: 'Blisters protect from infection. Never break them.' },
    { q: 'Object stuck in body...', opts: ['Pull out fast', 'Wiggle to check depth', 'Do not touch and stabilize'], a: 'Do not touch and stabilize', expl: 'Removing it can increase bleeding. Immobilize protecting around it.' },
    { q: 'Tourniquet: When to use?', opts: ['Always if bleeding', 'Uncontrollable exsanguinating bleeding', 'Stings'], a: 'Uncontrollable exsanguinating bleeding', expl: 'Last resort in limbs when direct pressure fails and life risk.' },
    { q: 'Sign of bone fracture', opts: ['Deformity and intense pain', 'Itching', 'Dry skin'], a: 'Deformity and intense pain', expl: 'Deformity, swelling, and pain on movement are typical.' },
    { q: 'Sprain: Immediate treatment', opts: ['Intense heat', 'Walk to warm up', 'Cold, Rest, Elevation'], a: 'Cold, Rest, Elevation', expl: 'Remember RICE (Rest, Ice, Compression, Elevation).' },
    { q: 'Knocked out permanent tooth', opts: ['Throw away', 'Wash with soap', 'Keep in milk/saliva'], a: 'Keep in milk/saliva', expl: 'Preserve in physiological liquid and go urgent to dentist.' },
    { q: 'Fainting: What to do?', opts: ['Give water fast', 'Elevate legs', 'Sit up'], a: 'Elevate legs', expl: 'Elevating legs helps venous return to brain.' },
    { q: 'Heat stroke: First aid', opts: ['Thermal blanket', 'Cool body gradually', 'Ice bath sudden'], a: 'Cool body gradually', expl: 'Move to cool place and apply wet cloths.' },
    { q: 'Stroke: FAST test', opts: ['Face, Arms, Speech, Time', 'Chest pain', 'High fever'], a: 'Face, Arms, Speech, Time', expl: 'Face drooping, Arm weakness, Speech difficulty.' },
    { q: 'Heart Attack: Common symptom', opts: ['Oppressive chest pain radiating', 'Itchy nose', 'Hunger'], a: 'Oppressive chest pain radiating', expl: 'Pain usually goes to left arm, neck, or jaw.' },
    { q: 'Triage: Who has priority?', opts: ['Loudest screamer', 'Unconscious breathing bad', 'Dead'], a: 'Unconscious breathing bad', expl: 'Red Priority: Immediate life danger but saveable.' },
    { q: 'What is in basic kit?', opts: ['Antibiotics', 'Scalpel', 'Gauze, gloves, antiseptic'], a: 'Gauze, gloves, antiseptic', expl: 'Curing/protection material is essential, not medication.' },
    { q: 'Partial choking (coughing)', opts: ['Back blows', 'Encourage coughing', 'Heimlich'], a: 'Encourage coughing', expl: 'If coughing, air passes. Let natural mechanism work.' },
    { q: 'Asthma crisis: Position', opts: ['Lying face down', 'Sitting or semi-sitting', 'Standing'], a: 'Sitting or semi-sitting', expl: 'Sitting facilitates breathing. Use their bronchodilator.' },
    { q: 'Hypoglycemia conscious', opts: ['Insulin', 'Sugar/Sweet drink', 'Nothing by mouth'], a: 'Sugar/Sweet drink', expl: 'Needs fast sugar to raise glycemia.' },
    { q: 'Suspected spinal injury', opts: ['Move to hospital', 'DO NOT move unless vital danger', 'Sit comfortable'], a: 'DO NOT move unless vital danger', expl: 'Moving could cause permanent paralysis.' },
    { q: 'Sucking chest wound', opts: ['Leave open', 'Cover 3 sides (valve)', 'Plug completely'], a: 'Cover 3 sides (valve)', expl: 'Allows air out but not in to prevent tension pneumothorax.' },
    { q: 'Amputation: What to do with limb?', opts: ['Hot water', 'Direct ice', 'Sealed bag then ice'], a: 'Sealed bag then ice', expl: 'Do not put tissue directly on ice. Protect in bag first.' },
    { q: 'Wasp sting (no allergy)', opts: ['Mud', 'Ammonia', 'Local cold and remove stinger'], a: 'Local cold and remove stinger', expl: 'Remove stinger scraping (no tweezers) and apply cold.' },
    { q: 'Animal bite', opts: ['Suck poison', 'Wash with soap and water', 'Tourniquet'], a: 'Wash with soap and water', expl: 'Infection is major risk. Wash thoroughly.' },
    { q: 'Smoke intoxication', opts: ['Milk', 'Go to fresh air', 'Vomit'], a: 'Go to fresh air', expl: 'Priority is oxygen. Move away from toxic source.' },
    { q: 'Electrocution', opts: ['Touch to check pulse', 'Cut power first', 'Pour water'], a: 'Cut power first', expl: 'Secure scene by cutting power before touching victim.' },
    { q: 'Foreign body in eye', opts: ['Rub hard', 'Wash with saline/water', 'Remove with tweezers'], a: 'Wash with saline/water', expl: 'Flushing is safest. Do not rub.' },
    { q: 'Anxiety crisis', opts: ['Breathe in bag', 'Slow breathing guiding', 'Scream at them'], a: 'Slow breathing guiding', expl: 'Guide breathing: "Inhale... Hold... Exhale".' },
    { q: 'When to stop CPR?', opts: ['After 5 min', 'When help arrives or exhausted', 'If rib breaks'], a: 'When help arrives or exhausted', expl: 'Continue until relieved, 112 arrives, or victim wakes.' },
];

export const GLOSSARY_EN = [
    { t: 'ABCDE', d: 'Assessment protocol: Airway, Breathing, Circulation, Disability, Exposure.' },
    { t: 'Abrasion', d: 'Superficial scratch on skin.' },
    { t: 'Adrenaline', d: 'Hormone/medication used in severe allergic reactions (anaphylaxis).' },
    { t: 'Agonal (Breathing)', d: 'Ineffective gasping. Considered cardiac arrest.' },
    { t: 'Anaphylaxis', d: 'Severe rapid allergic reaction that can close the throat.' },
    { t: 'Angina', d: 'Chest pain because heart lacks oxygen momentarily.' },
    { t: 'Dressing', d: 'Material (gauze, bandage) placed on wound to cover it.' },
    { t: 'Artery', d: 'Blood vessel carrying oxygenated blood from heart. Bright red spurting bleeding.' },
    { t: 'Asphyxia', d: 'Lack of oxygen due to obstruction or breathing difficulty.' },
    { t: 'Avulsion', d: 'Tearing away of a body part (e.g., tooth or nail).' },
    { t: 'Mouth to Mouth', d: 'Artificial ventilation technique blowing air into lungs.' },
    { t: 'First Aid Kit', d: 'Box or case with medical material for first aid.' },
    { t: 'Bradycardia', d: 'Very slow heart rate (less than 60 bpm).' },
    { t: 'Aspiration', d: 'Passage of food, vomit, or liquid into lungs.' },
    { t: 'Capillaries', d: 'Tiny blood vessels. Bleeding is mild and oozing.' },
    { t: 'Cyanosis', d: 'Bluish skin/lips due to lack of oxygen.' },
    { t: 'Clot', d: 'Plug of solid blood that stops bleeding.' },
    { t: 'Compressions', d: 'Rhythmic chest presses to pump blood artificially.' },
    { t: 'Concussion', d: 'Momentary loss of brain function after hit.' },
    { t: 'Contusion', d: 'Hit that doesn\'t break skin but causes pain and bruise.' },
    { t: 'Seizure', d: 'Involuntary violent muscle movements (e.g., epilepsy).' },
    { t: 'Supine', d: 'Lying face up.' },
    { t: 'AED', d: 'Automated External Defibrillator. Device giving shocks to heart.' },
    { t: 'Dehydration', d: 'Excessive loss of body water.' },
    { t: 'Dyspnea', d: 'Sensation of shortness of breath.' },
    { t: 'Edema', d: 'Swelling due to fluid accumulation.' },
    { t: 'Electrocution', d: 'Injury caused by electric current passing through body.' },
    { t: 'Epistaxis', d: 'Nosebleed.' },
    { t: 'Ecchymosis', d: 'Medical name for a bruise.' },
    { t: 'Erythema', d: 'Redness of skin (e.g., sunburn).' },
    { t: 'Sprain', d: 'Stretching or tearing of ligaments.' },
    { t: 'Sternum', d: 'Flat bone in chest center where CPR is done.' },
    { t: 'Splint', d: 'Rigid object used to immobilize fracture.' },
    { t: 'Fibrillation', d: 'Chaotic heart rhythm preventing blood pumping (Arrest).' },
    { t: 'Fracture', d: 'Broken bone. Can be open (bone out) or closed.' },
    { t: 'Gasping', d: 'Agonal breathing ineffective typical of cardiac arrest.' },
    { t: 'Glucagon', d: 'Injectable hormone to raise sugar urgently.' },
    { t: 'Heat Stroke', d: 'Dangerous body temp rise due to sun/extreme heat.' },
    { t: 'Heimlich', d: 'Abdominal thrust maneuver to unchoke.' },
    { t: 'Hematoma', d: 'Blood accumulation under skin (severe bruise/lump).' },
    { t: 'Hemorrhage', d: 'Blood escaping from vessels.' },
    { t: 'Hyperventilation', d: 'Breathing very fast, common in anxiety.' },
    { t: 'Hypoglycemia', d: 'Excessive drop in blood sugar.' },
    { t: 'Hypothermia', d: 'Dangerous drop in body temperature.' },
    { t: 'Hypoxia', d: 'Lack of oxygen in tissues.' },
    { t: 'Stroke', d: 'Cerebral infarction. Loss of brain function.' },
    { t: 'Infarction', d: 'Tissue death (usually heart) due to lack of blood flow.' },
    { t: 'Immobilization', d: 'Technique to prevent injury movement and worsening.' },
    { t: 'Sunstroke', d: 'Disorder from excessive sun exposure.' },
    { t: 'Fainting', d: 'Brief loss of consciousness, usually heat, hunger, stress.' },
    { t: 'Dislocation', d: 'Bone popping out of joint.' },
    { t: 'Thermal Blanket', d: 'Gold/silver sheet to maintain body temp.' },
    { t: 'Spinal Cord', d: 'Nervous cable inside spine. If broken causes paralysis.' },
    { t: 'Necrosis', d: 'Tissue death (turns black).' },
    { t: 'Pneumothorax', d: 'Air entering chest collapsing lung.' },
    { t: 'Airway Obstruction', d: 'Blockage preventing breathing (choking).' },
    { t: 'FBAO', d: 'Foreign Body Airway Obstruction.' },
    { t: 'Cardiac Arrest', d: 'Heart stops beating. Reversible clinical death with CPR.' },
    { t: 'PAS', d: 'Protect, Alert, Support. Basic protocol.' },
    { t: 'PLS', d: 'Recovery Position. On side for unconscious.' },
    { t: 'Polytrauma', d: 'Multiple severe injuries simultaneously.' },
    { t: 'Pulse', d: 'Beat palpable in arteries (neck, wrist).' },
    { t: 'Burn', d: 'Injury by heat, chemicals, friction. Degrees 1st, 2nd, 3rd.' },
    { t: 'CPR', d: 'Cardiopulmonary Resuscitation. Compressions + Breaths.' },
    { t: 'Pupillary Reflex', d: 'Pupil contraction to light.' },
    { t: 'Shock', d: 'Severe state where not enough blood reaches vital organs.' },
    { t: 'Syncope', d: 'Sudden loss of consciousness (fainting).' },
    { t: 'BLS', d: 'Basic Life Support (CPR, AED).' },
    { t: 'Saline', d: '0.9% salt water similar to body fluids. Ideal for washing.' },
    { t: 'Tachycardia', d: 'Very fast heart rate (over 100 bpm).' },
    { t: 'TBI', d: 'Traumatic Brain Injury (head hit).' },
    { t: 'Tetanus', d: 'Severe disease from dirty wounds. Needs vaccine.' },
    { t: 'Tourniquet', d: 'Tight band to totally cut massive bleeding.' },
    { t: 'Triage', d: 'Classification of victims by severity in disasters.' },
    { t: 'Thrombosis', d: 'Clot formation inside a vessel.' },
    { t: 'Urgency', d: 'Situation needing attention but no immediate life risk.' },
    { t: 'Hives', d: 'Red itchy welts on skin (allergy).' },
    { t: 'Vein', d: 'Vessel returning blood to heart. Dark continuous bleeding.' },
    { t: 'Airway', d: 'Path of air (mouth, throat, trachea, lungs).' },
    { t: 'Safe Zone', d: 'Place without dangers where victim should be moved.' }
];

// --- BACKWARD COMPATIBILITY / DEFAULTS ---
export const MODULES = MODULES_ES;
export const LEVELS = LEVELS_ES;
export const LEAGUES = LEAGUES_ES;
export const HIDDEN_BADGES = HIDDEN_BADGES_ES;
export const AVATARS = AVATARS_ES;
export const DAILY_SCENARIOS = DAILY_SCENARIOS_ES;
export const ROLEPLAY_SCENARIOS = ROLEPLAY_SCENARIOS_ES;
export const EXAM_QUESTIONS = EXAM_QUESTIONS_ES;
export const GLOSSARY = GLOSSARY_ES;


