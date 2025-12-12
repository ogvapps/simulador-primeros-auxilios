# Instrucciones de Uso - Sistema de Persistencia de Estudiantes

## Descripción

Este documento explica cómo usar el nuevo sistema de persistencia de estudiantes que permite:

✅ **Guardar automáticamente** el progreso de cada alumno
✅ **Reiniciar** la simulación de un alumno manteniendo sus datos básicos
✅ **Eliminar** completamente un alumno y todo su progreso
✅ **Seguir el progreso** de múltiples alumnos simultáneamente

---

## 📚 Para Profesores

### Ver Lista de Alumnos

El simulador ahora guarda automáticamente cada alumno que accede. Para ver la lista completa:

```typescript
import { getStudentsByClass } from './services/studentService';

// Obtener todos los alumnos de una clase
const alumnos = await getStudentsByClass('1A');
console.log(alumnos);
```

### Datos que se Guardan

Cada alumno tiene la siguiente información persistida:

- **Identificación**: `studentId`, `nombre`, `clase`, `rol`
- **Fechas**: `fechaInicio`, `ultimaActividad`
- **Progreso**: `actividadActual`, `moduloActual`, `puntuacion`, `xp`, `nivel`
- **Completitud**: `pasCompleted`, `evaluacionCompleted`, `svbCompleted`, `traumasCompleted`, `examenCompleted`
- **Métricas**: `tiempoTotal`, `intentosExamen`, `racha`

---

## 🔄 Cómo Reiniciar un Alumno

Si un alumno necesita repetir el simulador desde cero:

```typescript
import { resetStudentProgress } from './services/studentService';

// Reiniciar alumno (mantiene nombre y clase, borra progreso)
const success = await resetStudentProgress('1a_juan_perez_1234567890');

if (success) {
  console.log('✅ Alumno reiniciado correctamente');
} else {
  console.error('❌ Error al reiniciar alumno');
}
```

**⚠️ Importante**: El reinicio:
- \u2705 Mantiene: `nombre`, `clase`, `rol`, `studentId`
- ❌ Borra: Todo el progreso, puntuaciones, módulos completados, XP, nivel

---

## 🗑️ Cómo Eliminar un Alumno

Para eliminar completamente un alumno del sistema:

```typescript
import { deleteStudent } from './services/studentService';

// Eliminar alumno permanentemente
const success = await deleteStudent('1a_juan_perez_1234567890');

if (success) {
  console.log('✅ Alumno eliminado correctamente');
} else {
  console.error('❌ Error al eliminar alumno');
}
```

**⚠️ Advertencia**: Esta acción es **irreversible**. Se eliminarán:
- Todos los datos del alumno
- Todo su progreso
- Su entrada en el resumen público (visible para profesores)

---

## 💾 Cómo se Guarda el Progreso

El progreso se guarda **automáticamente** cada vez que:

1. El alumno completa una actividad
2. El alumno gana XP o sube de nivel
3. El alumno completa un módulo
4. El alumno realiza el examen final

No es necesario hacer nada manualmente. El sistema usa:

- **Firestore** (en producción con Firebase configurado)
- **localStorage** (en modo mock/desarrollo sin Firebase)

---

## 👨‍💻 Integración en la UI

### Ejemplo: Botón de Reinicio

```tsx
import { resetStudentProgress } from '../services/studentService';
import { useState } from 'react';

function StudentCard({ student }) {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!confirm(`¿Reiniciar el progreso de ${student.nombre}?`)) return;
    
    setLoading(true);
    const success = await resetStudentProgress(student.studentId);
    setLoading(false);
    
    if (success) {
      alert('✅ Alumno reiniciado');
      window.location.reload(); // Recargar para ver cambios
    } else {
      alert('❌ Error al reiniciar');
    }
  };

  return (
    <div className="student-card">
      <h3>{student.nombre}</h3>
      <p>Clase: {student.clase}</p>
      <p>Progreso: {student.puntuacion} puntos</p>
      <p>Nivel: {student.nivel}</p>
      
      <button onClick={handleReset} disabled={loading}>
        {loading ? 'Reiniciando...' : '🔄 Reiniciar'}
      </button>
    </div>
  );
}
```

### Ejemplo: Botón de Eliminar

```tsx
import { deleteStudent } from '../services/studentService';
import { useState } from 'react';

function StudentActions({ student, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmText = `¿Estás seguro de ELIMINAR a ${student.nombre}? Esta acción NO se puede deshacer.`;
    if (!confirm(confirmText)) return;
    
    setLoading(true);
    const success = await deleteStudent(student.studentId);
    setLoading(false);
    
    if (success) {
      alert('✅ Alumno eliminado');
      onDeleted(student.studentId);
    } else {
      alert('❌ Error al eliminar');
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="btn-danger"
    >
      {loading ? 'Eliminando...' : '🗑️ Eliminar'}
    </button>
  );
}
```

---

## 🔒 Seguridad en Firestore

Para que esto funcione en producción, necesitas configurar las reglas de Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura en students
    match /artifacts/{appId}/students/{studentId} {
      allow read, write: if true; // ⚠️ En producción, añade autenticación
    }
    
    // Permitir lectura pública de resúmenes (para panel de profesor)
    match /artifacts/{appId}/public/data/student_summaries/{studentId} {
      allow read: if true;
      allow write: if true; // ⚠️ En producción, solo profesores autenticados
    }
  }
}
```

**⚠️ Recomendación**: En producción, restringe `allow write` solo a usuarios autenticados con rol de profesor.

---

## ❓ Preguntas Frecuentes

### ¿Dónde se guardan los datos?

- **Con Firebase configurado**: En Firestore (Cloud)
- **Sin Firebase**: En localStorage del navegador (local)

### ¿Qué pasa si no tengo Firebase?

El sistema funciona en **modo mock** usando `localStorage`. Es perfecto para desarrollo y pruebas locales.

### ¿Cómo sé el studentId de un alumno?

El `studentId` se genera automáticamente al crear el alumno: `{clase}_{nombre}_{timestamp}`. Ejemplo: `1a_juan_perez_1702483847321`

### ¿Puedo buscar un alumno por nombre?

Sí, usa `getStudentsByClass` y filtra:

```typescript
const alumnos = await getStudentsByClass('1A');
const juan = alumnos.find(a => a.nombre.toLowerCase().includes('juan'));
```

### ¿El progreso se guarda en tiempo real?

Sí, cada vez que el alumno completa una acción significativa (completar actividad, ganar XP, etc.), se guarda automáticamente.

---

## 🛠️ Próximos Pasos

1. **Implementar Panel de Profesor**: Crear un componente que muestre todos los alumnos con botones de reinicio/eliminación
2. **Añadir Autenticación**: Integrar Firebase Auth para que solo profesores puedan borrar/reiniciar
3. **Dashboard de Estadísticas**: Mostrar gráficos de progreso de la clase
4. **Exportar Datos**: Añadir botón para exportar progreso a CSV/Excel

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que Firebase esté configurado correctamente (archivo `.env`)
2. Revisa la consola del navegador para errores
3. Comprueba que las reglas de Firestore permiten lectura/escritura
4. En modo mock, verifica que localStorage no esté lleno

**Desarrollado por ogvapps** 🚀
