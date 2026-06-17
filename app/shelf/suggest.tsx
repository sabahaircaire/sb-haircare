import { useState } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function SuggestProduct() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!name.trim() || !brand.trim()) {
      Alert.alert(
        "Manque info",
        "Au minimum le nom du produit et la marque.",
      );
      return;
    }
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id ?? null;
        await supabase.from("product_suggestions").insert({
          user_id: userId,
          product_name: name.trim(),
          brand: brand.trim(),
          link: link.trim() || null,
        });
      }
      Alert.alert(
        "Merci !",
        "On l'ajoute au catalogue dès que possible.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (e: unknown) {
      Alert.alert(
        "Erreur",
        e instanceof Error ? e.message : "Réessaie plus tard",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <Text variant="body-medium" className="text-bordeaux mb-4">
        ← Retour
      </Text>
      <Text variant="label" className="mb-2">
        Suggestion
      </Text>
      <Text variant="h1" className="mb-2">
        Ton produit nous manque ?
      </Text>
      <Text variant="body" className="text-ink-soft mb-6">
        Dis-nous lequel, on l'ajoute au catalogue avec son analyse complète.
      </Text>

      <View className="gap-4 mb-8">
        <Input
          label="Nom du produit"
          value={name}
          onChangeText={setName}
          placeholder="Curl Activator Cream"
        />
        <Input
          label="Marque"
          value={brand}
          onChangeText={setBrand}
          placeholder="Cantu"
        />
        <Input
          label="Lien (optionnel)"
          value={link}
          onChangeText={setLink}
          placeholder="https://… (page produit)"
          autoCapitalize="none"
        />
      </View>

      <Button
        label={loading ? "Envoi…" : "Envoyer la suggestion"}
        onPress={submit}
        disabled={loading || !name.trim() || !brand.trim()}
        className={loading || !name.trim() || !brand.trim() ? "opacity-40" : ""}
      />
    </ScreenContainer>
  );
}
