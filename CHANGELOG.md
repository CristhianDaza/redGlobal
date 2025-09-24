# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## 🎨 **Modernización Completa de Estilos Admin** - 2025-01-23

### **Renovación Visual de Secciones Administrativas**
Se implementó una modernización completa de todas las secciones administrativas para unificar el diseño con los estilos mejorados de las páginas de Misión/Visión, Políticas de Privacidad y Cotizaciones Avanzadas.

#### **Secciones Actualizadas**

##### **1. Gestión de Usuarios** (`/src/components/Admin/sections/UsersSection.vue`)
- **Header descriptivo**: Título con icono y descripción de funcionalidad
- **Estadísticas mejoradas**: Cards con iconos gradientes y hover effects
- **Tabla moderna**: Diseño con avatares de usuario, badges de estado y roles
- **Información estructurada**: Datos organizados con mejor jerarquía visual
- **Responsive design**: Adaptación completa para móviles

##### **2. Gestión de Categorías** (`/src/components/Admin/sections/CategoriesSection.vue`)
- **Vista de tarjetas**: Cambio de tabla a grid de tarjetas más visual
- **Estadísticas dinámicas**: Contadores de categorías activas/inactivas
- **Información detallada**: Configuración de colores y botones visible
- **Vista previa mejorada**: Imágenes más grandes con efectos hover
- **Organización clara**: Separación de información por secciones

##### **3. Configuración de Color** (`/src/components/Admin/sections/ColorSection.vue`)
- **Vista previa grande**: Muestra del color principal con overlay
- **Información técnica**: Códigos HEX y RGB con formato monospace
- **Muestras de componentes**: Vista previa del color en botones, enlaces, badges
- **Estadísticas del tema**: Información sobre cobertura y aplicación
- **Interfaz especializada**: Diseño específico para gestión de colores

##### **4. Gestión de Menús** (`/src/components/Admin/sections/MenuSection.vue`)
- **Iconos dinámicos**: Iconos automáticos según tipo de ruta
- **Ordenamiento visual**: Items ordenados por posición con badges
- **Tipos de enlace**: Diferenciación entre rutas internas y externas
- **Estadísticas de navegación**: Contadores de rutas y posiciones
- **Información estructurada**: Configuración clara por elemento

##### **5. Gestión de Catálogos** (`/src/components/Admin/sections/CatalogsSection.vue`)
- **Vista de galería**: Cards con imágenes grandes y overlays
- **Enlaces interactivos**: Vista previa de enlaces con efectos hover
- **Clasificación automática**: Badges para enlaces externos/internos
- **Estadísticas de enlaces**: Contadores por tipo de enlace
- **Estado vacío**: Mensaje informativo cuando no hay catálogos

##### **6. Gestión del Carrusel** (`/src/components/Admin/sections/CarouselSection.vue`)
- **Vista de slides**: Representación visual del carrusel
- **Numeración de posición**: Badges con posición de cada slide
- **Enlaces opcionales**: Manejo de slides con y sin enlaces
- **Estadísticas del carrusel**: Información sobre reproducción y enlaces
- **Overlays informativos**: Información adicional en hover

##### **7. Gestión de Nuestros Clientes** (`/src/components/Admin/sections/OurClientsSection.vue`)
- **Vista de galería**: Cards con logos de clientes y efectos hover
- **Estadísticas de confianza**: Información sobre satisfacción y visibilidad
- **Logos optimizados**: Visualización centrada con filtros grayscale
- **Estado de actividad**: Badges de estado para cada cliente
- **Información estructurada**: Detalles organizados por secciones

##### **8. Gestión de Asesores** (`/src/components/Admin/sections/AdvisorsSection.vue`)
- **Vista de tarjetas**: Cards con información de contacto de asesores
- **Integración WhatsApp**: Botones directos para contacto vía WhatsApp
- **Avatares personalizados**: Iconos de usuario con gradientes
- **Estadísticas de soporte**: Información sobre disponibilidad y cobertura
- **Información de contacto**: Teléfonos y enlaces de WhatsApp organizados

#### **Características Comunes Implementadas**

##### **Diseño Unificado**
- **Header consistente**: Título con icono y descripción en todas las secciones
- **Fondo moderno**: Color de fondo `#f8fafc` para mejor contraste
- **Cards con sombras**: Efectos de elevación y hover consistentes
- **Bordes redondeados**: Radio de 12px en todos los contenedores
- **Espaciado uniforme**: Padding y margins estandarizados

##### **Estadísticas Mejoradas**
- **Iconos con gradientes**: Diferentes colores por tipo de estadística
- **Información estructurada**: Número principal, título y descripción
- **Efectos hover**: Animaciones de elevación en las tarjetas
- **Responsive grid**: Adaptación automática según tamaño de pantalla

##### **Componentes Modernos**
- **Botones actualizados**: Colores consistentes y efectos hover
- **Badges informativos**: Estados y tipos con colores semánticos
- **Tablas/Cards híbridas**: Mejor organización de información
- **Estados vacíos**: Mensajes informativos con iconos

##### **Responsive Design**
- **Mobile-first**: Diseño adaptativo para todos los dispositivos
- **Grids flexibles**: Columnas que se adaptan al espacio disponible
- **Navegación optimizada**: Botones y acciones accesibles en móvil
- **Texto escalable**: Tamaños de fuente apropiados por dispositivo

#### **Mejoras de UX**

