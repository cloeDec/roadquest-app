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
import { colors } from "../../src/ui";
import { useAppDispatch } from "../../src/store/hooks";
import { registerUser } from "../../src/store/slices/authSlice";
import { validateEmail, validatePassword, validateUsername } from "../../src/utils";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !username || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const usernameError = validateUsername(username);
    if (usernameError) {
      Alert.alert("Erreur", usernameError);
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
    backgroundColor: colors.backgroundPrimary,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: colors.textPrimary,
    fontSize: 16,
  },
  passwordHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    marginTop: -8,
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: colors.brandPrimary,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  buttonText: {
    color: colors.textPrimary,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: colors.brandPrimary,
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
