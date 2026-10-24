import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Screen } from "@/components/ui/screen";
import { Segmented } from "@/components/ui/segmented";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { NewsItem, fetchArticles, fetchNews } from "@/services/content";
import { PubMedArticle } from "@/utils/pubmed";
import { formatDate } from "@/utils/date";
import { useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ExternalLink, Newspaper } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ILLUSTRATION = require("@/assets/images/planner/vaccines.png");

type Section = "news" | "articles";

export default function Discover() {
  const t = useT();
  const [lang] = useLanguage();
  const [section, setSection] = useState<Section>("news");
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [articles, setArticles] = useState<PubMedArticle[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const sections = [
    { label: t("discover.news"), value: "news" },
    { label: t("discover.articles"), value: "articles" },
  ] as const;

  const load = useCallback(
    async (force = false) => {
      setError(null);
      try {
        if (section === "news") setNews(await fetchNews(lang, force));
        else setArticles(await fetchArticles(force));
      } catch {
        setError(t("discover.error"));
      } finally {
        setRefreshing(false);
      }
    },
    [section, lang, t]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const open = (url: string) => WebBrowser.openBrowserAsync(url);
  const list = section === "news" ? news : articles;

  return (
    <Screen>
      <Hero title={t("discover.title")} subtitle={t("discover.subtitle")} image={ILLUSTRATION} />
      <Segmented options={sections} value={section} onChange={setSection} containerStyle={styles.segmented} />
      {error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title={t("discover.retry")} variant="ghost" onPress={() => load(true)} />
        </View>
      ) : list === null ? (
        <ActivityIndicator color={Colors.primary} style={styles.center} />
      ) : (
        <ScrollView
          style={styles.flex}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load(true);
              }}
              tintColor={Colors.primary}
            />
          }
        >
          {list.length === 0 ? (
            <Text style={styles.empty}>{t("discover.empty")}</Text>
          ) : section === "news" ? (
            (list as NewsItem[]).map((item) => (
              <Card key={item.link} onPress={() => open(item.link)} style={styles.card}>
                <Text style={styles.meta}>
                  {item.source}
                  {item.date ? ` · ${formatDate(item.date, lang)}` : ""}
                </Text>
                <Text style={styles.title}>{item.title}</Text>
                {item.summary ? (
                  <Text style={styles.summary} numberOfLines={3}>
                    {item.summary}
                  </Text>
                ) : null}
                <View style={styles.linkRow}>
                  <ExternalLink size={13} color={Colors.primary} />
                  <Text style={styles.link}>{t("discover.open")}</Text>
                </View>
              </Card>
            ))
          ) : (
            (list as PubMedArticle[]).map((item) => (
              <Card key={item.id} onPress={() => open(item.link)} style={styles.card}>
                <Text style={styles.meta}>
                  {item.journal}
                  {item.date ? ` · ${item.date}` : ""}
                </Text>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.linkRow}>
                  <ExternalLink size={13} color={Colors.primary} />
                  <Text style={styles.link}>{t("discover.openPubMed")}</Text>
                </View>
              </Card>
            ))
          )}
          <View style={styles.disclaimer}>
            <Newspaper size={14} color={Colors.textMuted} />
            <Text style={styles.disclaimerText}>{t("discover.disclaimer")}</Text>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  segmented: { marginBottom: Spacing.md },
  center: { marginTop: 40, alignItems: "center", gap: Spacing.md },
  errorText: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMuted, textAlign: "center" },
  empty: { fontFamily: Fonts.body, fontSize: 14, color: Colors.textMuted, textAlign: "center", marginTop: 40 },
  card: { marginBottom: Spacing.md, gap: 4 },
  meta: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: Colors.textMuted,
  },
  title: { fontFamily: Fonts.titleMedium, fontSize: 16, lineHeight: 21, color: Colors.text },
  summary: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 18, color: Colors.textMuted },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  link: { fontFamily: Fonts.bodyBold, fontSize: 12, color: Colors.primary },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  disclaimerText: { flex: 1, fontFamily: Fonts.body, fontSize: 12, color: Colors.textMuted, lineHeight: 17 },
});