##### **Navegación Visual**
- **Jerarquía clara**: Información organizada por importancia
- **Acciones evidentes**: Botones con iconos y colores semánticos
- **Estados visuales**: Feedback inmediato en interacciones
- **Información contextual**: Descripciones y ayudas integradas

##### **Performance**
- **Animaciones CSS**: Transiciones suaves sin JavaScript pesado
- **Lazy loading**: Componentes cargados según necesidad
- **Optimización de imágenes**: Tamaños apropiados y efectos eficientes
- **Código limpio**: Estilos organizados y mantenibles

#### **Consistencia con Páginas de Referencia**
Todos los estilos siguen los patrones establecidos en:
- **MissionVisionSection.vue**: Headers descriptivos y layouts modernos
- **PrivacyPolicySection.vue**: Cards con información estructurada
- **AdvancedQuotesSection.vue**: Estadísticas y tablas modernas

#### **Archivos Modificados**
- ✅ `/src/components/Admin/sections/UsersSection.vue` - Renovación completa
- ✅ `/src/components/Admin/sections/CategoriesSection.vue` - Vista de tarjetas
- ✅ `/src/components/Admin/sections/ColorSection.vue` - Interfaz especializada
- ✅ `/src/components/Admin/sections/MenuSection.vue` - Navegación mejorada
- ✅ `/src/components/Admin/sections/CatalogsSection.vue` - Galería moderna
- ✅ `/src/components/Admin/sections/CarouselSection.vue` - Vista de slides
- ✅ `/src/components/Admin/sections/OurClientsSection.vue` - Galería de clientes
- ✅ `/src/components/Admin/sections/AdvisorsSection.vue` - Tarjetas de asesores

#### **Beneficios de la Modernización**
- **Experiencia unificada**: Todas las secciones admin con el mismo nivel de calidad visual
- **Mejor usabilidad**: Información más clara y acciones más evidentes
- **Responsive completo**: Funcionalidad óptima en todos los dispositivos
- **Mantenibilidad**: Código CSS organizado y reutilizable
- **Escalabilidad**: Patrones establecidos para futuras secciones

La modernización eleva significativamente la calidad visual y funcional del panel administrativo, proporcionando una experiencia consistente y profesional en toda la aplicación.

## 🎨 **Modernización de la Página de Productos** - 2025-01-23

### **Renovación Visual Completa de ProductsView**
Se implementó una modernización completa de la página `/products` transformándola de una vista básica a una experiencia moderna y atractiva que sigue los mismos patrones de diseño de las secciones administrativas.

#### **Mejoras Implementadas**

##### **1. Hero Section** (`ProductsView.vue`)
- **Diseño impactante**: Hero section con gradiente del color principal
- **Estadísticas dinámicas**: Contadores automáticos de categorías, subcategorías y productos
- **Información contextual**: Descripción clara del catálogo de productos
- **Layout responsivo**: Diseño adaptativo con estadísticas en cards glassmorphism

##### **2. Sección de Categorías Mejorada**
- **Header descriptivo**: Título con icono y descripción de funcionalidad
- **Grid optimizado**: Layout mejorado para mejor visualización de categorías
- **Integración perfecta**: Uso del componente CategoryList modernizado

##### **3. Categorías Populares**
- **Sección destacada**: Cards especiales para categorías más solicitadas
- **Iconos temáticos**: Iconos Material específicos por categoría
- **Información detallada**: Descripción y conteo de subcategorías
- **Interactividad**: Efectos hover y navegación directa

##### **4. CategoryList Component Modernizado**
- **Header interactivo**: Cabecera con icono, título y contador de subcategorías
- **Iconos dinámicos**: Mapeo automático de iconos Material por categoría
- **Subcategorías mejoradas**: Lista con iconos chevron y efectos hover
- **Estados visuales**: Transiciones suaves y feedback visual
- **Responsive design**: Adaptación completa para móviles

#### **Características Técnicas**

##### **Cálculos Dinámicos**
```typescript
const totalSubcategories = categories.reduce((total, cat) => total + cat.subcategories.length, 0);

const popularCategories = [
  {
    name: "Tecnología",
    icon: "devices",
    description: "USB, audífonos, accesorios tech y más",
    count: categories.find(c => c.category === "Tecnología")?.subcategories.length || 0
  },
  // ... más categorías populares
];
```

##### **Mapeo de Iconos Inteligente**
```typescript
const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'Bolígrafos': 'edit',
    'Mugs y Vasos': 'local_cafe',
    'Paraguas': 'beach_access',
    'Llaveros': 'vpn_key',
    'Maletines y Morrales': 'work',
    'Libretas': 'menu_book',
    'Tecnología': 'devices',
    'Hogar': 'home',
    'Oficina': 'business',
    'Deportes': 'sports_soccer',
    'Ecológicos': 'eco',
    'Salud y Cuidado': 'health_and_safety',
    'Accesorios y Varios': 'category'
  }
  return iconMap[category] || 'inventory_2'
}
```

#### **Diseño Visual**

##### **Hero Section**
- **Gradiente moderno**: `linear-gradient(135deg, var(--primary-color) 0%, #4299e1 100%)`
- **Estadísticas glassmorphism**: Cards con `backdrop-filter: blur(10px)`
- **Tipografía impactante**: Títulos grandes con iconos integrados
- **Layout grid responsivo**: Adaptación automática según dispositivo

