import { Pressable, PressableProps } from "react-native";
import { impact } from "@/lib/haptics";

type Props = PressableProps & {
  hapticStyle?: "light" | "medium" | "heavy";
};

/**
 * Pressable that fires a haptic on press-in + dims slightly when pressed.
 * Combines the tactile and visual feedback users expect for "real" buttons.
 */
export function PressableHaptic({
  hapticStyle = "medium",
  onPressIn,
  style,
  children,
  ...rest
}: Props) {
  return (
    <Pressable
      {...rest}
      onPressIn={(e) => {
        impact(hapticStyle);
        onPressIn?.(e);
      }}
      style={({ pressed }) => [
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
    >
      {children}
    </Pressable>
  );
}
