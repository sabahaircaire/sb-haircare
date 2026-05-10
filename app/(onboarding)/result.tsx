import { useState } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/store/auth";
import { useOnboarding } from "@/store/onboarding";
import { supabase } from "@/lib/supabase";

export default function ResultScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { answers, diagnostic, reset } = useOnboarding();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || password.length < 6) return;
    setLoading(true);

    const { error: signUpError, session } = await signUp(email.trim(), password);
    if (signUpError) {
      setLoading(false);
      Alert.alert("Inscription impossible", signUpError.message);
      return;
    }

    // With email autoconfirm ON, signUp returns a session immediately.
    // Otherwise (rare path), wait briefly for AsyncStorage to flush, then re-fetch.
    let userId = session?.user?.id;
    if (!userId) {
      await new Promise((r) => setTimeout(r, 400));
      const { data } = await supabase.auth.getSession();
      userId = data.session?.user?.id;
    }
    if (!userId) {
      setLoading(false);
      Alert.alert(
        "Compte créé",
        "Ton compte est créé mais on n'a pas pu te connecter automatiquement. Re-connecte-toi pour finaliser ton profil.",
      );
      router.replace("/(onboarding)/signin");
      return;
    }

    // Upsert (vs update) so we don't depend on the auth.users trigger having
    // already inserted the profile row — race-condition safe.
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      display_name: answers.display_name ?? null,
      hair_type: diagnostic?.hair_type ?? answers.hair_type ?? null,
      porosity: diagnostic?.porosity ?? answers.porosity ?? null,
      current_length: answers.current_length ?? null,
      goal_length: answers.goal_length ?? null,
      diagnostic_summary: diagnostic ?? null,
      diagnostic_completed_at: diagnostic ? new Date().toISOString() : null,
    });

    setLoading(false);

    if (profileError) {
      Alert.alert("Sauvegarde du profil", profileError.message);
      return;
    }

    reset();
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        Sauvegarder
      </Text>
      <Text variant="h1" className="mb-2">
        Crée ton compte
      </Text>
      <Text variant="body" className="text-ink-soft mb-8">
        Pour garder ton diagnostic et suivre ta progression jour après jour.
      </Text>

      <View className="gap-4 mb-8">
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="ton@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />
        <Input
          label="Mot de passe (6+ caractères)"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
      </View>

      <Button
        label={loading ? "Création..." : "Créer mon compte"}
        onPress={onSubmit}
        disabled={loading || !email || password.length < 6}
        className={loading || !email || password.length < 6 ? "opacity-40" : ""}
      />
    </ScreenContainer>
  );
}
