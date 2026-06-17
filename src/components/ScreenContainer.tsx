import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  scroll?: boolean;
};

/**
 * Mobile-first container. On web, content is capped to 480px and centered
 * so the layout never stretches across a desktop window. On native the
 * max-width has no effect (the device is already mobile-width).
 */
export function ScreenContainer({ children, scroll = true }: Props) {
  if (scroll) {
    return (
      <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 40,
            width: "100%",
            maxWidth: 480,
            alignSelf: "center",
          }}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <View
        className="flex-1"
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          width: "100%",
          maxWidth: 480,
          alignSelf: "center",
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
