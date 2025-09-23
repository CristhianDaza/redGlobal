# Guía del Sistema Avanzado de Cotizaciones

## 🚀 Introducción

El Sistema Avanzado de Cotizaciones es una mejora completa del sistema de cotizaciones existente que proporciona herramientas profesionales para la gestión, seguimiento y análisis de cotizaciones.

## 📋 Características Principales

### 🔄 Estados Avanzados de Cotización
- **Pendiente** (`pending`): Cotización recién creada
- **En Revisión** (`in_review`): Cotización siendo evaluada
- **Cotizada** (`quoted`): Precio enviado al cliente
- **Negociando** (`negotiating`): En proceso de negociación
- **Aprobada** (`approved`): Cliente aprobó la cotización
- **Completada** (`completed`): Venta finalizada
- **Cancelada** (`cancelled`): Cotización cancelada
- **Expirada** (`expired`): Cotización vencida

### 📊 Dashboard de Estadísticas
- Total de cotizaciones
- Tasa de conversión
- Valor promedio de cotizaciones
- Distribución por estado y prioridad

### 🔍 Filtros Avanzados
- **Búsqueda**: Por cliente, email, ID o producto
- **Estado**: Filtrar por cualquier estado
- **Prioridad**: Baja, Media, Alta, Urgente
- **Fecha**: Hoy, última semana, último mes
- **Limpieza rápida**: Botón para limpiar todos los filtros

### 👁️ Vistas Duales
- **Vista Tabla**: Información densa para análisis
- **Vista Tarjetas**: Visual y fácil de escanear

## 🛠️ Funcionalidades Técnicas

### 🔧 Backend Implementado

#### Servicios Firebase (`quotesFirebase.ts`)
```typescript
// Obtener cotizaciones con filtros
await quotesFirebase.getQuotesByStatus(QuoteStatus.PENDING)
await quotesFirebase.getQuotesByUser(userId)
await quotesFirebase.searchQuotes('término de búsqueda')

// Actualizar campos
await quotesFirebase.updateQuoteStatus(id, status, notes, changedBy)
await quotesFirebase.updateQuoteField(id, 'priority', 'high')

// Estadísticas
const stats = await quotesFirebase.getQuoteStats()

// Exportar datos
const data = await quotesFirebase.exportQuotes(filters)
```

#### Composable (`useAdvancedQuotes.ts`)
```typescript
const {
  quotes,
  isLoading,
  updateQuoteStatus,
  updateQuotePriority,
  exportQuotes,
  refreshData
} = useAdvancedQuotes()
```

#### Store Extendido (`useQuoteStore.ts`)
```typescript
// Nuevas funciones agregadas
await quoteStore.updateQuoteField(id, field, value)
const stats = await quoteStore.getQuoteStats()
await quoteStore.searchQuotes(term)
await quoteStore.exportQuotes(filters)
```

### 📱 Componentes de Interfaz

#### Sección Principal (`AdvancedQuotesSection.vue`)
- Dashboard con métricas
- Filtros avanzados
- Tabla y vista de tarjetas
- Acciones rápidas

#### Modal de Detalles (`AdvancedQuoteDetailsModal.vue`)
- Tabs organizadas (Detalles, Comentarios, Historial)
- Edición inline de campos
- Sistema de comentarios
- Historial de cambios

## 🎯 Cómo Usar el Sistema

### 1. Acceso al Sistema
1. Inicia sesión como administrador
2. Ve a la sección "Cotizaciones Avanzadas" en el sidebar
3. El sistema cargará automáticamente todas las cotizaciones

