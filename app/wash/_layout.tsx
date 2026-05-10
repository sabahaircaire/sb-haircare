import { Stack } from "expo-router";

export default function WashLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FBF7ED" },
      }}
    />
  );
}
