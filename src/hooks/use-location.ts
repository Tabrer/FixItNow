
"use client";

import { useMemo } from 'react';

// A mock database of zip codes to locations
const zipCodeData: Record<string, string> = {
    "10001": "New York, NY",
    "90210": "Beverly Hills, CA",
    "60606": "Chicago, IL",
    "77002": "Houston, TX",
    "85001": "Phoenix, AZ",
    "19102": "Philadelphia, PA",
    "78205": "San Antonio, TX",
    "92101": "San Diego, CA",
    "75201": "Dallas, TX",
    "95101": "San Jose, CA"
};

/**
 * A simple hook to look up a location from a zip code.
 * @param zipCode The 5-digit zip code.
 * @returns An object with the location string (e.g., "New York, NY") or null if not found.
 */
export function useLocation(zipCode?: string) {
    const location = useMemo(() => {
        if (zipCode && zipCodeData[zipCode]) {
            return zipCodeData[zipCode];
        }
        return null;
    }, [zipCode]);

    return { location };
}
