import { Image, StyleSheet, Text, View } from "react-native";

interface Props {
	name: string;
	image: any;
	discovered: boolean;
}

export default function CreatureCard({ name, image, discovered }: Props) {
	return (
		<View style={styles.card}>
			<View style={styles.imageContainer}>
				{discovered ? (
					<Image source={image} style={styles.image} resizeMode="contain" />
				) : (
					<Image
						source={image}
						style={[
							styles.image,
							{ tintColor: "black", opacity: 0.7 },
						]}
						resizeMode="contain"
					/>
				)}
			</View>

			<Text style={[styles.name, !discovered && styles.hiddenName]}>
				{discovered ? name : "???"}
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#45464bff",
		borderRadius: 12,
		padding: 10,
		width: 100,
		margin: 6,
	},
	imageContainer: {
		position: "relative",
		width: 64,
		height: 64,
	},
	image: {
		width: "100%",
		height: "100%",
		position: "absolute",
	},
	name: {
		marginTop: 6,
		fontWeight: "bold",
		fontSize: 12,
		color: "white",
		textTransform: "capitalize",
	},
	hiddenName: {
		color: "#aaa", // makes undiscovered name look faded
	},
});
