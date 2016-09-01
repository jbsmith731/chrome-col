var setContainer = 1200,
    setColNumber = 12,
    setGutter    = 24,
    overlayInit = false;

var values = chrome.storage.sync.get('currentValues', function(data) {
  if (data.currentValues) {
    overlayInit = data.currentValues.overlayInit;
    setContainer = data.currentValues.setContainer;
    setGutter = data.currentValues.setGutter;
    setColNumber = data.currentValues.setColNumber;

    $('#turn_up').prop('checked', overlayInit);
    $('#container_width').val(setContainer);
    $('#gutter').val(setGutter);
    $('#columns').val(setColNumber);

    if (data.currentValues.overlayInit) {
        updateValues('check', null);
    }
  }
});

document.getElementById('container_width').addEventListener("keyup", function(){
  var newValue = parseInt(this.value);
  updateValues('container', newValue);
});

document.getElementById('columns').addEventListener("keyup", function(){
  var newValue = parseInt(this.value);
  updateValues('columns', newValue);
});


document.getElementById('gutter').addEventListener("keyup", function(){
  var newValue = parseInt(this.value);
  updateValues('gutter', newValue);
});

document.getElementById('turn_up').addEventListener("change", function(){
  updateValues('check', null);
});


function updateValues(type, amount) {
  // check if the overlay init is checked
  overlayInit = $('#turn_up').is(':checked');

  if (type == 'columns') {
    setColNumber = amount;
  } else if (type == 'gutter') {
    setGutter = amount;
  } else if (type== 'container') {
    setContainer = amount;
  } else if (type == 'check') {

  }

  // sends a message to the current tab with the updated values
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    saveCurrentValues();
    var port = chrome.tabs.connect(tabs[0].id);
    port.postMessage({"tab": tabs[0].id,
                      "overlayInit": overlayInit,
                      "setContainer": setContainer,
                      "setGutter": setGutter,
                      "setColNumber": setColNumber}, function(response) {
                        console.log(response.farewell);
                      });
  });
}

function saveCurrentValues() {
  // Get a value saved in a form.
  var theValue = {
    "overlayInit": overlayInit,
    "setContainer": setContainer,
    "setGutter": setGutter,
    "setColNumber": setColNumber
  };
  // Check that there's some code there.
  if (!theValue) {
    console.log('Error: No value specified');
    return;
  }
  // Save it using the Chrome extension storage API.
  chrome.storage.sync.set({'currentValues': theValue}, function() {
    // Notify that we saved.
    console.log('Settings saved');
  });
}