### 2. Navegación y Filtros
```
┌─ Dashboard de Estadísticas ─┐
│ Total: 150 | Conversión: 23% │
│ Valor Promedio: $2,500      │
└─────────────────────────────┘

┌─ Filtros Avanzados ─────────┐
│ [Buscar...] [Estado▼] [Prioridad▼] [Fecha▼] [Limpiar] │
└─────────────────────────────┘

┌─ Vista de Datos ────────────┐
│ [Tabla] [Tarjetas] [Exportar] │
│ ┌─────────────────────────┐ │
│ │ Lista de cotizaciones   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 3. Gestión de Cotizaciones

#### Cambiar Estado
1. Haz clic en el dropdown de estado en la tabla
2. Selecciona el nuevo estado
3. El cambio se guarda automáticamente
4. Se registra en el historial

#### Editar Prioridad
1. Haz clic en el dropdown de prioridad
2. Selecciona: Baja, Media, Alta, o Urgente
3. El color del indicador cambia automáticamente

#### Ver Detalles
1. Haz clic en el botón "👁️" (Ver)
2. Se abre el modal con tabs:
   - **Detalles**: Información completa y editable
   - **Comentarios**: Notas internas y del cliente
   - **Historial**: Registro de cambios

### 4. Exportación de Datos
1. Aplica los filtros deseados
2. Haz clic en "Exportar"
3. Se descarga un archivo CSV con:
   - ID, Cliente, Email, Estado
   - Prioridad, Valor Estimado
   - Fechas de creación y actualización

## 🔄 Flujo de Trabajo Recomendado

### Para Nuevas Cotizaciones
```
Pendiente → En Revisión → Cotizada → Negociando → Aprobada → Completada
                                        ↓
                                   Cancelada/Expirada
```

### Gestión Diaria
1. **Mañana**: Revisar cotizaciones pendientes
2. **Mediodía**: Actualizar estados de negociaciones
3. **Tarde**: Revisar métricas y exportar reportes
4. **Seguimiento**: Usar comentarios para notas importantes

## 📈 Métricas y Análisis

### Dashboard Principal
- **Total**: Número de cotizaciones filtradas
- **Conversión**: Porcentaje de completadas vs total
- **Valor Promedio**: Promedio de valores estimados
- **Por Estado**: Distribución visual por estado

### Reportes Exportables
- Filtros por fecha, estado, prioridad
- Formato CSV compatible con Excel
- Datos completos para análisis externo

## 🔧 Configuración Técnica

### Campos Personalizables
```typescript
interface Quote {
  // Campos básicos
  id: string
  userName: string
  userEmail: string
  status: QuoteStatus
  items: QuoteItem[]
  
  // Campos avanzados
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  estimatedValue?: number
  actualValue?: number
  tags?: string[]
  clientNotes?: string
  internalNotes?: string
  statusHistory?: QuoteStatusHistory[]
}
```

### Configuración de Estados
```typescript
const statusConfig = {
  pending: { label: 'Pendiente', color: '#f59e0b' },
  in_review: { label: 'En Revisión', color: '#3b82f6' },
  quoted: { label: 'Cotizada', color: '#8b5cf6' },
  // ... más estados
}
```

## 🚨 Solución de Problemas

### Problemas Comunes

#### Las cotizaciones no cargan
- Verificar conexión a Firebase
- Revisar permisos de usuario
- Comprobar logs en consola

#### Los filtros no funcionan
- Limpiar filtros y volver a aplicar
- Verificar formato de fechas
- Revisar términos de búsqueda

#### Error al exportar
- Verificar que hay datos para exportar
- Comprobar permisos de descarga del navegador
- Intentar con menos filtros

### Logs y Debugging
```javascript
// Habilitar logs detallados
localStorage.setItem('debug', 'true')

// Ver estado del composable
console.log(useAdvancedQuotes())

// Verificar datos en Firebase
console.log(await quotesFirebase.getQuotes())
```

## 🔄 Migración desde Sistema Anterior

### Compatibilidad
- ✅ Cotizaciones existentes funcionan sin cambios
- ✅ Estados antiguos se mapean automáticamente
- ✅ Campos nuevos son opcionales

### Proceso de Migración
1. Las cotizaciones existentes mantienen su funcionalidad
2. Los nuevos campos se agregan gradualmente
3. El sistema anterior sigue disponible en paralelo

## 📞 Soporte

Para problemas técnicos o preguntas sobre el sistema:
1. Revisar esta documentación
2. Comprobar logs en consola del navegador
3. Verificar configuración de Firebase
4. Contactar al equipo de desarrollo

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2024  
**Compatibilidad**: Vue 3, Firebase 9+, TypeScript 4+
