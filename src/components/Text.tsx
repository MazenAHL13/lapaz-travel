import { Text as RNText, TextProps } from "react-native";
import { typography } from "../constants/tokens";
import { useThemeColors } from "../hooks/useThemeColors";
export default function Text({ style, ...props }: TextProps) {
  const { colors } = useThemeColors();
  return (
    <RNText
      style={[
        { color: colors.text, fontSize: typography.base, lineHeight: typography.base * typography.line },
        style,
      ]}
      {...props}
    />
  );
}