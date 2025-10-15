export const palette = {
  light: {
    primary: "#0EA5E9",
    primaryDark: "#0284C7",
    background: "#F9FAFB", 
    surface: "#FFFFFF",
    card: "#E2E8F0", 
    text: "#0F172A",
    textSecondary: "#475569",
    muted: "#94A3B8",
    border: "#CBD5E1",
    shadow: "rgba(15, 23, 42, 0.08)",
    success: "#22C55E",
    error: "#EF4444",
    switchTrackOn: "#3B82F6",
    switchTrackOff: "#94A3B8",
    switchThumb: "#F8FAFC",
  },

  dark: {
    primary: "#38BDF8",
    primaryDark: "#0EA5E9",
    background: "#0B1220", 
    surface: "#111827",
    card: "#1E293B",
    text: "#F1F5F9", 
    textSecondary: "#94A3B8", 
    muted: "#64748B", 
    border: "#1E293B", 
    shadow: "rgba(0, 0, 0, 0.45)",
    success: "#4ADE80",
    error: "#F87171",
    switchTrackOn: "#3B82F6",
    switchTrackOff: "#475569",
    switchThumb: "#1E293B",
  },
} as const;

export type Theme = keyof typeof palette;
export type ThemeColors = (typeof palette)[Theme];