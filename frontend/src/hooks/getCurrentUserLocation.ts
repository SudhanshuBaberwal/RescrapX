"use client";

import { useState } from "react";

export interface LocationData {
  latitude: number;
  longitude: number;
}

export function useCurrentLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);

  // Return a Promise so caller can `await getLocation()`
  const getLocation = (): Promise<LocationData | null> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        reject(new Error("Geolocation not supported"));
        return;
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          setLocation(coords);
          setLoading(false);
          resolve(coords); // <--- Resolves the promise with data
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
          reject(error); // <--- Rejects on error so catch block in page works
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    });
  };

  return {
    location,
    loading,
    getLocation,
  };
}