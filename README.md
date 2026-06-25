# RoadQuest Mobile App

Application mobile React Native pour motards avec tracking GPS, POIs et gamification.

## Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| React Native | 0.81 | Framework mobile |
| Expo | 54 | Plateforme de développement |
| TypeScript | 5.9 | Langage |
| Redux Toolkit | 2.11 | State management |
| Expo Router | 6 | Navigation file-based |
| React Native Maps | 1.20 | Cartographie Google Maps |

## Fonctionnalités

- Tracking GPS en temps réel
- Navigation avec calcul d'itinéraires
- Découverte de POIs (cols, routes, monuments...)
- Gamification : XP, niveaux, achievements
- Profil avec statistiques et moto

## Architecture

```
app/                          # Expo Router
├── (auth)/
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/
│   ├── index.tsx            # Carte principale
│   ├── rides.tsx            # Historique trajets
│   ├── awards.tsx           # Achievements
│   ├── profile.tsx          # Profil
│   └── social.tsx
└── trip-detail.tsx

src/
├── components/              # Par feature
│   ├── map/
│   ├── profile/
│   ├── rides/
│   ├── trip-detail/
│   └── achievements/
├── config/
│   ├── constants.ts
│   └── poi-types.ts
├── hooks/
│   ├── useNavigation.ts     # Tracking GPS
│   ├── usePOIDetection.ts   # Détection POIs
│   └── useRouteSearch.ts    # Recherche
├── services/
│   ├── api.ts               # Client Axios
│   └── auth.ts
├── store/
│   └── slices/
│       ├── authSlice.ts
│       ├── tripsSlice.ts
│       ├── poisSlice.ts
│       └── achievementsSlice.ts
├── ui/
│   ├── components/          # Design system
│   └── theme/
└── utils/
    ├── distance.ts          # Calculs GPS
    ├── formatting.ts        # Dates, durées
    └── validation.ts        # Formulaires
```

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env

# 3. Lancer l'application
npm start
```

## Variables d'environnement

```env
# API Backend
EXPO_PUBLIC_API_URL=http://localhost:3000

# OpenRouteService
EXPO_PUBLIC_OPENROUTE_API_KEY=votre_clé
```

## Scripts

```bash
npm start          # Démarrer Expo
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
npm run lint       # Linter
```

## Écrans

| Écran | Route | Description |
|-------|-------|-------------|
| Carte | /(tabs)/ | Google Maps, POIs, navigation |
| Trajets | /(tabs)/rides | Historique, stats |
| Détail | /trip-detail | Trace GPS, infos |
| Awards | /(tabs)/awards | Achievements |
| Profil | /(tabs)/profile | Stats, moto, settings |
| Login | /(auth)/login | Connexion |
| Register | /(auth)/register | Inscription |

## Design System

### Composants UI

```typescript
// Layout
Container, Row, Column, Spacer, Divider

// Typography
Text, Caption

// Inputs
Input, Button, FAB

// Display
Card, Badge, Avatar, Icon, ProgressBar, StatCard

// Navigation
ScreenHeader, SectionHeader, TabBar

// Feedback
EmptyState
```

### Thème

```typescript
colors.brandPrimary      // #FFD700
colors.accentPrimary     // #4A90E2
colors.backgroundPrimary // #0A0E27

spacing.xs  // 4
spacing.sm  // 8
spacing.md  // 16
spacing.lg  // 24
spacing.xl  // 32
```

## Hooks

### useNavigation

```typescript
const {
  isTracking,
  distanceRemaining,
  timeRemaining,
  startNavigation,
  stopNavigation,
} = useNavigation(location, destination, onUpdate, onArrival);
```

### usePOIDetection

```typescript
usePOIDetection(latitude, longitude, isTracking);
```

### useRouteSearch

```typescript
const {
  destination,
  suggestions,
  routeCoordinates,
  searchPlaces,
  selectPlace,
  clearSearch,
} = useRouteSearch();
```

## Authentification

- JWT stocké dans `expo-secure-store`
- Intercepteur Axios automatique
- Redirection sur erreur 401
- Validation formulaires :
  - Email : regex
  - Password : 8+ chars, majuscule, minuscule, chiffre
  - Username : 3+ chars

## Build

```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

## Configuration app.json

```json
{
  "expo": {
    "name": "RoadQuest",
    "slug": "roadquest-app",
    "scheme": "roadquestapp",
    "userInterfaceStyle": "dark",
    "ios": { "bundleIdentifier": "com.roadquest.app" },
    "android": { "package": "com.roadquest.app" }
  }
}
```

## Licence

MIT
