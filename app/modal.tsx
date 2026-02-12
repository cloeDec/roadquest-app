import { StyleSheet } from "react-native";

export default function ModalScreen() {
  return (
    <div style={styles.container}>
      <h1>This is a modal!</h1>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
