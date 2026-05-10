import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  scroll?: boolean;
};

export function ScreenContainer({ children, scroll = true }: Props) {
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <Body
        className="flex-1"
        contentContainerClassName={scroll ? "px-5 pt-4 pb-10" : undefined}
      >
        {scroll ? children : <View className="flex-1 px-5 pt-4">{children}</View>}
      </Body>
    </SafeAreaView>
  );
}
