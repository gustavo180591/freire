# 🎯 **FUNCIONALIDADES_DEL_SISTEMA.md**
# Sistema Integral de Gestión Académica y Administrativa
Instituto Superior de Formación Docente – Paulo Freire

---

## 📋 **1. Propósito del Sistema**

El sistema tiene como objetivo gestionar de manera integral los procesos académicos, administrativos y documentales de la institución, permitiendo centralizar operaciones, garantizar cumplimiento normativo y proporcionar trazabilidad completa de todas las acciones institucionales.

### **🎯 Objetivos Estratégicos**
- **Centralización**: Unificar procesos actualmente dispersos
- **Automatización**: Reducir tareas manuales y errores humanos
- **Trazabilidad**: Registro completo de todas las operaciones
- **Cumplimiento**: Garantizar apego al reglamento institucional
- **Escalabilidad**: Soportar crecimiento futuro

### **� Actores del Sistema**
- **Administradores**: Gestión completa del sistema
- **Personal Administrativo**: Operaciones diarias del sistema
- **Docentes**: Gestión de comisiones, asistencia y recibos
- **Alumnos**: Consultas, inscripciones y trámites personales

### **👤 Registro y Gestión de Usuarios**
- **Registro de usuarios**: Alta de nuevos usuarios con validación institucional
- **Gestión de perfiles**: Actualización de datos personales y contacto
- **Validación institucional**: Verificación de pertenencia al instituto
- **Desactivación de cuentas**: Manejo de egresados y bajas

### **🔑 Autenticación y Seguridad**
- **Inicio de sesión seguro**: Autenticación con credenciales institucionales
- **Control de sesiones**: Gestión de sesiones activas y cierre remoto
- **Recuperación de contraseña**: Flujo seguro de recuperación vía email
- **MFA (Opcional)**: Autenticación de múltiples factores para roles críticos

### **🛡️ Seguridad Basada en**
- **JWT RS256**: Tokens seguros con rotación automática
- **Control de roles**: Gestión jerárquica de permisos
- **Permisos específicos**: Control granular por recurso y acción
- **Blacklist de tokens**: Revocación inmediata de accesos

### **👥 Roles del Sistema**

| Rol | Permisos Principales | Responsabilidades |
|------|---------------------|------------------|
| **ADMIN_SISTEMA** | Acceso completo a todos los módulos | Configuración global, gestión de usuarios, reportes ejecutivos |
| **DIRECTOR** | Gestión académica institucional completa | Políticas académicas, aprobación de actas, decisiones estratégicas |
| **COORDINADOR_CARRERA** | Gestión de carreras específicas | Planes de estudio, asignación docente, validación de correlativas |
| **SECRETARIA_ACADEMICA** | Operaciones académicas diarias | Inscripciones, actas, certificados, carreras y materias |
| **SECRETARIA_FINANCIERA** | Operaciones financieras | Aranceles, cuotas, pagos, becas, control de deudas |
| **DOCENTE** | Gestión de sus comisiones asignadas | Asistencia, notas, comunicación, materiales didácticos |
| **ALUMNO** | Acceso a su información personal | Inscripciones, consultas, trámites, estado académico |
| **BEDEL** | Gestión logística y de recursos | Aulas, materiales, seguridad del campus |

### **🔄 Roles Múltiples y Contextuales**

El sistema soporta asignación de múltiples roles por usuario con permisos contextuales:

**Ejemplos de Combinaciones**:
- **Docente-Alumno**: Docente que cursa posgrado en otra carrera
- **Coordinador-Docente**: Coordinador con responsabilidades docentes
- **Secretaría con múltiples áreas**: Acceso académico y financiero limitado

**Permisos Contextuales**:
- **Scope Global**: Acceso a toda la institución
- **Scope Carrera**: Acceso limitado a carreras específicas
- **Scope Materia**: Acceso limitado a materias asignadas

---

## 👨‍🎓 **Gestión de Alumnos**

### **📝 Registro y Mantenimiento**
- **Registro completo**: Formulario con datos personales, académicos y de contacto
- **Edición de información**: Actualización de datos personales y familiares
- **Asignación a carrera**: Vinculación automática con planes de estudio
- **Gestión documental**: Carga de documentos (DNI, título, certificados)
- **Fotografía institucional**: Gestión de fotos para credenciales

### **📚 Historial Académico**
- **Historial completo**: Registro de todas las cursadas y exámenes
- **Estado por materia**: Visualización de materias aprobadas/pendientes
- **Promedio general**: Cálculo automático de promedios por carrera
- **Certificados parciales**: Generación de constancias de estudio y avance

