var setContainer = '1200px',
    setColNumber = 12,
    setGutter    = 24,
    overlayInit = false;

document.getElementById('columns').addEventListener("keyup", function(){
  var newValue = this.value;
  updateValues('columns', newValue);
});


document.getElementById('gutter').addEventListener("keyup", function(){
  var newValue = this.value;
  updateValues('columns', newValue);
});

document.getElementById('turn_up').addEventListener("keyup", function(){
  updateValues('check', null);
});


function updateValues(type, amount) {
  // check if the overlay init is checked
  overlayInit = $('#turn_up').is(':checked');

  if (type == 'columns') {
    setColNumber = amount;
  } else if (type == 'gutter') {
    setGutter = amount;
  } else if (type == 'check') {
    if (!overlayInit) {
      return;
    }
  }

  // sends a message to the current tab with the updated values
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
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