##### **CategoryList Mejorado**
- **Cards elevados**: Sombras y efectos hover con `transform: translateY(-6px)`
- **Header interactivo**: Cambio de color completo en hover
- **Subcategorías modernas**: Items con bordes redondeados y transiciones
- **Iconografía consistente**: Material Icons en toda la interfaz

#### **Responsive Design**
- **Mobile-first**: Diseño optimizado para dispositivos móviles
- **Breakpoints adaptativos**: 1024px, 768px, 480px
- **Layout flexible**: Grids que se adaptan al espacio disponible
- **Tipografía escalable**: Tamaños de fuente apropiados por dispositivo

#### **Mejoras de UX**

##### **Navegación Intuitiva**
- **Jerarquía visual clara**: Categorías principales vs subcategorías
- **Feedback inmediato**: Efectos hover y estados activos
- **Acciones evidentes**: Flechas y iconos que indican interactividad
- **Información contextual**: Contadores y descripciones útiles

##### **Performance**
- **Animaciones CSS**: Transiciones suaves sin JavaScript pesado
- **Lazy loading**: Componentes cargados según necesidad
- **Cálculos optimizados**: Computed properties para datos dinámicos
- **Código limpio**: Estilos organizados y mantenibles

#### **Archivos Modificados**
- ✅ `/src/views/ProductsView.vue` - Renovación completa con hero section
- ✅ `/src/components/categories/CategoryList.vue` - Modernización total del componente

#### **Beneficios de la Modernización**
- **Experiencia premium**: Página de productos con calidad profesional
- **Mejor usabilidad**: Navegación más intuitiva y atractiva
- **Consistencia visual**: Alineada con el resto de la aplicación modernizada
- **Engagement mejorado**: Usuarios más propensos a explorar productos
- **SEO optimizado**: Estructura mejorada para motores de búsqueda

La modernización transforma completamente la experiencia de navegación de productos, elevando significativamente la percepción de calidad y profesionalismo de Red Global Promocional.

## 🎨 **Modernización de la Página de Catálogos** - 2025-01-23

### **Renovación Visual Completa de CatalogsView**
Se implementó una modernización completa de la página `/catalogs` transformándola de una vista básica a una experiencia premium y profesional que destaca la calidad de los catálogos digitales disponibles.

#### **Mejoras Implementadas**

##### **1. Hero Section Impactante** (`CatalogsView.vue`)
- **Diseño premium**: Hero section con gradiente y estadísticas dinámicas
- **Contadores automáticos**: Número de catálogos disponibles calculado dinámicamente
- **Información contextual**: Descripción clara sobre catálogos digitales y descargas
- **Estadísticas glassmorphism**: Cards con formato PDF, descarga gratuita

##### **2. Catálogos Mejorados**
- **Cards premium**: Diseño elevado con imágenes grandes y overlays informativos
- **Overlays interactivos**: Información de tipo PDF y acción de descarga en hover
- **Doble funcionalidad**: Botones separados para "Ver" y "Descargar" catálogos
- **Estados visuales**: Badges de disponibilidad y información detallada

##### **3. Funcionalidades Avanzadas**
- **Función de descarga**: Sistema de descarga directa de catálogos
- **Apertura en nueva pestaña**: Visualización de catálogos sin salir del sitio
- **Información detallada**: Descripción de cada catálogo con iconos informativos
- **Estados de carga**: Loading mejorado con mensajes contextuales

##### **4. Sección de Características**
- **Propuesta de valor**: Sección explicando beneficios de los catálogos
- **Iconos temáticos**: Alta calidad, gran variedad, asesoría personalizada
- **Cards informativas**: Diseño consistente con gradientes diferenciados
- **Contenido persuasivo**: Textos que destacan ventajas competitivas

#### **Características Técnicas**

##### **Funciones de Interacción**
```typescript
const openCatalog = (url: string) => {
  window.open(url, '_blank')
}

const downloadCatalog = (url: string) => {
  const link = document.createElement('a')
  link.href = url
  link.download = ''
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```

##### **Estados Dinámicos**
- **Contador automático**: `{{ catalogs?.length || 0 }}` en hero y estadísticas
- **Estado de carga**: Loading container con mensaje contextual
- **Estado vacío**: Mensaje informativo cuando no hay catálogos
- **Responsive completo**: Adaptación para todos los dispositivos

#### **Diseño Visual**

##### **Hero Section**
- **Gradiente moderno**: `linear-gradient(135deg, var(--primary-color) 0%, #4299e1 100%)`
- **Estadísticas glassmorphism**: `backdrop-filter: blur(10px)` con bordes translúcidos
- **Iconografía específica**: `library_books` para catálogos
- **Layout responsivo**: Grid adaptativo según tamaño de pantalla

##### **Catalog Cards**
- **Elevación premium**: `transform: translateY(-8px)` en hover
- **Overlays informativos**: Gradiente con información de tipo PDF
- **Imágenes optimizadas**: `transform: scale(1.05)` en hover
- **Badges de estado**: Indicadores verdes de disponibilidad

##### **Features Section**
- **Iconos con gradientes**: Diferentes colores por característica
- **Cards interactivas**: Efectos hover con elevación
- **Contenido persuasivo**: Textos que destacan beneficios
- **Layout flexible**: Adaptación automática según espacio

