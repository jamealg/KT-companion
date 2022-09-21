// Service worker
// if ('serviceWorker' in navigator) {
//   const x = navigator.serviceWorker.register('/sw.js').then((registration) => {
//     console.log('Service worker registration succeeded:', registration);
//   }, /*catch*/ (error) => {
//     console.error(`Service worker registration failed: ${error}`);
//   });
// }


// Map
var map = L.map('map', {
  attributionControl: false,
  zoomControl: true,
  zoomSnap: 0.1,
});
map.getRenderer(map).options.padding = 100;


// Add locate control
L.control.locate().addTo(map);

// Tiles
L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}.jpg', {
attribution: ''
}).addTo(map);


// Elevation control
var elevation_options = {

  // Default chart colors: theme lime-theme, magenta-theme, ...
  theme: "lightblue-theme",

  // Chart container outside/inside map container
  detached: true,
  height: window.innerHeight * .3,

  // if (detached), the elevation chart container
  elevationDiv: ".elevation-wrapper > div",

  // if (!detached) autohide chart profile on chart mouseleave
  autohide: false,

  // if (!detached) initial state of chart profile control
  collapsed: false,
  
  // if (!detached) control position on one of map corners
  position: "topright",
  
  // Toggle close icon visibility
  closeBtn: false,

  // Autoupdate map center on chart mouseover.
  followMarker: true,

  // Autoupdate map bounds on chart update.
  autofitBounds: true,

  // Chart distance/elevation units.
  imperial: true,

  // [Lat, Long] vs [Long, Lat] points. (leaflet default: [Lat, Long])
  reverseCoords: false,

  // Acceleration chart profile: true || "summary" || "disabled" || false
  acceleration: false,

  // Slope chart profile: true || "summary" || "disabled" || false
  slope: false,

  // Speed chart profile: true || "summary" || "disabled" || false
  speed: false,

  // Altitude chart profile: true || "summary" || "disabled" || false
  altitude: true,

  // Display time info: true || "summary" || false
  time: false,

  // Display distance info: true || "summary" || false
  distance: true,

  // Summary track info style: "inline" || "multiline" || false
  summary: false,

  // Download link: "link" || false || "modal"
  downloadLink: false,

  // Toggle chart ruler filter
  ruler: true,

  // Toggle chart legend filter
  legend: false,

  // Toggle "leaflet-almostover" integration
  almostOver: true,

  // Toggle "leaflet-distance-markers" integration
  distanceMarkers: false,
  
  // Toggle "leaflet-hotline" integration
  hotline: true,

  // Display track datetimes: true || false
  timestamps: false,

  // Display track waypoints: true || "markers" || "dots" || false
  waypoints: true,

  // Toggle custom waypoint icons: true || { associative array of <sym> tags } || false
  wptIcons: {
    '': L.divIcon({
      className: 'elevation-waypoint-marker',
      html: '<i class="elevation-waypoint-icon"></i>',
      iconSize: [30, 30],
      iconAnchor: [8, 30],
    }),
  },

  // Toggle waypoint labels: true || "markers" || "dots" || false
  wptLabels: true,

  // Render chart profiles as Canvas or SVG Paths
  preferCanvas: true,
};

// Instantiate elevation control.
var controlElevation = L.control.elevation(elevation_options).addTo(map);

// Load track from url (allowed data types: "*.geojson", "*.gpx", "*.tcx")
controlElevation.load("/data/knobstone-trail-kt.gpx");

// Double tapping elevation map toggles zoom level
let zoomLevels = [100, 200, 400, 800];
let curZoom = 100;

let $elDiv = document.querySelector('.elevation-wrapper > div');
let $elWrapper = document.querySelector('.elevation-wrapper');
function handleZoomToggle() {
  let i = zoomLevels.indexOf(curZoom);
  curZoom = zoomLevels[(i+1)%zoomLevels.length]
  $elDiv.style.width = `${curZoom}vw`
  // e.target.innerText = `Toggle Elevation (${curZoom}%)`
  controlElevation.redraw();
  if(curZoom !== 100) {
    $elWrapper.classList.add('is-scrollable');
  } else {
    $elWrapper.classList.remove('is-scrollable');
  }
}

let lastTap;
$elWrapper.addEventListener('click', () => {
  let now = new Date().getTime();
  let timesince = now - lastTap;
  if ((timesince < 800) && (timesince > 0)){
     // double tap  
    handleZoomToggle();
  }
  lastTap = new Date().getTime();
});
