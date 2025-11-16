import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo, // Importamos 'memo' para la optimización
} from 'react';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig'; // <-- AÑADE ESTA LÍNEA

// --- INICIO DE LA CORRECCIÓN ---
// Se añaden las importaciones de 'firebase/auth' que faltaban
import {
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
  signInAnonymously,
} from 'firebase/auth';
// --- FIN DE LA CORRECCIÓN ---
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  collection,
  setLogLevel,
} from 'firebase/firestore';
// ... (el resto de imports de lucide-react)

const app = initializeApp(firebaseConfig); // <-- YA PUEDES USAR firebaseConfig

// --- FIN DE LA CORRECCIÓN ---
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  getDocs,
  collection,
  setLogLevel,
} from 'firebase/firestore';
// ... (el resto de imports de lucide-react)
import {
  ShieldCheck,
  UserCheck,
  HeartPulse,
  Flame,
  ClipboardCheck,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  Droplets,
  Wind,
  Award,
  Volume2,
  Frown,
  HardHat,
  Smile,
  Brain,
  Syringe,
  AirVent,
  Activity,
  Gauge,
  Waves,
  BriefcaseMedical,
  LogIn,
  Users,
  Lock,
  RefreshCcw,
  GraduationCap,
  ExternalLink,
  Ear,
  Zap, // 1. Icono añadido
} from 'lucide-react';

// --- Configuración de Firebase ---
// (Sin cambios, pero agrupado para legibilidad)
let firebaseConfig;
let appId;

try {
  firebaseConfig =
    typeof __firebase_config !== 'undefined'
      ? JSON.parse(__firebase_config)
      : { apiKey: 'mock-key' };
  appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
} catch (e) {
  console.error('Error parsing Firebase config:', e);
  firebaseConfig = { apiKey: 'mock-key' };
  appId = 'default-app-id';
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Esta línea ahora funcionará
setLogLevel('debug');

// --- Constantes de la Aplicación ---
const DESA_SIMULATOR_URL = 'https://ogvapps.github.io/desa/'; // 2. Constante Global
const learningModuleIds = [
  'pas', 'pls', 'rcp', 'hemorragia', 'quemaduras', 'atragantamiento',
  'ansiedad', 'botiquin',
];
const moduleIds = [ // 3. ID del módulo añadido
  ...learningModuleIds,
  'examen', 
  'desa', // <-- Movido aquí
  'glosario',
  'certificado',
  // 'desa', // <-- Movido desde aquí
];
const totalLearningModules = learningModuleIds.length;
const MIN_PASS_SCORE = 32; 

const examQuestions = [
  // ... (40 preguntas omitidas por brevedad) ...
  {
    question: '1. ¿Cuál es el primer paso ineludible en el método PAS?',
    options: ['Avisar', 'Socorrer', 'Proteger'],
    answer: 'Proteger',
  },
  // ...
  {
    question: '40. Si un alumno diabético está consciente y se sospecha hipoglucemia (bajada de azúcar), ¿qué se debe dar inmediatamente?',
    options: ['Agua sin azúcar', '10-15g de azúcar de absorción rápida (zumo, terrones)', 'Una comida completa con proteínas'],
    answer: '10-15g de azúcar de absorción rápida (zumo, terrones)',
  },
];
const totalExamQuestions = examQuestions.length;

const iconComponents = {
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
  desa: <Zap size={48} className="text-yellow-600" />, // 4. Icono añadido a la lista
};

// --- Componente Principal ---
function App() {
  const [page, setPage] = useState('home');
  // ... (el resto de estados: currentModule, userId, progress, etc.)
  const [currentModule, setCurrentModule] = useState(null);
  const [userId, setUserId] = useState(null);
  const [progress, setProgress] = useState({});
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showDesaModal, setShowDesaModal] = useState(false);

  // --- 1. Autenticación y Carga de Datos del Perfil ---
  useEffect(() => {
    // --- (INICIO DE LA CORRECCIÓN) ---
    // El useEffect anterior estaba incompleto y causaba el error de sintaxis.
    // Esta es la versión completa y correcta de la lógica de autenticación y carga de datos.

    let unsubscribeProgress = () => {}; // Variable para la limpieza del listener de progreso

    // Escuchar cambios en el estado de autenticación
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // --- Usuario Autenticado ---
        console.log('Usuario autenticado:', user.uid);
        setUserId(user.uid);

        // 1. Cargar el perfil del usuario
        const profileDocRef = doc(
          db,
          'artifacts',
          appId,
          'users',
          user.uid,
          'profile',
          'main'
        );
        try {
          const profileSnap = await getDoc(profileDocRef);
          if (profileSnap.exists()) {
            console.log('Perfil encontrado:', profileSnap.data());
            setUserData(profileSnap.data());
          } else {
            console.log('Perfil no encontrado, se mostrará formulario.');
            // userData sigue siendo null, lo que mostrará el UserEntryForm
          }
        } catch (error) {
          console.error('Error al cargar perfil:', error);
        }
        setIsProfileLoaded(true); // Indicar que la comprobación del perfil se hizo

        // 2. Suscribirse a los cambios de progreso
        const progressDocRef = doc(
          db,
          'artifacts',
          appId,
          'users',
          user.uid,
          'progress',
          'main'
        );
        
        // Asignar la función de limpieza a la variable
        unsubscribeProgress = onSnapshot(
          progressDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              console.log('Progreso actualizado:', docSnap.data());
              setProgress(docSnap.data());
            } else {
              console.log('Sin documento de progreso, usando estado inicial.');
              setProgress({}); // Empezar con progreso vacío si no existe
            }
            setLoading(false); // Dejar de cargar una vez que el progreso se lee
          },
          (error) => {
            console.error('Error en onSnapshot (progreso):', error);
            setLoading(false); // Dejar de cargar incluso si hay error
          }
        );
      } else {
        // --- No hay usuario ---
        // 3. Intentar autenticación anónima o con token
        console.log('Sin usuario, intentando autenticación...');
        try {
          if (typeof __initial_auth_token !== 'undefined') {
            await signInWithCustomToken(auth, __initial_auth_token);
            console.log('Autenticado con token personalizado.');
          } else {
            await signInAnonymously(auth);
            console.log('Autenticado anónimamente.');
          }
          // El onAuthStateChanged se disparará de nuevo con el 'user',
          // ejecutando el bloque 'if (user)'
        } catch (error) {
          console.error('Error en autenticación anónima/token:', error);
          setLoading(false); // Si la autenticación falla, paramos la carga
        }
      }
    });

    // 4. Función de limpieza del efecto
    return () => {
      console.log('Limpiando listeners...');
      unsubscribeAuth(); // Limpiar listener de autenticación
      unsubscribeProgress(); // Limpiar listener de progreso
    };
    // --- (FIN DE LA CORRECCIÓN) ---
  }, []); // El array de dependencias vacío es correcto (se ejecuta 1 vez)
    
// --- COMPONENTE: Formulario de Entrada (Optimizada) ---
const roles = [
  'Profesor/a', 'Curso 1º ESO', 'Curso 2º ESO', 'Curso 3º ESO',
  'Curso 4º ESO', 'Otro Personal', 'Invitado/a',
];

// Usamos memo para este componente de formulario
const UserEntryForm = memo(function UserEntryForm({ userId, onProfileSubmit }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState(roles[0]);
  const [isSaving, setIsSaving] = useState(false);

  // Optimizamos handleSubmit con useCallback
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!name.trim()) return;

      setIsSaving(true);
      const userData = { name: name.trim(), role };

      const profileDocRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        userId,
        'profile',
        'main'
      );
      const summaryDocRef = doc(
        db,
        'artifacts',
        appId,
        'public',
        'data',
        'user_summaries',
        userId
      );
      const initialSummary = {
        userId,
        name: name.trim(),
        role,
        lastUpdate: new Date().toISOString(),
        progress: {},
      };

      try {
        await setDoc(profileDocRef, userData);
        await setDoc(summaryDocRef, initialSummary);
        onProfileSubmit(userData);
      } catch (error) {
        console.error('Error al guardar el perfil:', error);
        setIsSaving(false); // Asegurarse de re-habilitar el botón en caso de error
      }
    },
    [name, role, userId, onProfileSubmit] // Dependencias del handler
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm transform transition-all duration-300 hover:shadow-red-300/50"
      >
        {/* ... (JSX del formulario sin cambios lógicos) ... */}
        <div className="text-center mb-6">
          <LogIn size={48} className="text-red-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-red-700">
            Registro de Acceso
          </h2>
          <p className="text-gray-600 text-sm">
            Para registrar tu progreso, por favor, identifícate.
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
            required
            disabled={isSaving}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Curso o Rol
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 appearance-none transition duration-150"
            required
            disabled={isSaving}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
          disabled={isSaving || !name.trim()}
        >
          {isSaving ? (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Entrar al Simulador'
          )}
        </button>
      </form>
    </div>
  );
});

// --- Componente Modal DESA (Optimizada) ---
// Componente simple, memoizado
const DesaAccessModal = memo(function DesaAccessModal({ onClose }) {
  // const DESA_SIMULATOR_URL = 'https://gemini.google.com/share/917c3250ef2f'; // <-- Eliminada esta línea para usar la constante global

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      {/* ... (JSX del modal sin cambios lógicos) ... */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center transform scale-100 animate-in fade-in duration-500">
          <HeartPulse size={64} className="text-green-600 mx-auto mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold mb-3 text-green-700">
              ¡Felicidades, Socorrista!
          </h3>
          <p className="text-gray-700 mb-6">
              Has completado y aprobado con éxito el Módulo de Primeros Auxilios.
              Ahora estás listo para avanzar al siguiente nivel de formación.
          </p>
          <a
              href={DESA_SIMULATOR_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full flex items-center justify-center bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
          >
              Acceder al Simulador DESA
              <ExternalLink size={20} className="ml-2" />
          </a>
          <button
              onClick={onClose}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
              Cerrar y volver al Dashboard
          </button>
      </div>
    </div>
  );
});

// --- Componente Header (Optimizada) ---
// Es un componente puramente estático, ideal para memo
const Header = memo(function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      {/* ... (JSX del header sin cambios) ... */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-white bg-red-600 p-2 rounded-full">
            <HeartPulse size={24} />
          </span>
          <h1 className="text-xl md:text-3xl font-bold text-red-700">
            Simulador de Primeros Auxilios
          </h1>
        </div>
      </div>
    </header>
  );
});

