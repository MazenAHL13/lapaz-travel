markdown
# La Paz Travel 

Una aplicación móvil React Native/Expo para descubrir y explorar lugares turísticos en La Paz, Bolivia. Incluye autenticación, gestión de favoritos, mapas interactivos, cálculo de rutas y un sistema de administración de lugares.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías y Librerías](#-tecnologías-y-librerías)
- [Instalación y Setup](#-instalación-y-setup)
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

## 📦 Instalación y Setup

### Prerrequisitos

- Node.js >= 18.x
- npm o yarn
- Expo CLI: `npm install -g expo-cli`
- Cuenta de Firebase
- Cuenta de Cloudinary
- Google Maps API Key

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/lapaz-travel-app.git
cd lapaz-travel-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:
```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=tu_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Cloudinary
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset

# Google Maps
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_key
```

4. **Configurar Firebase**

- Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
- Habilita Authentication (Email/Password)
- Crea una base de datos Firestore
- Configura las reglas de seguridad:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /places/{placeId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. **Configurar Cloudinary**

- Crea una cuenta en [Cloudinary](https://cloudinary.com)
- Crea un upload preset unsigned
- Anota tu cloud name y upload preset

6. **Habilitar Google Directions API**

- Ve a [Google Cloud Console](https://console.cloud.google.com)
- Habilita Directions API
- Crea una API Key
- (Opcional) Restringe el uso de la API

7. **Iniciar el proyecto**
```bash
# Desarrollo
npx expo start

# iOS
npx expo start --ios

# Android
npx expo start --android
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
## 👥 Equipo de Desarrollo
Mazen Abu Hamdan 
Fidel Aguilera 
Diego Alba

## 🧠 Aprendizajes y Retos Técnicos

- Implementar **autenticación y Firestore** en Expo
- Manejo de **geolocalización y cálculos de distancia** en tiempo real.
- Subida y gestión de imágenes con **Cloudinary** desde móviles.
- Coordinación de estados globales con **Zustand y persistencia**.
- Diseño adaptable para modo oscuro y pantallas pequeñas.
