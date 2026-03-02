import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../utils/theme";
import {
  getHistory,
  clearHistory,
  HistoryEntry,
  getNotionToken,
  getActiveDestination,
  addHistoryEntry,
} from "../utils/storage";
import { sendToNotion } from "../services/notionApi";

type Props = {
  onClose: () => void;
};

export default function HistoryScreen({ onClose }: Props) {
  const { colors, mode } = useAppTheme();
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    const data = await getHistory();
    setHistory(data);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleRetry = async (entry: HistoryEntry) => {
    setRetryingId(entry.id);
    try {
      const token = await getNotionToken();
      const dest = await getActiveDestination();

      if (!token || !dest) {
        Alert.alert(t("history.settingsError"), t("history.settingsErrorMessage"));
        return;
      }

      const result = await sendToNotion(
        token,
        dest.databaseId,
        entry.text,
        dest.titleProperty,
        t
      );

      if (result.success) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        await addHistoryEntry({
          text: entry.text,
          timestamp: Date.now(),
          success: true,
          destinationName: dest.name,
        });
        Alert.alert(t("common.success"), t("history.resent"));
      } else {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error
        );
        Alert.alert(t("history.sendFailed"), result.error);
      }
      await loadHistory();
    } finally {
      setRetryingId(null);
    }
  };

  const handleClearAll = () => {
    Alert.alert(t("settings.clearHistory"), t("history.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          await clearHistory();
          setHistory([]);
        },
      },
    ]);
  };

  const formatDate = (timestamp: number): string => {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const renderItem = ({ item }: { item: HistoryEntry }) => (
    <View
      style={[
        styles.item,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.itemHeader}>
        <View style={styles.itemHeaderLeft}>
          <Text style={[styles.itemDate, { color: colors.textSecondary }]}>
            {formatDate(item.timestamp)}
          </Text>
          {item.destinationName && (
            <Text style={[styles.destLabel, { color: colors.textMuted }]}>
              → {item.destinationName}
            </Text>
          )}
        </View>
        <Text style={item.success ? styles.successBadge : styles.failBadge}>
          {item.success ? "OK" : "NG"}
        </Text>
      </View>
      <Text
        style={[styles.itemText, { color: colors.text }]}
        numberOfLines={3}
      >
        {item.text}
      </Text>
      {item.errorMessage && (
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {item.errorMessage}
        </Text>
      )}
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surfaceAlt }]}
          onPress={() => handleCopy(item.text)}
        >
          <Text style={[styles.actionText, { color: colors.text }]}>
            {t("common.copy")}
          </Text>
        </TouchableOpacity>
        {!item.success && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => handleRetry(item)}
            disabled={retryingId === item.id}
          >
            <Text style={[styles.actionText, { color: colors.white }]}>
              {retryingId === item.id ? t("history.sending") : t("history.retry")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>
            {t("common.back")}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t("history.title")}
        </Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={[styles.clearText, { color: colors.danger }]}>
              {t("history.deleteAll")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            {t("history.empty")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
    minWidth: 60,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  clearButton: {
    padding: 4,
    minWidth: 60,
    alignItems: "flex-end",
  },
  clearText: {
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  item: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  itemDate: {
    fontSize: 13,
  },
  destLabel: {
    fontSize: 12,
  },
  successBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4DAB9A",
    backgroundColor: "#4DAB9A22",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  failBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EB5757",
    backgroundColor: "#EB575722",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  itemText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
  },
});
