export function calculateDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const latitude1 =
    (lat1 * Math.PI) / 180;

  const latitude2 =
    (lat2 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return EARTH_RADIUS_KM * c;
}