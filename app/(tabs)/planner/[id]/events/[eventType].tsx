import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import Badge from "@/components/ui/badge";
import { ThemedButton } from "@/components/ui/themed-button";
import { Fonts } from "@/constants/fonts";
import { Palette } from "@/constants/palette";
import { completeEvent, getAllEventsForPet } from "@/services/events";
import { Event } from "@/types/event";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Calendar, Clock, RefreshCw } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EVENT_TYPE_LABELS: Record<string, string> = {
  food: "Food",
  walk: "Walks",
  medication: "Medication",
  playTime: "Play Time",
  vaccination: "Vaccines",
  bath: "Baths",
  other: "Other",
};

function getBadgeForDate(date?: Date | null) {
  if (!date) return null;

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (dateOnly < startOfToday) {
    return {
      text: "Past",
      backgroundColor: Palette.neutral.gray,
      textColor: Palette.neutral.white,
    };
  }

  if (dateOnly.getTime() === startOfToday.getTime()) {
    return {
      text: "Today",
      backgroundColor: Palette.badge.red,
      textColor: Palette.neutral.white,
    };
  }

  const sevenDaysAhead = new Date(
    startOfToday.getTime() + 7 * 24 * 60 * 60 * 1000
  );
  if (dateOnly > startOfToday && dateOnly <= sevenDaysAhead) {
    return {
      text: "This week",
      backgroundColor: Palette.badge.blue,
      textColor: Palette.neutral.white,
    };
  }

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  ) {
    return {
      text: "This month",
      backgroundColor: Palette.badge.yellow,
      textColor: Palette.neutral.white,
    };
  }

  if (date.getFullYear() > now.getFullYear()) {
    return {
      text: "Next year",
      backgroundColor: Palette.badge.purple,
      textColor: Palette.neutral.white,
    };
  }

  return null;
}