// --- Componente SpeakButton (Optimizada) ---
// Memoizado y con useCallback para su handler
const SpeakButton = memo(function SpeakButton({ text, lang = 'es-ES' }) {
  const handleSpeak = useCallback(
    (e) => {
      e.stopPropagation();
      if (!text || typeof window.speechSynthesis === 'undefined') {
        console.warn('Speech synthesis no soportado o no hay texto.');
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    },
    [text, lang] // Depende del texto y el idioma
  );

  return (
    <button
      onClick={handleSpeak}
      title="Leer en voz alta"
      className="text-gray-500 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100 ml-2"
    >
      <Volume2 size={20} />
    </button>
  );
});

// --- Constante de Módulos ---
// (Definida globalmente, sin cambios)
const modules = [
  // ... (Todos los 19 módulos, omitidos por brevedad) ...
  {
    id: 'pas',
    title: '1. Método PAS',
    description: 'Aprende a Proteger, Avisar y Socorrer.',
    icon: 'pas',
    type: 'module',
    content: {
      videoUrls: ['https://www.youtube.com/watch?v=-OMdNPqwbso'], // Video cambiado a link directo
      steps: [
        {
          title: 'PROTEGER',
          text: 'Antes de actuar, asegúrate de que tanto tú como la víctima estáis fuera de peligro. Evalúa la escena: ¿hay tráfico, fuego, riesgo eléctrico? Tu seguridad es lo primero.',
          icon: <ShieldCheck size={64} className="text-blue-500" />,
        },
        {
          title: 'AVISAR',
          text: 'Llama a los servicios de emergencia (112 en Europa) lo antes posible. Informa con claridad sobre qué ha pasado, dónde ha pasado y cuántas víctimas hay.',
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-600"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              <path d="M14.05 2a9 9 0 0 1 8 7.94"></path>
              <path d="M14.05 6A5 5 0 0 1 18 10"></path>
            </svg>
          ),
        },
        {
          title: 'SOCORRER',
          text: 'Una vez protegida la zona y avisado, atiende a la víctima. Comprueba si está consciente y si respira. No la muevas a menos que sea estrictamente necesario.',
          icon: <UserCheck size={64} className="text-green-500" />,
        },
      ],
    },
  },
  // ... (otros módulos)
    {
    id: 'pls',
    title: '2. Posición Lateral de Seguridad (PLS)',
    description: 'Aprende la Posición Lateral de Seguridad.',
    icon: 'pls',
    type: 'module',
    content: {
      videoUrls: ['https://www.youtube.com/watch?v=nUYWcEKeBZQ'], // Video añadido
      steps: [
        {
          title: '¿Cuándo se usa la PLS?',
          text: 'Se usa cuando una persona está INCONSCIENTE pero RESPIRA con normalidad. Evita que se ahogue con su lengua o vómito.',
          icon: <UserCheck size={64} className="text-green-500" />,
        },
        {
          title: 'Paso 1: Brazo cercano',
          text: 'Arrodíllate a su lado. Coloca el brazo más cercano a ti en ángulo recto con su cuerpo (como saludando).',
          icon: (
            <svg
              width="100"
              height="64"
              viewBox="0 0 100 64"
              className="text-gray-700"
            >
              {/* Cuerpo simple */}
              <line
                x1="30"
                y1="32"
                x2="70"
                y2="32"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Brazo en angulo */}
              <line
                x1="30"
                y1="32"
                x2="30"
                y2="10"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Hombro */}
              <circle cx="25" cy="32" r="5" fill="currentColor" />
            </svg>
          ),
        },
        {
          title: 'Paso 2: Brazo lejano',
          text: 'Coge su otro brazo y cruza la mano sobre su pecho, poniendo el dorso de su mano contra su mejilla opuesta.',
          icon: (
            // --- SVG ANIMADO ---
            <svg
              width="100"
              height="64"
              viewBox="0 0 100 64"
              className="text-gray-700"
            >
              <line
                x1="30"
                y1="32"
                x2="70"
                y2="32"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="25" cy="32" r="5" fill="currentColor" />
              {/* Brazo animado */}
              <line
                x1="70"
                y1="32"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="x2"
                  values="70; 60; 70"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="32; 22; 32"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
            </svg>
          ),
        },
        {
          title: 'Paso 3: Pierna lejana',
          text: 'Con tu otra mano, flexiona su rodilla más lejana hasta que el pie esté apoyado en el suelo.',
          icon: (
            // --- SVG ANIMADO ---
            <svg
              width="100"
              height="64"
              viewBox="0 0 100 64"
              className="text-gray-700"
            >
              <line
                x1="30"
                y1="32"
                x2="70"
                y2="32"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Pierna (muslo) */}
              <line
                x1="70"
                y1="32"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="x2"
                  values="70; 70; 70"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="32; 54; 32"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
              {/* Pierna (pantorrilla) */}
              <line
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              >
                <animate
                  attributeName="x1"
                  values="70; 70; 70"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y1"
                  values="32; 54; 32"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  values="70; 60; 70"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  values="32; 44; 32"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
            </svg>
          ),
        },
        {
          title: 'Paso 4: Girar',
          text: 'Tira de la rodilla flexionada hacia ti para hacer girar el cuerpo. La cabeza debe descansar sobre la mano. Ajusta la pierna para que la cadera y la rodilla formen un ángulo recto.',
          icon: <UserCheck size={64} className="text-green-500" />,
        },
        {
          title: 'Paso 5: Comprobar',
          text: 'Abre ligeramente su boca para facilitar la respiración y comprueba que sigue respirando mientras llega la ayuda.',
          icon: <CheckCircle2 size={64} className="text-green-600" />,
        },
      ],
    },
  },
  {
    id: 'rcp',
    title: '3. Reanimación Cardiopulmonar (RCP)',
    description: 'Aprende la Reanimación Cardiopulmonar.',
    icon: 'rcp',
    type: 'module',
    content: {
      videoUrls: ['https://www.youtube.com/watch?v=7SBBka5fwW8'], // Video añadido
      steps: [
        {
          title: '¿Cuándo se usa la RCP?',
          text: '¡Solo si la persona NO responde y NO respira (o no respira con normalidad)! Primero, llama al 112.',
          icon: <AlertTriangle size={64} className="text-red-600" />,
        },
        {
          title: 'Paso 1: Posición',
          text: 'Coloca a la víctima boca arriba en una superficie dura. Arrodíllate a su lado, a la altura de su pecho.',
          icon: (
            <svg
              width="100"
              height="64"
              viewBox="0 0 100 64"
              className="text-gray-700"
            >
              {/* Víctima tumbada */}
              <line
                x1="30"
                y1="32"
                x2="70"
                y2="32"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Reanimador arrodillado */}
              <circle cx="50" cy="15" r="5" fill="currentColor" />
            </svg>
          ),
        },
        {
          title: 'Paso 2: Manos',
          text: 'Coloca el talón de una mano en el centro del pecho (en la mitad inferior del esternón). Pon la otra mano encima y entrelaza los dedos.',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              className="text-gray-700"
            >
              {/* Manos entrelazadas */}
              <rect
                x="10"
                y="30"
                width="44"
                height="10"
                rx="2"
                fill="currentColor"
              />
              <rect
                x="17"
                y="20"
                width="30"
                height="10"
                rx="2"
                fill="currentColor"
              />
            </svg>
          ),
        },
        {
          title: 'Paso 3: Ritmo y Profundidad',
          text: 'Presiona fuerte y rápido (100 a 120 cpm). HUNDE el pecho unos 5-6 cm. Deja que se eleve completamente entre compresiones.',
          icon: <HeartPulse size={64} className="text-red-500" />,
        },
        {
          title: '¡Practica el Ritmo!',
          text: 'Mantén un ritmo de 100-120 compresiones por minuto. Haz clic en el botón a ese ritmo durante 10 segundos.',
          icon: <Activity size={64} className="text-red-600" />,
          interactiveComponent: 'RcpGame', // <-- Mini-juego añadido
        },
        {
          title: 'Paso 4: Relación Compresión:Ventilación',
          text: 'Para adolescentes y adultos, la relación es 30 compresiones : 2 ventilaciones. Para niños pequeños/lactantes, empieza con 5 ventilaciones de rescate y luego usa la relación 15 compresiones : 2 ventilaciones.',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-red-500"
            >
                <text x="32" y="25" textAnchor="middle" fontSize="18" fontWeight="bold" fill="currentColor">30:2</text>
                <text x="32" y="50" textAnchor="middle" fontSize="10" fill="currentColor">(Adultos/Adolescentes)</text>
                <rect x="10" y="5" width="44" height="25" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ),
        },
        {
          title: 'Paso 5: Continuar',
          text: 'No pares. Continúa haciendo RCP hasta que llegue la ayuda, la persona se mueva o estés demasiado agotado para seguir.',
          icon: (
            <HeartPulse size={64} className="text-red-500 animate-pulse" />
          ),
        },
      ],
    },
  },
  {
    id: 'hemorragia',
    title: '4. Hemorragias',
    description: 'Aprende a actuar ante cortes, nariz, boca y oído.',
    icon: 'hemorragia',
    type: 'module',
    content: {
      videoUrls: [
        'https://www.youtube.com/watch?v=cVWQm_CPG3o',
        'https://www.youtube.com/watch?v=-4XJXAgI1n4'
      ], // Videos añadidos
      steps: [
        {
          title: '1. Hemorragia Externa (Herida)',
          text: 'Ponte guantes. Aplica presión directa con apósito limpio. Si sangra mucho, eleva la extremidad (brazo o pierna) si no hay fractura.',
          icon: <Droplets size={64} className="text-red-600" />,
        },
        {
          title: '2. Hemorragia Nasal (Epistaxis)',
          text: 'Sentar al alumno. Inclinar la cabeza HACIA ADELANTE. Presionar el tabique de la nariz (ala nasal) 5-10 minutos. No sonarse la nariz después.',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-red-500"
            >
              <circle cx="32" cy="20" r="8" />
              <path d="M32 28 l-4 8 v4 h8 v-4 z" fill="currentColor" />
              <path d="M28 32 C28 40 36 40 36 32" fill="none" />
            </svg>
          ),
        },
        {
          title: '3. Hemorragia del Oído (Otorragia)',
          text: 'Si sale sangre o líquido del oído tras un golpe en la cabeza: NO TAPONAR. Deja que el líquido salga. Coloca gasas sobre el oído y túmbalo del lado del sangrado (PLS modificada). Avisa al 112.',
          icon: <Ear size={64} className="text-gray-700" />,
        },
        {
          title: '4. Hemorragia Bucal',
          text: 'Controlar el sangrado en la boca (dientes, lengua, encía) con gasas húmedas y presión. Si es un diente, consultar el módulo 9 (Bucodental) para su conservación.',
          icon: <Smile size={64} className="text-pink-500" />,
        },
        {
          title: 'Regla de Oro',
          text: 'Si el sangrado es abundante y no se detiene, llama al 112. Nunca retires un apósito empapado, añade otro encima.',
          icon: <AlertTriangle size={64} className="text-yellow-600" />,
        },
      ],
    },
  },
  {
    id: 'quemaduras',
    title: '5. Quemaduras',
    description: 'Qué hacer (y qué no) con las quemaduras.',
    icon: 'quemaduras',
    type: 'module',
    content: {
      videoUrls: [], // Eliminado el vídeo incorrecto de Heimlich
      steps: [
        {
          title: 'Paso 1: Enfriar',
          text: 'Aplica agua fría (no helada) sobre la quemadura durante al menos 10-15 minutos. Esto detiene el daño. ',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-400"
            >
              {/* Icono de agua */}
              <path d="M20 50 A12 12 0 0 1 32 38 A12 12 0 0 1 44 50" />
              <path d="M24 40 A8 8 0 0 1 32 32 A8 8 0 0 1 40 40" />
              <path d="M28 30 A4 4 0 0 1 32 26 A4 4 0 0 1 36 30" />
              {/* Grifo */}
              <path d="M32 10 v12" />
              <path d="M26 16 l-4 -4" />
              <path d="M38 16 l4 -4" />
            </svg>
          ),
        },
        {
          title: 'Paso 2: Cubrir',
          text: 'Cubre la quemadura con un apósito estéril o un paño limpio y húmedo para protegerla.',
          icon: <ShieldCheck size={64} className="text-blue-500" />,
        },
        {
          title: 'Paso 3: ¡NO!',
          text: 'NO revientes las ampollas. NO apliques hielo. NO pongas pasta de dientes, aceite ni remedios caseros.',
          icon: <XCircle size={64} className="text-red-700" />,
        },
      ],
    },
  },
  {
    id: 'atragantamiento',
    title: '6. Atragantamiento (Heimlich)',
    description: 'Aprende la Maniobra de Heimlich.',
    icon: 'atragantamiento',
    type: 'module',
    content: {
      videoUrls: ['https://www.youtube.com/watch?v=CsMfu8Iuvgc'], // Corregido al vídeo de Heimlich
      steps: [
        {
          title: 'Paso 1: Evaluar',
          text: 'Si la persona tose, anímala a seguir tosiendo. Si NO puede toser, hablar o respirar... ¡actúa!',
          icon: <AlertTriangle size={64} className="text-yellow-600" />,
        },
        {
          title: 'Paso 2: 5 Golpes en la espalda',
          text: 'Inclina a la persona hacia adelante y dale 5 golpes secos entre los omóplatos con el talón de tu mano.',
          icon: (
            // --- SVG ANIMADO ---
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-700"
            >
              {/* Persona inclinada */}
              <circle cx="32" cy="16" r="6" />
              <path d="M26 22 v20 h12 v-20" transform="skewX(-10)" />
              {/* Mano golpeando */}
              <path
                d="M10 32 l16 -10"
                strokeWidth="3"
                className="text-red-500"
              >
                <animate
                  attributeName="d"
                  values="M10 32 l16 -10; M14 29 l16 -10; M10 32 l16 -10"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          ),
        },
        {
          title: 'Paso 3: 5 Compresiones (Heimlich)',
          text: 'Ponte detrás, rodea su cintura con tus brazos. Cierra un puño y colócalo entre el ombligo y el esternón. Coge tu puño con la otra mano.',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-700"
            >
              {/* Persona */}
              <circle cx="32" cy="16" r="6" />
              <path d="M26 22 v20 h12 v-20" />
              {/* Brazos alrededor */}
              <path d="M20 42 c0 -10 24 -10 24 0" />
            </svg>
          ),
        },
        {
          title: '¡Practica el Punto de Presión!',
          text: 'Haz clic en el lugar correcto para aplicar la Maniobra de Heimlich.',
          icon: <UserCheck size={64} className="text-cyan-600" />,
          interactiveComponent: 'HeimlichGame', // <-- Mini-juego añadido
        },
        {
          title: 'Paso 4: Comprimir',
          text: 'Realiza compresiones fuertes hacia adentro y hacia arriba. Alterna 5 golpes en la espalda y 5 compresiones abdominales.',
          icon: (
            // --- SVG ANIMADO ---
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-cyan-500"
            >
              {/* Persona */}
              <circle cx="32" cy="16" r="6" />
              <path d="M26 22 v20 h12 v-20" />
              {/* Brazos */}
              <path d="M20 42 c0 -10 24 -10 24 0" />
              {/* Flechas de compresión */}
              <path d="M28 35 l-4 -4" strokeWidth="3">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0 0; 2 2; 0 0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M36 35 l4 -4" strokeWidth="3">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="0 0; -2 2; 0 0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          ),
        },
      ],
    },
  },
  {
    id: 'sincope',
    title: '7. Síncope y Lipotimia',
    description: 'Aprende a actuar ante un desmayo.',
    icon: 'sincope',
    type: 'module',
    content: {
      steps: [
        {
          title: 'Síncope y Lipotimia',
          text: 'Un síncope es una pérdida brusca de conciencia con recuperación rápida. Una lipotimia es un mareo, pero sin perder la conciencia.',
          icon: <Frown size={64} className="text-teal-500" />,
        },
        {
          title: 'Posición Antishock',
          text: 'Guarda la calma. Tumba al alumno boca arriba y eleva sus piernas 45º para favorecer el flujo de sangre al cerebro.',
          icon: (
            <svg
              width="100"
              height="64"
              viewBox="0 0 100 64"
              className="text-gray-700"
            >
              <line
                x1="20"
                y1="50"
                x2="60"
                y2="50"
                stroke="currentColor"
                strokeWidth="4"
              />
              <circle cx="15" cy="50" r="5" fill="currentColor" />
              <line
                x1="60"
                y1="50"
                x2="80"
                y2="30"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          ),
        },
        {
          title: 'Ambiente y Ropa',
          text: 'Consigue un ambiente fresco y ventilado. Afloja la ropa apretada (cuello, cinturón). No le dejes solo.',
          icon: <Wind size={64} className="text-blue-400" />,
        },
        {
          title: '¡NO dar de comer ni beber!',
          text: 'Nunca des comida o bebida si el alumno está semiinconsciente o inconsciente. Avisa a la familia.',
          icon: <XCircle size={64} className="text-red-700" />,
        },
        {
          title: 'Cuándo avisar al 112',
          text: 'Avisa al 112 si no se recupera, si ocurre durante el ejercicio, si tiene enfermedad de base, o si hay dolor de cabeza, vómitos o convulsiones.',
          icon: <AlertTriangle size={64} className="text-yellow-600" />,
        },
      ],
    },
  },
  {
    id: 'golpes',
    title: '8. Caídas y Golpes',
    description: 'Cómo actuar ante traumatismos.',
    icon: 'golpes',
    type: 'module',
    content: {
      steps: [
        {
          title: 'Caídas y Golpes',
          text: 'Las caídas pueden causar desde rasguños a fracturas o lesiones internas. Hay que saber identificar la gravedad.',
          icon: <HardHat size={64} className="text-gray-600" />,
        },
        {
          title: 'Sospecha de Fractura/Esguince',
          text: 'Busca estos signos: Mucho dolor, imposibilidad de moverse, deformidad en la zona, o hinchazón evidente.',
          icon: <Activity size={64} className="text-red-600" />,
        },
        {
          title: 'Sospecha de Lesión Interna',
          text: 'Tras un golpe fuerte, busca estos signos: Mareo, palidez, o dolor persistente en la zona del golpe.',
          icon: <AlertTriangle size={64} className="text-yellow-600" />,
        },
        {
          title: 'Actuación: Frío y Avisar',
          text: 'Aplica frío sobre la zona hinchada. Si el dolor persiste o sospechas fractura, avisa a la familia.',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              className="text-blue-400"
            >
              <path
                d="M20 32 L32 20 L44 32 L32 44 Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ),
        },
        {
          title: '¡NO MOVER si sospechas fractura!',
          text: 'Si sospechas una fractura (especialmente de espalda o cuello), NO MUEVAS al alumno. Avisa al 112 y a la familia.',
          icon: <XCircle size={64} className="text-red-700" />,
        },
      ],
    },
  },
  {
    id: 'bucodental',
    title: '9. Traumatismos Bucodentales',
    description: 'Qué hacer si se rompe o cae un diente.',
    icon: 'bucodental',
    type: 'module',
    content: {
      steps: [
        {
          title: 'Golpe en la Boca',
          text: 'Tras un golpe, revisa la boca buscando lesiones en lengua, dientes y encías. Si sangra, enjuagar con agua (sin tragar).',
          icon: <Smile size={64} className="text-pink-500" />,
        },
        {
          title: 'Controlar Sangrado',
          text: 'Comprime la zona que sangra con una gasa estéril. Aplica frío en la zona si hay inflamación.',
          icon: <Droplets size={64} className="text-red-600" />,
        },
        {
          title: 'Pérdida de Diente (Avulsión)',
          text: '¡El tiempo es oro! El reimplante inmediato es lo mejor. Si no es posible, hay que conservar el diente.',
          icon: <AlertTriangle size={64} className="text-yellow-600" />,
        },
        {
          title: 'Cómo conservar el diente',
          text: 'Introduce el diente en LECHE ENTERA, clara de huevo o suero fisiológico (en ese orden de preferencia). Avisa a los padres para ir al odontólogo URGENTE.',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              className="text-gray-700"
            >
              <path
                d="M20 15 h24 v30 a12 12 0 0 1 -24 0 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ),
        },
      ],
    },
  },
  {
    id: 'craneo',
    title: '10. Traumatismo Craneoencefálico',
    description: 'Cómo actuar ante un golpe en la cabeza.',
    icon: 'craneo',
    type: 'module',
    content: {
      steps: [
        {
          title: 'Golpe Fuerte en la Cabeza',
          text: 'Un golpe fuerte en la cabeza puede ser leve o causar daño cerebral. Hay que vigilar los síntomas de alarma.',
          icon: <Brain size={64} className="text-purple-600" />,
        },
        {
          title: '¡Síntomas de ALARMA!',
          text: 'Pérdida de conciencia, somnolencia excesiva, confusión, vómitos, convulsiones, dificultad para hablar o caminar, sangre por nariz u oído.',
          icon: <AlertTriangle size={64} className="text-red-600" />,
        },
        {
          title: 'Actuación: Con Alarma',
          text: 'Si aparece CUALQUIER síntoma de alarma: AVISA AL 112 y a los padres. NO MUEVAS al alumno si sospechas lesión de columna.',
          icon: <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-600"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>,
        },
        {
          title: 'Actuación: Sin Alarma',
          text: 'Aunque no haya síntomas, un golpe fuerte debe ser valorado. Avisa a los padres. No dejes solo al alumno.',
          icon: <UserCheck size={64} className="text-green-500" />,
        },
        {
          title: 'Si pierde la conciencia',
          text: 'Si no respira, inicia RCP (abriendo la vía con TRACCIÓN MANDIBULAR, sin mover el cuello). Si respira, NO LO MUEVAS.',
          icon: <HeartPulse size={64} className="text-red-500" />,
        },
      ],
    },
  },
  {
    id: 'anafilaxia',
    title: '11. Reacción Anafiláctica',
    description: 'Alergias graves. Cómo usar el autoinyector.',
    icon: 'anafilaxia',
    type: 'module',
    content: {
      steps: [
        {
          title: '¿Qué es?',
          text: 'Es una reacción alérgica MUY GRAVE y rápida. Puede ser mortal. Causas comunes: alimentos (frutos secos, huevo), picaduras (abejas), medicamentos.',
          icon: <AlertTriangle size={64} className="text-red-700" />,
        },
        {
          title: 'Síntomas (¡Rápido!)',
          text: 'Afecta a 2 o más órganos: PIEL (picor, urticaria, hinchazón de labios/lengua), RESPIRATORIO (tos, "pitos", dificultad para respirar), CARDIOVASCULAR (mareo, palidez, desmayo).',
          icon: <Wind size={64} className="text-cyan-500" />,
        },
        {
          title: 'Paso 1: ¡ADRENALINA!',
          text: 'Es el tratamiento de elección. NO DUDES. Administra el autoinyector (Altellus, Jext) en la cara externa del muslo. Se puede pinchar sobre la ropa.',
          icon: <Syringe size={64} className="text-red-600" />,
        },
        {
          title: 'Paso 2: AVISAR AL 112',
          text: 'Llama INMEDIATAMENTE al 112, incluso después de poner la adrenalina.',
          icon: <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-600"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>,
        },
        {
          title: 'Paso 3: Posición y Vigilar',
          text: 'Tumba al alumno con las piernas elevadas. Si no mejora en 5-10 min, administra una SEGUNDA DOSIS. Avisa a la familia.',
          icon: <UserCheck size={64} className="text-green-500" />,
        },
      ],
    },
  },
  {
    id: 'asma',
    title: '12. Crisis de Asma',
    description: 'Qué hacer ante un ataque de asma.',
    icon: 'asma',
    type: 'module',
    content: {
      steps: [
        {
          title: '¿Qué es?',
          text: 'Una inflamación de las vías aéreas. Síntomas: tos, dificultad para respirar, "pitos" en el pecho, agitación.',
          icon: <AirVent size={64} className="text-blue-600" />,
        },
        {
          title: 'Paso 1: Calma y Medicación',
          text: 'Tranquiliza al alumno. Ayúdale a administrar su medicación de rescate (inhalador de acción rápida, ej. Salbutamol).',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              className="text-blue-500"
            >
              <rect
                x="20"
                y="10"
                width="24"
                height="12"
                rx="4"
                fill="currentColor"
              />
              <path
                d="M20 22 v20 a8 8 0 0 0 8 8 h8 a8 8 0 0 0 8 -8 v-20"
                fill="currentColor"
              />
            </svg>
          ),
        },
        {
          title: 'Paso 2: Administrar Dosis',
          text: 'Si no hay Ficha de Salud, administrar 4 pulsaciones de rescate (con cámara espaciadora si es posible).',
          icon: <CheckCircle2 size={64} className="text-green-500" />,
        },
        {
          title: 'Paso 3: Esperar y Repetir',
          text: 'Esperar 20 minutos. Si no hay mejoría, repetir las 4 pulsaciones.',
          icon: <HeartPulse size={64} className="text-red-500" />,
        },
        {
          title: 'Paso 4: AVISAR AL 112',
          text: 'Si AÚN no mejora, o hay SÍNTOMAS DE ALARMA (labios azules, no puede hablar), AVISA AL 112. Se puede dar una tercera dosis a los 20 min. Avisa a la familia.',
          icon: <AlertTriangle size={64} className="text-red-700" />,
        },
      ],
    },
  },
  {
    id: 'epilepsia',
    title: '13. Convulsiones (Epilepsia)',
    description: 'Cómo actuar ante una crisis convulsiva.',
    icon: 'epilepsia',
    type: 'module',
    content: {
      videoUrls: ['https://www.youtube.com/watch?v=8TK3N3ZT_TQ'], // Corregido: 'videoUrls' (plural) y vídeo correcto
      steps: [
        {
          title: 'Crisis Convulsiva',
          text: 'La persona pierde el conocimiento, cae, el cuerpo se pone rígido y tiene sacudidas rítmicas. Puede morderse la lengua o babear.',
          icon: <Activity size={64} className="text-indigo-500" />,
        },
        {
          title: 'Paso 1: Calma y Proteger',
          text: 'Conserva la calma. La crisis suele durar 2-3 min. Tumba al alumno de lado (PLS si es posible) y pon algo blando bajo su cabeza. Aparta objetos peligrosos.',
          icon: <ShieldCheck size={64} className="text-blue-500" />,
        },
        {
          title: 'Paso 2: ¡NO SUJETAR, NO METER NADA!',
          text: 'NO intentes evitar los movimientos. NUNCA introduzcas objetos, medicamentos ni nada en la boca.',
          icon: <XCircle size={64} className="text-red-700" />,
        },
        {
          title: 'Paso 3: Tiempo y Avisar',
          text: 'Mide la duración de la crisis. Avisa a la familia. Si la crisis dura MÁS DE 2-3 MINUTOS, llama al 112.',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              className="text-gray-700"
            >
              <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="4" />
              <path d="M32 16 v16 l12 8" stroke="currentColor" strokeWidth="4" />
            </svg>
          ),
        },
        {
          title: 'Paso 4: Recuperación',
          text: 'Después de la crisis, déjale descansar tumbado de lado (PLS) hasta que se recupere. Llama al 112 si la crisis se repite o no recupera la conciencia.',
          icon: <UserCheck size={64} className="text-green-500" />,
        },
      ],
    },
  },
  {
    id: 'diabetes',
    title: '14. Hipoglucemia y Hiperglucemia',
    description: 'Aprende a detectar y tratar una bajada o subida de azúcar.',
    icon: 'diabetes',
    type: 'module',
    content: {
      steps: [
        {
          title: '1. Hipoglucemia (Bajada de azúcar)',
          text: 'Síntomas: temblores, sudor frío, palidez, hambre, confusión. Ocurre por exceso de ejercicio o falta de ingesta.',
          icon: <Gauge size={64} className="text-blue-700" />,
        },
        {
          title: '2. Actuación: Alumno CONSCIENTE',
          text: 'Dar 10-15g de azúcar de absorción rápida (zumo, refresco azucarado, 2 terrones, un sobre). Reposo. Si no mejora en 10-15 min, repetir la toma. Avisar a la familia.',
          icon: (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              className="text-orange-500"
            >
              <path d="M20 10 v44 h24 v-44" fill="currentColor" />
            </svg>
          ),
        },
        {
          title: '3. Actuación: Alumno INCONSCIENTE',
          text: '¡URGENCIA! Colocar en PLS. NUNCA dar nada por boca. Avisar al 112 y a la familia. Administrar GLUCAGÓN si está disponible (Sigue las instrucciones de la Ficha de Salud).',
          icon: <AlertTriangle size={64} className="text-red-700" />,
        },
        {
          title: '4. Hiperglucemia (Subida de azúcar)',
          text: 'Síntomas: sed intensa, ganas de orinar, sequedad de boca, somnolencia. Ocurre por falta de insulina o ingesta excesiva.',
          icon: <Waves size={64} className="text-red-400" />,
        },
        {
          title: '5. Actuación: Hiperglucemia',
          text: 'Si el alumno se encuentra mal (confuso o somnoliento): llamar a la familia. Si pierde el conocimiento: PLS y avisar al 112. NO dar azúcar.',
          icon: <UserCheck size={64} className="text-green-500" />,
        },
      ],
    },
  },
  {
    id: 'ansiedad',
    title: '15. Crisis de Ansiedad',
    description: 'Cómo ayudar en una crisis de angustia.',
    icon: 'ansiedad',
    type: 'module',
    content: {
      steps: [
        {
          title: '¿Qué es?',
          text: 'Aparición brusca de miedo intenso. Síntomas: opresión en el pecho, sensación de ahogo, taquicardia, sudoración, mareo, temblores, miedo a morir.',
          icon: <Waves size={64} className="text-green-400" />,
        },
        {
          title: 'Paso 1: Tranquilizar',
          text: 'Aleja al alumno del lugar o situación estresante. Habla con voz tranquila y firme: "No tienes nada grave", "Esto pasará en unos minutos".',
          icon: <UserCheck size={64} className="text-green-500" />,
        },
        {
          title: 'Paso 2: Controlar la Respiración',
          text: 'Pídele que te imite: inspira por la nariz, aguanta 2 segundos, y expulsa el aire lentamente por la boca (como soplando una vela).',
          icon: <Wind size={64} className="text-blue-400" />,
        },
        {
          title: 'Paso 3: Distracción',
          text: 'Si no se calma, intenta que hable de otra cosa, que cuente hasta 100 de 3 en 3, o que tense y relaje los músculos.',
          icon: <Brain size={64} className="text-purple-600" />,
        },
        {
          title: 'Paso 4: Avisar',
          text: 'Contacta con la familia. Si la crisis no cede, llama al 112.',
          icon: <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-600"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>,
        },
      ],
    },
  },
  {
    id: 'botiquin',
    title: '16. Botiquín Escolar',
    description: 'Contenido esencial del botiquín (Anexo II).',
    icon: 'botiquin',
    type: 'module',
    content: {
      steps: [
        {
          title: 'Contenido del Botiquín (Anexo II)',
          text: 'Un botiquín debe estar en un lugar fresco, seco, accesible para adultos pero fuera del alcance de los alumnos.',
          icon: <BriefcaseMedical size={64} className="text-red-400" />,
        },
        {
          title: 'Material Sanitario',
          text: 'Tijeras, Pinzas, Termómetro, Guantes, Bolsa de hielo sintético, Apósitos y/o tiritas.',
          icon: <CheckCircle2 size={64} className="text-green-500" />,
        },
        {
          title: 'Material de Curas',
          text: 'Esparadrapo, Vendas elásticas, Algodón, Gasas estériles, Suero fisiológico, Antiséptico (ej. Clorhexidina).',
          icon: <CheckCircle2 size={64} className="text-green-500" />,
        },
        {
          title: '¡Prepara el Botiquín!',
          text: 'Selecciona los 5 elementos ESENCIALES que deben estar en un botiquín de curas básico.',
          icon: <BriefcaseMedical size={64} className="text-red-500" />,
          interactiveComponent: 'BotiquinGame', // <-- Mini-juego añadido
        },
        {
          title: 'Medicación Específica',
          text: 'La medicación específica (Adrenalina, Glucagón) NO está en el botiquín general. Debe facilitarla la familia y estar recogida en la Ficha de Salud del alumno.',
          icon: <AlertTriangle size={64} className="text-yellow-600" />,
        },
        // ... (Contenido del módulo 'botiquin') <-- Eliminada esta línea que causaba el error
      ],
    },
  },
  {
    id: 'examen', // Nuevo Módulo de Examen
    title: 'Examen Final',
    description: `Evalúa tus conocimientos. Necesitas ${MIN_PASS_SCORE}/${totalExamQuestions} para aprobar.`,
    icon: 'examen',
    type: 'exam',
  },
  // --- 6. Módulo DESA movido aquí ---
  {
    id: 'desa',
    title: 'Simulador DESA',
    description: 'Acceso al simulador de Desfibrilador (DESA).',
    icon: 'desa',
    type: 'desa', // Tipo especial
  },
  {
    id: 'glosario',
    title: 'Glosario',
    description: 'Términos clave de primeros auxilios.', // Añadido
    icon: 'glosario', // Añadido
    type: 'glossary', // Corregido
  },
  {
    id: 'certificado',
    title: 'Certificado', // Añadido
    description: 'Obtén tu certificado simbólico.', // Añadido
    icon: 'certificado', // Añadido
    type: 'certificate',
  },
  // --- Módulo DESA movido desde el final de la lista ---
];


