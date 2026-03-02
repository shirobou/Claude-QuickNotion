import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../utils/theme";
import {
  getNotionToken,
  saveNotionToken,
  removeNotionToken,
  getDestinations,
  addDestination,
  updateDestination,
  removeDestination,
  saveDestinations,
  getThemeMode,
  saveThemeMode,
  clearHistory,
  resetSetup,
  getTemplates,
  addTemplate,
  updateTemplate,
  removeTemplate,
  saveTemplates,
  ThemeMode,
  Destination,
  Template,
} from "../utils/storage";
import { extractDatabaseId } from "../services/notionApi";
import { getLanguage, saveLanguage, AppLanguage } from "../utils/i18n";

type Props = {
  onClose: () => void;
  onThemeChange: (mode: ThemeMode) => void;
  onResetSetup: () => void;
  onOpenHelp: () => void;
};

function maskToken(token: string): string {
  if (token.length <= 11) return "***";
  return `${token.substring(0, 7)}...${token.substring(token.length - 4)}`;
}

export default function SettingsScreen({
  onClose,
  onThemeChange,
  onResetSetup,
  onOpenHelp,
}: Props) {
  const { colors, mode } = useAppTheme();
  const { t } = useTranslation();
  const [currentToken, setCurrentToken] = useState<string | null>(null);
  const [newToken, setNewToken] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [language, setLanguage] = useState<AppLanguage>("ja");

  // Destination edit modal
  const [showDestModal, setShowDestModal] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [destName, setDestName] = useState("");
  const [destDbId, setDestDbId] = useState("");
  const [destTitleProp, setDestTitleProp] = useState("Name");

  // Template state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showTmplModal, setShowTmplModal] = useState(false);
  const [editingTmpl, setEditingTmpl] = useState<Template | null>(null);
  const [tmplLabel, setTmplLabel] = useState("");
  const [tmplText, setTmplText] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const [token, dests, theme, tmpls, lang] = await Promise.all([
      getNotionToken(),
      getDestinations(),
      getThemeMode(),
      getTemplates(),
      getLanguage(),
    ]);
    setCurrentToken(token);
    setDestinations(dests);
    setThemeMode(theme);
    setTemplates(tmpls);
    setLanguage(lang);
  };

  const handleSaveToken = async () => {
    if (newToken.trim()) {
      await saveNotionToken(newToken.trim());
      setCurrentToken(newToken.trim());
      setNewToken("");
    }
    await saveThemeMode(themeMode);
    onThemeChange(themeMode);
    Alert.alert(t("settings.saved"), t("settings.savedMessage"));
  };

  const handleDeleteToken = () => {
    Alert.alert(
      t("settings.deleteToken"),
      t("settings.deleteTokenConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await removeNotionToken();
            setCurrentToken(null);
          },
        },
      ]
    );
  };

  const handleLanguageChange = async (lang: AppLanguage) => {
    setLanguage(lang);
    await saveLanguage(lang);
  };

  // --- Destination CRUD ---
  const openAddDest = () => {
    setEditingDest(null);
    setDestName("");
    setDestDbId("");
    setDestTitleProp("Name");
    setShowDestModal(true);
  };

  const openEditDest = (dest: Destination) => {
    setEditingDest(dest);
    setDestName(dest.name);
    setDestDbId(dest.databaseId);
    setDestTitleProp(dest.titleProperty);
    setShowDestModal(true);
  };

  const handleSaveDest = async () => {
    if (!destName.trim()) {
      Alert.alert(t("settings.inputError"), t("settings.enterDisplayName"));
      return;
    }
    if (!destDbId.trim()) {
      Alert.alert(t("settings.inputError"), t("settings.enterDatabaseId"));
      return;
    }

    const dbId = extractDatabaseId(destDbId.trim());

    if (editingDest) {
      const updated = {
        ...editingDest,
        name: destName.trim(),
        databaseId: dbId,
        titleProperty: destTitleProp.trim() || "Name",
      };
      await updateDestination(updated);
    } else {
      await addDestination({
        name: destName.trim(),
        databaseId: dbId,
        titleProperty: destTitleProp.trim() || "Name",
      });
    }

    setShowDestModal(false);
    const dests = await getDestinations();
    setDestinations(dests);
    Alert.alert(
      t("settings.saved"),
      editingDest ? t("settings.destinationUpdated") : t("settings.destinationAdded")
    );
  };

  const handleDeleteDest = (dest: Destination) => {
    if (destinations.length <= 1) {
      Alert.alert(t("settings.cannotDelete"), t("settings.cannotDeleteMessage"));
      return;
    }
    Alert.alert(
      t("settings.deleteDestination"),
      t("settings.deleteDestinationConfirm", { name: dest.name }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await removeDestination(dest.id);
            const dests = await getDestinations();
            setDestinations(dests);
          },
        },
      ]
    );
  };

  // --- Template CRUD ---
  const openAddTmpl = () => {
    setEditingTmpl(null);
    setTmplLabel("");
    setTmplText("");
    setShowTmplModal(true);
  };

  const openEditTmpl = (tmpl: Template) => {
    setEditingTmpl(tmpl);
    setTmplLabel(tmpl.label);
    setTmplText(tmpl.text);
    setShowTmplModal(true);
  };

  const handleSaveTmpl = async () => {
    if (!tmplLabel.trim()) {
      Alert.alert(t("settings.inputError"), t("settings.enterButtonName"));
      return;
    }
    if (!tmplText.trim()) {
      Alert.alert(t("settings.inputError"), t("settings.enterInsertText"));
      return;
    }

    if (editingTmpl) {
      await updateTemplate({
        ...editingTmpl,
        label: tmplLabel.trim(),
        text: tmplText.trim(),
      });
    } else {
      await addTemplate({
        label: tmplLabel.trim(),
        text: tmplText.trim(),
      });
    }

    setShowTmplModal(false);
    setTemplates(await getTemplates());
  };

  const handleMoveTmpl = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= templates.length) return;
    const updated = [...templates];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    await saveTemplates(updated);
    setTemplates(updated);
  };

  const handleDeleteTmpl = (tmpl: Template) => {
    Alert.alert(
      t("settings.deleteTemplate"),
      t("settings.deleteTemplateConfirm", { name: tmpl.label }),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await removeTemplate(tmpl.id);
            setTemplates(await getTemplates());
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(t("settings.clearHistory"), t("settings.clearHistoryConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: async () => {
          await clearHistory();
          Alert.alert(t("common.done"), t("settings.historyCleared"));
        },
      },
    ]);
  };

  const handleResetAll = () => {
    Alert.alert(
      t("settings.resetAll"),
      t("settings.resetAllConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.resetAll"),
          style: "destructive",
          onPress: async () => {
            await removeNotionToken();
            await saveDestinations([]);
            await clearHistory();
            await resetSetup();
            onResetSetup();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />

      {/* Destination Edit Modal */}
      <Modal
        visible={showDestModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDestModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={styles.modalOverlayTop}
            activeOpacity={1}
            onPress={() => setShowDestModal(false)}
          />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingDest ? t("settings.editDestination") : t("settings.addDestinationTitle")}
              </Text>

              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                {t("settings.displayName")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder={t("settings.displayNamePlaceholder")}
                placeholderTextColor={colors.textMuted}
                value={destName}
                onChangeText={setDestName}
              />

              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                {t("settings.databaseId")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder={t("settings.databaseIdPlaceholder")}
                placeholderTextColor={colors.textMuted}
                value={destDbId}
                onChangeText={setDestDbId}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                {t("settings.titleProperty")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Name"
                placeholderTextColor={colors.textMuted}
                value={destTitleProp}
                onChangeText={setDestTitleProp}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.surfaceAlt },
                  ]}
                  onPress={() => setShowDestModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>
                    {t("common.cancel")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSaveDest}
                >
                  <Text style={[styles.modalButtonText, { color: colors.white }]}>
                    {t("common.save")}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Template Edit Modal */}
      <Modal
        visible={showTmplModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTmplModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableOpacity
            style={styles.modalOverlayTop}
            activeOpacity={1}
            onPress={() => setShowTmplModal(false)}
          />
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingTmpl ? t("settings.editTemplate") : t("settings.addTemplateTitle")}
              </Text>

              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                {t("settings.buttonName")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder={t("settings.buttonNamePlaceholder")}
                placeholderTextColor={colors.textMuted}
                value={tmplLabel}
                onChangeText={setTmplLabel}
              />

              <Text style={[styles.modalLabel, { color: colors.textSecondary }]}>
                {t("settings.insertText")}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder={t("settings.insertTextPlaceholder")}
                placeholderTextColor={colors.textMuted}
                value={tmplText}
                onChangeText={setTmplText}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.surfaceAlt },
                  ]}
                  onPress={() => setShowTmplModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>
                    {t("common.cancel")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSaveTmpl}
                >
                  <Text style={[styles.modalButtonText, { color: colors.white }]}>
                    {t("common.save")}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.primary }]}>
            {t("common.back")}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t("settings.title")}</Text>
        <TouchableOpacity onPress={handleSaveToken} style={styles.saveButton}>
          <Text style={[styles.saveText, { color: colors.primary }]}>{t("common.save")}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Notion Token */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("settings.notionToken")}
          </Text>
          {currentToken && (
            <View style={styles.currentTokenRow}>
              <Text
                style={[
                  styles.maskedToken,
                  {
                    color: colors.textSecondary,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                {maskToken(currentToken)}
              </Text>
              <TouchableOpacity onPress={handleDeleteToken}>
                <Text style={[styles.deleteText, { color: colors.danger }]}>
                  {t("common.delete")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder={currentToken ? t("settings.overwriteToken") : t("settings.enterToken")}
            placeholderTextColor={colors.textMuted}
            value={newToken}
            onChangeText={setNewToken}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.notion.so/profile/integrations/internal")
            }
          >
            <Text style={[styles.link, { color: colors.primary }]}>
              {t("settings.openIntegrations")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Destinations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("settings.destinations")}
          </Text>
          {destinations.map((dest) => (
            <View
              key={dest.id}
              style={[
                styles.destItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.destInfo}>
                <Text style={[styles.destItemName, { color: colors.text }]}>
                  {dest.name}
                </Text>
                <Text
                  style={[styles.destItemDb, { color: colors.textMuted }]}
                  numberOfLines={1}
                >
                  DB: {dest.databaseId.substring(0, 12)}...
                </Text>
              </View>
              <View style={styles.destActions}>
                <TouchableOpacity onPress={() => openEditDest(dest)}>
                  <Text style={[styles.destActionText, { color: colors.primary }]}>
                    {t("common.edit")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteDest(dest)}>
                  <Text style={[styles.destActionText, { color: colors.danger }]}>
                    {t("common.delete")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity
            style={[
              styles.addButton,
              { borderColor: colors.primary },
            ]}
            onPress={openAddDest}
          >
            <Text style={[styles.addButtonText, { color: colors.primary }]}>
              {t("settings.addDestination")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Templates */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("settings.templates")}
          </Text>
          <Text style={[styles.hint, { color: colors.textMuted, marginBottom: 10 }]}>
            {t("settings.templateHint")}
          </Text>
          {templates.map((tmpl, index) => (
            <View
              key={tmpl.id}
              style={[
                styles.destItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              {/* 並べ替えボタン */}
              <View style={styles.tmplReorder}>
                <TouchableOpacity
                  onPress={() => handleMoveTmpl(index, "up")}
                  disabled={index === 0}
                  style={styles.reorderButton}
                >
                  <Text style={{ color: index === 0 ? colors.textMuted : colors.text, fontSize: 16 }}>
                    ▲
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMoveTmpl(index, "down")}
                  disabled={index === templates.length - 1}
                  style={styles.reorderButton}
                >
                  <Text style={{ color: index === templates.length - 1 ? colors.textMuted : colors.text, fontSize: 16 }}>
                    ▼
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.destInfo}>
                <Text style={[styles.destItemName, { color: colors.text }]}>
                  {tmpl.label}
                </Text>
                <Text
                  style={[styles.destItemDb, { color: colors.textMuted }]}
                  numberOfLines={1}
                >
                  → {tmpl.text}
                </Text>
              </View>
              <View style={styles.destActions}>
                <TouchableOpacity onPress={() => openEditTmpl(tmpl)}>
                  <Text style={[styles.destActionText, { color: colors.primary }]}>
                    {t("common.edit")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTmpl(tmpl)}>
                  <Text style={[styles.destActionText, { color: colors.danger }]}>
                    {t("common.delete")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {templates.length < 5 && (
            <TouchableOpacity
              style={[styles.addButton, { borderColor: colors.primary }]}
              onPress={openAddTmpl}
            >
              <Text style={[styles.addButtonText, { color: colors.primary }]}>
                {t("settings.addTemplate")}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("settings.theme")}
          </Text>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[
                styles.themeChip,
                {
                  backgroundColor:
                    themeMode === "dark" ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setThemeMode("dark")}
            >
              <Text
                style={[
                  styles.themeChipText,
                  {
                    color:
                      themeMode === "dark" ? colors.white : colors.text,
                  },
                ]}
              >
                {t("settings.dark")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeChip,
                {
                  backgroundColor:
                    themeMode === "light" ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setThemeMode("light")}
            >
              <Text
                style={[
                  styles.themeChipText,
                  {
                    color:
                      themeMode === "light" ? colors.white : colors.text,
                  },
                ]}
              >
                {t("settings.light")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("settings.language")}
          </Text>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[
                styles.themeChip,
                {
                  backgroundColor:
                    language === "ja" ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleLanguageChange("ja")}
            >
              <Text
                style={[
                  styles.themeChipText,
                  {
                    color:
                      language === "ja" ? colors.white : colors.text,
                  },
                ]}
              >
                {t("settings.japanese")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeChip,
                {
                  backgroundColor:
                    language === "en" ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => handleLanguageChange("en")}
            >
              <Text
                style={[
                  styles.themeChipText,
                  {
                    color:
                      language === "en" ? colors.white : colors.text,
                  },
                ]}
              >
                {t("settings.english")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("settings.dataManagement")}
          </Text>
          <TouchableOpacity
            style={[styles.dangerButton, { borderColor: colors.border }]}
            onPress={handleClearHistory}
          >
            <Text style={[styles.dangerButtonText, { color: colors.danger }]}>
              {t("settings.clearHistory")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dangerButton,
              { borderColor: colors.border, marginTop: 10 },
            ]}
            onPress={handleResetAll}
          >
            <Text style={[styles.dangerButtonText, { color: colors.danger }]}>
              {t("settings.resetAll")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.helpButton, { backgroundColor: colors.primary }]}
            onPress={onOpenHelp}
            activeOpacity={0.7}
          >
            <Text style={styles.helpButtonText}>
              {t("settings.viewGuide")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.versionText, { color: colors.textMuted }]}>
            Quick Notion v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: { padding: 4, minWidth: 60 },
  backText: { fontSize: 16, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  saveButton: { padding: 4, minWidth: 60, alignItems: "flex-end" },
  saveText: { fontSize: 16, fontWeight: "700" },
  content: { padding: 20 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  currentTokenRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  maskedToken: {
    fontSize: 14,
    fontFamily: "monospace",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    overflow: "hidden",
  },
  deleteText: { fontSize: 14, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 8,
  },
  link: { fontSize: 14, fontWeight: "600" },
  helpButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  helpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  hint: { fontSize: 13, marginTop: 4 },
  // Destinations
  destItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  destInfo: { flex: 1, marginRight: 12 },
  destItemName: { fontSize: 15, fontWeight: "600" },
  destItemDb: { fontSize: 12, marginTop: 2 },
  destActions: { flexDirection: "row", gap: 14 },
  destActionText: { fontSize: 14, fontWeight: "600" },
  addButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  addButtonText: { fontSize: 15, fontWeight: "600" },
  // Theme
  themeRow: { flexDirection: "row", gap: 10 },
  themeChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeChipText: { fontSize: 15, fontWeight: "600" },
  // Data
  dangerButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  dangerButtonText: { fontSize: 15, fontWeight: "600" },
  versionText: { fontSize: 14 },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalOverlayTop: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  modalLabel: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  modalButtons: { flexDirection: "row", gap: 12, marginTop: 16 },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonText: { fontSize: 16, fontWeight: "700" },
  tmplReorder: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    gap: 2,
  },
  reorderButton: {
    padding: 2,
  },
});
