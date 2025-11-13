import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ResizeMode, Video } from "expo-av";
import Colors from "@/constants/colors";

export default function SplashScreen() {
  const router = useRouter();
  const [videoError, setVideoError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleContinue = () => {
    router.replace("/(tabs)/home");
  };

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A0B2E", "#4A0E4E", "#6B2E5C", "#4A0E4E", "#1A0B2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {!videoError && Platform.OS !== 'web' && (
          <Video
            ref={videoRef}
            source={{ uri: "https://player.vimeo.com/external/371433846.sd.mp4?s=236f93e679c1c0e8b1d6bdfa29210e8e4a5d7088&profile_id=165" }}
            style={styles.videoBackground}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
            onError={() => setVideoError(true)}
          />
        )}

        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.sparkleContainer}>
              {[...Array(8)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.sparkle,
                    {
                      opacity: sparkleOpacity,
                      transform: [
                        { rotate: `${i * 45}deg` },
                        {
                          translateY: sparkleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -10],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.sparkleDot} />
                </Animated.View>
              ))}
            </View>

            <Text style={styles.logoText}>LUMIORO</Text>
            <View style={styles.divider} />
            <Text style={styles.tagline}>Lab-Grown Luxury, Direct to You</Text>

            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Explore Jewellery</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  videoBackground: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  overlay: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 32,
  },
  content: {
    alignItems: "center" as const,
  },
  sparkleContainer: {
    width: 80,
    height: 80,
    marginBottom: 40,
    position: "relative" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  sparkle: {
    position: "absolute" as const,
    width: 60,
    height: 60,
  },
  sparkleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.secondary,
    position: "absolute" as const,
    top: 0,
    left: "50%",
    marginLeft: -3,
    shadowColor: Colors.light.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  logoText: {
    fontSize: 64,
    fontWeight: "300" as const,
    color: Colors.light.secondary,
    letterSpacing: 12,
    marginBottom: 24,
    fontFamily: "serif",
    textShadowColor: "rgba(197, 157, 95, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  divider: {
    width: 120,
    height: 1,
    backgroundColor: Colors.light.secondary,
    opacity: 0.5,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 14,
    color: Colors.light.white,
    letterSpacing: 3,
    fontWeight: "300" as const,
    opacity: 0.9,
    textAlign: "center" as const,
    marginBottom: 80,
    fontFamily: "serif",
  },
  button: {
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: Colors.light.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.light.primary,
    letterSpacing: 1,
  },
});
