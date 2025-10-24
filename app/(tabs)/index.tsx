import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker, Region } from 'react-native-maps';

type Coords = {
  latitude: number;
  longitude: number;
};

type Blob = {
  id: string;
  latitude: number;
  longitude: number;
  inRange: boolean;
  clicked: boolean;
};

const noLabelsStyle = [
  { featureType: 'all', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', stylers: [{ visibility: 'off' }] },
];

// Convert meters to latitude/longitude offset
const randomOffset = (maxMeters: number) => {
  const r = (Math.random() - 0.5) * 2 * maxMeters; // -maxMeters to +maxMeters
  return r / 111000;
};

// Calculate distance between two coordinates in meters
const distanceMeters = (a: Coords, b: Coords) => {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (a.latitude * Math.PI) / 180;
  const phi2 = (b.latitude * Math.PI) / 180;
  const deltaPhi = ((b.latitude - a.latitude) * Math.PI) / 180;
  const deltaLambda = ((b.longitude - a.longitude) * Math.PI) / 180;

  const s =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
};

export default function HomeScreen() {
  const [location, setLocation] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(true);
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const mapRef = useRef<MapView>(null);
  const INTERACTION_RADIUS = 30; // meters
  const router = useRouter();

  // On mount, get location, generate blobs and watch location
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required.');
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = currentLocation.coords;
        setLocation({ latitude, longitude });

        // Generate blobs within ~100m radius
        const newBlobs: Blob[] = Array.from({ length: 8 }).map((_, i) => ({
          id: `blob-${i}`,
          latitude: latitude + randomOffset(50),
          longitude: longitude + randomOffset(50),
          inRange: false,
          clicked: false,
        }));
        setBlobs(newBlobs);

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (loc) => {
            const newCoords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };
            setLocation(newCoords);

            setBlobs((prev) =>
              prev.map((b) => {
                const dist = distanceMeters(newCoords, b);
                return { ...b, inRange: dist <= INTERACTION_RADIUS };
              })
            );
          }
        );
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Unable to get location.');
      } finally {
        setLoading(false);
      }
    })();

    return () => subscription?.remove();
  }, []);

  // Keep map centered on player every 500ms
  useEffect(() => {
    if (!location) return;

    const interval = setInterval(() => {
      mapRef.current?.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },
        300
      );
    }, 500);

    return () => clearInterval(interval);
  }, [location]);

  const handleBlobPress = (blob: Blob) => {
    if (!blob.inRange) return;

    setBlobs((prev) =>
      prev.map((b) => (b.id === blob.id ? { ...b, clicked: !b.clicked } : b))
    );

    router.push('/minigame');
  };

  // Single full-screen pressable for blob interaction
const handleMapPress = async (e: GestureResponderEvent) => {
  if (!mapRef.current || !location) return;
  const { pageX, pageY } = e.nativeEvent;

  for (const blob of blobs) {
    try {
      const point = await mapRef.current.pointForCoordinate({
        latitude: blob.latitude,
        longitude: blob.longitude,
      });
      const dx = pageX - point.x;
      const dy = pageY - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 20) {
        handleBlobPress(blob);
        break;
      }
    } catch (err) {
      console.warn('Point conversion error:', err);
    }
  }
};

  if (loading || !location) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const region: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        mapType="satellite"
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        customMapStyle={noLabelsStyle}
      >
        {/* Player interaction circle */}
        <Circle
          center={location}
          radius={INTERACTION_RADIUS}
          strokeWidth={2}
          strokeColor="rgba(0, 150, 255, 0.9)"
          fillColor="rgba(0, 150, 255, 0.35)"
        />

        {/* Render markers */}
        {blobs.map((blob) => (
          <Marker
            key={blob.id}
            coordinate={{ latitude: blob.latitude, longitude: blob.longitude }}
            tracksViewChanges={false}
            pointerEvents="none" // markers themselves do nothing on click
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 20,
                backgroundColor: blob.clicked
                  ? 'rgba(0, 255, 0, 0.8)'
                  : 'rgba(255, 0, 0, 0.8)',
                borderWidth: 2,
                borderColor: blob.inRange ? 'white' : 'gray',
              }}
            />
          </Marker>
        ))}
      </MapView>

      {/* Full-screen invisible pressable for interaction */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPressIn={handleMapPress} // <-- use onPressIn
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
