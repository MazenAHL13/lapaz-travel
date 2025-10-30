import React from "react";
import { Linking, Platform, Pressable, Text } from "react-native";
import { useThemeColors } from "@/src/hooks/useThemeColors";

type Props = {
  latitude?: number;
  longitude?: number;
  title?: string;
};

export default function OpenInMapsButton({ latitude, longitude, title }: Props) {
  const { colors } = useThemeColors();
  const hasCoords = typeof latitude === "number" && typeof longitude === "number";

  const openInMaps = () => {
    if (!hasCoords) return;

    const lat = latitude as number;
    const lng = longitude as number;
    const placeName = title ?? "Destino";

    const apple = `http://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(placeName)}`;
    const android = `geo:0,0?q=${lat},${lng}(${encodeURIComponent(placeName)})&navigate=yes`;
    const web = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    const url = Platform.select({ ios: apple, android }) ?? web;
    Linking.openURL(url);
  };

  return (
    <Pressable
      onPress={openInMaps}
      disabled={!hasCoords}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 14,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: hasCoords ? colors.primary : colors.border,
      }}
    >
      <Text
        style={{
          color: hasCoords ? colors.primary : colors.textSecondary,
          fontWeight: "600",
          fontSize: 16,
        }}
      >
        Abrir en Google/Apple Maps
      </Text>
    </Pressable>
  );
}