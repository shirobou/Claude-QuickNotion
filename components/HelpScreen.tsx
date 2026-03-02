import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../utils/theme";

type Props = {
  onClose: () => void;
};

export default function HelpScreen({ onClose }: Props) {
  const { colors, mode } = useAppTheme();
  const { t } = useTranslation();

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        {title}
      </Text>
      {children}
    </View>
  );

  const Step = ({ number, text }: { number: string; text: string }) => (
    <View style={styles.step}>
      <Text style={[styles.stepNumber, { color: colors.primary }]}>
        {number}
      </Text>
      <Text style={[styles.stepText, { color: colors.textSecondary }]}>
        {text}
      </Text>
    </View>
  );

  const Tip = ({ text }: { text: string }) => (
    <View
      style={[styles.tipBox, { backgroundColor: colors.primary + "15" }]}
    >
      <Text style={[styles.tipText, { color: colors.text }]}>{text}</Text>
    </View>
  );

  const Warning = ({ text }: { text: string }) => (
    <View
      style={[styles.warningBox, { backgroundColor: "#EB575715" }]}
    >
      <Text style={[styles.warningText, { color: colors.text }]}>{text}</Text>
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
          {t("help.title")}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Overview */}
        <Section title={t("help.aboutTitle")}>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("help.aboutBody")}
          </Text>
        </Section>

        {/* Initial Setup */}
        <Section title={t("help.setupTitle")}>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("help.setupIntegrationTitle")}
          </Text>
          <Step number="1" text={t("help.setupStep1")} />
          <Step number="2" text={t("help.setupStep2")} />
          <Step number="3" text={t("help.setupStep3")} />
          <Step number="4" text={t("help.setupStep4")} />
          <Step number="5" text={t("help.setupStep5")} />

          <Warning text={t("help.setupWarning")} />

          <Text
            style={[styles.subtitle, { color: colors.text, marginTop: 16 }]}
          >
            {t("help.setupConnectTitle")}
          </Text>
          <Step number="1" text={t("help.setupConnect1")} />
          <Step number="2" text={t("help.setupConnect2")} />
          <Step number="3" text={t("help.setupConnect3")} />

          <Warning text={t("help.setupConnectWarning")} />
        </Section>

        {/* Database ID */}
        <Section title={t("help.dbIdTitle")}>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("help.dbIdBody")}
          </Text>

          <Text
            style={[styles.subtitle, { color: colors.text, marginTop: 12 }]}
          >
            {t("help.dbIdStandalone")}
          </Text>
          <Step number="1" text={t("help.dbIdStandalone1")} />
          <Step number="2" text={t("help.dbIdStandalone2")} />

          <Text
            style={[styles.subtitle, { color: colors.text, marginTop: 12 }]}
          >
            {t("help.dbIdEmbedded")}
          </Text>
          <Step number="1" text={t("help.dbIdEmbedded1")} />
          <Step number="2" text={t("help.dbIdEmbedded2")} />

          <Warning text={t("help.dbIdWarning")} />
        </Section>

        {/* Title Property */}
        <Section title={t("help.titlePropTitle")}>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("help.titlePropBody")}
          </Text>
          <Text
            style={[styles.body, { color: colors.textSecondary, marginTop: 8 }]}
          >
            {t("help.titlePropBody2")}
          </Text>

          <Tip text={t("help.titlePropTip")} />
        </Section>

        {/* Multiple Destinations */}
        <Section title={t("help.multiDestTitle")}>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("help.multiDestBody")}
          </Text>
          <Step number="1" text={t("help.multiDest1")} />
          <Step number="2" text={t("help.multiDest2")} />
          <Step number="3" text={t("help.multiDest3")} />

          <Tip text={t("help.multiDestTip")} />
        </Section>

        {/* Usage */}
        <Section title={t("help.sendTitle")}>
          <Step number="1" text={t("help.send1")} />
          <Step number="2" text={t("help.send2")} />
          <Step number="3" text={t("help.send3")} />
          <Text
            style={[styles.body, { color: colors.textSecondary, marginTop: 8 }]}
          >
            {t("help.sendBody")}
          </Text>
        </Section>

        {/* Troubleshooting */}
        <Section title={t("help.troubleTitle")}>
          <Text style={[styles.subtitle, { color: colors.text }]}>
            {t("help.trouble1Title")}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("help.trouble1Body")}
          </Text>

          <Text
            style={[styles.subtitle, { color: colors.text, marginTop: 16 }]}
          >
            {t("help.trouble2Title")}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("help.trouble2Body")}
          </Text>

          <Text
            style={[styles.subtitle, { color: colors.text, marginTop: 16 }]}
          >
            {t("help.trouble3Title")}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            {t("help.trouble3Body")}
          </Text>
        </Section>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Notion Memo v1.0.0
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
  content: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  subtitle: { fontSize: 15, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 14, lineHeight: 22 },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingLeft: 4,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "700",
    width: 24,
  },
  stepText: { fontSize: 14, lineHeight: 22, flex: 1 },
  tipBox: {
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
  },
  tipText: { fontSize: 13, lineHeight: 20 },
  warningBox: {
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
  },
  warningText: { fontSize: 13, lineHeight: 20 },
  footer: { alignItems: "center", marginTop: 20 },
  footerText: { fontSize: 13 },
});
