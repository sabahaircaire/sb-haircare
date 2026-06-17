import { useRef } from "react";
import { Animated, Pressable, View } from "react-native";
import { Text } from "./Text";
import { impact } from "@/lib/haptics";

type Props = {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

export function Choice({ label, description, selected, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    impact("light");
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
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
              // ^ keep cream caption color when selected, it's on bordeaux bg
            >
              {description}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}