#### **Responsive Design**
- **Mobile-first**: Optimizado para dispositivos móviles
- **Breakpoints**: 1024px, 768px, 480px
- **Grids adaptativos**: Columnas que se ajustan automáticamente
- **Tipografía escalable**: Tamaños apropiados por dispositivo

#### **Mejoras de UX**

##### **Navegación Intuitiva**
- **Doble acción**: Ver en línea o descargar directamente
- **Feedback visual**: Overlays que aparecen en hover
- **Estados claros**: Loading, disponible, vacío
- **Información contextual**: Descripciones y características

##### **Performance**
- **Animaciones CSS**: Transiciones suaves sin JavaScript pesado
- **Lazy loading**: Componentes cargados según necesidad
- **Funciones optimizadas**: Apertura y descarga eficientes
- **Código limpio**: Estilos organizados y mantenibles

#### **Sección de Características**
- **Alta Calidad**: Productos con estándares superiores
- **Gran Variedad**: Amplio catálogo para todas las necesidades
- **Asesoría Personalizada**: Equipo especializado en consultoría

#### **Archivos Modificados**
- ✅ `/src/views/CatalogsView.vue` - Renovación completa con hero section y características

#### **Beneficios de la Modernización**
- **Experiencia premium**: Página de catálogos con calidad profesional
- **Mejor conversión**: Usuarios más propensos a descargar catálogos
- **Funcionalidad dual**: Ver online o descargar según preferencia
- **Propuesta de valor clara**: Beneficios destacados visualmente
- **Consistencia visual**: Alineada con productos y secciones admin

La modernización eleva la página de catálogos a un nivel premium, destacando la calidad y profesionalismo de Red Global Promocional mientras facilita el acceso a los recursos digitales.

## 🎨 **Modernización de la Página de Contacto** - 2025-01-23

### **Renovación Visual Completa de ContactView**
Se implementó una modernización completa de la página `/contact` transformándola en una experiencia profesional y organizada que facilita la comunicación con los clientes potenciales.

#### **Mejoras Implementadas**

##### **1. Header Descriptivo**
- **Diseño consistente**: Header con icono y descripción siguiendo patrones establecidos
- **Información clara**: Descripción sobre atención personalizada
- **Iconografía específica**: `contact_support` para contacto

##### **2. Información de Contacto Mejorada**
- **Sección organizada**: Cards de información con headers descriptivos
- **Iconos con gradientes**: Cada canal de contacto con icono distintivo
- **Efectos hover**: Elevación y cambio de fondo en interacción
- **Información estructurada**: Datos organizados por líneas claras

##### **3. Formulario Modernizado**
- **Header informativo**: Sección con icono y descripción del proceso
- **Campos mejorados**: Mantiene RgFormField pero con mejor organización
- **Textarea personalizado**: Campo de mensaje con diseño moderno
- **Mensaje de éxito**: Notificación verde con icono de confirmación
- **Botón mejorado**: Icono de envío y estilos consistentes

##### **4. Estructura Modular**
- **Dos secciones principales**: Información de contacto y formulario
- **Headers independientes**: Cada sección con su propio título descriptivo
- **Diseño equilibrado**: Grid responsivo 1fr 1.5fr para mejor proporción

#### **Características Técnicas**

##### **Componentes Reutilizados**
- **RgFormField**: Mantiene validación y funcionalidad existente
- **RgButton**: Botón con icono y estilos personalizados
- **contactCards**: Configuración existente de canales de contacto

##### **Funcionalidad Preservada**
- **Validación completa**: Mantiene todas las reglas de validación
- **Envío de emails**: Funcionalidad de emailService intacta
- **Estados de carga**: Loading y disabled states preservados
- **Mensaje de éxito**: Notificación temporal después del envío

#### **Diseño Visual**

##### **Cards de Información**
- **Iconos con gradientes**: `linear-gradient(135deg, var(--primary-color), #4299e1)`
- **Efectos hover**: `transform: translateY(-2px)` con sombras
- **Fondo adaptativo**: Cambio de `#f7fafc` a `white` en hover
- **Bordes redondeados**: `border-radius: 12px` consistente

##### **Formulario Mejorado**
- **Textarea moderna**: Bordes de 2px, padding generoso, bordes redondeados
- **Labels con iconos**: Material Icons integrados en labels
- **Estados de error**: Iconos y colores para feedback visual
- **Mensaje de éxito**: Verde con icono de check_circle

##### **Layout Responsivo**
- **Grid adaptativo**: `1fr 1.5fr` en desktop, `1fr` en móvil
- **Headers con gradientes**: `linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)`
- **Sombras consistentes**: `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08)`

#### **Responsive Design**
- **Mobile-first**: Optimizado para dispositivos móviles
- **Breakpoints**: 1024px, 768px, 480px
- **Grid adaptativo**: Formulario de 2 columnas a 1 columna
- **Cards flexibles**: Información de contacto se adapta al espacio

#### **Mejoras de UX**

##### **Organización Visual**
- **Jerarquía clara**: Headers, secciones y contenido bien diferenciados
- **Información accesible**: Canales de contacto fácilmente identificables
- **Formulario intuitivo**: Campos organizados lógicamente
- **Feedback inmediato**: Estados visuales para todas las interacciones

##### **Funcionalidad Mejorada**
- **Textarea expandido**: Más espacio para mensajes detallados
- **Placeholder descriptivo**: Guía al usuario sobre qué escribir
- **Botón con icono**: Indicación visual clara de la acción
- **Mensajes de error**: Iconos y texto explicativo

