import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
	Animated,
	Dimensions,
	Easing,
	ImageSourcePropType,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { creatures } from "../assets/creatures";

export const unstable_settings = {
	headerShown: false, // removes top nav bar
	tabBarStyle: { display: "none" }, // hides bottom tab bar if in a tab layout
};

const CaughtScreen = () => {
	const { width, height } = Dimensions.get("window");
	const [showCreature, setShowCreature] = React.useState(false);
	const router = useRouter();
	const params = useLocalSearchParams();
	const creatureName = params.creatureName as string;

	const creature = creatures.find((c) => c.name.toLowerCase() === creatureName?.toLowerCase());

	// console.log(creature, creatureName, params);
	const creatureImage: ImageSourcePropType =
		creature?.image || require("../assets/creatureImages/Aeloll.png");

	// animation refs
	const ballScale = useRef(new Animated.Value(0)).current;
	const lightRotation = useRef(new Animated.Value(0)).current;
	const backgroundOpacity = useRef(new Animated.Value(0)).current;
	const creatureBounce = useRef(new Animated.Value(0)).current;
	const buttonOpacity = useRef(new Animated.Value(0)).current;

	const rotatingLight = require("../assets/rewardLights.png");

	const creatureBob = useRef(new Animated.Value(0)).current;
	const creatureWobble = useRef(new Animated.Value(0)).current;

	// sound refs
	const drumrollSoundRef = useRef<Audio.Sound | null>(null);
	const successSoundRef = useRef<Audio.Sound | null>(null);

	const playSounds = async () => {
		try {
			const { sound: drumrollSound } = await Audio.Sound.createAsync(
				require("../assets/drumroll.mp3")
			);
			const { sound: successSound } = await Audio.Sound.createAsync(
				require("../assets/rewardSong.mp3")
			);

			drumrollSoundRef.current = drumrollSound;
			successSoundRef.current = successSound;

			await drumrollSound.setIsLoopingAsync(false);
			await successSound.setIsLoopingAsync(false);

			await drumrollSound.playAsync();

			drumrollSound.setOnPlaybackStatusUpdate(async (status) => {
				if ("didJustFinish" in status && status.didJustFinish) {
					await drumrollSound.unloadAsync();
					drumrollSoundRef.current = null;
					await successSound.playAsync();

					successSound.setOnPlaybackStatusUpdate(async (s2) => {
						if ("didJustFinish" in s2 && s2.didJustFinish) {
							await successSound.unloadAsync();
							successSoundRef.current = null;
						}
					});
				}
			});
		} catch (e) {
			console.log("Error playing sounds:", e);
		}
	};

	useEffect(() => {
		// start animations
		Animated.sequence([
			Animated.parallel([
				Animated.timing(ballScale, {
					toValue: 1,
					duration: 4310,
					useNativeDriver: true,
				}),
				Animated.timing(backgroundOpacity, {
					toValue: 0.7,
					duration: 4310,
					useNativeDriver: true,
				}),
				Animated.loop(
					Animated.timing(lightRotation, {
						toValue: 1,
						duration: 5000,
						easing: Easing.linear,
						useNativeDriver: true,
					})
				),
				Animated.sequence([
					Animated.delay(4000),
					Animated.timing(buttonOpacity, {
						toValue: 1,
						duration: 500,
						useNativeDriver: true,
					}),
				]),
				Animated.loop(Animated.sequence([
					Animated.timing(creatureBounce, {
						toValue: 1,
						duration: 40,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
					Animated.timing(creatureBounce, {
						toValue: 0,
						duration: 40,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
				])),
			]),
		]).start();

		playSounds();

		setTimeout(() => {
			setShowCreature(true);

			Animated.loop(
				Animated.sequence([
					Animated.timing(creatureBob, {
						toValue: 1,
						duration: 500,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
					Animated.timing(creatureBob, {
						toValue: 0,
						duration: 500,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
				])
			).start();

			Animated.loop(
				Animated.sequence([
					Animated.timing(creatureWobble, {
						toValue: 1,
						duration: 1000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
					Animated.timing(creatureWobble, {
						toValue: -1,
						duration: 1000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
					Animated.timing(creatureWobble, {
						toValue: 0,
						duration: 1000,
						easing: Easing.inOut(Easing.sin),
						useNativeDriver: true,
					}),
				])
			).start();
		}, 4310);

		// cleanup on unmount
		return () => {
			if (drumrollSoundRef.current) {
				drumrollSoundRef.current.unloadAsync();
				drumrollSoundRef.current = null;
			}
			if (successSoundRef.current) {
				successSoundRef.current.unloadAsync();
				successSoundRef.current = null;
			}
		};
	}, []);

	const handleCollect = async () => {
		try {
			if (drumrollSoundRef.current) {
				await drumrollSoundRef.current.stopAsync();
				await drumrollSoundRef.current.unloadAsync();
				drumrollSoundRef.current = null;
			}
			if (successSoundRef.current) {
				await successSoundRef.current.stopAsync();
				await successSoundRef.current.unloadAsync();
				successSoundRef.current = null;
			}
		} catch (e) {
			console.log("Error unloading sounds:", e);
		}
		router.replace("/");
	};

	const translateY = creatureBob.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -15], // up/down distance
	});

	const translateX = creatureWobble.interpolate({
		inputRange: [-1, 1],
		outputRange: [-10, 10], // left/right wiggle distance
	});

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.background, { opacity: backgroundOpacity }]} />
			{showCreature && (
				<Animated.Image
					source={rotatingLight}
					style={[
						styles.lightImage,
						{
							transform: [
								{
									rotate: lightRotation.interpolate({
										inputRange: [0, 1],
										outputRange: ["0deg", "360deg"],
									}),
								},
							],
						},
					]}
				/>
			)}
			<Animated.View style={[styles.whiteCircle, { transform: [{ scale: ballScale }] }]} />

			{showCreature ? (
				<Animated.Image
					source={creatureImage}
					style={[
						styles.creatureImage,
						{
							transform: [{ translateY }, { translateX }],
						},
					]}
				/>
			) : (
				<Animated.View
					style={[
						styles.blackBall,
						{
							transform: [
								{
									translateY: creatureBounce.interpolate({
										inputRange: [0, 1],
										outputRange: [5, -5],
									}),
								},
							],
						},
					]}
				/>
			)}

			<Text style={styles.creatureName}>
				{showCreature ? creature?.name || "Unknown Creature" : "---"}
			</Text>

			<Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
				<TouchableOpacity style={styles.collectButton} onPress={handleCollect}>
					<Text style={styles.buttonText}>COLLECT</Text>
				</TouchableOpacity>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	background: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "#000",
	},
	whiteCircle: {
		width: 300,
		height: 300,
		borderRadius: 150,
		zIndex: 2,
		backgroundColor: "#fffc",
		position: "absolute",
	},
	creatureImage: {
		width: 200,
		height: 200,
		zIndex: 3,
		resizeMode: "contain",
	},
	creatureName: {
		zIndex: 4,
		fontSize: 22,
		fontWeight: "bold",
		marginTop: 20,
		color: "#222",
	},
	buttonContainer: {
		zIndex: 10,
		position: "absolute",
		bottom: 50,
		width: "100%",
		alignItems: "center",
	},
	collectButton: {
		zIndex: 10,
		backgroundColor: "#4CAF50",
		paddingHorizontal: 60,
		paddingVertical: 15,
		borderRadius: 30,
		elevation: 5,
	},
	blackBall: {
		width: 100,
		height: 100,
		borderRadius: 50,
		zIndex: 2,
		backgroundColor: "#000",
	},
	buttonText: {
		zIndex: 10,
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold",
	},
	lightImage: {
		width: 1000,
		height: 1000,
		zIndex: 1,
		resizeMode: "contain",
		position: "absolute",
		pointerEvents: "none",
	},
});

export default CaughtScreen;
