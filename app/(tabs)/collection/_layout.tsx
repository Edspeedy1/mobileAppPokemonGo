import { Stack } from "expo-router";

export default function CollectionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tabsLayout" options={{ headerShown: false }} />

      <Stack.Screen
        name="inspect/inspectCreature"
        options={{
          headerShown: true,
          title: "Inspect Creature",
        }}
      />
    </Stack>
  );
}
