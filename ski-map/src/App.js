import React, { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import skiData from "./data/ski_areas.json";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

export default function App() {
  const [viewState, setViewState] = useState({
    latitude: 39.7392,
    longitude: -104.9903,
    zoom: 10,
  });

  const [selectedSkiArea, setSelectedSkiArea] = useState(null);
  const [savedLat, setSavedLat] = useState(null);
  const [savedLong, setSavedLong] = useState(null);
  const [website, setWebsite] = useState(null);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Map
        {...viewState}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/outdoors-v11?optimize=true"
        onMove={(evt) => setViewState(evt.viewState)}
      >
        {skiData.features
          .filter((skiArea) => {
            const type = skiArea?.properties?.activities[0];
            const status = skiArea?.properties?.status;
            const chairLift =
              skiArea?.properties?.statistics?.lifts?.byType?.chair_lift;
            const type2 = skiArea?.properties?.activities?.[1];
            const country =
              skiArea?.properties?.location?.localized?.en?.country;
            return (
              country === "United States" &&
              (type === "downhill" || type2 === "downhill") &&
              chairLift !== undefined &&
              status === "operating"
            );
          })
          .map((skiArea) => {
            const coordinates = skiArea?.geometry?.coordinates;
            var coors = coordinates?.[0]?.[0];

            if (!coors) {
              coors = coordinates;
            }

            if (
              !coors ||
              isNaN(coors[0]) ||
              isNaN(coors[1]) ||
              coors.length !== 2 ||
              typeof coors !== "object"
            ) {
              return null;
            }

            var website = skiArea?.properties?.websites[0];

            if (website === undefined) {
              website = "";
            }

            const long = Object.entries(coors)[0][1];
            const lat = Object.entries(coors)[1][1];

            return (
              <Marker
                key={skiArea.properties.id}
                latitude={lat}
                longitude={long}
              >
                <div
                  style={{cursor: 'default'}}
                  className="marker-btn"
                  onClick={() => {
                    setSelectedSkiArea(skiArea);
                    setSavedLat(lat);
                    setSavedLong(long);
                    setWebsite(website);
                  }}
                >
                  <img src="/94150.png" alt="Ski Area" style={{ width: '30px', height: '30px' }}/>
                </div>
              </Marker>
            );
          })}

        {selectedSkiArea && savedLat !== null && savedLong !== null && (
          <Popup
            latitude={savedLat}
            longitude={savedLong}
            closeOnClick={false}
            onClose={() => {
              setSelectedSkiArea(null);
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              {selectedSkiArea?.properties?.name}
            </div>
            <div>
            Chair Lifts {" "}
            {selectedSkiArea?.properties?.statistics?.lifts?.byType?.chair_lift?.count}
            </div>
            <a href={website}> {website}</a>
          </Popup>
        )}
      </Map>
    </div>
  );
}
