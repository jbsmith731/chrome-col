var setContainer = 1200,
    setColNumber = 12,
    setGutter    = 24,
    overlayInit = false;

var checkboxInput  = document.getElementById('turn_up'),
    containerInput = document.getElementById('container_width'),
    columnInput    = document.getElementById('columns'),
    gutterInput    = document.getElementById('gutter');

var values = chrome.storage.sync.get('currentValues', function(data) {
  if (data.currentValues) {
    overlayInit  = data.currentValues.overlayInit;
    setContainer = data.currentValues.setContainer;
    setGutter    = data.currentValues.setGutter;
    setColNumber = data.currentValues.setColNumber;

    // $('#turn_up').prop('checked', overlayInit);
    checkboxInput.checked = overlayInit;
    containerInput.value  = setContainer;
    gutterInput.value     = setGutter;
    columnInput.value     = setColNumber;

    updateValues('check', null);
  }
});


function getValues(el, type) {
  el.addEventListener("keyup", function(){
    var newValue = parseInt(this.value);
    updateValues(type, newValue);
  });

  el.addEventListener("input", function(){
    var newValue = parseInt(this.value);
    updateValues(type, newValue);
  });
}



getValues(containerInput, 'container');
getValues(columnInput, 'columns');
getValues(gutterInput, 'gutter');


// columnInput.addEventListener("keyup", function(){
//   var newValue = parseInt(this.value);
//   updateValues('columns', newValue);
// });

// gutterInput.addEventListener("keyup", function(){
//   var newValue = parseInt(this.value);
//   updateValues('gutter', newValue);
// });

checkboxInput.addEventListener("change", function(){
  updateValues('check', null);
});


function updateValues(type, amount) {
  // check if the overlay init is checked
  overlayInit = checkboxInput.checked;


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
    "overlayInit"  : overlayInit,
    "setContainer" : setContainer,
    "setGutter"    : setGutter,
    "setColNumber" : setColNumber
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
