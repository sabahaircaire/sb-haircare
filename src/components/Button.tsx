import { useRef } from "react";
import { Animated, Pressable, PressableProps, Text } from "react-native";
import { impact, success } from "@/lib/haptics";

type Variant = "primary" | "secondary" | "ghost";
type HapticIntensity = "light" | "medium" | "heavy" | "success" | "none";

type Props = PressableProps & {
  variant?: Variant;
  label: string;
  /** Haptic style fired on press-in. Default "medium" for primary, "light" for others. */
  haptic?: HapticIntensity;
};

export function Button({
  variant = "primary",
  label,
  haptic,
  className,
  onPressIn,
  disabled,
  ...rest
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const containerClasses = {
    primary: "bg-bordeaux active:bg-bordeaux-deep",
    secondary: "bg-cream-warm active:bg-cream",
    ghost: "bg-transparent border border-bordeaux active:bg-cream-warm",
  };

  const textClasses = {
    primary: "text-white",
    secondary: "text-bordeaux",
    ghost: "text-bordeaux",
  };

  const defaultHaptic: HapticIntensity =
    haptic ?? (variant === "primary" ? "medium" : "light");

  const handlePressIn = (e: Parameters<NonNullable<typeof onPressIn>>[0]) => {
    if (disabled) return;
    if (defaultHaptic !== "none") {
      if (defaultHaptic === "success") {
        success();
      } else {
        impact(defaultHaptic);
      }
    }
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = () => {
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
        {...rest}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`rounded-full px-6 py-4 items-center justify-center ${containerClasses[variant]} ${className ?? ""}`}
      >
        <Text
          className={`font-sans-semibold text-[15px] ${textClasses[variant]}`}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
