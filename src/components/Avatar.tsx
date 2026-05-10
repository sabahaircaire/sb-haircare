import { View } from "react-native";
import { Text } from "./Text";

type Props = { name: string | null | undefined; size?: number };

export function Avatar({ name, size = 56 }: Props) {
  const initial = (name?.trim()?.[0] ?? "S").toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#EFE3CF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#D4A24C",
      }}
    >
      <Text variant="h2" style={{ fontSize: size * 0.4, lineHeight: size * 0.5 }}>
        {initial}
      </Text>
    </View>
  );
}
