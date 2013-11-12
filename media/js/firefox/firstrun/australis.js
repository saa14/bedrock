;(function($) {
    'use strict';

    var themes = [
        {"category":"Firefox","iconURL":"https://addons.mozilla.org/_files/18066/preview_small.jpg?1241572934","headerURL":"https://addons.mozilla.org/_files/18066/1232849758499.jpg?1241572934","name":"Dark Fox","author":"randomaster","footer":"https://addons.mozilla.org/_files/18066/1232849758500.jpg?1241572934","previewURL":"https://addons.mozilla.org/_files/18066/preview.jpg?1241572934","updateURL":"https://versioncheck.addons.mozilla.org/en-US/themes/update-check/18066","accentcolor":"#000000","header":"https://addons.mozilla.org/_files/18066/1232849758499.jpg?1241572934","version":"1.0","footerURL":"https://addons.mozilla.org/_files/18066/1232849758500.jpg?1241572934","detailURL":"https://addons.mozilla.org/en-US/firefox/addon/dark-fox-18066/","textcolor":"#ffffff","id":"18066","description":"My dark version of the Firefox logo."},
        {"category":"Film and TV","iconURL":"https://addons.mozilla.org/_files/163522/preview_small.jpg?1275686582","headerURL":"https://addons.mozilla.org/_files/163522/iron1.header.png?1275686582","name":"Iron Man... The Transformation","author":"vinaybabu","footer":"https://addons.mozilla.org/_files/163522/iron1.footer.png?1275686582","previewURL":"https://addons.mozilla.org/_files/163522/preview.jpg?1275686582","updateURL":"https://versioncheck.addons.mozilla.org/en-US/themes/update-check/163522","accentcolor":"#cfceba","header":"https://addons.mozilla.org/_files/163522/iron1.header.png?1275686582","version":"1.0","footerURL":"https://addons.mozilla.org/_files/163522/iron1.footer.png?1275686582","detailURL":"https://addons.mozilla.org/en-US/firefox/addon/iron-man-the-transformation/","textcolor":"#a89f9f","id":"163522","description":"The Transformation of Iron Man finally happens!!"},
        {"category":"None","iconURL":"https://addons.mozilla.org/_files/153659/preview_small.jpg?1353407467","headerURL":"https://addons.mozilla.org/_files/153659/twolbs1.jpg?1353407467","name":"Two little birds","author":"Matheus C.","footer":"https://addons.mozilla.org/_files/153659/twolbs2.jpg?1353407467","previewURL":"https://addons.mozilla.org/_files/153659/preview.jpg?1353407467","updateURL":"https://versioncheck.addons.mozilla.org/en-US/themes/update-check/153659","accentcolor":"#0d0d0d","header":"https://addons.mozilla.org/_files/153659/twolbs1.jpg?1353407467","version":"1.0","footerURL":"https://addons.mozilla.org/_files/153659/twolbs2.jpg?1353407467","detailURL":"https://addons.mozilla.org/en-us/firefox/addon/two-litle-birds/","textcolor":"#080808","id":"153659","description":""}
    ];
    var currentThemeUrl = null;

    $('.tour-highlight').on('tour-step', function () {
        Mozilla.UITour.showHighlight(this.dataset.target);
    });

    $('.tour-info').on('tour-step', function () {
        Mozilla.UITour.showInfo(this.dataset.target, this.dataset.title, this.dataset.text);
    });

    $('.tour-url-capture').on('tour-step', function () {
        Mozilla.UITour.startUrlbarCapture(this.dataset.capturetext, this.dataset.captureurl);
    });

    $('.tour-menu').on('tour-step', function () {
        Mozilla.UITour.showMenu(this.dataset.target);
    });

    $('.tour-pin-add').on('tour-step', function () {
        Mozilla.UITour.addPinnedTab();
    });

    $('.tour-cycle-theme').on('mouseover', function() {
        Mozilla.UITour.cycleThemes(themes, 2000, function(theme) {
            currentThemeUrl = theme.detailURL;
        });
    }).on('mouseout', function() {
         Mozilla.UITour.resetTheme();
    }).on('click', function () {
        Mozilla.UITour.resetTheme();
        window.open(currentThemeUrl);
    });

    function updateControls () {
        var $current = $('.ui-tour-list li.current');

        if ($current.hasClass('first')) {
            $('button.prev').attr('disabled', 'disabled');
        } else if ($current.hasClass('last')) {
            $('button.next').attr('disabled', 'disabled');
        } else {
            $('button.step').removeAttr('disabled');
        }
    }

    function onTourStep () {
        Mozilla.UITour.hideHighlight();
        Mozilla.UITour.removePinnedTab();
        $('.ui-tour-list .tour-step').not('.current');
        $('.ui-tour-list li.out').removeClass('out');
        $('.ui-tour-list li.current .step-target').delay(100).trigger('tour-step');
        var step = $('.ui-tour-list li.current').data('step');
        $('.progress-step span').text(step);
        $('.progress-step progress').val(step);
    }

    $('button.step').on('click', function (e) {
        e.preventDefault();
        var step = $(this).hasClass('prev') ? 'prev' : 'next';
        var $current = $('.ui-tour-list li.current');
        var prev = $current.prev();
        var next = $current.next();
        if (step === 'prev') {
            $current.removeClass('current').addClass('out');
            $current.prev().addClass('current');
            updateControls();
        } else if (step === 'next') {
            $current.removeClass('current').addClass('out');
            $current.next().addClass('current');
            updateControls();
        }
    });

    $(document).on('transitionend', '.ui-tour-list li.current', onTourStep);

    $('.tour-init').trigger('tour-step');

    $(document).one('click', function () {
        var $modal_content = $('#firstrun').detach().show();
        Mozilla.Modal.createModal(document.documentElement, $modal_content, { allowScroll: false });

        $('#modal-close').detach().appendTo($('.ui-tour-controls'));

        $('#modal-close').on('click', function () {
            Mozilla.UITour.hideHighlight();
            Mozilla.UITour.removePinnedTab();
        });

        $('button.step').removeAttr('disabled');
        updateControls();

        $('.ui-tour-list li.current').show();

        $('#modal .inner').addClass('fade-in');
        onTourStep();
    });

})(window.jQuery);
