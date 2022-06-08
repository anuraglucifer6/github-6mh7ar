/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// This example creates a 2-pixel-wide red polyline showing the path of
// the first trans-Pacific flight between Oakland, CA, and Brisbane,
// Australia which was made by Charles Kingsford Smith.
import { paths } from './routeEdgeData';
import { stnLoc } from './stationLocationData';

const color = [
  "#ebdc78",
  "#8be04e",
  "#5ad45a",
  "#00b7c7",
  "#0d88e6",
  "#1a53ff",
  "#4421af",
  "#7c1158",
  "#b30000"
];

function getIndex(freq: number) {
  if (freq > 10000) return 8;
  else if (freq > 5000) return 7;
  else if (freq > 2000) return 6;
  else if (freq > 1000) return 5;
  else if (freq > 500) return 4;
  else if (freq > 200) return 3;
  else if (freq > 100) return 2;
  else if (freq > 50) return 1;
  else return 0;
}

function addMarker(
  location: google.maps.LatLngLiteral,
  map: google.maps.Map
) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  new google.maps.Marker({
    position: location,
    icon: {
      url: 'https://drive.google.com/uc?id=1L3qgGaLbgVQ1XEFbcgh-0ft8tsEJJOpg',
      scaledSize: new google.maps.Size(3, 3),
    },
    map: map,
  });
}

const addPath = (
  path: {
    stn1: string;
    stn2: string;
    freq: number;
  },
  map: google.maps.Map
) => {
  const { stn1, stn2, freq } = path;
  const pathCoordinates = [stnLoc[stn1], stnLoc[stn2]];
  if (
    stnLoc[stn1] &&
    stnLoc[stn2] &&
    stnLoc[stn1].lat !== 0 &&
    stnLoc[stn1].lng !== 0 &&
    stnLoc[stn2].lat !== 0 &&
    stnLoc[stn2].lng !== 0
  ) {
    const stnPath = new google.maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: color[getIndex(freq)],
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    stnPath.setMap(map);
  }
};

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 5.3,
      center: { lat: 23, lng: 80 },
      mapTypeId: 'terrain',
    }
  );
  const stations = paths.reduce((acc, path) => {
    acc[path.stn1] = true;
    acc[path.stn2] = true;
    return acc;
  }, {});
  Object.keys(stations).forEach((stn) => addMarker(stnLoc[stn], map))
  paths.forEach((stnPath) => addPath(stnPath, map));
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
