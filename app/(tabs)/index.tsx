import { useState } from "react";
import { View, Pressable, Image, Linking } from "react-native";
import { useRouter } from "expo-router";
import { productsForPorosity } from "@/lib/products";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Text } from "@/components/Text";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Pill } from "@/components/Pill";
import { Avatar } from "@/components/Avatar";
import { Input } from "@/components/Input";
import { PressableHaptic } from "@/components/PressableHaptic";
import { impact as hapticImpact } from "@/lib/haptics";
import { colors } from "@/theme/colors";
import {
  useProfile,
  buildUsername,
  porosityLabel,
  bestMethod,
  todayTip,
} from "@/lib/hooks/useProfile";
import {
  useUserStats,
  useDailyMissions,
  useTodayCompletedMissionIds,
} from "@/lib/hooks/useStats";

type SubTab = "apercu" | "missions" | "produits" | "croissance";

const SUB_TABS: { value: SubTab; label: string; emoji: string }[] = [
  { value: "apercu", label: "Aperçu", emoji: "✨" },
  { value: "missions", label: "Missions", emoji: "🎯" },
  { value: "produits", label: "Produits", emoji: "🧴" },
  { value: "croissance", label: "Croissance", emoji: "🌱" },
];

export default function HomeScreen() {
  const { data: profile } = useProfile();
  const [tab, setTab] = useState<SubTab>("apercu");

  const username = buildUsername(profile);
  const porosity = profile?.porosity ?? "medium";
  const method = bestMethod(porosity);

  return (
    <ScreenContainer>
      {/* Profile header */}
      <View className="items-center mb-3">
        <Avatar name={profile?.display_name} size={64} />
        <Text variant="h3" className="mt-3">
          {username}
        </Text>
        <Text variant="caption">{porosityLabel(porosity)}</Text>
      </View>

      {/* TODAY'S TIP pill */}
      <Pill variant="ocre" className="mb-4 self-center">
        <Text variant="caption" className="text-bordeaux text-center">
          <Text variant="label" className="text-ocre-deep">
            CONSEIL DU JOUR ·{" "}
          </Text>
          {todayTip(porosity)}
        </Text>
      </Pill>

      {/* Check-in quotidien */}
      <CheckInCard />

      {/* Hair Diary */}
      <HairDiaryCard />

      {/* LOC / LCO method band */}
      <View className="my-4 items-center">
        <Pill variant="soft">
          <Text variant="caption" className="text-bordeaux">
            Liquid · Cream · Oil
          </Text>
        </Pill>
        <Text variant="caption" className="mt-1">
          Best : <Text variant="body-medium" className="text-bordeaux">{method}</Text>
        </Text>
      </View>

      {/* Sub-tabs */}
      <View className="flex-row mb-4">
        {SUB_TABS.map((t) => {
          const active = tab === t.value;
          return (
            <Pressable
              key={t.value}
              onPressIn={() => hapticImpact("light")}
              onPress={() => setTab(t.value)}
              className={`flex-1 py-2 items-center border-b-2 ${
                active ? "border-bordeaux" : "border-cream-warm"
              }`}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.bordeaux.DEFAULT : colors.ink.muted,
                  fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular",
                }}
              >
                {t.emoji} {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Tab content */}
      {tab === "apercu" && <ApercuSection profile={profile} method={method} />}
      {tab === "missions" && <MissionsSection />}
      {tab === "produits" && <ProduitsSection porosity={porosity} />}
      {tab === "croissance" && <CroissanceSection profile={profile} />}
    </ScreenContainer>
  );
}

// -----------------------------------------------------------------------------
// CARDS
// -----------------------------------------------------------------------------

function CheckInCard() {
  return (
    <Card className="mb-3 flex-row items-center justify-between">
      <View>
        <Text variant="h3">Check-in quotidien</Text>
        <Text variant="caption">Comment vont tes cheveux ?</Text>
      </View>
      <PressableHaptic
        hapticStyle="medium"
        className="bg-bordeaux rounded-full px-4 py-2"
      >
        <Text variant="body-medium" style={{ color: colors.white }}>
          Faire le check-in
        </Text>
      </PressableHaptic>
    </Card>
  );
}

function HairDiaryCard() {
  return (
    <Card variant="outline" className="flex-row items-center justify-between">
      <View>
        <Text variant="h3">✦ Hair Diary</Text>
        <Text variant="caption" className="mt-1">
          Touche pour voir tout
        </Text>
      </View>
      <Pill variant="ocre">
        <Text variant="caption" className="text-ocre-deep">
          0 entrées
        </Text>
      </Pill>
    </Card>
  );
}

// -----------------------------------------------------------------------------
// APERCU
// -----------------------------------------------------------------------------

type Profile = ReturnType<typeof useProfile>["data"];

function ApercuSection({
  profile,
  method,
}: {
  profile: Profile;
  method: "LCO" | "LOC";
}) {
  const summary = profile?.diagnostic_summary;
  const focus = summary?.routine_recommendation?.weekly?.slice(0, 3) ?? [
    `Suis ta méthode ${method}`,
    "Soin protéiné léger",
    "Foulard satin la nuit pour préserver tes pointes",
  ];
  const dailyHints = summary?.routine_recommendation?.daily ?? [
    "Vaporise un brouillard d'eau florale sur les longueurs",
    "Quelques gouttes d'huile sur les pointes",
  ];
  const monthlyHints = summary?.routine_recommendation?.monthly ?? [
    "Masque ayurvédique reconstructeur (poudres indiennes)",
    "Inspection des pointes",
  ];

  return (
    <View>
      <Card variant="bordeaux" className="mb-4">
        <Text variant="label" className="mb-2" style={{ color: "#E8C481" }}>
          ✨ Focus de la semaine
        </Text>
        {focus.map((f, i) => (
          <Text
            key={i}
            variant="body"
            className="mb-1"
            style={{ color: colors.cream.DEFAULT }}
          >
            · {f}
          </Text>
        ))}
      </Card>

      <Collapsible
        title={`Plan type de cheveux (${profile?.hair_type?.toUpperCase() ?? "—"})`}
        icon="✨"
      >
        {dailyHints.map((d, i) => (
          <Text key={i} variant="body" className="mb-1">
            · {d}
          </Text>
        ))}
      </Collapsible>

      <Collapsible
        title={`Plan porosité (${porosityLabel(profile?.porosity)})`}
        icon="💧"
      >
        {monthlyHints.map((d, i) => (
          <Text key={i} variant="body" className="mb-1">
            · {d}
          </Text>
        ))}
      </Collapsible>

      <Card variant="outline" className="mt-3">
        <Text variant="label" className="mb-2">
          Instructions hydratation
        </Text>
        <Text variant="body">
          Méthode {method} : applique d'abord{" "}
          {method === "LCO"
            ? "le Leave-in, puis la Crème, puis l'Huile"
            : "le Leave-in, puis l'Huile, puis la Crème"}
          . Sur cheveux humides, section par section, des racines aux pointes.
        </Text>
      </Card>
    </View>
  );
}

function Collapsible({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Card variant="outline" className="mb-3">
      <Pressable
        onPressIn={() => hapticImpact("light")}
        onPress={() => setOpen((o) => !o)}
      >
        <View className="flex-row items-center justify-between">
          <Text variant="h3">
            {icon ? `${icon} ` : ""}
            {title}
          </Text>
          <Text variant="body-medium" className="text-bordeaux">
            {open ? "−" : "+"}
          </Text>
        </View>
      </Pressable>
      {open ? <View className="mt-3">{children}</View> : null}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// MISSIONS
// -----------------------------------------------------------------------------

function MissionsSection() {
  const { data: stats } = useUserStats();
  const { data: missions } = useDailyMissions();
  const { data: completed } = useTodayCompletedMissionIds();

  const totalXp = stats?.total_xp ?? 0;
  const streak = stats?.current_streak ?? 0;
  const level = stats?.level_code ?? "curl_novice";
  const nextLevelAt = 100;
  const xpToNext = Math.max(0, nextLevelAt - (totalXp % nextLevelAt));
  const progress = ((totalXp % nextLevelAt) / nextLevelAt) * 100;

  return (
    <View>
      {/* Streak / Level / XP */}
      <Card className="mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text variant="label">🔥 Série</Text>
            <Text variant="h2">{streak} jours</Text>
          </View>
          <View className="items-end">
            <Text variant="label" className="text-right">🏆 Niveau</Text>
            <Text variant="h3" className="text-bordeaux">
              {levelLabel(level)}
            </Text>
          </View>
        </View>
        <View className="h-2 bg-cream-warm rounded-full overflow-hidden mb-1">
          <View
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: colors.bordeaux.DEFAULT,
            }}
          />
        </View>
        <View className="flex-row justify-between">
          <Text variant="caption">{xpToNext} XP avant le niveau suivant</Text>
          <Text variant="caption">Total : {totalXp} XP</Text>
        </View>
      </Card>

      {/* Missions du jour */}
      <Card className="mb-4">
        <Text variant="label" className="mb-1">
          👑 Missions du jour
        </Text>
        <Text variant="caption" className="mb-3">
          Complète les 3 pour gagner le bonus XP !
        </Text>
        {(missions ?? []).slice(0, 3).map((m) => {
          const done = completed?.has(m.id) ?? false;
          return (
            <View
              key={m.id}
              className="flex-row items-start py-2 border-b border-cream-warm"
            >
              <View
                className={`w-5 h-5 rounded-full mr-3 mt-1 items-center justify-center ${
                  done ? "bg-bordeaux" : "border border-bordeaux/30"
                }`}
              >
                {done ? (
                  <Text style={{ color: colors.white, fontSize: 12 }}>✓</Text>
                ) : null}
              </View>
              <View className="flex-1">
                <Text
                  variant="body-medium"
                  style={{
                    textDecorationLine: done ? "line-through" : "none",
                    color: done ? colors.ink.muted : colors.ink.DEFAULT,
                  }}
                >
                  {m.title}
                </Text>
                {m.description ? (
                  <Text variant="caption" className="mt-0.5">
                    {m.description}
                  </Text>
                ) : null}
              </View>
              <Text variant="body-medium" className="text-ocre-deep ml-2">
                +{m.xp_reward} XP
              </Text>
            </View>
          );
        })}
      </Card>

      {/* Coffre Glow Up */}
      <Card variant="outline" className="mb-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text variant="h3">🎁 Coffre Glow Up</Text>
          <Text variant="caption" className="mt-1">
            Récompenses récupérées ! À demain.
          </Text>
        </View>
        <Pill variant="ocre">
          <Text variant="caption" className="text-ocre-deep">
            Ouvert
          </Text>
        </Pill>
      </Card>

      {/* Paliers */}
      <Card>
        <Text variant="label" className="mb-1">
          🏆 Paliers de série
        </Text>
        <Text variant="caption" className="mb-3">
          Encore {Math.max(0, 7 - streak)} jours avant ton premier palier
        </Text>
        <View className="flex-row gap-2 mb-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <View
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < streak ? "bg-bordeaux" : "bg-cream-warm"
              }`}
            />
          ))}
        </View>
        <Text variant="caption">
          Prochaine récompense : <Text variant="body-medium" className="text-bordeaux">100 XP + Badge</Text>
        </Text>
      </Card>
    </View>
  );
}

function levelLabel(code: string): string {
  switch (code) {
    case "curl_novice":
      return "Curl Novice · Lvl 1";
    case "curl_pro":
      return "Curl Pro · Lvl 2";
    case "queen":
      return "Reine · Lvl 3";
    default:
      return "Curl Novice · Lvl 1";
  }
}

// -----------------------------------------------------------------------------
// PRODUITS
// -----------------------------------------------------------------------------

function ProduitsSection({
  porosity,
}: {
  porosity: "low" | "medium" | "high";
}) {
  const products = productsForPorosity(porosity);
  return (
    <View>
      <Text variant="label" className="mb-3">
        Produits SB Haircare pour ta {porosityLabel(porosity).toLowerCase()}
      </Text>
      {products.map((p) => (
        <Pressable
          key={p.slug}
          onPress={() => Linking.openURL(p.url)}
          className="bg-cream-light rounded-2xl mb-3 overflow-hidden border border-cream-warm flex-row"
        >
          <View className="w-24 h-24 bg-cream-warm">
            <Image
              source={{ uri: p.image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 p-3 justify-between">
            <View>
              <View className="flex-row items-start justify-between mb-0.5">
                <Text variant="body-medium" className="flex-1 pr-2 text-ink">
                  {p.name}
                </Text>
                {p.tag ? (
                  <Text variant="caption" className="text-ocre-deep">
                    {p.tag}
                  </Text>
                ) : null}
              </View>
              <Text
                variant="caption"
                numberOfLines={2}
                className="mb-1"
              >
                {p.short}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text variant="body-medium" className="text-bordeaux">
                {p.price_eur.toFixed(2)} €
              </Text>
              <Text variant="caption" className="text-bordeaux">
                Acheter →
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

// -----------------------------------------------------------------------------
// CROISSANCE
// -----------------------------------------------------------------------------

function CroissanceSection({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [goal, setGoal] = useState("");

  const currentLabel = profile?.current_length;
  const goalLabel = profile?.goal_length;

  return (
    <View>
      <Card className="mb-4">
        <Text variant="h3" className="mb-2">
          🌱 Objectif de longueur
        </Text>
        <Text variant="caption" className="mb-4">
          Entre ta longueur actuelle et ton objectif pour voir tes progrès.
        </Text>
        <View className="gap-3">
          <Input
            label="Longueur actuelle (pouces)"
            value={current}
            onChangeText={setCurrent}
            placeholder="ex : 12"
            keyboardType="numeric"
          />
          <Input
            label="Objectif (pouces)"
            value={goal}
            onChangeText={setGoal}
            placeholder="ex : 20"
            keyboardType="numeric"
          />
        </View>
      </Card>

      {currentLabel && goalLabel ? (
        <Card variant="bordeaux" className="mb-4">
          <Text variant="label" style={{ color: "#E8C481" }} className="mb-1">
            Étape actuelle
          </Text>
          <Text variant="h2" style={{ color: colors.white }}>
            {currentLabel} → {goalLabel}
          </Text>
        </Card>
      ) : null}

      <Pressable
        onPress={() => router.push("/(tabs)/profile")}
        className="bg-cream-light border border-cream-warm rounded-2xl p-4 mb-3"
      >
        <Text variant="body-medium" className="text-bordeaux">
          📸 Suivre ta pousse en photos →
        </Text>
        <Text variant="caption" className="mt-1">
          Compare avant/après avec l'analyse IA (V2)
        </Text>
      </Pressable>
    </View>
  );
}
