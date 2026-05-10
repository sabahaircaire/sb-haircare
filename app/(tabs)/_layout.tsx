import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { colors } from "@/theme/colors";

type TabIconProps = { focused: boolean; label: string };

function TabIcon({ focused, label }: TabIconProps) {
  return (
    <View className="items-center justify-center pt-1">
      <Text
        style={{
          fontFamily: focused ? "Inter_600SemiBold" : "Inter_400Regular",
          color: focused ? colors.bordeaux.DEFAULT : colors.ink.muted,
          fontSize: 11,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.cream.light,
          borderTopColor: colors.cream.warm,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Accueil" />
          ),
        }}
      />
      <Tabs.Screen
        name="hairstyle"
        options={{
          title: "Styles",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Styles" />
          ),
        }}
      />
      <Tabs.Screen
        name="washday"
        options={{
          title: "Aujourd'hui",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Aujourd'hui" />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Apprendre",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Apprendre" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profil" />
          ),
        }}
      />
    </Tabs>
  );
}
