import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Hero } from "@/components/ui/hero";
import { Screen } from "@/components/ui/screen";
import { Segmented } from "@/components/ui/segmented";
import { Fonts, Spacing, Palette } from "@/constants/theme";
import { useColors, useStyles } from "@/theme/ThemeProvider";
import { useLanguage, useT } from "@/i18n/LanguageProvider";
import { NewsItem, fetchArticles, fetchNews } from "@/services/content";
import { formatDate } from "@/utils/date";
import { PubMedArticle } from "@/utils/pubmed";
import { useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ExternalLink, Newspaper } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const ILLUSTRATION = require("@/assets/images/planner/vaccines.png");

const SECTIONS = ["news", "articles"] as const;
type Section = (typeof SECTIONS)[number];

type PageState<T> = { data: T[] | null; error: boolean; refreshing: boolean };
const initialPage = { data: null, error: false, refreshing: false };

function Page<T>({
  state,
  width,
  onRefresh,
  renderItem,
  footer,
}: {
  state: PageState<T>;
  width: number;
  onRefresh: () => void;
  renderItem: (item: T) => React.ReactNode;
  footer: React.ReactNode;
}) {
  const t = useT();
  const c = useColors();
  const styles = useStyles(makeStyles);
  if (state.error) {
    return (
      <View style={[styles.page, styles.center, { width }]}>
        <Text style={styles.errorText}>{t("discover.error")}</Text>
        <Button title={t("discover.retry")} variant="ghost" onPress={onRefresh} />
      </View>
    );
  }
  if (state.data === null) {
    return (
      <View style={[styles.page, styles.center, { width }]}>
        <ActivityIndicator color={c.primary} />
      </View>
    );
  }
  return (
    <ScrollView
      style={[styles.page, { width }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} tintColor={c.primary} />
      }
    >
      {state.data.length === 0 ? (
        <Text style={styles.empty}>{t("discover.empty")}</Text>
      ) : (
        state.data.map(renderItem)
      )}
      {footer}
    </ScrollView>
  );
}

export default function Discover() {
  const c = useColors();
  const styles = useStyles(makeStyles);
  const t = useT();
  const [lang] = useLanguage();
  const { width: windowWidth } = useWindowDimensions();
  const pageWidth = windowWidth - 2 * Spacing.lg; // Screen horizontal padding
  const pager = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [section, setSection] = useState<Section>("news");
  const [news, setNews] = useState<PageState<NewsItem>>(initialPage);
  const [articles, setArticles] = useState<PageState<PubMedArticle>>(initialPage);

  const sectionOptions = SECTIONS.map((s) => ({ label: t(`discover.${s}`), value: s }));

  const loadNews = useCallback(
    async (force = false) => {
      setNews((s) => ({ ...s, error: false, refreshing: force }));
      try {
        setNews({ data: await fetchNews(lang, force), error: false, refreshing: false });
      } catch {
        setNews({ data: null, error: true, refreshing: false });
      }
    },
    [lang]
  );

  const loadArticles = useCallback(async (force = false) => {
    setArticles((s) => ({ ...s, error: false, refreshing: force }));
    try {
      setArticles({ data: await fetchArticles(force), error: false, refreshing: false });
    } catch {
      setArticles({ data: null, error: true, refreshing: false });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNews();
      loadArticles();
    }, [loadNews, loadArticles])
  );

  // segmented and swipe stay in sync
  const goTo = (next: Section) => {
    setSection(next);
    pager.current?.scrollTo({ x: SECTIONS.indexOf(next) * pageWidth, animated: true });
  };
  const handleSwipeEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / pageWidth);
    setSection(SECTIONS[Math.min(Math.max(index, 0), SECTIONS.length - 1)]);
  };

  const open = (url: string) => WebBrowser.openBrowserAsync(url);

  const disclaimer = (
    <View style={styles.disclaimer}>
      <Newspaper size={14} color={c.textMuted} />
      <Text style={styles.disclaimerText}>{t("discover.disclaimer")}</Text>
    </View>
  );

  return (
    <Screen>
      <Hero title={t("discover.title")} subtitle={t("discover.subtitle")} image={ILLUSTRATION} />
      <Segmented options={sectionOptions} value={section} onChange={goTo} containerStyle={styles.segmented} />
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleSwipeEnd}
        style={styles.flex}
      >
        <Page
          state={news}
          width={pageWidth}
          onRefresh={() => loadNews(true)}
          footer={disclaimer}
          renderItem={(item) => (
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
                <ExternalLink size={13} color={c.primary} />
                <Text style={styles.link}>{t("discover.open")}</Text>
              </View>
            </Card>
          )}
        />
        <Page
          state={articles}
          width={pageWidth}
          onRefresh={() => loadArticles(true)}
          footer={disclaimer}
          renderItem={(item) => (
            <Card key={item.id} onPress={() => open(item.link)} style={styles.card}>
              <Text style={styles.meta}>
                {item.journal}
                {item.date ? ` · ${item.date}` : ""}
              </Text>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.linkRow}>
                <ExternalLink size={13} color={c.primary} />
                <Text style={styles.link}>{t("discover.openPubMed")}</Text>
              </View>
            </Card>
          )}
        />
      </ScrollView>
    </Screen>
  );
}

const makeStyles = (c: Palette) => StyleSheet.create({
  flex: { flex: 1 },
  segmented: { marginBottom: Spacing.md },
  page: { flex: 1 },
  center: { alignItems: "center", justifyContent: "flex-start", paddingTop: 40, gap: Spacing.md },
  errorText: { fontFamily: Fonts.body, fontSize: 14, color: c.textMuted, textAlign: "center" },
  empty: { fontFamily: Fonts.body, fontSize: 14, color: c.textMuted, textAlign: "center", marginTop: 40 },
  card: { marginBottom: Spacing.md, gap: 4 },
  meta: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: c.textMuted,
  },
  title: { fontFamily: Fonts.titleMedium, fontSize: 16, lineHeight: 21, color: c.text },
  summary: { fontFamily: Fonts.body, fontSize: 13, lineHeight: 18, color: c.textMuted },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  link: { fontFamily: Fonts.bodyBold, fontSize: 12, color: c.primary },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  disclaimerText: { flex: 1, fontFamily: Fonts.body, fontSize: 12, color: c.textMuted, lineHeight: 17 },
});
