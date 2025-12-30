
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

export const QUESTION_CATEGORIES_ES = [
    { id: 'pas', name: 'Fundamentos PAS', icon: 'ShieldCheck' },
    { id: 'rcp', name: 'RCP y DESA', icon: 'HeartPulse' },
    { id: 'hemorragia', name: 'Hemorragias', icon: 'Droplets' },
    { id: 'atragantamiento', name: 'Atragantamientos', icon: 'Wind' },
    { id: 'enfermedad', name: 'Urgencias Médicas', icon: 'Activity' },
    { id: 'trauma', name: 'Trauma y Lesiones', icon: 'HardHat' },
    { id: 'environ', name: 'Entorno y Otros', icon: 'Siren' }
];

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
    { q: '¿Primer paso del PAS?', opts: ['Avisar', 'Socorrer', 'Proteger'], a: 'Proteger', expl: 'Siempre debes PROTEGERTE a ti y a la víctima antes de hacer nada más.', cat: 'pas' },
    { q: 'Teléfono emergencias Europa', opts: ['911', '091', '112'], a: '112', expl: 'El 112 es el número único de emergencias en toda la UE.', cat: 'pas' },
    { q: 'Víctima inconsciente que respira. ¿Posición?', opts: ['Boca arriba', 'PLS', 'Sentado'], a: 'PLS', expl: 'La PLS evita que la lengua o el vómito obstruyan la vía aérea.', cat: 'pas' },
    { q: 'Ritmo RCP adultos', opts: ['60-80 cpm', '100-120 cpm', '140 cpm'], a: '100-120 cpm', expl: 'El ritmo óptimo es rápido, 100-120 compresiones por minuto.', cat: 'rcp' },
    { q: 'Relación Compresión:Ventilación', opts: ['15:2', '30:2', '30:5'], a: '30:2', expl: '30 compresiones seguidas de 2 ventilaciones.', cat: 'rcp' },
    { q: '¿Qué hacer ante hemorragia nasal?', opts: ['Cabeza atrás', 'Taponar con algodón', 'Cabeza adelante y presión'], a: 'Cabeza adelante y presión', expl: 'Inclinar hacia adelante evita tragar sangre.', cat: 'hemorragia' },
    { q: 'Quemadura: ¿Qué aplicar primero?', opts: ['Pasta dientes', 'Hielo directo', 'Agua fría 15 min'], a: 'Agua fría 15 min', expl: 'Solo agua fría para enfriar la zona.', cat: 'environ' },
    { q: 'Maniobra para atragantamiento grave', opts: ['Heimlich', 'Rautek', 'Fowler'], a: 'Heimlich', expl: 'La maniobra de Heimlich desobstruye la vía aérea.', cat: 'atragantamiento' },
    { q: 'Síntoma de anafilaxia', opts: ['Dolor pierna', 'Hinchazón labios y pitos', 'Sed'], a: 'Hinchazón labios y pitos', expl: 'La anafilaxia es una reacción alérgica severa.', cat: 'enfermedad' },
    { q: 'Ante convulsión, ¿meter algo en la boca?', opts: ['Sí, un pañuelo', 'Sí, una cuchara', 'NUNCA'], a: 'NUNCA', expl: 'Nunca introduzcas nada, podrías causar lesiones.', cat: 'enfermedad' },

    // Next 30 (Trauma & Specialized)
    { q: '¿Cuánto profundizar en compresiones torácicas (adulto)?', opts: ['2-3 cm', '5-6 cm', '8-10 cm'], a: '5-6 cm', expl: 'Se necesita comprimir fuerte (5-6 cm) para bombear sangre.', cat: 'rcp' },
    { q: 'Si la víctima vomita durante la RCP...', opts: ['Parar y esperar', 'Poner de lado y limpiar boca', 'Seguir comprimiendo'], a: 'Poner de lado y limpiar boca', expl: 'Gírala de lado para limpiar el vómito y luego continúa RCP.', cat: 'rcp' },
    { q: 'El DEA/DESA sirve para...', opts: ['Desatragantar', 'Parar hemoragias', 'Revertir paradas cardiacas'], a: 'Revertir paradas cardiacas', expl: 'El desfibrilador administra una descarga para reiniciar el ritmo cardiaco.', cat: 'rcp' },
    { q: 'Si estás solo con un niño inconsciente que NO respira...', opts: ['Llamar antes de tocar', '1 min de RCP y luego llamar', 'Esperar a ver si respira'], a: '1 min de RCP y luego llamar', expl: 'En niños, la causa suele ser respiratoria. Haz RCP un minuto antes de alejarte a llamar.', cat: 'rcp' },
    { q: '¿Cómo comprobar la consciencia?', opts: ['Pellizcar fuerte', 'Hablar alto y sacudir hombros', 'Echar agua'], a: 'Hablar alto y sacudir hombros', expl: 'Estimula verbal y físicamente (hombros) sin ser agresivo.', cat: 'pas' },
    { q: '¿Qué NO hacer en una quemadura grave?', opts: ['Romper ampollas', 'Enfriar con agua', 'Cubrir con paño limpio'], a: 'Romper ampollas', expl: 'Las ampollas protegen de infecciones. Nunca las rompas.', cat: 'environ' },
    { q: 'Objeto clavado en el cuerpo...', opts: ['Sacarlo rápido', 'Moverlo para ver profundidad', 'No tocar y fijar'], a: 'No tocar y fijar', expl: 'Si lo sacas, puede aumentar la hemorragia. Inmovilízalo protegiendo alrededor.', cat: 'hemorragia' },
    { q: 'Torniquete: ¿Cuándo se usa?', opts: ['Siempre que sangra', 'Hemorragias exanguinantes incontrolables', 'Picaduras'], a: 'Hemorragias exanguinantes incontrolables', expl: 'Último recurso en extremidades cuando la presión directa no funciona y hay riesgo vital.', cat: 'hemorragia' },
    { q: 'Signo de fractura ósea', opts: ['Deformidad y dolor intenso', 'Picor', 'Piel seca'], a: 'Deformidad y dolor intenso', expl: 'La deformidad, hinchazón y dolor al mover son típicos de fractura.', cat: 'trauma' },
    { q: 'Esguince: Tratamiento inmediato', opts: ['Calor intenso', 'Caminar para calentar', 'Frío, Reposo y Elevación'], a: 'Frío, Reposo y Elevación', expl: 'Recuerda RICE (Reposo, Hielo, Compresión, Elevación).', cat: 'trauma' },
    { q: 'Diente definitivo arrancado (avulsión)', opts: ['Tirarlo', 'Lavarlo con jabón', 'Guardar en leche/saliva'], a: 'Guardar en leche/saliva', expl: 'Consérvalo en medio líquido fisiológico y ve urgente al dentista.', cat: 'trauma' },
    { q: 'Lipotimia: ¿Qué hacer?', opts: ['Dar agua rápido', 'Elevar piernas (Trendelenburg)', 'Sentarlo'], a: 'Elevar piernas (Trendelenburg)', expl: 'Elevar las piernas ayuda al retorno venoso al cerebro.', cat: 'enfermedad' },
    { q: 'Golpe de calor: Primeros auxilios', opts: ['Manta térmica', 'Enfriar cuerpo gradualmente', 'Baño helado brusco'], a: 'Enfriar cuerpo gradualmente', expl: 'Llevar a un lugar fresco y aplicar paños húmedos.', cat: 'environ' },
    { q: 'Ictus: Escala CINCINNATI', opts: ['Cara, Brazos, Habla', 'Dolor pecho', 'Fiebre alta'], a: 'Cara, Brazos, Habla', expl: 'Pide sonreír (Cara), levantar brazos y hablar para detectar Ictus.', cat: 'enfermedad' },
    { q: 'Infarto: Síntoma común', opts: ['Dolor opresivo en pecho e irradiado', 'Picor nariz', 'Hambre'], a: 'Dolor opresivo en pecho e irradiado', expl: 'El dolor suele ir al brazo izquierdo, cuello o mandíbula.', cat: 'enfermedad' },
    { q: 'Triaje: ¿Quién tiene prioridad?', opts: ['El que más grita', 'Inconsciente que respira mal', 'Muerto'], a: 'Inconsciente que respira mal', expl: 'Prioridad Roja: Vida en peligro inmediato pero salvable.', cat: 'environ' },
    { q: '¿Qué contiene un botiquín básico?', opts: ['Antibióticos', 'Bisturí', 'Gasas, guantes, antiséptico'], a: 'Gasas, guantes, antiséptico', expl: 'Material de cura y autoprotección es lo esencial, no medicación.', cat: 'environ' },
    { q: 'Atragantamiento parcial (tose)', opts: ['Golpear espalda', 'Animar a toser', 'Heimlich'], a: 'Animar a toser', expl: 'Si tose, pasa aire. Deja que el mecanismo natural actúe.', cat: 'atragantamiento' },
    { q: 'Crisis asmática: Posición', opts: ['Tumbado boca abajo', 'Sentado o semisentado', 'De pie'], a: 'Sentado o semisentado', expl: 'Sentado facilita la respiración. Usa su broncodilatador.', cat: 'enfermedad' },
    { q: 'Hipoglucemia consciente', opts: ['Insulina', 'Azúcar/Bebida dulce', 'Nada por boca'], a: 'Azúcar/Bebida dulce', expl: 'Necesita azúcar rápido para subir la glucemia.', cat: 'enfermedad' },
    { q: 'Si sospechas lesión medular (columna)', opts: ['Mover al hospital', 'NO mover salvo peligro vital', 'Sentar cómodo'], a: 'NO mover salvo peligro vital', expl: 'Moverlo podría causar parálisis permanente.', cat: 'trauma' },
    { q: 'Herida en tórax "soplante"', opts: ['Dejar abierta', 'Tapar 3 lados (parche valve)', 'Taponar todo'], a: 'Tapar 3 lados (parche valve)', expl: 'Permite salir aire pero no entrar para evitar neumotórax a tensión.', cat: 'hemorragia' },
    { q: 'Amputación: ¿Qué hacer con el miembro?', opts: ['Agua caliente', 'Hielo directo', 'Bolsa estanca y luego hielo'], a: 'Bolsa estanca y luego hielo', expl: 'No pongas el tejido directo en hielo. Protégelo en bolsa primero.', cat: 'hemorragia' },
    { q: 'Picadura de avispa (sin alergia)', opts: ['Barro', 'Amoniaco', 'Frío local y retirar aguijón'], a: 'Frío local y retirar aguijón', expl: 'Retira el aguijón rascando (no pinzas) y aplica frío.', cat: 'environ' },
    { q: 'Mordedura de animal', opts: ['Chupar veneno', 'Lavar con agua y jabón abundante', 'Torniquete'], a: 'Lavar con agua y jabón abundante', expl: 'La infección es el mayor riesgo. Lava a fondo.', cat: 'environ' },
    { q: 'Intoxicación por humo', opts: ['Leche', 'Salir al aire fresco', 'Vomitar'], a: 'Salir al aire fresco', expl: 'La prioridad es oxigenar. Aléjate de la fuente tóxica.', cat: 'environ' },
    { q: 'Cuerpo extraño en ojo', opts: ['Frotar fuerte', 'Lavar con suero/agua abundante', 'Sacar con pinzas'], a: 'Lavar con suero/agua abundante', expl: 'El lavado por arrastre es lo más seguro. No frotes.', cat: 'environ' },
    { q: 'Crisis de ansiedad', opts: ['Respirar en bolsa', 'Respiración lenta acompañando', 'Gritarle'], a: 'Respiración lenta acompañando', expl: 'Guía su respiración: "Inspira... Aguanta... Expulsa".', cat: 'enfermedad' },
    { q: '¿Cuándo dejar de hacer RCP?', opts: ['A los 5 min', 'Cuando llegue ayuda experta o canse', 'Si rompes costilla'], a: 'Cuando llegue ayuda experta o canse', expl: 'Continúa hasta que te releven, llegue el 112 o la víctima despierte.', cat: 'rcp' },
    { q: 'Dolor abdominal fuerte y abdomen duro (tabla)', opts: ['Dar laxante', 'Poner calor', 'No dar nada y 112'], a: 'No dar nada y 112', expl: 'El abdomen en tabla sugiere irritación peritoneal grave (apendicitis, peritonitis). Requiere cirugía.', cat: 'enfermedad' },

    // Next 60 (New Expansion)
    { q: 'Atragantamiento en bebé (< 1 año)', opts: ['Heimlich igual que adulto', '5 golpes espalda y 5 compresiones pecho', 'Sacudir por los pies'], a: '5 golpes espalda y 5 compresiones pecho', expl: 'En bebés no se usa Heimlich. Se alternan ciclos de golpes y compresiones torácicas.', cat: 'atragantamiento' },
    { q: 'Víctima inconsciente con casco (moto)', opts: ['Quitar casco rápido', 'Dejar casco puesto salvo si no respira', 'Llenar de agua'], a: 'Dejar casco puesto salvo si no respira', expl: 'El casco estabiliza. Solo se quita si impide la respiración/RCP y con técnica de dos personas.', cat: 'trauma' },
    { q: 'Herida sucia con tierra', opts: ['Alcohol directo', 'Agua y jabón chorro', 'Tapar sin limpiar'], a: 'Agua y jabón chorro', expl: 'El agua a presión arrastra la suciedad. El alcohol quema el tejido sano.', cat: 'environ' },
    { q: 'Dificultad respiratoria y sibilancias (pitos)', opts: ['Crisis de ansiedad', 'Ataque de asma', 'Infarto'], a: 'Ataque de asma', expl: 'Los pitos al espirar son típicos del estrechamiento de bronquios en el asma.', cat: 'enfermedad' },
    { q: '¿Cuál es la frecuencia de ventilación en RCP?', opts: ['2 cada 30 compresiones', '5 cada 10 compresiones', '1 cada 5 compresiones'], a: '2 cada 30 compresiones', expl: 'Ciclo 30:2 es el estándar internacional para RCP básica.', cat: 'rcp' },
    { q: 'Señal de atragantamiento completo', opts: ['Grita mucho', 'No puede hablar, toser ni respirar', 'Tose con fuerza'], a: 'No puede hablar, toser ni respirar', expl: 'Si no hay sonido, la obstrucción es total. Requiere acción inmediata.', cat: 'atragantamiento' },
    { q: 'Paciente inconsciente boca abajo', opts: ['Dejarlo así', 'Pasar a PLS con cuidado', 'Sentarlo'], a: 'Pasar a PLS con cuidado', expl: 'Boca abajo puede asfixiarse. Poner de lado (PLS) permite vigilar la respiración.', cat: 'pas' },
    { q: '¿Qué es un Desfibrilador (DESA)?', opts: ['Máquina que da masajes', 'Aparato que analiza y da descarga si falta', 'Un medidor de tensión'], a: 'Aparato que analiza y da descarga si falta', expl: 'El DESA analiza el ritmo y solo descarga si hay una fibrilación reversible.', cat: 'rcp' },
    { q: 'Primer paso ante electrocución', opts: ['Tirar del brazo', 'Cortar la corriente', 'Echar agua'], a: 'Cortar la corriente', expl: 'NUNCA toques a alguien bajo tensión o te electrocutarás tú también.', cat: 'environ' },
    { q: '¿Cuál es la profundidad de compresión en lactantes?', opts: ['1 cm', '4 cm (1/3 tórax)', '8 cm'], a: '4 cm (1/3 tórax)', expl: 'En lactantes usamos 2 dedos y comprimimos 1/3 del diámetro del tórax (aprox 4cm).', cat: 'rcp' },
    { q: 'Ritmo de inflaciones en un ahogado (Parada por asfixia)', opts: ['5 insuflaciones de rescate iniciales', 'No dar aire, solo masaje', '10 insuflaciones seguidas'], a: '5 insuflaciones de rescate iniciales', expl: 'En paradas por asfixia (ahogados, niños), el oxígeno es vital, por eso se empieza con 5 ventilaciones.', cat: 'rcp' },
    { q: '¿Qué hacer ante una convulsión febril en un niño?', opts: ['Darle un baño de agua helada', 'Poner en PLS, vigilar y refrescar con compresas tibias', 'Sujetarle fuerte'], a: 'Poner en PLS, vigilar y refrescar con compresas tibias', expl: 'Mantén la calma, evita golpes y refresca gradualmente, NO con frío extremo.', cat: 'enfermedad' },
    { q: 'Signo de "atragantamiento incompleto"', opts: ['La víctima tose con fuerza y habla', 'No sale ningún sonido', 'Labios azules'], a: 'La víctima tose con fuerza y habla', expl: 'Si tose, el objeto permite el paso de algo de aire. Animar a toser es lo correcto.', cat: 'atragantamiento' },
    { q: '¿Qué hacer si una persona tartamudea y tiene la cara torcida de repente?', opts: ['Darle agua con azúcar', 'Llamar al 112 (sospecha de Ictus)', 'Dejarle dormir'], a: 'Llamar al 112 (sospecha de Ictus)', expl: 'Son signos claros de Ictus. Cada minuto cuenta para salvar neuronas.', cat: 'enfermedad' },
    { q: 'Ante una fractura abierta (se ve el hueso), ¿qué NO hacer?', opts: ['Poner gasas estériles encima', 'Intentar meter el hueso dentro', 'Inmovilizar'], a: 'Intentar meter el hueso dentro', expl: 'Meter el hueso causaría infecciones graves y daños en tejidos internos.', cat: 'trauma' },
    { q: 'En una amputación, ¿cómo se manda el miembro?', opts: ['Directo en hielo', 'En bolsa estanca, y esa bolsa dentro de otra con agua y hielo', 'En un bote con alcohol'], a: 'En bolsa estanca, y esa bolsa dentro de otra con agua y hielo', expl: 'El tejido no debe tocar el agua o hielo directamente para evitar quemaduras por frío.', cat: 'hemorragia' },
    { q: '¿Qué es el "Dedo en Guante" en hemorragias?', opts: ['Un tipo de venda', 'Presionar con el dedo directamente dentro de la herida si hay un vaso roto', 'Ponerse un guante pequeño'], a: 'Presionar con el dedo directamente dentro de la herida si hay un vaso roto', expl: 'Es la medida más extrema de presión directa sobre un punto sangrante.', cat: 'hemorragia' },
    { q: '¿Se puede dar agua a una persona en shock?', opts: ['Sí, mucha', 'NUNCA, nada por boca', 'Solo si tiene sed'], a: 'NUNCA, nada por boca', expl: 'En shock, el sistema digestivo no funciona y podría vomitar y aspirar el líquido.', cat: 'enfermedad' },
    { q: '¿Dónde se busca el pulso en un lactante?', opts: ['En el cuello (carotídeo)', 'En el brazo (braquial)', 'En la muñeca'], a: 'En el brazo (braquial)', expl: 'El cuello de un lactante es corto y difícil; el pulso braquial (cara interna del brazo) es más fiable.', cat: 'rcp' },
    { q: '¿Qué hacer si un objeto está clavado en el ojo?', opts: ['Sacarlo con cuidado', 'Tapar los DOS ojos y no tocar el objeto', 'Lavar con chorro de agua fuerte'], a: 'Tapar los DOS ojos y no tocar el objeto', expl: 'Se tapan los dos para que el ojo herido no se mueva (movimiento conjugado) al mirar con el otro.', cat: 'environ' },
    { q: 'Prioridad de paso en emergencias', opts: ['Llamar al 112', 'Auto-protección (PAS)', 'Revisar pulso'], a: 'Auto-protección (PAS)', expl: 'Si no estás a salvo, no puedes ayudar.', cat: 'pas' },
    { q: '¿Qué es la Maniobra de Rautek?', opts: ['Para desatragantar', 'Para extraer víctimas de un vehículo en peligro', 'Para curar quemaduras'], a: 'Para extraer víctimas de un vehículo en peligro', expl: 'Es una técnica para mover a alguien inconsciente protegiendo su eje cabeza-cuello-tronco.', cat: 'trauma' },
    { q: 'Vendaje en espiral, ¿hacia dónde se venda?', opts: ['De arriba hacia abajo', 'De la parte más distal (lejos) a la proximal (cerca)', 'Da igual'], a: 'De la parte más distal (lejos) a la proximal (cerca)', expl: 'Esto favorece el retorno venoso hacia el corazón.', cat: 'trauma' },
    { q: 'En una quemadura química (ácido), ¿qué hacer?', opts: ['Echar vinagre para neutralizar', 'Lavar con agua abundante 20-30 min', 'Tapar con algodón'], a: 'Lavar con agua abundante 20-30 min', expl: 'El agua arrastra el químico. Neutralizar con otros químicos puede generar calor.', cat: 'environ' },
    { q: '¿Qué es una lipotimia?', opts: ['Un paro cardíaco', 'Un desmayo breve por falta de sangre en el cerebro', 'Una fractura de cadera'], a: 'Un desmayo breve por falta de sangre en el cerebro', expl: 'Es transitorio y se suele recuperar elevando las piernas.', cat: 'enfermedad' },
    { q: 'RCP en embarazadas, ¿algún cambio?', opts: ['No se hace RCP', 'Desplazar el útero a la izquierda durante las compresiones', 'Comprimir en el abdomen'], a: 'Desplazar el útero a la izquierda durante las compresiones', expl: 'Esto evita que el útero presione la vena cava y permita el retorno de sangre.', cat: 'rcp' },
    { q: 'Hemorragia interna sospechosa (golpe fuerte abdomen)', opts: ['Dar masaje', 'Colocar en posición antishock (piernas arriba) y 112', 'Dar de beber'], a: 'Colocar en posición antishock (piernas arriba) y 112', expl: 'Las hemorragias internas son emergencias críticas invisibles.', cat: 'hemorragia' },
    { q: '¿Qué significa el color NEGRO en triaje?', opts: ['Prioridad absoluta', 'Fallecido o sin esperanza de vida bajo los medios actuales', 'Herido leve'], a: 'Fallecido o sin esperanza de vida bajo los medios actuales', expl: 'En catástrofes, se priorizan recursos para los que tienen posibilidad de sobrevivir.', cat: 'environ' },
    { q: '¿Qué hacer ante una sospecha de intoxicación por pastillas?', opts: ['Provocar el vómito siempre', 'Llevar la caja de pastillas al médico y no provocar vómito sin indicación', 'Dar leche'], a: 'Llevar la caja de pastillas al médico y no provocar vómito sin indicación', expl: 'Algunos tóxicos queman al subir si se vomita. La caja ayuda a identificar el antídoto.', cat: 'environ' },
    { q: 'Signo de "muerte clínica"', opts: ['Cese de respiración y latido', 'Estar muy pálido', 'Tener frío'], a: 'Cese de respiración y latido', expl: 'Es el momento en que se debe iniciar RCP para evitar la muerte biológica.', cat: 'rcp' },
    { q: '¿Se puede usar el DESA si llueve?', opts: ['Sí, siempre que el pecho de la víctima esté seco', 'No, nunca', 'Solo si hay un paraguas'], a: 'Sí, siempre que el pecho de la víctima esté seco', expl: 'Debes secar el tórax rápidamente. No importa si el suelo está húmedo (el parche es bipolar).', cat: 'rcp' },
    { q: '¿Qué es la "Cadena de Supervivencia"?', opts: ['Un tipo de nudo', 'Pasos para aumentar la supervivencia en paro cardíaco', 'Una medalla'], a: 'Pasos para aumentar la supervivencia en paro cardíaco', expl: 'Aviso precoz, RCP precoz, Desfibrilación precoz y Soporte vital avanzado.', cat: 'rcp' },
    { q: '¿Cuántas ventilaciones se dan en un niño después de 30 compresiones?', opts: ['2 ventilaciones', '5 ventilaciones', 'Ninguna'], a: '2 ventilaciones', expl: 'Aunque se empiece con 5 de rescate, el ciclo se mantiene 30:2 (o 15:2 si son 2 reanimadores).', cat: 'rcp' },
    { q: 'Hipotermia: ¿Cómo calentar?', opts: ['Frotar manos y pies fuerte', 'Calentar el tronco gradualmente con mantas', 'Meter en agua ardiendo'], a: 'Calentar el tronco gradualmente con mantas', expl: 'Calentar extremidades primero puede enviar sangre fría al corazón y pararlo.', cat: 'environ' },
    { q: 'Vendaje demasiado apretado, ¿qué ocurre?', opts: ['Sana antes', 'Compresión nerviosa y falta de riego (dedos azules)', 'Nada'], a: 'Compresión nerviosa y falta de riego (dedos azules)', expl: 'Vigila siempre el color y temperatura de los dedos tras vendar.', cat: 'trauma' },
    { q: '¿Qué hacer ante una herida por arma blanca clavada?', opts: ['Quitar el arma rápido', 'Fijar el arma para que no se mueva', 'Limpiar con alcohol'], a: 'Fijar el arma para que no se mueva', expl: 'El objeto clavado hace efecto "tapón". Si lo quitas, la hemorragia será masiva.', cat: 'hemorragia' },
    { q: 'Insolación: ¿Bebida fría o natural?', opts: ['Helada', 'Natural a sorbos pequeños (si está consciente)', 'No beber'], a: 'Natural a sorbos pequeños (si está consciente)', expl: 'Cantidades pequeñas para evitar vómitos. Temperatura ambiente es mejor.', cat: 'environ' },
    { q: '¿Qué es el socorrismo?', opts: ['Una profesión deportiva', 'El deber moral y legal de prestar ayuda', 'Saber nadar'], a: 'El deber moral y legal de prestar ayuda', expl: 'Es la primera asistencia que recibe una víctima.', cat: 'pas' },
    { q: '¿Qué hacer si un diabético está agresivo y confuso?', opts: ['Llamar a la policía', 'Darle algo dulce (posible hipoglucemia)', 'Ignorarlo'], a: 'Darle algo dulce (posible hipoglucemia)', expl: 'La falta de azúcar en el cerebro altera el comportamiento.', cat: 'enfermedad' },
    { q: '¿Qué es la Epistaxis?', opts: ['Sangrado de oído', 'Sangrado de nariz', 'Dificultad para tragar'], a: 'Sangrado de nariz', expl: 'Proviene del griego "goteo" sanguíneo por la nariz.', cat: 'enfermedad' },
    { q: 'Obstrucción de vía aérea por lengua', opts: ['Sacar la lengua con pinzas', 'Maniobra Frente-Mentón', 'Dar golpes en el cuello'], a: 'Maniobra Frente-Mentón', expl: 'Extender el cuello eleva la base de la lengua y despeja la garganta.', cat: 'atragantamiento' },
    { q: '¿Qué hacer ante un esguince?', opts: ['Mover el tobillo para ver si duele', 'Frío, Elevación y Reposo', 'Poner pomada de calor'], a: 'Frío, Elevación y Reposo', expl: 'El acrónimo RICE (Ice en inglés) es la base inicial.', cat: 'trauma' },
    { q: '¿Cómo actuar ante un ataque de pánico?', opts: ['Gritar "¡Cálmate!"', 'Pedir que respire al mismo ritmo que tú (lento)', 'Darle una bofetada'], a: 'Pedir que respire al mismo ritmo que tú (lento)', expl: 'El acompañamiento y la sincronización respiratoria calman el sistema nervioso.', cat: 'enfermedad' },
    { q: 'Hemorragia en el cuello, ¿cómo comprimir?', opts: ['Rodeando el cuello con una venda', 'Presión local con la mano (sin rodear)', 'No tocar'], a: 'Presión local con la mano (sin rodear)', expl: 'Rodear el cuello podría asfixiar a la víctima o cortar el riego al cerebro.', cat: 'hemorragia' },
    { q: 'Botiquín: ¿Es bueno tener alcohol para las heridas?', opts: ['Sí, desinfecta', 'No, quema los bordes y retrasa la cura', 'Solo para quemaduras'], a: 'No, quema los bordes y retrasa la cura', expl: 'Usa clorhexidina o povidona yodada en su lugar.', cat: 'pas' },
    { q: '¿Qué es un Desfibrilador Semiautomático (DESA)?', opts: ['Uno que hace RCP solo', 'Uno que analiza el ritmo y te pide pulsar el botón de descarga', 'Un aparato para ver el pulso'], a: 'Uno que analiza el ritmo y te pide pulsar el botón de descarga', expl: 'A diferencia del automático, requiere que el usuario confirme la descarga.', cat: 'rcp' },
    { q: 'Otorragia (sangre por el oído) tras golpe', opts: ['Taponar el oído con algodón', 'No taponar y poner de lado sobre el oído que sangra', 'Limpiar con agua'], a: 'No taponar y poner de lado sobre el oído que sangra', expl: 'Si taponas, aumentas la presión craneal. Dejar salir la sangre es más seguro.', cat: 'trauma' },
    { q: '¿Cómo se llama la posición de piernas elevadas?', opts: ['Posición de Fowler', 'Posición de Trendelenburg', 'Posición de Sims'], a: 'Posición de Trendelenburg', expl: 'Se usa para favorecer el riego cerebral en desmayos.', cat: 'enfermedad' },
    { q: '¿Qué hacer si un niño se traga un objeto pequeño pero respira?', opts: ['Hacerle el Heimlich', 'Llevar a urgencias sin intentar sacarlo uno mismo', 'Darle de comer miga de pan'], a: 'Llevar a urgencias sin intentar sacarlo uno mismo', expl: 'Si no hay obstrucción total, intentar sacarlo puede empujarlo y bloquear la vía aérea.', cat: 'atragantamiento' },
    { q: 'Distancia para colocar triángulos de emergencia', opts: ['10 metros', '50 metros', '200 metros'], a: '50 metros', expl: 'Deben ser visibles al menos desde 100 metros de distancia.', cat: 'pas' },
    { q: '¿Qué hacer ante una herida punzante con un clavo oxidado?', opts: ['Lavar e ir al médico para vacuna del Tétanos', 'Solo lavar', 'Poner una tirita'], a: 'Lavar e ir al médico para vacuna del Tétanos', expl: 'El tétanos es una enfermedad grave que entra por heridas sucias o profundas.', cat: 'environ' },
    { q: '¿Qué es la "Hora de Oro"?', opts: ['La hora de comer', 'El tiempo crítico tras un accidente donde la atención médica salva vidas', 'Un premio'], a: 'El tiempo crítico tras un accidente donde la atención médica salva vidas', expl: 'Las posibilidades de supervivencia caen drásticamente después de 60 minutos.', cat: 'pas' },
    { q: 'Compresiones torácicas: ¿Brazos doblados o rectos?', opts: ['Doblados', 'Rectos aprovechando el peso del cuerpo', 'Da igual'], a: 'Rectos aprovechando el peso del cuerpo', expl: 'Doblar los codos cansa rápido y la presión no es vertical.', cat: 'rcp' },
    { q: '¿Qué hacer si el DESA dice "No se recomienda descarga"?', opts: ['Apagarlo', 'Continuar con la RCP 30:2 inmediatamente', 'Retirar los parches'], a: 'Continuar con la RCP 30:2 inmediatamente', expl: 'El DESA volverá a analizar en 2 minutos. No pares la RCP.', cat: 'rcp' },
    { q: '¿Cómo reconocer una hemorragia arterial?', opts: ['Rojo oscuro y sale despacio', 'Rojo brillante y sale a chorros rítmicos', 'Solo gotea'], a: 'Rojo brillante y sale a chorros rítmicos', expl: 'La sangre arterial sale a presión pulsátil por el latido del corazón.', cat: 'hemorragia' },
    { q: '¿Qué hacer ante una picadura de medusa?', opts: ['Lavar con agua dulce', 'Lavar con agua de mar y quitar restos con pinzas o tarjeta', 'Echar arena caliente'], a: 'Lavar con agua de mar y quitar restos con pinzas o tarjeta', expl: 'El agua dulce activa las células urticantes (nematocistos) que no han explotado.', cat: 'environ' },
    { q: '¿Qué hacer ante un golpe en el ojo con un balón?', opts: ['Hielo directo', 'Compresa fría sin presionar y revisión médica', 'Echar colirio'], a: 'Compresa fría sin presionar y revisión médica', expl: 'Puede haber lesiones internas de retina aunque no se vea sangre.', cat: 'trauma' },
    { q: 'Sujeto inconsciente que "ronca" o respira muy mal', opts: ['Está durmiendo', 'Es una respiración agónica, tratar como parada cardíaca (RCP)', 'Poner la radio'], a: 'Es una respiración agónica, tratar como parada cardíaca (RCP)', expl: 'El "gasping" no es respirar. Es un signo de muerte inminente.', cat: 'rcp' },
    { q: 'Vaso roto por corte de cristal: ¿Prioridad?', opts: ['Llamar familiar', 'Presión directa sobre el corte', 'Limpiar el suelo'], a: 'Presión directa sobre el corte', expl: 'Detener la pérdida de sangre es vital.', cat: 'hemorragia' },
    // BLOQUE FINAL (HASTA 200 PREGUNTAS)
    { q: '¿Qué es la "Omisión del deber de socorro"?', opts: ['No saber hacer RCP', 'Un delito por no ayudar o pedir ayuda si alguien está en peligro', 'Un seguro médico'], a: 'Un delito por no ayudar o pedir ayuda si alguien está en peligro', expl: 'La ley obliga a ayudar o llamar al 112 si no sabemos cómo actuar.', cat: 'pas' },
    { q: '¿Cómo actuar ante un parto inminente?', opts: ['Intentar frenarlo', 'Poner a la madre en un lugar limpio, tranquilo y dejar que ocurra naturalmente', 'Tirar del bebé'], a: 'Poner a la madre en un lugar limpio, tranquilo y dejar que ocurra naturalmente', expl: 'El parto es un proceso natural. Tu labor es Higiene, Calma y Apoyo.', cat: 'enfermedad' },
    { q: '¿Se debe lavar una quemadura con leche?', opts: ['Sí, alivia', 'No, nunca. Solo agua fresca', 'Si es de sol sí'], a: 'No, nunca. Solo agua fresca', expl: 'La leche puede causar infecciones. El agua es lo único seguro.', cat: 'environ' },
    { q: 'Persona con dolor de pecho que se va al brazo izquierdo: ¿Sospecha?', opts: ['Gases', 'Infarto agudo de miocardio', 'Esguince'], a: 'Infarto agudo de miocardio', expl: 'El dolor irradiado al brazo, cuello o mandíbula es un signo clásico.', cat: 'enfermedad' },
    { q: '¿Qué es el Signo de Battle (hematoma tras oreja)?', opts: ['Para RCP', 'Indica fractura de base de cráneo', 'Para vendar'], a: 'Indica fractura de base de cráneo', expl: 'Es un signo médico (Equimosis mastoidea) tras traumatismos graves.', cat: 'trauma' },
    { q: '¿Qué hacer si un químico salta a la piel?', opts: ['Poner vinagre', 'Lavar con agua corriente al menos 20 min', 'Echar polvos'], a: 'Lavar con agua corriente al menos 20 min', expl: 'El agua diluye y elimina el químico por arrastre.', cat: 'environ' },
    { q: 'Si una persona se ha ahorcado, ¿primer paso?', opts: ['Llamar al 112', 'Sostener su cuerpo y cortar la ligadura rápido', 'Hacer fotos'], a: 'Sostener su cuerpo y cortar la ligadura rápido', expl: 'La falta de aire mata en pocos minutos. Hay que bajar a la víctima inmediatamente.', cat: 'atragantamiento' },
    { q: '¿Cómo reconocer un choque (shock) hipovolémico?', opts: ['Pulso lento y fuerte', 'Pulso rápido, débil y piel fría/sudorosa', 'Mucha hambre'], a: 'Pulso rápido, débil y piel fría/sudorosa', expl: 'El cuerpo intenta compensar la falta de sangre acelerando el motor.', cat: 'hemorragia' },
    { q: '¿Qué hacer ante una mordedura de serpiente?', opts: ['Hacer un corte y chupar el veneno', 'Inmovilizar, tranquilizar e ir a urgencias', 'Poner un torniquete'], a: 'Inmovilizar, tranquilizar e ir a urgencias', expl: 'Chupar el veneno o hacer cortes aumenta el daño y la infección.', cat: 'environ' },
    { q: '¿Se puede usar el DESA en un niño de 4 años?', opts: ['No, solo adultos', 'Sí, preferiblemente con parches pediátricos (o modo niño)', 'Solo si respira'], a: 'Sí, preferiblemente con parches pediátricos (o modo niño)', expl: 'El DESA es seguro en niños; si no hay parches de niño, pueden usarse los de adulto.', cat: 'rcp' },
    { q: '¿Qué hacer si alguien se atraganta con un caramelo y tose?', opts: ['Golpes en la espalda', 'Animar a toser fuerte', 'Meter los dedos'], a: 'Animar a toser fuerte', expl: 'Si tose, el objeto se está moviendo. Los golpes podrían encajarlo más.', cat: 'atragantamiento' },
    { q: '¿Qué es la "Muerte Encefálica"?', opts: ['Estar inconsciente', 'Cese irreversible de todas las funciones cerebrales', 'Dormir profundo'], a: 'Cese irreversible de todas las funciones cerebrales', expl: 'Es el criterio legal de fallecimiento aunque el corazón lata artificialmente.', cat: 'pas' },
    { q: '¿Cómo tratar una ampolla por quemadura solar?', opts: ['Explotarla con una aguja', 'No tocarla y cubrir con gasa estéril si hay riesgo de roce', 'Echar alcohol'], a: 'No tocarla y cubrir con gasa estéril si hay riesgo de roce', expl: 'El líquido de la ampolla es un apósito natural que evita infecciones.', cat: 'environ' },
    { q: '¿Cuál es la frecuencia de compresiones en un niño (1 reanimador)?', opts: ['15 compresiones : 2 ventilaciones', '30 compresiones : 2 ventilaciones', 'Solo compresiones'], a: '30 compresiones : 2 ventilaciones', expl: 'Si estás solo, el ritmo es igual que en adultos (30:2).', cat: 'rcp' },
    { q: '¿Qué es el síncope?', opts: ['Un paro cardíaco', 'Una pérdida de conocimiento súbita y completa con recuperación rápida', 'Un tipo de venda'], a: 'Una pérdida de conocimiento súbita y completa con recuperación rápida', expl: 'Es lo mismo que un desmayo.', cat: 'enfermedad' },
    { q: 'En un accidente de tráfico, ¿a quién atiendes el último?', opts: ['El que no grita ni se mueve', 'El que grita mucho', 'El que tiene un corte leve'], a: 'El que tiene un corte leve', expl: 'Primero se atiende a los críticos salvables (rojos), luego urgentes (amarillos) y por último leves (verdes).', cat: 'pas' },
    { q: '¿Qué hacer si una persona convulsiona por epilepsia?', opts: ['Ponerle un palo en la boca', 'Quitar objetos cercanos con los que pueda golpearse', 'Sujetarle los brazos'], a: 'Quitar objetos cercanos con los que pueda golpearse', expl: 'Tu objetivo es evitar que se lesione durante los movimientos involuntarios.', cat: 'enfermedad' },
    { q: '¿Cómo mover a una persona si sospechas lesión de cuello?', opts: ['Tirando de los pies', 'En bloque (varios socorristas manteniendo el eje recto)', 'No se puede mover'], a: 'En bloque (varios socorristas manteniendo el eje recto)', expl: 'Si hay peligro vital (fuego), muévelo como si fuera un tronco rígido.', cat: 'trauma' },
    { q: '¿Qué es el "Reflejo de Babinski"?', opts: ['Un tipo de RCP', 'Una respuesta del pie que indica daño neurológico en adultos', 'Curar una quemadura'], a: 'Una respuesta del pie que indica daño neurológico en adultos', expl: 'Es normal en bebés, pero anormal en adultos tras un golpe en la cabeza.', cat: 'trauma' },
    { q: '¿Qué hacer ante una intoxicación por lejía?', opts: ['Beber leche o agua', 'No provocar el vómito y llamar al 112', 'Vomitar rápido'], a: 'No provocar el vómito y llamar al 112', expl: 'Los corrosivos queman al bajar y volverían a quemar al subir si se vomita.', cat: 'environ' },
    { q: '¿Cómo reconocer una fractura de cadera?', opts: ['La pierna parece más larga', 'La pierna está acortada y hacia afuera', 'No duele'], a: 'La pierna está acortada y hacia afuera', expl: 'Es la posición típica por la tracción muscular tras la rotura.', cat: 'trauma' },
    { q: 'Persona encontrada en la nieve inconsciente: ¿Prioridad?', opts: ['Darle alcohol para calentar', 'Secar, poner mantas y buscar signos de vida (RCP si no hay)', 'Frotar la piel'], a: 'Secar, poner mantas y buscar signos de vida (RCP si no hay)', expl: 'El alcohol baja más la temperatura real del cuerpo aunque dé calor subjetivo.', cat: 'rcp' },
    { q: '¿Qué es la "Triada de la Muerte" en trauma?', opts: ['Fuego, Agua, Aire', 'Acidosis, Hipotermia y Coagulopatía', 'No respirar, no pulso, no consciencia'], a: 'Acidosis, Hipotermia y Coagulopatía', expl: 'Son tres factores que se retroalimentan y matan a la víctima de trauma si no se controlan.', cat: 'trauma' },
    { q: '¿Qué hacer si un objeto está clavado en el abdomen?', opts: ['Sacarlo rápido', 'Fijarlo y no dejar que se mueva', 'Lavar el objeto'], a: 'Fijarlo y no dejar que se mueva', expl: 'Al igual que en otras zonas, sacarlo puede provocar una hemorragia incontrolable.', cat: 'trauma' },
    { q: '¿Cómo saber si un vendaje está muy apretado?', opts: ['Si el paciente tiene calor', 'Si los dedos se ponen fríos, azulados o con hormigueo', 'Si se cae'], a: 'Si los dedos se ponen fríos, azulados o con hormigueo', expl: 'Indica falta de riego sanguíneo.', cat: 'trauma' },
    { q: '¿Qué son los "Ojos de Mapache"?', opts: ['Una alergia', 'Hematomas alrededor de los ojos tras golpe en cabeza (posible fractura de cráneo)', 'Cansancio'], a: 'Hematomas alrededor de los ojos tras golpe en cabeza (posible fractura de cráneo)', expl: 'Es signo de fractura en la base del cráneo.', cat: 'trauma' },
    { q: '¿Se puede dar comida a alguien que ha sufrido un accidente grave?', opts: ['Sí, para que tenga energía', 'NUNCA, por si requiere cirugía urgente', 'Solo pan'], a: 'NUNCA, por si requiere cirugía urgente', expl: 'El estómago debe estar vacío para la anestesia en una posible operación.', cat: 'pas' },
    { q: '¿Qué es la "Posición Antálgica"?', opts: ['La que adopta la víctima para sentir menos dolor', 'Ponerse boca abajo', 'Estar de pie'], a: 'La que adopta la víctima para sentir menos dolor', expl: 'Respeta esa posición si no es peligrosa, ya que el cuerpo de la víctima sabe cómo protegerse.', cat: 'trauma' },
    { q: '¿Cómo actuar ante un pinchazo con aguja usada en la calle?', opts: ['Lavar con agua y jabón e ir al hospital para análisis', 'No hacer nada', 'Poner alcohol'], a: 'Lavar con agua y jabón e ir al hospital para análisis', expl: 'Hay riesgo de transmisión de enfermedades (VIH, Hepatitis).', cat: 'pas' },
    { q: '¿Qué hacer si una persona tiene un infarto y deja de respirar?', opts: ['Llamar al 112 y empezar RCP', 'Esperar a la ambulancia', 'Sentarlo'], a: 'Llamar al 112 y empezar RCP', expl: 'Cada segundo sin RCP disminuye las posibilidades de vida un 10%.', cat: 'rcp' },
    { q: '¿Qué es el DESA?', opts: ['Aparato para respirar', 'Desfibrilador Externo Semiautomático', 'Un tipo de camilla'], a: 'Desfibrilador Externo Semiautomático', expl: 'Dispositivo que puede salvar vidas en paradas por fibrilación.', cat: 'rcp' },
    { q: '¿Cómo reconocer un Ictus?', opts: ['Dolor de estómago', 'Boca torcida, dificultad al hablar, pérdida de fuerza en un brazo', 'Fiebre'], a: 'Boca torcida, dificultad al hablar, pérdida de fuerza en un brazo', expl: 'Recordamos TEST: Cara, Brazo, Habla, Tiempo.', cat: 'enfermedad' },
    { q: '¿Qué es el torniquete?', opts: ['Una venda suave', 'Dispositivo para comprimir una arteria y detener hemorragia masiva', 'Un tipo de nudo'], a: 'Dispositivo para comprimir una arteria y detener hemorragia masiva', expl: 'Se usa solo en hemorragias incontrolables en extremidades.', cat: 'hemorragia' },
    { q: '¿Qué hacer si alguien se quema con aceite hirviendo?', opts: ['Poner mantequilla', 'Lavar con agua fría 10-15 minutos', 'Tapar con una manta'], a: 'Lavar con agua fría 10-15 minutos', expl: 'El agua detiene la progresión del calor en la piel.', cat: 'environ' },
    { q: '¿Qué es la Reacción Vagovagal?', opts: ['Un infarto', 'Un desmayo por bajada de tensión (miedo, calor, visión de sangre)', 'Un ataque de ira'], a: 'Un desmayo por bajada de tensión (miedo, calor, visión de sangre)', expl: 'Es la causa más común de lipotimias.', cat: 'enfermedad' },
    { q: '¿Cómo actuar ante un atragantamiento por objeto circular (ej: moneda)?', opts: ['Meter el dedo para sacarlo', 'Maniobra de Heimlich', 'Poner boca abajo'], a: 'Maniobra de Heimlich', expl: 'La presión del aire de los pulmones expulsará el objeto.', cat: 'atragantamiento' },
    { q: '¿Qué hacer si una persona tiene un corte que sangra mucho en la pierna?', opts: ['Poner hielo', 'Presión directa con gasas o paño limpio', 'Dejar al aire'], a: 'Presión directa con gasas o paño limpio', expl: 'La presión es el método más efectivo para detener la sangre.', cat: 'hemorragia' },
    { q: '¿Qué es la fractura en tallo verde?', opts: ['Huesos de plantas', 'Fractura incompleta común en niños (el hueso se dobla)', 'Un tipo de golpe'], a: 'Fractura incompleta común en niños (el hueso se dobla)', expl: 'Los huesos de los niños son más flexibles y no rompen del todo.', cat: 'trauma' },
    { q: '¿Qué hacer ante una hemorragia por el oído?', opts: ['Taponar con gasa', 'Poner de lado sobre el lado que sangra y no taponar', 'Lavar con agua'], a: 'Poner de lado sobre el lado que sangra y no taponar', expl: 'Puede indicar fractura de cráneo; taponar aumentaría la presión cerebral.', cat: 'trauma' },
    { q: '¿Qué es el Pulso?', opts: ['La respiración', 'La onda de presión de la sangre al ser bombeada por el corazón', 'Un dolor de cabeza'], a: 'La onda de presión de la sangre al ser bombeada por el corazón', expl: 'Es la medida rítmica de la actividad cardiaca.', cat: 'pas' },
    { q: '¿Cuál es la profundidad de RCP en adultos?', opts: ['2 cm', 'Entre 5 y 6 cm', '10 cm'], a: 'Entre 5 y 6 cm', expl: 'Es la profundidad necesaria para que el masaje sea eficaz.', cat: 'rcp' },
    { q: '¿Qué hacer si una persona consciente se atraganta y no puede hablar?', opts: ['Darle agua', 'Realizar la maniobra de Heimlich', 'Esperar'], a: 'Realizar la maniobra de Heimlich', expl: 'Si no puede hablar ni toser, la obstrucción es total.', cat: 'atragantamiento' },
    { q: '¿Cómo tratar una hemorragia de nariz?', opts: ['Echar cabeza atrás', 'Pinzar la nariz e inclinar cabeza adelante', 'Acostarse'], a: 'Pinzar la nariz e inclinar cabeza adelante', expl: 'Evita tragar sangre y facilita la coagulación.', cat: 'hemorragia' },
    { q: '¿Qué hacer ante la presencia de un rayo?', opts: ['Ponerse bajo un árbol', 'Ponerse en posición de cuclillas con pies juntos lejos de metal', 'Correr'], a: 'Ponerse en posición de cuclillas con pies juntos lejos de metal', expl: 'Minimizas tu altura y los puntos de contacto con el suelo.', cat: 'environ' },
    { q: 'Señal de Fractura de Clavícula', opts: ['Hombro caído y brazo sujetado por el otro', 'Dolor de espalda', 'Hipo'], a: 'Hombro caído y brazo sujetado por el otro', expl: 'El paciente suele adoptar esta posición para aliviar el dolor.', cat: 'trauma' },
    { q: '¿Qué es la Escala de Glasgow?', opts: ['Para medir el peso', 'Mide el nivel de consciencia (3 a 15)', 'Para medir la vista'], a: 'Mide el nivel de consciencia (3 a 15)', expl: 'Valora respuesta ocular, verbal y motora.', cat: 'pas' },
    { q: '¿Cómo actuar ante un náufrago con hipotermia?', opts: ['Darle café muy caliente', 'Cambiar ropa mojada por seca y calentar suavemente', 'Hacerle correr'], a: 'Cambiar ropa mojada por seca y calentar suavemente', expl: 'El calentamiento debe ser gradual para no dañar el sistema circulatorio.', cat: 'environ' },
    { q: '¿Qué hacer si la víctima de accidente tiene frío intenso?', opts: ['Encender una estufa cerca', 'Tapar con manta térmica o ropa', 'No hacer nada'], a: 'Tapar con manta térmica o ropa', expl: 'Mantener la temperatura corporal es crucial para la supervivencia.', cat: 'pas' },
    { q: 'Signo de "Muñeca en péndulo"', opts: ['Lesión de nervio por fractura', 'Un juego', 'Cansancio'], a: 'Lesión de nervio por fractura', expl: 'La pérdida de control motor indica daño en nervios cercanos a la fractura.', cat: 'trauma' },
    { q: '¿Qué hacer en caso de ataque de asma si no hay medicación?', opts: ['Hacerle correr para abrir pulmones', 'Llamar al 112, tranquilizar y posición sentada', 'Darle de comer'], a: 'Llamar al 112, tranquilizar y posición sentada', expl: 'La posición sentada ayuda a usar los músculos accesorios de la respiración.', cat: 'enfermedad' },
    { q: '¿Cómo se cura una herida por roce?', opts: ['Limpiar con agua y jabón y dejar al aire si no sangra mucho', 'Tapar con barro', 'No tocar'], a: 'Limpiar con agua y jabón y dejar al aire si no sangra mucho', expl: 'La limpieza previene la infección, que es el mayor riesgo en roces.', cat: 'pas' },
    { q: '¿Qué hacer si alguien respira veneno (gas)?', opts: ['Echar agua en la cara', 'Sacar a la víctima al aire libre y llamar al 112', 'Vomitar'], a: 'Sacar a la víctima al aire libre y llamar al 112', expl: 'La prioridad es alejar de la fuente tóxica.', cat: 'environ' },
    { q: 'Diferencia entre Urgencia y Emergencia', opts: ['Son lo mismo', 'En la emergencia hay riesgo vital inmediato', 'La urgencia es más grave'], a: 'En la emergencia hay riesgo vital inmediato', expl: 'La emergencia requiere actuación en pocos minutos para salvar la vida.', cat: 'pas' },
    { q: '¿Qué hacer ante una quemadura eléctrica?', opts: ['Echar pomada', 'Ir al hospital aunque no parezca grave (daños internos)', 'Lavar'], a: 'Ir al hospital aunque no parezca grave (daños internos)', expl: 'La electricidad daña órganos internos (corazón, riñones) aunque la piel parezca bien.', cat: 'environ' },
    { q: '¿Cómo actuar ante una herida en la cabeza?', opts: ['Presionar con gasas y vendar', 'Lavar con mucho alcohol', 'Mover mucho la cabeza'], a: 'Presionar con gasas y vendar', expl: 'Las heridas en la cabeza sangran mucho; la presión es fundamental.', cat: 'hemorragia' },
    { q: '¿Qué hacer si sospechas lesión de cuello en un bañista?', opts: ['Sacarlo rápido del pelo', 'Mantener en flotación con cabeza alineada hasta ayuda', 'Hacerle nadar'], a: 'Mantener en flotación con cabeza alineada hasta ayuda', expl: 'El agua ayuda a mantener el peso, pero el eje cuello-columna debe estar recto.', cat: 'trauma' },
    { q: '¿Qué es la "Muerte Súbita"?', opts: ['Quedarse dormido', 'Paro cardíaco inesperado en persona aparentemente sana', 'Un desmayo'], a: 'Paro cardíaco inesperado en persona aparentemente sana', expl: 'Suele deberse a una arritmia maligna.', cat: 'rcp' },
    { q: '¿Cómo tratar un golpe fuerte en la espalda?', opts: ['Dar masaje', 'Inmovilizar y vigilar sensibilidad en piernas', 'Caminar'], a: 'Inmovilizar y vigilar sensibilidad en piernas', expl: 'Cualquier hormigueo o pérdida de fuerza indica daño en la médula.', cat: 'trauma' },
    { q: '¿Qué hacer si un niño tiene fiebre alta y no para de llorar?', opts: ['Darle un baño de agua fría', 'Consultar al médico y refrescar suavemente', 'Esperar al día siguiente'], a: 'Consultar al médico y refrescar suavemente', expl: 'El agua tibia es mejor que la fría para evitar shocks térmicos.', cat: 'enfermedad' },
    { q: '¿Qué es el socorrista?', opts: ['Cualquier persona que ayuda en una emergencia', 'Solo los médicos', 'Los que llevan uniforme'], a: 'Cualquier persona que ayuda en una emergencia', expl: 'Eres tú en el momento en que decides actuar y ayudar.', cat: 'pas' },
    { q: 'Símbolo de la Cruz Roja', opts: ['Un círculo', 'Una cruz sobre fondo blanco', 'Un cuadrado'], a: 'Una cruz sobre fondo blanco', expl: 'Es el emblema internacional de protección médica.', cat: 'pas' },
    { q: '¿Qué hacer ante una crisis diabética si no sabes si es alta o baja?', opts: ['Dar insulina siempre', 'Dar un poco de azúcar (si está consciente)', 'No hacer nada'], a: 'Dar un poco de azúcar (si está consciente)', expl: 'Si es baja, el azúcar le salva. Si es alta, un poco más no le hará daño inmediato.', cat: 'enfermedad' },
    { q: '¿Qué hacer si alguien tiene un calambre muscular fuerte?', opts: ['Estirar el músculo suavemente en dirección contraria', 'Gritar al músculo', 'No tocar'], a: 'Estirar el músculo suavemente en dirección contraria', expl: 'El estiramiento pasivo alivia la contracción involuntaria.', cat: 'trauma' },
    { q: '¿Cómo identificar una hemorragia venosa?', opts: ['Sangre roja brillante a chorros', 'Sangre roja oscura que fluye de forma continua', 'Solo gotea'], a: 'Sangre roja oscura que fluye de forma continua', expl: 'La sangre venosa tiene menos presión y menos oxígeno.', cat: 'hemorragia' },
    { q: '¿Qué hacer si una persona ha caminado mucho y tiene ampollas?', opts: ['Explotarlas todas', 'Limpiar y proteger con apósito especial (segunda piel)', 'No hacer nada'], a: 'Limpiar y proteger con apósito especial (segunda piel)', expl: 'Evita el dolor y el riesgo de infección por roce.', cat: 'pas' },
    { q: '¿Qué es el Pulso Carotídeo?', opts: ['El de la muñeca', 'El que se toma en el cuello a los lados de la nuez', 'El del pie'], a: 'El que se toma en el cuello a los lados de la nuez', expl: 'Es el más fácil de encontrar en víctimas inconscientes.', cat: 'pas' },
    { q: '¿Qué hacer si una persona tiene una convulsión febril?', opts: ['Meterle agua helada', 'Tumbar de lado y refrescar con agua tibia', 'Sujetar fuerte'], a: 'Tumbar de lado y refrescar con agua tibia', expl: 'Las convulsiones febriles asustan pero suelen ser breves e inofensivas si se evita el golpe.', cat: 'enfermedad' },
    { q: '¿Se puede usar el móvil mientras atiendes?', opts: ['Para jugar', 'Para hablar con el 112 en manos libres', 'No se puede'], a: 'Para hablar con el 112 en manos libres', expl: 'El operador del 112 te guiará paso a paso mientras actúas.', cat: 'pas' },
    { q: '¿Cuál es la primera regla del socorrismo?', opts: ['Correr mucho', 'No causar más daño (No ser otra víctima)', 'Saber medicina'], a: 'No causar más daño (No ser otra víctima)', expl: '"Primum non nocere": primero, no dañar.', cat: 'pas' },
    { q: '¿Qué hacer si alguien tiene un objeto clavado en la mano?', opts: ['Retirarlo y poner alcohol', 'No retirarlo y vendar alrededor fijándolo', 'Lavar el objeto'], a: 'No retirarlo y vendar alrededor fijándolo', expl: 'El objeto clavado ayuda a controlar la hemorragia interna.', cat: 'hemorragia' },
    { q: '¿Cómo actuar ante un golpe en la nariz con sangre?', opts: ['Echar agua oxigenada', 'Presionar la nariz y cabeza hacia adelante', 'Poner algodón con fuerza'], a: 'Presionar la nariz y cabeza hacia adelante', expl: 'La presión directa sobre el tabique nasal corta la mayoría de sangrados.', cat: 'hemorragia' },
    { q: '¿Qué es la Reanimación Cardiopulmonar?', opts: ['RCP', 'Un tipo de carrera', 'Un masaje de espalda'], a: 'RCP', expl: 'Serie de maniobras para mantener la vida ante un paro.', cat: 'rcp' },
    { q: '¿Qué hacer si una persona se desmaya por calor?', opts: ['Llevar a la sombra y elevar piernas', 'Darle agua caliente', 'Dejarle al sol'], a: 'Llevar a la sombra y elevar piernas', expl: 'Ayuda a enfriar y recuperar la tensión arterial.', cat: 'enfermedad' },
    { q: '¿Se debe usar pasta de dientes en quemaduras?', opts: ['Sí, refresca', 'NUNCA, es un error común que infecta', 'Solo si no hay agua'], a: 'NUNCA, es un error común que infecta', expl: 'Usa solo agua corriente.', cat: 'environ' },
    { q: '¿Qué hacer si una persona tiene una descarga eléctrica y sigue pegada al cable?', opts: ['Tocarla para apartarla', 'Separar el cable con un objeto de madera o plástico (aislante)', 'Echar agua'], a: 'Separar el cable con un objeto de madera o plástico (aislante)', expl: 'Debes usar algo que no conduzca la electricidad para no electrocutarte.', cat: 'environ' },
    { q: '¿Qué es el Hematoma?', opts: ['Un tipo de sangre', 'Acumulación de sangre bajo la piel tras un golpe (moratón)', 'Una herida abierta'], a: 'Acumulación de sangre bajo la piel tras un golpe (moratón)', expl: 'Indica rotura de pequeños vasos sanguíneos sin rotura de piel.', cat: 'trauma' },
    { q: '¿Cómo actuar ante una luxación (hueso fuera de sitio)?', opts: ['Intentar colocar el hueso', 'Inmovilizar y llevar al médico', 'Mover para ver si encaja'], a: 'Inmovilizar y llevar al médico', expl: 'Colocarlo mal puede dañar nervios y arterias de forma permanente.', cat: 'trauma' },
    { q: '¿Qué hacer ante una intoxicación alimentaria?', opts: ['Dar laxantes', 'Hidratación y vigilar signos de alarma (deshidratación)', 'Comer mucho'], a: 'Hidratación y vigilar signos de alarma (deshidratación)', expl: 'Reponer líquidos es lo más importante en diarreas y vómitos.', cat: 'enfermedad' },
    { q: '¿Qué es la Vía Aérea?', opts: ['Un camino por el aire', 'El conducto por donde entra el aire a los pulmones', 'Una carretera'], a: 'El conducto por donde entra el aire a los pulmones', expl: 'Mantenerla despejada es la prioridad #1.', cat: 'atragantamiento' },
    { q: '¿Qué hacer si una persona inconsciente NO respira?', opts: ['Esperar 10 minutos', 'Llamar al 112 y realizar RCP inmediatamente', 'Ponerle una manta'], a: 'Llamar al 112 y realizar RCP inmediatamente', expl: 'La vida de la persona depende de tus manos en ese momento.', cat: 'rcp' },
    { q: '¿Qué es el triaje?', opts: ['Un tipo de vendaje', 'Sistema de clasificación de víctimas según gravedad', 'Una receta'], a: 'Sistema de clasificación de víctimas según gravedad', expl: 'Permite optimizar el orden de atención en catástrofes.', cat: 'pas' },
    { q: '¿Cómo reconocer una anafilaxia?', opts: ['Dolor de pies', 'Piel roja, hinchazón de cara y dificultad para respirar', 'Hambre'], a: 'Piel roja, hinchazón de cara y dificultad para respirar', expl: 'Requiere inyección de adrenalina urgente.', cat: 'enfermedad' },
    { q: '¿Qué hacer si una persona tiene un ataque de epilepsia en el agua?', opts: ['Dejarla', 'Sujetar la cabeza por encima del agua hasta que pase la crisis', 'Sacarla rápido tirando del cuello'], a: 'Sujetar la cabeza por encima del agua hasta que pase la crisis', expl: 'Evita el ahogamiento mientras dura la convulsión.', cat: 'enfermedad' },
    { q: '¿Qué hacer ante un gran incendio con humo?', opts: ['Caminar erguido', 'Ir a ras de suelo (donde hay más oxígeno)', 'Correr hacia arriba'], a: 'Ir a ras de suelo (donde hay más oxígeno)', expl: 'El humo sube; el aire más respirable está cerca del suelo.', cat: 'environ' },
    { q: '¿Cómo ayudar a una persona en silla de ruedas en una emergencia?', opts: ['Apartarla', 'Preguntar cómo prefiere ser ayudada antes de moverla', 'Llevarla a pulso rápido'], a: 'Preguntar cómo prefiere ser ayudada antes de moverla', expl: 'La persona conoce mejor su movilidad y equipo.', cat: 'pas' },
    { q: '¿Qué hacer ante una picadura de abeja si el aguijón está dentro?', opts: ['Retirar con pinzas apretando', 'Retirar rascando con una tarjeta de crédito o uña', 'Dejarlo'], a: 'Retirar rascando con una tarjeta de crédito o uña', expl: 'Al usar pinzas puedes apretar el saco de veneno y meter más tóxico.', cat: 'environ' },
    { q: '¿Qué es el botiquín?', opts: ['Una caja de herramientas', 'Conjunto de materiales necesarios para la primera atención', 'Una farmacia'], a: 'Conjunto de materiales necesarios para la primera atención', expl: 'Debe estar revisado y ser accesible.', cat: 'pas' },
    { q: '¿Qué hacer si te entra un químico en el ojo?', opts: ['Frotar fuerte', 'Lavar con agua abundante durante 20 minutos sin parar', 'Tapar el ojo'], a: 'Lavar con agua abundante durante 20 minutos sin parar', expl: 'El lavado continuo diluye el químico y lo saca del ojo.', cat: 'environ' },
    { q: '¿Qué hacer si una embarazada se atraganta?', opts: ['Maniobra de Heimlich normal en abdomen', 'Compresiones torácicas (en el centro del pecho)', 'Golpes en la barriga'], a: 'Compresiones torácicas (en el centro del pecho)', expl: 'Hay que evitar presionar el abdomen para no dañar al bebé.', cat: 'atragantamiento' },
    { q: '¿Cómo actuar ante un curioso grabando con el móvil?', opts: ['Quitarle el móvil', 'Pedirle que guarde el móvil y ayudar si puede o alejarse', 'Ponerse a grabar también'], a: 'Pedirle que guarde el móvil y ayudar si puede o alejarse', expl: 'Hay que respetar la privacidad y seguridad de la escena.', cat: 'pas' },
    { q: '¿Qué hacer si una persona dice que tiene "sed de aire"?', opts: ['Llamar al 112, está en insuficiencia respiratoria', 'Darle de beber', 'Hacerle soplar fuerte'], a: 'Llamar al 112, está en insuficiencia respiratoria', expl: 'Es una sensación subjetiva de ahogo grave.', cat: 'enfermedad' },
    { q: '¿Qué es un torniquete neumático?', opts: ['Uno manual', 'Uno que se infla como el manguito de tensión', 'Un tipo de zapato'], a: 'Uno que se infla como el manguito de tensión', expl: 'Permite un control más preciso de la presión sobre el brazo o pierna.', cat: 'hemorragia' },
    { q: '¿Cómo actuar ante una mordedura humana?', opts: ['Reírse', 'Lavar muy bien con agua y jabón y vigilar infección médica', 'No hacer nada'], a: 'Lavar muy bien con agua y jabón y vigilar infección médica', expl: 'La boca humana tiene muchas bacterias peligrosas.', cat: 'enfermedad' },
    { q: '¿Qué hacer si sospechas una hemorragia por el recto (sangre roja)?', opts: ['Dar laxante', 'Ir a urgencias para descartar hemorroides o daño interno', 'Dar agua'], a: 'Ir a urgencias para descartar hemorroides o daño interno', expl: 'Cualquier pérdida de sangre por orificios naturales debe valorarse.', cat: 'hemorragia' },
    { q: '¿Qué es el "Dedo en resorte" (o gatillo)?', opts: ['Un tipo de RCP', 'Cuando un dedo se queda bloqueado al doblar', 'Un dedo roto'], a: 'Cuando un dedo se queda bloqueado al doblar', expl: 'Es una inflamación de los tendones.', cat: 'trauma' },
    { q: '¿Qué hacer si una persona se corta con un cristal y un trozo queda dentro?', opts: ['Sacarlo con los dientes', 'No sacarlo y cubrir para que no se mueva', 'Lavar el cristal dentro'], a: 'No sacarlo y cubrir para que no se mueva', expl: 'Si lo sacas tú, podrías causar una hemorragia mayor.', cat: 'trauma' },
    { q: '¿Qué hacer ante una insolación?', opts: ['Dar agua fría a sorbos y poner en sitio fresco', 'Dar un café caliente', 'Correr'], a: 'Dar agua fría a sorbos y poner en sitio fresco', expl: 'Ayuda a rehidratar y bajar la temperatura corporal.', cat: 'environ' },
    { q: '¿Cómo saber si alguien está en coma?', opts: ['Si está muy dormido', 'Si no responde a estímulos dolorosos ni habla', 'Si ronca'], a: 'Si no responde a estímulos dolorosos ni habla', expl: 'Es un nivel de consciencia muy bajo que requiere atención vital.', cat: 'pas' },
    { q: '¿Qué hacer si una víctima dice que no quiere que la ayudes (pero está en peligro)?', opts: ['Ayudar a la fuerza', 'Llamar al 112 y quedarse cerca vigilando por si pierde el conocimiento', 'Irte'], a: 'Llamar al 112 y quedarse cerca vigilando por si pierde el conocimiento', expl: 'Si pierde el conocimiento o su juicio está alterado, el consentimiento es implícito.', cat: 'pas' },
    { q: '¿Qué es el corazón?', opts: ['Un órgano emocional', 'Un músculo que bombea sangre a todo el cuerpo', 'Una caja'], a: 'Un músculo que bombea sangre a todo el cuerpo', expl: 'Sin su bombeo la vida cesa en minutos.', cat: 'pas' },
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


