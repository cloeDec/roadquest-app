import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Container,
  H1,
  H2,
  H3,
  H4,
  Body,
  BodyLarge,
  Small,
  Caption,
  Button,
  Input,
  PasswordInput,
  Card,
  colors,
  spacing,
} from "@/src/ui";

export default function UIDemo() {
  const [inputValue, setInputValue] = useState("");
  const [password, setPassword] = useState("");
  const [errorInput, setErrorInput] = useState("");

  return (
    <Container gradient="background" safe>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <H1 center color="accentPrimary">
            UI Components Demo
          </H1>
          <Body center color="textSecondary">
            Tous les composants du système UI
          </Body>
        </View>

        {/* TYPOGRAPHY */}
        <Card style={styles.card}>
          <H2 color="brandPrimary">Typographie</H2>
          <View style={styles.componentGroup}>
            <H1>H1 - Titre Principal</H1>
            <H2>H2 - Sous-titre</H2>
            <H3>H3 - Titre de Section</H3>
            <H4>H4 - Titre Secondaire</H4>
            <BodyLarge>Body Large - Texte important</BodyLarge>
            <Body>Body - Texte normal standard</Body>
            <Small>Small - Petit texte</Small>
            <Caption>Caption - Légende ou note</Caption>
          </View>
        </Card>

        {/* COLORS */}
        <Card style={styles.card}>
          <H2 color="brandPrimary">Couleurs de Texte</H2>
          <View style={styles.componentGroup}>
            <Body color="textPrimary">Text Primary (#FFFFFF)</Body>
            <Body color="textSecondary">Text Secondary (#B8C5D6)</Body>
            <Body color="textTertiary">Text Tertiary (#7A8BA3)</Body>
            <Body color="brandPrimary">Brand Primary (#4A90E2)</Body>
            <Body color="accentPrimary">Accent Primary (#FF6B35)</Body>
            <Body color="success">Success (#2ECC71)</Body>
            <Body color="warning">Warning (#F59E0B)</Body>
            <Body color="danger">Danger (#E74C3C)</Body>
            <Body color="info">Info (#3B82F6)</Body>
          </View>
        </Card>

        {/* BUTTONS */}
        <Card style={styles.card}>
          <H2 color="brandPrimary">Boutons - Variants</H2>
          <View style={styles.componentGroup}>
            <Button variant="primary" fullWidth>
              Primary Button
            </Button>
            <Button variant="secondary" fullWidth>
              Secondary Button
            </Button>
            <Button variant="outline" fullWidth>
              Outline Button
            </Button>
            <Button variant="ghost" fullWidth>
              Ghost Button
            </Button>
            <Button variant="danger" fullWidth>
              Danger Button
            </Button>
          </View>
        </Card>

        <Card style={styles.card}>
          <H2 color="brandPrimary">Boutons - Tailles</H2>
          <View style={styles.componentGroup}>
            <Button size="small" fullWidth>
              Small Button
            </Button>
            <Button size="medium" fullWidth>
              Medium Button
            </Button>
            <Button size="large" fullWidth>
              Large Button
            </Button>
          </View>
        </Card>

        <Card style={styles.card}>
          <H2 color="brandPrimary">Boutons - Gradients</H2>
          <View style={styles.componentGroup}>
            <Button gradient="brand" fullWidth>
              Brand Gradient
            </Button>
            <Button gradient="accent" fullWidth>
              Accent Gradient
            </Button>
            <Button gradient="background" fullWidth>
              Background Gradient
            </Button>
          </View>
        </Card>

        <Card style={styles.card}>
          <H2 color="brandPrimary">Boutons - États</H2>
          <View style={styles.componentGroup}>
            <Button loading fullWidth>
              Loading Button
            </Button>
            <Button disabled fullWidth>
              Disabled Button
            </Button>
          </View>
        </Card>

        {/* INPUTS */}
        <Card style={styles.card}>
          <H2 color="brandPrimary">Champs de Saisie</H2>
          <View style={styles.componentGroup}>
            <Input
              label="Input Standard"
              placeholder="Entrez du texte..."
              value={inputValue}
              onChangeText={setInputValue}
            />
            <Input
              label="Input avec Hint"
              placeholder="Votre email"
              hint="Format: nom@exemple.com"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <Input
              label="Input avec Erreur"
              placeholder="Champ requis"
              error="Ce champ est obligatoire"
              value={errorInput}
              onChangeText={setErrorInput}
            />
            <PasswordInput
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </Card>

        {/* CARDS */}
        <Card style={styles.card}>
          <H2 color="brandPrimary">Cartes - Variants</H2>
          <View style={styles.componentGroup}>
            <Card variant="default" padding="md">
              <Body>Card Default</Body>
              <Small color="textSecondary">Carte standard</Small>
            </Card>

            <Card variant="elevated" padding="md">
              <Body>Card Elevated</Body>
              <Small color="textSecondary">Carte avec ombre</Small>
            </Card>

            <Card variant="outlined" padding="md">
              <Body>Card Outlined</Body>
              <Small color="textSecondary">Carte avec bordure</Small>
            </Card>
          </View>
        </Card>

        <Card style={styles.card}>
          <H2 color="brandPrimary">Cartes - Gradients</H2>
          <View style={styles.componentGroup}>
            <Card gradient="brand" padding="lg">
              <H3>Brand Gradient Card</H3>
              <Body color="textPrimary">
                Carte avec dégradé de marque
              </Body>
            </Card>

            <Card gradient="accent" padding="lg">
              <H3>Accent Gradient Card</H3>
              <Body color="textPrimary">
                Carte avec dégradé d'accentuation
              </Body>
            </Card>

            <Card gradient="background" padding="lg">
              <H3>Background Gradient Card</H3>
              <Body color="textPrimary">
                Carte avec dégradé de fond
              </Body>
            </Card>
          </View>
        </Card>

        {/* BACKGROUNDS */}
        <Card style={styles.card}>
          <H2 color="brandPrimary">Couleurs de Fond</H2>
          <View style={styles.componentGroup}>
            <View
              style={[
                styles.colorBox,
                { backgroundColor: colors.backgroundPrimary },
              ]}
            >
              <Body>Background Primary</Body>
              <Small color="textSecondary">#0A0E27</Small>
            </View>

            <View
              style={[
                styles.colorBox,
                { backgroundColor: colors.backgroundSecondary },
              ]}
            >
              <Body>Background Secondary</Body>
              <Small color="textSecondary">#151B3B</Small>
            </View>

            <View
              style={[
                styles.colorBox,
                { backgroundColor: colors.backgroundTertiary },
              ]}
            >
              <Body>Background Tertiary</Body>
              <Small color="textSecondary">#1E2749</Small>
            </View>
          </View>
        </Card>

        {/* SPACING */}
        <Card style={styles.card}>
          <H2 color="brandPrimary">Espacements</H2>
          <View style={styles.componentGroup}>
            <View style={styles.spacingRow}>
              <View style={[styles.spacingBox, { width: spacing.xs }]} />
              <Body>xs - 4px</Body>
            </View>
            <View style={styles.spacingRow}>
              <View style={[styles.spacingBox, { width: spacing.sm }]} />
              <Body>sm - 8px</Body>
            </View>
            <View style={styles.spacingRow}>
              <View style={[styles.spacingBox, { width: spacing.md }]} />
              <Body>md - 16px</Body>
            </View>
            <View style={styles.spacingRow}>
              <View style={[styles.spacingBox, { width: spacing.lg }]} />
              <Body>lg - 24px</Body>
            </View>
            <View style={styles.spacingRow}>
              <View style={[styles.spacingBox, { width: spacing.xl }]} />
              <Body>xl - 32px</Body>
            </View>
            <View style={styles.spacingRow}>
              <View style={[styles.spacingBox, { width: spacing.xxl }]} />
              <Body>xxl - 48px</Body>
            </View>
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  section: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  componentGroup: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  colorBox: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spacingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  spacingBox: {
    height: 24,
    backgroundColor: colors.brandPrimary,
    borderRadius: 4,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});
