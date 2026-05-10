import { View } from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function HairstyleScreen() {
  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        Styles
      </Text>
      <Text variant="h1" className="mb-6">
        Mon planner cheveux
      </Text>

      <Card variant="bordeaux" className="mb-6">
        <Text variant="label" className="text-ocre-soft mb-2">
          Style actuel
        </Text>
        <Text variant="h2" className="text-white mb-2">
          Cornrows
        </Text>
        <Text variant="body" className="text-cream mb-3">
          30 jours restants · retrait recommandé : Sun 07 Jun
        </Text>
        <Button variant="secondary" label="Changer la date de pose" />
      </Card>

      <Text variant="h3" className="mb-3">
        Styles protecteurs
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {[
          ["Knotless Braids", "6 sem max"],
          ["Box Braids", "9 sem max"],
          ["Mini Braids", "9 sem max"],
          ["Mini Twists", "5 sem max"],
          ["Sew-In", "5 sem max"],
          ["Locs Retwist", "9 sem max"],
        ].map(([name, dur]) => (
          <Card key={name} className="w-[48%]">
            <Text variant="h3" className="mb-1">
              {name}
            </Text>
            <Text variant="caption">{dur}</Text>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}
