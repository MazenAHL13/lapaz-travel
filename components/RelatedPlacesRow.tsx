import { ScrollView, View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useThemeColors } from "../app/hooks/useThemeColors";
import { ThemeColors } from "../app/theme/colors";
import { router } from "expo-router";


export type Place = {
  id: string;
  title: string;
  subtitle?: string;
  imageUri: string;
  zona?: string;
  categoria?: string;
};

type Props = {
  current: Place;
  all: Place[];
  limit?: number;
  title?: string;
};
export default function RelatedPlacesRow({ current, all, limit = 10, title = "Explora lugares relacionados" }: Props) {
  const { colors } = useThemeColors();
  const related = all.filter((place) => place.id !== current.id && (place.zona === current.zona || place.categoria === current.categoria));

  if (related.length === 0) {
    return null;
  }

    return (
        <View style={{ marginTop: 24 }}>
            <Text style={styles(colors).sectionTitle}>{title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                {related.slice(0, limit).map((place) => (
                    <Pressable key={place.id} style={{ marginRight: 12 }} onPress={() => router.push(`/places/${place.id}`)}>
                        <View style={styles(colors).card}>
                            <Image source={{ uri: place.imageUri }} style={styles(colors).image} />
                            <Text style={styles(colors).cardTitle} numberOfLines={1}>{place.title}</Text>
                            {place.subtitle ? <Text style={styles(colors).cardSubtitle} numberOfLines={1}>{place.subtitle}</Text> : null}
                            <View style={styles(colors).pills}>
                                {place.zona ? <Text style={styles(colors).pill}>{place.zona}</Text> : null}
                                {place.categoria ? <Text style={styles(colors).pill}>{place.categoria}</Text> : null}
                            </View>
                        </View>
                    </Pressable>
                ))}
               
            </ScrollView>
        </View>
    );
}

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
    },
    card: {
      width: 180,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 10,
    },
    image: {
      width: "100%",
      height: 110,
      borderRadius: 10,
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    cardSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    pills: {
      flexDirection: "row",
      gap: 6,
      marginTop: 8,
      flexWrap: "wrap",
    },
    pill: {
      fontSize: 11,
      color: colors.primary,
      backgroundColor: colors.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
  });