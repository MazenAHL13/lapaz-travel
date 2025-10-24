import polyline from "@mapbox/polyline";

export type LatLng = { latitude: number; longitude: number };

export async function getRoute(
  origin: LatLng,
  destination: LatLng
): Promise<LatLng[]> {
  try {
    const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!API_KEY) throw new Error("Falta la API key");

    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Directions error:", data.status, data.error_message);
      return [];
    }

    const points = data.routes[0].overview_polyline.points;
    const coordinates = polyline.decode(points).map(([lat, lng]) => ({
      latitude: lat,
      longitude: lng,
    }));

    return coordinates;
  } catch (error) {
    console.error("Error al obtener ruta:", error);
    return [];
  }
}