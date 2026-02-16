import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/store";
import { AuthProvider } from "../src/components/AuthProvider";

function RootLayoutNav() {
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
