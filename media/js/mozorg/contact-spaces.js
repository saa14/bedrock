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
    var topPane = null;
    var topLayer = null;

    // Community Layers
    var northAmerica;
    var latinAmerica;
    var europe;
    var asiaSouthPacific;
    var antarctica;
    var africaMiddleEast;
    var hispano;
    var francophone;
    var communityLayers;
    var layers = {};

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
            // initialize community layers
            mozMap.initCommunityLayers();
            // set the initial map state on page load.
            mozMap.setMapState();
            // set initial map content
            mozMap.setInitialContentState();
            // init history.js
            mozMap.bindHistory();
            // bind events on tab navigation
            mozMap.bindTabNavigation();
            // split the label layer for more control
            mozMap.splitLabelLayer();
        },

        /*
         * Initialize history.js for pushState support
         */
        bindHistory: function () {
            // Bind to statechange event. Note: We are using statechange instead of popstate
            History.Adapter.bind(window,'statechange',function () {
                // Note: We are using History.getState() instead of event.state
                var state = History.getState();
                var current = mozMap.getMapState();

                if (current === 'spaces') {
                    // Update current nav item to the active space
                    mozMap.updateSpaceNavItem(state.data.id);
                    // Show the space based on event state url
                    mozMap.showSpace(state.url, state.data.id);
                } else if (current === 'community') {
                    // TODO - handle community spaces
                }
            });
        },

        /*
         * Bind the main tab navigation for toggling spaces
         * and communities. Only needs to be called once
         */
        bindTabNavigation: function () {
            $('.category-tabs li a').on('click', function (e) {
                e.preventDefault();
                var navId = $(this).parent().data('id');
                var space = $('#nav-spaces li.current a');
                var community = $('#nav-community li.current a');
                var itemId;
                var itemUrl;
                var state;

                // if we're already on the current tab, do nothing
                if (navId === mozMap.getMapState()) {
                    return;
                }

                // Update the current tab class
                $('ul.category-tabs li.current').removeClass('current');
                $(this).parent().addClass('current');

                // get the updated map state
                state = mozMap.getMapState();

                // set update the map state
                mozMap.setMapState();

                // get last current space id and url
                if (state === 'spaces') {
                    itemId = space.parent().data('id');
                    itemUrl = space.attr('href');
                } else if (state === 'community') {
                    itemId = community.parent().data('id');
                    itemUrl = community.attr('href');
                }

                // Update the browser history
                History.pushState({id: itemId }, null, itemUrl);
            });
        },

        setInitialContentState: function () {
            // store initial content data id on page load
            var state = mozMap.getMapState();
            if (state === 'spaces') {
                initContentId = $('#nav-spaces li.current').data('id');
                //show the current space marker
                mozMap.showSpace();
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
                //clear commuity layers
                mozMap.clearCommunityLayers();
                // unbind click events on community nav
                mozMap.unbindCommunityNav();
                // add spaces marker layer.
                mozMap.addSpacesMarkers();
                // bind click events on spaces nav
                mozMap.bindSpacesNav();
                // hide community legend
                mozMap.hideMapLegend();
                // reposition markers above the labels
                mozMap.setLabelLayerIndex(1);
            } else if (state === 'community') {
                // remove spaces markers
                mozMap.removeSpacesMarkers();
                // unbind click events on spaces nav
                mozMap.unbindSpacesNav();
                // bind click events on community nav
                mozMap.bindCommunityNav();
                // hide community legend
                mozMap.showMapLegend();
                // reposition labels above community layer
                mozMap.setLabelLayerIndex(7);
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
            map.setView([37.4, 0], 12);
        },

        /*
         * Removes spaces markers from the map and unbinds events.
         */
        removeSpacesMarkers: function () {
            map.markerLayer.setGeoJSON([]);
            map.markerLayer.off('click', mozMap.onMarkerClick);
            map.markerLayer.off('mouseover', mozMap.openMarkerPopup);
            map.markerLayer.off('mouseout', mozMap.closeMarkerPopup);
            map.setView([37.4, 0], 2);
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
            $('#nav-spaces li a').on('click', mozMap.onSpacesNavClick);
        },

        /*
         * Unbind click events on spaces navigation menu.
         */
        unbindSpacesNav: function () {
            $('#nav-spaces li a').off('click', mozMap.onSpacesNavClick);
        },

        /*
         * Bind events on top level community navigation menu
         */
        bindCommunityNav: function () {
            $('#nav-community li.region > a').on('click', mozMap.onCommunityNavClick);
        },

        /*
         * Unbind events on top level community navigation menu
         */
        unbindCommunityNav: function () {
            $('#nav-community li.region > a').off('click', mozMap.onCommunityNavClick);
        },

        /*
         * Update current spaces nav item and then show the space
         */
        onSpacesNavClick: function (e) {
            e.preventDefault();
            var current = $('#nav-spaces li.current');
            var itemId = $(this).parent().data('id');
            History.pushState({id: itemId}, null, this.href);
        },

        /*
         * Update top level community nav item and show the region layer
         */
        onCommunityNavClick: function (e) {
            e.preventDefault();
            var id = $(this).parent().data('id');
            // TODO push state
            if (layers.hasOwnProperty(id)) {
                mozMap.clearCommunityLayers();
                communityLayers.addLayer(layers[id]);
            }
        },

        /*
         * Clears all community map layers
         */
        clearCommunityLayers: function () {
            communityLayers.clearLayers();
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

            map.panTo(e.layer.getLatLng(), {
                animate: true
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
         * Initializes geo-json community layers ready for drawing
         */
        initCommunityLayers: function () {

            // create each geoJson layer
            northAmerica = L.geoJson(window.mozNorthAmerica, {
                style: mozMap.styleLayer('#5cb6e0')
            });
            latinAmerica = L.geoJson(window.mozLatinAmerica, {
                style: mozMap.styleLayer('#f36261')
            });
            europe = L.geoJson(window.mozEurope, {
                style: mozMap.styleLayer('#7dc879')
            });
            asiaSouthPacific = L.geoJson(window.mozAsiaSouthPacific, {
                style: mozMap.styleLayer('#c883c5')
            });
            antarctica = L.geoJson(window.mozAntarctica, {
                style: mozMap.styleLayer('#a1b2b7')
            });
            africaMiddleEast = L.geoJson(window.mozAfricaMiddleEast, {
                style: mozMap.styleLayer('#eb936e')
            });
            hispano = L.geoJson(window.mozHispano, {
                style: mozMap.styleLayer('white', '#666', 0.1, 5),
                stroke: false
            });
            francophone = L.geoJson(window.mozFrancophone, {
                style: mozMap.styleLayer('white', '#666', 0.1, 5),
                stroke: false
            });

            // create an empty layer group and add it to the map
            communityLayers = new L.FeatureGroup();
            communityLayers.addTo(map);

            // Store a lookup key for each layer object
            layers = {
                'north-america': northAmerica,
                'latin-america': latinAmerica,
                'europe': europe,
                'asia': asiaSouthPacific,
                'antarctica': antarctica,
                'africa': africaMiddleEast,
                'hispano': hispano,
                'francophone': francophone
            }

            // make community legend tabbable via keyboard
            $('#map .legend li').attr('tabIndex', 0);
        },

        /*
         * Styles a geo-json community layer
         */
        styleLayer: function (fill, outline, opacity, dash) {
            return {
                fillColor: fill,
                weight: 1,
                opacity: 1,
                color: outline || 'white',
                fillOpacity: opacity || 0.7,
                dashArray: dash || 'none',
                clickable: false
            };
        },

        /*
         * Shows the community map legend and bind click events
         */
        showMapLegend: function () {
            var $legend = $('#map .legend');
            $legend.fadeIn();
            $legend.on('click', 'li', mozMap.onMapLegendClick);
        },

        /*
         * Hides the community map legend and unbind click events
         */
        hideMapLegend: function () {
            var $legend = $('#map .legend');
            $legend.fadeOut();
            $legend.off('click', 'li', mozMap.onMapLegendClick);
        },

        /*
         * Toggles community map regions and calls push state
         */
        onMapLegendClick: function () {
            // TODO - get data-id and do push state.
        },

        /*
         * Split label layer on the map so we can set it's z-index dynamically
         * Hat tip to Alex Barth @ MapBox
         */
        splitLabelLayer: function () {
            topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
            topLayer = L.mapbox.tileLayer('mozilla-webprod.map-f1uagdlz');
            topLayer.on('ready', function() {
                var state = mozMap.getMapState();

                //add the split layers
                topLayer.addTo(map);
                topPane.appendChild(topLayer.getContainer());

                //set the initial z-index state for label layer
                if (state === 'spaces') {
                    topLayer.setZIndex(1);
                } else if (state === 'community') {
                    topLayer.setZIndex(7);
                }
            });
        },

        /*
         * Sets the z-index of the labellayer so we can position country
         * names above community layers or under markers
         */
        setLabelLayerIndex: function (zIndex) {
            var i = parseInt(zIndex, 10);
            if (topLayer) {
                topLayer.setZIndex(i);
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
