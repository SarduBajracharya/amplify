import 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './style.styl';
import * as esri from "esri-leaflet";

function createMap() {
  const coords = [55.68, 13.1];
  
  const map = L.map('map')
  map.setView(coords, 13);

  // L.marker(coords).addTo(map)
  //   .bindPopup('hey hey');
    // .openPopup();
  
  return map;
}

function addLayers(map) {
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  const overlay = esri.featureLayer({
    url: 'https://gis.lomma.se/arcgis/rest/services/oversiktsplan/op_bakgrundskarta/MapServer/0'
  }).addTo(map);

  const markerLayer = L.layerGroup([]);
  map.addLayer(markerLayer);

  return { overlay, markerLayer };
}



function bindPopups(map, overlay, markerLayer) {
  overlay.bindPopup(({ feature } = {}) => {
    if (!feature) {
      return false;
    }
    const tableArr = Object.entries(feature.properties).map(([key, val]) => `${key}: ${val}`).slice(0, 8);
    const tableStr = tableArr.join('<br />');
    return `<h2>${feature.properties.TextString}</h2><h4>Arean är ${Math.round(feature.properties['SHAPE.STArea()'])} enheter.</h4><div>${tableStr}</div>`;
  });

  map.on('contextmenu', ({ latlng = {} }) => {
    // Add a marker with coordinates on right-click
    const marker = L.marker(latlng);
    marker.bindPopup(`<h2>Koordinater (WGS 84)</h2>Long: ${latlng.lng.toFixed(5)}<br /> Lat: ${latlng.lat.toFixed(5)}`)
    markerLayer.clearLayers();
    markerLayer.addLayer(marker);
    marker.openPopup();
  });
}

function main() {
  const map = createMap()
  const { overlay, markerLayer } = addLayers(map);
  bindPopups(map, overlay, markerLayer);
}

main();