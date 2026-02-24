import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="(auth)/index">
      <Stack.Screen name="(auth)/index" options={{ title: "Home" }} />
      <Stack.Screen name="(auth)/loginScreen" options={{ title: "Login" }} />
      <Stack.Screen name="(main)"  options={{ headerShown: false }} />
    </Stack>
  );
}