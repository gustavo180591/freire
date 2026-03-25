# RISK_REGISTER.md
# Registro de Riesgos del Sistema
Instituto Superior de Formación Docente – Paulo Freire

---

## 🎯 Propósito

Identificar, evaluar y gestionar sistemáticamente los riesgos del proyecto para minimizar impactos negativos y asegurar el éxito del Sistema Integral de Gestión Académica.

---

## 📊 Matriz de Evaluación de Riesgos

| Nivel | Probabilidad | Impacto | Severidad |
|-------|--------------|----------|-----------|
| 1 | Muy Baja (<10%) | Muy Bajo | Bajo |
| 2 | Baja (10-30%) | Bajo | Medio |
| 3 | Media (30-60%) | Medio | Alto |
| 4 | Alta (60-80%) | Alto | Crítico |
| 5 | Muy Alta (>80%) | Muy Alto | Crítico |

---

## 1️⃣ Riesgos Técnicos

### 1.1 Riesgo: Performance del Sistema
**Descripción**: El sistema no responde adecuadamente bajo carga de usuarios concurrentes.

| Aspecto | Detalle |
|---------|---------|
| **Categoría** | Técnico |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 4 (Alto) |
| **Severidad** | Alto |
| **Causas Raíz** | - Consultas no optimizadas<br>- Falta de índices adecuados<br>- Arquitectura monolítica |
| **Síntomas** | - Tiempos de respuesta > 3 segundos<br>- Timeouts en operaciones críticas<br>- Caídas del sistema |
| **Mitigación** | - Implementar estrategia de índices completa<br>- Testing de carga con 500 usuarios concurrentes<br>- Arquitectura basada en microservicios |
| **Contingencia** | - Servidores de backup con capacidad escalable<br>- Plan de escalado horizontal automático |
| **Responsable** | Arquitecto de Software |
| **Fecha Revisión** | Sprint 4 |

---

### 1.2 Riesgo: Pérdida de Datos
**Descripción**: Pérdida crítica de información académica o financiera.

| Aspecto | Detalle |
|---------|---------|
| **Categoría** | Técnico |
| **Probabilidad** | 2 (Baja) |
| **Impacto** | 5 (Muy Alto) |
| **Severidad** | Alto |
| **Causas Raíz** | - Fallos en backups<br>- Errores en migración de datos<br>- Corrupción de base de datos |
| **Síntomas** | - Datos inconsistentes<br>- Registros desaparecidos<br>- Errores de integridad |
| **Mitigación** | - Backups diarios automáticos<br>- Replicación en tiempo real<br>- Validaciones de integridad constantes |
| **Contingencia** | - Procedimiento de recuperación desastres<br>- Archivos de backup fuera del sitio |
| **Responsable** | DBA/Administrador de Sistemas |
| **Fecha Revisión** | Sprint 2 |

---

### 1.3 Riesgo: Vulnerabilidades de Seguridad
**Descripción**: Brechas de seguridad que comprometen datos sensibles.

| Aspecto | Detalle |
|---------|---------|
| **Categoría** | Técnico/Seguridad |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 5 (Muy Alto) |
| **Severidad** | Crítico |
| **Causas Raíz** | - Código inseguro<br>- Configuración incorrecta<br>- Falta de encriptación |
| **Síntomas** | - Acceso no autorizado<br>- Fuga de datos<br>- Modificación no autorizada |
| **Mitigación** | - Code review obligatorio<br>- Penetration testing trimestral<br>- Encriptación de datos sensibles |
| **Contingencia** | - Plan de respuesta a incidentes<br>- Comunicación a autoridades correspondientes |
| **Responsable** | Especialista en Seguridad |
| **Fecha Revisión** | Sprint 6 |

---

## 2️⃣ Riesgos Funcionales

### 2.1 Riesgo: Reglas de Negocio Incorrectas
**Descripción**: Implementación incorrecta de validaciones académicas o financieras.

