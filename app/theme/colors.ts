export const palette = {
  light: {
    primary: "#0EA5E9",
    primaryDark: "#0284C7",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    text: "#0F172A",
    textSecondary: "#475569",
    muted: "#94A3B8",
    border: "#E2E8F0",
    shadow: "rgba(15, 23, 42, 0.1)",
    success: "#22C55E",
    error: "#EF4444",
    switchTrackOn: "#3b82f6",
    switchTrackOff: "#94a3b8",
    switchThumb: "#f8fafc",
  },
  dark: {
    primary: "#38BDF8", // Versión más clara del azul para contraste
    primaryDark: "#0EA5E9",
    background: "#0F172A", // Fondo principal (azul oscuro)
    surface: "#1E293B", // Fondo de cards o paneles
    text: "#F1F5F9", // Texto principal blanco-grisáceo
    textSecondary: "#CBD5E1", // Subtítulos y labels
    muted: "#64748B", // Íconos inactivos
    border: "#334155", // Líneas separadoras suaves
    shadow: "rgba(0, 0, 0, 0.5)",
    success: "#4ADE80",
    error: "#F87171",
    switchTrackOn: "#3b82f6",
    switchTrackOff: "#475569",
    switchThumb: "#2d3d57ff",
  },
} as const;

export type Theme = keyof typeof palette;
export type ThemeColors = (typeof palette)[Theme];