// --- Componente Dashboard (Optimizada) ---
// Memoizado para evitar re-render si las props (progress, userData, handlers) no cambian
const Dashboard = memo(function Dashboard({
  progress,
  onModuleClick,
  userData,
  onAdminLogin,
  showDesaModal,
  onCloseDesaModal,
}) {
  const [showPinModal, setShowPinModal] = useState(false);
  
  // Estos cálculos se rehacen, pero son triviales y no necesitan useMemo
  const userName = userData?.name || 'Joven Socorrista';
  const userRole = userData?.role || 'Visitante';

  // Optimizamos los handlers internos con useCallback
  const handleShowPinModal = useCallback(() => setShowPinModal(true), []);
  const handleHidePinModal = useCallback(() => setShowPinModal(false), []);
  const handlePinSuccess = useCallback(() => {
    setShowPinModal(false);
    onAdminLogin();
  }, [onAdminLogin]);


  return (
    <div>
      {showPinModal && (
        <AdminPinModal
          onPinSuccess={handlePinSuccess}
          onCancel={handleHidePinModal}
        />
      )}
      {showDesaModal && <DesaAccessModal onClose={onCloseDesaModal} />}

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border-l-4 border-red-600">
        {/* ... (JSX del dashboard sin cambios lógicos) ... */}
        <div className="flex items-center mb-3">
            <HeartPulse size={36} className="text-red-600 mr-4" />
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    ¡Bienvenido/a al Desafío Socorrista, {userName}!
                </h2>
                <p className="text-gray-600 text-sm font-medium">
                    Tu rol actual: <span className="font-bold text-red-600">{userRole}</span>.
                </p>
            </div>
        </div>
        
        <p className="text-lg text-gray-700 mb-4 border-t pt-4 mt-2">
            Tu misión es vital: <strong>Aprender primeros auxilios puede salvar una vida</strong>. 
            Completa los <strong>{totalLearningModules} módulos</strong> de formación y supera el <strong>Examen Final</strong> para 
            obtener tu certificado simbólico y desbloquear el acceso al Simulador DESA.
        </p>

        <button
          onClick={handleShowPinModal}
          className="mt-4 flex items-center bg-gray-700 text-white text-sm py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
        >
          <Users size={18} className="mr-2" />
          Acceso Administrador
        </button>
        <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
            Fuente: Contenido adaptado del <em>Protocolo de Urgencias de Centros Educativos de la Consejería de Educación y Empleo de la Junta de Extremadura</em>.
        </p>
      </div>

      <UserProfile progress={progress} userName={userName} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            progress={progress}
            onModuleClick={() => onModuleClick(module.id)}
          />
        ))}
      </div>
    </div>
  );
});