| Aspecto | Detalle |
|---------|---------|
| **Categoría** | Funcional |
| **Probabilidad** | 4 (Alta) |
| **Impacto** | 4 (Alto) |
| **Severidad** | Crítico |
| **Causas Raíz** | - Requisitos ambiguos<br>- Falta de validación con expertos<br>- Cambios no documentados |
| **Síntomas** | - Bloqueos incorrectos de inscripciones<br>- Cálculos erróneos de deuda<br>- Estados académicos inconsistentes |
| **Mitigación** | - Documentación formal de reglas (BUSINESS_RULES.md)<br>- Validación con usuarios expertos<br>- Testing exhaustivo de casos límite |
| **Contingencia** | - Proceso de corrección urgente<br>- Comunicación a usuarios afectados |
| **Responsable** | Analista de Negocio |
| **Fecha Revisión** | Cada Sprint |

---

### 2.2 Riesgo: Incumplimiento Normativo
**Descripción**: El sistema no cumple con reglamentación ministerial o legal.

| Aspecto | Detalle |
|---------|---------|
| **Categoría** | Funcional/Legal |
| **Probabilidad** | 2 (Baja) |
| **Impacto** | 5 (Muy Alto) |
| **Severidad** | Crítico |
| **Causas Raíz** | - Desconocimiento de normativas<br>- Cambios en regulación<br>- Interpretación incorrecta |
| **Síntomas** | - Rechazo de documentación oficial<br>- Sanciones ministeriales<br>- Invalidez de títulos emitidos |
| **Mitigación** | - Asesoría legal permanente<br>- Revisión periódica de normativas<br>- Validación con inspectores ministeriales |
| **Contingencia** | - Plan de adaptación urgente<br>- Recursos legales para defensa |
| **Responsable** | Dirección / Asesor Legal |
| **Fecha Revisión** | Trimestral |

---

## 3️⃣ Riesgos Operativos

### 3.1 Riesgo: Resistencia al Cambio
**Descripción**: Usuarios rechazan o no adoptan el nuevo sistema.

| Aspecto | Detalle |
|---------|---------|
| **Categoría** | Operativo |
| **Probabilidad** | 4 (Alta) |
| **Impacto** | 3 (Medio) |
| **Severidad** | Alto |
| **Causas Raíz** | - Falta de capacitación<br>- Miedo a la tecnología<br>- Comodidad con sistema actual |
| **Síntomas** | - Baja tasa de adopción<br>- Uso de paralelo con sistema antiguo<br>- Quejas constantes |
| **Mitigación** | - Capacitación gradual y personalizada<br>- Involucramiento temprano de usuarios<br>- Soporte dedicado durante transición |
| **Contingencia** | - Extensión del período de paralelo<br>- Refuerzo de capacitación |
| **Responsable** | Jefe de Proyecto |
| **Fecha Revisión** | Sprint 3, 5, 7 |

---

### 3.2 Riesgo: Pérdida de Personal Clave
**Descripción**: Salida de miembros críticos del equipo de desarrollo.

| Aspecto | Detalle |
|---------|---------|
| **Categoría** | Operativo/Recursos |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 4 (Alto) |
| **Severidad** | Alto |
| **Causas Raíz** | - Mejores ofertas laborales<br>- Agotamiento del equipo<br>- Conflictos internos |
| **Síntomas** | - Retrasos en entregas<br>- Disminución de calidad<br>- Pérdida de conocimiento |
| **Mitigación** | - Documentación completa del sistema<br>- Rotación de conocimientos<br>- Políticas de retención |
| **Contingencia** | - Plan de contratación urgente<br>- Consultores externos especializados |
| **Responsable** | RRHH / Gerente de Proyecto |
| **Fecha Revisión** | Mensual |

---

## 4️⃣ Riesgos Financieros

### 4.1 Riesgo: Presupuesto Insuficiente
**Descripción**: El proyecto requiere más recursos de los planeados.

