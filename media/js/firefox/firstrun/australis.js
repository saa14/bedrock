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

    function onTourStep (e) {
        if (e.originalEvent.propertyName == 'transform') {
            var step = $('.ui-tour-list li.current').data('step');
            Mozilla.UITour.hideInfo();
            Mozilla.UITour.hideHighlight();
            // Mozilla.UITour.removePinnedTab();
            $('.ui-tour-list li.current .step-target').delay(100).trigger('tour-step');
            $('.progress-step span').text(step);
            $('.progress-step progress').val(step);

            // hide menu panel when not needed as it's now sticky.
            if (!$('.ui-tour-list li.current').hasClass('app-menu')) {
                Mozilla.UITour.hideMenu('appmenu');
            }
        }
    }

    $('button.step').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('up')) {
            return;
        }
        var step = $(this).hasClass('prev') ? 'prev' : 'next';
        var $current = $('.ui-tour-list li.current');
        var prev = $current.prev();
        var next = $current.next();
        var width = $current.width();
        if (step === 'prev') {
            $current.removeClass('current next-out').addClass('prev-out');
            $current.prev().addClass('current');
        } else if (step === 'next') {
            $current.removeClass('current prev-out').addClass('next-out');
            $current.next().addClass('current');
        }
        updateControls();
    });

    $('button.up').on('click', function (e) {
        e.preventDefault();
        startTour();
    })

    function goToStep(step) {
        $('.ui-tour-list .tour-step.current').removeClass('current');
        $('.ui-tour-list .tour-step[data-step="' + step + '"]').addClass('current');
        $('.ui-tour-list .tour-step:gt(' + step + ')').addClass('prev-out');
        $('.ui-tour-list .tour-step:lt(' + step + ')').addClass('next-out');
        updateControls();
    }

    $(document).on('transitionend', '.ui-tour-list li.current', onTourStep);

    $('.tour-init').trigger('tour-step');

    var $stickyFooter = $('.tour-sticky-footer').detach();
    var tourIsVisible = false;

    function compactTour() {
        Mozilla.UITour.hideHighlight();
        Mozilla.UITour.hideMenu('appmenu');
        // Mozilla.UITour.removePinnedTab();
        //$('.ui-tour-controls').addClass('compact');
        $('#firstrun').removeClass('in').addClass('compact');
        $('.ui-tour-list .tour-step.current .tour-content').hide();
        $('.ui-tour-list .tour-step.current .tour-video').fadeOut();
        $('.ui-tour-controls .prev').fadeOut();
        $('.ui-tour-controls .close').fadeOut();
        $('.ui-tour-controls .next').addClass('up');
        $('button.up').one('click', expandTour);
        $('#modal').fadeOut('slow', function () {
            $('body').removeClass('noscroll');
            tourIsVisible = false;
        });
    }

    function expandTour() {
        window.scrollTo(0,0);
        $('#firstrun').removeClass('compact').addClass('in');
        $('.ui-tour-list .tour-step.current .tour-content').show();
        $('.ui-tour-list .tour-step.current .tour-video').fadeIn();
        $('.ui-tour-controls .prev').fadeIn();
        $('.ui-tour-controls .close').fadeIn();
        $('.ui-tour-controls .up').removeClass('up');
        $('button.close').one('click', compactTour);
        $('#modal').fadeIn('slow', function () {
            $('body').addClass('noscroll');
            tourIsVisible = true;
        });
    }

    var $tour = $('#firstrun').detach();
    var $modal = $('#modal').detach().show();

    function startTour() {

        window.scrollTo(0,0);
        tourIsVisible = true;
        $('body').append($modal).append($tour).addClass('noscroll');

        $('button.close').one('click', compactTour);

        $('button.step').removeAttr('disabled');
        updateControls();

        $('#modal').fadeIn('fast', function () {
            $tour.addClass('in');
            tourIsVisible = true;
        });

        Mozilla.UITour.hideInfo();
        $('.ui-tour-list li.current .step-target').trigger('tour-step');
    }

    $('#main-content').on('click', startTour);

    $(document).on('visibilitychange', function () {
        if (document.hidden) {
            Mozilla.UITour.hideHighlight();
            Mozilla.UITour.hideInfo();
            Mozilla.UITour.hideMenu('appmenu');
        } else  {
            if (tourIsVisible) {
                var step = $('.ui-tour-list li.current').data('step');
                $('.ui-tour-list li.current .step-target').delay(100).trigger('tour-step');
                $('.progress-step span').text(step);
                $('.progress-step progress').val(step);
            } else {
                $('.tour-init').trigger('tour-step');
            }

        }
    });

})(window.jQuery);