### **🎓 Estados Académicos**
- **Activo**: Alumno regular con derechos completos
- **Suspendido**: Suspensión temporal por motivos disciplinarios
- **Baja**: Baja definitiva del sistema
- **Egresado**: Alumno que completó su carrera
- **Inactivo**: Alumno sin actividad académica prolongada

### **📚 Historial Académico**
- **Historial completo**: Registro de todas las cursadas y exámenes
- **Estado de materias**: Visualización de materias aprobadas/pendientes
- **Promedio general**: Cálculo automático de promedios
- **Certificados parciales**: Generación de constancias de estudio

### **🎓 Estado Académico**
- **Estados formales**: Regular, Libre, Egresado, Baja, Suspendido
- **Transiciones automáticas**: Cambios de estado basados en reglas
- **Alertas de estado**: Notificaciones de cambios críticos
- **Reporte de estado**: Informes detallados por período

---

## 👨‍🏫 **4. Gestión de Docentes**

### **📝 Registro y Datos Personales**
- **Registro completo**: Datos personales, académicos y laborales
- **Información de contacto**: Teléfonos, emails, domicilios
- **Datos académicos**: Títulos, especializaciones, antigüedad
- **Carga horaria**: Definición de disponibilidad y dedicación

### **📚 Asignación Académica**
- **Asignación a materias**: Vinculación con cátedras específicas
- **Gestión de comisiones**: Asignación a grupos de cursada
- **Consulta de asignaciones**: Visualización de materias y comisiones a cargo
- **Disponibilidad horaria**: Gestión de horarios y restricciones

---

## 🏛️ **5. Gestión Académica**

### **📖 Carreras**
- **Gestión de carreras**: Alta, modificación y baja de carreras
- **Plan de estudios**: Estructura detallada de cada carrera
- **Duración y modalidad**: Configuración de años y modalidades
- **Estado de carrera**: Activación/desactivación de carreras

### **📚 Materias**
- **Catálogo institucional**: Registro completo de todas las materias
- **Asociación a carreras**: Vinculación con planes de estudio
- **Definición de parámetros**: Año de cursada, horas, correlatividades
- **Porcentajes de regularidad**: Definición de requisitos de aprobación

### **🔗 Sistema de Correlatividades**
- **Definición de materias previas**: Configuración de requisitos obligatorios
- **Validación automática**: Verificación en tiempo real durante inscripciones
- **Tipos de correlatividad**:
  - **Previa**: Materia debe estar aprobada previamente
  - **Simultánea**: Materias que pueden cursarse juntas
  - **Equivalente**: Materias con igual valor curricular

---

## 👥 **6. Gestión de Comisiones**
### **📝 Creación y Configuración**
- **Creación de comisiones**: Definición por materia y período
- **Asignación de docentes**: Designación de responsables de cátedra
- **Definición de cupo máximo**: Límite de inscriptos por comisión
- **Asociación a período lectivo**: Vinculación con calendario académico

### **📊 Gestión de Inscripciones**
- **Consulta de inscriptos**: Listado de alumnos por comisión
- **Control de cupos**: Monitoreo en tiempo real de disponibilidad
- **Gestión de listas de espera**: Manejo automático de excedentes
- **Reportes de ocupación**: Estadísticas de uso por comisión

---

## 📝 **7. Inscripción a Cursadas**
### **🔍 Proceso de Inscripción**
- **Consulta de materias disponibles**: Catálogo filtrado por carrera y estado
- **Selección de comisiones**: Elección de horarios y docentes
- **Validación automática**: Verificación de requisitos en tiempo real
- **Confirmación de inscripción**: Proceso transaccional con comprobante

### **✅ Motor de Validaciones**
- **Estado académico del alumno**: Verificación de regularidad
- **Deuda financiera**: Control de bloqueos por pagos pendientes
- **Correlatividades**: Cumplimiento de materias previas
- **Cupo disponible**: Verificación de capacidad en comisión
- **Conflictos de horario**: Detección de superposiciones

### **📊 Estados de Inscripción**
- **Pendiente**: En proceso de validación
- **Inscripto**: Confirmada y activa
- **Rechazada**: No cumple requisitos
- **Baja**: Cancelación por alumno o administración

### **📊 Control de Cupos**
- **Gestión de cupos**: Límites dinámicos por comisión
- **Listas de espera**: Manejo automático de excedentes
- **Liberación de cupos**: Liberación por bajas y cancelaciones
- **Reportes de ocupación**: Estadísticas de uso de cupos

