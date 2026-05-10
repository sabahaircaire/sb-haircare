import { useState } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useAuth } from "@/store/auth";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);
    if (error) {
      Alert.alert("Connexion impossible", error.message);
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer>
      <Text variant="label" className="mb-2">
        Connexion
      </Text>
      <Text variant="h1" className="mb-6">
        Re-bienvenue
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
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
      </View>

      <Button
        label={loading ? "Connexion..." : "Se connecter"}
        onPress={onSubmit}
        disabled={loading || !email || !password}
        className={loading || !email || !password ? "opacity-40" : ""}
      />
    </ScreenContainer>
  );
}
