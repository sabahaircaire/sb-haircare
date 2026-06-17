import { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, View } from "react-native";
import { colors } from "@/theme/colors";

// Confettis légers de célébration — montés une fois, jouent puis disparaissent.
// Aucune dépendance externe : React Native Animated, marche web + natif.

const PIECE_COLORS = [
  colors.ocre.DEFAULT,
  colors.ocre.soft,
  colors.bordeaux.soft,
  colors.bordeaux.light,
  colors.cream.warm,
];
const PIECE_COUNT = 16;

function ConfettiPiece({ index }: { index: number }) {
  const { width, height } = Dimensions.get("window");
  const startLeft = useRef(Math.random() * width).current;
  const drift = useRef((Math.random() - 0.5) * 120).current;
  const delay = useRef(Math.random() * 180).current;
  const size = useRef(6 + Math.random() * 7).current;
  const fall = useRef(height * 0.55 + Math.random() * height * 0.2).current;
  const spin = useRef(
    (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
  ).current;
  const duration = useRef(1100 + Math.random() * 600).current;
  const color = PIECE_COLORS[index % PIECE_COLORS.length];
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, fall],
  });
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, drift],
  });
  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", `${spin}deg`],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: startLeft,
        top: 0,
        width: size,
        height: size * 1.4,
        borderRadius: 2,
        backgroundColor: color,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate }],
      }}
    />
  );
}

export function ConfettiBurst() {
  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
    >
      {Array.from({ length: PIECE_COUNT }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
}
