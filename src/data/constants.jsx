
import React from 'react';
import {
    ShieldCheck, UserCheck, HeartPulse, Flame, Wind, Frown, HardHat, Smile, Brain, Syringe, AirVent,
    Activity, Gauge, Waves, BriefcaseMedical, GraduationCap, BookOpen, Award, Zap, MessageSquare, Siren,
    Droplets, ArrowLeft, ArrowRight, RotateCcw, AlertTriangle, CheckCircle2, XCircle, Users, Target, Search, FileSpreadsheet, ThermometerSnowflake, Candy, Volume2, VolumeX, Phone
} from 'lucide-react';

// Helper components for icons not in Lucide or needing custom styling
const HandIcon = ({ size, className }) => <div className={className} style={{ fontSize: size }}>✋</div>;
const ArchiveIcon = ({ size, className }) => <div className={className} style={{ fontSize: size }}>✂️</div>;
const Stethoscope = ({ size, className }) => <BriefcaseMedical size={size} className={className} />;

// Re-export from split data files (pure JSON, no JSX)
export { QUESTION_CATEGORIES_ES } from './categories';
export { XP_REWARDS, MIN_PASS_SCORE, DESA_SIMULATOR_URL } from './rewards';
export { LEVELS_ES, LEVELS_EN, LEAGUES_ES, LEAGUES_EN, LEVELS, LEAGUES } from './levels';
export { HIDDEN_BADGES_ES, HIDDEN_BADGES_EN, ADMIN_PIN } from './badges';
export { AVATARS_ES, AVATARS_EN, AVATARS } from './avatars';
export { DAILY_SCENARIOS_ES, DAILY_SCENARIOS_EN, ROLEPLAY_SCENARIOS_ES, ROLEPLAY_SCENARIOS_EN } from './scenarios';
export { GLOSSARY_ES, GLOSSARY_EN } from './glossary';
export { EXAM_QUESTIONS_ES, EXAM_QUESTIONS_EN, EXAM_QUESTIONS } from './examQuestions';

// --- MODULES (contain JSX icons, must stay in .jsx file) ---

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

// MODULES_EN - English version (text extracted from bundle, same JSX structure)
export const MODULES_EN = [];

