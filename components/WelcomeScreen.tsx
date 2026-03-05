import React, { useState } from "react";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../utils/theme";
import {
  saveNotionToken,
  addDestination,
  saveActiveDestinationId,
  markSetupComplete,
} from "../utils/storage";
import { extractDatabaseId } from "../services/notionApi";

type Props = {
  onComplete: () => void;
};

export default function WelcomeScreen({ onComplete }: Props) {
  const { colors, mode } = useAppTheme();
  const { t } = useTranslation();
  const [token, setToken] = useState("");
  const [destName, setDestName] = useState("");
  const [dbInput, setDbInput] = useState("");
  const [titleProp, setTitleProp] = useState("Name");

  const handleStart = async () => {
    if (!token.trim()) {
      Alert.alert(t("welcome.inputError"), t("welcome.enterToken"));
      return;
    }
    if (!dbInput.trim()) {
      Alert.alert(t("welcome.inputError"), t("welcome.enterDbId"));
      return;
    }

    const databaseId = extractDatabaseId(dbInput.trim());

    await saveNotionToken(token.trim());
    const dest = await addDestination({
      name: destName.trim() || t("welcome.defaultDestName"),
      databaseId,
      titleProperty: titleProp.trim() || "Name",
    });
    await saveActiveDestinationId(dest.id);
    await markSetupComplete();
    onComplete();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* App Title */}
        <View style={styles.titleSection}>
          <Text style={[styles.appName, { color: colors.text }]}>
            Memo Bridge
          </Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            {t("welcome.tagline")}
          </Text>
        </View>

        {/* Section 1: Notion Token */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("welcome.step1Title")}
          </Text>
          <Text
            style={[styles.sectionDesc, { color: colors.textSecondary }]}
          >
            {t("welcome.step1Desc")}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.notion.so/profile/integrations/internal")
            }
          >
            <Text style={[styles.link, { color: colors.primary }]}>
              {t("welcome.openIntegrations")}
            </Text>
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder={t("welcome.tokenPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
        </View>

        {/* Section 2: Destination Name */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("welcome.step2Title")}
          </Text>
          <Text
            style={[styles.sectionDesc, { color: colors.textSecondary }]}
          >
            {t("welcome.step2Desc")}
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
            placeholder={t("welcome.destNamePlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={destName}
            onChangeText={setDestName}
          />
        </View>

        {/* Section 3: Database ID */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("welcome.step3Title")}
          </Text>
          <Text
            style={[styles.sectionDesc, { color: colors.textSecondary }]}
          >
            {t("welcome.step3Desc")}
          </Text>
          <Text
            style={[styles.sectionHint, { color: colors.textMuted }]}
          >
            {t("welcome.step3Hint")}
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
            placeholder={t("welcome.dbIdPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={dbInput}
            onChangeText={setDbInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Section 4: Title Property */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t("welcome.step4Title")}
          </Text>
          <Text
            style={[styles.sectionDesc, { color: colors.textSecondary }]}
          >
            {t("welcome.step4Desc")}
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
            value={titleProp}
            onChangeText={setTitleProp}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={handleStart}
          activeOpacity={0.7}
        >
          <Text style={styles.startButtonText}>{t("welcome.startButton")}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    padding: 24,
    paddingTop: 60,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 13,
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 40,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
