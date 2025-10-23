import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/src/services/firebase/config";

export type Place = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  schedule?: string;
  zona?: string;
  categoria?: string;
  latitude?: number;
  longitude?: number;
  tips?: string[];
  imageUri?: string; // del JSON original
  coverUri?: string; // Cloudinary (cuando se agregue)
};

export function usePlaces() {
  const [data, setData] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "places"), (snapshot) => {
      const places = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setData(places);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { data, loading };
}