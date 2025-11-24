import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import { Stack, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Bone, Cat, Dog, PawPrint } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ThemedButton } from "../../components/ui/themed-button";
import { ThemedInput } from "../../components/ui/themed-input";
import { auth } from "../../firebase-config";
import { getFirebaseErrorMessage } from "../../services/firebaseErrorHandler";
import AuthLayout from "../auth-layout";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login realizado com sucesso!");
    } catch (error: any) {
      console.error("Erro completo ao tentar logar:", error);
      const userFriendlyMessage = getFirebaseErrorMessage(error.code);
      setError(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Stack.Screen options={{ headerShown: false }} />
      <ThemedView style={styles.container}>
        {/* Corners */}
        <View style={styles.iconTopLeft}>
          <Dog size={120} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>
        <View style={styles.iconTopRight}>
          <Cat size={100} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>
        <View style={styles.iconBottomLeft}>
          <Cat size={130} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>
        <View style={styles.iconBottomRight}>
          <Dog size={105} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>

        {/* Sides */}
        <View style={styles.iconLeftMiddle}>
          <PawPrint size={70} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>
        <View style={styles.iconRightMiddle}>
          <Bone size={85} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>

        {/* Top and bottom center */}
        <View style={styles.iconTopCenter}>
          <Bone size={65} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>
        <View style={styles.iconBottomCenter}>
          <Bone size={75} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>

        <View style={styles.iconTopLeftInner}>
          <PawPrint size={50} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>
        <View style={styles.iconBottomRightInner}>
          <PawPrint size={55} color={Palette.purple.darker} strokeWidth={1.5} />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <ThemedText style={styles.title}>Bem-vindo!</ThemedText>
            <ThemedText style={styles.subtitle}>
              Faça login para continuar
            </ThemedText>
          </View>

          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.error}>{error}</ThemedText>
              </View>
            )}
            <ThemedInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <ThemedInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              isPassword
            />
            <ThemedButton
              title="Entrar"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.primaryButton}
            />
            <ThemedButton
              title="Criar uma conta"
              onPress={() => router.push("/register")}
              style={styles.secondaryButton}
            />
          </View>
        </View>
      </ThemedView>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.purple.main,
    position: "relative",
    overflow: "hidden",
  },
  // Main corners
  iconTopLeft: {
    position: "absolute",
    top: -20,
    left: -40,
    opacity: 0.3,
    transform: [{ rotate: "-20deg" }],
  },
  iconTopRight: {
    position: "absolute",
    top: 20,
    right: -25,
    opacity: 0.3,
    transform: [{ rotate: "25deg" }],
  },
  iconBottomLeft: {
    position: "absolute",
    bottom: -45,
    left: -50,
    opacity: 0.3,
    transform: [{ rotate: "15deg" }],
  },
  iconBottomRight: {
    position: "absolute",
    bottom: -30,
    right: -35,
    opacity: 0.3,
    transform: [{ rotate: "-30deg" }],
  },
  // Sides
  iconLeftMiddle: {
    position: "absolute",
    top: "40%",
    left: -25,
    opacity: 0.3,
    transform: [{ rotate: "10deg" }],
  },
  iconRightMiddle: {
    position: "absolute",
    top: "50%",
    right: -20,
    opacity: 0.3,
    transform: [{ rotate: "25deg" }],
  },
  // Top and bottom center
  iconTopCenter: {
    position: "absolute",
    top: "12%",
    left: "50%",
    transform: [{ rotate: "30deg" }],
    opacity: 0.3,
  },
  iconBottomCenter: {
    position: "absolute",
    bottom: "8%",
    left: "50%",
    transform: [{ translateX: -37.5 }, { rotate: "-18deg" }],
    opacity: 0.3,
  },
  // Extra inner elements
  iconTopLeftInner: {
    position: "absolute",
    top: "18%",
    left: "15%",
    opacity: 0.3,
    transform: [{ rotate: "-70deg" }],
  },
  iconBottomRightInner: {
    position: "absolute",
    bottom: "15%",
    right: "12%",
    opacity: 0.3,
    transform: [{ rotate: "-25deg" }],
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    zIndex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.yellow.main,
    marginBottom: 8,
    lineHeight: 50,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: Fonts.fredoka.medium,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
  },
  primaryButton: {
    marginTop: 8,
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Palette.neutral.white,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: {
    color: Palette.neutral.white,
    textAlign: "center",
    fontFamily: Fonts.fredoka.medium,
  },
});

export default LoginScreen;
