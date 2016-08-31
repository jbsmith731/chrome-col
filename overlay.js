(function($) {

    // removes overlay when updating
    $.fn.removeColumnOverlay = function() {
      $('#column-overlay').remove();
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

        // Define elements to be created
        var createOverlay   = document.createElement('div'),
            createContainer = document.createElement('div'),
            createRow       = document.createElement('column-overlay-row');

        // Create the column overlay & append to body
        document.body.appendChild(createOverlay).setAttribute('id', 'column-overlay');
        var colOverlay = document.getElementById('column-overlay');

        // Create the overlay container & append to column overlay
        colOverlay.appendChild(createContainer).setAttribute('id', 'overlay-container');
        var container = document.getElementById('overlay-container');

        // create the row and append to overlay container
        container.appendChild(createRow).setAttribute('id', 'column-overlay-row');
        var overlayRow = document.getElementById('column-overlay-row');

        // Create colmns
        for (var i = 1; i <= settings.colNumber; i++) {
            $('#column-overlay-row').append(
                $('<div/>', {
                    id: 'overlay-col-' + i,
                    'class': 'col'
                })
            );
        }

        // .box element added inside column to add colored background
        $('.col').append('<div class="box"></div>');

        var col    = document.getElementsByClassName('col'),
            colBox = document.getElementsByClassName('box');


        // TOGGLE OVERLAY
        // =======================
        // $('.overlay-toggle').on('click', function(e) {
        //     e.preventDefault();
        //     $('#column-overlay').toggleClass('hidden');
        //
        //     if ($('#column-overlay').hasClass('hidden')) {
        //         $('#column-overlay').css('display', 'none');
        //         $('.col').css('height', 0);
        //     } else {
        //         $('#column-overlay').css('display', 'block');
        //         $('.col').css('height', '100vh');
        //     }
        // });


        // CSS
        // =======================

        // Column-overlay
        colOverlay.style.cssText = "position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 9999";

        // Overlay container
        container.style.cssText = 'height: 100vh; width:' + settings.containerWidth + 'px; margin: 0 auto';

        // Overlay row
        overlayRow.style.cssText = 'display: -webkit-flex; display: flex; flex-direction: row; height:100vh; margin: 0 -' + settings.gutter / 2 + 'px;'

        // Individual column
        $('.col').css({
            'width': (1 / settings.colNumber) * 100 + '%',
            'height': '100vh',
            'padding': '0 ' + settings.gutter / 2 + 'px',
            'box-sizing': 'border-box'
        });

        // col.style.cssText = 'width:' + (1 / settings.colNumber) * 100 + '%; padding: 0 ' + settings.gutter / 2 + 'px; box-sizing: border-box;'

        // Red box that makes columns visibile
        $('.box').css({
            'height': '100%',
            'width': '100%',
            'background-color': settings.color
        });
        // colBox.style.cssText = 'height: 100%; width: 100%; background-color: rgba(255, 0, 0, 0.2);';
    }

}(jQuery));

// ** Listen for updates **

chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        console.log(msg);
        $('body').removeColumnOverlay();
        if (msg.overlayInit) {
            // remove columns then add updated values
            $('body').columnOverlay({
                containerWidth: msg.setContainer,
                colNumber: msg.setColNumber,
                gutter: msg.setGutter
            });
        }
    });
});
