(function($) {

    // removes overlay when updating
    $.fn.removeColumnOverlay = function() {
      $('.column-overlay').remove();
    }

    $.fn.columnOverlay = function(options) {

        var settings = $.extend({
            containerWidth: 1200,
            colNumber: 12,
            gutter: 30,
            color: 'rgba(255,0,0,0.2)',
            containerWidth: '1200px'
        }, options);

        // CREATE ELEMENTS
        // =======================

        // Add overlay markup to HTML
        $('body').prepend(
            '<div class="column-overlay"><div class="container"><div class="column-overlay-row"></div></div></div>'
        );

        // Create colmns
        for (var i = 1; i <= settings.colNumber; i++) {
            $('.column-overlay-row').append(
                $('<div/>', {
                    id: 'overlay-col-' + i,
                    'class': 'col'
                })
            );
        }

        // .box element added inside column to add colored background
        $('.col').append('<div class="box"></div>');


        // TOGGLE OVERLAY
        // =======================
        $('.overlay-toggle').on('click', function(e) {
            e.preventDefault();
            $('.column-overlay').toggleClass('hidden');

            if ($('.column-overlay').hasClass('hidden')) {
                $('.column-overlay').css('display', 'none');
                $('.col').css('height', 0);
            } else {
                $('.column-overlay').css('display', 'block');
                $('.col').css('height', '100vh');
            }
        });


        // CSS
        // =======================
        $('.column-overlay').css({
            'position': 'fixed',
            'top': 0,
            'right': 0,
            'bottom': 0,
            'left': 0,
            'z-index': 9998
        });

        $('.container').css({
            'width': settings.containerWidth,
            'margin': '0 auto'
        })

        $('.column-overlay-row').css({
            'display': '-webkit-flex',
            'display': 'flex',
            '-webkit-box-orient': 'horizontal',
            '-webkit-box-direction': 'normal',
            'flex-direction': 'row',
            'margin': '0 -' + settings.gutter / 2 + 'px'
        });

        $('.col').css({
            'width': 1 / settings.colNumber * 100 + '%',
            'padding': '0 ' + settings.gutter / 2 + 'px',
            'box-sizing': 'border-box'
        });

        $('.box').css({
            'height': '100%',
            'width': '100%',
            'background-color': settings.color
        });

        $('.container , .column-overlay-row, .col').css('height', '100vh');

        // Toggle btn
        $('.overlay-toggle').css({
            'position': 'fixed',
            'top': 0,
            'z-index': 9999
        });

    }

}(jQuery));

// ** Listen for updates **

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        console.log(msg);

        if (msg.overlayInit) {
            // remove columns then add updated values
            $('body').removeColumnOverlay();
            $('body').columnOverlay({
                containerWidth: msg.setContainer,
                colNumber: msg.setColNumber,
                gutter: msg.setGutter
            });
        }
    });
});
