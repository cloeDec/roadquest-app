# UI System - RoadQuest

Système de design réutilisable pour l'application RoadQuest.

## 📁 Structure

```
src/ui/
├── theme/              # Configuration du thème
│   ├── colors.ts      # Palette de couleurs
│   ├── gradients.ts   # Dégradés
│   ├── typography.ts  # Styles de texte
│   ├── spacing.ts     # Espacements et border-radius
│   └── index.ts       # Export du thème
├── components/        # Composants réutilisables
│   ├── Text.tsx       # Composants de texte (H1-H4, Body, Caption, Small)
│   ├── Button.tsx     # Boutons
│   ├── Input.tsx      # Champs de saisie
│   ├── Card.tsx       # Cartes
│   ├── Container.tsx  # Conteneurs
│   └── index.ts       # Export des composants
└── icons/            # Icônes personnalisées (à ajouter)
```

## 🎨 Thème

### Couleurs

```tsx
import { colors } from '@/src/ui';

// Couleurs de fond
colors.backgroundPrimary      // #0A0E27
colors.backgroundSecondary    // #151B3B
colors.backgroundTertiary     // #1E2749

// Couleurs de marque
colors.brandPrimary           // #4A90E2
colors.brandLight             // #6BA4EC
colors.brandDark              // #357ABD

// Couleurs d'accentuation
colors.accentPrimary          // #FF6B35
colors.accentLight            // #FF8A5C
colors.accentDark             // #E65420

// Couleurs de texte
colors.textPrimary            // #FFFFFF
colors.textSecondary          // #B8C5D6
colors.textTertiary           // #7A8BA3

// Couleurs d'état
colors.success                // #2ECC71
colors.warning                // #F59E0B
colors.danger                 // #E74C3C
colors.info                   // #3B82F6

// Couleurs de bordure
colors.border                 // #2A3555
```

### Gradients

```tsx
import { gradients } from '@/src/ui';

gradients.background    // ["#0A0E27", "#1E2749"]
gradients.brand         // ["#4A90E2", "#6BA4EC"]
gradients.accent        // ["#FF6B35", "#E65420"]
```

### Typographie

```tsx
import { typography } from '@/src/ui';

// Police: Poppins pour tous les textes

typography.h1          // 32px, bold
typography.h2          // 24px, semibold
typography.h3          // 20px, semibold
typography.h4          // 18px, medium
typography.body        // 14px, regular
typography.bodyLarge   // 16px, regular
typography.small       // 10px, medium
typography.caption     // 12px, medium
```

### Espacement

```tsx
import { spacing, borderRadius } from '@/src/ui';

spacing.xs   // 4
spacing.sm   // 8
spacing.md   // 16
spacing.lg   // 24
spacing.xl   // 32
spacing.xxl  // 48
spacing.xxxl // 64

borderRadius.xs   // 4
borderRadius.sm   // 8
borderRadius.md   // 12
borderRadius.lg   // 16
borderRadius.xl   // 24
borderRadius.full // 9999
```

## 📝 Composants

### Text (H1-H4, Body, BodyLarge, Small, Caption)

```tsx
import { H1, H2, H3, H4, Body, BodyLarge, Small, Caption } from '@/src/ui';

<H1 color="accentPrimary" center>Titre principal</H1>
<H2>Sous-titre</H2>
<H3 color="brandPrimary">Titre de section</H3>
<Body color="textSecondary">Texte normal</Body>
<BodyLarge>Texte plus grand</BodyLarge>
<Small>Petit texte</Small>
<Caption>Petite note</Caption>
```

### Button

```tsx
import { Button } from '@/src/ui';

// Bouton basique
<Button onPress={() => console.log('Click')}>
  Cliquez ici
</Button>

// Variants
<Button variant="primary">Primary (brandPrimary)</Button>
<Button variant="secondary">Secondary (accentPrimary)</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Tailles
<Button size="small">Petit</Button>
<Button size="medium">Moyen</Button>
<Button size="large">Grand</Button>

// Avec gradient
<Button gradient="brand">Gradient Brand</Button>
<Button gradient="accent">Gradient Accent</Button>
<Button gradient="background">Gradient Background</Button>

// Avec icônes
<Button leftIcon={<Icon name="check" />}>Avec icône</Button>

// États
<Button loading>Chargement...</Button>
<Button disabled>Désactivé</Button>
<Button fullWidth>Pleine largeur</Button>
```

