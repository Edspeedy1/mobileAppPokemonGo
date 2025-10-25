import { removeCreature } from "@/app/store/giveCreature";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { creatures } from "../../../../assets/creatures";

export default function InspectCreature() {
  const params = useLocalSearchParams();
  const creature = creatures.find(
    (creature) => creature.name === params.creatureName
  );

  // Animated values for bobbing and wobble
  const creatureBob = useRef(new Animated.Value(0)).current;
  const creatureWobble = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bob up and down continuously
    const bobAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(creatureBob, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(creatureBob, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Gentle side-to-side wobble
    const wobbleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(creatureWobble, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(creatureWobble, {
          toValue: -1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(creatureWobble, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    bobAnimation.start();
    wobbleAnimation.start();

    return () => {
      bobAnimation.stop();
      wobbleAnimation.stop();
    };
  }, []);

  if (!creature) {
    return (
      <View style={styles.container}>
        <Text>Creature not found</Text>
      </View>
    );
  }

  const translateY = creatureBob.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const translateX = creatureWobble.interpolate({
    inputRange: [-1, 1],
    outputRange: [-10, 10],
  });

  const handleKill = () => {
    console.log("Killing creature");
    // Remove the creature from the game
    removeCreature(creature.name);

    router.back();
  };

  return (
    <View style={styles.container}>
      <View
        style={{ padding: 10, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#333" }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            borderRadius: 10,
            backgroundColor: "#2a75bb",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
            Back
          </Text>
        </Pressable>
      </View>

      <View style={styles.creatureCard}>
        <Animated.Image
          source={creature.image as ImageSourcePropType}
          style={[
            styles.image,
            {
              transform: [{ translateY }, { translateX }],
            },
          ]}
          resizeMode="contain"
        />
        <Text style={styles.name}>{creature.name}</Text>
      </View>
      <View style={{ backgroundColor: "#ffffffff", height: "100%", alignItems: "center", paddingTop: 100 }}>
        <Pressable
          onPress={() => handleKill()}
          style={{
            borderRadius: 10,
            backgroundColor: "#2a75bb",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
            Kill
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#333",
  },
  creatureCard: {
    padding: 20,
    backgroundColor: "#666",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
