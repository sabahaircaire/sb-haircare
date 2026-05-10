import { View } from "react-native";

type Props = {
  total: number;
  current: number;
};

export function ProgressDots({ total, current }: Props) {
  return (
    <View className="flex-row gap-2 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-1.5 rounded-full ${
            i === current
              ? "w-8 bg-bordeaux"
              : i < current
                ? "w-1.5 bg-bordeaux"
                : "w-1.5 bg-cream-warm"
          }`}
        />
      ))}
    </View>
  );
}