| Aspecto | Detalle |
|---------|---------|
| **Categoría** | Financiero |
| **Probabilidad** | 3 (Media) |
| **Impacto** | 4 (Alto) |
| **Severidad** | Alto |
| **Causas Raíz** | - Estimación incorrecta<br>- Cambios en alcance<br>- Aumento de costos externos |
| **Síntomas** | - Agotamiento de presupuesto<br>- Necesidad de financiamiento adicional<br>- Reducción de funcionalidades |
| **Mitigación** | - Buffer del 20% en presupuesto<br>- Control estricto de cambios<br>- Revisión mensual de costos |
| **Contingencia** | - Fuentes de financiamiento alternativas<br>- Priorización de funcionalidades críticas |
| **Responsable** | Dirección / Administración |
| **Fecha Revisión** | Mensual |

---

## 5️⃣ Plan de Monitoreo y Control

### 5.1 Indicadores de Riesgo (KRI)

| KRI | Umbral | Acción |
|-----|---------|--------|
| **Performance** | Tiempo respuesta > 3 segundos | Alerta automática al equipo técnico |
| **Adopción** | Uso < 70% después de 2 semanas | Plan de capacitación intensiva |
| **Errores** | Tasa de errores > 5% | Code review obligatorio |
| **Presupuesto** | Desvío > 15% | Revisión de alcance y costos |
| **Seguridad** | Intentos de acceso no autorizado > 10/día | Revisión de seguridad inmediata |

### 5.2 Frecuencia de Monitoreo

| Tipo de Riesgo | Frecuencia | Responsable |
|----------------|------------|-------------|
| Técnicos | Diaria | Equipo de desarrollo |
| Funcionales | Por Sprint | Analista de negocio |
| Operativos | Semanal | Jefe de proyecto |
| Financieros | Mensual | Administración |
| Seguridad | Continua | Especialista en seguridad |

---

## 6️⃣ Protocolo de Respuesta a Incidentes

### 6.1 Niveles de Severidad

- **Nivel 1 (Crítico)**: Sistema no disponible, pérdida de datos
- **Nivel 2 (Alto)**: Funcionalidad crítica afectada
- **Nivel 3 (Medio)**: Funcionalidad no crítica afectada
- **Nivel 4 (Bajo)**: Issues menores, mejoras

### 6.2 Tiempos de Respuesta

| Nivel | Detección | Respuesta | Resolución |
|-------|-----------|------------|------------|
| 1 | 15 minutos | 1 hora | 4 horas |
| 2 | 30 minutos | 2 horas | 24 horas |
| 3 | 2 horas | 8 horas | 72 horas |
| 4 | 24 horas | 1 semana | 2 semanas |

---

## 7️⃣ Revisiones y Actualizaciones

### 7.1 Frecuencia de Revisión del Registro

- **Revisión completa**: Trimestral
- **Actualización de riesgos**: Mensual
- **Evaluación de mitigaciones**: Por Sprint
- **Reporte a Dirección**: Trimestral

### 7.2 Criterios de Escalado

Un riesgo se escala a nivel directivo cuando:

- Severidad cambia a Crítico
- Impacto potencial afecta a toda la institución
- Requiere asignación de recursos adicionales
- Implica cambios en el alcance del proyecto

---

## 8️⃣ Lecciones Aprendidas

### 8.1 Registro de Incidentes Pasados

| Fecha | Incidente | Causa | Solución | Lección |
|-------|-----------|-------|----------|---------|
| [Por completar] | [Por completar] | [Por completar] | [Por completar] | [Por completar] |

### 8.2 Mejoras Continuas

- Actualización mensual del registro basada en nuevos riesgos identificados
- Incorporación de lecciones aprendidas de incidentes reales
- Evolución del plan de mitigación basado en efectividad comprobada

---

*Este registro de riesgos es un documento vivo que debe ser actualizado continuamente para reflejar el estado actual del proyecto y las nuevas amenazas que puedan surgir durante el desarrollo y operación del sistema.*
