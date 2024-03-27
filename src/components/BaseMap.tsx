"use client"

import { createClient } from '@/lib/supabase/client';

import Map, {  GeolocateControl, Source, Layer, useMap} from 'react-map-gl';
import SearchBar from '@/components/SearchBar';
import EventCard from '@/components/EventCard';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useCallback, useEffect } from 'react';
import toGeoJSONHelper from '@/lib/toGeoJSON';

import type {CircleLayer} from 'react-map-gl';
import type {FeatureCollection} from 'geojson';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

function BaseMap() {

  const [viewState, setViewState] = useState({
    longitude: -73.95589136975939,
    latitude:40.81375534914457,
    zoom: 14,
    pitch: 25,
    bearing: 50,
  })

  const [geoJSON, setGeoJSON] = useState<FeatureCollection>({type: 'FeatureCollection', features: []})  
  const layerStyle : CircleLayer  = {
    id: "data",
    source: "geojson",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };
  // Event handler for clicking on the event layer
  // const layerClick = (event) => {
  //   //Centers the map based on where user click
  //   mapRef.current?.flyTo({
  //     center: event.lngLat,
  //     duration: 1000,
  //   });

  // const {current: map} = useMap();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [imageURL, setImageUR] = useState(null);

  const onHover = useCallback(event => {
    const {
      features,
      point: {x, y}
    } = event;
    const hoveredFeature = features && features[0];
    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  const supabase = createClient()

  useEffect(() => {
      const fetchData = async () => {
          const { data: fetchedData, error } = await supabase
              .from('results')
              .select('*');
            // TODO: only show events after now
            // TODO: create a basic ranking based on proximity & PostGIS
          if (error) {
              console.error('Error fetching data:', error);
              return;
          }

          setGeoJSON(toGeoJSONHelper(fetchedData))
      };

      fetchData();
  }, []);

  return (
    <Map 
    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    initialViewState={viewState}
    onMove={(evt) => setViewState(evt.viewState)}
    onMouseMove={onHover}
    mapStyle="mapbox://styles/mapbox/dark-v11"
    // onClick={layerClick} //Add once the interactive element is added
    interactiveLayerIds={['data']}
  >
  < SearchBar />

  <GeolocateControl position="top-right" />
  <Source type="geojson" data={geoJSON}>
        <Layer {...layerStyle} />
      </Source>

    {hoverInfo && (
     <div className="relative max-w-lg rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
      style={{top: `${hoverInfo.y}px`, left: `${hoverInfo.x}px`}}
    >
      < EventCard features={hoverInfo.feature.properties} image_urls={hoverInfo}/> 
      </div>
    )}




  </Map>
  )
}

export default BaseMap
