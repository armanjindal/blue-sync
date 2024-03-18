/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Add supabase typing here so no need to :any

import type {FeatureCollection} from 'geojson';

/**
 * Converts an array of entries with dynamic keys into a GeoJSON FeatureCollection.
 * Filters out entries without latitude and longitude.
 * @param {Array} entries - The array of entries to convert from supabase results table.
 * @returns {FeatureCollection} A GeoJSON FeatureCollection.
 */

function toGeoJSONHelper(entries: any) :FeatureCollection {
    const features = entries
        .filter(entry => entry.latitude && entry.longitude) // Filter out invalid entries
        .map(entry => {
            const { latitude, longitude, ...properties } = entry;
            
            return {
                type: 'Feature',
                properties,
                geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
            };
        });

    const obj : FeatureCollection =  {
        type: 'FeatureCollection',
        features: features
    };
    return obj
}

export default toGeoJSONHelper