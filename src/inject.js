//content script
var clickedEl = null;

document.addEventListener("mousedown", function(event){
    if(event.button === 2) {
        clickedEl = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("request: ", request);
    console.log("sender: ", sender);
    console.log("sendRespinse: ", sendResponse);

    sendResponse({value: "inject.js sends response to background.js"});
    document.activeElement.innerHTML = request;

});