### **🔗 Control de Correlativas**
- **Validación estricta**: Cumplimiento obligatorio de correlativas
- **Excepciones administrativas**: Autorización especial por casos
- **Historial de validaciones**: Registro de todas las verificaciones
- **Alertas de correlativas**: Notificaciones de requisitos faltantes

---

## 📊 **Asistencia**

### **✏️ Registro de Asistencia**
- **Registro por docente**: App móvil o web para docentes
- **Registro masivo**: Carga batch de asistencias
- **Validación automática**: Verificación de inscripciones previas
- **Corrección de errores**: Proceso de rectificación de asistencias

### **📈 Cálculo Automático de Regularidad**
- **Cálculo en tiempo real**: Actualización automática de estados
- **Porcentajes por materia**: Cálculo individual por comisión
- **Estado global**: Consolidación de regularidad general
- **Alertas de riesgo**: Notificación de alumnos en riesgo de pérdida

### **📋 Reportes de Asistencia**
- **Reportes por comisión**: Estadísticas detalladas por grupo
- **Reportes individuales**: Historial completo por alumno
- **Tendencias temporales**: Análisis de patrones de asistencia
- **Exportación de datos**: Descarga en múltiples formatos

---

## 📝 **Exámenes**

### **🗓️ Creación de Mesas**
- **Programación de mesas**: Creación de mesas de examen
- **Asignación de tribunales**: Designación de presidente y vocales
- **Gestión de fechas**: Calendario de exámenes por materia
- **Coordinación de recursos**: Aulas y materiales necesarios

### **📋 Inscripción a Mesas**
- **Inscripción automática**: Basada en regularidad y correlativas
- **Validación de requisitos**: Verificación de condiciones para examen
- **Control de capacidad**: Límites de inscriptos por mesa
- **Comunicaciones automáticas**: Notificaciones a alumnos y docentes

### **📊 Carga de Notas**
- **Ingreso de calificaciones**: Interface intuitiva para tribunales
- **Validación automática**: Verificación de rangos y consistencia
- **Cálculo de promedios**: Procesamiento automático de notas finales
- **Historial de modificaciones**: Registro de cambios en calificaciones

### **📜 Generación de Actas**
- **Actas digitales**: Generación automática de actas oficiales
- **Firmas digitales**: Integración con sistema de firmas institucional
- **Validación de integridad**: Verificación de completitud de datos
- **Archivo y conservación**: Almacenamiento seguro y acceso controlado

---

## 💰 **Finanzas**

### **📋 Cuotas y Aranceles**
- **Gestión de aranceles**: Configuración de costos por carrera
- **Cuotas periódicas**: Generación automática de cuotas mensuales
- **Conceptos adicionales**: Cargos por conceptos especiales
- **Actualización de valores**: Ajustes inflacionarios y cambios

### **💳 Pagos**
- **Registro de pagos**: Ingreso manual y automatizado
- **Múltiples medios de pago**: Efectivo, transferencia, tarjeta
- **Comprobantes digitales**: Generación automática de recibos
- **Conciliación bancaria**: Integración con sistemas financieros

### **🎁 Becas y Descuentos**
- **Tipos de becas**: Completa, parcial, transporte, social
- **Criterios de asignación**: Reglas automáticas de elegibilidad
- **Aplicación automática**: Procesamiento basado en criterios
- **Seguimiento de becas**: Control de renovación y mantenimiento

### **📊 Cálculo de Deuda**
- **Cálculo automático**: Procesamiento en tiempo real de deudas
- **Estados financieros**: Al día, con deuda, en plan de pago
- **Bloqueos automáticos**: Restricción de servicios por deuda
- **Reportes de morosidad**: Análisis de cartera de deudas

---

## 📄 **Gestión Documental**

### **📤 Carga de Documentos**
- **Documentos docentes**: Subida de materiales de cátedra
- **Documentos administrativos**: Formularios y comunicados
- **Documentos de alumnos**: Tareas, trabajos y proyectos
- **Validación de formatos**: Control de tipos y tamaños de archivos

### **📥 Descarga de Documentos**
- **Biblioteca digital**: Acceso centralizado a recursos
- **Control de acceso**: Permisos basados en roles y materias
- **Historial de descargas**: Registro de acceso a documentos
- **Versionamiento**: Control de versiones de documentos

