import { Fonts, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import { useT } from "@/i18n/LanguageProvider";
import iconMap from "@/constants/iconMap";
import { Cat, Dog, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IconPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (icon: ImageSourcePropType) => void;
}

const catIcons = iconMap.cats;
const dogIcons = iconMap.dogs;

export default function IconPickerModal({
  visible,
  onClose,
  onSelect,
}: IconPickerModalProps) {
  const c = useColors();
  const styles = useStyles(makeStyles);
  const t = useT();
  const [selectedTab, setSelectedTab] = useState<"cats" | "dogs">("cats");
  const currentIcons = selectedTab === "cats" ? catIcons : dogIcons;

  const handleSelect = (icon: ImageSourcePropType) => {
    onSelect(icon);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("pets.iconPicker.title")}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={24} color={c.textMuted} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "cats" && styles.activeTab]}
              onPress={() => setSelectedTab("cats")}
            >
              <View style={styles.sectionHeader}>
                <Cat
                  size={20}
                  color={
                    selectedTab === "cats"
                      ? c.surface
                      : c.textMuted
                  }
                  style={styles.iconInline}
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === "cats" && styles.activeTabText,
                  ]}
                >
                  Cats
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "dogs" && styles.activeTab]}
              onPress={() => setSelectedTab("dogs")}
            >
              <View style={styles.sectionHeader}>
                <Dog
                  size={20}
                  color={
                    selectedTab === "dogs"
                      ? c.surface
                      : c.textMuted
                  }
                  style={styles.iconInline}
                />
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === "dogs" && styles.activeTabText,
                  ]}
                >
                  Dogs
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Grid de ícones */}
          <FlatList
            data={currentIcons}
            keyExtractor={(item, index) => `${selectedTab}-${index}`}
            numColumns={4}
            contentContainerStyle={styles.gridContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={styles.iconWrapper}>
                  <Image source={item} style={styles.icon} />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    backgroundColor: c.surface,
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.title,
    color: c.primary,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 20,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: c.border,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: c.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.bodyBold,
    color: c.textMuted,
  },
  activeTabText: {
    color: c.surface,
    fontFamily: Fonts.title,
  },
  gridContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  iconButton: {
    width: "25%",
    aspectRatio: 1,
    padding: 8,
  },
  iconWrapper: {
    flex: 1,
    backgroundColor: c.bg,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  icon: {
    width: 45,
    height: 45,
    marginHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: c.textMuted,
    marginLeft: 8,
  },
  iconInline: {
    marginRight: 8,
  },
});
