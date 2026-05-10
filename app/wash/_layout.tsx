import { Stack } from "expo-router";

export default function WashLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F5EDE0" },
      }}
    />
  );
}
