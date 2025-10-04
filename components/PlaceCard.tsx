import { View, Text, Image, StyleSheet, Pressable } from "react-native";

type PlaceCardProps = {
  title: string;
  subtitle?: string;
  imageUri: string;
  onPress?: () => void;
};

export default function PlaceCard({ title, subtitle, imageUri, onPress }: PlaceCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});