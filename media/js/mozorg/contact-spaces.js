/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

(function() {
    "use strict";

    function accordion() {
      $('.accordion .submenu').hide();
//      $('.accordion .submenu:first').show().parent().addClass('open'); // open first submenu
      $('.accordion .hasmenu > a').on('click', function(e) {
        e.preventDefault();
        var next = $(this).next();
        if((next.is('.submenu')) && (next.is(':visible'))) {
            next.slideUp().parent().removeClass('open');
        }
        if((next.is('.submenu')) && (!next.is(':visible'))) {
            $('.accordion .submenu:visible').slideUp().parent().removeClass('open');
            next.slideDown().parent().addClass('open');
        }
      });
    }
    // Call it once onload to initialize
    accordion();

})();

(function() {
    "use strict";

    var map = null;

    var mozMap = {
        /*
         * Initialize mapbox and set default control values.
         * This should only be called once on page load.
         */
        init: function () {
            // use mozilla map style layer.
            map = L.mapbox.map('map', 'mozilla-webprod.e91ef8b3');
            // disable map zoom on scroll.
            map.scrollWheelZoom.disable();
            // set the initial map state on page load.
            mozMap.setMapState();
            // init history.js
            mozMap.bindHistory();
        },

        /*
         * Initialize history.js for pushState support
         */
        bindHistory: function () {
            // Bind to statechange event. Note: We are using statechange instead of popstate
            History.Adapter.bind(window,'statechange',function () {
                // Note: We are using History.getState() instead of event.state
                var state = History.getState();
            });
        },

        /*
         * Sets the map state based on the active category tab.
         * Determined using data-id attribute and .current list item.
         */
        setMapState: function () {
            var state = $('ul.category-tabs li.current').data('id');

            if (state === 'spaces') {
                // add spaces marker layer.
                mozMap.addSpacesMarkers();
                mozMap.showCurrentSpace();
            } else if (state === 'community') {
                // TODO init community layers.
            }
        },

        /*
         * Creates a marker layer for office spaces and binds events.
         * Sets an initial panned out view of the world map.
         */
        addSpacesMarkers: function () {
            map.markerLayer.setGeoJSON(window.mozSpaces);
            map.markerLayer.on('click', mozMap.onMarkerClick);
            map.setView([37.4, 0], 2);
        },

        /*
         * Removes spaces markers from the map and unbinds events.
         */
        removeSpacesMarkers: function () {
            map.markerLayer.setGeoJSON([]);
            map.markerLayer.off('click', mozMap.onMarkerClick);
        },

        /*
         * Focuses map on the marker that fires a click event.
         * Updates page content based on the marker selected.
         */
        onMarkerClick: function (e) {
            // get the marker feature id.
            var id = e.layer.feature.properties.id;
            // pan and zoom the map to center on the marker.
            map.setZoom(12).panTo(e.layer.getLatLng());
            // TODO - show the marker tooltip.
        },

        /*
         * Show the current active space information.
         * Determined using data-id attribute and .current list item.
         */
        showCurrentSpace: function () {
            var current = $('#nav-spaces li.current');
            // get the current space id and href based on the nav
            var id = current.data('id');
            var url = current.attr('href');
            // fire a click event on that space's marker
            map.markerLayer.eachLayer(function (marker) {
                if (marker.feature.properties.id === id) {
                    marker.fireEvent('click');
                }
            });

            // request space content
            mozMap.getContent(id, url);
        },

        /*
         * Requests content for displaying current space information
         * Params: @id space identifier string, @url url to request
         */
        getContent: function (id, url) {

        }
    };

    //initialize mapbox
    mozMap.init();

})();
