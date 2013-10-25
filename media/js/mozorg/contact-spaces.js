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
    var initContentId = null;
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
            // store the initial content id
            mozMap.storeInitialContentId();
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

        storeInitialContentId: function () {
            // store initial content data id on page load
            var state = mozMap.getMapState();
            if (state === 'spaces') {
                initContentId = $('#nav-spaces li.current').data('id');
            } else if (state === 'community') {
                // TODO store initial content id for community map
            }
        },

        /*
         * Get the current map state
         * Return values are either 'spaces' or 'community'
         */
        getMapState: function () {
            return $('ul.category-tabs li.current').data('id');
        },

        /*
         * Sets the map state based on the active category tab.
         * Determined using data-id attribute and .current list item.
         */
        setMapState: function () {
            var state = mozMap.getMapState();

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
            // Add custom popups to each using our custom feature properties
            map.markerLayer.setGeoJSON(window.mozSpaces);
            map.markerLayer.on('click', mozMap.onMarkerClick);
            map.markerLayer.on('mouseover', mozMap.openMarkerPopup);
            map.markerLayer.on('mouseout', mozMap.closeMarkerPopup);
            map.setView([37.4, 0], 4);
        },

        /*
         * Creates a custom marker popup with localized text from template nav
         */
        openMarkerPopup: function (e) {
            var id = e.layer.feature.properties.id;
            var $name = $('#nav-spaces li[data-id="' + id + '"]').text();

            e.layer.bindPopup($name, {
                closeButton: false,
                maxWidth: 300
            });

            e.layer.openPopup();
        },

        /*
         * Closes and unbinds the popup
         */
        closeMarkerPopup: function (e) {
            e.layer.closePopup();
            e.layer.unbindPopup();
        },

        /*
         * Removes spaces markers from the map and unbinds events.
         */
        removeSpacesMarkers: function () {
            map.markerLayer.setGeoJSON([]);
            map.markerLayer.off('click', mozMap.onMarkerClick);
        },

        /*
         * Programatically finds a marker and clicks it
         * Param: @id marker string identifier
         */
        doClickMarker: function (id) {
            map.markerLayer.eachLayer(function (marker) {
                if (marker.feature.properties.id === id) {
                    marker.fireEvent('click');
                }
            });
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
            $('#nav-spaces li.current').removeClass('current');
            if (!id) {
                // if 'id' is undefined then statechange has fired before our first
                // pushState event, so set current item back to the initial content data id.
                $('#nav-spaces li[data-id="' + initContentId + '"]').addClass('current');
            } else {
                $('#nav-spaces li[data-id="' + id + '"]').addClass('current');
            }
        },

        /*
         * Focuses map on the marker and shows a popup tooltip
         */
        onMarkerClick: function (e) {

            var $itemId = $('#nav-spaces li.current').data('id');
            var markerId = e.layer.feature.properties.id;

            if (markerId !== $itemId) {
                var url = $('#nav-spaces li[data-id="' + markerId + '"] a').attr('href');
                History.pushState({id: markerId}, null, url);
                return;
            }

            // // calculate the offset point for showing the popup
            // var point = map.latLngToContainerPoint(e.layer.getLatLng());
            // var offsetPopup = new L.Point(point.x, point.y - 45);
            // var offsetMarker = new L.Point(point.x, point.y - 80);
            // var popupLatLng = map.containerPointToLatLng(offsetPopup);
            // var markerLatLng = map.containerPointToLatLng(offsetMarker);

            // // dynamically set the popup content
            // var $popupTitle = $('section.entry .vcard .fn').text();
            // var $popupAddress = $('section.entry .vcard .adr').html();
            // var address = '<span>' + $popupTitle + '<span><br>' + $popupAddress;

            // // create the popup and show it on the map
            // new L.popup({
            //     maxWidth: 320
            // }).setLatLng(popupLatLng)
            //   .setContent(address)
            //   .openOn(map);

            map.panTo(e.layer.getLatLng(), {
                animate: false
            });
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

            // if the content is already cached display it
            if (contentCache.hasOwnProperty(cacheId)) {
                $('#entry-container').html(contentCache[cacheId]);
                // programatically find the right marker and click it
                mozMap.doClickMarker(id);
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
            //if we're already on the right page just show popup
            if (id === $('section.entry').attr('id')) {
                mozMap.doClickMarker(id);
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
                    // programatically find the right marker and click it
                    mozMap.doClickMarker(id);
                }
            });
        }
    };

    //initialize mapbox
    mozMap.init();
})();
