import { useRef, useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Celebration } from "@/components/Celebration";
import { pickFlowPhrase } from "@/lib/celebration";

export default function WashComplete() {
  const router = useRouter();
  const [celebrate, setCelebrate] = useState(true);
  const phrase = useRef(pickFlowPhrase()).current;

  return (
    <ScreenContainer scroll={false}>
      <View className="flex-1 items-center justify-center px-4">
        <Text variant="label" className="mb-3">
          🎉
        </Text>
        <Text variant="display" className="text-center mb-3">
          Flow terminé !
        </Text>
        <Text variant="body" className="text-center text-ink-soft mb-12 max-w-[320px]">
          Bravo pour ton wash day. Ta progression a été enregistrée.
        </Text>
        <Button
          label="Retour à l'accueil"
          className="w-full max-w-[280px]"
          onPress={() => router.replace("/(tabs)")}
        />
      </View>

      <Celebration
        visible={celebrate}
        emoji="👑"
        title="Wash day terminé !"
        subtitle={phrase}
        ctaLabel="Voir ma progression"
        onDismiss={() => setCelebrate(false)}
      />
    </ScreenContainer>
  );
}
