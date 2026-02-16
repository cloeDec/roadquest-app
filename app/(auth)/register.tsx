import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../src/constants/colors";
import { useAppDispatch } from "../../src/store/hooks";
import { registerUser } from "../../src/store/slices/authSlice";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule";
    }
    if (!/[a-z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une minuscule";
    }
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    return null;
  };

  const handleRegister = async () => {
    if (!email || !username || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Erreur", "Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      Alert.alert("Erreur", passwordError);
      return;
    }

    try {
      await dispatch(registerUser({ email, username, password })).unwrap();
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Erreur", err || "Inscription impossible");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏍️ RoadQuest</Text>
      <Text style={styles.subtitle}>Inscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        placeholderTextColor="#666"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.passwordHint}>
        Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: Colors.dark.background,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: Colors.dark.textSecondary,
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: Colors.dark.text,
    fontSize: 16,
  },
  passwordHint: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
    marginTop: -8,
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  buttonText: {
    color: Colors.dark.text,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: Colors.dark.primary,
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
