import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Navbar from "@/components/ui/navbar";
import { ThemedButton } from "@/components/ui/themed-button";
import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";
import { Bell, HelpCircle, Mail, Shield, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserPage() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          try {
            await signOut(auth);
          } catch (error) {
            Alert.alert("Erro", "Não foi possível sair da conta");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: Bell,
      title: "Notifications",
      subtitle: "Manage your notifications",
      onPress: () => Alert.alert("Coming soon", "Feature in development"),
    },
    {
      icon: Shield,
      title: "Privacy & Security",
      subtitle: "Protect your account",
      onPress: () => Alert.alert("Coming soon", "Feature in development"),
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      subtitle: "Help center",
      onPress: () => Alert.alert("Coming soon", "Feature in development"),
    },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Palette.purple.darker }}
      edges={["top"]}
    >
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Palette.neutral.offWhite }}
        edges={["bottom"]}
      >
        <ThemedView style={styles.container}>
          <Navbar pageName="My Account" />
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Header - user information */}
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <User size={60} color={Palette.purple.darker} strokeWidth={2} />
              </View>
              <ThemedText style={styles.userName}>Username</ThemedText>
              <View style={styles.emailContainer}>
                <Mail size={16} color={Palette.neutral.white} strokeWidth={2} />
                <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
              </View>
            </View>

            {/* Options menu */}
            <View style={styles.menuSection}>
              <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    <item.icon
                      size={24}
                      color={Palette.neutral.white}
                      strokeWidth={2}
                    />
                  </View>
                  <View style={styles.menuContent}>
                    <ThemedText style={styles.menuTitle}>
                      {item.title}
                    </ThemedText>
                    <ThemedText style={styles.menuSubtitle}>
                      {item.subtitle}
                    </ThemedText>
                  </View>
                  <View style={styles.menuArrow}>
                    <ThemedText style={styles.arrowText}>›</ThemedText>
                  </View>
                </TouchableOpacity>
              ))}

              {/* logout button */}
              <View style={styles.logoutSection}>
                <ThemedButton
                  title="Logout"
                  onPress={handleLogout}
                  loading={isLoading}
                  style={styles.logoutButton}
                />
              </View>
            </View>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.purple.darker,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Palette.purple.darker,
    paddingTop: 25,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Palette.yellow.main,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.neutral.white,
    marginBottom: 16,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: Fonts.fredoka.medium,
    color: Palette.neutral.white,
  },
  menuSection: {
    padding: 18,
    backgroundColor: Palette.neutral.offWhite,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.purple.darker,
    marginBottom: 12,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Palette.neutral.white,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.purple.darker,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.neutral.gray,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.fredoka.regular,
    color: Palette.neutral.gray,
  },
  menuArrow: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 28,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.purple.darker,
  },
  logoutSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  logoutButton: {
    backgroundColor: Palette.buttons.warning,
  },
});
