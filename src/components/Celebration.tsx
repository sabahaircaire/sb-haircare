import { useEffect, useRef } from "react";
import { Modal, View, Pressable, Animated } from "react-native";
import { Text } from "@/components/Text";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { colors } from "@/theme/colors";
import { notifyCelebration } from "@/lib/stepFeedback";

type Props = {
  visible: boolean;
  title: string;
  subtitle?: string;
  emoji?: string;
  ctaLabel?: string;
  onDismiss: () => void;
};

// Overlay de célébration plein écran : l'écran vire au bordeaux, des confettis
// tombent, et une phrase de félicitation surgit. Vibration + carillon en prime.
export function Celebration({
  visible,
  title,
  subtitle,
  emoji = "🎉",
  ctaLabel = "Continuer",
  onDismiss,
}: Props) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    notifyCelebration();
    scale.setValue(0.6);
    opacity.setValue(0);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable
        onPress={onDismiss}
        style={{
          flex: 1,
          backgroundColor: `${colors.bordeaux.DEFAULT}F2`,
          alignItems: "center",
          justifyContent: "center",
          padding: 28,
        }}
      >
        <ConfettiBurst />
        <Animated.View
          style={{ opacity, transform: [{ scale }], alignItems: "center" }}
        >
          <Text variant="display" className="text-6xl mb-4">
            {emoji}
          </Text>
          <Text
            variant="display"
            className="text-center mb-3"
            style={{ color: colors.cream.DEFAULT }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              variant="body"
              className="text-center mb-10 max-w-[300px]"
              style={{ color: colors.ocre.soft }}
            >
              {subtitle}
            </Text>
          ) : null}
          <Pressable
            onPress={onDismiss}
            className="rounded-full px-8 py-4"
            style={{ backgroundColor: colors.ocre.DEFAULT }}
          >
            <Text variant="body-medium" style={{ color: colors.bordeaux.deep }}>
              {ctaLabel}
            </Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
