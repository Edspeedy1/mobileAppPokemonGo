import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function BasicScreen() {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Dex</Text>
      <Text style={styles.text}>This is a basic screen template. Add your content here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7", // light neutral background
  },
  content: {
    flex: 1,
    justifyContent: "center", // center vertically
    alignItems: "center", // center horizontally
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  text: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});
