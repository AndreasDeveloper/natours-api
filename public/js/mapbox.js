/* eslint-disable */

export const displayMap = (locations) => {
    // Setting Access Token
    mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVhc2RldiIsImEiOiJjankxbTltOTIwZGF4M2JsaGR3dWp0ZnU4In0.kQ74cL2Uj7XY8KB9I0FPvw';

    // Setting Up Map
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/andreasdev/cjy1mwd4l0z361cnn4yo75daj',
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 9
    });

    // Bounds object is area that will be displayed on map
    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(loc => {
        // Create Marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add map box marker
        new mapboxgl.Marker({
            element: el, 
            anchor: 'bottom' // anchor of element
        }).setLngLat(loc.coordinates).addTo(map);

        // Add popup
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);

        // Extend map bounds to include the current location
        bounds.extend(loc.coordinates);
    });

    // Executes Zooming and Moving
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
};