// --- (FIN) Componente ModuleCard ---

// --- (INICIO) Nuevos Componentes de Mini-Juegos ---

/**
 * Mini-juego 1: Ritmo de RCP
 * El usuario debe hacer clic entre 17 y 20 veces en 10 segundos (100-120 cpm)
 */
const RcpRhythmGame = memo(function RcpRhythmGame({ onGameComplete }) {
  const [status, setStatus] = useState('idle'); // 'idle', 'running', 'finished'
  const [count, setCount] = useState(0); // Estado solo para *mostrar* el conteo
  const [result, setResult] = useState({ cpm: 0, success: false });
  const timerRef = useRef(null);
  const countRef = useRef(0); // Ref para *rastrear* el conteo en callbacks

  const handleStart = useCallback(() => {
    setStatus('running');
    setCount(0);
    countRef.current = 0; // Reiniciar el ref
    setResult({ cpm: 0, success: false });

    timerRef.current = setTimeout(() => {
      // --- INICIO DE LA CORRECCIÓN ---
      // La lógica de finalización se movió aquí para evitar el error "setstate-in-render".
      // El error original ocurría al llamar a onGameComplete y setResult
      // DENTRO de un actualizador de estado (setCount(updater => ...)),
      // lo cual no está permitido.
      // Ahora, usamos un ref para rastrear el conteo, y
      // ejecutamos toda la lógica de finalización de forma segura
      // dentro del callback de setTimeout.

      setStatus('finished');
      
      const finalCount = countRef.current; // Usar el valor del ref
      const cpm = finalCount * 6; // (clicks / 10s) * 60s
      const success = cpm >= 100 && cpm <= 120;
      
      setResult({ cpm, success }); // Actualizar el estado del resultado
      
      if (success) {
        onGameComplete(); // Llamar al padre solo si es exitoso
      }
      // Ya no se llama a setCount con un actualizador que tenga efectos secundarios.
      // --- FIN DE LA CORRECCIÓN ---
    }, 10000); // 10 segundos
  }, [onGameComplete]);

  const handleClick = useCallback(() => {
    if (status === 'running') {
      // Actualizar tanto el ref (para la lógica) como el estado (para la UI)
      countRef.current += 1;
      setCount(countRef.current);
    }
  }, [status]);

  // Limpiar el temporizador si el componente se desmonta
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full text-center p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
      {status === 'idle' && (
        <>
          <p className="text-lg font-semibold text-red-700 mb-4">
            ¡Prepárate para practicar el ritmo!
          </p>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            Comenzar (10 seg)
          </button>
        </>
      )}

      {status === 'running' && (
        <>
          <p className="text-lg font-semibold text-red-700 mb-4 animate-pulse">
            ¡Sigue el ritmo! (100-120 cpm)
          </p>
          <button
            onClick={handleClick}
            className="w-40 h-40 bg-red-500 text-white font-bold rounded-full shadow-xl focus:outline-none transition-transform transform active:scale-95"
          >
            <HeartPulse size={48} className="mx-auto" />
            COMPRESIÓN
            <span className="block text-2xl mt-2">{count}</span>
          </button>
        </>
      )}

      {status === 'finished' && (
        <>
          <p className="text-2xl font-bold mb-3">¡Tiempo!</p>
          <p
            className={`text-4xl font-extrabold ${
              result.success ? 'text-green-600' : 'text-red-700'
            }`}
          >
            {result.cpm} <span className="text-2xl">cpm</span>
          </p>
          {result.success ? (
            <p className="text-lg font-semibold text-green-700 mt-2">
              ¡Ritmo perfecto! (Entre 100 y 120 cpm)
            </p>
          ) : (
            <>
              <p className="text-lg font-semibold text-red-700 mt-2">
                ¡Ritmo incorrecto! Intenta de nuevo.
              </p>
              <button
                onClick={handleStart}
                className="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Reintentar
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
});

/**
 * Mini-juego 2: Selección de Botiquín
 */
const BotiquinSelectionGame = memo(function BotiquinSelectionGame({
  onGameComplete,
}) {
  const [selected, setSelected] = useState(new Set());
  const [status, setStatus] = useState('playing'); // 'playing', 'success', 'fail'

  const CORRECT_ITEMS = [
    'Guantes',
    'Gasas estériles',
    'Antiséptico (Clorhexidina)',
    'Tiritas (Apósitos)',
    'Suero fisiológico',
  ];
  const DISTRACTOR_ITEMS = [
    'Pasta de dientes',
    'Agua oxigenada (No recomendado para heridas abiertas)',
    'Móvil',
    'Algodón (No recomendado en heridas, deja fibras)',
  ];
  const allItems = useMemo(
    () =>
      [...CORRECT_ITEMS, ...DISTRACTOR_ITEMS].sort(() => Math.random() - 0.5),
    []
  );

  const handleToggle = useCallback((item) => {
    if (status !== 'playing') return;
    setSelected((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(item)) {
        newSelected.delete(item);
      } else {
        newSelected.add(item);
      }
      return newSelected;
    });
  }, [status]);

  const handleCheck = useCallback(() => {
    const isCorrect =
      CORRECT_ITEMS.every((item) => selected.has(item)) &&
      selected.size === CORRECT_ITEMS.length;

    if (isCorrect) {
      setStatus('success');
      onGameComplete();
    } else {
      setStatus('fail');
    }
  }, [selected, onGameComplete]);

  return (
    <div className="w-full p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allItems.map((item) => (
          <button
            key={item}
            onClick={() => handleToggle(item)}
            className={`p-3 rounded-lg border-2 transition-all
              ${
                selected.has(item)
                  ? 'bg-red-500 text-white border-red-700'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              }
              ${status !== 'playing' ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-4 text-center">
        {status === 'playing' && (
          <button
            onClick={handleCheck}
            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            Comprobar Botiquín
          </button>
        )}
        {status === 'fail' && (
          <>
            <p className="text-red-700 font-semibold mb-2">
              ¡Incorrecto! Revisa los materiales de curas y vuelve a
              intentarlo.
            </p>
            <button
              onClick={() => {
                setStatus('playing');
                setSelected(new Set());
              }}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </>
        )}
        {status === 'success' && (
          <p className="text-green-700 font-bold text-lg">
            ¡Perfecto! Esos son los esenciales.
          </p>
        )}
      </div>
    </div>
  );
});

/**
 * Mini-juego 3: Punto de Presión de Heimlich
 */
const HeimlichClickGame = memo(function HeimlichClickGame({ onGameComplete }) {
  const [status, setStatus] = useState('playing'); // 'playing', 'success', 'fail'
  const [failMessage, setFailMessage] = useState('');
  // --- (INICIO) Mejora: Estado para pista visual ---
  const [showHint, setShowHint] = useState(false);
  // --- (FIN) Mejora ---

  const handleClick = useCallback(
    (region) => {
      // --- (INICIO) Mejora: Lógica de feedback visual ---
      if (status !== 'playing') return; // Evitar clics múltiples

      if (region === 'correct') {
        setStatus('success');
        setFailMessage('');
        setShowHint(false);
        onGameComplete();
      } else {
        setStatus('fail');
        setShowHint(true); // Mostrar la pista visual
        let msg = '¡Ahí no!';
        if (region === 'chest') msg = 'Demasiado arriba (es el pecho).';
        if (region === 'low') msg = 'Demasiado abajo (es el abdomen).';
        setFailMessage(msg);
        
        // Reset after 2 seconds
        setTimeout(() => {
          setStatus('playing');
          setFailMessage('');
          setShowHint(false); // Ocultar la pista
        }, 2000);
      }
      // --- (FIN) Mejora ---
    },
    [status, onGameComplete]
  );

  return (
    <div className="w-full p-4 text-center">
      <p className="font-semibold mb-3">
        Haz clic en el punto correcto (entre el ombligo y el esternón):
      </p>
      {/* --- (INICIO) Mejora: Reemplazo de DIVs por SVG --- */}
      <svg
        viewBox="0 0 100 150"
        className="mx-auto w-48 h-72"
        aria-label="Silueta de un torso para practicar la maniobra de Heimlich"
      >
        {/* --- Silueta del Torso --- */}
        <path
          d="M20,10 C20,0 80,0 80,10 L90,100 C90,140 10,140 10,100 Z"
          fill="#e0f2fe" // bg-sky-100
          stroke="#60a5fa" // border-blue-400
          strokeWidth="2"
        />

        {/* --- Pista Visual (parpadea al fallar) --- */}
        {showHint && (
          <rect
            x="20"
            y="55"
            width="60"
            height="25"
            fill="rgba(74, 222, 128, 0.7)" // green-400/70
            className="animate-pulse"
            aria-label="Esta es la zona correcta"
          />
        )}

        {/* --- Referencia: Esternón --- */}
        <line
          x1="30"
          x2="70"
          y1="50"
          y2="50"
          stroke="#9ca3af" // gray-400
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        <text x="72" y="54" fontSize="6" fill="#4b5563"> {/* gray-700 */}
          Esternón
        </text>

        {/* --- Referencia: Ombligo --- */}
        <circle cx="50" cy="85" r="3" fill="#9ca3af" /> {/* gray-400 */}
        <text x="72" y="89" fontSize="6" fill="#4b5563"> {/* gray-700 */}
          Ombligo
        </text>

        {/* --- Zona Clicable: Pecho (Incorrecto) --- */}
        <rect
          x="10"
          y="10"
          width="80"
          height="40"
          fill="transparent"
          className="cursor-pointer hover:fill-red-500/30 transition-colors"
          onClick={() => handleClick('chest')}
          aria-label="Zona incorrecta: Pecho"
        />

        {/* --- Zona Clicable: Correcta (Heimlich) --- */}
        <rect
          x="20"
          y="55"
          width="60"
          height="25"
          fill="transparent"
          className="cursor-pointer hover:fill-green-500/30 transition-colors"
          onClick={() => handleClick('correct')}
          aria-label="Zona correcta: Maniobra de Heimlich"
        />

        {/* --- Zona Clicable: Abdomen (Incorrecto) --- */}
        <rect
          x="10"
          y="90"
          width="80"
          height="50"
          fill="transparent"
          className="cursor-pointer hover:fill-red-500/30 transition-colors"
          onClick={() => handleClick('low')}
          aria-label="Zona incorrecta: Abdomen bajo"
        />
      </svg>
      {/* --- (FIN) Mejora --- */}
      <div className="h-10 mt-2">
        {status === 'fail' && (
          <p className="text-red-700 font-bold animate-pulse">
            {failMessage}
          </p>
        )}
        {status === 'success' && (
          <p className="text-green-700 font-bold text-lg">¡Correcto!</p>
        )}
      </div>
    </div>
  );
});

// --- (FIN) Nuevos Componentes de Mini-Juegos ---

// --- LIMPIEZA: Componente RcpRhythmPlayer eliminado ---
// El componente RcpRhythmPlayer estaba definido pero nunca se importó
// ni se utilizó en ninguna parte de la aplicación. Se ha eliminado
// para limpiar el código.

// --- Componente ModuleAprendizaje (Optimizada) ---
// Memoizado, ya que las props 'module', 'onComplete' y 'onBack' son estables
const ModuleAprendizaje = memo(function ModuleAprendizaje({
  module,
  onComplete,
  onBack,
}) {
  const [step, setStep] = useState(0);
  // --- INICIO DE MODIFICACIÓN: Estado para juegos interactivos ---
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  // Resetea el estado de "juego completado" cada vez que cambia el paso
  useEffect(() => {
    setIsGameCompleted(false);
  }, [step]);
  // --- FIN DE MODIFICACIÓN ---

  // Optimizamos los handlers internos
  const handleNext = useCallback(() => {
    setStep((s) => s + 1);
  }, []);

  const handleBackOrPrev = useCallback(() => {
    if (step > 0) {
      setStep((s) => s - 1);
    } else {
      onBack();
    }
  }, [step, onBack]);

  // --- INICIO DE MODIFICACIÓN: Handler para juegos ---
  // Este handler será llamado por los mini-juegos cuando se completen con éxito
  const handleGameComplete = useCallback(() => {
    setIsGameCompleted(true);
  }, []);
  // --- FIN DE MODIFICACIÓN ---

  const currentStep = module.content.steps[step];
  const totalSteps = module.content.steps.length;
  // --- INICIO DE MODIFICACIÓN: Comprobar si el paso es interactivo ---
  const isInteractive = !!currentStep.interactiveComponent;
  // --- FIN DE MODIFICACIÓN ---

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      {/* ... (JSX del módulo de aprendizaje sin cambios lógicos) ... */}
      <h2 className="text-3xl font-bold mb-4 text-center text-red-700">
        {module.title}
      </h2>

      {/* --- Videos Añadidos (como enlaces) --- */}
      {module.content.videoUrls && module.content.videoUrls.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          {module.content.videoUrls.map((url, index) => (
            <div key={index} className="text-center">
              <a
                href={url}
                target="_blank" // Abre en una nueva pestaña
                rel="noopener noreferrer" // Seguridad para new tab
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <ExternalLink size={20} className="mr-2" />
                Ver Vídeo Explicativo {module.content.videoUrls.length > 1 ? `(${index + 1})` : ''} (en YouTube)
              </a>
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-2 text-center">
            (Los vídeos se abrirán en una nueva pestaña)
          </p>
        </div>
      )}
      {/* --- Fin de Videos --- */}

      <div className="text-center mb-6">
        <p className="text-gray-600">
          Paso {step + 1} de {totalSteps}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center p-4 min-h-[250px] md:min-h-[300px]">
        {/* --- INICIO DE MODIFICACIÓN: Renderizado Condicional (Juego vs Texto) --- */}
        {isInteractive ? (
          <>
            {/* Primero, mostrar la info del paso */}
            <div className="mb-4">{currentStep.icon}</div>
            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-semibold mb-2">
                {currentStep.title}
              </h3>
              <SpeakButton text={currentStep.title} />
            </div>
            <p className="text-lg text-gray-700">{currentStep.text}</p>
            <div className="mt-2">
              <SpeakButton text={currentStep.text} />
            </div>
            {/* Luego, renderizar el componente del juego */}
            <div className="w-full mt-6">
              {currentStep.interactiveComponent === 'RcpGame' && (
                <RcpRhythmGame onGameComplete={handleGameComplete} />
              )}
              {currentStep.interactiveComponent === 'BotiquinGame' && (
                <BotiquinSelectionGame onGameComplete={handleGameComplete} />
              )}
              {currentStep.interactiveComponent === 'HeimlichGame' && (
                <HeimlichClickGame onGameComplete={handleGameComplete} />
              )}
            </div>
          </>
        ) : (
          <>
            {/* Comportamiento original para pasos de solo texto */}
            <div className="mb-4">{currentStep.icon}</div>
            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-semibold mb-2">
                {currentStep.title}
              </h3>
              <SpeakButton text={currentStep.title} />
            </div>
            <p className="text-lg text-gray-700">{currentStep.text}</p>
            <div className="mt-2">
              <SpeakButton text={currentStep.text} />
            </div>
          </>
        )}
        {/* --- FIN DE MODIFICACIÓN --- */}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handleBackOrPrev}
          className="flex items-center bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          {step > 0 ? 'Anterior' : 'Volver'}
        </button>
        {step < totalSteps - 1 ? (
          <button
            onClick={handleNext}
            // --- INICIO DE MODIFICACIÓN: Deshabilitar botón si el juego no está completo ---
            disabled={isInteractive && !isGameCompleted}
            className="flex items-center bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            // --- FIN DE MODIFICACIÓN ---
          >
            Siguiente
            <ArrowRight size={20} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            // --- INICIO DE MODIFICACIÓN: Deshabilitar botón si el juego no está completo ---
            disabled={isInteractive && !isGameCompleted}
            className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            // --- FIN DE MODIFICACIÓN ---
          >
            ¡Aprendido!
            <CheckCircle2 size={20} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
});

// --- Constante del Glosario ---
// (Definida globalmente, sin cambios)
const glossaryTerms = [
  // ... (términos omitidos por brevedad) ...
  {
    term: 'PAS',
    definition:
      'Método de actuación en emergencias: Proteger, Avisar y Socorrer.',
  },
    {
    term: 'PLS',
    definition:
      'Posición Lateral de Seguridad. Postura en la que se pone a una víctima inconsciente que respira, para evitar que se ahogue con su propio vómito o lengua.',
  },
  {
    term: 'RCP',
    definition:
      'Reanimación Cardiopulmonar. Maniobra para intentar restaurar la circulación y respiración de una persona que está en parada cardiorrespiratoria.',
  },
  {
    term: 'DESA',
    definition:
      'Desfibrilador Externo Semiautomático. Aparato que analiza el ritmo cardíaco y puede administrar una descarga eléctrica si es necesario.',
  },
  {
    term: 'Maniobra de Heimlich',
    definition:
      'Procedimiento de compresiones abdominales para desobstruir la vía aérea en caso de atragantamiento.',
  },
  {
    term: '112',
    definition:
      'Número de teléfono único de emergencias para toda la Unión Europea, gratuito y disponible 24/7.',
  },
  {
    term: 'Anafilaxia',
    definition:
      'Reacción alérgica muy grave y rápida que puede ser mortal. Requiere adrenalina inmediata.',
  },
  {
    term: 'Hipoglucemia',
    definition:
      'Nivel bajo de azúcar (glucosa) en sangre. Se trata con azúcar (si está consciente) o glucagón (si está inconsciente).',
  },
  {
    term: 'Hiperglucemia',
    definition:
      'Nivel alto de azúcar (glucosa) en sangre. Suele requerir administración de insulina (según Ficha de Salud) y avisar a la familia.',
  },
  {
    term: 'Síncope',
    definition:
      'Pérdida brusca y temporal de la conciencia (desmayo), con recuperación rápida.',
  },
  {
    term: 'Lipotimia',
    definition:
      'Sensación de mareo o desvanecimiento inminente, pero sin llegar a perder totalmente la conciencia.',
  },
  {
    term: 'TCE',
    definition:
      'Traumatismo Craneoencefálico. Cualquier golpe en la cabeza. Requiere vigilancia por si aparecen síntomas de alarma.',
  },
  {
    term: 'Avulsión Dental',
    definition:
      'Pérdida completa de un diente (salida del alvéolo) a causa de un golpe. El diente se debe conservar en leche.',
  },
  {
    term: 'Epistaxis',
    definition:
      'Hemorragia nasal (sangrado por la nariz). Se trata inclinando la cabeza hacia adelante y presionando el tabique.',
  },
  {
    term: 'Otorragia',
    definition:
      'Hemorragia por el oído. Si ocurre tras un golpe, NO SE DEBE TAPONAR y requiere aviso al 112.',
  },
  {
    term: 'Convulsión',
    definition:
      'Movimientos musculares incontrolados y violentos, con o sin pérdida de conciencia. A menudo asociados a la epilepsia.',
  },
  {
    term: 'Adrenalina (Autoinyector)',
    definition:
      'Medicación de rescate (en forma de pluma precargada) usada para tratar una anafilaxia. Se inyecta en la cara externa del muslo.',
  },
  {
    term: 'Glucagón',
    definition:
      'Hormona que se administra (generalmente inyectada) para tratar una hipoglucemia grave cuando el paciente está inconsciente.',
  },
  {
    term: 'Asma',
    definition:
      'Enfermedad crónica que inflama las vías respiratorias, causando dificultad para respirar, tos y "pitos" (sibilancias).',
  },
  {
    term: 'Salbutamol (Ventolin)',
    definition:
      'Medicación (inhalador) de rescate de acción rápida que se usa para abrir las vías respiratorias durante una crisis de asma.',
  },
  {
    term: 'Antiséptico',
    definition:
      'Sustancia (como la Clorhexidina) que se usa sobre la piel o heridas para prevenir infecciones. No usar alcohol en heridas abiertas.',
  },
  {
    term: 'Apósito',
    definition:
      'Material estéril (gasa, compresa) que se coloca sobre una herida o quemadura para protegerla y controlar el sangrado.',
  },
  {
    term: 'Fractura',
    definition:
      'Rotura de un hueso. Causa dolor intenso, deformidad e incapacidad para mover la zona. No mover y avisar al 112.',
  },
  {
    term: 'Esguince',
    definition:
      'Lesión de los ligamentos de una articulación (como un tobillo) por una torcedura o estiramiento excesivo. Causa dolor e hinchazón.',
  },
];

// --- Componente Glosario (Optimizada) ---
// Memoizado, 'onBack' es estable
const Glosario = memo(function Glosario({ onBack }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      {/* ... (JSX del glosario sin cambios lógicos) ... */}
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-red-600 font-semibold mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Volver
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center text-red-700">
        Glosario de Primeros Auxilios
      </h2>
      <div className="space-y-4">
        {glossaryTerms.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-red-600">{item.term}</h3>
              <SpeakButton text={`${item.term}. ${item.definition}`} />
            </div>
            <p className="text-gray-700 mt-1">{item.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

// --- Componente de Certificado (Optimizada) ---
// Memoizado y con cálculos optimizados
const Certificado = memo(function Certificado({ onBack, progress, userName }) {
  
  // Optimizamos todos los cálculos con useMemo
  const { 
    modulosCompletados, 
    totalModulos, 
    todoCompletado, 
    examenAprobado, 
    examenRealizado,
    todoCompleto 
  } = useMemo(() => {
    const requeridos = learningModuleIds.map((id) => `${id}Completed`);
    const completados = requeridos.filter((mod) => progress[mod]).length;
    const total = requeridos.length;
    const modulosOk = completados === total;
    const examenOk = progress.examenPassed || false;
    const examenHecho = progress.examenCompleted || false;

    return {
      modulosCompletados: completados,
      totalModulos: total,
      todoCompletado: modulosOk,
      examenAprobado: examenOk,
      examenRealizado: examenHecho,
      todoCompleto: modulosOk && examenOk
    };
  }, [progress]); // Depende solo del objeto 'progress'

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      {/* ... (JSX del certificado sin cambios lógicos) ... */}
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-red-600 font-semibold mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Volver
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center text-yellow-600">
        Certificado Simbólico
      </h2>

      {todoCompleto ? (
        <div className="text-center p-6 border-4 border-yellow-500 rounded-lg bg-yellow-50">
          <Award size={80} className="text-yellow-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700 mb-2">
            Se otorga este certificado a:
          </p>
          <h3 className="text-2xl font-bold text-red-700 break-words">
            {userName || 'Joven Socorrista'}
          </h3>
          <p className="text-lg text-gray-700 mt-4 mb-1">
            Por completar con éxito el
          </p>
          <p className="text-xl font-semibold text-gray-900">
            Simulador de Primeros Auxilios
          </p>
          <p className="text-sm text-gray-600 mt-6">
            ¡Enhorabuena! Has aprendido habilidades que salvan vidas.
          </p>
        </div>
      ) : (
        <div className="text-center p-6 border-2 border-gray-300 rounded-lg bg-gray-50">
          <ClipboardCheck size={80} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Sigue adelante!
          </h3>
          <p className="text-lg text-gray-700 mb-4">
            Para conseguir el certificado necesitas cumplir:
          </p>
          
          <ul className="text-left w-fit mx-auto space-y-2 mb-6">
            <li className={`flex items-center font-semibold ${todoCompletado ? 'text-green-600' : 'text-red-600'}`}>
                {todoCompletado ? <CheckCircle2 size={20} className="mr-2" /> : <XCircle size={20} className="mr-2" />}
                1. Completar todos los módulos ({modulosCompletados}/{totalModulos})
            </li>
            <li className={`flex items-center font-semibold ${examenAprobado ? 'text-green-600' : 'text-red-600'}`}>
                {examenAprobado ? <CheckCircle2 size={20} className="mr-2" /> : <XCircle size={20} className="mr-2" />}
                2. Aprobar el Examen Final {examenRealizado ? `(Nota: ${progress.examenScore}/${totalExamQuestions})` : '(Pendiente)'}
            </li>
          </ul>

          <p className="text-sm text-gray-600 mt-4">
            ¡Completa los requisitos para desbloquearlo!
          </p>
        </div>
      )}
    </div>
  );
});

// --- (INICIO DE LA CORRECCIÓN) ---
// Faltaban todos estos componentes y la lógica de renderizado de App.

// --- Constante de Insignias ---
const badgeData = [
  { id: 'pasCompleted', title: 'PAS', icon: <ShieldCheck size={32} />, color: 'text-blue-500' },
  { id: 'plsCompleted', title: 'PLS', icon: <UserCheck size={32} />, color: 'text-green-500' },
  { id: 'rcpCompleted', title: 'RCP', icon: <HeartPulse size={32} />, color: 'text-red-500' },
  { id: 'hemorragiaCompleted', title: 'Hemorragia', icon: <Droplets size={32} />, color: 'text-red-600' },
  { id: 'quemadurasCompleted', title: 'Quemaduras', icon: <Flame size={32} />, color: 'text-orange-500' },
  { id: 'atragantamientoCompleted', title: 'Heimlich', icon: <Wind size={32} />, color: 'text-cyan-500' },
  { id: 'sincopeCompleted', title: 'Síncope', icon: <Frown size={32} />, color: 'text-teal-500' },
  { id: 'golpesCompleted', title: 'Golpes', icon: <HardHat size={32} />, color: 'text-gray-600' },
  { id: 'bucodentalCompleted', title: 'Bucodental', icon: <Smile size={32} />, color: 'text-pink-500' },
  { id: 'craneoCompleted', title: 'Cráneo', icon: <Brain size={32} />, color: 'text-purple-600' },
  { id: 'anafilaxiaCompleted', title: 'Anafilaxia', icon: <Syringe size={32} />, color: 'text-red-700' },
  { id: 'asmaCompleted', title: 'Asma', icon: <AirVent size={32} />, color: 'text-blue-600' },
  { id: 'epilepsiaCompleted', title: 'Epilepsia', icon: <Activity size={32} />, color: 'text-indigo-500' },
  { id: 'diabetesCompleted', title: 'Diabetes', icon: <Gauge size={32} />, color: 'text-blue-700' },
  { id: 'ansiedadCompleted', title: 'Ansiedad', icon: <Waves size={32} />, color: 'text-green-400' },
  { id: 'botiquinCompleted', title: 'Botiquín', icon: <BriefcaseMedical size={32} />, color: 'text-red-400' },
];

// --- Componente BadgeCard (Optimizada) ---
const BadgeCard = memo(function BadgeCard({ badge, isUnlocked }) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
        isUnlocked
          ? 'bg-gray-50 border-gray-200'
          : 'bg-gray-100 border-gray-300 filter grayscale opacity-60'
      }`}
      title={isUnlocked ? badge.title : 'Insignia bloqueada'}
    >
      <div className={isUnlocked ? badge.color : 'text-gray-500'}>
        {badge.icon}
      </div>
      <p className="text-xs font-semibold text-center mt-2">
        {isUnlocked ? badge.title : '???'}
      </p>
    </div>
  );
});

// --- Componente UserProfile (Optimizada) ---
const UserProfile = memo(function UserProfile({ progress, userName }) {
  const unlockedBadges = useMemo(
    () => badgeData.filter((badge) => progress[`${badge.id.replace('Completed', '')}Completed`]).length,
    [progress]
  );
  const totalBadges = badgeData.length;

  const { examStatus, examColor, examIcon } = useMemo(() => {
    const isCompleted = progress.examenCompleted;
    const isPassed = progress.examenPassed;
    
    if (isCompleted) {
      if (isPassed) {
        return { examStatus: 'APROBADO', examColor: 'text-green-600', examIcon: <CheckCircle2 size={18} className="mr-2" /> };
      } else {
        return { examStatus: 'SUSPENSO', examColor: 'text-red-600', examIcon: <XCircle size={18} className="mr-2" /> };
      }
    } else {
      return { examStatus: 'PENDIENTE', examColor: 'text-gray-600', examIcon: <AlertTriangle size={18} className="mr-2" /> };
    }
  }, [progress.examenCompleted, progress.examenPassed]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-2xl font-bold mb-4">Mis Insignias de {userName}</h2>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
        <h3 className="text-xl font-semibold">
          Módulos de Aprendizaje: ({unlockedBadges} / {totalBadges})
        </h3>
        <p className={`font-bold mt-2 sm:mt-0 flex items-center ${examColor}`}>
          {examIcon}
          Examen Final: {examStatus} ({progress.examenScore || 0}/{totalExamQuestions})
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-8 gap-4">
        {badgeData.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isUnlocked={progress[`${badge.id.replace('Completed', '')}Completed`]}
          />
        ))}
      </div>
    </div>
  );
});

// --- Componente ModuleCard (Optimizada) ---
const ModuleCard = memo(function ModuleCard({
  module,
  progress,
  onModuleClick,
}) {
  const isLearningModule = learningModuleIds.includes(module.id);
  const isCompleted = isLearningModule && progress[`${module.id}Completed`];

  // Calcular estado de bloqueo/disponibilidad
  const { isLocked, statusText, statusColor, isDisabled } = useMemo(() => {
    const allLearningCompleted =
      learningModuleIds.every((id) => progress[`${id}Completed`]);
    const examPassed = progress.examenPassed || false;

    if (module.type === 'exam') {
      return {
        isLocked: !allLearningCompleted,
        statusText: allLearningCompleted
          ? '¡Listo para el examen!'
          : `Completa los ${totalLearningModules} módulos`,
        statusColor: allLearningCompleted ? 'text-green-600' : 'text-yellow-700',
        isDisabled: false, // Siempre se puede hacer clic para ver el estado
      };
    }
    
    if (module.type === 'certificate' || module.type === 'desa') {
        const reqMet = allLearningCompleted && examPassed;
        return {
            isLocked: !reqMet,
            statusText: reqMet
                ? '¡Desbloqueado!'
                : 'Supera el examen para desbloquear',
            statusColor: reqMet ? 'text-green-600' : 'text-yellow-700',
            isDisabled: !reqMet, // Deshabilitar clic si no está desbloqueado
        };
    }
    
    // Módulos de aprendizaje o glosario
    return { isLocked: false, statusText: '', statusColor: '', isDisabled: false };

  }, [module.id, module.type, progress]);
  
  const icon = iconComponents[module.icon] || <BookOpen size={48} />;

  return (
    <button
      onClick={() => !isDisabled && onModuleClick()}
      disabled={isDisabled}
      className={`relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center border-b-4 ${
        isCompleted ? 'border-green-500' : 'border-red-600'
      } ${
        isDisabled
          ? 'opacity-60 grayscale cursor-not-allowed'
          : 'hover:transform hover:-translate-y-1'
      }`}
    >
      {isCompleted && (
        <div className="absolute top-3 right-3 text-green-500">
          <CheckCircle2 size={24} />
        </div>
      )}
      {isLocked && (
        <div className="absolute top-3 left-3 text-gray-500">
          <Lock size={24} />
        </div>
      )}

      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        {module.description}
      </p>
      {!isLearningModule && statusText && (
        <p className={`font-semibold text-sm ${statusColor}`}>{statusText}</p>
      )}
    </button>
  );
});

// --- Componente Examen (Optimizada) ---
const Examen = memo(function Examen({ onBack, onExamComplete, progress }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(progress.examenCompleted || false);
  const [score, setScore] = useState(progress.examenScore || 0);

  const handleAnswerSelect = useCallback((questionIndex, answer) => {
    if (isFinished) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  }, [isFinished]);

  const handleSubmit = useCallback(() => {
    let finalScore = 0;
    for (let i = 0; i < examQuestions.length; i++) {
      if (selectedAnswers[i] === examQuestions[i].answer) {
        finalScore++;
      }
    }
    setScore(finalScore);
    setIsFinished(true);
    onExamComplete(finalScore, finalScore >= MIN_PASS_SCORE);
  }, [selectedAnswers, onExamComplete]);

  const handleNext = useCallback(() => {
    setCurrentQuestion((q) => Math.min(q + 1, examQuestions.length - 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentQuestion((q) => Math.max(q - 1, 0));
  }, []);
  
  const q = examQuestions[currentQuestion];
  
  if (isFinished) {
    const isPassed = score >= MIN_PASS_SCORE;
    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-red-700">Examen Finalizado</h2>
            {isPassed ? (
                <CheckCircle2 size={80} className="text-green-600 mx-auto mb-4" />
            ) : (
                <XCircle size={80} className="text-red-600 mx-auto mb-4" />
            )}
            <p className="text-2xl font-bold">Tu puntuación:</p>
            <p className={`text-6xl font-extrabold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {score} / {totalExamQuestions}
            </p>
            <p className="text-xl font-semibold mt-4">
                {isPassed ? '¡APROBADO!' : 'SUSPENSO'}
            </p>
            <p className="text-gray-600 mt-2">
                (Nota mínima para aprobar: {MIN_PASS_SCORE})
            </p>
            <button
                onClick={onBack}
                className="mt-8 flex items-center bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors mx-auto"
            >
                <ArrowLeft size={20} className="mr-2" />
                Volver al Dashboard
            </button>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center text-red-700">
        Examen Final
      </h2>
      <p className="text-center text-gray-600 mb-2">
        Pregunta {currentQuestion + 1} de {totalExamQuestions}
      </p>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / totalExamQuestions) * 100}%` }}
        ></div>
      </div>
      
      <div className="min-h-[250px]">
        <h3 className="text-xl font-semibold mb-4">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion, option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                selectedAnswers[currentQuestion] === option
                  ? 'bg-red-100 border-red-500'
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="flex items-center bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          <ArrowLeft size={20} className="mr-2" />
          Anterior
        </button>
        {currentQuestion === totalExamQuestions - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== totalExamQuestions}
            className="flex items-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Finalizar Examen
            <CheckCircle2 size={20} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Siguiente
            <ArrowRight size={20} className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
});

// --- Componente AdminPinModal (Optimizada) ---
const AdminPinModal = memo(function AdminPinModal({ onPinSuccess, onCancel }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // (¡ALERTA DE SEGURIDAD!)
  // Este PIN solo está en el cliente.
  const ADMIN_PIN = '2024'; // Cambiado de 2025 a 2024

  const handleVerify = useCallback((e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(false);
    
    // Simulación de verificación
    setTimeout(() => {
      if (pin === ADMIN_PIN) {
        onPinSuccess();
      } else {
        setError(true);
        setIsVerifying(false);
      }
    }, 500);
  }, [pin, onPinSuccess]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleVerify} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm">
          <div className="text-center mb-6">
              <Lock size={48} className="text-gray-700 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-gray-900">
                  Acceso Administrador
              </h3>
              <p className="text-gray-600 text-sm">
                  Introduce el PIN para continuar.
              </p>
          </div>
          
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg text-center text-2xl tracking-widest focus:ring-red-500 focus:border-red-500 transition duration-150`}
            maxLength={4}
            required
            disabled={isVerifying}
            autoFocus
          />
          {error && <p className="text-red-600 text-sm text-center mt-2">PIN incorrecto.</p>}
          
          <div className="mt-6 flex space-x-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isVerifying}
                className="w-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                  Cancelar
              </button>
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
                disabled={isVerifying || pin.length < 4}
              >
                {isVerifying ? 'Verificando...' : 'Entrar'}
              </button>
          </div>
      </form>
    </div>
  );
});

// --- Componente AdminDashboard (Optimizada) ---
const AdminDashboard = memo(function AdminDashboard({ onBack }) {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const summariesColRef = collection(
      db,
      'artifacts',
      appId,
      'public',
      'data',
      'user_summaries'
    );
    
    // Usamos getDocs para una carga única, no un listener en tiempo real
    const fetchSummaries = async () => {
        try {
            const querySnapshot = await getDocs(summariesColRef);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Ordenar en el cliente (evita índices de Firestore)
            data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            
            setSummaries(data);
        } catch (error) {
            console.error("Error al cargar resúmenes de admin:", error);
        }
        setLoading(false);
    };

    fetchSummaries();
    
    // No necesitamos limpieza porque es getDocs, no onSnapshot
  }, []); // Cargar solo una vez

  // Optimización de cálculos derivados
  const { totalUsers, modulesCompleted, examsPassed } = useMemo(() => {
    let modulesCount = 0;
    let examsCount = 0;
    
    summaries.forEach(user => {
        const completed = learningModuleIds.filter(id => user.progress[`${id}Completed`]).length;
        modulesCount += completed;
        
        if (user.progress.examenPassed) {
            examsCount++;
        }
    });
    
    return {
        totalUsers: summaries.length,
        modulesCompleted: modulesCount,
        examsPassed: examsCount
    };
  }, [summaries]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-red-600 font-semibold mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Volver al Dashboard
      </button>
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Panel de Administración
      </h2>
      
      {/* Resumen Estadístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
            <h4 className="text-sm font-semibold text-gray-600">Usuarios Totales</h4>
            <p className="text-3xl font-bold text-red-600">{loading ? '...' : totalUsers}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
            <h4 className="text-sm font-semibold text-gray-600">Exámenes Aprobados</h4>
            <p className="text-3xl font-bold text-green-600">{loading ? '...' : examsPassed}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
            <h4 className="text-sm font-semibold text-gray-600">Módulos Completados (Total)</h4>
            <p className="text-3xl font-bold text-blue-600">{loading ? '...' : modulesCompleted}</p>
        </div>
      </div>
      
      {/* Tabla de Usuarios */}
      {loading ? (
        <p className="text-center text-gray-600">Cargando datos de usuarios...</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nombre</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Rol</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Módulos</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Examen</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Nota</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {summaries.map(user => {
                        const modulesDone = learningModuleIds.filter(id => user.progress[`${id}Completed`]).length;
                        const examPassed = user.progress.examenPassed || false;
                        const examCompleted = user.progress.examenCompleted || false;
                        const examScore = user.progress.examenScore || 0;
                        
                        return (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {modulesDone} / {totalLearningModules}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {examCompleted ? (
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${examPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {examPassed ? 'Aprobado' : 'Suspenso'}
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            Pendiente
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {examCompleted ? `${examScore}/${totalExamQuestions}` : 'N/A'}
                               </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
});


// --- Lógica de Renderizado de APP (FALTANTE) ---

  const handleSetProfile = useCallback((profileData) => {
    setUserData(profileData);
  }, []);

  const handleModuleClick = useCallback(async (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    if (module.type === 'desa') {
        setShowDesaModal(true);
        return;
    }
    
    if (module.type === 'exam') {
        setPage('exam');
    } else if (module.type === 'glossary') {
        setPage('glossary');
    } else if (module.type === 'certificate') {
        setPage('certificate');
    } else {
        setCurrentModule(module);
        setPage('module');
    }
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setPage('home');
    setCurrentModule(null);
  }, []);
  
  const handleCloseDesaModal = useCallback(() => {
    setShowDesaModal(false);
  }, []);

  const handleModuleComplete = useCallback(async () => {
    if (!userId || !currentModule) return;

    const newProgress = {
      ...progress,
      [`${currentModule.id}Completed`]: true,
    };
    setProgress(newProgress); // Actualización optimista

    try {
      const progressDocRef = doc(db, 'artifacts', appId, 'users', userId, 'progress', 'main');
      await setDoc(progressDocRef, newProgress, { merge: true });
      
      // Actualizar resumen público
      const summaryDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', userId);
      await setDoc(summaryDocRef, { 
          progress: newProgress,
          lastUpdate: new Date().toISOString()
      }, { merge: true });

    } catch (error) {
      console.error('Error al guardar progreso:', error);
      // Revertir si falla (opcional)
      setProgress(progress); 
    }

    setPage('home');
    setCurrentModule(null);
  }, [userId, currentModule, progress]);

  const handleExamComplete = useCallback(async (score, isPassed) => {
    if (!userId) return;

    const newProgress = {
      ...progress,
      examenCompleted: true,
      examenPassed: isPassed,
      examenScore: score,
    };
    setProgress(newProgress); // Actualización optimista

    try {
      const progressDocRef = doc(db, 'artifacts', appId, 'users', userId, 'progress', 'main');
      await setDoc(progressDocRef, newProgress, { merge: true });

      // Actualizar resumen público
      const summaryDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'user_summaries', userId);
      await setDoc(summaryDocRef, { 
          progress: newProgress,
          lastUpdate: new Date().toISOString()
      }, { merge: true });

    } catch (error) {
      console.error('Error al guardar resultado del examen:', error);
      setProgress(progress); // Revertir si falla
    }
  }, [userId, progress]);
  
  const handleAdminLogin = useCallback(() => {
    setIsAdminMode(true);
    setPage('admin');
  }, []);
  
  const handleAdminBack = useCallback(() => {
    setIsAdminMode(false);
    setPage('home');
  }, []);

  // --- Renderizado Principal ---
  
  const renderContent = () => {
    if (loading || !isProfileLoaded) {
      return (
        <div className="flex justify-center items-center min-h-[50vh]">
          <svg className="animate-spin h-10 w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }

    if (!userData) {
      return <UserEntryForm userId={userId} onProfileSubmit={handleSetProfile} />;
    }
    
    if (isAdminMode && page === 'admin') {
        return <AdminDashboard onBack={handleAdminBack} />;
    }

    switch (page) {
      case 'module':
        return (
          <ModuleAprendizaje
            module={currentModule}
            onComplete={handleModuleComplete}
            onBack={handleBackToDashboard}
          />
        );
      case 'exam':
        return <Examen onBack={handleBackToDashboard} onExamComplete={handleExamComplete} progress={progress} />;
      case 'glossary':
        return <Glosario onBack={handleBackToDashboard} />;
      case 'certificate':
        return <Certificado onBack={handleBackToDashboard} progress={progress} userName={userData?.name} />;
      case 'home':
      default:
        return (
          <Dashboard
            progress={progress}
            onModuleClick={handleModuleClick}
            userData={userData}
            onAdminLogin={handleAdminLogin}
            showDesaModal={showDesaModal}
            onCloseDesaModal={handleCloseDesaModal}
          />
        );
    }
  };

  return (
    <div className="bg-red-50 min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
      <footer className="text-center py-6 px-4 text-xs text-gray-600">
        <p>Creada por ogvapps - ogonzalezv01@educarex.es - Orestes González Villanueva</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Copyright</p>
      </footer>
    </div>
  );
// --- FIN DE LA CORRECCIÓN ---
} // <-- Esta es la llave de cierre que faltaba para 'function App()'


export default App;
