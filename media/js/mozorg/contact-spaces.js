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
