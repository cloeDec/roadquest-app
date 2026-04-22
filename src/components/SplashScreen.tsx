import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import LogoSvg from "../../assets/images/Logo.svg";
import { colors, gradients, gradientConfig } from "../ui";

interface SplashScreenProps {
  onFinish: () => void;
}

// Variable globale pour s'assurer que l'animation ne se joue qu'une fois
let hasAnimationStarted = false;

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const hasCalledFinish = useRef(false);

  useEffect(() => {
    // Cacher immédiatement le splash natif d'Expo
    import("expo-splash-screen").then((SplashScreen) => {
      SplashScreen.hideAsync();
    });

    // Ne démarrer l'animation qu'une seule fois
    if (hasAnimationStarted) {
      // Si l'animation a déjà été faite, appeler onFinish immédiatement
      if (!hasCalledFinish.current) {
        hasCalledFinish.current = true;
        onFinish();
      }
      return;
    }

    hasAnimationStarted = true;

    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      if (!hasCalledFinish.current) {
        hasCalledFinish.current = true;
        setTimeout(onFinish, 200);
      }
    });
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <LinearGradient
      colors={[...gradients.background]}
      start={gradientConfig.start}
      end={gradientConfig.end}
      style={styles.container}
    >
      <View style={styles.content}>
        <LogoSvg width={120} height={120} style={styles.logo} />

        <Text style={styles.title}>RoadQuest</Text>
        <Text style={styles.subtitle}>L&apos;aventure moto gamifiée</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
              },
            ]}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.accentPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "400",
  },
  progressContainer: {
    width: "100%",
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.brandPrimary,
    borderRadius: 3,
  },
});