### Input

```tsx
import { Input, PasswordInput } from '@/src/ui';

// Input basique
<Input
  label="Email"
  placeholder="Entrez votre email"
  value={email}
  onChangeText={setEmail}
/>

// Avec erreur
<Input
  label="Nom d'utilisateur"
  error="Ce champ est requis"
  value={username}
  onChangeText={setUsername}
/>

// Avec hint
<Input
  label="Téléphone"
  hint="Format: +33 6 12 34 56 78"
  value={phone}
  onChangeText={setPhone}
/>

// Password avec toggle
<PasswordInput
  label="Mot de passe"
  value={password}
  onChangeText={setPassword}
/>

// Avec icônes
<Input
  leftIcon={<Icon name="search" />}
  placeholder="Rechercher..."
/>
```

### Card

```tsx
import { Card } from '@/src/ui';

// Card basique
<Card>
  <Text>Contenu de la carte</Text>
</Card>

// Variants
<Card variant="elevated">
  <Text>Carte avec ombre</Text>
</Card>

<Card variant="outlined">
  <Text>Carte avec bordure</Text>
</Card>

// Avec gradient
<Card gradient="brand" padding="lg">
  <Text>Carte avec dégradé brand</Text>
</Card>

<Card gradient="accent" padding="lg">
  <Text>Carte avec dégradé accent</Text>
</Card>
```

### Container

```tsx
import { Container } from '@/src/ui';

// Container basique
<Container>
  <Text>Contenu</Text>
</Container>

// Avec gradient et safe area
<Container gradient="background" safe>
  <Text>Contenu avec SafeAreaView</Text>
</Container>

// Centré
<Container centered padding="xl">
  <Text>Contenu centré</Text>
</Container>
```

## 🎯 Exemple complet

```tsx
import {
  Container,
  H1,
  H2,
  Body,
  Button,
  Input,
  PasswordInput,
  Card,
} from '@/src/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Container gradient="background" safe padding="lg">
      <H1 center color="accentPrimary">RoadQuest</H1>
      <Body center color="textSecondary">L'aventure moto gamifiée</Body>

      <Card variant="elevated" padding="lg">
        <H2>Connexion</H2>

        <Input
          label="Email"
          placeholder="votre@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <PasswordInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
        />

        <Button gradient="brand" fullWidth>
          Se connecter
        </Button>

        <Button variant="ghost" fullWidth>
          Mot de passe oublié ?
        </Button>
      </Card>
    </Container>
  );
}
```

## 🚀 Bonnes pratiques

1. **Toujours utiliser les composants UI** au lieu des composants React Native natifs
2. **Utiliser le thème** pour les couleurs, espacements, etc.
3. **Ne pas hardcoder les valeurs** de style
4. **Favoriser les variants** plutôt que le style inline
5. **Utiliser les gradients** pour les éléments importants
6. **Police Poppins** : Tous les textes utilisent la police Poppins

## 🎨 Palette de couleurs

### Backgrounds
- **Primary** : Fond principal de l'app (#0A0E27)
- **Secondary** : Surfaces, cards (#151B3B)
- **Tertiary** : Surfaces légèrement plus claires (#1E2749)

### Brand (Bleu)
- **Primary** : Couleur principale de la marque (#4A90E2)
- **Light** : Version claire (#6BA4EC)
- **Dark** : Version foncée (#357ABD)

### Accent (Orange)
- **Primary** : Couleur d'accentuation (#FF6B35)
- **Light** : Version claire (#FF8A5C)
- **Dark** : Version foncée (#E65420)

## 📦 Prochaines étapes

- [ ] Ajouter des icônes personnalisées
- [ ] Créer un composant Badge
- [ ] Créer un composant Avatar
- [ ] Créer un composant Modal
- [ ] Créer un composant Alert/Toast
- [ ] Ajouter des animations
- [ ] Intégrer la police Poppins via expo-font
