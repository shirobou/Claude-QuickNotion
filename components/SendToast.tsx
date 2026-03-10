import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../utils/theme";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  message?: string;
};

export default function SendToast({
  visible,
  onDismiss,
  message,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1300),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.success, opacity },
      ]}
    >
      <Text style={styles.text}>{message || t("toast.sent")}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
