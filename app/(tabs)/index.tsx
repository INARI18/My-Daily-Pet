import { Fonts } from "@/constants/fonts";
import { pawData } from "@/constants/homeAnimations";
import { Palette } from "@/constants/palette";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const pawAnimations = useRef(
    pawData.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    const animations = pawAnimations.map((scale, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 1000,
            delay: index * 200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      )
    );
    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [pawAnimations]);

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      try {
        // Simulate a delay for data fetching
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Palette.yellow.main} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/homeScreen/cat_silhouette.png")}
          style={styles.catSilhouette}
          resizeMode="cover"
        />
        <View style={styles.pawContainer}>
          {pawData.map((paw, index) => (
            <Animated.Image
              key={index}
              source={require("@/assets/images/paw.png")}
              style={{
                position: "absolute",
                top: paw.top,
                left: paw.left,
                width: paw.width,
                height: paw.height,
                transform: [{ scale: pawAnimations[index] }, ...paw.transform],
              }}
            />
          ))}
        </View>
        <Image
          source={require("@/assets/images/homeScreen/cat_snout.png")}
          style={styles.catSnout}
        />
        <View style={styles.whisker1} />
        <View style={styles.whisker2} />
        <View style={styles.whisker3} />
        <View style={styles.whisker4} />
        <View style={styles.whisker5} />
        <View style={styles.whisker6} />
        <Text style={styles.title}>My Daily{"\n"}Pet</Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            router.push("/profiles");
          }}
        >
          <View style={styles.buttonContent}>
            <View style={styles.iconContainer}>
              <Image
                source={require("@/assets/images/homeScreen/startButtonIcon.png")}
                style={styles.buttonIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.buttonText}>START</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
  },
  container: {
    flex: 1,
    backgroundColor: Palette.purple.light,
    justifyContent: "center",
    alignItems: "center",
  },
  catSilhouette: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
  },
  pawContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 20,
  },
  catSnout: {
    position: "absolute",
    zIndex: 20,
    width: 32,
    height: 24,
    top: "45%",
    left: "60%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  whisker1: {
    position: "absolute",
    zIndex: 20,
    backgroundColor: Palette.purple.darker,
    borderRadius: 9999,
    top: "38%",
    left: "50%",
    width: 50,
    height: 1,
    transform: [{ translateX: -80 }, { translateY: -5 }, { rotate: "30deg" }],
  },
  whisker2: {
    position: "absolute",
    zIndex: 20,
    backgroundColor: Palette.purple.darker,
    borderRadius: 9999,
    top: "40%",
    left: "48%",
    width: 50,
    height: 1,
    transform: [{ translateX: -80 }, { translateY: 5 }, { rotate: "0deg" }],
  },
  whisker3: {
    position: "absolute",
    zIndex: 20,
    backgroundColor: Palette.purple.darker,
    borderRadius: 9999,
    top: "43%",
    left: "50%",
    width: 50,
    height: 1,
    transform: [{ translateX: -80 }, { translateY: 5 }, { rotate: "-30deg" }],
  },
  whisker4: {
    position: "absolute",
    zIndex: 20,
    backgroundColor: Palette.purple.darker,
    borderRadius: 9999,
    top: "38%",
    left: "52%",
    width: 50,
    height: 1,
    transform: [{ translateX: 30 }, { translateY: -5 }, { rotate: "-30deg" }],
  },
  whisker5: {
    position: "absolute",
    zIndex: 20,
    backgroundColor: Palette.purple.darker,
    borderRadius: 9999,
    top: "40%",
    left: "54%",
    width: 50,
    height: 1,
    transform: [{ translateX: 30 }, { translateY: 5 }, { rotate: "0deg" }],
  },
  whisker6: {
    position: "absolute",
    zIndex: 20,
    backgroundColor: Palette.purple.darker,
    borderRadius: 9999,
    top: "43%",
    left: "52%",
    width: 50,
    height: 1,
    transform: [{ translateX: 30 }, { translateY: 5 }, { rotate: "30deg" }],
  },
  title: {
    position: "absolute",
    color: Palette.yellow.main,
    textAlign: "center",
    fontSize: 68,
    zIndex: 20,
    fontFamily: Fonts.fredoka.bold,
    textShadowColor: Palette.purple.darker,
    textShadowOffset: { width: -5, height: 1 },
    textShadowRadius: 15,
    top: "53%",
    left: "50%",
    transform: [{ translateX: -135 }, { translateY: -25 }],
  },
  startButton: {
    position: "absolute",
    backgroundColor: Palette.purple.dark,
    borderRadius: 9999,
    paddingVertical: 8,
    paddingHorizontal: 20,
    zIndex: 30,
    top: "80%",
    left: "50%",
    transform: [{ translateX: -60 }, { translateY: -20 }],
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  buttonText: {
    color: Palette.neutral.white,
    fontSize: 18,
    fontFamily: Fonts.nunito.extraBold,
  },
});
