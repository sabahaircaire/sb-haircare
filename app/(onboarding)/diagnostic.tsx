import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useOnboarding } from "@/store/onboarding";
import { runDiagnostic } from "@/lib/diagnostic";
import { colors } from "@/theme/colors";

export default function DiagnosticScreen() {
  const router = useRouter();
  const { answers, setDiagnostic, diagnostic } = useOnboarding();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await runDiagnostic(answers);
        if (!cancelled) {
          setDiagnostic(result);
          setLoading(false);
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erreur inconnue");
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <ScreenContainer scroll={false}>
        <View className="flex-1 items-center justify-center px-4">
          <ActivityIndicator
            size="large"
            color={colors.bordeaux.DEFAULT}
            className="mb-6"
          />
          <Text variant="display" className="text-center mb-2">
            Création de{"\n"}ton rituel
          </Text>
          <Text variant="body" className="text-center text-ink-soft">
            Ton profil capillaire est en cours d'analyse...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <Text variant="h1" className="mb-3">
          Diagnostic indisponible
        </Text>
        <Text variant="body" className="mb-6 text-ink-soft">
          {error}
        </Text>
        <Text variant="caption" className="mb-6">
          On peut continuer sans diagnostic IA pour l'instant — tu pourras le
          relancer depuis ton profil.
        </Text>
        <Button
          label="Continuer quand même"
          onPress={() => router.push("/(onboarding)/result")}
        />
      </ScreenContainer>
    );
  }

  if (!diagnostic) return null;

  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        Diagnostic terminé
      </Text>
      <Text variant="h1" className="mb-6">
        Ton profil capillaire
      </Text>

      <Card variant="bordeaux" className="mb-4">
        <Text variant="label" className="text-ocre-soft mb-2">
          Type & Porosité
        </Text>
        <Text variant="h2" className="text-white mb-1">
          {diagnostic.hair_type.toUpperCase()} ·{" "}
          {diagnostic.porosity === "low"
            ? "Porosité faible"
            : diagnostic.porosity === "high"
              ? "Porosité élevée"
              : "Porosité moyenne"}
        </Text>
        <Text variant="body" className="text-cream">
          Méthode recommandée : {diagnostic.best_method}
        </Text>
      </Card>

      <Card className="mb-4">
        <Text variant="label" className="mb-2">
          Tes besoins prioritaires
        </Text>
        {diagnostic.needs.map((n, i) => (
          <Text key={i} variant="body" className="mb-1">
            · {n}
          </Text>
        ))}
      </Card>

      <Card className="mb-4">
        <Text variant="label" className="mb-2">
          Routine quotidienne
        </Text>
        {diagnostic.routine_recommendation.daily.map((d, i) => (
          <Text key={i} variant="body" className="mb-1">
            · {d}
          </Text>
        ))}
      </Card>

      <Card className="mb-4">
        <Text variant="label" className="mb-2">
          Routine hebdomadaire
        </Text>
        {diagnostic.routine_recommendation.weekly.map((d, i) => (
          <Text key={i} variant="body" className="mb-1">
            · {d}
          </Text>
        ))}
      </Card>

      <Card className="mb-4">
        <Text variant="label" className="mb-2">
          Routine mensuelle
        </Text>
        {diagnostic.routine_recommendation.monthly.map((d, i) => (
          <Text key={i} variant="body" className="mb-1">
            · {d}
          </Text>
        ))}
      </Card>

      <Card variant="outline" className="mb-6">
        <Text variant="body" className="italic">
          {diagnostic.notes}
        </Text>
      </Card>

      <Button
        label="Créer mon compte pour sauvegarder"
        onPress={() => router.push("/(onboarding)/result")}
      />
    </ScreenContainer>
  );
}