#### **Estados Manejados**
- **Carga**: Loading state en botón durante envío
- **Éxito**: Mensaje verde con icono de confirmación
- **Error**: Mensajes de validación con iconos de error
- **Hover**: Efectos visuales en cards y elementos interactivos

#### **Archivos Modificados**
- ✅ `/src/views/ContactView.vue` - Renovación completa sin hero section

#### **Beneficios de la Modernización**
- **Experiencia profesional**: Página de contacto con calidad empresarial
- **Mejor organización**: Información y formulario claramente separados
- **Usabilidad mejorada**: Formulario más intuitivo y accesible
- **Consistencia visual**: Alineada con productos, catálogos y secciones admin
- **Funcionalidad preservada**: Mantiene toda la lógica de validación y envío

La modernización transforma la página de contacto en una herramienta profesional que facilita la comunicación con clientes potenciales, manteniendo toda la funcionalidad existente mientras mejora significativamente la experiencia visual.

## 🚀 Added

* **Mission and Vision Image Management System**

  * Complete mission and vision image management system for administrators.
  * Dynamic image replacement system - administrators can upload custom images for mission and vision sections.
  * Fallback to default SVG placeholders when no custom images are uploaded.
  * Admin-only section accessible via `/admin?tab=mission-vision` with role-based access control.
  * Image upload with validation (images only, max 10MB) and automatic replacement functionality.
  * Cloudinary integration for reliable image storage and CDN delivery.
  * Real-time updates - mission/vision page automatically shows new images without page reload.
  * Global state management with `useGlobalMissionVision` composable for cross-component reactivity.
  * Elegant confirmation modals for delete operations with proper UX feedback.
  * Toast notifications for upload/delete success and error feedback.
  * Complete audit trail tracking who uploaded each image and when.
  * Responsive admin interface with drag-and-drop style upload areas.
  * Seamless integration with existing admin navigation and routing system.
  * Firebase Firestore for metadata storage with Cloudinary for image hosting.
  * Professional UI with loading states, progress indicators, and error handling.

* **Privacy Policy Management System**

  * Complete privacy policy PDF management system for administrators.
  * Migrated from Firebase Storage to Cloudinary for better performance and reliability.
  * Real-time updates without page reload - modal automatically reflects changes when admin uploads/deletes policies.
  * Admin-only section accessible via `/admin?tab=privacy-policy` with role-based access control.
  * PDF upload with strict validation (PDF only, max 10MB) and automatic file replacement.
  * Elegant confirmation modals replacing browser alerts for better UX.
  * Toast notifications for upload/delete success feedback.
  * Global state management with `useGlobalPrivacyPolicy` composable for cross-component reactivity.
  * Cloudinary integration with fallback system and proper error handling.
  * User-facing modal in footer with download functionality and loading states.
  * Complete audit trail tracking who uploaded each document and when.
  * Responsive design working on mobile and desktop devices.

* **Code Quality and Performance Improvements**

  * Comprehensive code cleanup removing unnecessary comments and console.log statements.
  * Fixed all TypeScript errors and type inconsistencies across the application.
  * Eliminated unused imports and variables to reduce bundle size.
  * Standardized enum usage replacing local objects with official TypeScript enums.
  * Consolidated duplicate imports and corrected type definitions.
  * Optimized AdminView.vue by removing unused composable properties and functions.
  * Fixed AdminHeader.vue type mappings for complete tabs enum coverage.
  * Corrected useQuoteAdmin.ts to use proper QuoteStatus enum instead of local object.
  * All files now pass TypeScript strict checking without errors.
  * Build process optimized with cleaner, more maintainable codebase.

* **Enhanced Loading Experience**

  * Redesigned global loader (`RgLoaderGlobal.vue`) with modern aesthetic and multiple color animations.
  * Multi-layered circular animations with soft pastel colors (rose, aqua, sky blue, cream).
  * Dynamic loading text that cycles through different messages every 1.5 seconds.
  * Clean backdrop with blur effect and semi-transparent background for professional appearance.
  * Updated local loader (`RgLoader.vue`) with concentric rings and animated dots for consistency.
  * Responsive design optimized for all device sizes.
  * Smooth animations using CSS transforms for optimal performance.

* **Advisor User Role System**

  * New user role `ADVISOR` added to the system with specific permissions and restrictions.
  * Advisors have access only to the quotations section, cannot modify system configurations.
  * Automatic price increase set to 0% for advisors (they see real prices without markup).
  * Logo upload and color customization disabled for advisor users.
  * Enhanced user creation form with role selection moved to the beginning for better UX.
  * Automatic field cleanup when switching between user roles.
  * Role-based navigation and interface adaptation in admin panel.

* **Enhanced Quote Tracking System**

  * Expanded `QuoteStatusHistory` interface with detailed user information tracking.
  * Added `changedByName` and `changedByRole` fields to track who modified quotations.
  * Complete audit trail showing user name and role (Admin/Advisor/Client) in quote history.
  * Real-time tracking of all quote modifications with user attribution.
  * Enhanced quote detail view displaying modification history with user roles.

* **Role-Based Access Control**

  * Updated router with `allowedRoles` meta field for granular route permissions.
  * Admin sidebar dynamically shows/hides sections based on user role.
  * Automatic redirection to appropriate sections based on user role after login.
  * Enhanced authentication store with `isAdvisor` and `canAccessQuotes` computed properties.

