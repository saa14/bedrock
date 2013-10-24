/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {

    // Default marker styles for office spaces
    var markerColor = '#B70900';
    var markerSize = 'large';

    // Mozilla office space geoJson data
    window.mozSpaces = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            properties: {
                id: 'mountain-view',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [-122.082656, 37.387807]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'auckland',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [174.777106, -36.866596]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'beijing',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [116.43405, 39.909901]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'london',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [-0.127544, 51.510371]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'paris',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [2.341338, 48.871875]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'san-francisco',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [-122.389326, 37.789031]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'taipei',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [121.567422, 25.032329]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'tokyo',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [139.727765, 35.665208]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'toronto',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [-79.394025, 43.647523]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'vancouver',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [-123.1091763, 49.2824945]
            }
        }, {
            type: 'Feature',
            properties: {
                id: 'berlin',
                'marker-color': markerColor,
                'marker-size': markerSize
            },
            geometry: {
                type: 'Point',
                coordinates: [13.418735, 52.512408]
            }
        }]
    };
})();
