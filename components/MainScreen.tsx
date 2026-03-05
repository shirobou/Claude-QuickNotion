import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../utils/theme";
import {
  getNotionToken,
  getDestinations,
  getActiveDestination,
  saveActiveDestinationId,
  addHistoryEntry,
  getTemplates,
  Destination,
  Template,
} from "../utils/storage";
import { sendToNotion } from "../services/notionApi";
import SendToast from "./SendToast";

type Props = {
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
  sharedText?: string;
  onSharedTextConsumed?: () => void;
};

export default function MainScreen({ onOpenSettings, onOpenHistory, onOpenHelp, sharedText, onSharedTextConsumed }: Props) {
  const { colors, mode } = useAppTheme();
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeDest, setActiveDest] = useState<Destination | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    if (sharedText) {
      setText(sharedText);
      onSharedTextConsumed?.();
    }
  }, [sharedText]);

  const loadDestinations = useCallback(async () => {
    const [dests, active, tmpls] = await Promise.all([
      getDestinations(),
      getActiveDestination(),
      getTemplates(),
    ]);
    setDestinations(dests);
    setActiveDest(active);
    setTemplates(tmpls);
  }, []);

  useEffect(() => {
    loadDestinations();
  }, [loadDestinations]);

  const handleSelectDestination = async (dest: Destination) => {
    await saveActiveDestinationId(dest.id);
    setActiveDest(dest);
    setShowPicker(false);
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);

    try {
      const token = await getNotionToken();
      const dest = await getActiveDestination();

      if (!token || !dest) {
        Alert.alert(
          t("main.settingsError"),
          t("main.settingsErrorMessage")
        );
        setIsSending(false);
        return;
      }

      const result = await sendToNotion(
        token,
        dest.databaseId,
        trimmed,
        dest.titleProperty,
        t
      );

      if (result.success) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
        setText("");
        setShowToast(true);
        await addHistoryEntry({
          text: trimmed,
          timestamp: Date.now(),
          success: true,
          destinationName: dest.name,
        });
      } else {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error
        );
        Alert.alert(t("main.sendFailed"), result.error);
        await addHistoryEntry({
          text: trimmed,
          timestamp: Date.now(),
          success: false,
          errorMessage: result.error,
          destinationName: dest.name,
        });
      }
    } catch (error) {
      Alert.alert(t("common.error"), t("main.unexpectedError"));
    } finally {
      setIsSending(false);
    }
  };

  const canSend = text.trim().length > 0 && !isSending && activeDest !== null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <SendToast
        visible={showToast}
        onDismiss={() => setShowToast(false)}
      />

      {/* Destination Picker Modal */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t("main.selectDestination")}
            </Text>
            <FlatList
              data={destinations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor:
                        item.id === activeDest?.id
                          ? colors.primary + "20"
                          : "transparent",
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => handleSelectDestination(item)}
                >
                  <Text
                    style={[
                      styles.modalItemName,
                      {
                        color:
                          item.id === activeDest?.id
                            ? colors.primary
                            : colors.text,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.modalItemDb,
                      { color: colors.textMuted },
                    ]}
                    numberOfLines={1}
                  >
                    {item.databaseId.substring(0, 8)}...
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Memo Bridge
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              onPress={onOpenHelp}
              style={styles.headerButton}
            >
              <Text style={[styles.headerIcon, { color: colors.text }]}>?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onOpenHistory}
              style={styles.headerButton}
            >
              <Text style={styles.headerIcon}>&#128203;</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onOpenSettings}
              style={styles.headerButton}
            >
              <Text style={styles.headerIcon}>&#9881;&#65039;</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Destination Selector */}
        {destinations.length > 0 && (
          <TouchableOpacity
            style={[
              styles.destSelector,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={() => setShowPicker(true)}
            disabled={destinations.length <= 1}
          >
            <Text style={[styles.destName, { color: colors.text }]}>
              {activeDest?.name || t("main.selectDestination")}
            </Text>
            {destinations.length > 1 && (
              <Text style={[styles.destArrow, { color: colors.textMuted }]}>
                ▼
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Text Input */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={t("main.inputPlaceholder")}
            placeholderTextColor={colors.textMuted}
            multiline
            autoFocus
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
            editable={!isSending}
          />
        </View>

        {/* Template Buttons */}
        {templates.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templateRow}
            style={styles.templateScroll}
          >
            {templates.map((tmpl) => (
              <TouchableOpacity
                key={tmpl.id}
                style={[
                  styles.templateChip,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={() => setText((prev) => tmpl.text + prev)}
                activeOpacity={0.7}
              >
                <Text style={[styles.templateChipText, { color: colors.text }]}>
                  {tmpl.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: canSend
                ? colors.primary
                : colors.surfaceAlt,
            },
          ]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          {isSending ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text
              style={[
                styles.sendButtonText,
                {
                  color: canSend ? colors.white : colors.textMuted,
                },
              ]}
            >
              {t("main.sendToNotion")}
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 4,
  },
  headerButton: {
    padding: 8,
  },
  headerIcon: {
    fontSize: 22,
  },
  destSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  destName: {
    fontSize: 15,
    fontWeight: "600",
  },
  destArrow: {
    fontSize: 12,
  },
  inputContainer: {
    height: 200,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  sendButton: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
  },
  sendButtonText: {
    fontSize: 17,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "60%",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalItemDb: {
    fontSize: 12,
    marginTop: 2,
  },
  templateScroll: {
    maxHeight: 44,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  templateRow: {
    gap: 8,
    paddingHorizontal: 2,
  },
  templateChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  templateChipText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center" as const,
  },
});
