import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import LogoSvg from "../../assets/images/Logo.svg";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    // Cacher immédiatement le splash natif d'Expo
    import("expo-splash-screen").then((SplashScreen) => {
      SplashScreen.hideAsync();
    });

    Animated.timing(progress, {
      toValue: 1,
      // duration: Infinity,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(onFinish, 200);
    });
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <LinearGradient
      colors={["#0A0E27", "#1E2749"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <LogoSvg width={120} height={120} style={styles.logo} />

        <Text style={styles.title}>RoadQuest</Text>
        <Text style={styles.subtitle}>L'aventure moto gamifiée</Text>
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
    color: "#FF8C42",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
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
    backgroundColor: "#6C63FF",
    borderRadius: 3,
  },
});
