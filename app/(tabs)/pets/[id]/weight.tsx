import { WeightChart } from "@/components/weight-chart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DateField } from "@/components/ui/date-field";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { Screen } from "@/components/ui/screen";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { WeightEntry, addWeight, deleteWeight, getWeights } from "@/services/weights";
import { formatDate, toYMD } from "@/utils/date";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function PetWeight() {
  const { id: petId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = useT();
  const [lang] = useLanguage();
  const [entries, setEntries] = useState<WeightEntry[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState("");
  const [date, setDate] = useState(() => toYMD(new Date()));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setEntries(await getWeights(petId));
    } catch (err: any) {
      setEntries([]);
      Alert.alert(t("common.error"), err?.message ?? t("weight.loadError"));
    }
  }, [petId, t]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleSave = async () => {
    const parsed = parseFloat(value.replace(",", "."));
    if (isNaN(parsed) || parsed <= 0) {
      setError(t("pets.form.errors.weight"));
      return;
    }
    setSaving(true);
    try {
      const [y, m, d] = date.split("-").map(Number);
      await addWeight(petId, parsed, new Date(y, m - 1, d, 12));
      setValue("");
      setAdding(false);
      await load();
    } catch {
      Alert.alert(t("common.error"), t("weight.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (entry: WeightEntry) => {
    Alert.alert(t("weight.deleteConfirm.title"), t("weight.deleteConfirm.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          await deleteWeight(petId, entry.id);
          await load();
        },
      },
    ]);
  };

  const latest = entries?.[entries.length - 1];
  const previous = entries && entries.length > 1 ? entries[entries.length - 2] : undefined;
  const delta = latest && previous ? latest.value - previous.value : null;

  return (
    <Screen scroll>
      <Header title={t("weight.title")} onBack={() => router.back()} />
      {entries === null ? (
        <ActivityIndicator color={Colors.primary} style={styles.loading} />
      ) : (
        <>
          <Card style={styles.summary}>
            <Text style={styles.label}>{t("weight.current")}</Text>
            <Text style={styles.big}>
              {latest ? t("pets.meta.kg", { weight: latest.value }) : "–"}
            </Text>
            {delta !== null ? (
              <Text style={[styles.delta, delta > 0 ? styles.up : delta < 0 ? styles.down : null]}>
                {t("weight.change", {
                  delta: `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`,
                  date: formatDate(previous!.date, lang),
                })}
              </Text>
            ) : (
              <Text style={styles.delta}>{t("weight.noComparison")}</Text>
            )}
            <WeightChart entries={entries} />
          </Card>

          {adding ? (
            <Card style={styles.form}>
              <View style={styles.row}>
                <Input
                  label={t("pets.form.weight")}
                  value={value}
                  onChangeText={(v) => {
                    setValue(v);
                    setError(null);
                  }}
                  keyboardType="decimal-pad"
                  placeholder="9.5"
                  error={error}
                  containerStyle={styles.flex}
                  autoFocus
                />
                <DateField
                  label={t("events.form.date")}
                  value={date}
                  onChange={setDate}
                  maximumDate={new Date()}
                  containerStyle={styles.flex}
                />
              </View>
              <View style={styles.row}>
                <Button
                  title={t("common.cancel")}
                  variant="ghost"
                  onPress={() => setAdding(false)}
                  style={styles.flex}
                />
                <Button title={t("common.save")} onPress={handleSave} loading={saving} style={styles.flex} />
              </View>
            </Card>
          ) : (
            <Button
              title={t("weight.add")}
              icon={<Plus size={18} color={Colors.onPrimary} />}
              onPress={() => setAdding(true)}
            />
          )}

          <Text style={styles.sectionTitle}>{t("weight.history")}</Text>
          <Card style={styles.list}>
            {[...entries].reverse().map((entry, index, arr) => (
              <View key={entry.id} style={[styles.item, index < arr.length - 1 && styles.itemDivider]}>
                <Text style={styles.itemValue}>{t("pets.meta.kg", { weight: entry.value })}</Text>
                <Text style={styles.itemDate}>{formatDate(entry.date, lang)}</Text>
                <Pressable
                  onPress={() => handleDelete(entry)}
                  hitSlop={10}
                  accessibilityLabel={t("common.delete")}
                >
                  <Trash2 size={16} color={Colors.textMuted} />
                </Pressable>
              </View>
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: { marginTop: 40 },
  summary: { marginBottom: Spacing.lg },
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.textMuted,
  },
  big: { fontFamily: Fonts.title, fontSize: 34, color: Colors.text, marginTop: 2 },
  delta: { fontFamily: Fonts.body, fontSize: 13, color: Colors.textMuted, marginBottom: Spacing.sm },
  up: { color: Colors.warning },
  down: { color: Colors.success },
  form: { gap: Spacing.md, marginBottom: Spacing.lg },
  row: { flexDirection: "row", gap: Spacing.md },
  sectionTitle: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.textMuted,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  list: { paddingVertical: 4 },
  item: { flexDirection: "row", alignItems: "center", gap: Spacing.md, paddingVertical: Spacing.md },
  itemDivider: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  itemValue: { fontFamily: Fonts.titleMedium, fontSize: 15, color: Colors.text, width: 76 },
  itemDate: { flex: 1, fontFamily: Fonts.body, fontSize: 13, color: Colors.textMuted },
});
