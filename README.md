# Estudia Colombia - App Móvil de Orientación Universitaria

## 📱 Descripción
App móvil multiplataforma que orienta a estudiantes colombianos sobre opciones universitarias según su puntaje ICFES y brinda tutorías inteligentes personalizadas para mejorar su rendimiento.

## 🎯 Objetivos
- Centralizar información oficial sobre programas universitarios en Colombia
- Predecir las mejores opciones de admisión según ponderados históricos
- Entrenar usuarios con contenido adaptativo basado en sus falencias
- Facilitar procesos de inscripción, alertas de convocatorias y simulacros

## 👥 Público Objetivo
- Estudiantes de grado 11 y egresados
- Aspirantes a universidades públicas
- Padres de familia
- Instituciones educativas rurales

## 🚀 Stack Tecnológico

### Frontend (Mobile)
- **React Native** 0.79.5 con **Expo** 53.0.20
- **Navegación**: @react-navigation/native ^7.x
- **Estado Global**: Zustand ^5.x
- **UI Components**: React Native Paper ^5.x + NativeWind ^4.x
- **Formularios**: Formik + Yup
- **Geolocalización**: expo-location
- **Notificaciones**: expo-notifications

### Backend & Base de Datos
- **Supabase** (PostgreSQL + RESTful API + Realtime)
- **Autenticación**: supabase.auth
- **Almacenamiento**: supabase.storage
- **Realtime updates**: supabase.realtime

## 📋 Funcionalidades Principales

1. **Perfil del Estudiante**
   - Registro y autenticación
   - Datos: puntaje ICFES, geolocalización, intereses académicos

2. **Motor de Recomendación**
   - Basado en ponderados históricos, ubicación, modalidad
   - Integración con base de datos de admisión

3. **Simulador Inteligente de Admisión**
   - Entrenamiento con preguntas reales por área
   - Feedback y estadísticas personalizadas

4. **Entrenador ICFES Adaptativo**
   - Evaluación inicial, detección de falencias
   - Generación automática de sesiones de estudio
   - Gamificación

5. **Alertas y Calendarios**
   - Cronograma nacional por universidad
   - Notificaciones push personalizadas

6. **Blog Educativo**
   - Consejos de estudio
   - Entrevistas con egresados

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js >= 11.2.0
- npm o yarn
- Expo CLI
- Cuenta en Supabase

### Instalación
```bash
# Clonar el repositorio
git clone [repo-url]
cd EstudiaColombiaApp

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

### Configuración de Supabase
1. Crear proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Configurar variables de entorno en `.env`
3. Ejecutar migraciones de base de datos

## 📁 Estructura del Proyecto
```
EstudiaColombiaApp/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── screens/        # Pantallas de la app
│   ├── navigation/     # Configuración de navegación
│   ├── store/          # Estado global (Zustand)
│   ├── services/       # APIs y servicios
│   ├── utils/          # Utilidades y helpers
│   └── types/          # Tipos TypeScript
├── assets/             # Imágenes, iconos, fuentes
├── docs/              # Documentación
└── ...
```

## 💰 Modelo de Negocio
- **Freemium + Suscripción**
- Acceso básico gratuito
- Premium: simulacros ilimitados, analíticas avanzadas, alertas personalizadas
- Valor sugerido: $7.000 - $12.000 COP/mes

## 🚀 Roadmap

### Fase 1 (MVP)
- [ ] Autenticación y perfil de usuario
- [ ] Motor básico de recomendación (10 universidades)
- [ ] Simulador ICFES básico

### Fase 2
- [ ] 20 universidades + simulador completo
- [ ] Entrenador adaptativo con IA
- [ ] Sistema de notificaciones

### Fase 3
- [ ] 100% cobertura nacional
- [ ] Integración universidades privadas
- [ ] Expansión internacional

## 📄 Licencia
[Definir licencia]

## 👨‍💻 Equipo de Desarrollo
- Frontend Developer
- Backend Developer
- UI/UX Designer
- Product Manager

---
*Desarrollado con ❤️ para estudiantes colombianos*
