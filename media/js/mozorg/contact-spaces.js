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
    var xhr = null;
    var contentCache = [];

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
                // Update current nav item to the active space
                mozMap.updateSpaceNavItem(state.data.id);
                // Show the space based on event state url
                mozMap.showSpace(state.url, state.data.id);
                // TODO - handle community spaces
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
                // bind click events on spaces nav
                mozMap.bindSpacesNav();
                // show the current space info
                mozMap.showSpace();
            } else if (state === 'community') {
                // TODO init community layers.

                // unbind click events on spaces nav
                mozMap.bindSpacesNav();
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
         * Bind click events on spaces navigation menu.
         */
        bindSpacesNav: function () {
            $('#nav-spaces li a').on('click', mozMap.onNavSpacesClick);
        },

        /*
         * Unbind click events on spaces navigation menu.
         */
        unbindSpacesNav: function () {
            $('#nav-spaces li a').off('click', mozMap.onNavSpacesClick);
        },

        /*
         * Update current spaces nav item and then show the space
         */
        onNavSpacesClick: function (e) {
            e.preventDefault();
            var current = $('#nav-spaces li.current');
            var itemId = $(this).parent().data('id');
            // current.removeClass('current');
            // $(this).parent().addClass('current');
            History.pushState({id: itemId}, null, this.href);
        },

        /*
         * Updates the spaces navigation current ite,
         * Param: @id space string identifier
         */
        updateSpaceNavItem: function (id) {
            var current = $('#nav-spaces li.current');
            current.removeClass('current');
            $('#nav-spaces li[data-id="' + id + '"]').addClass('current');
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
        showSpace: function (url, cacheId) {
            var current = $('#nav-spaces li.current');
            // get the current space id and href based on the nav
            var id = current.data('id');
            var url = url || current.attr('href');
            // fire a click event on that space's marker
            map.markerLayer.eachLayer(function (marker) {
                if (marker.feature.properties.id === id) {
                    marker.fireEvent('click');
                }
            });

            // if the content is already cached display it
            if (contentCache.hasOwnProperty(cacheId)) {
                $('#entry-container').html(contentCache[cacheId]);
            } else {
                // request content via ajax
                mozMap.requestContent(id, url);
            }
        },

        /*
         * Requests content for displaying current space information
         * Params: @id space identifier string, @url url to request
         */
        requestContent: function (id, url) {
            //if we're already on the right page do nothing
            if (id === $('section.entry').attr('id')) {
                return;
            }
            //abort previous request if one exists
            if (xhr && xhr.readystate !== 4) {
                xhr.abort();
            }

            //get the page content
            xhr = $.ajax({
                url: url,
                type: 'get',
                dataType: 'html',
                success: function(data, status, xhr) {
                    // pull out data we need
                    var content = $(data).find('section.entry');
                    var mapId = content.attr('id');
                    // add content to the cache for future retrieval
                    contentCache[mapId] = content;
                    // update content in the page
                    $('#entry-container').html(content);
                }
            });
        }
    };

    //initialize mapbox
    mozMap.init();
})();
