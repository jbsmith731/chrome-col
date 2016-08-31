(function($) {

  // removes overlay when updating
  $.fn.removeColumnOverlay = function() {
    if(document.getElementById('column-overlay')) {
      document.getElementById('column-overlay').remove();
    }
  }

  // Helper to set multiple attributes
  function setAttributes(el, options) {
     Object.keys(options).forEach(function(attr) {
       el.setAttribute(attr, options[attr]);
     })
  }

  $.fn.columnOverlay = function(options) {

    var settings = $.extend({
        containerWidth: 1200,
        colNumber: 12,
        gutter: 30,
        color: 'rgba(255,0,0,0.2)'
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

    // Create the row and append to overlay container
    container.appendChild(createRow).setAttribute('id', 'column-overlay-row');
    var overlayRow = document.getElementById('column-overlay-row');

    // Create columns
    for (var i = 1; i <= settings.colNumber; i++) {
      var createCol = document.createElement('div'),
          createBox = document.createElement('div');

      overlayRow.appendChild(createCol);
      setAttributes(createCol, {'id': 'col-' + i, 'class': 'col', 'style': 'width:' + (1 / settings.colNumber) * 100 + '%; padding: 0 ' + settings.gutter / 2 + 'px; box-sizing: border-box;'});

      // Create box element inside of columns
      document.getElementById('col-' + i).appendChild(createBox);
      setAttributes(createBox, {'class': 'box', 'style': 'height: 100%; width: 100%; background-color: rgba(255, 0, 0, 0.2);'});
    }


    // CSS
    // =======================

    // Column-overlay
    colOverlay.style.cssText = "position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 9999";

    // Overlay container
    container.style.cssText = 'height: 100vh; width:' + settings.containerWidth + 'px; margin: 0 auto';

    // Overlay row
    overlayRow.style.cssText = 'display: -webkit-flex; display: flex; flex-direction: row; height:100vh; margin: 0 -' + settings.gutter / 2 + 'px;'
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
