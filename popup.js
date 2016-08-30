console.log('popup.js loaded')




var setContainer = '1200px',
    setColNumber = 12,
    setGutter    = 24;

document.getElementById('columns').addEventListener("change", function(){
  setColNumber =  this.value
});





chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {overlayInit: 'true', setContainer: setContainer, setGutter: setGutter, setColNumber}, function(response) {
    // console.log(response.farewell);
  });
});
