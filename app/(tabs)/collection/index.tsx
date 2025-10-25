import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { creatures as allCreatures } from "../../../assets/creatures";
import CreatureCard from "../../../components/CreatureCard";
import useGameStore from "../../store/useGameStore";

export default function CollectionScreen() {
  const caughtCreatures = useGameStore((state) => state.creatures);
  const router = useRouter(); 

  // Map each caught creature to the full creature object from allCreatures
  const mappedCreatures = caughtCreatures.map((c) => {
    const fullData = allCreatures.find((ac) => ac.id.toString() === c.id);
    return {
      ...c,
      name: fullData?.name ?? c.name,
      image: fullData?.image,
    };
  });


  const pathname = usePathname();
  const handlePress = (creatureName: string) => {
    console.log(creatureName);
    router.push({
      pathname: "/(tabs)/collection/(inspect)/inspectCreature",
      params: { creatureName },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collection</Text>
      {mappedCreatures.length === 0 ? (
        <Text style={styles.text}>You haven't caught any creatures yet!</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {mappedCreatures.map((c, index) => (
            <Pressable
              key={`${c.id}-${index}`}
              onPress={() => handlePress(c.name)}
              style={({ pressed }) => [
                styles.cardWrapper,
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
              ]}
            >
              <CreatureCard
                name={c.name}
                image={c.image}
                discovered={true}
              />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: 8,
  },
  cardWrapper: {
    margin: 0,
  },
});
