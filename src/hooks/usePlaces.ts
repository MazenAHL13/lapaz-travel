import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase/config";

export type Place = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  schedule?: string;
  zone: string;
  categoria: string;
  latitude?: number;
  longitude?: number;
  tips?: string[];
  imageUri?: string;
  coverUri?: string;
};

export function usePlaces() {
  const [data, setData] = useState<Place[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "places"), (snapshot) => {
      const places = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setData(places);
      setLoadingPlaces(false);
    });

    return () => unsubscribe();
  }, []);

  return { data, loadingPlaces };
}