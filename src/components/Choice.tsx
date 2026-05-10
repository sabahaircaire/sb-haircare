import { Pressable, View } from "react-native";
import { Text } from "./Text";

type Props = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

export function Choice({ label, description, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl p-4 mb-3 border ${
        selected
          ? "bg-bordeaux border-bordeaux"
          : "bg-cream-light border-cream-warm"
      }`}
    >
      <View>
        <Text
          variant="body-medium"
          style={{ color: selected ? "#FFFFFF" : "#2A1A1C" }}
        >
          {label}
        </Text>
        {description ? (
          <Text
            variant="caption"
            className="mt-1"
            style={{ color: selected ? "#FBF7ED" : "#8A7378" }}
          >
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