* **Centralized Price Formatting System**

  * New utility module (`/src/utils/formatNumber.ts`) with Colombian locale support.
  * Business logic functions: `calculatePriceWithIncrease()`, `calculatePriceWithIva()`, `formatPriceWithBusinessLogic()`.
  * Validation functions: `isValidPrice()` and `parseFormattedNumber()`.
  * All prices now display as `$1.095.300` (Colombian peso format with thousands separators).

* **Quote Detail Page Migration**

  * Added `/admin/quotes/:id` route for direct access to individual quotations.
  * Dedicated full-page interface with tabs for Details, Comments, and History.
  * Unique URLs for bookmarking and sharing.
  * Real-time history updates and improved visual feedback.
  * Breadcrumb navigation with back button to admin panel.

* **Advanced Quote Management System**

  * Expanded statuses: Pending, In Review, Quoted, Negotiating, Approved, Completed, Cancelled, Expired.
  * New fields: priority levels, assigned users, due dates, estimated/actual values, tags, source tracking, follow-up dates.
  * Comments system (internal + client-facing) with timestamps and user attribution.
  * Full audit trail of status changes with notes.
  * Advanced filtering (by client, email, product, status, etc.).
  * Dual view modes (table & cards).
  * Real-time statistics and conversion metrics.
  * Inline editing for quick updates.
  * Export to CSV with filters.
  * Firebase integration with caching, logging, and error handling.
  * New `useAdvancedQuotes` composable and extended `useQuoteStore`.
  * Complete UI integration with sidebar navigation and modal system.
  * Documentation included.

* **Admin User Enhancements**

  * Hidden users (`isHidden` field) that don’t appear in listings but keep authentication.
  * Last login tracking with display in admin user table.
  * Copy email button with clipboard + notifications.
  * Password reset button for admin users via Firebase Auth.

## ♻️ Changed

* **Privacy Policy System Migration**

  * Completely migrated from Firebase Storage to Cloudinary for PDF storage.
  * Removed all Firebase Storage dependencies and references from the codebase.
  * Updated privacy policy modal to use global state management for automatic updates.
  * Enhanced admin interface with modern confirmation modals instead of browser alerts.
  * Streamlined code by removing unnecessary comments and debug statements.

* **User Management Interface**

  * Moved role selection field to the beginning of user creation form for better workflow.
  * Added automatic field cleanup when switching between user roles.
  * Enhanced user list display to show advisor role properly.
  * Improved form validation and user feedback for role-specific restrictions.

* **Admin Panel Navigation**

  * Sidebar navigation now adapts based on user role (Admin vs Advisor).
  * Advisors see only quotations section, admins see all administrative sections.
  * Enhanced breadcrumb navigation and role-based UI elements.

* **Price Display Standardization**

  * All product, quotation, and modal components updated to use centralized formatting.
  * Preserved logic: user authentication, price increases, IVA toggle, and stock validation.

* **Advanced Quotes Interface Optimization**

  * Simplified header in `AdvancedQuotesSection.vue`.
  * Compact actions bar with results count + essential actions.
  * Removed obsolete buttons (“Complete” and “Delete”) now handled in detail page.
  * Consistent navigation: admin redirects to `/admin?tab=advanced-quotes`.
  * Code cleanup: removed unused enums and functions.

* **Quote Navigation Improvements**

  * AdvancedQuotesSection now uses router navigation instead of modal emit.
  * Default view mode changed from table → cards.
  * “Cotizaciones Avanzadas” renamed to “Cotizaciones” (single entry point).

* **User & Authentication Standardization**

  * All user emails normalized to lowercase.
  * Firestore validation now uses Firebase Auth UID instead of email.
  * Safeguards in Auth store, user creation/update, quotes flow, and admin context.
  * Updated comparisons across app to always use lowercase emails.

* **Quantity Table**

  * Reordered columns: “Fecha Estimada” now appears before “Última Actualización”.

## 🛠 Fixed

* **Privacy Policy System Issues**

  * Fixed Cloudinary upload errors by correcting endpoint configuration and parameter handling.
  * Resolved "Access control Blocked for delivery" issues with proper upload preset configuration.
  * Fixed query parameter routing for direct access to privacy policy admin section.
  * Corrected modal update mechanism to reflect changes without page reload.
  * Fixed Firebase Storage import errors after migration to Cloudinary.
  * Resolved TypeScript errors in privacy policy components and composables.

* **TypeScript and Code Quality Issues**

  * Fixed missing 'advanced-quotes' property in AdminHeader.vue type mappings.
  * Corrected duplicate QuoteStatus imports in useQuoteStore.ts.
  * Resolved unused parameter warnings in AdminView.vue event handlers.
  * Fixed inconsistent enum usage in useQuoteAdmin.ts (replaced local object with official enum).
  * Eliminated unused imports: QuotesSection, QuoteComment, and duplicate tabs imports.
  * Removed unused variables: filteredQuotes, totalQuotes, completedQuotes, handleViewQuote, downloadQuoteSummary, canDeleteQuote.
  * Fixed console.log statements in RgVirtualList.vue and PrivacyPolicyModal.vue.
  * Corrected type inconsistencies preventing successful TypeScript compilation.
  * All files now compile without TypeScript errors or warnings.

* **User Role Management**

  * Fixed TypeScript type issues in role comparison logic.
  * Corrected form field cleanup when switching between user roles.
  * Fixed role-based route access and permissions validation.
  * Resolved authentication redirection issues for different user roles.

