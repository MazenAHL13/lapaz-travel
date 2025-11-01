import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { haversineMeters } from "@/src/utils/distance";
import { estimateEta} from "@/src/utils/eta";
import { EtaResult } from "@/src/types";


type Target = {
  latitude: number;
  longitude: number;
  zona?: string | null;
};

export function useDistanceEta(target: Target | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [eta, setEta] = useState<EtaResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      setDistanceMeters(null);
      setEta(null);

      if (!target) {
        setLoading(false);
        return;
      }

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (!cancelled) setError("Permiso de ubicación denegado.");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (cancelled) return;

        const origin = { lat: loc.coords.latitude, lng: loc.coords.longitude };
        const d = haversineMeters(origin, {
          lat: target.latitude,
          lng: target.longitude,
        });

        if (cancelled) return;

        setDistanceMeters(d);
        setEta(estimateEta(d, target.zona ?? undefined));
      } catch {
        if (!cancelled) setError("No se pudo obtener la ubicación.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [target?.latitude, target?.longitude, target?.zona]);

  return { loading, error, distanceMeters, eta };
}