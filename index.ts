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
import { stationInfo } from './stationInfo';
import { extraStationInfo } from './extraStationInfo';
import { trainCrossings } from './trainCrossings';

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
  if (freq > 30000) return 8;
  else if (freq > 22000) return 7;
  else if (freq > 16000) return 6;
  else if (freq > 12000) return 5;
  else if (freq > 8000) return 4;
  else if (freq > 3000) return 3;
  else if (freq > 1000) return 2;
  else if (freq > 500) return 1;
  else return 0;
}

function addMarker(
  location: google.maps.LatLngLiteral,
  map: google.maps.Map,
  infoWindow: google.maps.InfoWindow,
  infoString: string,
) {
  // Add the marker at the clicked location, and add the next-available label
  // from the array of alphabetical characters.
  const marker = new google.maps.Marker({
    position: location,
    icon: {
      url: 'https://drive.google.com/uc?id=1L3qgGaLbgVQ1XEFbcgh-0ft8tsEJJOpg',
      scaledSize: new google.maps.Size(5, 5),
      anchor: new google.maps.Point(10,2),
    },
    map: map,
  });

  google.maps.event.addListener(marker, 'mouseover', function(e) {
    infoWindow.setPosition(e.latLng);
    infoWindow.setContent(infoString);
    infoWindow.open(map);
 });
 
 // Close the InfoWindow on mouseout:
 google.maps.event.addListener(marker, 'mouseout', function() {
    infoWindow.close();
 });
}

const addPath = (
  path: {
    stn1: string;
    stn2: string;
    freq: number;
  },
  map: google.maps.Map,
  infoWindow: google.maps.InfoWindow,
  infoString: string,
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
      strokeColor: freq === 0 ? '#F00' : color[getIndex(freq)],
      strokeOpacity: 1.0,
      strokeWeight: 4,
    });
    stnPath.setMap(map);

    google.maps.event.addListener(stnPath, 'mouseover', function(e) {
      infoWindow.setPosition(e.latLng);
      infoWindow.setContent(infoString);
      infoWindow.open(map);
   });
   
   // Close the InfoWindow on mouseout:
   google.maps.event.addListener(stnPath, 'mouseout', function() {
      infoWindow.close();
   });
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

  const infowindow = new google.maps.InfoWindow();
  const stations = paths.reduce((acc, path) => {
    acc[path.stn1] = true;
    acc[path.stn2] = true;
    return acc;
  }, {});
  Object.keys(stations).forEach((stn) => {
    const {name = '', cityName = '', stateName = '' } = stationInfo[stn] || {};
    const { asHalt, asNonHalt } = extraStationInfo[stn] || {};
    const infoString = `<h3>${stn}</h3>${name}<br>${cityName}, ${stateName}<br>Halting : ${asHalt} trains<br>Non Haltiing : ${asNonHalt || 0} trains`;
    addMarker(stnLoc[stn], map, infowindow, infoString);
  })
  paths.forEach((stnPath) => {
    const { stn1, stn2, freq } = stnPath;
    const {name: s1name = '', cityName: s1cityName = '', stateName: s1stateName = '' } = stationInfo[stn1] || {};
    const {name: s2name = '', cityName: s2cityName = '', stateName: s2stateName = '' } = stationInfo[stn2] || {};
    const infoString = `<h3>${stn1} - ${stn2}</h3>${stn1}:<br>${s1name}<br>${s1cityName}, ${s1stateName}<br><br>${stn2}:<br>${s2name}<br>${s2cityName}, ${s2stateName}<br><br>MMT Users Travelled : ${freq}`;
    addPath(stnPath, map, infowindow, infoString);
  });
}

declare global {
  interface Window {
    initMap: () => void;
  }
}
window.initMap = initMap;
export {};
