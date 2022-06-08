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
  '#00ffff',
  '#00bfff',
  '#009fff',
  '#0080ff',
  '#0060ff',
  '#0040ff',
  '#0020ff',
  '#0010d9',
  '#0000b3',
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
};

const addPath = (path: {
  stn1: string;
  stn2: string;
  freq: number;
}, map: google.maps.Map) => {
  const pathCoordinates = [stnLoc[stn1], stnLoc[stn2]];
  const stnPath = new google.maps.Polyline({
    path: pathCoordinates,
    geodesic: true,
    strokeColor: color[getIndex(freq)],
    strokeOpacity: 1.0,
    strokeWeight: (getIndex(freq) + 1),
  });
  stnPath.setMap(map);
}

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 5.3,
      center: { lat: 23, lng: 80 },
      mapTypeId: 'terrain',
    }
  );
  paths.forEach((stnPath) => addPath(stnPath, map));
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