export default function EventTypeList() {
  const { id: petId, eventType } = useLocalSearchParams<{
    id: string;
    eventType: string;
  }>();
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      const allEvents = await getAllEventsForPet(petId);
      const now = new Date();

      const filteredEvents = allEvents
        .filter((event) => {
          if (event.type !== eventType) return false;
          const eventDate = event.nextDate || event.inicialDate;
          const isPast = eventDate && eventDate < now;
          return showCompleted ? isPast : !isPast;
        })
        .sort((a, b) => {
          const dateA = a.nextDate || a.inicialDate;
          const dateB = b.nextDate || b.inicialDate;
          if (!dateA || !dateB) return 0;
          return dateA.getTime() - dateB.getTime();
        });

      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      Alert.alert("Error", "Failed to load events");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [petId, eventType, showCompleted]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const handleCompleteEvent = async (eventId: string) => {
    Alert.alert("Complete Event", "Mark this event as completed?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Complete",
        onPress: async () => {
          try {
            await completeEvent(petId, eventId);
            Alert.alert("Success", "Event completed!", [
              { text: "OK", onPress: () => loadEvents() },
            ]);
          } catch (error) {
            console.error("Error completing event:", error);
            Alert.alert("Error", "Failed to complete event");
          }
        },
      },
    ]);
  };

  const handleAddEvent = () => {
    router.push(`/planner/${petId}/events/addEvent?type=${eventType}`);
  };

  const handleEditEvent = (eventId: string, isPast: boolean) => {
    if (isPast) {
      Alert.alert(
        "Past Event",
        "This event has already passed and cannot be edited."
      );
      return;
    }
    router.push(`/planner/${petId}/events/editEvent/${eventId}`);
  };

  const handleGoBack = () => {
    router.push(`/planner/${petId}`);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const getRecurrenceText = (event: Event) => {
    if (!event.recurrence) return null;
    const { amount, unit } = event.recurrence;
    return `Every ${amount} ${unit}`;
  };

  const isEventPast = (event: Event) => {
    const now = new Date();
    const eventDate = event.nextDate || event.inicialDate;
    return eventDate && eventDate < now;
  };

  const renderEventCard = ({ item: event }: { item: Event }) => {
    const isPast = isEventPast(event);
    const eventDate = event.nextDate || event.inicialDate;

    return (
      <Pressable
        style={[styles.eventCard, isPast && styles.eventCardPast]}
        onPress={() => event.id && handleEditEvent(event.id, isPast)}
        disabled={isPast}
      >
        <View style={styles.eventCardContent}>
          <View style={styles.eventCardLeft}>
            {eventDate && (
              <>
                <View style={styles.eventCardDateRow}>
                  <Calendar
                    size={16}
                    color={
                      isPast ? Palette.neutral.gray : Palette.purple.darker
                    }
                  />
                  <ThemedText
                    style={[styles.eventDateText, isPast && styles.pastText]}
                  >
                    {formatDate(eventDate)}
                  </ThemedText>
                </View>

                <View style={styles.eventCardTimeRow}>
                  <Clock
                    size={16}
                    color={isPast ? Palette.neutral.gray : Palette.purple.main}
                  />
                  <ThemedText
                    style={[styles.eventTimeText, isPast && styles.pastText]}
                  >
                    {formatTime(eventDate)}
                  </ThemedText>
                </View>
              </>
            )}

            {event.recurrence && (
              <View style={styles.eventCardRecurrenceRow}>
                <RefreshCw
                  size={14}
                  color={isPast ? Palette.neutral.gray : Palette.purple.main}
                />
                <ThemedText
                  style={[styles.recurrenceText, isPast && styles.pastText]}
                >
                  {getRecurrenceText(event)}
                </ThemedText>
              </View>
            )}

            {event.notes && (
              <View style={styles.notesContainer}>
                <ThemedText
                  style={[styles.notesText, isPast && styles.pastText]}
                  numberOfLines={2}
                >
                  {event.notes}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.eventCardTopRight} />
        {(() => {
          const badgeDate = event.nextDate || event.inicialDate;
          const badge = getBadgeForDate(badgeDate as Date | undefined);
          return badge ? (
            <Badge
              text={badge.text}
              backgroundColor={badge.backgroundColor}
              textColor={badge.textColor}
            />
          ) : null;
        })()}
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Calendar size={64} color={Palette.neutral.gray} strokeWidth={2} />
      <ThemedText style={styles.emptyStateTitle}>
        {showCompleted ? "No Completed Events" : "No Events Yet"}
      </ThemedText>
      <ThemedText style={styles.emptyStateText}>
        {showCompleted
          ? "Completed events will appear here"
          : `Add your first ${
              EVENT_TYPE_LABELS[eventType]?.toLowerCase() || "event"
            } to get started!`}
      </ThemedText>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Palette.neutral.offWhite }}
        edges={["top", "bottom"]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Palette.purple.main} />
          <ThemedText style={styles.loadingText}>Loading events...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Palette.neutral.offWhite }}
      edges={["top", "bottom"]}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color={Palette.purple.darker} />
          </TouchableOpacity>

          <ThemedText style={styles.title}>
            {EVENT_TYPE_LABELS[eventType] || eventType}
          </ThemedText>

          <View style={{ width: 40 }} />
        </View>

        <View style={styles.addButtonContainer}>
          <ThemedButton
            title={`Add New Event`}
            style={styles.addButton}
            onPress={handleAddEvent}
          />
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              !showCompleted && styles.filterButtonActive,
            ]}
            onPress={() => setShowCompleted(false)}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                !showCompleted && styles.filterButtonTextActive,
              ]}
            >
              Active
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              showCompleted && styles.filterButtonActive,
            ]}
            onPress={() => setShowCompleted(true)}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                showCompleted && styles.filterButtonTextActive,
              ]}
            >
              Completed
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.listSection}>
          <ThemedText style={styles.sectionTitle}>
            {events.length === 0
              ? "No events"
              : `${events.length} event${events.length > 1 ? "s" : ""}`}
          </ThemedText>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            {events.length === 0 ? (
              renderEmptyState()
            ) : (
              <View style={styles.cardsContainer}>
                {events.map((event) => (
                  <View key={event.id || Math.random().toString()}>
                    {renderEventCard({ item: event })}
                  </View>
                ))}
                <View style={styles.bottomSpacing} />
              </View>
            )}
          </ScrollView>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.neutral.offWhite,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.fredoka.medium,
    color: Palette.neutral.gray,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: Palette.neutral.offWhite,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.purple.darker,
  },
  addButtonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  addButton: {
    backgroundColor: Palette.purple.darker,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Palette.neutral.white,
    borderWidth: 2,
    borderColor: Palette.neutral.lightGray,
    alignItems: "center",
    shadowColor: "#000",
  },
  filterButtonActive: {
    backgroundColor: Palette.yellow.main,
    borderColor: Palette.purple.darker,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.neutral.gray,
  },
  filterButtonTextActive: {
    color: Palette.purple.darker,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.neutral.gray,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingBottom: 16,
    margin: 3,
  },
  eventCard: {
    backgroundColor: Palette.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: Palette.purple.light,
  },
  eventCardPast: {
    backgroundColor: Palette.neutral.lightGray,
    opacity: 0.7,
    borderLeftColor: Palette.neutral.gray,
  },
  eventCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventCardLeft: {
    flex: 1,
  },
  eventCardTopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventCardDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  eventDateText: {
    fontSize: 16,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.purple.darker,
  },
  eventCardTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  eventTimeText: {
    fontSize: 15,
    fontFamily: Fonts.fredoka.regular,
    color: Palette.purple.main,
  },
  eventCardRecurrenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  recurrenceText: {
    fontSize: 13,
    fontFamily: Fonts.fredoka.medium,
    color: Palette.purple.main,
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Palette.neutral.lightGray,
  },
  notesText: {
    fontSize: 13,
    fontFamily: Fonts.fredoka.regular,
    color: Palette.neutral.gray,
    fontStyle: "italic",
  },
  pastText: {
    color: Palette.neutral.gray,
  },
  completeButton: {
    padding: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: Fonts.fredoka.bold,
    color: Palette.purple.darker,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: Fonts.fredoka.regular,
    color: Palette.neutral.gray,
    textAlign: "center",
  },
  bottomSpacing: {
    height: 20,
  },
});
