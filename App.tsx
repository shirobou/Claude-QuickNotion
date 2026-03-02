import React, { useState, useEffect } from "react";
import * as QuickActions from "expo-quick-actions";
import { useQuickActionCallback } from "expo-quick-actions/hooks";
import { useShareIntent } from "expo-share-intent";
import { useTranslation } from "react-i18next";
import MainScreen from "./components/MainScreen";
import SettingsScreen from "./components/SettingsScreen";
import WelcomeScreen from "./components/WelcomeScreen";
import HistoryScreen from "./components/HistoryScreen";
import HelpScreen from "./components/HelpScreen";
import { isSetupComplete, getThemeMode, ThemeMode, migrateToDestinations } from "./utils/storage";
import { ThemeContext, getThemeColors } from "./utils/theme";
import { initI18n } from "./utils/i18n";

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("dark");
  const [isLoading, setIsLoading] = useState(true);
  const [sharedText, setSharedText] = useState("");

  // 共有インテントの処理
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent();

  useEffect(() => {
    if (hasShareIntent && shareIntent) {
      const incoming = shareIntent.text || shareIntent.webUrl || "";
      if (incoming) {
        setSharedText(incoming);
        setShowSettings(false);
        setShowHelp(false);
        setShowHistory(false);
        setShowWelcome(false);
      }
      resetShareIntent();
    }
  }, [hasShareIntent, shareIntent]);

  // クイックアクションのコールバック処理
  useQuickActionCallback((action) => {
    if (action.id === "history") {
      setShowSettings(false);
      setShowHelp(false);
      setShowWelcome(false);
      setShowHistory(true);
    } else {
      setShowSettings(false);
      setShowHelp(false);
      setShowHistory(false);
      setShowWelcome(false);
    }
  });

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    await initI18n();
    await migrateToDestinations();
    const [complete, theme] = await Promise.all([
      isSetupComplete(),
      getThemeMode(),
    ]);
    setThemeMode(theme);
    if (!complete) {
      setShowWelcome(true);
    }
    setIsLoading(false);

    QuickActions.setItems([
      {
        id: "new_memo",
        title: "新規メモ",
        icon: "symbol:square.and.pencil",
      },
      {
        id: "history",
        title: "送信履歴",
        icon: "symbol:clock.arrow.circlepath",
      },
    ]);

    if (QuickActions.initial) {
      if (QuickActions.initial.id === "history" && complete) {
        setShowHistory(true);
      }
    }
  };

  if (isLoading) return null;

  const colors = getThemeColors(themeMode);
  const theme = { colors, mode: themeMode };

  const renderContent = () => {
    if (showWelcome) {
      return (
        <WelcomeScreen
          onComplete={() => {
            setShowWelcome(false);
            setShowHelp(true);
          }}
        />
      );
    }

    if (showHelp) {
      return <HelpScreen onClose={() => setShowHelp(false)} />;
    }

    if (showHistory) {
      return <HistoryScreen onClose={() => setShowHistory(false)} />;
    }

    if (showSettings) {
      return (
        <SettingsScreen
          onClose={() => setShowSettings(false)}
          onThemeChange={(newMode) => setThemeMode(newMode)}
          onResetSetup={() => {
            setShowSettings(false);
            setShowWelcome(true);
          }}
          onOpenHelp={() => {
            setShowSettings(false);
            setShowHelp(true);
          }}
        />
      );
    }

    return (
      <MainScreen
        onOpenSettings={() => setShowSettings(true)}
        onOpenHistory={() => setShowHistory(true)}
        onOpenHelp={() => setShowHelp(true)}
        sharedText={sharedText}
        onSharedTextConsumed={() => setSharedText("")}
      />
    );
  };

  return (
    <ThemeContext.Provider value={theme}>
      {renderContent()}
    </ThemeContext.Provider>
  );
}
