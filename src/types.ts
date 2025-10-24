export type Place = {
  id?: string;
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