import { useRouter } from 'expo-router';
import { Accelerometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import { Animated, Button, StyleSheet, Text, View } from 'react-native';
import { useGiveCreature } from './store/giveCreature';

export default function MiniGame() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [showClose, setShowClose] = useState(false);
  const giveCreature = useGiveCreature()
  const hasGivenCreature = React.useRef(false);

  // Sensitivity threshold for shake detection (adjust as needed)
  const SHAKE_THRESHOLD = 1.2;

  // Progress bar animation width
  const progressWidth = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalAcceleration = Math.sqrt(x * x + y * y + z * z);

      if (totalAcceleration > SHAKE_THRESHOLD) {
        setProgress((p) => {
          const newProgress = Math.min(p + 0.01*totalAcceleration, 1);
            if (newProgress === 1 && !hasGivenCreature.current && !showClose) {
              setShowClose(true);
              hasGivenCreature.current = true;
              setTimeout(() => {
                const c = giveCreature();
                if (c) console.log(`Caught ${c.name}!`);
                router.replace({ pathname: './caughtScreen', params: { creatureName: c?.name } });
              }, 0);
            }
          return newProgress;
        });
      }
    });

    setSubscription(subscription);

    return () => {
      subscription && subscription.remove();
      setSubscription(null);
    };
  }, []);

  // Animate the progress bar width
  useEffect(() => {
    Animated.timing(progressWidth, {
      toValue: progress,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shake to fill the bar!</Text>
      <View style={styles.progressBarBackground}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
        <View style={styles.closeButton}>
          <Button title="Close" onPress={() => router.push("/")} />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    color: 'white',
  },
  progressBarBackground: {
    width: '80%',
    height: 30,
    backgroundColor: '#333',
    borderRadius: 15,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  closeButton: {
    marginTop: 40,
    width: '50%',
  },
});
