import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { auth } from "@/firebase-config";
import { useT } from "@/i18n/LanguageProvider";
import { getFirebaseErrorMessage } from "@/services/firebaseErrorHandler";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      // the root layout redirects once the auth state changes
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreen title={t("auth.register.title")} subtitle={t("auth.register.subtitle")} error={error}>
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
        autoComplete="new-password"
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
      <Button title={t("auth.register.submit")} variant="light" onPress={handleRegister} loading={loading} />
      <Button
        title={t("auth.register.toLogin")}
        variant="ghost"
        onPress={() => router.back()}
        style={styles.ghost}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  ghost: { borderColor: Colors.bg },
});
