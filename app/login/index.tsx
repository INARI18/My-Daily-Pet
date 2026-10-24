import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { auth } from "@/firebase-config";
import { useT } from "@/i18n/LanguageProvider";
import { getFirebaseErrorMessage } from "@/services/firebaseErrorHandler";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // the root layout redirects once the auth state changes
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen title={t("auth.login.title")} subtitle={t("auth.login.subtitle")} error={error}>
      <Input
        placeholder={t("auth.email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Input
        placeholder={t("auth.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        autoComplete="password"
        right={
          <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
            {showPassword ? (
              <EyeOff size={18} color={Colors.textMuted} />
            ) : (
              <Eye size={18} color={Colors.textMuted} />
            )}
          </Pressable>
        }
      />
      <Button title={t("auth.login.submit")} variant="light" onPress={handleLogin} loading={loading} />
      <Button
        title={t("auth.login.toRegister")}
        variant="ghost"
        onPress={() => router.push("/register")}
        style={styles.ghost}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  ghost: { borderColor: Colors.bg },
});
