console.log('Hello from client side');

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibXV5aXdhZGV2IiwiYSI6ImNsaHM1OWFqMTJoYm8zZW9kbjd3aWFybnkifQ.pmM2zU8RlfKbFGaq2Y--Ng';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/muyiwadev/clhs5s2w0003g01pn97ur65ci',
  scrollZoom: false,
  /* center:[-118.113491, 34.111745],
    zoom:4,
    interactive:false */
});

const bounds = new mapboxgl.LngLatBounds();
locations.forEach((loc) => {
  //Create marker
  const el = document.createElement('div');
  el.className = 'marker';
  //Add Marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Date  ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  //Extend map bounds to include current loction
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: '200',
    bottom: '150',
    right: '100',
    left: '200',
  },
});