### **🗃️ Archivo Institucional**
- **Gestión de expedientes**: Digitalización de expedientes académicos
- **Clasificación documental**: Organización por tipo y período
- **Conservación digital**: Políticas de retención y backup
- **Acceso autorizado**: Control granular de acceso sensible

---

## 🔄 **Integraciones y Automatizaciones**

### **📡 Integraciones Externas**
- **Sistema ministerial**: Sincronización con plataformas educativas
- **Bancos y pagos**: Integración con pasarelas de pago
- **Sistemas de RRHH**: Sincronización de datos de personal
- **Plataformas de comunicación**: Email, SMS y notificaciones push

### **🤖 Automatizaciones Inteligentes**
- **Notificaciones automáticas**: Alertas por eventos importantes
- **Reportes programados**: Envío automático de informes periódicos
- **Procesos batch**: Tareas automáticas de mantenimiento
- **Machine Learning**: Predicciones y recomendaciones básicas

---

## 📊 **Reportes y Analytics**

### **📈 Dashboard Administrativo**
- **KPIs institucionales**: Métricas clave en tiempo real
- **Indicadores académicos**: Tasas de aprobación, deserción, etc.
- **Indicadores financieros**: Ingresos, deudas, becas
- **Indicadores operativos**: Uso del sistema y rendimiento

### **📋 Reportes Personalizados**
- **Reportes académicos**: Por carrera, materia, alumno, docente
- **Reportes financieros**: Por período, concepto, estado
- **Reportes de asistencia**: Estadísticas detalladas y tendencias
- **Exportación flexible**: Múltiples formatos y programación

---

## 🎯 **Funcionalidades por Perfil (Actualizado)**

### **👨‍💼 ADMIN_SISTEMA**
- Acceso completo a todas las funcionalidades del sistema
- Configuración global y parámetros institucionales
- Gestión de usuarios, roles y permisos
- Reportes ejecutivos y estratégicos completos
- Auditoría y logs de todo el sistema

### **🎓 DIRECTOR**
- Gestión académica institucional completa
- Definición y aprobación de políticas académicas
- Aprobación final de actas y certificados
- Supervisión de coordinadores y secretarías
- Reportes de alto nivel y toma de decisiones estratégicas

### **📚 COORDINADOR_CARRERA**
- Gestión de planes de estudio y correlatividades
- Asignación de docentes a materias y comisiones
- Validación de inscripciones y equivalencias
- Seguimiento académico por carrera
- Reportes de rendimiento por carrera

### **👩‍💼 SECRETARIA_ACADEMICA**
- Gestión completa de carreras y materias
- Procesamiento de inscripciones y reinscripciones
- Generación de actas, certificados y constancias
- Gestión de comisiones y cupos
- Reportes académicos detallados

### **💰 SECRETARIA_FINANCIERA**
- Gestión de aranceles, cuotas y conceptos de pago
- Procesamiento de pagos y generación de comprobantes
- Gestión de becas y descuentos
- Control de deudas y bloqueos académicos
- Reportes financieros y contables

### **👨‍🏫 DOCENTES**
- Gestión de sus comisiones y materias asignadas
- Registro de asistencia y control de regularidad
- Carga y gestión de notas y calificaciones
- Comunicación con alumnos de sus comisiones
- Acceso a materiales y recursos didácticos

### **👨‍🎓 ALUMNOS**
- Inscripción a materias, comisiones y mesas de examen
- Consulta de estado académico y financiero
- Acceso a materiales, recursos y comunicaciones
- Trámites personales y solicitudes
- Visualización de progreso y certificados

### **🔑 BEDEL**
- Gestión de aulas y recursos físicos
- Control de acceso y seguridad del campus
- Coordinación logística de exámenes y eventos
- Reportes de ocupación y utilización de espacios
- Comunicación de novedades y emergencias

---

## 🚀 **Roadmap de Funcionalidades**

### **📅 Corto Plazo (3-6 meses)**
- Implementación completa del core académico
- Sistema financiero básico
- Módulo de inscripciones automatizado
- Dashboard administrativo inicial

### **📅 Mediano Plazo (6-12 meses)**
- Integración con sistemas externos
- Módulo avanzado de reportes
- Sistema de notificaciones inteligente
- App móvil para docentes y alumnos

### **📅 Largo Plazo (1-2 años)**
- Analytics y machine learning
- Predicciones académicas y financieras
- Expansión a múltiples instituciones
- Sistema de e-learning integrado

---

*Este documento representa el conjunto completo de funcionalidades que el sistema proveerá al Instituto Paulo Freire, cubriendo todos los aspectos de la gestión académica y administrativa institucional.*
