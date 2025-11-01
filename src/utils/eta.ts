import type { EtaResult } from "@/src/types";

function pickDrivingSpeedKmh(zona?: string): number {
  const z = (zona ?? "").toLowerCase();
  const veryBusy = ["centro", "san pedro", "miraflores", "sopocachi"];
  const lessBusy = ["zona sur", "calacoto", "achumani", "obrajes", "cota cota"];

  if (veryBusy.some(k => z.includes(k))) return 18;
  if (lessBusy.some(k => z.includes(k))) return 28;
  return 22;
}

function walkingSpeedKmh(): number {
  return 4.5;
}

export function estimateEta(distanceMeters: number, zone?: string): EtaResult {
  const dKm = distanceMeters / 1000;
  const vDrive = pickDrivingSpeedKmh(zone);
  const vWalk = walkingSpeedKmh();

  const drivingSeconds = Math.round((dKm / vDrive) * 3600);
  const walkingSeconds = Math.round((dKm / vWalk) * 3600);

  return { distanceMeters, drivingSeconds, walkingSeconds };
}