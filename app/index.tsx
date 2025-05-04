import { Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const pawData = [
    { top: '10%', left: '10%', transform: [{ rotate: '0deg' }], width: 30, height: 30 },
    { top: '13%', left: '45%', transform: [{ rotate: '0deg' }], width: 22, height: 22 },
    { top: '6%', left: '25%', transform: [{ rotate: '-40deg' }], width: 39, height: 35.5 },
    { top: '10%', left: '70%', transform: [{ rotate: '-40deg' }], width: 24, height: 22 },
    { top: '96%', left: '48%', transform: [{ rotate: '0deg' }], width: 20, height: 20 },
    { top: '95%', left: '5%', transform: [{ rotate: '-40deg' }], width: 20, height: 20 },
    { top: '15%', left: '90%', transform: [{ rotate: '0deg' }], width: 20, height: 20 },
    { top: '95%', left: '90%', transform: [{ rotate: '-30deg' }], width: 20, height: 20 },
    { top: '20%', left: '5%', transform: [{ rotate: '20deg' }], width: 18, height: 18 },
    { top: '20%', left: '45%', transform: [{ rotate: '-10deg' }], width: 22, height: 22 },
    { top: '30%', left: '96%', transform: [{ rotate: '-25deg' }], width: 18, height: 18 },
    { top: '22%', left: '88%', transform: [{ rotate: '20deg' }], width: 25, height: 25 },
    { top: '6%', left: '85%', transform: [{ rotate: '5deg' }], width: 45, height: 42 },
    { top: '7%', left: '55%', transform: [{ rotate: '5deg' }], width: 24, height: 24 },
    { top: '98%', left: '20%', transform: [{ rotate: '5deg' }], width: 12, height: 12 },
    { top: '98%', left: '78%', transform: [{ rotate: '50deg' }], width: 15, height: 15 },
  ] as const;

  const pawAnimations = useRef(
    pawData.map(() => new Animated.Value(1))
  ).current;

  const [fontsLoaded] = useFonts({
    Fredoka_700Bold,
    Nunito_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 bg-purple-500 justify-center items-center">
      <Image
        source={require('@/assets/images/homeScreen/cat_silhouette.png')}
        className="absolute w-full h-full z-10"
        resizeMode="cover"
      />
      <View className="absolute w-full h-full z-20">
        {pawData.map((paw, index) => (
          <Animated.Image
            key={index}
            source={require('@/assets/images/paw.png')}
            style={{
              position: 'absolute',
              top: paw.top,
              left: paw.left,
              width: paw.width,
              height: paw.height,
              transform: [
                { scale: pawAnimations[index] },
                ...paw.transform,
              ],
            }}
          />
        ))}
      </View>
      <Image
        source={require('@/assets/images/homeScreen/cat_snout.png')}
        className="absolute z-20 w-8 h-6"
        style={{ top: '45%', left: '60%', transform: [{ translateX: -50 }, { translateY: -50 }] }}
      />
      <View className="absolute z-20 bg-purple-900 rounded-full" style={{ top: '38%', left: '50%', width: 50, height: 1, transform: [{ translateX: -80 }, { translateY: -5 }, { rotate: '30deg' }] }} />
      <View className="absolute z-20 bg-purple-900 rounded-full" style={{ top: '40%', left: '48%', width: 50, height: 1, transform: [{ translateX: -80 }, { translateY: 5 }, { rotate: '0deg' }] }} />
      <View className="absolute z-20 bg-purple-900 rounded-full" style={{ top: '43%', left: '50%', width: 50, height: 1, transform: [{ translateX: -80 }, { translateY: 5 }, { rotate: '-30deg' }] }} />
      <View className="absolute z-20 bg-purple-900 rounded-full" style={{ top: '38%', left: '52%', width: 50, height: 1, transform: [{ translateX: 30 }, { translateY: -5 }, { rotate: '-30deg' }] }} />
      <View className="absolute z-20 bg-purple-900 rounded-full" style={{ top: '40%', left: '54%', width: 50, height: 1, transform: [{ translateX: 30 }, { translateY: 5 }, { rotate: '0deg' }] }} />
      <View className="absolute z-20 bg-purple-900 rounded-full" style={{ top: '43%', left: '52%', width: 50, height: 1, transform: [{ translateX: 30 }, { translateY: 5 }, { rotate: '30deg' }] }} />
      <Text
        className="absolute text-yellow-900 text-center text-[68px] z-20 font-fredokaBold"
        style={{
          textShadowColor: '#5c1a5c',
          textShadowOffset: { width: -5, height: 1 },
          textShadowRadius: 15,
          top: '53%',
          left: '50%',
          transform: [{ translateX: -135 }, { translateY: -25 }],
        }}
      >
        My Daily{'\n'}Pet
      </Text>
        <TouchableOpacity
          className="absolute bg-purple-900 rounded-full py-2 px-5 z-30"
          style={{ top: '80%', left: '50%', transform: [{ translateX: -60 }, { translateY: -20 }] }}
          onPress={() => {
            router.push('/profiles');
          }}
        >
          <View className="flex-row items-center gap-2.5">
            <View className="flex-row items-center">
              <Image
                source={require('@/assets/images/homeScreen/startButtonIcon.png')}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
            <Text
              className="text-white text-lg"
              style={{ fontFamily: 'Nunito_800ExtraBold' }}
            >
              START
            </Text>
          </View>
        </TouchableOpacity>
    </View>
  );
}