* **Quote Tracking System**

  * Fixed missing user information in quote modification history.
  * Corrected quote status update tracking with proper user attribution.
  * Fixed role display in quote history (Admin/Advisor/Client labels).
  * Resolved Firebase document ID consistency issues in quote tracking.

* **Price Formatting Issues**

  * Fixed inconsistent formats (`$3356` vs `$3.356`).
  * Removed browser-dependent locale differences.
  * Consolidated duplicate logic into utilities.

* **Admin Navigation**

  * Fixed redirects after login → advanced quotes.
  * Navbar admin link now points to advanced quotes.
  * QuoteDetailView back button and errors return to advanced quotes.
  * AdminHeader hidden on advanced quotes to avoid UI duplication.

* **Quote Comments & Status**

  * Fixed ID mismatches between quote ID and Firebase document ID.
  * Corrected Firebase subcollection access for comments and history.
  * Auto-reload of comments after add/delete.
  * Status updates properly saved to history and cache invalidation improved.
  * History entries load automatically in chronological order.

* **Advanced Quote Modal**

  * Fixed missing icons (`close` → `cancel`) for cancel/delete buttons.
  * Comments now reactive and update instantly.
  * ESC key closes modal properly with cleanup.
  * Simplified header with clean title + native close button.
  * Fixed TypeScript select element casting errors.
  * Implemented URL-based navigation (`&quoteId=`) for direct access via email links.

* **Admin System Issues**

  * Creating a user no longer logs out the admin (secondary Firebase Auth instance).
  * Fixed primary color not updating on user login.
  * Admin routing now respects query params (`/admin?tab=...`).
  * Fixed inconsistent lookups with email casing in App.vue, Navbar, Footer, ProductView, QuoteModal, QuoteCart, AdminSidebar, AdminView, and router guard.

## [1.6.0] - 11/09/2025
### Added
- **Enhanced quantity table with estimated date**: Added "Fecha Estimada" column to the product quantity table using existing `dataTracking` field to display estimated arrival dates for products in transit
- **Mobile-optimized quantity table**: Implemented responsive card-based layout for mobile devices that eliminates horizontal scrolling and improves readability on small screens

### Fixed
- **Fixed admin API call frequency issue**: Corrected logic where admin users were calling APIs multiple times per day instead of once daily
- **Fixed timezone-based date comparison**: Modified `getDay()` function to use local timezone instead of UTC for proper daily update validation
- **Optimized admin API calling logic**: Added explicit `shouldUpdate()` check in `App.vue` before calling `callServices()` for admin users
- Admin users now properly respect the once-per-day API update schedule, preventing unnecessary API calls within the same day

## [1.5.0] - 11/09/2025
### Added
- **CataProm API Proxy**: Implemented PHP proxy server to handle CataProm API calls from server-side, resolving IP/URL validation issues when calling from SPA
- **StockSur API Proxy**: Implemented PHP proxy server to handle StockSur API calls from server-side, eliminating CORS issues and external proxy dependencies
- Added `VITE_API_CATAPROM_PROXY_URL` environment variable for CataProm proxy configuration
- Added `VITE_API_STOCKSUR_PROXY_URL` environment variable for StockSur proxy configuration
- Created fallback system in `apiConfig.ts` to use proxy URLs with direct APIs as backup

### Fixed
- Fixed admin automatic daily API refresh functionality
- Corrected `getDay()` function to properly compare full dates (YYYY-MM-DD) instead of just day numbers
- Optimized admin API calling logic in App.vue to respect daily update schedule
- Admin users now get automatic API updates once per day without manual intervention
- Fixed carousel navigation arrows not being visible or functional
- Added proper styling and positioning for carousel navigation buttons
- Improved carousel navigation accessibility and responsive design
- **Fixed product image carousel navigation buttons being disabled incorrectly** when multiple images are available
- Corrected thumbnail carousel navigation logic to properly enable/disable buttons based on available images
- **Fixed vue-snap carousel renderSlot error** that occurred when carousel data was not properly loaded
- Added proper conditional rendering and null checks for carousel component to prevent crashes
- Implemented carousel placeholder state when no content is available
- **Resolved CataProm API connectivity issues** by implementing server-side proxy to bypass browser CORS restrictions
- **Resolved StockSur API CORS issues** by replacing external proxy dependency (`allorigins.win`) with internal PHP proxy for better reliability and performance

### Enhanced
- Modernized login modal with contemporary design and improved UX
- Added company logo to login modal header for better brand recognition
- Enhanced login modal with gradient backgrounds and glassmorphism effects
- Improved form inputs with better focus states and animations
- Enhanced ESC key functionality with multiple capture methods and focus management
- Redesigned close button with modern styling and hover effects
- Standardized login button to use app's consistent RgButton component
- Increased company logo size from 80px to 120px for better visibility
- Adjusted login button text size and styling for improved readability
- Ensured button uses app's primary color scheme consistently

## [1.4.0] - 11/09/2025
### Added
- Add lazy loading to imagen.
- Optimize call products.
- Add advisor admin configuration support.

### Changed
- Update menu items to be hidden on small screens.

## [1.3.0] - 04/08/2025
### Dependencies
- Add `vue-snap` to `^1.0.0`

### Added
- Main color functionality with admin configuration support.
- carousel functionality with admin configuration support.

