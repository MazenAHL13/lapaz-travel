export type Place = {
  zona: string | undefined;
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  schedule?: string;
  categoria: string;
  latitude?: number;
  longitude?: number;
  tips?: string[];
  imageUri?: string;
  coverUri?: string;
};