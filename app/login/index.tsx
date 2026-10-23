import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Colors } from "@/constants/theme";
import { auth } from "@/firebase-config";
import { getFirebaseErrorMessage } from "@/services/firebaseErrorHandler";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
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
    <AuthScreen title="Bem-vindo!" subtitle="Faça login para continuar" error={error}>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Input
        placeholder="Senha"
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
      <Button title="Entrar" variant="accent" onPress={handleLogin} loading={loading} />
      <Button
        title="Criar uma conta"
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