### Changed
- Removed the hero section.
- Refactored the Firebase integration.
- Improved homepage structure to prevent layout shifting (page jumps).
- Visually redesigned the About Us section.
- Visually redesigned the Categories section.

### Fixed
- Fixed a crash in the ourClients section when only one item was present.
- Fixed key mismatch issues in the ourClients component.

## [1.2.0] - 30/07/2025
### Dependencies
- Updated `firebase` to `^12.0.0`
- Updated `@vitejs/plugin-vue` to `^6.0.0`
- Updated `vite` to `^7.0.0`
- Updated `vue-tsc` to `^3.0.0`

### Added
- Maintenance page added for when the site is under maintenance.
- Option to change the main image from the admin panel.
- "Our Clients" section added to the home page and its configuration in admin.

### Changed
- Updated styles for the main menu.
- Updated sidebar styles in the admin panel.
- Changed the color of the global loader.

### Fixed
- Fixed export issues in composables.
- Prevented a navigation crash by ensuring product ID is defined before routing.

## [1.1.0] - 26/05/2025
### Dependencies
- Dependencies are updated to their major versions

### Added
- Global loader added `RgGlobalLoader.vue`
- Added button to delete completed quotes
- Sorting is added to the table that lists quotes
- Added functionality to download the list of quotes
- The `About Us` page is added
- Added functionality to view the modal by URL from an external link
- An email is now sent when a new quote is created
- Build is optimized

### Fixed
- Local images are optimized
- The color displayed in the quotes modal is corrected
- Fixed the styles of the quote modal
- The table class in the admin section is corrected
- Fixed redirection to catalogs when no products exist
- Fixed login with credentials that redirects to the home and not to the admin when the user was authenticated
- The data sent to the email that was not received by the email is corrected.
- Corrected data type from the `lastUpdate`

### Changed
- The status of the quote is better displayed
- Secondary color is removed from user creation
- The button to update quotes from the admin has been removed and can now only be used from the modal
- The text in the footer about us is changed
- The home image and its size are changed
- Contact information is changed
- Unused imports from Firebase such as analytics and storage are removed
- When you enter the admin page, only the necessary information is updated and only if you are an admin

## [1.0.4] - 12/05/2025

### Dependencies
- Change dependencies to use `^` versioning for all packages in `package.json`
- Update `@todovue/tvbutton` to `@todovue/tv-button`
- Updated `firebase` to `11.7.1`
- Updated `vite` to `6.3.5`
- Updated `@vitejs/plugin-vue` to `5.2.4`

### Added
- Added `TvRelativeTime` component to display relative time in product view and admin quote details modal

### Fixed
- Fixed image responsiveness in `ProductView.vue`
- Fixed image responsiveness in `RgCard.vue`

## [1.0.3] - 02/05/2025

### Fixed
- Added null checks for product properties to prevent runtime errors
- Adjusted grid layout for product display and improved responsiveness

### Added
- Added loading indicator and improved catalog loading state management
- Added `calculateTotalQuantity` function to compute total stock quantity based on conditions

### Changed
- Updated titles and meta-tags to use singular form for consistency across views

### Dependencies
- Updated `axios` from `1.8.4` to `1.9.0`
- Updated `firebase` from `11.6.0` to `11.6.1`
- Updated `vue-router` from `4.5.0` to `4.5.1`
- Updated `vite` from `6.3.2` to `6.3.4`

## [1.0.2] - 26/04/2025

### Fixed
- Fixed visual issues on mobile devices in home products.
- Fixed visual issues on mobile devices in `RgScrollToTop.vue`.
- Fixed visual issues on mobile devices in `RgNavBar.vue`.
- Fixed visual issues on mobile devices in `RgHero.vue`.
- Fixed button in `RgScrollToTop.vue` to correctly scroll to the top of the page.
- Updated footer image sizes and adjusted padding for better responsiveness.
- Added responsive visibility rules for menu items on small screens.
- Adjusted grid layout and image height for improved responsiveness.
- Updated image dimensions for a better layout and responsiveness.
- Updated layout and responsiveness of product details and gallery.
- Improved zoom functionality and enhanced image responsiveness for a better user experience.

### Added
- Added a WhatsApp composable to enable reuse across the entire website.
- Integrated `useIsMobile` composable for improved responsive design.

## [1.0.1] - 25/04/2025

### Fixed
- Contact information is corrected

## [1.0.0] - 24/04/2025

### Added

- 🎉 Initial stable release.

[1.6.0]: https://github.com/CristhianDaza/redGlobal/pull/10/files
[1.5.0]: https://github.com/CristhianDaza/redGlobal/pull/9/files
[1.4.0]: https://github.com/CristhianDaza/redGlobal/pull/8/files
[1.3.0]: https://github.com/CristhianDaza/redGlobal/pull/7/files
[1.2.0]: https://github.com/CristhianDaza/redGlobal/pull/6/files
[1.1.0]: https://github.com/CristhianDaza/redGlobal/pull/5/files
[1.0.4]: https://github.com/CristhianDaza/redGlobal/pull/
[1.0.3]: https://github.com/CristhianDaza/redGlobal/pull/4/files
[1.0.2]: https://github.com/CristhianDaza/redGlobal/pull/3/files
[1.0.1]: https://github.com/CristhianDaza/redGlobal/pull/2/files
[1.0.0]: https://github.com/CristhianDaza/redGlobal/pull/1/files
