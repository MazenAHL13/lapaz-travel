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
  createdBy?: string;
};


export type EtaResult = {
  distanceMeters: number;
  drivingSeconds: number;
  walkingSeconds: number;
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};
