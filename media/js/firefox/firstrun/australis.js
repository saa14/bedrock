;(function($) {
    'use strict';

    // var themes = [
    //     {"category":"Firefox","iconURL":"https://addons.mozilla.org/_files/18066/preview_small.jpg?1241572934","headerURL":"https://addons.mozilla.org/_files/18066/1232849758499.jpg?1241572934","name":"Dark Fox","author":"randomaster","footer":"https://addons.mozilla.org/_files/18066/1232849758500.jpg?1241572934","previewURL":"https://addons.mozilla.org/_files/18066/preview.jpg?1241572934","updateURL":"https://versioncheck.addons.mozilla.org/en-US/themes/update-check/18066","accentcolor":"#000000","header":"https://addons.mozilla.org/_files/18066/1232849758499.jpg?1241572934","version":"1.0","footerURL":"https://addons.mozilla.org/_files/18066/1232849758500.jpg?1241572934","detailURL":"https://addons.mozilla.org/en-US/firefox/addon/dark-fox-18066/","textcolor":"#ffffff","id":"18066","description":"My dark version of the Firefox logo."},
    //     {"category":"Film and TV","iconURL":"https://addons.mozilla.org/_files/163522/preview_small.jpg?1275686582","headerURL":"https://addons.mozilla.org/_files/163522/iron1.header.png?1275686582","name":"Iron Man... The Transformation","author":"vinaybabu","footer":"https://addons.mozilla.org/_files/163522/iron1.footer.png?1275686582","previewURL":"https://addons.mozilla.org/_files/163522/preview.jpg?1275686582","updateURL":"https://versioncheck.addons.mozilla.org/en-US/themes/update-check/163522","accentcolor":"#cfceba","header":"https://addons.mozilla.org/_files/163522/iron1.header.png?1275686582","version":"1.0","footerURL":"https://addons.mozilla.org/_files/163522/iron1.footer.png?1275686582","detailURL":"https://addons.mozilla.org/en-US/firefox/addon/iron-man-the-transformation/","textcolor":"#a89f9f","id":"163522","description":"The Transformation of Iron Man finally happens!!"},
    //     {"category":"None","iconURL":"https://addons.mozilla.org/_files/153659/preview_small.jpg?1353407467","headerURL":"https://addons.mozilla.org/_files/153659/twolbs1.jpg?1353407467","name":"Two little birds","author":"Matheus C.","footer":"https://addons.mozilla.org/_files/153659/twolbs2.jpg?1353407467","previewURL":"https://addons.mozilla.org/_files/153659/preview.jpg?1353407467","updateURL":"https://versioncheck.addons.mozilla.org/en-US/themes/update-check/153659","accentcolor":"#0d0d0d","header":"https://addons.mozilla.org/_files/153659/twolbs1.jpg?1353407467","version":"1.0","footerURL":"https://addons.mozilla.org/_files/153659/twolbs2.jpg?1353407467","detailURL":"https://addons.mozilla.org/en-us/firefox/addon/two-litle-birds/","textcolor":"#080808","id":"153659","description":""}
    // ];
    // var currentThemeUrl = null;

    // function goNext() {
    //     var $list = $('#featureList');
    //     $list.css('textIndent', (-$list.prop('offsetWidth')) + 'px');
    //     $('#nextButton').hide();
    //     $('#prevButton').show();
    // }

    // function goPrev() {
    //     $('#featureList').css('textIndent', '0px');
    //     $('#nextButton').show();
    //     $('#prevButton').hide();
    // }

    $(document).ready(function() {

        $('.tour-highlight').on('mouseover', function() {
                Mozilla.UITour.showHighlight(this.dataset.target);
            })
            .on('mouseout', function() {
                Mozilla.UITour.hideHighlight();
            });

        // $('.tour-info').on('click', function() {
        //         Mozilla.UITour.showInfo(this.dataset.target,
        //                                 this.dataset.title,
        //                                 this.dataset.text);

        //         if (this.dataset.capturetext) {
        //             Mozilla.UITour.startUrlbarCapture(this.dataset.capturetext,
        //                                               this.dataset.captureurl);
        //         }
        //     });

        // $('.tour-menu').on('click', function() {
        //         Mozilla.UITour.showMenu(this.dataset.target);
        //     });

        // $('#pinIcon').on('click', function() {
        //         Mozilla.UITour.addPinnedTab();
        //     });

        // $('.tour-cyclethemes').on('mouseover', function() {
        //         Mozilla.UITour.cycleThemes(themes, null, function(theme) {
        //             currentThemeUrl = theme.detailURL;
        //         });
        //     })
        //     .on('mouseout', function() {
        //         Mozilla.UITour.resetTheme();
        //     });
        // $("#themeIcon").on('click', function() {
        //         Mozilla.UITour.resetTheme();
        //         window.open(currentThemeUrl);
        //     });

        // $('#closeButton').on('click', Mozilla.Modal.closeModal);
        // $('#nextButton').on('click', goNext);
        // $('#prevButton').on('click', goPrev);

        // var $modal_content = $('#firstrun').detach().show();
        // Mozilla.Modal.createModal(document.documentElement, $modal_content, {});
    });

})(window.jQuery);
