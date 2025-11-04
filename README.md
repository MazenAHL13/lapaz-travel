markdown
# La Paz Travel 

Una aplicación móvil React Native/Expo para descubrir y explorar lugares turísticos en La Paz, Bolivia. Incluye autenticación, gestión de favoritos, mapas interactivos, cálculo de rutas y un sistema de administración de lugares.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías y Librerías](#-tecnologías-y-librerías)
- [Instalación y Setup](#-instalación-y-setup)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades Principales](#-funcionalidades-principales)

## ✨ Características

- **Autenticación completa**: Login, registro y recuperación de contraseña con Firebase Auth
- **Exploración de lugares**: Búsqueda, filtrado por zona/categoría y ordenamiento
- **Sistema de favoritos**: Marca y guarda tus lugares preferidos
- **Mapas interactivos**: Visualización de lugares cercanos con React Native Maps
- **Cálculo de rutas**: Integración con Google Directions API para trazar rutas
- **Estimación de distancia y tiempo**: Cálculo inteligente según zona de tráfico
- **Perfil de usuario**: Edición de avatar (con Cloudinary) y preferencias. Usuarios tipo admin, pueden subir borrar y editar Places.
- **Tema claro/oscuro**: Sistema de temas persistente
- **Panel de administración**: CRUD completo de lugares para usuarios admin
- **Chat IA (preparado)**: Interfaz lista para integrar asistente de viaje

## 🏗 Arquitectura

La aplicación sigue una arquitectura modular con las siguientes capas:
```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Screens, Components, UI)        │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│    (Hooks, Utils, Calculations)     │
├─────────────────────────────────────┤
│          State Management           │
│    (Zustand Stores + Persistence)   │
├─────────────────────────────────────┤
│         Services Layer              │
│  (Firebase, Cloudinary, Google API) │
└─────────────────────────────────────┘
```

## 🛠 Tecnologías y Librerías

### Core

- **React Native**: Framework principal
- **Expo**: ^52.0.23 - Plataforma de desarrollo y build
- **TypeScript**: Tipado estático
- **Expo Router**: Navegación basada en sistema de archivos

### State Management

- **Zustand**: 5.0.2 - Store ligero y eficiente
- **AsyncStorage**: Persistencia local

### Backend & Cloud

- **Firebase**:
  - Authentication: Gestión de usuarios
  - Firestore: Base de datos en tiempo real
  - Storage: (configurado para uso futuro)
- **Cloudinary**: Almacenamiento y optimización de imágenes

### Mapas & Geolocalización

- **React Native Maps**: Visualización de mapas
- **Expo Location**: Geolocalización del usuario
- **Google Directions API**: Cálculo de rutas
- **@mapbox/polyline**: Decodificación de rutas

### UI & Styling

- **React Native Reanimated**: Animaciones fluidas
- **Ionicons** (@expo/vector-icons): Iconografía
- **React Native Markdown Display**: Renderizado de Markdown

### Image & Media

- **Expo Image Picker**: Selección de fotos
- **React Native Image Viewing**: Visor de imágenes


## 🎯 Funcionalidades Principales

### 1. Sistema de Autenticación

- Registro con email, nombre de usuario y contraseña
- Login con validación de credenciales
- Recuperación de contraseña por email
- Sesión persistente con Firebase Auth

### 2. Exploración de Lugares

- **Búsqueda en tiempo real**: Filtrado por nombre
- **Filtros avanzados**: Por zona (Villa Pabón, Sopocachi, etc.) y categoría (Mirador, Museo, Parque)
- **Ordenamiento**: Sin orden, cercanos primero, alfabético
- **Tarjetas interactivas**: Con imagen, título, subtítulo y botón de favorito

### 3. Detalle de Lugares

- Galería de imágenes (cover + secundaria)
- Información completa: horarios, tips, descripción
- Cálculo de distancia en tiempo real
- Estimación de tiempo en auto/a pie según zona de tráfico
- Botón "Cómo llegar" con mapa y ruta
- Integración con Google/Apple Maps
- Lugares relacionados (misma zona o categoría)

### 4. Sistema de Favoritos

- Almacenamiento persistente por usuario
- Animación de rebote al marcar/desmarcar
- Pantalla dedicada de favoritos
- Sincronización con el estado global

### 5. Planificación de Recorrido

- **Mapa interactivo**: Lugares cercanos con marcadores
- **Callouts personalizados**: Tap en marcador para ver detalle
- **Carrusel de lugares cercanos**: Acceso rápido a lugares próximos
- Botón de acceso al chat IA (próximamente)

### 6. Perfil de Usuario

- Edición de nombre
- Cambio de foto de perfil (upload a Cloudinary)
- Indicador de rol (Admin/User)
- Opción de eliminar foto
- Cierre de sesión

### 7. Panel de Administración (Solo Admin)

- **Crear lugares**: Formulario completo con imágenes
- **Editar lugares**: Actualización de información
- **Eliminar lugares**: Con confirmación
- Upload de imágenes a Cloudinary
- Validación de campos requeridos

### 8. Tema Claro/Oscuro

- Sistema de temas completo
- Persistencia de preferencia en Firestore
- Sincronización entre dispositivos
- Paleta de colores adaptada a cada tema


### Estructura de datos

#### Usuario (Firestore: `users`)
```typescript
{
  uid: string;
  email: string;
  name?: string;
  avatar?: string;
  darkMode?: boolean;
  role?: "user" | "admin";
  createdAt: Timestamp;
}
```

#### Lugar (Firestore: `places`)
```typescript
{
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  schedule?: string;
  categoria: string;
  zona: string;
  latitude?: number;
  longitude?: number;
  tips?: string[];
  imageUri?: string;
  coverUri?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}
```
