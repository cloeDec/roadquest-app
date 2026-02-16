# 🏍️ RoadQuest - Application Mobile

Application mobile React Native pour RoadQuest, une plateforme gamifiée pour motards.

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI
- Un émulateur iOS/Android ou l'app Expo Go sur votre téléphone

## 🚀 Installation

1. Cloner le projet
```bash
cd roadquest-app
```

2. Installer les dépendances
```bash
npm install
```

3. Créer un fichier `.env` à partir du fichier exemple
```bash
cp .env.example .env
```

4. Configurer l'URL de l'API dans le fichier `.env`
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
# ou votre adresse IP locale pour tester sur un téléphone
# EXPO_PUBLIC_API_URL=http://192.168.1.X:3000
```

## 🏃 Lancement de l'application

```bash
# Démarrer le serveur Expo
npm start

# Ou directement sur Android
npm run android

# Ou directement sur iOS
npm run ios
```

## 📁 Structure du projet

```
roadquest-app/
├── app/                          # Routes et écrans (Expo Router)
│   ├── (auth)/                   # Groupe d'authentification
│   │   ├── login.tsx            # Écran de connexion
│   │   ├── register.tsx         # Écran d'inscription
│   │   └── _layout.tsx          # Layout pour auth
│   ├── (tabs)/                   # Groupe des tabs principales
│   │   ├── index.tsx            # Écran d'accueil
│   │   ├── explore.tsx          # Écran d'exploration
│   │   └── _layout.tsx          # Layout avec tabs
│   └── _layout.tsx              # Layout racine
│
├── src/
│   ├── components/              # Composants réutilisables
│   │   └── AuthProvider.tsx    # Provider de protection des routes
│   ├── constants/               # Constantes de l'app
│   │   └── colors.ts            # Palette de couleurs
│   ├── services/                # Services API
│   │   ├── api.ts              # Configuration Axios
│   │   └── auth.ts             # Service d'authentification
│   └── store/                   # Redux store
│       ├── index.ts            # Configuration du store
│       ├── hooks.ts            # Hooks Redux typés
│       └── slices/
│           └── authSlice.ts    # Slice d'authentification
│
├── .env.example                 # Exemple de configuration
├── package.json
└── tsconfig.json
```

## 🔒 Fonctionnalités de sécurité implémentées

### 1. Gestion sécurisée des tokens
- Stockage dans `expo-secure-store` (chiffré)
- Suppression automatique en cas d'erreur 401
- Vérification au démarrage de l'application

### 2. Protection des routes
- `AuthProvider` vérifie l'authentification
- Redirection automatique vers login si non authentifié
- Redirection vers l'app si déjà authentifié

### 3. Validation des formulaires
- **Email** : Format validé avec regex
- **Mot de passe** :
  - Minimum 8 caractères
  - Au moins 1 majuscule
  - Au moins 1 minuscule
  - Au moins 1 chiffre
- **Username** : Minimum 3 caractères

### 4. Actions Redux asynchrones
- Toutes les opérations async utilisent `createAsyncThunk`
- Pas d'opérations asynchrones dans les reducers
- Gestion d'erreurs centralisée

## 🛠️ Technologies utilisées

- **React Native** : Framework mobile
- **Expo** : Toolchain et SDK
- **Expo Router** : Navigation basée sur le système de fichiers
- **Redux Toolkit** : Gestion d'état
- **Axios** : Client HTTP
- **TypeScript** : Typage statique
- **Expo Secure Store** : Stockage sécurisé

## 🔑 Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification :

1. L'utilisateur se connecte via `/api/auth/login`
2. Le token JWT est stocké dans `expo-secure-store`
3. Le token est ajouté automatiquement à chaque requête via un intercepteur Axios
4. En cas d'erreur 401, le token est supprimé et l'utilisateur est redirigé vers login

## 📱 Flux d'authentification

```
Démarrage App
    ↓
AuthProvider vérifie le token
    ↓
├─ Token valide → Afficher l'app
└─ Token invalide → Rediriger vers Login
    ↓
Connexion réussie
    ↓
Stocker token + user
    ↓
Rediriger vers l'app
```

## 🎨 Personnalisation

### Couleurs

Les couleurs sont définies dans [src/constants/colors.ts](src/constants/colors.ts):

```typescript
export const Colors = {
  dark: {
    background: "#0A0E27",
    surface: "#151B3B",
    primary: "#6C63FF",
    secondary: "#4ECDC4",
    accent: "#FF6B6B",
    text: "#FFFFFF",
    textSecondary: "#9CA3AF",
    // ...
  }
};
```

## 🐛 Debugging

### Voir les logs Redux
Les actions Redux sont loggées dans la console Expo Dev Tools.

### Problèmes de connexion à l'API
1. Vérifier que le backend est lancé
2. Vérifier l'URL dans `.env`
3. Si vous testez sur un téléphone, utiliser l'IP locale (pas localhost)

### Erreur de token
Le token est automatiquement supprimé en cas d'erreur. Reconnectez-vous.

## 📝 Scripts disponibles

```bash
npm start          # Démarrer Expo
npm run android    # Lancer sur Android
npm run ios        # Lancer sur iOS
npm run web        # Lancer sur le web
npm run lint       # Linter le code
```

## 🔄 Prochaines améliorations

- [ ] Refresh token automatique
- [ ] Mode hors ligne
- [ ] Cache des données
- [ ] Biométrie (Face ID / Touch ID)
- [ ] Notifications push
- [ ] Tests unitaires et d'intégration

## 📄 Licence

Ce projet fait partie de RoadQuest.

## 👥 Auteurs

Développé avec Claude Code
