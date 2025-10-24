import React from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { creatures as allCreatures } from "../../../assets/creatures"
import CreatureCard from "../../../components/CreatureCard"
import useGameStore from "../../store/useGameStore"

export default function CollectionScreen() {
  const caughtIds = useGameStore((state) => state.caughtList)

  // Get the actual caught creatures from the allCreatures list
  const caughtCreatures = allCreatures.filter((c) =>
    caughtIds.includes(c.id)
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Collection</Text>
      {caughtCreatures.length === 0 ? (
        <Text style={styles.text}>You haven't caught any creatures yet!</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.grid}>
          {caughtCreatures.map((c) => (
            <CreatureCard
              key={c.id}
              name={c.name}
              image={c.image}
              discovered={true}
            />
          ))}
        </ScrollView>
      )}
    </View>
  )
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
})
